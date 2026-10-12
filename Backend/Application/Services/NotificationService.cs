using Application.Dtos;
using Domain.Enities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class NotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<NotificationDto> CreateNotification(Guid inventoryId, NotificationDto dto)
        {
            var notification = new Notification
            {
                InventoryId = inventoryId,
                Text = dto.Text,
                NotificationTypeId = dto.NotificationTypeId
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return ToDto(notification);
        }

        public async Task<List<NotificationDto>> GetNotificationsForInventory(Guid inventoryId)
        {
            return await _context.Notifications
                .Where(n => n.InventoryId == inventoryId)
                .Select(n => ToDto(n))
                .ToListAsync();
        }

        public async Task<bool> DeleteNotification(Guid inventoryId, Guid id)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.InventoryId == inventoryId);

            if (notification is null)
                return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<NotificationDto>> GetNotificationWithSpecificStatus(Guid inventoryId, Guid notificationTypeId)
        {
            return await _context.Notifications
                .Where(n => n.InventoryId == inventoryId && n.NotificationTypeId == notificationTypeId)
                .Select(n => ToDto(n))
                .ToListAsync();
        }

        private static NotificationDto ToDto(Notification n)
        {
            return new NotificationDto
            {
                Id = n.Id,
                InventoryId = n.InventoryId,
                Text = n.Text,
                NotificationTypeId = n.NotificationTypeId
            };
        }
    }
}
