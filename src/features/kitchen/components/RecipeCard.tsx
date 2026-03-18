"use client";

import React from "react";
import { Clock, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Recipe } from "@/types/global";

interface RecipeCardProps {
    recipe: Recipe;
    isSelected: boolean;
    onSelect: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, isSelected, onSelect }: RecipeCardProps) {
    return (
        <button
            onClick={() => onSelect(recipe)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-150 border ${isSelected ? "bg-[#f4fbf6] border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-white border-transparent hover:border-gray-100 dark:bg-transparent dark:hover:border-white/5"
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-sm font-bold truncate ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-200"
                            }`}
                    >
                        {recipe.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2">

                        {recipe.hasAllIngredients ? (
                            <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                                <CheckCircle2 size={12} />
                                100% ingredientes
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[11px] text-orange-500 font-medium">
                                <AlertCircle size={12} />
                                Falta: {recipe.missingIngredients?.join(", ")}
                            </span>
                        )}
                    </div>
                </div>
                {isSelected && (
                    <ChevronRight size={18} className="text-green-500 flex-shrink-0 ml-3" />
                )}
            </div>
        </button>
    );
}
