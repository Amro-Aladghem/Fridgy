using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetProductByIdTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public GetProductByIdTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "GetProductByIdTool";
        public Type ArgType => typeof(GetProductByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetProductByIdToolArg getProductByIdToolArg = (GetProductByIdToolArg)arg;    

            return await ExecuteTool<ProductDto?>(() => 
            _productService.GetProductById(getProductByIdToolArg.inventoryId, getProductByIdToolArg.id));
        }
    }

    public class GetProductByIdToolArg()
    {
        public Guid inventoryId { get; set; }
        public Guid id { get; set; }
    }
}
