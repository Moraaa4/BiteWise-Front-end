import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface SidebarProps {
    activeTab?: string;
}

const navItems = [
    { key: 'inicio', label: 'Inicio', icon: 'home', href: '/dashboard' },
    { key: 'inventario', label: 'Inventario', icon: 'inventory_2', href: '/inventory' },
    { key: 'lista', label: 'Lista de Compras', icon: 'shopping_cart', href: '/dashboard' },
    { key: 'cocina', label: 'Cocina', icon: 'star', href: '/dashboard' },
];

export function Sidebar({ activeTab = 'inicio' }: SidebarProps) {
    return (
        <aside className="w-64 bg-white dark:bg-background-dark border-r border-[#f1f3f1] dark:border-white/10 flex flex-col justify-between p-6">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image src="/icon.svg" alt="BiteWise" width={40} height={40} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[#131613] text-lg font-bold leading-none">BiteWise</h1>
                        <p className="text-[#6c7f6d] text-xs">Cocina Inteligente</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-colors ${activeTab === item.key
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-[#131613] hover:bg-primary/10'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 bg-primary/10 rounded-xl">
                <Link href="/landing" className="block w-full bg-emerald-500 text-white py-2 text-center hover:bg-emerald-600 transition-all rounded-full text-xs font-bold uppercase tracking-wider">Cerrar sesión</Link>
            </div>
        </aside>
    );
}
