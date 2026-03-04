"use client";

import React from "react";
import { Clock, BarChart2, Users, Bookmark, ShoppingBag, PlayCircle, Check } from "lucide-react";
import type { Recipe } from "@/types/global";

interface RecipeDetailProps {
    recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
    return (
        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            {/* Hero */}
            <div className="relative h-52 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

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
            <div className="p-5 pt-3 border-t border-gray-100 flex items-center gap-3">
                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-xs font-medium">
                    <Bookmark size={15} />
                    Guardar para después
                </button>
                <div className="flex-1" />
                <button className="flex items-center gap-2 bg-white border-2 border-green-500 text-green-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all">
                    <ShoppingBag size={15} />
                    Conseguir ingredientes
                </button>
                <button className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-sm shadow-green-200">
                    <PlayCircle size={15} />
                    Cocinar Ahora
                </button>
            </div>
        </div>
    );
}
