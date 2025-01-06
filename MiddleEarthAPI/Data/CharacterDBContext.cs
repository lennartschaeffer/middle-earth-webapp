using Microsoft.EntityFrameworkCore;
using MiddleEarthAPI.Models.Domain;

namespace MiddleEarthAPI.Data;

public class CharacterDbContext: DbContext
{
    public CharacterDbContext(DbContextOptions options):base(options)
    {
        
    }
    
    public DbSet<Home> Homes { get; set; }
    public DbSet<Race> Races { get; set; }
    public DbSet<Character> Characters { get; set; }
    
}