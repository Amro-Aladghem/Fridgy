namespace Application.Dtos
{
    public class ShoppingListDto
    {
        public Guid? Id { get; set; }
        public Guid InventoryId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime DateOfCreation { get; set; }
    }
}
