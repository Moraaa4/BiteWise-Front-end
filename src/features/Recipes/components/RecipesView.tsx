"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import AvailableRecipeCard from "@/features/Recipes/components/AvailableRecipeCard";
import HistoryTable from "@/features/Recipes/components/HistoryTable";
import { catalogService } from "@/services/catalog.service";
import {
    HISTORY_RECIPES,
    type AvailableRecipe,
    type HistoryRecipe,
} from "@/features/Recipes/recetasData";
import RecipeModal from "@/features/Recipes/components/RecipeModal";
import RepeatRecipeModal from "@/features/Recipes/components/RepeatRecipeModal";

import { useRouter } from "next/navigation";

export default function RecetasView() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<AvailableRecipe[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<AvailableRecipe | undefined>();
    const [repeatRecipe, setRepeatRecipe] = useState<HistoryRecipe | undefined>();

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            let currentRecipes: AvailableRecipe[] = [];

            // 1. Fetch fast local recipes first
            const resLocal = await catalogService.getRecipes(token);
            if (resLocal.ok && resLocal.data && resLocal.data.recipes) {
                const mappedLocal = resLocal.data.recipes.map((r: any) => ({
                    id: r.id.toString(),
                    name: r.title,
                    description: r.instructions?.substring(0, 100) + "...",
                    timeMinutes: 30,
                    ingredientsBadge: "LOCAL",
                    imageUrl: r.image_url
                }));
                currentRecipes = mappedLocal;
                setRecipes([...currentRecipes]); // Render immediately
            }

            // 2. Fetch slow external recipes in the background to avoid freezing the screen
            catalogService.getRegionalRecipes(token).then((resExternal) => {
                if (resExternal.ok && resExternal.data && resExternal.data.recipes) {
                    const mappedExternal = resExternal.data.recipes.map((r: any) => ({
                        id: `ext-${r.id}`,
                        name: r.title,
                        description: `${r.category || 'Platillo'} | ${r.region || 'Global'}`,
                        timeMinutes: 45,
                        ingredientsBadge: "THEMEALDB",
                        imageUrl: r.image_url
                    }));
                    // Append and re-render only when ready, avoiding duplicates in Strict Mode
                    setRecipes(prev => {
                        const existingIds = new Set(prev.map(p => p.id));
                        const uniqueNew = mappedExternal.filter((m: any) => !existingIds.has(m.id));
                        return [...prev, ...uniqueNew];
                    });
                }
            }).catch(console.error);
        };
        fetchRecipes();
    }, []);

    const handleRecipeClick = (recipe: AvailableRecipe) => {
        router.push(`/recipes-details?id=${recipe.id}`);
    };

    const handleCreate = () => {
        setEditingRecipe(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (recipe: AvailableRecipe) => {
        setEditingRecipe(recipe);
        setIsModalOpen(true);
    };

    const handleDelete = (recipeToDelete: AvailableRecipe) => {
        if (confirm(`¿Estás seguro de que quieres eliminar la receta "${recipeToDelete.name}"?`)) {
            setRecipes(recipes.filter((r: AvailableRecipe) => r.id !== recipeToDelete.id));
        }
    };

    const handleSaveRecipe = (savedRecipe: AvailableRecipe) => {
        if (editingRecipe) {
            setRecipes(recipes.map((r: AvailableRecipe) => r.id === savedRecipe.id ? savedRecipe : r));
        } else {
            setRecipes([savedRecipe, ...recipes]);
        }
    };

    const handleRepeat = (recipe: HistoryRecipe) => {
        setRepeatRecipe(recipe);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="recetas" />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header title="Recetas Disponibles" />

                {/* Content */}
                <main className="flex-1 px-3 sm:px-4 md:px-8 py-7 flex flex-col gap-8 w-full max-w-7xl mx-auto">

                    {/* Available Recipes */}
                    <section>
                        <div className="flex items-baseline justify-between mb-1">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Recetas Disponibles</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleCreate}
                                    className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-md transition-colors"
                                >
                                    + Agregar Receta
                                </button>
                                <button className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-500 font-semibold hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                                    Ver todos →
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                            Basado en lo que tienes en tu despensa ahora mismo.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {recipes.length === 0 ? (
                                <div className="col-span-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                                    No hay recetas disponibles. ¡Agrega la primera!
                                </div>
                            ) : (
                                recipes.map((recipe: AvailableRecipe) => (
                                    <AvailableRecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        onClick={handleRecipeClick}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </section>

                    {/* Cooking History */}
                    <section>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Historial de Cocina</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                            Tus creaciones recientes. ¿Quieres repetir alguna?
                        </p>
                        <HistoryTable recipes={[]} onRepeat={handleRepeat} />
                    </section>
                </main>

                {/* Recipe Modal */}
                {isModalOpen && (
                    <RecipeModal
                        initialData={editingRecipe}
                        onSave={handleSaveRecipe}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

                {/* Repeat History Recipe Modal */}
                {repeatRecipe && (
                    <RepeatRecipeModal
                        recipe={repeatRecipe}
                        onClose={() => setRepeatRecipe(undefined)}
                    />
                )}

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
