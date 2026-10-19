using Application.Agents;
using Application.Dtos;
using Domain.Enums;
using Infrastructure.AI;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Application.Services.Coordinators
{
    public class AgentChatCoordinator
    {
        private static readonly JsonSerializerOptions DataJsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        private readonly ChatService _chatService;

        public AgentChatCoordinator(ChatService chatService)
        {
            _chatService = chatService;
        }

        private int GetChatRoleIdByIAgentChat(IAgentChat agentChat)
        {
            int roleId = agentChat switch
            {
                InventoryAgentChat => (int)eAgentType.InventoryAgent,
                MonitoringAgent => (int)eAgentType.MonitoringAgent,
                ShoppingListAgent => (int)eAgentType.ShoppingAgent,
                _=> throw new Exception("agent chat parameter is not IAgentChat")
            };

            return roleId;
        }


        public async Task<AgentResponseDto?> GenerateAgentResponse(Guid chatSignture,Guid inventoryId,IAgentChat agentChat)
        {
            try
            {
                List<ChatDto>? chatHistory = await _chatService.GetChatsForChatId(inventoryId, chatSignture);

                string? response = await agentChat.Chat(inventoryId, chatHistory);

                if (response is null)
                    return null;

                var options = new JsonSerializerOptions()
                {
                    PropertyNameCaseInsensitive = false
                };

                AgentResponseDto agentResponseDto =  JsonSerializer.Deserialize<AgentResponseDto>(response, options)!;

                ChatDto chatDto = await _chatService.CreateChat(inventoryId, new ChatDto()
                {
                    Message = response,
                    ChatRoleId = GetChatRoleIdByIAgentChat(agentChat),
                    ChatSignature = chatSignture,
                    InventoryId = inventoryId,
                    CreationTime = DateTime.UtcNow,
                    ShowMessage = agentResponseDto.IsFinished || agentResponseDto.AskUser,
                    Data = agentResponseDto.Products is null ? null : JsonSerializer.Serialize(agentResponseDto.Products, DataJsonOptions),
                    IsFinalResponse = agentResponseDto.IsFinished,
                });

                return agentResponseDto;
            }
            catch
            {
                return null;
            }
        }
    }
}
