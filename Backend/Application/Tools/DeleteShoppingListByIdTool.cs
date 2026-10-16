using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class DeleteShoppingListByIdTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListService _shoppingListService;

        public DeleteShoppingListByIdTool(ShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        public string Name => "DeleteShoppingListByIdTool";
        public Type ArgType => typeof(DeleteShoppingListByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            DeleteShoppingListByIdToolArg deleteShoppingListByIdToolArg = (DeleteShoppingListByIdToolArg)arg;    

            return await ExecuteTool<bool>(() => 
            _shoppingListService.DeleteShoppingListById(deleteShoppingListByIdToolArg.inventoryId, deleteShoppingListByIdToolArg.id));
        }
    }

    public class DeleteShoppingListByIdToolArg()
    {
        public Guid inventoryId { get; set; }
        public Guid id { get; set; }
    }
}
