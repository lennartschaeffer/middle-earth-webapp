namespace MiddleEarthAPI.Models.Domain;

public class Home
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    //list of characters who are from here
    public List<Character> Characters { get; set; }
}