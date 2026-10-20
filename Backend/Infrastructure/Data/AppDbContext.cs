using Domain.Enities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
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
                new ChatRole { Id = 1, Name = "InventoryAgent" },
                new ChatRole { Id = 2, Name = "MonitorAgent" },
                new ChatRole { Id = 3, Name = "ShoppingListAgent" },
                new ChatRole { Id = 4, Name = "User" },
                new ChatRole { Id = 5, Name = "Tool" }
            );

            modelBuilder.Entity<Notification>().Property(p => p.NotficationStatus)
                .HasConversion(
                status => status.ToString(),
                status => Enum.Parse<eNotificationStatus>(status)
            );

            modelBuilder.Entity<Notification>().Property(p => p.AgentType)
                .HasConversion(
                agentType => agentType.ToString(),
                agentType => Enum.Parse<eAgentType>(agentType)
            );

            modelBuilder.Entity<Chat>().Property(p => p.AgentType)
                .HasConversion<string>();


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
        public DbSet<ShoppingList> ShoppingLists { get; set; }
        public DbSet<ShoppingListProduct> ShoppingListProducts { get; set; }
        public DbSet<SysProduct> SysProducts { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatRole> ChatRoles { get; set; }
    }
}
