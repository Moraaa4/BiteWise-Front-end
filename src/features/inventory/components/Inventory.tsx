import React from 'react';
import { Sidebar } from '@/features/dashboard/components/Sidebar';

export default function Inventory() {
    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="inventario" />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-4 pt-16 md:p-8 max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
                    {/* Top Header Area */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#131613] dark:text-white mb-1">Inventario</h1>
                            <p className="text-sm md:text-base text-[#6c7f6d] dark:text-gray-400">Gestiona y monitorea la frescura de tus ingredientes.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar ingrediente..."
                                    className="pl-11 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full transition-all"
                                />
                            </div>

                            {/* Filters */}
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                <span className="hidden sm:inline">Filtros</span>
                            </button>

                            {/* Add Button */}
                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-bold shadow-md transition-colors">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                <span className="hidden sm:inline">Agregar</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Shell (Cascarón sin datos) */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                        <div className="overflow-x-auto flex-1 flex flex-col">
                            <div className="min-w-[500px] flex-1 flex flex-col">
                                {/* Table Headers */}
                                <div className="grid grid-cols-3 px-6 md:px-8 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-xs font-bold text-gray-400 tracking-wider">
                                    <div>INGREDIENTE</div>
                                    <div>CATEGORÍA</div>
                                    <div>CANTIDAD</div>
                                </div>

                                {/* Empty Body for API Mapping */}
                                <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 text-center">
                                    <p className="text-gray-400 text-sm"> {/* Placeholder para cuando añadas el mapeo de la API */}
                                        Los ingredientes se cargarán desde la API...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-4 md:px-8 py-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Mostrando 0 ingredientes</span>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-4 py-1.5 border border-gray-200 dark:border-zinc-700 rounded-md font-medium text-gray-400 cursor-not-allowed text-center">Anterior</button>
                                <button className="flex-1 sm:flex-none px-4 py-1.5 border border-gray-200 dark:border-zinc-700 rounded-md font-medium text-gray-400 cursor-not-allowed text-center">Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
