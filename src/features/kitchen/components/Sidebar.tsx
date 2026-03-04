"use client";

import React from "react";
import { Home, Package, ShoppingCart, ChefHat, Leaf } from "lucide-react";

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
        <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white text-lg">🍴</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">BiteWise</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-tight">
                        Food Waste Reduction
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map(({ label, icon: Icon }) => {
                    const isActive = activeNav === label;
                    return (
                        <button
                            key={label}
                            onClick={() => onNavChange(label)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${isActive
                                    ? "bg-green-500 text-white shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* Waste Progress Card */}
            <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <Leaf size={13} className="text-green-600" />
                        <span className="text-xs font-semibold text-green-800">Viaje Residuo Cero</span>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-xs">
                        🏆
                    </div>
                </div>
                <div className="mt-3">
                    <div className="w-full bg-green-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "75%" }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-green-700 font-medium">75% Completado</span>
                        <div className="text-right">
                            <span className="text-[10px] text-green-700 font-medium">1kg</span>
                            <p className="text-[9px] text-green-500">salvados</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
