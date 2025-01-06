namespace MiddleEarthAPI.Models.DTOs;

public class AddCharacterImageDTO
{
    public string ImageName { get; set; }
    public IFormFile ImageFile { get; set; }
}