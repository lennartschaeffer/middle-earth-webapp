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
    public class HomeController : ControllerBase
    {
        private readonly CharacterDbContext _dbContext;
        public HomeController(CharacterDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var homes = await _dbContext.Homes
                .Include(c => c.Characters)
                .ThenInclude(character => character.Weapon)
                .Include(home => home.Characters)
                .ThenInclude(character => character.Race)
                .ToListAsync();
            var homeDtos = new List<HomeDto>();
            foreach (var home in homes)
            {
                var characterDtosList = new List<CharacterDto>();

                foreach (var character in home.Characters)
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
                homeDtos.Add(new HomeDto
                {
                    Id = home.Id,
                    Name = home.Name,
                    Characters = characterDtosList
                });
            }
            return Ok(homeDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]AddHomeDto addHomeDto)
        {
            var homeExists = await _dbContext.Homes.AnyAsync(home => home.Name == addHomeDto.Name);
            if (homeExists)
            {
                return BadRequest("The Location "+addHomeDto.Name+" already exists!");
            }
            var homeDomainModel = new Home
            {
                Name = addHomeDto.Name,
            };
           await _dbContext.Homes.AddAsync(homeDomainModel);
           await _dbContext.SaveChangesAsync();
            
            return Ok(await GetAll());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var home = await _dbContext.Homes.FindAsync(id);

            if (home is null)
            {
                return NotFound("Home not found");
            }

            _dbContext.Remove(home);
            await _dbContext.SaveChangesAsync();
            return Ok(await GetAll());
        }
    }
}
