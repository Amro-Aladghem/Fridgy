using Application.Dtos;
using Domain.Enities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ChatService
    {
        private readonly AppDbContext _context;

        public ChatService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChatDto> CreateChat(Guid inventoryId, ChatDto dto)
        {
            var chat = new Chat
            {
                Id = Guid.NewGuid(),
                ChatSignature = dto.ChatSignature,
                InventoryId = inventoryId,
                Name = dto.Name,
                CreationTime = DateTime.UtcNow,
                ImageUrl = dto.ImageUrl,
                ImageType = dto.ImageType,
                ChatRoleId = dto.ChatRoleId,
                Message = dto.Message,
                Data=dto.Data,
                AgentType = string.IsNullOrWhiteSpace(dto.AgentType) ? null : Enum.Parse<eAgentType>(dto.AgentType, true),
                ShowMessage=dto.ShowMessage,
                IsFinished=dto.IsFinalResponse
            };

            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();

            return ToDto(chat);
        }

        public async Task<List<ChatDto>?> GetChatsForChatId(Guid inventoryId, Guid chatSignature)
        {
            List<ChatDto> chats= await _context.Chats
                .Where(c => c.InventoryId == inventoryId && c.ChatSignature == chatSignature)
                .OrderBy(c => c.CreationTime)
                .Select(c => ToDto(c))
                .ToListAsync();

            if (chats.Count == 0)
                return null;

            return chats;
        }

        private static ChatDto ToDto(Chat c)
        {
            return new ChatDto
            {
                ChatSignature = c.ChatSignature,
                InventoryId = c.InventoryId,
                Name = c.Name,
                CreationTime = c.CreationTime,
                ImageUrl = c.ImageUrl,
                ImageType = c.ImageType,
                ChatRoleId = c.ChatRoleId,
                Message = c.Message,
                Data=c.Data,
                AgentType = c.AgentType.HasValue ? c.AgentType.Value.ToString() : null,
                ShowMessage = c.ShowMessage,
                IsFinalResponse = c.IsFinished
            };
        }
    }
}
