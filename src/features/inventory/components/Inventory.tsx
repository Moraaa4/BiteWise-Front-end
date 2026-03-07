"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import InventoryModal, { type InventoryItem } from '@/features/inventory/components/InventoryModal';

export default function Inventory() {
    const [ingredients, setIngredients] = useState<InventoryItem[]>([
        { id: '1', name: 'Jitomate', category: 'Verduras', quantity: '4 piezas' },
        { id: '2', name: 'Pechuga de pollo', category: 'Carnes', quantity: '1 kg' },
        { id: '3', name: 'Cebolla', category: 'Verduras', quantity: '2 piezas' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

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

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) {
            setIngredients(ingredients.filter(ing => ing.id !== id));
        }
    };

    const handleSaveItem = (savedItem: InventoryItem) => {
        if (editingItem) {
            setIngredients(ingredients.map(ing => ing.id === savedItem.id ? savedItem : ing));
        } else {
            setIngredients([...ingredients, savedItem]);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="inventario" />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 pt-16 md:p-8 max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
                    {/* Top Header Area */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#131613] dark:text-white mb-1">Inventario</h1>
                            <p className="text-sm md:text-base text-[#6c7f6d] dark:text-gray-400">Gestiona y monitorea la frescura de tus ingredientes.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar ingrediente..."
                                    className="pl-11 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full transition-all"
                                />
                            </div>

                            {/* Filters */}
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                <span className="hidden sm:inline">Filtros</span>
                            </button>

                            {/* Add Button */}
                            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-bold shadow-md transition-colors">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                <span className="hidden sm:inline">Agregar</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Shell */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                        <div className="overflow-x-auto flex-1 flex flex-col">
                            <div className="min-w-[700px] flex-1 flex flex-col">
                                {/* Table Headers */}
                                <div className="grid grid-cols-4 px-6 md:px-8 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-xs font-bold text-gray-400 tracking-wider">
                                    <div>INGREDIENTE</div>
                                    <div>CATEGORÍA</div>
                                    <div>CANTIDAD</div>
                                    <div className="text-right">ACCIONES</div>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto flex flex-col">
                                    {ingredients.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center p-8 text-center">
                                            <p className="text-gray-400 text-sm">No hay ingredientes en el inventario.</p>
                                        </div>
                                    ) : (
                                        ingredients.map(ing => (
                                            <div key={ing.id} className="grid grid-cols-4 px-6 md:px-8 py-4 border-b border-gray-50 dark:border-zinc-800/50 items-center text-sm group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">{ing.name}</div>
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    <span className="bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-xs font-medium">{ing.category}</span>
                                                </div>
                                                <div className="text-gray-900 dark:text-gray-100 font-medium">{ing.quantity}</div>
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(ing.id, ing.name)} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors" title="Editar">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(ing.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
