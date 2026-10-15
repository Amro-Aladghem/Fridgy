using Application.Dtos;
using Application.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools.Coordinator
{
    public class ProductImageUpdateToolCoordinator : BaseTool, IAgentTool
    {
        private readonly ProductService _productService;
        private readonly SysProductService _sysProductService;

        public ProductImageUpdateToolCoordinator(ProductService productService, SysProductService sysProductService)
        {
            _productService = productService;
            _sysProductService = sysProductService;
        }

        public string Name => "ProductImageUpdateTool";

        public Type ArgType => typeof(ProductImageUpdateToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            ProductImageUpdateToolArg productImageUpdateToolArg = (ProductImageUpdateToolArg)arg;

            List<SysProductSearchResultDto> sysProductSearchResultDtos;

            try
            {
                sysProductSearchResultDtos = await _sysProductService.SearchImagesForProducts(
                    productImageUpdateToolArg.sysProductsSearch
                );
            }
            catch
            {
                return new ToolResponse()
                {
                    Success = false,
                    Message= "The database operation failed. You may retry once only"
                };
            }

            return await ExecuteTool<bool>(() => _productService.UpdateProductsImages(sysProductSearchResultDtos));
        }
    }

    public class ProductImageUpdateToolArg()
    {
        public List<SysProductSearchDto> sysProductsSearch { get; set; }
    }
}
