"use client";

import React from "react";
import type { ShoppingItem } from "@/features/shopping-list-detail/listaDetalleData";

interface ShoppingItemRowProps {
    item: ShoppingItem;
    onToggle: (id: string) => void;
}

export default function ShoppingItemRow({ item, onToggle }: ShoppingItemRowProps) {
    return (
        <label
            className={`flex items-center justify-between py-3 px-1 border-b border-gray-100 dark:border-zinc-800 last:border-0 cursor-pointer group transition-colors duration-150 ${item.checked ? "opacity-50" : ""
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggle(item.id)}
                        className="peer sr-only"
                    />
                    <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 ${item.checked
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 dark:border-gray-500 group-hover:border-emerald-400"
                            }`}
                    >
                        {item.checked && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <path
                                    d="M1 3.5L3.5 6L8 1"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <span
                    className={`text-sm text-gray-800 dark:text-gray-200 transition-all duration-150 ${item.checked ? "line-through text-gray-400 dark:text-gray-500" : ""
                        }`}
                >
                    {item.name}
                </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.quantity}</span>
        </label>
    );
}
