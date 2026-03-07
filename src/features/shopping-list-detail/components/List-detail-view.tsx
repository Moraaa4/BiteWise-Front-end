"use client";

import React, { useState } from "react";
import { ArrowLeft, User, Search, CheckCircle2 } from "lucide-react";
import Sidebar from "@/features/shopping-list-detail/components/Sidebar";
import ShoppingItemRow from "@/features/shopping-list-detail/components/ShoppingItemRow";
import { MOCK_LIST_DETAIL, type ShoppingItem } from "@/features/shopping-list-detail/listaDetalleData";

export default function ListaDetalleView() {
    const [activeNav, setActiveNav] = useState("Lista de Compras");
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
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-gray-800 transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-base font-bold text-gray-900 tracking-wide uppercase">
                            Lista de Compras
                        </h1>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={14} className="text-gray-500" />
                        </div>
                        Mi Perfil
                    </button>
                </header>

                {/* Main content */}
                <main className="flex-1 flex items-start justify-center pt-12 px-8 pb-8">
                    <div className="w-full max-w-md">
                        {/* List card */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            {/* Card header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    {MOCK_LIST_DETAIL.name}
                                </h2>
                                <span className="text-[11px] text-green-600 font-semibold">
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
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-transparent transition-all">
                                    <Search size={13} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="+ Agregar producto"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                                        className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="px-6 pb-4">
                                <button
                                    onClick={handleMarkAll}
                                    disabled={allChecked}
                                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${allChecked
                                        ? "bg-green-100 text-green-600 cursor-default"
                                        : "bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-200"
                                        }`}
                                >
                                    <CheckCircle2 size={16} />
                                    {allChecked ? "¡Todo completado!" : "TODO COMPRADO"}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-2">
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
