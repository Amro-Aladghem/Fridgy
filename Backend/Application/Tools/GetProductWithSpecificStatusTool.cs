using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class GetProductWithSpecificStatusTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public GetProductWithSpecificStatusTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "GetProductWithSpecificStatusTool";
        public Type ArgType => typeof(GetProductWithSpecificStatusToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            GetProductWithSpecificStatusToolArg getProductWithSpecificStatusToolArg = (GetProductWithSpecificStatusToolArg)arg;    

            return await ExecuteTool<List<ProductDto>>(() => 
            _productService.GetProductWithSpecificStatus(getProductWithSpecificStatusToolArg.inventoryId, getProductWithSpecificStatusToolArg.productStatusId));
        }
    }

    public class GetProductWithSpecificStatusToolArg()
    {
        public Guid inventoryId { get; set; }
        public int productStatusId { get; set; }
    }
}
