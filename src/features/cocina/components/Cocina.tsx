import React from 'react';
import { Sidebar } from '@/features/dashboard/components/Sidebar';

export default function Cocina() {
    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="cocina" />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-8 max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-[#131613] dark:text-white mb-1">Cocina</h1>
                        <p className="text-[#6c7f6d] dark:text-gray-400">Selecciona una receta para ver sus detalles y validar ingredientes.</p>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda: Lista de Recetas (Cascarón) */}
                        <div className="lg:col-span-1 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0">
                                <h2 className="font-bold text-lg">Recetas Disponibles</h2>
                            </div>

                            {/* Contenedor vacío donde la API inyectará las recetas */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">menu_book</span>
                                <p className="text-gray-400 text-sm">Cargando recetas desde servidor...</p>
                            </div>
                        </div>

                        {/* Columna Derecha: Detalle de Receta Seleccionada (Cascarón) */}
                        <div className="lg:col-span-2 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
                            {/* Empty state for recipe details */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">skillet</span>
                                <h3 className="text-xl font-bold text-gray-500 mb-2">Ninguna receta seleccionada</h3>
                                <p className="text-gray-400 max-w-sm">
                                    Al seleccionar una receta, verás aquí los tiempos de preparación, modo de preparación y si cuentas con todos los ingredientes necesarios en tu inventario.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
