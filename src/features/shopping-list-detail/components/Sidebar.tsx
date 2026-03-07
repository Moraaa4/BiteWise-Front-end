"use client";

import React from "react";
import { Home, Package, ShoppingCart, ChefHat, Plus } from "lucide-react";

interface SidebarProps {
    activeNav: string;
    onNavChange: (nav: string) => void;
}

const NAV_ITEMS = [
    { label: "Inicio", icon: Home },
    { label: "Inventario", icon: Package },
    { label: "Lista de Compras", icon: ShoppingCart },
    { label: "Cocina", icon: ChefHat },
];

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
    return (
        <aside className="w-52 min-h-screen bg-white border-r border-gray-200 flex flex-col py-5 px-3 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-7 px-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm">🍴</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">BiteWise</p>
                    <p className="text-[9px] text-gray-400 leading-tight">Food Waste Reduction</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-0.5">
                {NAV_ITEMS.map(({ label, icon: Icon }) => {
                    const isActive = activeNav === label;
                    return (
                        <button
                            key={label}
                            onClick={() => onNavChange(label)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isActive
                                    ? "bg-green-500 text-white"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* New Entry Button */}
            <button className="flex items-center justify-center gap-2 mt-4 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                <Plus size={14} />
                Nuevo Ingreso
            </button>
        </aside>
    );
}
