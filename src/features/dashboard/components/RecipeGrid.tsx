import React from 'react';

export interface DashboardRecipe {
    id: string;
    img?: string;
    time: string;
    title: string;
}

export function RecipeGrid({ recipes }: { recipes: DashboardRecipe[] }) {
    return (
        <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[#131613] dark:text-white text-lg font-bold uppercase tracking-tight">RECETAS SUGERIDAS</h3>
                <button className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                    <span translate="no" className="material-symbols-outlined notranslate text-sm">visibility</span>
                    Ver todas
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipes.map((r: DashboardRecipe) => (
                    <div key={r.id} className="bg-white dark:bg-white/5 rounded-xl border border-[#f1f3f1] dark:border-white/10 overflow-hidden shadow-sm group">
                        <div className="h-40 bg-gray-200 dark:bg-zinc-800 bg-cover bg-center">
                            <div className="p-3">
                                <span className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1">
                                    <span translate="no" className="material-symbols-outlined notranslate text-[14px]">schedule</span> {r.time}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <h4 className="font-bold text-base leading-tight dark:text-white">{r.title}</h4>
                            <button className="w-full py-2 bg-primary/10 text-primary rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">Ver receta</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 flex justify-center">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-background-light dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-[#eceeec] dark:hover:bg-white/10 transition-colors">
                    <span translate="no" className="material-symbols-outlined notranslate text-[18px]">refresh</span>
                    <span>ACTUALIZAR SUGERENCIAS</span>
                </button>
            </div>
        </section>
    );
}
