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
    public class ActivityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{tripId}")]
        public async Task<IActionResult> GetActivities(Guid tripId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = await _context.Trips
                .FirstOrDefaultAsync(x =>
                    x.Id == tripId &&
                    x.UserId.ToString() == userId);

            if (trip == null)
            {
                return NotFound("Trip not found.");
            }

            var activities = await _context.Activities
                .Where(x => x.TripId == tripId)
                .ToListAsync();

            return Ok(activities);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(CreateActivityDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var trip = await _context.Trips
                .FirstOrDefaultAsync(x =>
                    x.Id == dto.TripId &&
                    x.UserId.ToString() == userId);

            if (trip == null)
            {
                return NotFound("Trip not found.");
            }

            if (dto.EstimatedCost < 0)
            {
                return BadRequest("Cost cannot be negative.");
            }

            var activity = new Activity
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Date = dto.Date,
                Time = dto.Time,
                Location = dto.Location,
                Description = dto.Description,
                EstimatedCost = dto.EstimatedCost,
                Status = dto.Status,
                Notes = dto.Notes,
                TripId = dto.TripId
            };

            _context.Activities.Add(activity);

            await _context.SaveChangesAsync();

            return Ok(activity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            var activity = await _context.Activities
                .FirstOrDefaultAsync(x => x.Id == id);

            if (activity == null)
            {
                return NotFound();
            }

            _context.Activities.Remove(activity);

            await _context.SaveChangesAsync();

            return Ok("Activity deleted.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, CreateActivityDto dto)
        {
            var activity = await _context.Activities.FindAsync(id);

            if (activity == null)
            {
                return NotFound();
            }

            activity.Title = dto.Title;
            activity.Location = dto.Location;
            activity.Description = dto.Description;
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Date = dto.Date;
            activity.Time = dto.Time;
            activity.Status = dto.Status;
            activity.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
