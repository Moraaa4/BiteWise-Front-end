export interface RecipeIngredient {
    id: string;
    name: string;
    quantity: string; // Se mantiene obligatoria para coincidir con el componente
    inInventory: boolean;
}

export interface RecipeDetail {
    id: string;
    name: string;
    tag: string;
    portions: number;
    timeMinutes: number;
    imageUrl?: string;
    ingredients: RecipeIngredient[];
    inventoryCount: number;
    totalCount: number;
}

// Datos mock actualizados para asegurar que cada objeto cumpla con la interfaz
export const MOCK_RECIPE_DETAIL: RecipeDetail = {
    id: "r1",
    name: "Pollo en salsa jitomate",
    tag: "Almuerzo",
    portions: 4,
    timeMinutes: 15,
    imageUrl: undefined,
    inventoryCount: 2,
    totalCount: 4,
    ingredients: [
        { id: "i1", name: "Pechuga de pollo", quantity: "500g", inInventory: true },
        { id: "i2", name: "Jitomate", quantity: "4 piezas", inInventory: true },
        { id: "i3", name: "Cebolla", quantity: "1/2 pieza", inInventory: false },
        { id: "i4", name: "Ajo", quantity: "2 dientes", inInventory: false },
    ],
};