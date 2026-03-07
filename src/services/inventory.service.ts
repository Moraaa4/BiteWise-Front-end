import { createHttpClient } from './http.client';

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  location?: string;
  category?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryItemRequest {
  name: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  location?: string;
  category?: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  quantity?: number;
  unit?: string;
  min_threshold?: number;
  location?: string;
  category?: string;
}

export interface LowStockAlert {
  item_id: number;
  item_name: string;
  current_quantity: number;
  min_threshold: number;
  shortage: number;
}

const inventoryClient = createHttpClient(process.env.NEXT_PUBLIC_INVENTORY_API_URL || 'http://localhost:3003');

export const inventoryService = {
  async getHealth() {
    const response = await inventoryClient.get<{ message: string }>('/api/health');
    return response;
  },

  async getInventory(token: string) {
    const response = await inventoryClient.get<InventoryItem[]>('/', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getInventoryItem(id: number, token: string) {
    const response = await inventoryClient.get<InventoryItem>(`/${id}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async createInventoryItem(item: CreateInventoryItemRequest, token: string) {
    const response = await inventoryClient.post<InventoryItem>('/', item, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateInventoryItem(id: number, item: UpdateInventoryItemRequest, token: string) {
    const response = await inventoryClient.put<InventoryItem>(`/${id}`, item, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async deleteInventoryItem(id: number, token: string) {
    const response = await inventoryClient.delete<{ message: string }>(`/${id}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getLowStockItems(token: string) {
    const response = await inventoryClient.get<LowStockAlert[]>('/low-stock', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateStock(id: number, quantity: number, token: string) {
    const response = await inventoryClient.patch<InventoryItem>(`/${id}/stock`, { quantity }, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },
};
