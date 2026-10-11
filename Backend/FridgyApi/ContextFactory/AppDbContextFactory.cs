using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FridgyApi.ContextFactory
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
             .SetBasePath(Directory.GetCurrentDirectory())
             .AddJsonFile("appsettings.Development.json")
             .Build();

            var builder = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(configuration.GetSection("SQL_CONNECTION_STRING").Value,
            b => b.MigrationsAssembly("FridgyApi"));

            return new AppDbContext(builder.Options);
        }
    }
}
