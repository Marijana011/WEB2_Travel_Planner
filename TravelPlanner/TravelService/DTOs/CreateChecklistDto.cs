namespace TravelService.DTOs
{
    public class CreateChecklistDto
    {
        public bool Completed { get; set; }
        public string Text { get; set; } = string.Empty;
        public Guid TripId { get; set; }
    }
}
