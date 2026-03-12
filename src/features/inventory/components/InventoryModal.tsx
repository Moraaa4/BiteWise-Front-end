"use client";

import React, { useState } from "react";
import { X, Tag, Package, Hash } from "lucide-react";

export interface InventoryItem {
    id: string;
    ingredientId?: string;
    name: string;
    category: string;
    quantity: string; // Used strictly for frontend display/quantity in inventory
    purchasePrice?: number;
    purchaseQuantity?: number;
    unitType?: 'g' | 'ml' | 'unidad';
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
    const [quantity, setQuantity] = useState(initialData?.quantity?.split(' ')[0] || "1");
    const [unitType, setUnitType] = useState<'g' | 'ml' | 'unidad'>(initialData?.unitType || 'g');
    const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice?.toString() || "0");
    const [purchaseQuantity, setPurchaseQuantity] = useState(initialData?.purchaseQuantity?.toString() || "1");

    const handleSave = () => {
        if (!name.trim() || !quantity.trim() || !purchasePrice.trim() || !purchaseQuantity.trim()) return;

        const inventoryData: InventoryItem = {
            id: initialData?.id || Date.now().toString(),
            ingredientId: initialData?.ingredientId,
            name,
            category,
            quantity: quantity,
            purchasePrice: parseFloat(purchasePrice) || 0,
            purchaseQuantity: parseFloat(purchaseQuantity) || 1,
            unitType,
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
                    {/* Nombre del ingrediente */}
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

                    {/* Selector de tipo de unidad estricto */}
                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => setUnitType('g')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${unitType === 'g' ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Gramos (g)
                        </button>
                        <button
                            onClick={() => setUnitType('ml')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${unitType === 'ml' ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Mililitros (ml)
                        </button>
                        <button
                            onClick={() => setUnitType('unidad')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${unitType === 'unidad' ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Unidades
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Costo Total */}
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                                ¿Cuánto pagaste en total?
                            </label>
                            <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                                <span className="px-3 text-xs text-gray-400 dark:text-gray-500 font-bold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Cantidad Total */}
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                                ¿Qué cantidad exacta compraste?
                            </label>
                            <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                                <input
                                    type="number"
                                    value={purchaseQuantity}
                                    onChange={(e) => setPurchaseQuantity(e.target.value)}
                                    className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent"
                                    placeholder="1"
                                />
                                <span className="px-3 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">
                                    {unitType}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        {/* Cantidad para ingresar al inventario */}
                        <div>
                            <label className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1.5 block uppercase tracking-wide">
                                ¿Qué cantidad deseas meter a tu inventario?
                            </label>
                            <div className="flex items-center border border-emerald-200 dark:border-emerald-500/30 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all bg-emerald-50/30 dark:bg-emerald-500/5">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-transparent"
                                    placeholder="Debe ser igual o menor a lo comprado"
                                />
                                <span className="px-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                                    {unitType}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Categoría */}
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
                        disabled={!name.trim() || !quantity.trim() || !purchasePrice.trim() || !purchaseQuantity.trim()}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                    >
                        {isEditing ? "Guardar Cambios" : "Agregar Ingrediente"}
                    </button>
                </div>
            </div>
        </div>
    );
}
