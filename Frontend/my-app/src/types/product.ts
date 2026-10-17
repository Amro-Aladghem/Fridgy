export interface ProductDto {
  id?: string | null;
  inventoryId: string;
  name: string;
  description?: string | null;
  quantity: number;
  price?: number | null;
  imageUrl?: string | null;
  productStatusId: number;
  producedDate?: string | null;
  expiryDate?: string | null;
  creationDate?: string | null;
}
