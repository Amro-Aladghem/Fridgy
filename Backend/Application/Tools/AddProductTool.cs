using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class AddProductTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public AddProductTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "AddProductTool";
        public Type ArgType => typeof(AddProductToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            AddProductToolArg addProductToolArg = (AddProductToolArg)arg;    

            return await ExecuteTool<ProductDto>(() => 
            _productService.AddProduct(addProductToolArg.inventoryId, addProductToolArg.productDto));
        }
    }

    public class AddProductToolArg()
    {
        public Guid inventoryId { get; set; }
        public ProductDto productDto { get; set; }
    }
}
