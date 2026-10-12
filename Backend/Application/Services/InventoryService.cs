using Application.Dtos;
using Domain.Enities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class InventoryService
    {
        private readonly AppDbContext _context;

        public InventoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<InventoryDto> CreateInventory(InventoryDto dto)
        {
            var inventory = new Inventory
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Inventories.Add(inventory);
            await _context.SaveChangesAsync();

            return ToDto(inventory);
        }

        public async Task<InventoryDto?> GetInventoryById(Guid id)
        {
            return await _context.Inventories
                .Where(i => i.Id == id)
                .Select(i => ToDto(i))
                .FirstOrDefaultAsync();
        }

        private static InventoryDto ToDto(Inventory i)
        {
            return new InventoryDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description
            };
        }
    }
}
