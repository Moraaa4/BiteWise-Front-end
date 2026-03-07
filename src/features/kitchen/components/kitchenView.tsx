"use client";

import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import type { Recipe } from "@/types/global";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
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
                <Header title="Tu Cocina" />

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
