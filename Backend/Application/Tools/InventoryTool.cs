using Application.Dtos;
using Application.Services;
using Infrastructure.AI;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Tools
{
    public class InventoryTool: BaseTool
    {
        private readonly InventoryService _inventoryService;
        private readonly ProductService _productService;
        private readonly ExtractProductsImage _extractProductsImage;

        public InventoryTool(InventoryService inventoryService, ProductService productService, ExtractProductsImage extractProductsImage)
        {
            _inventoryService = inventoryService;
            _productService = productService;   
            _extractProductsImage = extractProductsImage;
        }

        public async Task<ToolResponse> ExecuteCreateInventory(InventoryDto dto)
        {
            return await ExecuteTool<InventoryDto>(()=>_inventoryService.CreateInventory(dto));
        }

        public async Task<ToolResponse> ExecuteGetInventoryById(Guid id)
        {
            return await ExecuteTool<InventoryDto?>(()=>_inventoryService.GetInventoryById(id));
        }

        public async Task<ToolResponse> ExecuteAddProduct(Guid inventoryId, ProductDto dto)
        {
            return await ExecuteTool<ProductDto>(() => _productService.AddProduct(inventoryId, dto));
        }

        public async Task<ToolResponse> ExecuteAddProducts(Guid inventoryId, List<ProductDto> dtos)
        {
            return await ExecuteTool<List<ProductDto>>(()=>_productService.AddProducts(inventoryId, dtos));
        }

        public async Task<ToolResponse> ExecuteUpdateProductById(Guid inventoryId, Guid id, ProductDto dto)
        {
            return await ExecuteTool<ProductDto?>(()=>_productService.UpdateProductById(inventoryId,id,dto));
        }

        public async Task<ToolResponse> ExecuteGetProductById(Guid inventoryId, Guid id)
        {
            return await ExecuteTool<ProductDto?>(()=>_productService.GetProductById(inventoryId,id));
        }

        public async Task<ToolResponse> ExecuteDeleteProduct(Guid inventoryId, Guid id)
        {
            return await ExecuteTool<bool>(() => _productService.DeleteProduct(inventoryId,id));
        }

        public async Task<ToolResponse> ExecuteGetProducts(Guid inventoryId)
        {
            return await ExecuteTool<List<ProductDto>>(()=>_productService.GetProducts(inventoryId)) ;
        }

        public async Task<ToolResponse> ExecuteGetProductWithSpecificStatus(Guid inventoryId, int productStatusId)
        {
            return await ExecuteTool<List<ProductDto>>(() => _productService.GetProductWithSpecificStatus(inventoryId, productStatusId));
        }

        public async Task<ToolResponse> ExecuteGetProductsByName(Guid inventoryId, string name)
        {
            return await ExecuteTool<List<ProductDto>>(() => _productService.GetProductsByName(inventoryId, name));
        }

        public async Task<ToolResponse> ExecuteGetProductByName(Guid inventoryId, string name)
        {
            return await ExecuteTool<ProductDto?>(()=>_productService.GetProductByName(inventoryId, name));
        }

        public async Task<ToolResponse> ExecuteExtractProductsImage(ExtractImageDto extractImageDto)
        {
            try
            {
                var result = _extractProductsImage.ExtractProductsFromImageAsString(extractImageDto.InventoryId,
                    extractImageDto.LanguageName, extractImageDto.ImageUri, extractImageDto.ImageType);

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
}
