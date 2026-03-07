import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { RecipeIngredient } from "@/features/recipes-details/recetaDetalleData";

interface IngredientRowProps {
    ingredient: RecipeIngredient;
}

export default function IngredientRow({ ingredient }: IngredientRowProps) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-white/10 last:border-0">
            {ingredient.inInventory ? (
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            ) : (
                <Circle size={18} className="text-gray-300 dark:text-white/30 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-medium ${ingredient.inInventory ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-500"
                        }`}
                >
                    {ingredient.name}
                </p>
                {ingredient.inInventory && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">Disponible en inventario</p>
                )}
            </div>
        </div>
    );
}
