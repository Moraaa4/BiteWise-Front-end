"use client";

import React from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import AvailableRecipeCard from "@/features/Recipes/components/AvailableRecipeCard";
import HistoryTable from "@/features/Recipes/components/HistoryTable";
import {
    AVAILABLE_RECIPES,
    HISTORY_RECIPES,
    type AvailableRecipe,
    type HistoryRecipe,
} from "@/features/Recipes/recetasData";

export default function RecetasView() {
    const handleRecipeClick = (recipe: AvailableRecipe) => {
        // Navigate to recipe detail — to be implemented
        console.log("Ver receta:", recipe.id);
    };

    const handleRepeat = (recipe: HistoryRecipe) => {
        // Repeat recipe logic — to be implemented
        console.log("Repetir receta:", recipe.id);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="recetas" />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header />

                {/* Content */}
                <main className="flex-1 px-4 md:px-8 py-7 flex flex-col gap-8 w-full max-w-7xl mx-auto">

                    {/* Available Recipes */}
                    <section>
                        <div className="flex items-baseline justify-between mb-1">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Recetas Disponibles</h2>
                            <button className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                                Ver todos →
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                            Basado en lo que tienes en tu despensa ahora mismo.
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                            {AVAILABLE_RECIPES.map((recipe) => (
                                <AvailableRecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onClick={handleRecipeClick}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Cooking History */}
                    <section>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Historial de Cocina</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                            Tus creaciones recientes. ¿Quieres repetir alguna?
                        </p>
                        <HistoryTable recipes={HISTORY_RECIPES} onRepeat={handleRepeat} />
                    </section>
                </main>

                {/* Footer */}
                <footer className="py-4 text-center">
                    <p className="text-xs text-gray-400">
                        © 2024 <span className="font-semibold">BiteWise</span>. Come mejor, desperdicia menos.
                    </p>
                </footer>
            </div>
        </div>
    );
}
