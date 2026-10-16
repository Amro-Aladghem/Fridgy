using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class DeleteAllProductsForShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListProductService _shoppingListProductService;

        public DeleteAllProductsForShoppingListTool(ShoppingListProductService shoppingListProductService)
        {
            _shoppingListProductService = shoppingListProductService;
        }

        public string Name => "DeleteAllProductsForShoppingListTool";
        public Type ArgType => typeof(DeleteAllProductsForShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            DeleteAllProductsForShoppingListToolArg deleteAllProductsForShoppingListToolArg = (DeleteAllProductsForShoppingListToolArg)arg;    

            return await ExecuteTool<bool>(() => 
            _shoppingListProductService.DeleteAllProductsForShoppingList(deleteAllProductsForShoppingListToolArg.listId, deleteAllProductsForShoppingListToolArg.inventoryId));
        }
    }

    public class DeleteAllProductsForShoppingListToolArg()
    {
        public Guid listId { get; set; }
        public Guid inventoryId { get; set; }
    }
}
