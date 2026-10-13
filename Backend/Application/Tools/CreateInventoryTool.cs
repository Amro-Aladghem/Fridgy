using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class CreateInventoryTool : BaseTool , IAgentTool
    {
        private readonly InventoryService _inventoryService;

        public CreateInventoryTool(InventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        public string Name => "CreateInventoryTool";
        public Type ArgType => typeof(CreateInventoryToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            CreateInventoryToolArg createInventoryToolArg = (CreateInventoryToolArg)arg;    

            return await ExecuteTool<InventoryDto>(() => 
            _inventoryService.CreateInventory(createInventoryToolArg.inventoryDto));
        }
    }

    public class CreateInventoryToolArg()
    {
        public InventoryDto inventoryDto { get; set; }
    }
}
