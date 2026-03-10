"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import InventoryModal from '@/features/inventory/components/InventoryModal';
import { inventoryService, type InventoryItem as ServiceItem } from "@/services/inventory.service";
import { STORAGE_KEYS } from "@/config/constants";
import { catalogService } from '@/services/catalog.service';

// Interfaz local para la visualización que coincida con lo que el componente usa
interface DisplayItem {
    id: string; // ID interno de la lista (puede ser el mismo que ingredientId)
    ingredientId: string;
    name: string;
    category: string;
    quantity: string;
    purchasePrice?: number;
    purchaseQuantity?: number;
    unitType?: 'g' | 'ml' | 'unidad';
}

export default function Inventory() {
    const [ingredients, setIngredients] = useState<DisplayItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | undefined>();
    const [searchQuery, setSearchQuery] = useState('');

    const loadInventory = async () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) return;
        try {
            const res = await inventoryService.getInventory(token);
            if (res.ok && res.data && Array.isArray(res.data.items)) {
                const mapped: DisplayItem[] = res.data.items.map((item: any) => {
                    const rawQty = Number(item.current_quantity ?? item.quantity ?? 0);
                    const unitLabel = item.ingredients?.unit_default || 'g';
                    return {
                        id: (item.ingredient_id || item.id || Math.random()).toString(),
                        ingredientId: (item.ingredient_id || item.id).toString(),
                        name: item.ingredients?.name || item.name || 'Desconocido',
                        category: item.ingredients?.category || item.category || 'General',
                        quantity: `${rawQty % 1 === 0 ? rawQty : rawQty.toFixed(1)} ${unitLabel}`,
                        unitType: unitLabel as 'g' | 'ml' | 'unidad',
                        purchasePrice: item.ingredients?.purchase_price ?? 0,
                        purchaseQuantity: item.ingredients?.purchase_quantity ?? 1
                    };
                });
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
            // Mapeamos al formato que espera el modal
            setEditingItem({
                id: itemToEdit.id,
                name: itemToEdit.name,
                category: itemToEdit.category,
                quantity: itemToEdit.quantity,
                purchasePrice: itemToEdit.purchasePrice,
                purchaseQuantity: itemToEdit.purchaseQuantity,
                unitType: itemToEdit.unitType
            });
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) return;
            try {
                const itemToRemove = ingredients.find(ing => ing.id === id);
                if (!itemToRemove) return;

                const catalogId = Number(itemToRemove.ingredientId);
                const numericQuantity = parseFloat(itemToRemove.quantity) || 0;

                if (numericQuantity <= 0 || isNaN(catalogId) || catalogId <= 0) {
                    setIngredients(prev => prev.filter(ing => ing.id !== id));
                    return;
                }

                const res = await inventoryService.deleteInventoryItem(catalogId, numericQuantity, token);
                if (res.ok) {
                    await loadInventory();
                } else {
                    alert(res.error || "No se pudo eliminar el ingrediente.");
                }
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("No se pudo eliminar el ingrediente.");
            }
        }
    };

    const handleSaveItem = async (savedItem: any) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) return;

        try {
            const numericQuantity = parseFloat(savedItem.quantity) || 1;
            const purePurchasePrice = savedItem.purchasePrice || 0;
            const purePurchaseQuantity = savedItem.purchaseQuantity || 1;
            let ingredientId = -1;

            if (editingItem && editingItem.id) {
                ingredientId = Number(editingItem.id);
                const upRes = await catalogService.updateIngredient(ingredientId, {
                    name: savedItem.name,
                    category: savedItem.category,
                    purchase_price: purePurchasePrice,
                    purchase_quantity: purePurchaseQuantity,
                    unit_default: savedItem.unitType || 'g',
                    weight_per_unit: 1
                }, token);

                if (!upRes.ok) {
                    const errorMsg = upRes.error || "";
                    if (errorMsg.includes("nombre ya está siendo usado")) {
                        alert("⚠️ Ya existe otro ingrediente con ese nombre. Intenta con uno distinto para evitar confusiones.");
                    } else if (upRes.status === 403 || errorMsg.includes("permiso")) {
                        alert("🚫 No tienes permiso para editar este ingrediente (es un ingrediente global). Solo puedes cambiar su cantidad.");
                    } else {
                        alert(`❌ Error al actualizar catálogo (${upRes.status}). Verifica que todos los campos sean válidos.`);
                    }
                    return;
                }

                const oldQty = parseFloat(editingItem.quantity) || 0;
                if (oldQty > 0) {
                    try {
                        await inventoryService.deleteInventoryItem(ingredientId, oldQty, token);
                    } catch (e) {
                        console.warn("No se pudo restar la cantidad previa.");
                    }
                }
            } else {
                // Modo creación: Buscamos si ya existe por nombre
                const allIngredientsRes = await catalogService.getIngredients(token);
                let found: { id: number, name: string, purchase_price?: number, purchase_quantity?: number } | null = null;
                if (allIngredientsRes.ok && Array.isArray(allIngredientsRes.data)) {
                    // Buscamos coincidencia exacta primero, luego parcial
                    found = allIngredientsRes.data.find((i) => i.name === savedItem.name)
                        || allIngredientsRes.data.find((i) => i.name.toLowerCase() === savedItem.name.toLowerCase()) as any;
                }

                if (found) {
                    ingredientId = found.id;
                } else {
                    const catRes = await catalogService.createIngredient({
                        name: savedItem.name,
                        category: savedItem.category,
                        purchase_price: purePurchasePrice,
                        purchase_quantity: purePurchaseQuantity,
                        unit_default: savedItem.unitType || 'g',
                        weight_per_unit: 1
                    }, token);

                    if (catRes.ok && catRes.data?.ingredient) {
                        ingredientId = catRes.data.ingredient.id;
                    } else {
                        alert("❌ No se pudo crear el ingrediente en el catálogo. " + (catRes.error || ""));
                        return;
                    }
                }
            }

            const res = await inventoryService.createInventoryItem({
                ingredient_id: ingredientId,
                quantity: numericQuantity
            }, token);

            if (res.ok) {
                await loadInventory();
                setIsModalOpen(false);
            } else {
                alert("❌ Error al actualizar el inventario.");
            }
        } catch (error) {
            console.error("Error saving inventory item:", error);
            alert("No se pudo procesar la solicitud.");
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="inventario" />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-3 sm:p-4 md:p-8 pt-16 max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
                    {/* Encabezado principal */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#131613] dark:text-white mb-1">Inventario</h1>
                            <p className="text-sm md:text-base text-[#6c7f6d] dark:text-gray-400">Gestiona y monitorea la frescura de tus ingredientes.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {/* Buscador */}
                            <div className="relative flex-1 min-w-[200px]">
                                <span translate="no" className="material-symbols-outlined notranslate absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar ingrediente..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full transition-all bg-white dark:bg-transparent text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Botón para agregar */}
                            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-bold shadow-md transition-colors">
                                <span translate="no" className="material-symbols-outlined notranslate text-[18px]">add</span>
                                <span className="hidden sm:inline">Agregar</span>
                            </button>
                        </div>
                    </div>

                    {/* Estructura de la tabla */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                        <div className="overflow-x-auto flex-1 flex flex-col">
                            <div className="flex-1 flex flex-col">
                                {/* Encabezados de la tabla */}
                                <div className="flex flex-col sm:grid sm:grid-cols-4 px-6 md:px-8 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-xs font-bold text-gray-400 tracking-wider">
                                    <div>INGREDIENTE</div>
                                    <div>CATEGORÍA</div>
                                    <div>CANTIDAD</div>
                                    <div className="text-left sm:text-right">ACCIONES</div>
                                </div>

                                {/* Contenido */}
                                <div className="flex-1 overflow-y-auto flex flex-col">
                                    {ingredients.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center p-8 text-center">
                                            <p className="text-gray-400 text-sm">No hay ingredientes en el inventario.</p>
                                        </div>
                                    ) : (
                                        ingredients
                                            .filter(ing => {
                                                if (!searchQuery.trim()) return true;
                                                const q = searchQuery.toLowerCase();
                                                return ing.name.toLowerCase().includes(q) || ing.category.toLowerCase().includes(q);
                                            })
                                            .map((ing) => (
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

                        {/* Pie de página con paginación */}
                        <div className="px-4 md:px-8 py-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Mostrando {searchQuery.trim() ? ingredients.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase())).length : ingredients.length} ingredientes</span>
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
