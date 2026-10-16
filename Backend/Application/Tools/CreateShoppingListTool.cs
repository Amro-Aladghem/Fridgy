using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class CreateShoppingListTool : BaseTool , IAgentTool
    {
        private readonly ShoppingListService _shoppingListService;

        public CreateShoppingListTool(ShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        public string Name => "CreateShoppingListTool";
        public Type ArgType => typeof(CreateShoppingListToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateShoppingListToolArg createShoppingListToolArg = (CreateShoppingListToolArg)arg;    

            return await ExecuteTool<ShoppingListDto>(() => 
            _shoppingListService.CreateShoppingList(createShoppingListToolArg.inventoryId, createShoppingListToolArg.shoppingListDto));
        }
    }

    public class CreateShoppingListToolArg()
    {
        public Guid inventoryId { get; set; }
        public ShoppingListDto shoppingListDto { get; set; }
    }
}
