"use client";

import React, { useState } from "react";
import { X, Tag, Package, Hash } from "lucide-react";

export interface InventoryItem {
    id: string;
    ingredientId?: string;
    name: string;
    category: string;
    quantity: string;
}

interface InventoryModalProps {
    initialData?: InventoryItem;
    onSave: (item: InventoryItem) => void;
    onClose: () => void;
}

const CATEGORIES = [
    "Verduras",
    "Frutas",
    "Carnes",
    "Lácteos",
    "Especias",
    "Granos",
    "General"
];

export default function InventoryModal({
    initialData,
    onSave,
    onClose,
}: InventoryModalProps) {
    const isEditing = !!initialData;
    const [name, setName] = useState(initialData?.name || "");
    const [category, setCategory] = useState(initialData?.category || "General");
    const [quantity, setQuantity] = useState(initialData?.quantity || "1");

    const handleSave = () => {
        if (!name.trim() || !quantity.trim()) return;

        const inventoryData: InventoryItem = {
            id: initialData?.id || Date.now().toString(),
            ingredientId: initialData?.ingredientId,
            name,
            category,
            quantity,
        };

        onSave(inventoryData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? "Editar Ingrediente" : "Nuevo Ingrediente"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Name */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Nombre del Ingrediente
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <Tag size={16} />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="Ej. Tomates"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Categoría
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <Package size={16} />
                            </span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-background-dark appearance-none shrink-0"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Cantidad
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <Hash size={16} />
                            </span>
                            <input
                                type="text"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="Ej. 1 kg, 3 piezas"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || !quantity.trim()}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                    >
                        {isEditing ? "Guardar Cambios" : "Agregar Ingrediente"}
                    </button>
                </div>
            </div>
        </div>
    );
}
