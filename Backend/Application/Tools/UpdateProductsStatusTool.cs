using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class UpdateProductsStatusTool : BaseTool, IAgentTool
    {
        private readonly ProductService _productService;

        public UpdateProductsStatusTool(ProductService productService)
        {
            _productService = productService;
        }

        public string Name => "UpdateProductsStatusTool";

        public Type ArgType => typeof(UpdateProductsStatusToolArg);

        public Task<ToolResponse> ExecuteAsync(object arg)
        {
            UpdateProductsStatusToolArg statusToolArg = (UpdateProductsStatusToolArg)arg;
            return ExecuteTool<bool>(() => _productService.UpdateProductsStatus(statusToolArg.productStatusDtos));
        }
    }

    public class UpdateProductsStatusToolArg()
    {
        public List<ProductStatusDto> productStatusDtos { get; set; }
    }
}
