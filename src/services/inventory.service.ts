import { createHttpClient } from './http.client';
import { API_CONFIG } from '@/config/constants';

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
  ingredient_id: number;
  quantity: number;
}

export interface LowStockAlert {
  item_id: number;
  item_name: string;
  current_quantity: number;
  min_threshold: number;
  shortage: number;
}

const inventoryClient = createHttpClient(API_CONFIG.INVENTORY_URL);

export const inventoryService = {
  async getHealth() {
    const response = await inventoryClient.get<{ message: string }>('/api/health');
    return response;
  },

  async getInventory(token: string) {
    const response = await inventoryClient.get<{ message: string; items: InventoryItem[] }>('/api/inventory', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getInventoryItem(id: number, token: string) {
    const response = await inventoryClient.get<InventoryItem>(`/api/inventory/${id}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async createInventoryItem(item: CreateInventoryItemRequest, token: string) {
    const response = await inventoryClient.post<any>('/api/inventory', item, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async deleteInventoryItem(id: number, quantity: number, token: string) {
    const response = await inventoryClient.post<{ message: string }>(`/api/inventory/remove`, { ingredient_id: id, quantity }, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async cookRecipe(recipe_id: number, token: string) {
    const response = await inventoryClient.post<{ message: string; details: string }>('/api/inventory/cook', { recipe_id }, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getLowStockItems(token: string) {
    const response = await inventoryClient.get<LowStockAlert[]>('/api/inventory/low-stock', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateStock(id: number, quantity: number, token: string) {
    const response = await inventoryClient.patch<InventoryItem>(`/api/inventory/${id}/stock`, { quantity }, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },
};
