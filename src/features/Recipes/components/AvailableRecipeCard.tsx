"use client";

import React from "react";
import { Clock } from "lucide-react";
import type { AvailableRecipe } from "@/features/Recipes/recetasData";

interface AvailableRecipeCardProps {
    recipe: AvailableRecipe;
    onClick: (recipe: AvailableRecipe) => void;
}

export default function AvailableRecipeCard({ recipe, onClick }: AvailableRecipeCardProps) {
    return (
        <button
            onClick={() => onClick(recipe)}
            className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden text-left hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
        >
            {/* Image placeholder */}
            <div className="relative w-full h-36 bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                <span className="text-gray-300 dark:text-white/30 text-3xl">🍽️</span>

                {/* Badge */}
                <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide">
                    {recipe.ingredientsBadge}
                </span>

                {/* Time */}
                <span className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock size={9} />
                    {recipe.timeMinutes} min
                </span>
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 bg-white dark:bg-background-dark group-hover:bg-emerald-50/50 dark:group-hover:bg-white/5 transition-colors">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{recipe.name}</h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                    {recipe.description}
                </p>
            </div>
        </button>
    );
}
