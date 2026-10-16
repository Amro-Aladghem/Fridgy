using Application.Dtos;
using Domain.Enities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ShoppingListProductService
    {
        private readonly AppDbContext _context;

        public ShoppingListProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductDto>> GetProductsForShoppingList(Guid listId, Guid inventoryId)
        {
            return await _context.ShoppingListProducts
                .Where(r => r.ShoppingListId == listId && r.ShoppingList.InventoryId == inventoryId && !r.Product.IsDeleted)
                .Select(r => ToProductDto(r.Product))
                .ToListAsync();
        }

        public async Task<List<ShoppingListProductDto>> AddProductsForShoppingList(Guid listId, Guid inventoryId, List<Guid> productIds)
        {
            var rows = productIds.Select(productId => new ShoppingListProduct
            {
                Id = Guid.NewGuid(),
                ShoppingListId = listId,
                ProductId = productId
            }).ToList();

            await _context.ShoppingListProducts.AddRangeAsync(rows);
            await _context.SaveChangesAsync();

            return rows.Select(ToDto).ToList();
        }

        public async Task<bool> DeleteProductForShoppingList(Guid listId, Guid inventoryId, Guid productId)
        {
            var row = await _context.ShoppingListProducts
                .FirstOrDefaultAsync(r => r.ShoppingListId == listId && r.ProductId == productId && r.ShoppingList.InventoryId == inventoryId);

            if (row is null)
                return false;

            _context.ShoppingListProducts.Remove(row);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ShoppingListProductDto?> UpdateProductInShoppingList(Guid listId, Guid inventoryId, Guid oldProductId, Guid newProductId)
        {
            var row = await _context.ShoppingListProducts
                .FirstOrDefaultAsync(r => r.ShoppingListId == listId && r.ProductId == oldProductId && r.ShoppingList.InventoryId == inventoryId);

            if (row is null)
                return null;

            row.ProductId = newProductId;
            await _context.SaveChangesAsync();

            return ToDto(row);
        }

        public async Task<bool> DeleteAllProductsForShoppingList(Guid listId, Guid inventoryId)
        {
            var listExists = await _context.ShoppingLists
                .AnyAsync(s => s.Id == listId && s.InventoryId == inventoryId);

            if (!listExists)
                return false;

            var rows = _context.ShoppingListProducts
                .Where(r => r.ShoppingListId == listId);

            _context.ShoppingListProducts.RemoveRange(rows);
            await _context.SaveChangesAsync();

            return true;
        }

        private static ShoppingListProductDto ToDto(ShoppingListProduct r)
        {
            return new ShoppingListProductDto
            {
                ShoppingListId = r.ShoppingListId,
                ProductId = r.ProductId
            };
        }

        private static ProductDto ToProductDto(Product p)
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
