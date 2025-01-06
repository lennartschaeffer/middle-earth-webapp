using System.ComponentModel.DataAnnotations.Schema;

namespace MiddleEarthAPI.Models.Domain;

public class Character
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageName { get; set; }
    [NotMapped]
    public IFormFile ImageFile { get; set; }
    [NotMapped]
    public string ImageSrc { get; set; }
    public Guid RaceId { get; set; }
    public Guid HomeId { get; set; }
    public string? Biography { get; set; }
    
    //Navigation Properties
    public Race Race { get; set; }
    public Home Home { get; set; }
    public Weapon Weapon { get; set; }
   
}