using MiddleEarthAPI.Data;

namespace MiddleEarthAPI.Models.Domain;

public class Weapon
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string WeaponType { get; set; }
    public string Description { get; set; }
    public Guid CharacterId { get; set; }
    public Character Character { get; set; }
}