"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import InventoryModal, { type InventoryItem } from '@/features/inventory/components/InventoryModal';
import { inventoryService } from '@/services/inventory.service';
import { catalogService } from '@/services/catalog.service';

export default function Inventory() {
    const [ingredients, setIngredients] = useState<InventoryItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

    const loadInventory = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await inventoryService.getInventory(token);
            if (res.ok && res.data && Array.isArray(res.data.items)) {
                // Map both original format and possible backend format just in case
                const mapped = res.data.items.map((item: any) => ({
                    id: item.id?.toString() || item.ingredient_id?.toString() || Math.random().toString(),
                    ingredientId: item.ingredient_id?.toString(),
                    name: item.ingredients?.name || item.name || 'Desconocido',
                    category: item.ingredients?.category || item.category || 'General',
                    quantity: `${item.current_quantity ?? item.quantity ?? 0} g/ml/oz`
                }));
                setIngredients(mapped);
            }
        } catch (e) { console.error("Error loading inventory:", e) }
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const handleAdd = () => {
        setEditingItem(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (id: string, currentName: string) => {
        const itemToEdit = ingredients.find(ing => ing.id === id);
        if (itemToEdit) {
            setEditingItem(itemToEdit);
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                // Find the item to know its current quantity
                const itemToRemove = ingredients.find(ing => ing.id === id);
                const numericQuantity = parseFloat(itemToRemove?.quantity || "999999"); // Send a huge number to clear it out if parsing fails (backend caps at available balance via error, but we'll try to get exact)

                const res = await inventoryService.deleteInventoryItem(Number(id), numericQuantity, token);
                if (res.ok) {
                    await loadInventory();
                }
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("No se pudo eliminar el ingrediente. Probablemente ya está vacío.");
            }
        }
    };

    const handleSaveItem = async (savedItem: InventoryItem) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const numericQuantity = parseFloat(savedItem.quantity) || 1;
            let ingredientId = Number(savedItem.id);

            // If it's a new item or arbitrarily passed, we must resolve it to a Catalog Ingredient ID
            if (editingItem && savedItem.ingredientId) {
                // Use the stored ingredient_id directly 
                ingredientId = Number(savedItem.ingredientId);
            } else if (!editingItem || isNaN(ingredientId) || savedItem.id.toString().length > 10) {
                // Try to create it in the catalog first
                const catRes = await catalogService.createIngredient({
                    name: savedItem.name,
                    category: savedItem.category,
                    weight_per_unit: 1
                }, token);

                if (catRes.ok && catRes.data && catRes.data.ingredient) {
                    ingredientId = catRes.data.ingredient.id;
                } else {
                    // It probably already exists! Let's find it.
                    const allRes = await catalogService.getIngredients(token);
                    if (allRes.ok && allRes.data) {
                        const found = allRes.data.find((i: any) => i.name.toLowerCase() === savedItem.name.toLowerCase());
                        if (found) {
                            ingredientId = found.id;
                        } else {
                            throw new Error("No pudimos crear ni encontrar el ingrediente en el catálogo.");
                        }
                    } else {
                        throw new Error("Error al consultar el catálogo.");
                    }
                }
            }

            let res;
            if (editingItem && savedItem.ingredientId) {
                // Backend has no "set quantity" endpoint, only add/remove.
                // To SET quantity: remove all current, then add the new amount.
                const currentQty = parseFloat(editingItem.quantity) || 0;

                // Step 1: Remove all current quantity
                if (currentQty > 0) {
                    await inventoryService.deleteInventoryItem(
                        Number(savedItem.ingredientId),
                        currentQty,
                        token
                    );
                }

                // Step 2: Add the new desired quantity
                if (numericQuantity > 0) {
                    res = await inventoryService.createInventoryItem(
                        {
                            ingredient_id: Number(savedItem.ingredientId),
                            quantity: numericQuantity,
                        },
                        token
                    );
                } else {
                    res = { ok: true };
                }
            } else {
                // New item: just add the quantity
                res = await inventoryService.createInventoryItem(
                    {
                        ingredient_id: ingredientId,
                        quantity: numericQuantity,
                    },
                    token
                );
            }

            if (res.ok) {
                await loadInventory();
                setIsModalOpen(false);
            } else {
                alert("Hubo un error al guardar el ingrediente en el inventario.");
            }
        } catch (error) {
            console.error("Error saving inventory item:", error);
            alert("No se pudo guardar el ingrediente");
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="inventario" />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-3 sm:p-4 md:p-8 pt-16 max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
                    {/* Top Header Area */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#131613] dark:text-white mb-1">Inventario</h1>
                            <p className="text-sm md:text-base text-[#6c7f6d] dark:text-gray-400">Gestiona y monitorea la frescura de tus ingredientes.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <span translate="no" className="material-symbols-outlined notranslate absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar ingrediente..."
                                    className="pl-11 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full transition-all"
                                />
                            </div>

                            {/* Filters */}
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                <span translate="no" className="material-symbols-outlined notranslate text-[18px]">tune</span>
                                <span className="hidden sm:inline">Filtros</span>
                            </button>

                            {/* Add Button */}
                            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-bold shadow-md transition-colors">
                                <span translate="no" className="material-symbols-outlined notranslate text-[18px]">add</span>
                                <span className="hidden sm:inline">Agregar</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Shell */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                        <div className="overflow-x-auto flex-1 flex flex-col">
                            <div className="flex-1 flex flex-col">
                                {/* Table Headers */}
                                <div className="flex flex-col sm:grid sm:grid-cols-4 px-6 md:px-8 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-xs font-bold text-gray-400 tracking-wider">
                                    <div>INGREDIENTE</div>
                                    <div>CATEGORÍA</div>
                                    <div>CANTIDAD</div>
                                    <div className="text-left sm:text-right">ACCIONES</div>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto flex flex-col">
                                    {ingredients.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center p-8 text-center">
                                            <p className="text-gray-400 text-sm">No hay ingredientes en el inventario.</p>
                                        </div>
                                    ) : (
                                        ingredients.map((ing) => (
                                            <div key={ing.id} className="flex flex-col sm:grid sm:grid-cols-4 px-6 md:px-8 py-4 border-b border-gray-50 dark:border-zinc-800/50 items-start sm:items-center text-sm group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors gap-2 sm:gap-0">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 sm:col-span-1">
                                                    <span className="sm:hidden font-bold text-gray-500 mr-2">Ingrediente:</span>
                                                    {ing.name}
                                                </div>
                                                <div className="text-gray-500 dark:text-gray-400 sm:col-span-1">
                                                    <span className="sm:hidden font-bold text-gray-500 mr-2">Categoría:</span>
                                                    <span className="bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-xs font-medium">{ing.category}</span>
                                                </div>
                                                <div className="text-gray-900 dark:text-gray-100 font-medium sm:col-span-1">
                                                    <span className="sm:hidden font-bold text-gray-500 mr-2">Cantidad:</span>
                                                    {ing.quantity}
                                                </div>
                                                <div className="flex justify-start sm:justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity sm:col-span-1">
                                                    <button onClick={() => handleEdit(ing.id, ing.name)} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="Editar">
                                                        <span translate="no" className="material-symbols-outlined notranslate text-[18px]">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(ing.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                                                        <span translate="no" className="material-symbols-outlined notranslate text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-4 md:px-8 py-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Mostrando {ingredients.length} ingredientes</span>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-4 py-1.5 border border-gray-200 dark:border-zinc-700 rounded-md font-medium text-gray-400 hover:bg-gray-50 transition-colors text-center disabled:opacity-50" disabled>Anterior</button>
                                <button className="flex-1 sm:flex-none px-4 py-1.5 border border-gray-200 dark:border-zinc-700 rounded-md font-medium text-gray-400 hover:bg-gray-50 transition-colors text-center disabled:opacity-50" disabled>Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <InventoryModal
                        initialData={editingItem}
                        onSave={handleSaveItem}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </main>
        </div>
    );
}
