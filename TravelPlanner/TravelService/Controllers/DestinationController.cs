using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DestinationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DestinationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{tripId}")]
        public async Task<IActionResult> GetDestinations(Guid tripId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = await _context.Trips.
                FirstOrDefaultAsync(x => x.Id == tripId &&
                x.UserId.ToString() == userId);

            if (trip == null)
            {
                return NotFound("Trip not found.");
            }

            var destinations = await _context.Destinations
                .Where(x => x.TripId == tripId).ToListAsync();

            return Ok(destinations);

        }

        [HttpPost]
        public async Task<IActionResult> CreateDestination(CreateDestinationDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = await _context.Trips
                .FirstOrDefaultAsync(x =>
                x.Id == dto.TripId && x.UserId.ToString() == userId);

            if (trip == null)
            {

                return NotFound("Trip not found.");
            }

            if (dto.DepartureDate < dto.ArrivalDate)
            {
                return BadRequest("Departure date cannot be before arrival date.");
            }

            var destination = new Destination
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Description = dto.Description,
                TripId = dto.TripId,
            };

            _context.Destinations.Add(destination); 

            await _context.SaveChangesAsync();

            return Ok(destination);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestination(Guid id)
        {
            var destination = await _context.Destinations.
                FirstOrDefaultAsync(x => x.Id == id);

            if (destination == null)
            {
                return NotFound();
            }

            _context.Destinations.Remove(destination);

            await _context.SaveChangesAsync();

            return Ok("Destination deleted.");
        }
    }
}
