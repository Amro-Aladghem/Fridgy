using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetProductByNameTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public GetProductByNameTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "GetProductByNameTool";
        public Type ArgType => typeof(GetProductByNameToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetProductByNameToolArg getProductByNameToolArg = (GetProductByNameToolArg)arg;    

            return await ExecuteTool<ProductDto?>(() => 
            _productService.GetProductByName(getProductByNameToolArg.inventoryId, getProductByNameToolArg.name));
        }
    }

    public class GetProductByNameToolArg()
    {
        public Guid inventoryId { get; set; }
        public string name { get; set; }
    }
}
