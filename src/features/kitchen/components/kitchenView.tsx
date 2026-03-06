"use client";

import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import type { Recipe } from "@/types/global";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import { READY_RECIPES, ALMOST_READY_RECIPES } from "./kitchendata";

export default function CocinaView() {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(READY_RECIPES[0]);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeTab="cocina" />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Tu Cocina</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            ¿Qué vamos a cocinar hoy con lo que tienes?
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar recetas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent w-52 transition-all"
                            />
                        </div>
                        <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Bell size={16} className="text-gray-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            U
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 flex gap-5 p-6 overflow-hidden">
                    {/* Recipe List */}
                    <div className="w-72 flex flex-col gap-4 overflow-y-auto shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <span>✅</span>
                                    <h2 className="text-sm font-bold text-gray-800">Listas para cocinar</h2>
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                    {READY_RECIPES.length} recetas
                                </span>
                            </div>
                            <div className="py-1">
                                {READY_RECIPES.map((recipe) => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        isSelected={selectedRecipe?.id === recipe.id}
                                        onSelect={setSelectedRecipe}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <span>🕐</span>
                                    <h2 className="text-sm font-bold text-gray-800">Casi listas</h2>
                                </div>
                                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                    Faltan 1-2
                                </span>
                            </div>
                            <div className="py-1">
                                {ALMOST_READY_RECIPES.map((recipe) => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        isSelected={selectedRecipe?.id === recipe.id}
                                        onSelect={setSelectedRecipe}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="flex-1 flex overflow-hidden">
                        {selectedRecipe ? (
                            <RecipeDetail recipe={selectedRecipe} />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                Selecciona una receta para ver los detalles
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
