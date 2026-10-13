using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetProductsByNameTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public GetProductsByNameTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "GetProductsByNameTool";
        public Type ArgType => typeof(GetProductsByNameToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetProductsByNameToolArg getProductsByNameToolArg = (GetProductsByNameToolArg)arg;    

            return await ExecuteTool<List<ProductDto>>(() => 
            _productService.GetProductsByName(getProductsByNameToolArg.inventoryId, getProductsByNameToolArg.name));
        }
    }

    public class GetProductsByNameToolArg()
    {
        public Guid inventoryId { get; set; }
        public string name { get; set; }
    }
}
