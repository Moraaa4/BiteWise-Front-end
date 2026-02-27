import Image from 'next/image';
import React from 'react';

export function Sidebar() {
    return (
        <aside className="w-64 bg-white dark:bg-background-dark border-r border-[#f1f3f1] dark:border-white/10 flex flex-col justify-between p-6">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image src="/icon.svg" alt="BiteWise" width={40} height={40} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[#131613] text-lg font-bold leading-none">BiteWise</h1>
                        <p className="text-[#6c7f6d] dark:text-gray-400 text-xs">Food Waste Reduction</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-full bg-primary text-white font-medium" href="#">
                        <span className="material-symbols-outlined fill-1">home</span>
                        <span>Inicio</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-full text-[#131613] hover:bg-primary/10 transition-colors" href="#">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span>Inventario</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-full text-[#131613] hover:bg-primary/10 transition-colors" href="#">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span>Lista de Compras</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-full text-[#131613] hover:bg-primary/10 transition-colors" href="#">
                        <span className="material-symbols-outlined">star</span>
                        <span>Favoritos</span>
                    </a>
                </nav>
            </div>

            <div className="p-4 bg-primary/10 rounded-xl">
                <p className="text-xs text-[#6c7f6d] dark:text-gray-400 mb-2">Soporte Premium</p>
                <button className="w-full py-2 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider">Cerrar sesión</button>
            </div>
        </aside>
    );
}
