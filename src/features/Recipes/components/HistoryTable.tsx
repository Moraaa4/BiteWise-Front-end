"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import StarRating from "@/features/Recipes/components/StarRating";
import type { HistoryRecipe, Difficulty } from "@/features/Recipes/recetasData";

interface HistoryTableProps {
    recipes: HistoryRecipe[];
    onRepeat: (recipe: HistoryRecipe) => void;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
    FÁCIL: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    MEDIO: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    DIFÍCIL: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function HistoryTable({ recipes, onRepeat }: HistoryTableProps) {
    return (
        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="flex flex-col sm:grid sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                {["RECETA", "FECHA", "DIFICULTAD", "VALORACIÓN", "ACCIÓN"].map((col) => (
                    <span key={col} className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                        {col}
                    </span>
                ))}
            </div>

            {/* Rows */}
            {recipes.map((recipe, idx) => (
                <div
                    key={recipe.id}
                    className={`flex flex-col sm:grid sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-4 items-start sm:items-center ${idx < recipes.length - 1 ? "border-b border-gray-100 dark:border-white/10" : ""
                        } hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors`}
                >
                    {/* Recipe name + avatar placeholder */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <span className="text-gray-300 dark:text-white/30 text-base">🍽️</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{recipe.name}</span>
                    </div>

                    {/* Date */}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{recipe.date}</span>

                    {/* Difficulty */}
                    <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${DIFFICULTY_STYLES[recipe.difficulty]
                            }`}
                    >
                        {recipe.difficulty}
                    </span>

                    {/* Rating */}
                    <StarRating rating={recipe.rating} />

                    {/* Action */}
                    <button
                        onClick={() => onRepeat(recipe)}
                        className="flex items-center justify-center sm:justify-start gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto sm:shrink-0"
                    >
                        <RefreshCw size={11} />
                        Repetir
                    </button>
                </div>
            ))}
        </div>
    );
}
