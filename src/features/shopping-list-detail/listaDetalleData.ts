export interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    checked: boolean;
}

export interface ShoppingListDetail {
    id: string;
    name: string;
    items: ShoppingItem[];
}

export const MOCK_LIST_DETAIL: ShoppingListDetail = {
    id: "1",
    name: "Compras Hoy",
    items: [
        { id: "item1", name: "Leche", quantity: "2L", checked: false },
        { id: "item2", name: "Huevos", quantity: "12", checked: false },
        { id: "item3", name: "Carne", quantity: "500g", checked: false },
    ],
};
