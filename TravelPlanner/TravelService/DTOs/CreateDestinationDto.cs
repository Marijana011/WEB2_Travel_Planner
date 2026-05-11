namespace TravelService.DTOs
{
    public class CreateDestinationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Location {  get; set; } = string.Empty;
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public Guid TripId { get; set; }

    }
}
