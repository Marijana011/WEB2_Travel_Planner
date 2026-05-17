using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelService.Data;
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

    }
}
