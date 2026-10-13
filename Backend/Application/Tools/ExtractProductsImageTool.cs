using Application.Dtos;
using Application.Services;
using Infrastructure.AI;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class ExtractProductsImageTool : BaseTool , IAgentTool
    {
        private readonly ExtractProductsImage _extractProductsImage;

        public ExtractProductsImageTool(ExtractProductsImage extractProductsImage)
        {
            _extractProductsImage = extractProductsImage;
        }

        public string Name => "ExtractProductsImageTool";
        public Type ArgType => typeof(ExtractProductsImageToolArg);

        public async Task<ToolResponse> ExecuteAsync(object arg)
        {
            ExtractProductsImageToolArg extractProductsImageToolArg = (ExtractProductsImageToolArg)arg;

            try
            {
                var result = await _extractProductsImage.ExtractProductsFromImageAsString(extractProductsImageToolArg.extractImageDto.InventoryId,
                    extractProductsImageToolArg.extractImageDto.LanguageName, extractProductsImageToolArg.extractImageDto.ImageUri, extractProductsImageToolArg.extractImageDto.ImageType);

                if (result is null)
                    throw new Exception("Failed to extract products from image please try once more time only");

                return new ToolResponse()
                {
                    Success = true,
                    Message = "Extracted Products From Image Have Done,These Are the products,you can continue your workflow",
                    Data = result.ToString()
                };
            }
            catch (Exception ex)
            {
                return new ToolResponse()
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }
    }

    public class ExtractProductsImageToolArg()
    {
        public ExtractImageDto extractImageDto { get; set; }
    }
}
