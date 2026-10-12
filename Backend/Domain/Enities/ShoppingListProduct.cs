using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Enities
{
    public class ShoppingListProduct
    {
        public Guid Id { get; set; } 
        public Guid ProductId { get; set; }
        public Guid ShoppingListId { get; set; }

        public Product Product { get; set; } = null!;
        public ShoppingList ShoppingList { get; set; } = null!;
    }
}
