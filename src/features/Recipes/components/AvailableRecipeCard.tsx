"use client";

import React from "react";
import { Clock, Edit2, Trash2 } from "lucide-react";
import type { AvailableRecipe } from "@/features/Recipes/recetasData";

interface AvailableRecipeCardProps {
    recipe: AvailableRecipe;
    onClick: (recipe: AvailableRecipe) => void;
    onEdit?: (recipe: AvailableRecipe) => void;
    onDelete?: (recipe: AvailableRecipe) => void;
}

export default function AvailableRecipeCard({ recipe, onClick, onEdit, onDelete }: AvailableRecipeCardProps) {
    return (
        <div
            onClick={() => onClick(recipe)}
            className="cursor-pointer bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden text-left hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 hover:-translate-y-0.5 transition-all duration-200 flex flex-col group relative"
        >
            {/* Image placeholder or Real image */}
            <div className="relative w-full h-36 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-300 dark:text-white/30 text-3xl">🍽️</span>
                )}

                {/* Badge */}
                <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide z-10">
                    {recipe.ingredientsBadge}
                </span>

                {/* Actions (visible on hover) */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
                            className="p-1.5 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-md text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
                            title="Editar"
                        >
                            <Edit2 size={12} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(recipe); }}
                            className="p-1.5 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-md text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-sm"
                            title="Eliminar"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-3 flex flex-col gap-1 bg-white dark:bg-background-dark group-hover:bg-emerald-50/50 dark:group-hover:bg-white/5 transition-colors">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{recipe.name}</h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                    {recipe.description}
                </p>
            </div>
        </div>
    );
}
