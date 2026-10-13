using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class AddProductsTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public AddProductsTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "AddProductsTool";
        public Type ArgType => typeof(AddProductsToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            AddProductsToolArg addProductsToolArg = (AddProductsToolArg)arg;    

            return await ExecuteTool<List<ProductDto>>(() => 
            _productService.AddProducts(addProductsToolArg.inventoryId, addProductsToolArg.productDtos));
        }
    }

    public class AddProductsToolArg()
    {
        public Guid inventoryId { get; set; }
        public List<ProductDto> productDtos { get; set; }
    }
}
