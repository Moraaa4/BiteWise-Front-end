"use client";

import React, { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import type { Recipe } from "@/types/global";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import { catalogService } from "@/services/catalog.service";
import { useSearchParams } from "next/navigation";

export default function CocinaView() {
    const searchParams = useSearchParams();
    const recipeIdParam = searchParams.get('recipeId');

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchingRecipes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            // Realistically we want to get matches based on inventory.
            // Using getMatchingRecipes.
            const res = await catalogService.getMatchingRecipes(token);
            let finalRecipes: Recipe[] = [];

            if (res.ok && res.data && Array.isArray(res.data.data)) {
                // Map the matching recipes
                finalRecipes = res.data.data.map((r: any) => ({
                    id: r.id.toString(),
                    name: r.title,
                    time: 30, // Mocked for now
                    calories: 400,
                    difficulty: "Media",
                    servings: 2,
                    hasAllIngredients: r.missingCount === 0,
                    missingIngredients: r.missingCount > 0 ? ["Faltan " + r.missingCount + " ingredientes"] : [],
                    imageUrl: r.image_url,
                    ingredients: r.ingredients?.map((i: any) => ({
                        id: `i-${i.ingredient_id}`,
                        name: i.name,
                        amount: i.quantity,
                        unit: i.unit,
                        available: true // from matching context
                    })) || []
                }));
            }

            if (recipeIdParam) {
                const preset = finalRecipes.find(r => r.id === recipeIdParam);
                if (preset) {
                    setSelectedRecipe(preset);
                } else {
                    // If it's not a matched recipe, let's fetch its specific details so the user can see what they're missing
                    try {
                        if (recipeIdParam.startsWith('ext-')) {
                            const realId = recipeIdParam.replace('ext-', '');
                            const extRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${realId}`);
                            const data = await extRes.json();
                            if (data.meals && data.meals[0]) {
                                const m = data.meals[0];

                                const mappedExtIngredients: typeof finalRecipes[0]['ingredients'] = [];
                                for (let i = 1; i <= 20; i++) {
                                    const ing = m[`strIngredient${i}`];
                                    const measure = m[`strMeasure${i}`];
                                    if (ing && ing.trim()) {
                                        mappedExtIngredients.push({
                                            id: `ext-ing-${i}`,
                                            name: ing.trim(),
                                            amount: measure ? measure.trim() : "1",
                                            unit: "",
                                            available: false
                                        });
                                    }
                                }

                                const extRecipe: Recipe = {
                                    id: `ext-${m.idMeal}`,
                                    name: m.strMeal,
                                    time: 45,
                                    calories: 500,
                                    difficulty: "Media",
                                    servings: 2,
                                    hasAllIngredients: false,
                                    missingIngredients: ["Faltan ingredientes del catálogo global"],
                                    imageUrl: m.strMealThumb,
                                    ingredients: mappedExtIngredients,
                                    externalMealData: m  // Store raw TheMealDB object for import
                                };
                                finalRecipes = [extRecipe, ...finalRecipes];
                                setSelectedRecipe(extRecipe);
                            }
                        } else {
                            const localRes = await catalogService.getRecipeById(Number(recipeIdParam), undefined, token);
                            if (localRes.ok && localRes.data && localRes.data.recipe) {
                                const r = localRes.data.recipe as any;

                                // Provide robust fallback for ingredient fields from local DB
                                const rawIngredients = r.ingredients || r.RecipeIngredients || r.recipe_ingredients || [];

                                const localRecipe: Recipe = {
                                    id: r.id.toString(),
                                    name: r.title,
                                    time: r.time_minutes || 30,
                                    calories: 400,
                                    difficulty: r.difficulty || "Media",
                                    servings: 2,
                                    hasAllIngredients: false,
                                    missingIngredients: ["Faltan ingredientes"],
                                    imageUrl: r.image_url,
                                    ingredients: rawIngredients.map((i: any) => ({
                                        id: `i-${i.ingredient_id || i.id}`,
                                        name: i.name || i.Ingredient?.name || i.ingredient?.name || 'Desconocido',
                                        amount: i.quantity || 1,
                                        unit: i.unit || 'unidad',
                                        available: false
                                    }))
                                };
                                finalRecipes = [localRecipe, ...finalRecipes];
                                setSelectedRecipe(localRecipe);
                            }
                        }
                    } catch (e) {
                        console.error("No se pudo obtener la receta preseleccionada", e);
                    }
                }
            } else {
                if (finalRecipes.length > 0) setSelectedRecipe(finalRecipes[0]);
            }

            // Ensure state is updated
            setRecipes(finalRecipes);
            setLoading(false);
        };
        fetchMatchingRecipes();
    }, []);

    const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeTab="cocina" />

            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title="Tu Cocina" />

                {/* Body */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col md:flex-row gap-6">
                    {loading ? (
                        <div className="w-full flex justify-center items-center">
                            <span className="text-gray-500">Buscando qué puedes cocinar...</span>
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="w-full h-full bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🍳</div>
                                <h3 className="text-lg font-bold text-gray-900">Tu inventario no coincide con ninguna receta</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                    Agrega más ingredientes a tu inventario para ver sugerencias de recetas.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar receta sugerida..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                {filteredRecipes.map(recipe => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        isSelected={selectedRecipe?.id === recipe.id}
                                        onSelect={setSelectedRecipe}
                                    />
                                ))}
                            </div>
                            <div className="w-full md:w-2/3 h-full overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
                                {selectedRecipe ? (
                                    <RecipeDetail recipe={selectedRecipe} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        Selecciona una receta para ver sus detalles
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
