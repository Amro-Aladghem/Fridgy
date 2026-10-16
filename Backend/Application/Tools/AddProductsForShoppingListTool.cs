using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class AddProductsForShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListProductService _shoppingListProductService;

        public AddProductsForShoppingListTool(ShoppingListProductService shoppingListProductService)
        {
            _shoppingListProductService = shoppingListProductService;
        }

        public string Name => "AddProductsForShoppingListTool";
        public Type ArgType => typeof(AddProductsForShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            AddProductsForShoppingListToolArg addProductsForShoppingListToolArg = (AddProductsForShoppingListToolArg)arg;    

            return await ExecuteTool<List<ShoppingListProductDto>>(() => 
            _shoppingListProductService.AddProductsForShoppingList(addProductsForShoppingListToolArg.listId, addProductsForShoppingListToolArg.inventoryId, addProductsForShoppingListToolArg.productIds));
        }
    }

    public class AddProductsForShoppingListToolArg()
    {
        public Guid listId { get; set; }
        public Guid inventoryId { get; set; }
        public List<Guid> productIds { get; set; }
    }
}
