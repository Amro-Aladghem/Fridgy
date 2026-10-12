using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enities
{
    public class Notification
    {
        public Guid Id { get;set;  }
        public Guid InventoryId {  get;set; }
        public string Text { get;set; } 
        public Guid NotificationTypeId { get; set; }

        public NotificationType NotificationType { get; set; }
        public Inventory Inventory { get; set; }
    }
}
