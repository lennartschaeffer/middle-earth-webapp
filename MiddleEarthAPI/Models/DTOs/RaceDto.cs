namespace MiddleEarthAPI.Models.DTOs;

public class RaceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string BackgroundColour { get; set; }
    public List<CharacterDto> Characters { get; set; }
}