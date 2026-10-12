using Application.Dtos;
using Application.Services;
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

        public InventoryTool(InventoryService inventoryService, ProductService productService)
        {
            _inventoryService = inventoryService;
            _productService = productService;   
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
    }
}
