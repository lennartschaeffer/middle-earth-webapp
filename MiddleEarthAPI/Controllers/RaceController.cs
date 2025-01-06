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
    public class RaceController : ControllerBase
    {
        private readonly CharacterDbContext _dbContext;
        public RaceController(CharacterDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var races = await _dbContext.Races
                .Include(r => r.Characters)
                .ThenInclude(character => character.Weapon)
                .Include(race => race.Characters)
                .ThenInclude(character => character.Home)
                .ToListAsync();

            var racesDto = new List<RaceDto>();

            foreach (var race in races)
            {
                var characterDtosList = new List<CharacterDto>();

                foreach (var character in race.Characters)
                {
                    var weaponDto = new WeaponDto()
                    {
                        Name = character.Weapon.Name,
                        WeaponType = character.Weapon.WeaponType,
                        WeaponDescription = character.Weapon.Description,
                    };
                    characterDtosList.Add(new CharacterDto()
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
                racesDto.Add(new RaceDto()
                {
                    Name = race.Name,
                    Id = race.Id,
                    Characters = characterDtosList,
                    BackgroundColour = race.BackGroundColour ?? "#FFF"
                });
            }
            return Ok(racesDto);
        }
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var race = await _dbContext.Races
                .Include(r => r.Characters)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (race is null)
            {
                return NotFound();
            }

            var raceDto = new RaceDto()
            {
                Name = race.Name,
                BackgroundColour = race.BackGroundColour ?? "#FFF",
                Id = race.Id,
            };
            
            return Ok(raceDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddRaceDto addRaceDto)
        {
            var raceExists = await _dbContext.Races.AnyAsync(r => r.Name == addRaceDto.Name);
            if (raceExists)
            {
                return BadRequest("The Race "+addRaceDto.Name+" already exists!");
            }
            var raceDomainModel = new Race
            {
                Name = addRaceDto.Name,
                BackGroundColour = addRaceDto.BackgroundColor
            };
            await _dbContext.Races.AddAsync(raceDomainModel);
            await _dbContext.SaveChangesAsync();

            var raceDto = new RaceDto
            {
                Name = raceDomainModel.Name,
                Id = raceDomainModel.Id,
                BackgroundColour = raceDomainModel.BackGroundColour
            };

            return Ok(await GetAll());
        }

        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] AddRaceDto addRaceDto)
        {
            var raceDomainModel = await _dbContext.Races.FindAsync(id);
            if (raceDomainModel is null)
            {
                return NotFound("Race not found");
            }
            raceDomainModel.Name = addRaceDto.Name;
            raceDomainModel.BackGroundColour = addRaceDto.BackgroundColor;
            
            await _dbContext.SaveChangesAsync();

            return Ok(await GetById(id));
        }
        
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var race = await _dbContext.Races.FindAsync(id);

            if (race is null)
            {
                return NotFound();
            }
            _dbContext.Races.Remove(race);
            await _dbContext.SaveChangesAsync();

            return Ok(await GetAll());
        }
        
    }
}
