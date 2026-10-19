namespace Application.Dtos
{
    public class ChatDto
    {
        public Guid ChatSignature { get; set; }
        public Guid InventoryId { get; set; }
        public string? Name { get; set; }
        public DateTime CreationTime { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageType { get; set; }
        public int ChatRoleId { get; set; }
        public string Message { get; set; }
        public string? Data { get; set; }
        public bool ShowMessage { get; set; } = false;

        public bool IsFinalResponse { get; set; } = false;
    }
}
