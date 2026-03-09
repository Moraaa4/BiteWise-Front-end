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
import { STORAGE_KEYS } from "@/config/constants";

export default function RecetasView() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<AvailableRecipe[]>([]);
    const [cookHistory, setCookHistory] = useState<HistoryRecipe[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<AvailableRecipe | undefined>();
    const [repeatRecipe, setRepeatRecipe] = useState<HistoryRecipe | undefined>();
    const [showAll, setShowAll] = useState(false);
    const [loadingExternal, setLoadingExternal] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) return;

            let currentRecipes: AvailableRecipe[] = [];

            // 1. Primero traemos rápido las recetas locales
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
                setRecipes([...currentRecipes]); // Las mostramos de inmediato para que no se vea vacío
            }

            // 2. Buscamos recetas regionales y aleatorias al mismo tiempo (multitasking)
            const fetchExternal = async () => {
                setLoadingExternal(true);
                try {
                    const [resRegional, resRandom] = await Promise.allSettled([
                        catalogService.getRegionalRecipes(token!),
                        catalogService.getRandomExternalRecipes(token!),
                    ]);

                    interface RawExternalRecipe {
                        id?: string;
                        idMeal?: string;
                        title?: string;
                        strMeal?: string;
                        category?: string;
                        strCategory?: string;
                        region?: string;
                        image_url?: string;
                        strMealThumb?: string;
                    }

                    let allExternal: RawExternalRecipe[] = [];
                    if (resRegional.status === 'fulfilled') {
                        if (resRegional.value.ok && resRegional.value.data) {
                            allExternal.push(...(resRegional.value.data.recipes || []));
                        } else if (resRegional.value.status === 401 || resRegional.value.status === 403) {
                            console.error('Error de autenticación en Recetas Regionales:', resRegional.value.status);
                        }
                    }
                    if (resRandom.status === 'fulfilled') {
                        if (resRandom.value.ok && resRandom.value.data) {
                            allExternal.push(...(resRandom.value.data.recipes || []));
                        } else if (resRandom.value.status === 401 || resRandom.value.status === 403) {
                            console.error('Error de autenticación en Recetas Aleatorias:', resRandom.value.status);
                        }
                    }

                    // Quitamos las repetidas por ID
                    const seen = new Set<string>();
                    const deduped = allExternal.filter((r) => {
                        const key = r.id || r.idMeal || "";
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });

                    if (deduped.length > 0) {
                        const mappedExternal = deduped.map((r) => ({
                            id: `ext-${r.id || r.idMeal}`,
                            name: r.title || r.strMeal || "Receta desconocida",
                            description: r.category ? `${r.category} | ${r.region || 'Global'}` : (r.strCategory || 'Platillo'),
                            timeMinutes: 45,
                            ingredientsBadge: "THEMEALDB",
                            imageUrl: r.image_url || r.strMealThumb
                        }));
                        setRecipes(prev => {
                            const existingIds = new Set(prev.map(p => p.id));
                            const uniqueNew = mappedExternal.filter((m) => !existingIds.has(m.id));
                            return [...prev, ...uniqueNew];
                        });
                    }
                } catch (err) {
                    console.error("Error fetching external recipes:", err);
                } finally {
                    setLoadingExternal(false);
                }
            };
            fetchExternal();
        };
        fetchRecipes();

        // Cargamos el historial de lo que ya se cocinó
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.COOK_HISTORY);
            if (saved) setCookHistory(JSON.parse(saved));
        } catch (e) { console.error('Error loading cook history:', e); }
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

    const handleDelete = async (recipeToDelete: AvailableRecipe) => {
        if (recipeToDelete.ingredientsBadge !== "LOCAL") {
            alert("Solo puedes eliminar recetas locales creadas por ti.");
            return;
        }

        if (confirm(`¿Estás seguro de que quieres eliminar la receta "${recipeToDelete.name}"?`)) {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) return;

            try {
                const res = await catalogService.deleteRecipe(Number(recipeToDelete.id), token);
                if (res.ok) {
                    setRecipes(recipes.filter((r: AvailableRecipe) => r.id !== recipeToDelete.id));
                } else {
                    alert("Error al eliminar la receta del servidor.");
                }
            } catch (err) {
                console.error(err);
                alert("Ocurrió un error al intentar eliminar la receta.");
            }
        }
    };

    const handleSaveRecipe = async (savedRecipe: AvailableRecipe) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) return;

        try {
            if (editingRecipe) {
                // Lógica para actualizar si se necesitara, por ahora solo crear
                const payload = {
                    title: savedRecipe.name,
                    instructions: savedRecipe.instructions || "",
                    image_url: savedRecipe.imageUrl,
                    ingredients: savedRecipe.ingredients?.map(ing => ({
                        ingredient_id: ing.ingredient_id,
                        required_quantity: ing.required_quantity
                    })) || []
                };
                const res = await catalogService.updateRecipe(Number(savedRecipe.id), payload, token);
                if (res.ok) {
                    // Update local state or re-fetch
                    setRecipes(recipes.map((r: AvailableRecipe) => r.id === savedRecipe.id ? savedRecipe : r));
                }
            } else {
                const payload = {
                    title: savedRecipe.name,
                    instructions: savedRecipe.instructions || "",
                    image_url: savedRecipe.imageUrl,
                    ingredients: savedRecipe.ingredients?.map(ing => ({
                        ingredient_id: ing.ingredient_id,
                        required_quantity: ing.required_quantity
                    })) || []
                };

                const res = await catalogService.createRecipe(payload, token);
                if (res.ok && res.data) {
                    // ¡Listo! Volvemos a pedir las recetas para tener los ID reales y las etiquetas
                    const resLocal = await catalogService.getRecipes(token);
                    if (resLocal.ok && resLocal.data && resLocal.data.recipes) {
                        const mappedLocal = resLocal.data.recipes.map((r: any) => ({
                            id: r.id.toString(),
                            name: r.title,
                            description: r.instructions?.substring(0, 100) + "...",
                            timeMinutes: 30,
                            ingredientsBadge: "LOCAL",
                            imageUrl: r.image_url,
                            instructions: r.instructions,
                            ingredients: r.ingredients?.map((ri: any) => ({
                                ingredient_id: ri.ingredient_id,
                                name: ri.name,
                                required_quantity: ri.quantity,
                                unit: ri.unit
                            }))
                        }));

                        // Mezclamos con las recetas externas que ya teníamos
                        setRecipes(prev => {
                            const external = prev.filter(p => p.ingredientsBadge === "THEMEALDB");
                            return [...mappedLocal, ...external];
                        });
                    }
                } else {
                    alert("Error al guardar la receta en el servidor.");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión al guardar la receta.");
        }
    };

    const handleRepeat = (recipe: HistoryRecipe) => {
        setRepeatRecipe(recipe);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="recetas" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Recetas Disponibles" />

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">

                        {/* Recetas Disponibles */}
                        <section>
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 sm:mb-1 gap-2 sm:gap-0">
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recetas Disponibles</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleCreate}
                                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        + Agregar Receta
                                    </button>
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-500 font-semibold hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                    >
                                        {showAll ? 'Ver menos ←' : 'Ver todos →'}
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                                Basado en lo que tienes en tu despensa ahora mismo.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {recipes.length === 0 && !loadingExternal ? (
                                    <div className="col-span-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                                        No hay recetas disponibles. ¡Agrega la primera!
                                    </div>
                                ) : (
                                    (showAll ? recipes : recipes.slice(0, 4)).map((recipe: AvailableRecipe) => (
                                        <AvailableRecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            onClick={handleRecipeClick}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                                {loadingExternal && (
                                    <div className="col-span-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
                                        <span className="animate-spin inline-block w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"></span>
                                        Cargando recetas externas...
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Historial de Cocina */}
                        <section>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Historial de Cocina</h2>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                                Tus creaciones recientes. ¿Quieres repetir alguna?
                            </p>
                            <HistoryTable recipes={cookHistory} onRepeat={handleRepeat} />
                        </section>
                    </div>
                </main>

                {/* Modal de Receta */}
                {isModalOpen && (
                    <RecipeModal
                        initialData={editingRecipe}
                        onSave={handleSaveRecipe}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

                {/* Modal para Repetir Receta del Historial */}
                {repeatRecipe && (
                    <RepeatRecipeModal
                        recipe={repeatRecipe}
                        onClose={() => setRepeatRecipe(undefined)}
                    />
                )}

                {/* Pie de página */}
                <footer className="py-4 text-center">
                    <p className="text-xs text-gray-400">
                        © 2024 <span className="font-semibold">BiteWise</span>. Come mejor, desperdicia menos.
                    </p>
                </footer>
            </div>
        </div>
    );
}
