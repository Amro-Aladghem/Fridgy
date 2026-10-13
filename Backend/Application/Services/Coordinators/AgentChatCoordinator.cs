using Application.Dtos;
using Infrastructure.AI;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Application.Services.Coordinators
{
    public class AgentChatCoordinator
    {
        private readonly ChatService _chatService;

        public AgentChatCoordinator(ChatService chatService)
        {
            _chatService = chatService;
        }

        public async Task<AgentResponseDto?> GenerateAgentResponse(Guid chatSignture,Guid inventoryId,IAgentChat agentChat,
            string message,string role)
        {
            try
            {
                List<ChatDto>? chatHistory = await _chatService.GetChatsForChatId(inventoryId, chatSignture);

                string? response = await agentChat.Chat(inventoryId, chatHistory, message, role);

                if (response is null)
                    return null;

                var options = new JsonSerializerOptions()
                {
                    PropertyNameCaseInsensitive = false
                };

                return JsonSerializer.Deserialize<AgentResponseDto>(response, options)!;
            }
            catch
            {
                return null;
            }
        }
    }
}
