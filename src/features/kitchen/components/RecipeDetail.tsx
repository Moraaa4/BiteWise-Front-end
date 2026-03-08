"use client";

import React, { useState } from "react";
import { Clock, BarChart2, Users, Bookmark, ShoppingBag, PlayCircle, Check, Loader2, Save, CheckCircle2 } from "lucide-react";
import type { Recipe } from "@/types/global";
import { inventoryService } from "@/services/inventory.service";
import { catalogService, type ExternalRecipe } from "@/services/catalog.service";
import { useRouter } from "next/navigation";

interface RecipeDetailProps {
    recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
    const [cooking, setCooking] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [savedLocalId, setSavedLocalId] = useState<number | null>(() => {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem(`biteWise_saved_${recipe.id}`);
        return saved ? Number(saved) : null;
    });
    const router = useRouter();

    const isExternal = String(recipe.id).startsWith('ext-');

    const handleSave = async () => {
        if (!recipe.externalMealData) {
            alert("No hay datos suficientes para guardar esta receta.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Necesitas iniciar sesión para guardar recetas.");
            return;
        }

        setSaving(true);
        try {
            const externalMeal: ExternalRecipe = recipe.externalMealData as ExternalRecipe;
            const res = await catalogService.importExternalRecipe(externalMeal, token);
            if (res.ok && res.data?.recipe?.id) {
                const newId = res.data.recipe.id;
                setSavedLocalId(newId);
                localStorage.setItem(`biteWise_saved_${recipe.id}`, String(newId));
                alert(`¡Receta guardada! Ahora puedes cocinar "${recipe.name}" desde tu catálogo.`);
            } else {
                alert("No se pudo guardar la receta. Es posible que ya exista en tu catálogo.");
            }
        } catch (e) {
            console.error(e);
            alert("Error al guardar la receta.");
        } finally {
            setSaving(false);
        }
    };

    const handleCook = async () => {
        // If external and not yet saved, block
        if (isExternal && !savedLocalId) {
            alert('Primero guarda la receta en tu catálogo usando el botón "Guardar Receta" para poder cocinarla.');
            return;
        }

        if (!confirm(`¿Estás seguro de que quieres cocinar "${recipe.name}"? Esto descontará los ingredientes de tu inventario.`)) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        setCooking(true);
        try {
            // Use the local ID if we just saved it, otherwise use the recipe's ID
            const recipeId = savedLocalId ?? Number(recipe.id);
            const res = await inventoryService.cookRecipe(recipeId, token);

            if (res.ok) {
                // 1. Update history
                const historyEntry = {
                    id: `h-${Date.now()}`,
                    name: recipe.name,
                    date: new Date().toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                    difficulty: recipe.difficulty || 'MEDIO',
                    rating: 0,
                    imageUrl: recipe.imageUrl || '',
                };

                try {
                    const existingHistory = JSON.parse(localStorage.getItem('biteWise_cookHistory') || '[]');
                    existingHistory.unshift(historyEntry);
                    localStorage.setItem('biteWise_cookHistory', JSON.stringify(existingHistory.slice(0, 50)));
                } catch {
                    localStorage.setItem('biteWise_cookHistory', JSON.stringify([historyEntry]));
                }

                // 2. Prepare steps data
                const stepData = {
                    recipeId: String(recipeId),
                    name: recipe.name,
                    instructions: recipe.instructions || 'Preparar los ingredientes y seguir los pasos básicos de cocción.',
                    imageUrl: recipe.imageUrl || '',
                };

                // 3. Persist and Redirect
                localStorage.setItem('biteWise_stepByStep', JSON.stringify(stepData));

                // Small timeout to ensure localStorage is flushed in some browsers/architectures
                setTimeout(() => {
                    router.push(`/step-by-step-kitchen?recipeId=${recipeId}&name=${encodeURIComponent(recipe.name)}`);
                }, 100);
            } else {
                const errorMessage = res.error || 'No se pudo cocinar la receta (posiblemente falta inventario).';
                alert(`Hubo un problema:\n\n${errorMessage}`);
            }
        } catch (e) {
            console.error(e);
            alert("Error al intentar cocinar.");
        } finally {
            setCooking(false);
        }
    };
    return (
        <div className="flex-1 bg-white dark:bg-transparent rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 flex flex-col">
            {/* Hero */}
            <div className="relative h-52 overflow-hidden">
                <div
                    className="absolute inset-0 bg-gray-200 bg-cover bg-center"
                    style={recipe.imageUrl ? { backgroundImage: `url(${recipe.imageUrl})` } : undefined}
                >
                    {!recipe.imageUrl && <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* External recipe badge */}
                {isExternal && !savedLocalId && (
                    <div className="absolute top-4 right-4">
                        <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Receta Global
                        </span>
                    </div>
                )}
                {savedLocalId && (
                    <div className="absolute top-4 right-4">
                        <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            Guardada en tu catálogo
                        </span>
                    </div>
                )}

                {recipe.tag && (
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {recipe.tag}
                        </span>
                        <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
                            🔥 {recipe.calories} kcal
                        </span>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-lg">
                        {recipe.name}
                    </h2>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-white/10 border-b border-gray-100 dark:border-white/10">
                {[
                    { icon: BarChart2, label: "Dificultad", value: recipe.difficulty },
                    { icon: Users, label: "Porciones", value: `${recipe.servings} personas` },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center py-4 gap-1">
                        <Icon size={18} className="text-gray-400" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                            {label}
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">{value}</span>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 dark:border-white/10">
                <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'ingredients' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50 dark:bg-green-900/10' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Ingredientes
                </button>
                <button
                    onClick={() => setActiveTab('instructions')}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'instructions' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50 dark:bg-green-900/10' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Preparación
                </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'ingredients' ? (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-base">📋</span>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Ingredientes Necesarios</h3>
                        </div>

                        <div className="space-y-3">
                            {recipe.ingredients.map((ingredient) => (
                                <div
                                    key={ingredient.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${ingredient.available ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                                            {ingredient.available ? (
                                                <Check size={11} className="text-green-600" strokeWidth={3} />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{ingredient.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                            {ingredient.amount}
                                            {ingredient.unit}
                                        </p>
                                        {ingredient.available ? (
                                            <p className="text-[10px] text-green-600">Disponible en inventario</p>
                                        ) : (
                                            <p className="text-[10px] text-orange-500">Falta en inventario</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-base">👨‍🍳</span>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Instrucciones de Preparación</h3>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                            {recipe.instructions ? recipe.instructions : "No hay instrucciones detalladas para esta receta."}
                        </div>
                    </>
                )}
            </div>

            {/* Actions */}
            <div className="p-5 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-3 flex-wrap">
                {/* Save button for external recipes */}
                {isExternal && !savedLocalId && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-orange-50 border-2 border-orange-400 text-orange-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={15} className="animate-spin" />
                                Guardando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save size={15} />
                                Guardar Receta
                            </span>
                        )}
                    </button>
                )}

                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-xs font-medium">
                    <Bookmark size={15} />
                    Guardar para después
                </button>
                <div className="flex-1" />
                <button
                    onClick={() => {
                        let toBuy = recipe.ingredients.filter(i => !i.available);
                        if (toBuy.length === 0 && recipe.ingredients.length > 0) {
                            toBuy = recipe.ingredients;
                        }

                        const items = toBuy.map((ing, idx) => ({
                            id: `ing-${Date.now()}-${idx}`,
                            name: ing.name,
                            quantity: `${ing.amount} ${ing.unit}`.trim() || '1',
                            checked: false
                        }));

                        // Create a proper shopping list entry
                        const listId = Date.now().toString();
                        const newList = {
                            id: listId,
                            name: `Faltantes: ${recipe.name}`,
                            status: "incomplete",
                            createdLabel: "Justo ahora",
                            progress: 0,
                            total: items.length
                        };

                        // Load existing lists and add the new one
                        let existingLists: any[] = [];
                        try {
                            const saved = localStorage.getItem('biteWise_shoppingLists');
                            if (saved) existingLists = JSON.parse(saved);
                        } catch { }
                        existingLists.push(newList);
                        localStorage.setItem('biteWise_shoppingLists', JSON.stringify(existingLists));

                        // Save items directly to the list's storage key
                        localStorage.setItem(`biteWise_list_items_${listId}`, JSON.stringify(items));
                        // Also save as pending items (backup — detail view checks this too)
                        localStorage.setItem('biteWise_pendingItems', JSON.stringify(items));

                        alert(`✅ Se creó la lista "${newList.name}" con ${items.length} ingredientes.`);
                        router.push(`/shopping-list-detail?id=${listId}`);
                    }}
                    className="flex items-center gap-2 bg-white dark:bg-transparent border-2 border-green-500 text-green-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                    <ShoppingBag size={15} />
                    Conseguir ingredientes
                </button>
                <button
                    onClick={handleCook}
                    disabled={cooking || (isExternal && !savedLocalId)}
                    title={isExternal && !savedLocalId ? "Guarda primero la receta para poder cocinarla" : undefined}
                    className="flex justify-center items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-sm shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]">
                    <span className="flex items-center gap-2">
                        {cooking ? <Loader2 size={15} className="animate-spin" /> : <PlayCircle size={15} />}
                        {cooking ? "Cocinando..." : isExternal && !savedLocalId ? "Guarda primero" : "Cocinar Ahora"}
                    </span>
                </button>
            </div>
        </div>
    );
}
