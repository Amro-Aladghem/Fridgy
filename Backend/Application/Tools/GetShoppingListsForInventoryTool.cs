using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetShoppingListsForInventoryTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListService _shoppingListService;

        public GetShoppingListsForInventoryTool(ShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        public string Name => "GetShoppingListsForInventoryTool";
        public Type ArgType => typeof(GetShoppingListsForInventoryToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetShoppingListsForInventoryToolArg getShoppingListsForInventoryToolArg = (GetShoppingListsForInventoryToolArg)arg;    

            return await ExecuteTool<List<ShoppingListDto>>(() => 
            _shoppingListService.GetShoppingListsForInventory(getShoppingListsForInventoryToolArg.inventoryId));
        }
    }

    public class GetShoppingListsForInventoryToolArg()
    {
        public Guid inventoryId { get; set; }
    }
}
