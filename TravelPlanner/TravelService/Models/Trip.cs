using System.Diagnostics;

namespace TravelService.Models
{
    public class Trip
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Notes { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public List<Destination> Destinations { get; set; } = new();
        public List<Activity> Activities { get; set; } = new();

        public ICollection<ChecklistItem> ChecklistItems { get; set; }
    }
}
