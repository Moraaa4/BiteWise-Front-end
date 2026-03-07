"use client";

import React, { useState } from "react";
import { X, Clock, PenTool } from "lucide-react";
import type { AvailableRecipe } from "@/features/Recipes/recetasData";

interface RecipeModalProps {
    initialData?: AvailableRecipe;
    onSave: (recipe: AvailableRecipe) => void;
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
    const [timeMinutes, setTimeMinutes] = useState<number | "">(initialData?.timeMinutes || "");

    const handleSave = () => {
        if (!name.trim() || !description.trim() || !timeMinutes) return;

        const recipeData: AvailableRecipe = {
            id: initialData?.id || Date.now().toString(),
            name,
            description,
            timeMinutes: Number(timeMinutes),
            ingredientsBadge: initialData?.ingredientsBadge || "0% INGREDIENTES", // default for new
            imageUrl: initialData?.imageUrl,
        };

        onSave(recipeData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? "Editar Receta" : "Nueva Receta"}
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
                            Nombre de la Receta
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <PenTool size={16} />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="Ej. Lasaña Clásica"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Descripción Breve
                        </label>
                        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none h-24"
                                placeholder="Describe el platillo en una o dos líneas..."
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Tiempo de Preparación (Minutos)
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <Clock size={16} />
                            </span>
                            <input
                                type="number"
                                min="1"
                                value={timeMinutes}
                                onChange={(e) => setTimeMinutes(e.target.value ? Number(e.target.value) : "")}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="Ej. 45"
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
                        disabled={!name.trim() || !description.trim() || !timeMinutes}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                    >
                        {isEditing ? "Guardar Cambios" : "Crear Receta"}
                    </button>
                </div>
            </div>
        </div>
    );
}
