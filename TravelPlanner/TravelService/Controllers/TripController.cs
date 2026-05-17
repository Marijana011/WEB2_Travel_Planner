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

    public class TripController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTrips()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trips = await _context.Trips
                .Where(x => x.UserId.ToString() == userId)
                .ToListAsync();

            return Ok(trips);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTrip(CreateTripDto dto)
        {
            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest("End date cannot be before start date.");
            }

            if (dto.Budget < 0)
            {
                return BadRequest("Budget cannot be negative.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = new Trip
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                Notes = dto.Notes,
                UserId = Guid.Parse(userId!)
            };

            _context.Trips.Add(trip);

            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = await _context.Trips
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.UserId.ToString() == userId);

            if (trip == null)
            {
                return NotFound();
            }

            _context.Trips.Remove(trip);

            await _context.SaveChangesAsync();

            return Ok("Trip deleted.");
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(Guid id, CreateTripDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = await _context.Trips
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId.ToString() == userId);

            if (trip == null)
            {
                return NotFound();
            }

            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest("End date cannot be before start date.");
            }

            if (dto.Budget < 0)
            {
                return BadRequest("Budget cannot be negative.");
            }

            trip.Title = dto.Title;
            trip.Description = dto.Description;
            trip.StartDate = dto.StartDate;
            trip.EndDate = dto.EndDate;
            trip.Budget = dto.Budget;
            trip.Notes = dto.Notes;

            await _context.SaveChangesAsync();
            return Ok(trip);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrip(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var role = User.FindFirstValue(ClaimTypes.Role);

            var trip = await _context.Trips
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (trip == null)
            {
                return NotFound();
            }

            if(trip.UserId.ToString() != userId && role != "Admin")
            {
                return Forbid();
            }

            return Ok(trip);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTrips()
        {
            var trips = await _context.Trips.ToListAsync();

            return Ok(trips);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTripsByUser(Guid userId)
        {
            var trips = await _context.Trips.Where(
                x => x.UserId == userId).ToListAsync();
        
            return Ok(trips);
        }
    }
}
