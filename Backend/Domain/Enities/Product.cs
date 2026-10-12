using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enities
{
    public class Product
    {
        public Guid Id { get; set; }
        public Guid InventoryId { get; set; }
        public string Name { get; set; }   
        public string? Description { get; set; } 
        public int Quantity { get; set; } 
        public decimal? Price { get; set; }  
        public string ? ImageUrl { get; set; }
        public int ProductStatusId { get; set;  }
        public DateTime? ProducedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? CreationDate { get; set; }
        public bool IsDeleted { get; set;  }
        
        public ProductStatus ProductStatus { get; set; }
        public Inventory Inventory { get; set; }
    }
}
