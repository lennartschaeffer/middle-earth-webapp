using MiddleEarthAPI.Models.Domain;

namespace MiddleEarthAPI.Models.DTOs;

public class CharacterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string HomeName { get; set; }
    public string RaceName { get; set; }
    public string ImageSrc { get; set; }
    public string ImageName { get; set; }
    public string Biography { get; set; }
    public WeaponDto Weapon { get; set; }
}