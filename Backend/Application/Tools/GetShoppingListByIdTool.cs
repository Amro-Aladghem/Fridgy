using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetShoppingListByIdTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListService _shoppingListService;

        public GetShoppingListByIdTool(ShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        public string Name => "GetShoppingListByIdTool";
        public Type ArgType => typeof(GetShoppingListByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetShoppingListByIdToolArg getShoppingListByIdToolArg = (GetShoppingListByIdToolArg)arg;    

            return await ExecuteTool<ShoppingListDto?>(() => 
            _shoppingListService.GetShoppingListById(getShoppingListByIdToolArg.inventoryId, getShoppingListByIdToolArg.id));
        }
    }

    public class GetShoppingListByIdToolArg()
    {
        public Guid inventoryId { get; set; }
        public Guid id { get; set; }
    }
}
