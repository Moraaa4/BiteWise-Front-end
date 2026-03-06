import type { Recipe } from "@/types/global";

export const READY_RECIPES: Recipe[] = [
    {
        id: "1",
        name: "Salteado de Pollo y Vegetales",
        time: 25,
        calories: 450,
        difficulty: "Fácil",
        servings: 2,
        tag: "PERFECTO PARA CENA",
        hasAllIngredients: true,
        ingredients: [
            { id: "i1", name: "Pechuga de Pollo", amount: "500", unit: "g", available: true },
            { id: "i2", name: "Espinacas Baby", amount: "2", unit: "tazas", available: true },
            { id: "i3", name: "Cebolla Morada", amount: "1", unit: "unidad", available: true },
            { id: "i4", name: "Ajo", amount: "2", unit: "dientes", available: true },
        ],
    },
    {
        id: "2",
        name: "Omelette de Espinacas y Queso",
        time: 75,
        calories: 320,
        difficulty: "Fácil",
        servings: 2,
        hasAllIngredients: true,
        ingredients: [
            { id: "i5", name: "Huevos", amount: "3", unit: "unidades", available: true },
            { id: "i6", name: "Espinacas", amount: "1", unit: "taza", available: true },
            { id: "i7", name: "Queso", amount: "50", unit: "g", available: true },
        ],
    },
    {
        id: "3",
        name: "Ensalada Caprese con Pollo",
        time: 20,
        calories: 280,
        difficulty: "Fácil",
        servings: 2,
        hasAllIngredients: true,
        ingredients: [
            { id: "i8", name: "Tomate", amount: "2", unit: "unidades", available: true },
            { id: "i9", name: "Mozzarella", amount: "100", unit: "g", available: true },
            { id: "i10", name: "Pollo", amount: "200", unit: "g", available: true },
        ],
    },
];

export const ALMOST_READY_RECIPES: Recipe[] = [
    {
        id: "4",
        name: "Arroz con Pollo al Curry",
        time: 45,
        calories: 520,
        difficulty: "Medio",
        servings: 4,
        hasAllIngredients: false,
        missingIngredients: ["Leche de coco"],
        ingredients: [],
    },
    {
        id: "5",
        name: "Pasta Carbonara",
        time: 30,
        calories: 480,
        difficulty: "Medio",
        servings: 2,
        hasAllIngredients: false,
        missingIngredients: ["Panceta"],
        ingredients: [],
    },
];
