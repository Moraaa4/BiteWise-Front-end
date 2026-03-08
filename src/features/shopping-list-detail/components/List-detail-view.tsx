"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, Trash2 } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import ShoppingItemRow from "@/features/shopping-list-detail/components/ShoppingItemRow";
import { type ShoppingItem } from "@/features/shopping-list-detail/listaDetalleData";
import { useSearchParams } from "next/navigation";

export default function ListaDetalleView() {
    const searchParams = useSearchParams();
    const urlListId = searchParams.get('id');

    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [listName, setListName] = useState("Mi Lista de Compras");
    const [activeListId, setActiveListId] = useState<string>("default");

    // Initialize list and merge any pending items sent from Recipe Detail
    React.useEffect(() => {
        let activeId: string = urlListId ?? "";

        // Find best active ID
        const savedLists = localStorage.getItem('biteWise_shoppingLists');
        let parsedLists: any[] = [];
        if (savedLists) {
            try { parsedLists = JSON.parse(savedLists); } catch (e) { }
        }

        if (!activeId) {
            if (parsedLists.length > 0) {
                activeId = parsedLists[0].id;
                setListName(parsedLists[0].name);
            } else {
                activeId = "default";
            }
        } else {
            const found = parsedLists.find(l => l.id === activeId);
            if (found) {
                setListName(found.name);
            }
        }

        setActiveListId(activeId);

        let currentItems: ShoppingItem[] = [];
        let shouldSaveImmediately = false;

        // 1. Try to load existing active list items
        const storageKey = `biteWise_list_items_${activeId}`;
        const savedList = localStorage.getItem(storageKey);

        if (savedList && savedList !== '[]') {
            try {
                currentItems = JSON.parse(savedList);
            } catch (e) {
                console.error("Error parsing saved list", e);
            }
        }

        // 2. Try to load pending items to append
        const pending = localStorage.getItem('biteWise_pendingItems');
        if (pending) {
            try {
                const parsed = JSON.parse(pending) as ShoppingItem[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const existingNames = new Set(currentItems.map(i => i.name.toLowerCase()));
                    const newItems = parsed.filter(i => !existingNames.has(i.name.toLowerCase()));

                    if (newItems.length > 0) {
                        currentItems = [...newItems, ...currentItems];
                        shouldSaveImmediately = true;
                    }
                }
            } catch (e) {
                console.error("Error parsing pending items", e);
            }
            localStorage.removeItem('biteWise_pendingItems');
        }

        if (shouldSaveImmediately) {
            localStorage.setItem(storageKey, JSON.stringify(currentItems));
        }

        setItems(currentItems);
        setIsLoaded(true);
    }, [urlListId]);

    // Save changes to localStorage whenever items change
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(`biteWise_list_items_${activeListId}`, JSON.stringify(items));
        }
    }, [items, isLoaded, activeListId]);

    const checkedCount = items.filter((i) => i.checked).length;
    const allChecked = checkedCount === items.length && items.length > 0;

    const handleToggle = (id: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const handleDelete = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleAddItem = () => {
        const trimmed = newItemName.trim();
        if (!trimmed) return;
        const newItem: ShoppingItem = {
            id: `item-${Date.now()}`,
            name: trimmed,
            quantity: "",
            checked: false,
        };
        setItems((prev) => [...prev, newItem]);
        setNewItemName("");
    };

    const handleMarkAll = () => {
        setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    };

    const handleComplete = async () => {
        // Mark all checked first (visual feedback)
        const allCheckedItems = items.map(item => ({ ...item, checked: true }));
        setItems(allCheckedItems);

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Necesitas iniciar sesión para transferir al inventario.");
            return;
        }

        const CATALOG_URL = 'http://localhost:3002';
        const INVENTORY_URL = 'http://localhost:3003';

        let successCount = 0;
        let errorCount = 0;

        for (const item of allCheckedItems) {
            try {
                // 1. Find or create ingredient in catalog by name
                const searchRes = await fetch(`${CATALOG_URL}/api/ingredients`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                let ingredient_id: number | null = null;

                if (searchRes.ok) {
                    const searchData = await searchRes.json();
                    const allIngredients: any[] = searchData || [];
                    const found = allIngredients.find(
                        (ing: any) => ing.name?.toLowerCase().trim() === item.name.toLowerCase().trim()
                    );
                    if (found) {
                        ingredient_id = found.id;
                    }
                }

                // 2. If not found, create it in catalog
                if (!ingredient_id) {
                    const createRes = await fetch(`${CATALOG_URL}/api/ingredients`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: item.name,
                            category: 'Importado',
                            purchase_price: 0.05,
                            weight_per_unit: 1
                        })
                    });
                    if (createRes.ok) {
                        const createData = await createRes.json();
                        ingredient_id = createData.ingredient?.id ?? null;
                    }
                }

                if (!ingredient_id) {
                    errorCount++;
                    continue;
                }

                // 3. Add to user inventory
                const invRes = await fetch(`${INVENTORY_URL}/api/inventory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ ingredient_id, quantity: 1 })
                });

                if (invRes.ok) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (e) {
                console.error(`Error adding ${item.name} to inventory`, e);
                errorCount++;
            }
        }

        if (successCount > 0) {
            alert(`✅ ${successCount} ingrediente(s) añadidos a tu inventario.${errorCount > 0 ? ` (${errorCount} no se pudieron procesar.)` : ''}`);
        } else if (errorCount > 0) {
            alert(`❌ No se pudieron añadir algunos ingredientes al inventario. Verifica que los servicios estén corriendo.`);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="lista" />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header title="Detalles de Lista" />

                <main className="flex-1 flex items-start justify-center pt-12 px-4 sm:px-8 pb-8">
                    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                        {/* List card */}
                        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                            {/* Card header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-white/10">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                    {listName}
                                </h2>
                                <span className="text-[11px] text-emerald-500 font-semibold">
                                    {checkedCount}/{items.length} productos
                                </span>
                            </div>

                            {/* Items */}
                            <div className="px-4 sm:px-6 py-2">
                                {items.map((item) => (
                                    <ShoppingItemRow
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>

                            {/* Add item input */}
                            <div className="px-4 sm:px-6 pb-4 pt-2">
                                <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all bg-white dark:bg-white/5">
                                    <Search size={13} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="+ Agregar producto"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                                        className="flex-1 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="px-4 sm:px-6 pb-4">
                                <button
                                    onClick={allChecked ? undefined : handleComplete}
                                    disabled={allChecked}
                                    className={`w-full py-3 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 ${allChecked
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 cursor-default"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                                        }`}
                                >
                                    <CheckCircle2 size={16} />
                                    {allChecked ? "¡Todo completado!" : "TODO COMPRADO"}
                                </button>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                                    LOS ARTÍCULOS MARCADOS SE TRANSFERIRÁN A TU INVENTARIO
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-4 text-center">
                    <p className="text-xs text-gray-400">
                        © 2024 <span className="font-semibold">BiteWise</span>. Come mejor, desperdicia menos.
                    </p>
                </footer>
            </div>
        </div>
    );
}
