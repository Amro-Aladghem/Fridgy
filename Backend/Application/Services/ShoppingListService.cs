using Application.Dtos;
using Domain.Enities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ShoppingListService
    {
        private readonly AppDbContext _context;

        public ShoppingListService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ShoppingListDto> CreateShoppingList(Guid inventoryId, ShoppingListDto dto)
        {
            var shoppingList = new ShoppingList
            {
                InventoryId = inventoryId,
                Title = dto.Title,
                Description = dto.Description,
                DateOfCreation = DateTime.UtcNow
            };

            _context.ShoppingLists.Add(shoppingList);
            await _context.SaveChangesAsync();

            return ToDto(shoppingList);
        }

        public async Task<ShoppingListDto?> GetShoppingListById(Guid inventoryId, Guid id)
        {
            return await _context.ShoppingLists
                .Where(s => s.Id == id && s.InventoryId == inventoryId)
                .Select(s => ToDto(s))
                .FirstOrDefaultAsync();
        }

        public async Task<ShoppingListDto?> GetShoppingListByName(Guid inventoryId, string name)
        {
            return await _context.ShoppingLists
                .Where(s => s.InventoryId == inventoryId && s.Title == name)
                .Select(s => ToDto(s))
                .FirstOrDefaultAsync();
        }

        public async Task<List<ShoppingListDto>> GetShoppingListsForInventory(Guid inventoryId)
        {
            return await _context.ShoppingLists
                .Where(s => s.InventoryId == inventoryId)
                .Select(s => ToDto(s))
                .ToListAsync();
        }

        public async Task<ShoppingListDto?> UpdateShoppingList(Guid inventoryId, Guid shoppingListId, ShoppingListDto dto)
        {
            var shoppingList = await _context.ShoppingLists
                .FirstOrDefaultAsync(s => s.Id == shoppingListId && s.InventoryId == inventoryId);

            if (shoppingList is null)
                return null;

            shoppingList.Title = dto.Title;
            shoppingList.Description = dto.Description;

            await _context.SaveChangesAsync();

            return ToDto(shoppingList);
        }

        public async Task<bool> DeleteShoppingListById(Guid inventoryId, Guid id)
        {
            var shoppingList = await _context.ShoppingLists
                .FirstOrDefaultAsync(s => s.Id == id && s.InventoryId == inventoryId);

            if (shoppingList is null)
                return false;

            var rows = _context.ShoppingListProducts
                .Where(r => r.ShoppingListId == id);

            _context.ShoppingListProducts.RemoveRange(rows);
            _context.ShoppingLists.Remove(shoppingList);
            await _context.SaveChangesAsync();

            return true;
        }

        private static ShoppingListDto ToDto(ShoppingList s)
        {
            return new ShoppingListDto
            {
                Id = s.Id,
                InventoryId = s.InventoryId,
                Title = s.Title,
                Description = s.Description,
                DateOfCreation = s.DateOfCreation
            };
        }
    }
}
