export interface ChatDto {
  chatSignature: string;
  inventoryId: string;
  name?: string | null;
  creationTime: string;
  imageUrl?: string | null;
  imageType?: string | null;
  chatRoleId: number;
  message: string;
  data?: string | null;
  showMessage: boolean;
}
