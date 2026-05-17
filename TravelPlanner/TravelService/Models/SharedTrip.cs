namespace TravelService.Models
{
    public class SharedTrip
    {
        public Guid Id { get; set; }
        public Guid TripId { get; set; }
        public string Token { get; set; } = string.Empty;
        public string AccessType {  get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Trip Trip { get; set; }
    }
}
