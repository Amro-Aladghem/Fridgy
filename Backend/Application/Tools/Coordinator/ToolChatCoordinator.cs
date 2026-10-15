using Application.Dtos;
using Application.Services;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Application.Tools.Coordinator
{
    public class ToolChatCoordinator
    {
        private readonly ToolExecutor _toolExecutor;
        private readonly ChatService _chatService;

        public ToolChatCoordinator(ToolExecutor toolExecutor, ChatService chatService)
        {
            _toolExecutor = toolExecutor;
            _chatService = chatService;
        }


        public async Task<ToolResponse> HandleToolExecuteAndSave(string toolName, JsonElement data,Guid chatSignture,Guid inventoryId)
        {
            ToolResponse toolResponse = await _toolExecutor.HandleExecuteTool(toolName, data);

            ChatDto chatDto = await _chatService.CreateChat(inventoryId, new ChatDto()
            {
                Message = toolResponse.Message,
                ChatRoleId = (int)eChatRole.Tool,
                ChatSignature = chatSignture,
                InventoryId = inventoryId,
                CreationTime = DateTime.UtcNow,
            });

            return toolResponse;
        }

    }
}
