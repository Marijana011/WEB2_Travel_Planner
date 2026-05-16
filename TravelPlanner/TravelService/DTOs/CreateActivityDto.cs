namespace TravelService.DTOs
{
    public class CreateActivityDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string Location {  get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
        public string Notes {  get; set; } = string.Empty;
        public string Status {  get; set; } = "Planned";
        public string Category { get; set; } = "Other";
        public Guid TripId { get; set; }

    }
}
