export interface ShoppingList {
    id: string;
    name: string;
    status: "urgent" | "complete" | "incomplete";
    createdLabel: string;
    progress: number;
    total: number;
}

export const SHOPPING_LISTS: ShoppingList[] = [
    {
        id: "1",
        name: "Despensa Mensual",
        status: "urgent",
        createdLabel: "Hoy",
        progress: 2,
        total: 15,
    },
    {
        id: "2",
        name: "Cena Especial",
        status: "complete",
        createdLabel: "Ayer",
        progress: 8,
        total: 8,
    },
    {
        id: "3",
        name: "Snacks",
        status: "incomplete",
        createdLabel: "Hace 3 días",
        progress: 3,
        total: 5,
    }
];
