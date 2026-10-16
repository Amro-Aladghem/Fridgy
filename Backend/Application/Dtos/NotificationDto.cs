namespace Application.Dtos
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public Guid InventoryId { get; set; }
        public Guid ChatId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string NotificationStatus { get; set; } = "Queued";
        public string AgentType { get; set; }
        public string? Data { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
