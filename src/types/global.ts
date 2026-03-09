export interface Ingredient {
    id: string;
    name: string;
    amount: string;
    unit: string;
    available?: boolean;
}

export interface Recipe {
    id: string;
    name: string;
    time: number;
    calories: number;
    difficulty: string;
    servings: number;
    tag?: string;
    instructions?: string;
    hasAllIngredients: boolean;
    missingIngredients?: string[];
    ingredients: Ingredient[];
    imageUrl?: string;
    /** Raw TheMealDB object stored for external recipes so they can be imported */
    externalMealData?: Record<string, any>;
}
