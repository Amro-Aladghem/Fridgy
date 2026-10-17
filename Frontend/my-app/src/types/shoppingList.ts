export interface ShoppingListDto {
  id?: string | null;
  inventoryId: string;
  title?: string | null;
  description?: string | null;
  dateOfCreation: string;
}
