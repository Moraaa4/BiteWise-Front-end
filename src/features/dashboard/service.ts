import { apiClient } from '@/services/apiClient';

export async function fetchSuggestedRecipes() {
  return await apiClient.get<any[]>('/recipes/suggested');
}

export async function fetchIngredients() {
  return await apiClient.get<any[]>('/inventory/ingredients');
}
