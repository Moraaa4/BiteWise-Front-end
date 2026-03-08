export type Difficulty = "FÁCIL" | "MEDIO" | "DIFÍCIL";

export interface AvailableRecipe {
    id: string;
    name: string;
    description: string;
    timeMinutes: number;
    ingredientsBadge: string;
    imageUrl?: string;
    instructions?: string;
    servings?: string;
    ingredients?: Array<{
        ingredient_id: number;
        name: string;
        required_quantity: number;
        unit: string;
    }>;
}

export interface HistoryRecipe {
    id: string;
    name: string;
    date: string;
    difficulty: Difficulty;
    imageUrl?: string;
}

export const AVAILABLE_RECIPES: AvailableRecipe[] = [
    {
        id: "r1",
        name: "Ensalada César Premium",
        description: "Lechuga romana fresca, crutones artesanales y...",
        timeMinutes: 20,
        ingredientsBadge: "100% INGREDIENTES",
    },
    {
        id: "r2",
        name: "Tacos de Al Pastor",
        description: "Carne marinada con piña, cilantro y cebolla...",
        timeMinutes: 35,
        ingredientsBadge: "100% INGREDIENTES",
    },
    {
        id: "r3",
        name: "Pasta al Pesto Genovés",
        description: "Pasta al dente con salsa de albahaca fresca...",
        timeMinutes: 15,
        ingredientsBadge: "100% INGREDIENTES",
    },
    {
        id: "r4",
        name: "Bowl de Quinoa Saludable",
        description: "Mezcla nutritiva de vegetales asados...",
        timeMinutes: 25,
        ingredientsBadge: "100% INGREDIENTES",
    },
];

export const HISTORY_RECIPES: HistoryRecipe[] = [
    {
        id: "h1",
        name: "Ramen Tonkotsu Casero",
        date: "Hoy, 14:32",
        difficulty: "MEDIO",
    },
    {
        id: "h2",
        name: "Costillas BBQ al Horno",
        date: "Ayer, 20:15",
        difficulty: "DIFÍCIL",
    },
    {
        id: "h3",
        name: "Hamburguesa Clásica",
        date: "12 Oct, 13:08",
        difficulty: "FÁCIL",
    },
];
