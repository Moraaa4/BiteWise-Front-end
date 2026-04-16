"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Users, ShoppingBag, PlayCircle } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import IngredientRow from "@/features/recipes-details/components/IngredientRow";
import { catalogService } from "@/services/catalog.service";
import { API_CONFIG, STORAGE_KEYS, generateSafeId } from "@/config/constants";
import { useSearchParams, useRouter } from "next/navigation";
import { shoppingService } from "@/services/shopping.service";

interface RecipeIngredient {
    id: string;
    name: string;
    quantity: string;
    inInventory: boolean;
}

interface DetailedRecipe {
    id: string;
    name: string;
    tag: string;
    portions: number;
    timeMinutes: number;
    inventoryCount: number;
    totalCount: number;
    imageUrl?: string;
    ingredients: RecipeIngredient[];
}

export default function RecipeDetailView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const recipeId = searchParams.get('id');
    const [recipe, setRecipe] = useState<DetailedRecipe | null>(null);
    const [loadingIngredients, setLoadingIngredients] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId) return;

            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

            // Fetch inventory once to check ingredient availability
            let inventoryItems: { name?: string, ingredients?: { name: string } }[] = [];
            try {
                const invRes = await fetch(`${API_CONFIG.INVENTORY_URL}/api/inventory`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (invRes.ok) {
                    const invData = await invRes.json();
                    inventoryItems = invData.items || [];
                }
            } catch (e) {
                console.warn("Could not fetch inventory for availability check", e);
            }

            const inventoryNames = new Set(inventoryItems.map((item) =>
                (item.ingredients?.name || item.name || '').toLowerCase().trim()
            ));

            // Handle external recipes from TheMealDB
            if (recipeId.toString().startsWith('ext-')) {
                const realId = recipeId.toString().replace('ext-', '');
                try {
                    const res = await fetch(`${API_CONFIG.EXTERNAL_RECIPES_URL}/lookup.php?i=${realId}`);
                    const data = await res.json();
                    if (data.meals && data.meals[0]) {
                        const m = data.meals[0];
                        const ingredients = [];
                        for (let i = 1; i <= 20; i++) {
                            const ingName = m[`strIngredient${i}`];
                            const ingMeasure = m[`strMeasure${i}`];
                            if (ingName && ingName.trim() !== '') {
                                const inInventory = inventoryNames.has(ingName.trim().toLowerCase());
                                ingredients.push({
                                    id: `ext-ing-${i}`,
                                    name: ingName.trim(),
                                    quantity: ingMeasure ? ingMeasure.trim() : '',
                                    inInventory
                                });
                            }
                        }

                        const inventoryCount = ingredients.filter(i => i.inInventory).length;
                        setRecipe({
                            id: `ext-${m.idMeal}`,
                            name: m.strMeal,
                            tag: "GLOBAL",
                            portions: 2,
                            timeMinutes: 45,
                            inventoryCount,
                            totalCount: ingredients.length,
                            imageUrl: m.strMealThumb,
                            ingredients
                        });
                    }
                } catch (err) {
                    console.error("Error fetching external recipe", err);
                }
                return;
            }

            // Handle local recipes from microservice
            const res = await catalogService.getRecipeById(Number(recipeId), undefined, token || undefined);
            if (res.ok && res.data && res.data.recipe) {
                const r = res.data.recipe;
                const rawIngredients = r.ingredients || [];
                const mappedIngredients: RecipeIngredient[] = rawIngredients.map((ing: any) => {
                    const name = ing.ingredient?.name || ing.name || '';
                    const inInventory = inventoryNames.has(name.toLowerCase().trim());
                    return {
                        id: (ing.ingredient_id || ing.id || '').toString(),
                        name,
                        quantity: `${ing.required_quantity || ing.quantity || ''} ${ing.ingredient?.unit_default || ing.unit || ''}`.trim(),
                        inInventory
                    };
                });

                setRecipe({
                    id: r.id.toString(),
                    name: r.title,
                    tag: "RECETA LOCAL",
                    portions: 2,
                    timeMinutes: 30,
                    inventoryCount: mappedIngredients.filter((i) => i.inInventory).length,
                    totalCount: mappedIngredients.length,
                    imageUrl: r.image_url,
                    ingredients: mappedIngredients
                });
            }
            setLoadingIngredients(false);
        };
        fetchRecipe();
    }, [recipeId]);

    const handleBuyIngredients = async () => {
        if (!recipe) return;
        const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
        let lists = [];
        if (saved) {
            try { lists = JSON.parse(saved); } catch (e) { }
        }

        const missingIngredients = recipe.ingredients.filter((i) => !i.inInventory);
        const toBuy = missingIngredients.length > 0 ? missingIngredients : recipe.ingredients;

        const items = toBuy.map((ing, idx: number) => ({
            id: `ing-${Date.now()}-${idx}`,
            name: ing.name,
            quantity: ing.quantity || '1',
            checked: false
        }));

        let listId = generateSafeId();
        const listName = `Faltantes: ${recipe.name}`;
        
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (token) {
            try {
                const res = await shoppingService.createShoppingList({ recipe_id: recipeId! }, token);

                if (res.ok && res.data) {
                    const savedId = res.data.id ?? res.data.list?.id;
                    if (savedId) {
                        listId = String(savedId);
                    }
                }
            } catch (e) {
                console.error("Error creating shopping list in backend:", e);
            }
        }

        const newList = {
            id: listId,
            name: listName,
            status: "incomplete",
            createdLabel: "Justo ahora",
            progress: 0,
            total: items.length
        };
        lists.push(newList);
        localStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(lists));

        // Save items to the list's storage key
        localStorage.setItem(`${STORAGE_KEYS.LIST_ITEMS_PREFIX}${listId}`, JSON.stringify(items));
        // Also save as pending items (backup)
        localStorage.setItem(STORAGE_KEYS.PENDING_ITEMS, JSON.stringify(items));

        alert(`✅ Se creó la lista "${newList.name}" con ${items.length} ingredientes.`);
        router.push(`/shopping-list-detail?id=${listId}`);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="recetas" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Detalles de la Receta" />

                {!recipe ? (
                    <div className="p-8 text-center text-gray-500">Cargando receta...</div>
                ) : (
                    <>
                        {/* Breadcrumb header */}
                        <header className="bg-white dark:bg-background-dark border-b border-gray-200 dark:border-white/10 px-6 py-3 flex items-center gap-2 shrink-0">
                            <button onClick={() => router.back()} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                <ArrowLeft size={16} />
                            </button>
                            <span className="text-xs text-gray-400 dark:text-gray-400">Recetas</span>
                            <span className="text-xs text-gray-300 dark:text-gray-500">/</span>
                            <span className="text-xs text-gray-600 dark:text-gray-200 font-medium truncate">{recipe.name}</span>
                        </header>

                        <main className="flex-1 overflow-y-auto">
                            {/* Hero image area */}
                            <div className="relative h-48 sm:h-56 bg-gray-200 dark:bg-white/5 overflow-hidden">
                                {/* Image placeholder or Real image */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 border-b border-white/10">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 dark:text-white/20 text-5xl">🍽️</span>
                                    )}
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
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {recipe.inventoryCount}/{recipe.totalCount} ITEMS
                                        </span>
                                    </div>
                                    <div className="px-5 py-1">
                                        {loadingIngredients ? (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                                                Cargando ingredientes...
                                            </p>
                                        ) : recipe.ingredients.length === 0 ? (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                                                No se encontraron ingredientes para esta receta.
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
                        <div className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                <Clock size={13} className="text-gray-500 dark:text-gray-400" />
                                Tiempo aproximado: {recipe.timeMinutes} min
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleBuyIngredients}
                                    className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
                                >
                                    <ShoppingBag size={15} />
                                    Comprar Ingredientes
                                </button>
                                <button
                                    onClick={() => router.push(`/kitchen?recipeId=${recipe.id}`)}
                                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none w-full sm:w-auto"
                                >
                                    <PlayCircle size={15} />
                                    ¡Empezar a cocinar!
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}