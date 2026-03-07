export interface RecipeIngredient {
    id: string;
    name: string;
    quantity: string;
    inInventory: boolean;
}

export interface RecipeDetail {
    id: string;
    name: string;
    tag: string;
    portions: number;
    timeMinutes: number;
    imageUrl?: string; // connected when backend is ready
    ingredients: RecipeIngredient[];
    inventoryCount: number; // how many items are already in inventory
    totalCount: number;
}

// Datos mock de estructura — los ingredientes serán provistos por el backend
export const MOCK_RECIPE_DETAIL: RecipeDetail = {
    id: "r1",
    name: "Pollo en salsa jitomate",
    tag: "Almuerzo",
    portions: 4,
    timeMinutes: 15,
    imageUrl: undefined,
    inventoryCount: 0,
    totalCount: 0,
    ingredients: [], // se poblará desde el backend
};
