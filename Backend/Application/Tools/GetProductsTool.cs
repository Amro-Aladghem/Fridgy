using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetProductsTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public GetProductsTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "GetProductsTool";
        public Type ArgType => typeof(GetProductsToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetProductsToolArg getProductsToolArg = (GetProductsToolArg)arg;    

            return await ExecuteTool<List<ProductDto>>(() => 
            _productService.GetProducts(getProductsToolArg.inventoryId));
        }
    }

    public class GetProductsToolArg()
    {
        public Guid inventoryId { get; set; }
    }
}
