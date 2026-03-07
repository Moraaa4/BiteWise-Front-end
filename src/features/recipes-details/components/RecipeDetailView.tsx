"use client";

import React, { useState } from "react";
import { ArrowLeft, Clock, Users, ShoppingBag, PlayCircle } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import IngredientRow from "@/features/recipes-details/components/IngredientRow";
import { MOCK_RECIPE_DETAIL } from "@/features/recipes-details/recetaDetalleData";

export default function RecipeDetailView() {
    const recipe = MOCK_RECIPE_DETAIL;

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="recetas" />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header />
                {/* Breadcrumb header */}
                <header className="bg-white dark:bg-background-dark border-b border-gray-200 dark:border-white/10 px-6 py-3 flex items-center gap-2 shrink-0">
                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Recetas</span>
                    <span className="text-xs text-gray-300 dark:text-white/30">/</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">{recipe.name}</span>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {/* Hero image area */}
                    <div className="relative h-56 bg-gray-200 dark:bg-white/5 overflow-hidden">
                        {/* Image placeholder — swap for <Image> when backend is connected */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/5 dark:to-white/10 border-b border-white/10">
                            <span className="text-gray-400 dark:text-white/20 text-5xl">🍽️</span>
                        </div>

                        {/* Dark overlay for text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Tag */}
                        <div className="absolute top-4 left-4">
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                                {recipe.tag}
                            </span>
                        </div>

                        {/* Title + meta */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <h1 className="text-white text-2xl font-bold drop-shadow-md leading-tight">
                                {recipe.name}
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-white/80 text-xs">
                                    <Users size={12} />
                                    {recipe.portions} porciones
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6 max-w-2xl mx-auto w-full">
                        {/* Ingredients section */}
                        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden mb-6">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                    Ingredientes (en inventario)
                                </h2>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {recipe.inventoryCount}/{recipe.totalCount} ITEMS
                                </span>
                            </div>
                            <div className="px-5 py-1">
                                {recipe.ingredients.length === 0 ? (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
                                        Cargando ingredientes...
                                    </p>
                                ) : (
                                    recipe.ingredients.map((ingredient) => (
                                        <IngredientRow key={ingredient.id} ingredient={ingredient} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom action bar */}
                <div className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <Clock size={13} className="text-gray-400 dark:text-gray-500" />
                        Tiempo aproximado: {recipe.timeMinutes} min
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                            <ShoppingBag size={15} />
                            Comprar Ingredientes
                        </button>
                        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none">
                            <PlayCircle size={15} />
                            ¡Empezar a cocinar!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
