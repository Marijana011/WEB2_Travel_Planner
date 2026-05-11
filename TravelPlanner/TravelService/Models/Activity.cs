namespace TravelService.Models
{
    public class Activity
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public string Time { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal EstimatedCost { get; set; }

        public string Status { get; set; } = "Planned";

        public Guid TripId { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Trip? Trip { get; set; }

    }
}
