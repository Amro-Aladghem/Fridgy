using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enities
{
    public class Notification
    {
        public Guid Id { get; set; }

        public Guid InventoryId { get; set; }

        public Guid ChatSignture { get; set; }

        public string Text { get; set; } = string.Empty;

        public eNotificationStatus NotficationStatus { get; set; } 
        public eAgentType AgentType { get; set; }
        public string? Data { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Inventory Inventory { get; set; }
    }
}
