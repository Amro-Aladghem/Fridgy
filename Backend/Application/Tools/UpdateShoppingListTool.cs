using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class UpdateShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListService _shoppingListService;

        public UpdateShoppingListTool(ShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        public string Name => "UpdateShoppingListTool";
        public Type ArgType => typeof(UpdateShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateShoppingListToolArg updateShoppingListToolArg = (UpdateShoppingListToolArg)arg;    

            return await ExecuteTool<ShoppingListDto?>(() => 
            _shoppingListService.UpdateShoppingList(updateShoppingListToolArg.inventoryId, updateShoppingListToolArg.shoppingListId, updateShoppingListToolArg.shoppingListDto));
        }
    }

    public class UpdateShoppingListToolArg()
    {
        public Guid inventoryId { get; set; }
        public Guid shoppingListId { get; set; }
        public ShoppingListDto shoppingListDto { get; set; }
    }
}
