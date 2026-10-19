using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enities
{
    public class Chat
    {
        public Guid Id { get; set; }    
        public Guid ChatSignature { get; set; }
        public string? Name { get; set; }   
        public DateTime CreationTime { get; set; }
        public Guid InventoryId { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageType { get; set; }
        public int ChatRoleId { get; set; }
        public string Message { get; set; }
        public string ?Data{ get; set; }
        public bool ShowMessage { get; set; } = false;

        public bool IsFinished { get; set; } = false;

        public ChatRole ChatRole { get; set; } = null!;
        public Inventory Inventory { get; set; } = null!;
    }
}
