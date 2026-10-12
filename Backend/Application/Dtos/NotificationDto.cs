namespace Application.Dtos
{
    public record NotificationDto
    {
        public Guid Id { get; set; }
        public Guid InventoryId { get; set; }
        public string Text { get; set; }
        public Guid NotificationTypeId { get; set; }
    }
}
