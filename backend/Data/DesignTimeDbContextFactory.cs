using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace XML_IFC_generator.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        
        // Простая строка подключения (временно)
        optionsBuilder.UseNpgsql("Host=localhost;Database=mydb;Username=postgres;Password=0406");
        
        return new AppDbContext(optionsBuilder.Options);
    }
}