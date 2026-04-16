"use client";

import React from "react";
import { Check, Trash2 } from "lucide-react";
import { type ShoppingItem } from "@/features/shopping-list-detail/listaDetalleData";

interface ShoppingItemRowProps {
    item: ShoppingItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ShoppingItemRow({ item, onToggle, onDelete }: ShoppingItemRowProps) {
    return (
        <div className="group flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 rounded-xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 overflow-hidden">
                <button
                    onClick={() => onToggle(item.id)}
                    className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.checked
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                    {item.checked && <Check size={14} className="text-white" />}
                </button>
                <div className="flex flex-col flex-1 min-w-0">
                    <span
                        className={`text-sm sm:text-base font-semibold truncate transition-colors ${
                            item.checked
                                ? "text-gray-400 dark:text-gray-500 line-through"
                                : "text-gray-900 dark:text-gray-100"
                        }`}
                    >
                        {item.name}
                    </span>
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                        {item.quantity}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-4">
                {/* CORRECCIÓN APLICADA AQUÍ: Usa el total_price de la DB si existe */}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ${(item as any).total_price ? Number((item as any).total_price).toFixed(2) : "0.00"}
                </span>
                
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Eliminar producto"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}