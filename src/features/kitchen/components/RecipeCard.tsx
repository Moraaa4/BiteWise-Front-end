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
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 ${isSelected ? "bg-green-50" : "hover:bg-gray-50"
                }`}
        >
            <div className="flex items-center gap-3">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-xl">
                        🍲
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <p
                        className={`text-sm font-semibold truncate ${isSelected ? "text-green-800" : "text-gray-800"
                            }`}
                    >
                        {recipe.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={11} />
                            {recipe.time} min
                        </span>
                        {recipe.hasAllIngredients ? (
                            <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                                <CheckCircle2 size={11} />
                                100% ingredientes
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[11px] text-orange-500 font-medium">
                                <AlertCircle size={11} />
                                Falta: {recipe.missingIngredients?.join(", ")}
                            </span>
                        )}
                    </div>
                </div>
                {isSelected && (
                    <ChevronRight size={16} className="text-green-500 flex-shrink-0 ml-2" />
                )}
            </div>
        </button>
    );
}
