namespace MiddleEarthAPI.Models.Domain;

public class Race
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Character> Characters { get; set; }
    public string? BackGroundColour { get; set; }
}