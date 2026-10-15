using Domain.Enities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var foreignKey in modelBuilder.Model
                                           .GetEntityTypes()
                                           .SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<ChatRole>().HasData(
                new ChatRole { Id = 1, Name = "Agent" },
                new ChatRole { Id = 2, Name = "User" },
                new ChatRole { Id = 3, Name = "Tool" }
            );

            modelBuilder.Entity<ProductStatus>().HasData(
                new ProductStatus { Id = 1, Name = "Unknown", },
                new ProductStatus { Id = 2, Name = "Known" },
                new ProductStatus { Id = 3, Name = "Expired" }
            );
        }

        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductStatus> ProductStatuses { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationType> NotificationTypes { get; set; }  
        public DbSet<ShoppingList> ShoppingLists { get; set; }
        public DbSet<ShoppingListProduct> ShoppingListProducts { get; set; }
        public DbSet<SysProduct> SysProducts { get; set; }  
        public DbSet<Chat> Chats { get; set; }  
        public DbSet<ChatRole> ChatRoles { get; set; }
    }
}
