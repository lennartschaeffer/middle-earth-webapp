namespace MiddleEarthAPI.Models.DTOs;

public class HomeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<CharacterDto> Characters { get; set; }
}