import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { AgentRequestDto } from '@/types/agent';
import type { ChatDto } from '@/types/chat';
import type { NotificationDto } from '@/types/notification';
import type { ProductDto } from '@/types/product';
import type { ShoppingListDto } from '@/types/shoppingList';

const baseUri = '/inventories';

export const inventoryService = {
  async createChatForInventory(
    inventoryId: string,
    chatDto: ChatDto,
  ): Promise<ApiResponse<ChatDto>> {
    try {
      const response = await api.post<ChatDto>(`${baseUri}/${inventoryId}`, chatDto);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async chatWithAgent(
    inventoryId: string,
    chatSignature: string,
    agentRequestDto: AgentRequestDto,
    askUser = false,
  ): Promise<ApiResponse<string>> {
    try {
      const response = await api.post<string>(
        `${baseUri}/${inventoryId}/chats/${chatSignature}?askUser=${askUser}`,
        agentRequestDto,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async callMonitorAgent(
    inventoryId: string,
    chatSignature: string,
    agentRequestDto: AgentRequestDto,
  ): Promise<ApiResponse<string>> {
    try {
      const response = await api.post<string>(
        `${baseUri}/${inventoryId}/chats/${chatSignature}/monitor`,
        agentRequestDto,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getNotificationsForChat(
    inventoryId: string,
    chatSignature: string,
  ): Promise<ApiResponse<NotificationDto[]>> {
    try {
      const response = await api.get<NotificationDto[]>(
        `${baseUri}/${inventoryId}/chats/${chatSignature}/notifications`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getChatsHistoryById(
    inventoryId: string,
    chatSignature: string,
  ): Promise<ApiResponse<ChatDto[]>> {
    try {
      const response = await api.get<ChatDto[] | null>(
        `${baseUri}/${inventoryId}/chats/${chatSignature}`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async uploadInventoryImage(
    inventoryId: string,
    file: File,
  ): Promise<ApiResponse<string>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<string>(`${baseUri}/${inventoryId}/upload`, formData);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getShoppingListsHistory(
    inventoryId: string,
  ): Promise<ApiResponse<ShoppingListDto[]>> {
    try {
      const response = await api.get<ShoppingListDto[]>(
        `${baseUri}/${inventoryId}/shoppinglists`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getProductsForShoppingList(
    inventoryId: string,
    listId: string,
  ): Promise<ApiResponse<ProductDto[]>> {
    try {
      const response = await api.get<ProductDto[]>(
        `${baseUri}/${inventoryId}/shoppinglists/${listId}/products`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getExpiredProducts(inventoryId: string): Promise<ApiResponse<ProductDto[]>> {
    try {
      const response = await api.get<ProductDto[]>(
        `${baseUri}/${inventoryId}/products/expired`,
      );
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getProducts(inventoryId: string): Promise<ApiResponse<ProductDto[]>> {
    try {
      const response = await api.get<ProductDto[]>(`${baseUri}/${inventoryId}/products`);
      return { isSuccess: true, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateProduct(
    inventoryId: string,
    id: string,
    productDto: ProductDto,
  ): Promise<ApiResponse<ProductDto>> {
    try {
      const response = await api.put<ProductDto>(
        `${baseUri}/${inventoryId}/products/${id}`,
        productDto,
      );
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async deleteProduct(inventoryId: string, id: string): Promise<ApiResponse<boolean>> {
    try {
      await api.delete(`${baseUri}/${inventoryId}/products/${id}`);
      return { isSuccess: true, data: true };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};

export default inventoryService;
