using Microsoft.EntityFrameworkCore;

namespace XML_IFC_generator.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    // Здесь будут DbSet<T> для моделей
}