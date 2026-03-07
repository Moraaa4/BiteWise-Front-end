'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface SidebarProps {
    activeTab?: string;
}

const navItems = [
    { key: 'inicio', label: 'Inicio', icon: 'home', href: '/dashboard' },
    { key: 'inventario', label: 'Inventario', icon: 'inventory_2', href: '/inventory' },
    { key: 'recetas', label: 'Recetas', icon: 'menu_book', href: '/Recipes' },
    { key: 'lista', label: 'Lista de Compras', icon: 'shopping_cart', href: '/shopping-list' },
    { key: 'cocina', label: 'Cocina', icon: 'star', href: '/kitchen' },
];

export function Sidebar({ activeTab = 'inicio' }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Botón menú móvil flotante */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-background-dark rounded-lg shadow-md border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar principal */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-white dark:bg-background-dark border-r border-[#f1f3f1] dark:border-white/10 flex flex-col justify-between p-6
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                <Image src="/icon.svg" alt="BiteWise" width={40} height={40} />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[#131613] dark:text-white text-lg font-bold leading-none">BiteWise</h1>
                                <p className="text-[#6c7f6d] dark:text-gray-400 text-xs">Cocina Inteligente</p>
                            </div>
                        </div>
                        {/* Botón cerrar en móvil */}
                        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 p-1 rounded-md">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-colors ${activeTab === item.key
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-[#131613] dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 bg-primary/10 rounded-xl mt-8">
                    <Link href="/landing" className="block w-full bg-emerald-500 text-white py-2 text-center hover:bg-emerald-600 transition-all rounded-full text-xs font-bold uppercase tracking-wider">Cerrar sesión</Link>
                </div>
            </aside>
        </>
    );
}
