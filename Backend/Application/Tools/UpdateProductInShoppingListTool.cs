using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class UpdateProductInShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListProductService _shoppingListProductService;

        public UpdateProductInShoppingListTool(ShoppingListProductService shoppingListProductService)
        {
            _shoppingListProductService = shoppingListProductService;
        }

        public string Name => "UpdateProductInShoppingListTool";
        public Type ArgType => typeof(UpdateProductInShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateProductInShoppingListToolArg updateProductInShoppingListToolArg = (UpdateProductInShoppingListToolArg)arg;    

            return await ExecuteTool<ShoppingListProductDto?>(() => 
            _shoppingListProductService.UpdateProductInShoppingList(updateProductInShoppingListToolArg.listId, updateProductInShoppingListToolArg.inventoryId, updateProductInShoppingListToolArg.oldProductId, updateProductInShoppingListToolArg.newProductId));
        }
    }

    public class UpdateProductInShoppingListToolArg()
    {
        public Guid listId { get; set; }
        public Guid inventoryId { get; set; }
        public Guid oldProductId { get; set; }
        public Guid newProductId { get; set; }
    }
}
