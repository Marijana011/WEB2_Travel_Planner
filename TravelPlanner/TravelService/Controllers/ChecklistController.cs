using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Models;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChecklistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChecklistController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetChecklist(Guid tripId)
        {
            var items = await _context.ChecklistItems
                .Where(x => x.TripId == tripId)
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddItem(CreateChecklistDto dto)
        {
            var item = new ChecklistItem
            {
                Text = dto.Text,
                TripId = dto.TripId,
                Completed = false
            };

            _context.ChecklistItems.Add(item);

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ToggleItem(
            Guid id)
        {
            var item = await _context.ChecklistItems
                .FindAsync(id);

            if (item == null)
                return NotFound();

            item.Completed = !item.Completed;

            await _context.SaveChangesAsync();

            return Ok(item);
        }

    }
}
