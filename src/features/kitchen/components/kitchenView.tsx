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
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="w-full h-full bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🍳</div>
                            <h3 className="text-lg font-bold text-gray-900">Tu cocina está vacía</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                Pronto conectaremos con el servidor para sugerirte las mejores recetas basadas en tu inventario.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
