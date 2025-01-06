namespace MiddleEarthAPI.Models.DTOs;

public class UpdateCharacterDTO
{
    public string Name { get; set; }
    public Guid HomeId { get; set; }
    public Guid RaceId { get; set; }
    public WeaponDto Weapon { get; set; }
}