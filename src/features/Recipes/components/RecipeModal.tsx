"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, PenTool, Plus, Trash2, Search, Info } from "lucide-react";
import type { AvailableRecipe } from "@/features/Recipes/recetasData";
import { catalogService, type Ingredient } from "@/services/catalog.service";

interface RecipeModalProps {
    initialData?: AvailableRecipe;
    onSave: (recipe: AvailableRecipe) => Promise<void> | void;
    onClose: () => void;
}

export default function RecipeModal({
    initialData,
    onSave,
    onClose,
}: RecipeModalProps) {
    const isEditing = !!initialData;
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [instructions, setInstructions] = useState(initialData?.instructions || "");
    const [servings, setServings] = useState(initialData?.servings || "1-2");

    // Ingredients state
    const [selectedIngredients, setSelectedIngredients] = useState<any[]>(initialData?.ingredients || []);
    const [catalogIngredients, setCatalogIngredients] = useState<Ingredient[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [loadingIngredients, setLoadingIngredients] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCatalog = async () => {
            setLoadingIngredients(true);
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await catalogService.getIngredients(token);
            if (res.ok && res.data) {
                setCatalogIngredients(res.data);
            }
            setLoadingIngredients(false);
        };
        fetchCatalog();
    }, []);

    const handleAddIngredient = (ing: Ingredient) => {
        if (selectedIngredients.some(si => si.ingredient_id === ing.id)) return;

        setSelectedIngredients([
            ...selectedIngredients,
            {
                ingredient_id: ing.id,
                name: ing.name,
                required_quantity: 1,
                unit: ing.unit_default || 'g'
            }
        ]);
        setSearchQuery("");
        setIsSearching(false);
    };

    const handleRemoveIngredient = (id: number) => {
        setSelectedIngredients(selectedIngredients.filter(si => si.ingredient_id !== id));
    };

    const handleUpdateQuantity = (id: number, qty: number) => {
        setSelectedIngredients(selectedIngredients.map(si =>
            si.ingredient_id === id ? { ...si, required_quantity: qty } : si
        ));
    };

    const handleSave = async () => {
        if (!name.trim() || !instructions.trim() || selectedIngredients.length === 0) return;

        setSaving(true);
        try {
            const recipeData: AvailableRecipe = {
                id: initialData?.id || Date.now().toString(),
                name,
                description,
                instructions,
                servings,
                timeMinutes: 30, // Default value since it's removed from UI
                ingredientsBadge: "LOCAL",
                imageUrl: initialData?.imageUrl || "/platillo-pre.png",
                ingredients: selectedIngredients
            };

            await onSave(recipeData);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const filteredCatalog = catalogIngredients.filter(ing =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedIngredients.some(si => si.ingredient_id === ing.id)
    ).slice(0, 5);

    const isFormValid = name.trim() !== "" && instructions.trim() !== "" && selectedIngredients.length > 0;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {isEditing ? "Editar Receta" : "Nueva Receta"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">Completa los detalles para tu creación culinaria</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest px-1">Nombre</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                                    <PenTool size={16} />
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                                    placeholder="Ej. Tacos de Pastor"
                                />
                            </div>
                        </div>

                        {/* Servings */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest px-1">Porciones</label>
                            <select
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm focus:border-emerald-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="1-2" className="bg-white dark:bg-zinc-900">1-2 personas</option>
                                <option value="3-4" className="bg-white dark:bg-zinc-900">3-4 personas</option>
                                <option value="5-6" className="bg-white dark:bg-zinc-900">5-6 personas</option>
                                <option value="7-8" className="bg-white dark:bg-zinc-900">7-8 personas</option>
                            </select>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest px-1">Ingredientes</label>

                        {/* Selected List */}
                        <div className="space-y-2">
                            {selectedIngredients.map((ing) => (
                                <div key={ing.ingredient_id} className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-500/5 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 animate-in zoom-in-95 duration-200">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">{ing.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={ing.required_quantity}
                                            onChange={(e) => handleUpdateQuantity(ing.ingredient_id, Number(e.target.value))}
                                            className="w-16 px-2 py-1 bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-center dark:text-white outline-none focus:border-emerald-500"
                                        />
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold w-8">{ing.unit}</span>
                                        <button
                                            onClick={() => handleRemoveIngredient(ing.ingredient_id)}
                                            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onFocus={() => setIsSearching(true)}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:border-emerald-500 transition-all dark:text-white"
                                placeholder="Busca un ingrediente en tu catálogo..."
                            />

                            {/* Dropdown Results */}
                            {isSearching && searchQuery.trim() !== "" && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-2xl z-10 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                    {filteredCatalog.length > 0 ? (
                                        filteredCatalog.map(ing => (
                                            <button
                                                key={ing.id}
                                                onClick={() => handleAddIngredient(ing)}
                                                className="w-full flex items-center justify-between px-5 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-left transition-colors border-b border-gray-50 dark:border-zinc-700/50 last:border-0"
                                            >
                                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">{ing.name}</span>
                                                <Plus size={16} className="text-emerald-500" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-5 text-center">
                                            <p className="text-xs text-gray-400">No hay coincidencias en tu catálogo</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {isSearching && (
                            <div className="fixed inset-0 z-0" onClick={() => setIsSearching(false)} />
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest px-1">Pasos de Preparación</label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-3xl text-sm focus:border-emerald-500 outline-none transition-all dark:text-white resize-none h-32 custom-scrollbar"
                            placeholder="1. Pica la cebolla...&#10;2. Fríe la carne...&#10;3. Sirve con cilantro."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isFormValid || saving}
                            className="flex-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 px-8 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isEditing ? "Guardar Cambios" : "Crear Receta"
                            )}
                        </button>
                    </div>
                    {!isFormValid && (
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center mt-3 flex items-center justify-center gap-1.5 font-medium">
                            <Info size={12} />
                            Ingresa nombre, pasos y al menos 1 ingrediente para continuar
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
