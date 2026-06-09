using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShareController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShareController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateShareLink(Guid tripId, string accessType)
        {
            var token = Guid.NewGuid().ToString();

            var sharedTrip = new SharedTrip
            {
                Id = Guid.NewGuid(),
                TripId = tripId,
                Token = token,
                AccessType = accessType,
                CreatedAt = DateTime.UtcNow
            };

            _context.SharedTrips.Add(sharedTrip);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                link = $"http://localhost:5173/shared/{token}"
            });
        }

        [HttpGet("{token}")]
        public async Task<IActionResult> GetSharedTrip(string token)
        {
            var sharedTrip = await _context.SharedTrips
                .Include(x => x.Trip)
                .ThenInclude(t => t.Destinations)
                .Include(x => x.Trip)
                .ThenInclude(t => t.Activities)
                .Include(x => x.Trip)
                .ThenInclude(t => t.ChecklistItems)
                .FirstOrDefaultAsync(x => x.Token == token);

            if (sharedTrip == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                trip = sharedTrip.Trip,
                accessType = sharedTrip.AccessType
            });
        }


        [HttpPost("{token}/checklist")]
        public async Task<IActionResult> AddChecklistItem(string token, [FromBody] CreateChecklistDto dto)
        {
            var sharedTrip = await _context.SharedTrips
                .FirstOrDefaultAsync(x => x.Token == token);

            if (sharedTrip == null)
            {
                return NotFound();
            }

            if (sharedTrip.AccessType != "EDIT")
            {
                return Forbid();
            }

            var item = new ChecklistItem
            {
                Id = Guid.NewGuid(),
                TripId = sharedTrip.TripId,
                Text = dto.Text,
                Completed = dto.Completed
            };

            _context.ChecklistItems.Add(item);

            await _context.SaveChangesAsync();

            return Ok(item);
        }

    }
}
