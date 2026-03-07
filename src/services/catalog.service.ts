import { createHttpClient } from './http.client';

export interface Ingredient {
  id: number;
  name: string;
  category: string;
  purchase_price?: number;
  purchase_quantity?: number;
  weight_per_unit?: number;
  unit_default?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIngredientRequest {
  name: string;
  category: string;
  purchase_price?: number;
  purchase_quantity?: number;
  weight_per_unit?: number;
}

export interface UpdateIngredientRequest {
  name?: string;
  category?: string;
  purchase_price?: number;
  purchase_quantity?: number;
  weight_per_unit?: number;
}

export interface RecipeIngredient {
  ingredient_id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  title: string;
  instructions: string;
  image_url?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  ingredients: RecipeIngredient[];
}

export interface CreateRecipeRequest {
  title: string;
  instructions: string;
  image_url?: string;
  ingredients: Array<{
    ingredient_id: number;
    required_quantity: number;
  }>;
}

export interface UpdateRecipeRequest {
  title?: string;
  instructions?: string;
  image_url?: string;
  ingredients?: Array<{
    ingredient_id: number;
    required_quantity: number;
  }>;
}

export interface ExternalRecipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  ingredients?: Array<{
    name: string;
    measure: string;
  }>;
}

const catalogClient = createHttpClient(process.env.NEXT_PUBLIC_CATALOG_API_URL || 'http://localhost:3002');

export const catalogService = {
  async getIngredients(token: string) {
    const response = await catalogClient.get<Ingredient[]>('/api/ingredients', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async createIngredient(ingredient: CreateIngredientRequest, token: string) {
    const response = await catalogClient.post<{ message: string; ingredient: Ingredient }>('/api/ingredients', ingredient, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateIngredient(id: number, ingredient: UpdateIngredientRequest, token: string) {
    const response = await catalogClient.put<{ message: string; ingredient: Ingredient }>(`/api/ingredients/${id}`, ingredient, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async deleteIngredient(id: number, token: string) {
    const response = await catalogClient.delete<{ message: string }>(`/api/ingredients/${id}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getRecipes(token: string) {
    const response = await catalogClient.get<{ message: string; recipes: Recipe[] }>('/api/recipes', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getRecipeById(id: number, servings?: number, token?: string) {
    const url = servings ? `/api/recipes/${id}?servings=${servings}` : `/api/recipes/${id}`;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await catalogClient.get<{ message: string; recipe: Recipe }>(url, headers);
    return response;
  },

  async createRecipe(recipe: CreateRecipeRequest, token: string) {
    const response = await catalogClient.post<{ message: string; recipeId: number }>('/api/recipes', recipe, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async updateRecipe(id: number, recipe: UpdateRecipeRequest, token: string) {
    const response = await catalogClient.put<{ message: string }>(`/api/recipes/${id}`, recipe, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async deleteRecipe(id: number, token: string) {
    const response = await catalogClient.delete<{ message: string }>(`/api/recipes/${id}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getMatchingRecipes(token: string) {
    const response = await catalogClient.get<{ message: string; data: any[] }>('/api/recipes/match', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async searchExternalRecipes(query: string, token: string) {
    const response = await catalogClient.get<{ message: string; source: string; count: number; recipes: ExternalRecipe[] }>(`/api/recipes/external/search?query=${encodeURIComponent(query)}`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getRandomExternalRecipes(token: string) {
    const response = await catalogClient.get<{ message: string; source: string; count: number; recipes: ExternalRecipe[] }>('/api/recipes/external/random', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async getRegionalRecipes(token: string) {
    const response = await catalogClient.get<{ message: string; count: number; recipes: ExternalRecipe[] }>('/api/recipes/external/regional', {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },

  async importExternalRecipe(externalMeal: ExternalRecipe, token: string) {
    const response = await catalogClient.post<{ message: string; recipe: Recipe }>('/api/recipes/external/import', { externalMeal }, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  },
};
