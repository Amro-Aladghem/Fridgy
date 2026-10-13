using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.AI
{
    public interface IAgentChat
    {
        Task<string?> Chat(Guid inventoryId, object? messagesContext, string message, string role);
    }
}
