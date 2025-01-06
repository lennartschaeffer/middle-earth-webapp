using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiddleEarthAPI.Data;
using MiddleEarthAPI.Models.Domain;
using MiddleEarthAPI.Models.DTOs;

namespace MiddleEarthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly CharacterDbContext _dbContext;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CharactersController(CharacterDbContext dbContext, IWebHostEnvironment environment)
        {
            this._dbContext = dbContext;
            this._webHostEnvironment = environment;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCharacters()
        {
            var characters = await _dbContext.Characters.Include(c => c.Home)
                .Include(c => c.Race)
                .Include(c => c.Weapon)
                .ToListAsync();

            var characterDtos = new List<CharacterDto>();
            
            
            foreach (var character in characters)
            {
                var weaponDto = new WeaponDto()
                {
                    Name = character.Weapon.Name,
                    WeaponType = character.Weapon.WeaponType,
                    WeaponDescription = character.Weapon.Description,
                };
                characterDtos.Add(new CharacterDto()
                {
                    Id = character.Id,
                    Name = character.Name,
                    HomeName = character.Home.Name,
                    RaceName = character.Race.Name,
                   ImageName = character.ImageName,
                    ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{character.ImageName}",
                    Weapon = weaponDto,
                    Biography = character.Biography,
                });
            } 
            return Ok(characterDtos); 
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] AddCharacterDto addCharacterDto)
        {
            var characterExists = await _dbContext.Characters.AnyAsync(c => c.Name == addCharacterDto.Name);
            if (characterExists)
            {
                return BadRequest("Character with name "+addCharacterDto.Name+" already exists");
            }
            var race = await _dbContext.Races.FindAsync(addCharacterDto.RaceId);
            if (race is null)
            {
                return NotFound("Race not found");
            }
            var home = await _dbContext.Homes.FindAsync(addCharacterDto.HomeId);
            if (home is null)
            {
                return NotFound("Home not found");
            }

            var weapon = new Weapon()
            {
                Name = addCharacterDto.Weapon.Name,
                WeaponType = addCharacterDto.Weapon.WeaponType,
                Description = addCharacterDto.Weapon.WeaponDescription
            };
            var characterDomainModel = new Character
            {
                Name = addCharacterDto.Name,
                HomeId = addCharacterDto.HomeId,
                RaceId = addCharacterDto.RaceId,
                Race = race,
                Home = home,
                ImageName = await SaveImage(addCharacterDto.ImageFile),
                ImageFile = addCharacterDto.ImageFile,
                Weapon = weapon
            };
            
            weapon.CharacterId = characterDomainModel.Id;
            weapon.Character = characterDomainModel;
            
            await _dbContext.Characters.AddAsync(characterDomainModel);
            await _dbContext.SaveChangesAsync();
            
            return Ok(await GetAllCharacters());
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetCharacter(Guid id)
        {
            var character = await _dbContext.Characters
                .Include(c => c.Home)
                .Include(c => c.Race)
                .Include(character => character.Weapon)
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (character is null)
            {
                return NotFound("Character not found");
            }
            var weapon = new WeaponDto()
            {
                Name = character.Weapon.Name,
                WeaponType = character.Weapon.WeaponType,
                WeaponDescription = character.Weapon.Description
            };
            var characterDto = new CharacterDto()
            {
                Id = character.Id,
                Name = character.Name,
                HomeName = character.Home.Name,
                RaceName = character.Race.Name,
                Weapon = weapon,
                Biography = character.Biography,
            };
            
            return Ok(characterDto);
        }

        [HttpPut]
        [Route("Biography/{id}")]
        public async Task<IActionResult> UpdateBiography([FromRoute]Guid id, [FromBody] AddCharacterBiographyDto addCharacterBiographyDto)
        {
            var characterDomainModel = await _dbContext.Characters.FindAsync(id);

            if (characterDomainModel is null)
            {
                return NotFound("Character not found");
            }
            
            characterDomainModel.Biography = addCharacterBiographyDto.Biography;

            await _dbContext.SaveChangesAsync();
            
            return Ok(await GetCharacter(id));
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromForm] UpdateCharacterDTO updateCharacterDto)
        {
            var characterDomainModel = await _dbContext.Characters
                .Include(c => c.Weapon)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (characterDomainModel is null)
            {
                return NotFound("Character not found");
            }
            characterDomainModel.Name = updateCharacterDto.Name;
            characterDomainModel.HomeId = updateCharacterDto.HomeId;
            characterDomainModel.RaceId = updateCharacterDto.RaceId;
            characterDomainModel.Weapon.Name = updateCharacterDto.Weapon.Name;
            characterDomainModel.Weapon.WeaponType = updateCharacterDto.Weapon.WeaponType;
            characterDomainModel.Weapon.Description = updateCharacterDto.Weapon.WeaponDescription;

            await _dbContext.SaveChangesAsync();
            
            return Ok(await GetCharacter(id));
        }

        [HttpPut]
        [Route("Image/{id}")]
        public async Task<IActionResult> UpdateCharacterImage([FromRoute] Guid id,
            [FromForm] AddCharacterImageDTO addCharacterImageDto)
        {
            var characterDomainModel = await _dbContext.Characters.FindAsync(id);
            if (characterDomainModel is null)
            {
                return NotFound("Character not found");
            }
            //Image Logic
            DeleteImage(characterDomainModel.ImageName);
            characterDomainModel.ImageName = await SaveImage(addCharacterImageDto.ImageFile);
            
            return Ok(await GetCharacter(id));
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute]Guid id)
        {
            var character = await _dbContext.Characters.FindAsync(id);

            if (character is null)
            {
                return NotFound("Character not found");
            }
            DeleteImage(character.ImageName);
            _dbContext.Characters.Remove(character);
            await _dbContext.SaveChangesAsync();
            
            return Ok(await GetAllCharacters());
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            var imageName =
                new string(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName += DateTime.Now.ToString("yyyymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", imageName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            
            return imageName;
        }

        [NonAction]
        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", imageName);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }

    }
}
