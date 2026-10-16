using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetProductsForShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListProductService _shoppingListProductService;

        public GetProductsForShoppingListTool(ShoppingListProductService shoppingListProductService)
        {
            _shoppingListProductService = shoppingListProductService;
        }

        public string Name => "GetProductsForShoppingListTool";
        public Type ArgType => typeof(GetProductsForShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetProductsForShoppingListToolArg getProductsForShoppingListToolArg = (GetProductsForShoppingListToolArg)arg;    

            return await ExecuteTool<List<ProductDto>>(() => 
            _shoppingListProductService.GetProductsForShoppingList(getProductsForShoppingListToolArg.listId, getProductsForShoppingListToolArg.inventoryId));
        }
    }

    public class GetProductsForShoppingListToolArg()
    {
        public Guid listId { get; set; }
        public Guid inventoryId { get; set; }
    }
}
