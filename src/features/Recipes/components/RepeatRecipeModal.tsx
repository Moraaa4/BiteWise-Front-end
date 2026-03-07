"use client";

import React, { useState } from "react";
import { X, ShoppingCart, CheckCircle2 } from "lucide-react";
import type { HistoryRecipe } from "@/features/Recipes/recetasData";

interface RepeatRecipeModalProps {
    recipe: HistoryRecipe;
    onClose: () => void;
}

export default function RepeatRecipeModal({ recipe, onClose }: RepeatRecipeModalProps) {
    const [status, setStatus] = useState<"idle" | "success">("idle");

    const handleAction = () => {
        const saved = localStorage.getItem("biteWise_shoppingLists");
        let lists = [];
        if (saved) {
            lists = JSON.parse(saved);
        }

        const newList = {
            id: `list-${Date.now()}`,
            name: `Ingredientes: ${recipe.name}`,
            status: "incomplete",
            createdLabel: "Justo ahora",
            progress: 0,
            total: 5
        };
        lists.push(newList);
        localStorage.setItem("biteWise_shoppingLists", JSON.stringify(lists));

        setStatus("success");
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    if (status === "success") {
        return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        ¡Ingredientes Agregados!
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Los ingredientes de <strong>{recipe.name}</strong> se han añadido a tu lista de compras activa.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Repetir Receta
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-4xl mb-4 border border-gray-200 dark:border-white/10 shadow-sm">
                        🍽️
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {recipe.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                        ¿Qué te gustaría hacer con esta receta que cocinaste el {recipe.date}?
                    </p>
                </div>

                <div className="space-y-3 pt-2">
                    <button
                        onClick={handleAction}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={18} />
                        </div>
                        <div className="flex-1">
                            <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Agregar a Lista de Compras</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Añade los ingredientes que te faltan.</p>
                        </div>
                    </button>


                </div>
            </div>
        </div>
    );
}
