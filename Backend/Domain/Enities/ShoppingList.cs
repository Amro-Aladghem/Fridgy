using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enities
{
    public class ShoppingList
    {
        public Guid Id { get; set; }
        public Guid InventoryId { get; set; }
        public string? Title { get; set; }    
        public string? Description { get; set; }
        public DateTime DateOfCreation { get; set; }

        public Inventory Inventory { get; set; }
    }
}
