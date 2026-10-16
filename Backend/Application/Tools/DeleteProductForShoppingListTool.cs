using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class DeleteProductForShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListProductService _shoppingListProductService;

        public DeleteProductForShoppingListTool(ShoppingListProductService shoppingListProductService)
        {
            _shoppingListProductService = shoppingListProductService;
        }

        public string Name => "DeleteProductForShoppingListTool";
        public Type ArgType => typeof(DeleteProductForShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            DeleteProductForShoppingListToolArg deleteProductForShoppingListToolArg = (DeleteProductForShoppingListToolArg)arg;    

            return await ExecuteTool<bool>(() => 
            _shoppingListProductService.DeleteProductForShoppingList(deleteProductForShoppingListToolArg.listId, deleteProductForShoppingListToolArg.inventoryId, deleteProductForShoppingListToolArg.productId));
        }
    }

    public class DeleteProductForShoppingListToolArg()
    {
        public Guid listId { get; set; }
        public Guid inventoryId { get; set; }
        public Guid productId { get; set; }
    }
}
