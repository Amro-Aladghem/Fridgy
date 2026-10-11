using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FridgyApi.ContextFactory
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<DbContext>
    {
        public DbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
             .SetBasePath(Directory.GetCurrentDirectory())
             .AddJsonFile("appsettings.Development.json")
             .Build();

            var builder = new DbContextOptionsBuilder<DbContext>()
            .UseSqlServer(configuration.GetSection("SQL_CONNECTION_STRING").Value,
            b => b.MigrationsAssembly("FridgyApi"));

            return new DbContext(builder.Options);
        }
    }
}
