using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetInventoryByIdTool : BaseTool , IAgentTool
    {
        private readonly InventoryService _inventoryService;

        public GetInventoryByIdTool(InventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        public string Name => "GetInventoryByIdTool";
        public Type ArgType => typeof(GetInventoryByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetInventoryByIdToolArg getInventoryByIdToolArg = (GetInventoryByIdToolArg)arg;    

            return await ExecuteTool<InventoryDto?>(() => 
            _inventoryService.GetInventoryById(getInventoryByIdToolArg.id));
        }
    }

    public class GetInventoryByIdToolArg()
    {
        public Guid id { get; set; }
    }
}
