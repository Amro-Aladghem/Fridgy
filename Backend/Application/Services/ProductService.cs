using Application.Dtos;
using Domain.Enities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProductDto> AddProduct(Guid inventoryId, ProductDto dto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                InventoryId = inventoryId,
                Name = dto.Name,
                Description = dto.Description,
                Quantity = dto.Quantity,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                ProductStatusId = dto.ProductStatusId,
                ProducedDate = dto.ProducedDate,
                ExpiryDate = dto.ExpiryDate,
                CreationDate = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return ToDto(product);
        }

        public async Task<List<ProductDto>> AddProducts(Guid inventoryId, List<ProductDto> dtos)
        {
            var products = dtos.Select(dto => new Product
            {
                Id = Guid.NewGuid(),
                InventoryId = inventoryId,
                Name = dto.Name,
                Description = dto.Description,
                Quantity = dto.Quantity,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                ProductStatusId = dto.ProductStatusId,
                ProducedDate = dto.ProducedDate,
                ExpiryDate = dto.ExpiryDate,
                CreationDate = DateTime.UtcNow
            }).ToList();

            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();

            return products.Select(ToDto).ToList();
        }

        public async Task<ProductDto?> UpdateProductById(Guid inventoryId, Guid id, ProductDto dto)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.InventoryId == inventoryId && !p.IsDeleted);

            if (product is null)
                return null;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Quantity = dto.Quantity;
            product.Price = dto.Price;
            product.ImageUrl = dto.ImageUrl;
            product.ProductStatusId = dto.ProductStatusId;
            product.ProducedDate = dto.ProducedDate;
            product.ExpiryDate = dto.ExpiryDate;

            await _context.SaveChangesAsync();

            return ToDto(product);
        }

        public async Task<ProductDto?> GetProductById(Guid inventoryId, Guid id)
        {
            return await _context.Products
                .Where(p => p.Id == id && p.InventoryId == inventoryId && !p.IsDeleted)
                .Select(p => ToDto(p))
                .FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteProduct(Guid inventoryId, Guid id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.InventoryId == inventoryId && !p.IsDeleted);

            if (product is null)
                return false;

            product.IsDeleted = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ProductDto>> GetProducts(Guid inventoryId)
        {
            return await _context.Products
                .Where(p => p.InventoryId == inventoryId && !p.IsDeleted)
                .Select(p => ToDto(p))
                .ToListAsync();
        }

        public async Task<List<ProductDto>> GetExpiredProducts(Guid inventoryId)
        {
            int expiredStatusId = (int)eProductStatus.Expired;

            return await _context.Products
                .Where(p => p.InventoryId == inventoryId && !p.IsDeleted
                    && p.ProductStatusId==expiredStatusId)
                .Select(p => ToDto(p))
                .ToListAsync();
        }

        public async Task<List<ProductDto>> GetProductWithSpecificStatus(Guid inventoryId, int productStatusId)
        {
            return await _context.Products
                .Where(p => p.InventoryId == inventoryId && !p.IsDeleted && p.ProductStatusId == productStatusId)
                .Select(p => ToDto(p))
                .ToListAsync();
        }

        public async Task<List<ProductDto>> GetProductsByName(Guid inventoryId, string name)
        {
            return await _context.Products
                .Where(p => p.InventoryId == inventoryId && !p.IsDeleted && p.Name.Contains(name))
                .Select(p => ToDto(p))
                .ToListAsync();
        }

        public async Task<ProductDto?> GetProductByName(Guid inventoryId, string name)
        {
            return await _context.Products
                .Where(p => p.InventoryId == inventoryId && !p.IsDeleted && p.Name == name)
                .Select(p => ToDto(p))
                .FirstOrDefaultAsync();
        }

        private async Task<bool> _UpdateProductImage(SysProductSearchResultDto searchResultDtos)
        {
            int numberOfRowsAffected = await _context.Products.Where(p=>p.Id==searchResultDtos.ProductId)
                .ExecuteUpdateAsync(s=>s.SetProperty(p=>p.ImageUrl,searchResultDtos.ImageUrl));

            return numberOfRowsAffected>0;
        }

        public async Task<bool> UpdateProductsImages(List<SysProductSearchResultDto> searchResultDtos)
        {
            foreach(var searchResult in searchResultDtos)
            {
                await _UpdateProductImage(searchResult);
            }
            return true;
        }

        private async Task _UpdateProductStatus(ProductStatusDto productStatusDto)
        {
            int rowAffected = await _context.Products.Where(p=>p.Id==productStatusDto.ProductId)
                .ExecuteUpdateAsync(s=>s.SetProperty(p=>p.ProductStatusId,productStatusDto.ProductStatusId));
        }

        public async Task<bool> UpdateProductsStatus(List<ProductStatusDto> productsStatusDto)
        {
            foreach (var productStatusDto in productsStatusDto)
            {
                await _UpdateProductStatus(productStatusDto);
            }
            return true;
        }

        private static ProductDto ToDto(Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                InventoryId = p.InventoryId,
                Name = p.Name,
                Description = p.Description,
                Quantity = p.Quantity,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                ProductStatusId = p.ProductStatusId,
                ProducedDate = p.ProducedDate,
                ExpiryDate = p.ExpiryDate,
                CreationDate = p.CreationDate
            };
        }

    }
}
