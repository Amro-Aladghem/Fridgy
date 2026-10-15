using Application.Dtos;
using Application.Services.Coordinators;
using Application.Tools.Coordinator;
using Infrastructure.AI;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Agents
{
    public abstract class BaseAgent
    {
        private readonly AgentChatCoordinator _agentChatCoordinator;
        private readonly ToolChatCoordinator _toolChatCoordinator;
        private readonly IAgentChat _agentChat;

        private int _aiRetryCount;
        public BaseAgent(AgentChatCoordinator agentChatCoordinator, ToolChatCoordinator toolChatCoordinator,IConfiguration configuration,
            IAgentChat agentChat)
        {
            _agentChatCoordinator = agentChatCoordinator;
            _toolChatCoordinator = toolChatCoordinator;
            _agentChat = agentChat;
            _aiRetryCount = configuration.GetValue<int>("aiRetryCount");
        }

        private async Task<AgentRunResultDto> HandleAgentResponse(AgentResponseDto agentResponseDto, Guid inventoryId, Guid chatSignture)
        {
            AgentRunResultDto agentRunResultDto = new AgentRunResultDto();

            if (agentResponseDto.HasError)
            {
                agentRunResultDto.HasError = true;
                return agentRunResultDto;
            }

            if (agentResponseDto.IsFinished)
            {
                agentRunResultDto.IsFinished = true;
                agentRunResultDto.Message = agentResponseDto.Message;
                return agentRunResultDto;
            }

            if (agentResponseDto.AskUser)
            {
                agentRunResultDto.AskUser = true;
                agentRunResultDto.Message = agentResponseDto.Message;
                return agentRunResultDto;
            }

            if (!string.IsNullOrEmpty(agentResponseDto.ToolName))
            {
                await _toolChatCoordinator.HandleToolExecuteAndSave
                (
                    agentResponseDto.ToolName,
                    agentResponseDto.Data!.Value,
                    inventoryId,
                    chatSignture
                );
            }

            return agentRunResultDto;
        }

        public async Task<AgentRunResultDto> RunAsync(AgentRequestDto agentRequestDto)
        {
            int retries = 0;
            AgentResponseDto? agentResponse = new AgentResponseDto();
            AgentRunResultDto agentRunResultDto = new AgentRunResultDto();

            while (!agentRunResultDto.IsFinished)
            {
                agentResponse = await _agentChatCoordinator.GenerateAgentResponse
                (
                    agentRequestDto.ChatSignture!.Value,
                    agentRequestDto.InventoryId,
                    _agentChat
                );

                if (agentResponse is null)
                {
                    if (retries < _aiRetryCount)
                    {
                        retries++;
                        continue;
                    }

                    agentRunResultDto.HasError = true;
                    return agentRunResultDto;
                }

                retries = 0;

                agentRunResultDto = await HandleAgentResponse
                (
                    agentResponse,
                    agentRequestDto.InventoryId,
                    agentRequestDto.ChatSignture.Value
                );

                if (agentRunResultDto.HasError || agentRunResultDto.AskUser)
                    return agentRunResultDto;
            }

            return agentRunResultDto;
        }

    }
}
