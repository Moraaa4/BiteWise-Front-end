import { createHttpClient } from './http.client';
import { API_CONFIG } from '@/config/constants';

export interface ShoppingListItem {
    id: number;
    ingredient_id: number;
    target_quantity: number;
    current_quantity: number;
    unit: string;
    name: string;
}

export interface ShoppingListResponse {
    message: string;
    status: string;
    items: ShoppingListItem[];
    totals?: {
        total_items: number;
        completed_items: number;
    };
}

export interface PurchaseItem {
    ingredient_id: number;
    purchase_price: number;
    purchase_quantity: number;
}

export interface PurchaseReport {
    message: string;
    reporte_hipotesis: Record<string, any>;
}

const shoppingClient = createHttpClient(API_CONFIG.INVENTORY_URL);

export const shoppingService = {
    async getShoppingLists(token: string) {
        return await shoppingClient.get<ShoppingListResponse>('/api/shopping-lists', {
            Authorization: `Bearer ${token}`
        });
    },

    async createShoppingList(payload: { recipe_id: string }, token: string) {
        return await shoppingClient.post<any>('/api/shopping-lists/generate', payload, {
            Authorization: `Bearer ${token}`
        });
    },

    async createListWithoutRecipe(payload: { name: string }, token: string) {
        return await shoppingClient.post<any>('/api/shopping-lists/manual', payload, {
            Authorization: `Bearer ${token}`
        });
    },

    async completePurchase(listId: number, token: string) {
        return await shoppingClient.post<PurchaseReport>('/api/shopping-lists/purchase', { list_id: listId }, {
            Authorization: `Bearer ${token}`
        });
    }
};
