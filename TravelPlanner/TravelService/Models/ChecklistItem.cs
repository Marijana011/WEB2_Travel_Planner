namespace TravelService.Models
{
    public class ChecklistItem
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool Completed { get; set; }
        public Guid TripId { get; set; }
        public Trip Trip { get; set; }
    }
}
