namespace Application.Dtos
{
    public record ProductDto
    {
        public Guid? Id { get; set; }
        public Guid InventoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public int ProductStatusId { get; set; }
        public DateTime? ProducedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? CreationDate { get; set; }
    }
}
