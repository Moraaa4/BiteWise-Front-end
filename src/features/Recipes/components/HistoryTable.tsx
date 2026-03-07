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
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {["RECETA", "FECHA", "DIFICULTAD", "VALORACIÓN", "ACCIÓN"].map((col) => (
                    <span key={col} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                        {col}
                    </span>
                ))}
            </div>

            {/* Rows */}
            {recipes.map((recipe, idx) => (
                <div
                    key={recipe.id}
                    className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center ${idx < recipes.length - 1 ? "border-b border-gray-100 dark:border-zinc-800" : ""
                        } hover:bg-gray-50/60 dark:hover:bg-zinc-800/30 transition-colors`}
                >
                    {/* Recipe name + avatar placeholder */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <span className="text-gray-300 dark:text-zinc-600 text-base">🍽️</span>
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
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                        <RefreshCw size={11} />
                        Repetir
                    </button>
                </div>
            ))}
        </div>
    );
}
