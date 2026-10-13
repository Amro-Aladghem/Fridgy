using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class DeleteProductTool : BaseTool , IAgentTool
    {
        private readonly ProductService _productService;

        public DeleteProductTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "DeleteProductTool";
        public Type ArgType => typeof(DeleteProductToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            DeleteProductToolArg deleteProductToolArg = (DeleteProductToolArg)arg;    

            return await ExecuteTool<bool>(() => 
            _productService.DeleteProduct(deleteProductToolArg.inventoryId, deleteProductToolArg.id));
        }
    }

    public class DeleteProductToolArg()
    {
        public Guid inventoryId { get; set; }
        public Guid id { get; set; }
    }
}
