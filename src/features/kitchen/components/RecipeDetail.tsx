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
    const [savedLocalId, setSavedLocalId] = useState<number | null>(null);
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
                setSavedLocalId(res.data.recipe.id);
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
            alert("Primero guarda la receta en tu catálogo usando el botón \"Guardar Receta\" para poder cocinarla.");
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
                alert(`¡Éxito! ${res.data?.message || 'Ingredientes descontados.'}`);
                window.location.href = '/inventory';
            } else {
                alert(`Hubo un problema: No se pudo cocinar la receta (posiblemente falta inventario en la BD).`);
            }
        } catch (e) {
            console.error(e);
            alert("Error al intentar cocinar.");
        } finally {
            setCooking(false);
        }
    };
    return (
        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
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
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                {[
                    { icon: Clock, label: "Tiempo", value: `${recipe.time} min` },
                    { icon: BarChart2, label: "Dificultad", value: recipe.difficulty },
                    { icon: Users, label: "Porciones", value: `${recipe.servings} personas` },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center py-4 gap-1">
                        <Icon size={18} className="text-gray-400" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                            {label}
                        </span>
                        <span className="text-sm font-bold text-gray-800">{value}</span>
                    </div>
                ))}
            </div>

            {/* Ingredients */}
            <div className="flex-1 overflow-y-auto p-5">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-base">📋</span>
                    <h3 className="text-sm font-bold text-gray-800">Ingredientes Necesarios</h3>
                </div>

                <div className="space-y-3">
                    {recipe.ingredients.map((ingredient) => (
                        <div
                            key={ingredient.id}
                            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Check size={11} className="text-green-600" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-gray-700">{ingredient.name}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-800">
                                    {ingredient.amount}
                                    {ingredient.unit}
                                </p>
                                <p className="text-[10px] text-green-600">Disponible en inventario</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-3 border-t border-gray-100 flex items-center gap-3 flex-wrap">
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

                        if (items.length > 0) {
                            localStorage.setItem('biteWise_pendingItems', JSON.stringify(items));
                        }
                        router.push('/shopping-list-detail');
                    }}
                    className="flex items-center gap-2 bg-white border-2 border-green-500 text-green-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all">
                    <ShoppingBag size={15} />
                    Conseguir ingredientes
                </button>
                <button
                    onClick={handleCook}
                    disabled={cooking || (isExternal && !savedLocalId)}
                    title={isExternal && !savedLocalId ? "Guarda primero la receta para poder cocinarla" : undefined}
                    className="flex justify-center items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-sm shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]">
                    {cooking ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={15} className="animate-spin" />
                            Cocinando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <PlayCircle size={15} />
                            {isExternal && !savedLocalId ? "Guarda primero" : "Cocinar Ahora"}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
