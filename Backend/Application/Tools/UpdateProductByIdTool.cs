using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class UpdateProductByIdTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public UpdateProductByIdTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "UpdateProductByIdTool";
        public Type ArgType => typeof(UpdateProductByIdToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateProductByIdToolArg updateProductByIdToolArg = (UpdateProductByIdToolArg)arg;    

            return await ExecuteTool<ProductDto?>(() => 
            _productService.UpdateProductById(updateProductByIdToolArg.inventoryId, updateProductByIdToolArg.id, updateProductByIdToolArg.productDto));
        }
    }

    public class UpdateProductByIdToolArg()
    {
        public Guid inventoryId { get; set; }
        public Guid id { get; set; }
        public ProductDto productDto { get; set; }
    }
}
