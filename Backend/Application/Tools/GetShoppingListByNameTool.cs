using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetShoppingListByNameTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListService _shoppingListService;

        public GetShoppingListByNameTool(ShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        public string Name => "GetShoppingListByNameTool";
        public Type ArgType => typeof(GetShoppingListByNameToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetShoppingListByNameToolArg getShoppingListByNameToolArg = (GetShoppingListByNameToolArg)arg;    

            return await ExecuteTool<ShoppingListDto?>(() => 
            _shoppingListService.GetShoppingListByName(getShoppingListByNameToolArg.inventoryId, getShoppingListByNameToolArg.name));
        }
    }

    public class GetShoppingListByNameToolArg()
    {
        public Guid inventoryId { get; set; }
        public string name { get; set; }
    }
}
