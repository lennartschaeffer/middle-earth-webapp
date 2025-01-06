using MiddleEarthAPI.Models.Domain;

namespace MiddleEarthAPI.Models.DTOs;

public class AddCharacterDto
{
    public string Name { get; set; }
    public Guid HomeId { get; set; }
    public Guid RaceId { get; set; }
    public string ImageName { get; set; }
    public IFormFile ImageFile { get; set; }
    public WeaponDto Weapon { get; set; }
}