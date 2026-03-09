"use client";

import React, { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import type { Recipe } from "@/types/global";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import { catalogService } from "@/services/catalog.service";
import { inventoryService } from "@/services/inventory.service";
import { useSearchParams, useRouter } from "next/navigation";
import { API_CONFIG, STORAGE_KEYS } from "@/config/constants";

interface CookingSession {
    recipeId: string;
    recipeName: string;
    imageUrl: string;
    totalSteps: number;
    completedStepIds: string[];
    isCompleted: boolean;
    lastUpdated: number;
    instructions: string;
}

export default function CocinaView() {
    const searchParams = useSearchParams();
    const recipeIdParam = searchParams.get('recipeId');

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [cookingSessions, setCookingSessions] = useState<CookingSession[]>([]);
    const router = useRouter();

    // Cargamos las sesiones de cocina que guardamos en el navegador
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.COOKING_SESSIONS);
            if (raw) {
                const sessions: Record<string, CookingSession> = JSON.parse(raw);
                const list = Object.values(sessions)
                    .sort((a, b) => b.lastUpdated - a.lastUpdated);
                setCookingSessions(list);
            }
        } catch { /* si falla, no pasa nada */ }
    }, []);

    useEffect(() => {
        const fetchMatchingRecipes = async () => {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) {
                setLoading(false);
                return;
            }
            // Traemos las recetas y el inventario para ver qué podemos cocinar
            const [res, invRes] = await Promise.all([
                catalogService.getMatchingRecipes(token),
                inventoryService.getInventory(token)
            ]);

            let finalRecipes: Recipe[] = [];
            const inventory = (invRes.ok && Array.isArray((invRes.data as any)?.items)) ? (invRes.data as any).items : [];

            // Mapa por ID
            const inventoryMap = new Map<number, number>(inventory.map((item: any) => [
                Number(item.ingredient_id || item.ingredients?.id),
                Number(item.current_quantity || item.quantity || 0)
            ]));

            // Mapa por Nombre (Normalizado) como respaldo
            const inventoryByNameMap = new Map<string, number>();
            inventory.forEach((item: any) => {
                const name = (item.ingredients?.name || item.name || '').toLowerCase().trim();
                const qty = Number(item.current_quantity || item.quantity || 0);
                if (name) {
                    const current = inventoryByNameMap.get(name) || 0;
                    inventoryByNameMap.set(name, current + qty);
                }
            });

            if (res.ok && res.data && Array.isArray(res.data.data)) {
                // Mapeamos las recetas que coinciden
                finalRecipes = res.data.data.map((r: any) => ({
                    id: r.id.toString(),
                    name: r.title,
                    time: r.time_minutes || 30, // Si no hay tiempo, ponemos 30 por defecto
                    calories: 400,
                    difficulty: r.difficulty || "Media",
                    servings: r.servings || 2,
                    instructions: r.instructions,
                    hasAllIngredients: r.missingCount === 0,
                    missingIngredients: r.missingCount > 0 ? ["Faltan " + r.missingCount + " ingredientes"] : [],
                    imageUrl: r.image_url,
                    ingredients: r.ingredients?.map((i: any) => {
                        const ingId = Number(i.ingredient_id);
                        const ingName = (i.name || i.Ingredient?.name || '').toLowerCase().trim();
                        const requiredQty = Number(i.required_quantity || i.quantity || 1);

                        // Buscamos por ID, y si no, por nombre (respaldo)
                        let availableQty = Number(inventoryMap.get(ingId) || 0);
                        if (availableQty < requiredQty && ingName) {
                            availableQty = Math.max(availableQty, inventoryByNameMap.get(ingName) || 0);
                        }

                        return {
                            id: `i-${ingId}`,
                            name: i.name || i.Ingredient?.name || 'Desconocido',
                            amount: requiredQty,
                            unit: i.unit || i.ingredient?.unit_default || 'g',
                            available: availableQty >= requiredQty
                        };
                    }) || []
                }));
            }

            if (recipeIdParam) {
                const preset = finalRecipes.find(r => r.id === recipeIdParam);
                if (preset) {
                    setSelectedRecipe(preset);
                } else {
                    // Si no es una receta que coincida exactamente, buscamos sus detalles
                    // para que el usuario pueda ver qué ingredientes le faltan
                    try {
                        if (recipeIdParam.startsWith('ext-')) {
                            const realId = recipeIdParam.replace('ext-', '');
                            const extRes = await fetch(`${API_CONFIG.EXTERNAL_RECIPES_URL}/lookup.php?i=${realId}`);
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
                                    instructions: m.strInstructions,
                                    hasAllIngredients: false,
                                    missingIngredients: ["Faltan ingredientes del catálogo global"],
                                    imageUrl: m.strMealThumb,
                                    ingredients: mappedExtIngredients,
                                    externalMealData: m  // Guardamos los datos de TheMealDB por si queremos importarlos luego
                                };
                                finalRecipes = [extRecipe, ...finalRecipes];
                                setSelectedRecipe(extRecipe);
                            }
                        } else {
                            const localRes = await catalogService.getRecipeById(Number(recipeIdParam), undefined, token);
                            if (localRes.ok && localRes.data && localRes.data.recipe) {
                                const r = localRes.data.recipe as any;

                                // Aseguramos que los ingredientes lleguen bien desde la base de datos local
                                const rawIngredients = r.ingredients || r.RecipeIngredients || r.recipe_ingredients || [];

                                const localRecipe: Recipe = {
                                    id: r.id.toString(),
                                    name: r.title,
                                    time: r.time_minutes || 30,
                                    calories: 400,
                                    difficulty: r.difficulty || "Media",
                                    servings: 2,
                                    instructions: r.instructions,
                                    hasAllIngredients: false,
                                    missingIngredients: ["Faltan ingredientes"],
                                    imageUrl: r.image_url,
                                    ingredients: rawIngredients.map((i: any) => {
                                        const ingId = Number(i.ingredient_id || i.id);
                                        const ingName = (i.name || i.Ingredient?.name || i.ingredient?.name || '').toLowerCase().trim();
                                        const requiredQty = Number(i.required_quantity || i.quantity || 1);

                                        // Buscamos por ID, y si no, por nombre (respaldo)
                                        let availableQty = Number(inventoryMap.get(ingId) || 0);
                                        if (availableQty < requiredQty && ingName) {
                                            availableQty = Math.max(availableQty, inventoryByNameMap.get(ingName) || 0);
                                        }

                                        return {
                                            id: `i-${ingId}`,
                                            name: i.name || i.Ingredient?.name || i.ingredient?.name || 'Desconocido',
                                            amount: requiredQty,
                                            unit: i.unit || i.ingredient?.unit_default || 'g',
                                            available: availableQty >= requiredQty
                                        };
                                    })
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

            // Actualizamos la lista de recetas
            setRecipes(finalRecipes);
            setLoading(false);
        };
        fetchMatchingRecipes();
    }, []);

    const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            <Sidebar activeTab="cocina" />

            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title="Tu Cocina" />

                {/* Contenido principal */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
                    {loading ? (
                        <div className="w-full flex justify-center items-center">
                            <span className="text-gray-500">Buscando qué puedes cocinar...</span>
                        </div>
                    ) : recipes.length === 0 && cookingSessions.length === 0 ? (
                        <div className="w-full h-full bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-4">🍳</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tu inventario no coincide con ninguna receta</h3>
                                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                    Agrega más ingredientes a tu inventario para ver sugerencias de recetas.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                                {/* Sesiones de cocina activas */}
                                {cookingSessions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-1">
                                            {cookingSessions.some(s => s.isCompleted) && cookingSessions.some(s => !s.isCompleted)
                                                ? "Sesiones de cocina"
                                                : cookingSessions.every(s => s.isCompleted)
                                                    ? "Recetas completadas"
                                                    : "Cocinando ahora"}
                                        </p>
                                        {cookingSessions.map(session => {
                                            const progress = session.totalSteps > 0
                                                ? Math.round((session.completedStepIds.length / session.totalSteps) * 100)
                                                : 0;
                                            return (
                                                <button
                                                    key={`session-${session.recipeId}`}
                                                    onClick={() => router.push(`/step-by-step-kitchen?recipeId=${session.recipeId}&name=${encodeURIComponent(session.recipeName)}`)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 border ${session.isCompleted
                                                        ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                                                        : "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10"
                                                        } hover:shadow-sm`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {session.imageUrl ? (
                                                            <img src={session.imageUrl} alt={session.recipeName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-lg">
                                                                {session.isCompleted ? "✅" : "🍳"}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">{session.recipeName}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                                    <div className={`h-full rounded-full transition-all ${session.isCompleted ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${progress}%` }} />
                                                                </div>
                                                                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                                                    {session.isCompleted ? "Hecha ✓" : `${session.completedStepIds.length}/${session.totalSteps}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}

                                        <div className="border-b border-gray-100 dark:border-white/10 my-1" />
                                    </div>
                                )}

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar receta sugerida..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-[#f1f3f1] dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-lg text-sm"
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
                            <div className="w-full md:w-2/3 h-full overflow-y-auto bg-white dark:bg-transparent rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
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
