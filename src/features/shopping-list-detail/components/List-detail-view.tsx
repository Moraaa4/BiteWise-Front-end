"use client";

import React, { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import ShoppingItemRow from "@/features/shopping-list-detail/components/ShoppingItemRow";
import { MOCK_LIST_DETAIL, type ShoppingItem } from "@/features/shopping-list-detail/listaDetalleData";

export default function ListaDetalleView() {
    const [items, setItems] = useState<ShoppingItem[]>(MOCK_LIST_DETAIL.items);
    const [newItemName, setNewItemName] = useState("");

    const checkedCount = items.filter((i) => i.checked).length;
    const allChecked = checkedCount === items.length && items.length > 0;

    const handleToggle = (id: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const handleAddItem = () => {
        const trimmed = newItemName.trim();
        if (!trimmed) return;
        const newItem: ShoppingItem = {
            id: `item-${Date.now()}`,
            name: trimmed,
            quantity: "",
            checked: false,
        };
        setItems((prev) => [...prev, newItem]);
        setNewItemName("");
    };

    const handleMarkAll = () => {
        setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="lista" />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header />

                {/* Main content */}
                <main className="flex-1 flex items-start justify-center pt-12 px-8 pb-8">
                    <div className="w-full max-w-md">
                        {/* List card */}
                        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                            {/* Card header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                    {MOCK_LIST_DETAIL.name}
                                </h2>
                                <span className="text-[11px] text-emerald-500 font-semibold">
                                    {checkedCount}/{items.length} productos
                                </span>
                            </div>

                            {/* Items */}
                            <div className="px-6 py-2">
                                {items.map((item) => (
                                    <ShoppingItemRow key={item.id} item={item} onToggle={handleToggle} />
                                ))}
                            </div>

                            {/* Add item input */}
                            <div className="px-6 pb-4 pt-2">
                                <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all bg-white dark:bg-white/5">
                                    <Search size={13} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="+ Agregar producto"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                                        className="flex-1 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="px-6 pb-4">
                                <button
                                    onClick={handleMarkAll}
                                    disabled={allChecked}
                                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${allChecked
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 cursor-default"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                                        }`}
                                >
                                    <CheckCircle2 size={16} />
                                    {allChecked ? "¡Todo completado!" : "TODO COMPRADO"}
                                </button>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                                    LOS ARTÍCULOS MARCADOS SE TRANSFERIRÁN A TU INVENTARIO
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-4 text-center">
                    <p className="text-xs text-gray-400">
                        © 2024 <span className="font-semibold">BiteWise</span>. Come mejor, desperdicia menos.
                    </p>
                </footer>
            </div>
        </div>
    );
}
