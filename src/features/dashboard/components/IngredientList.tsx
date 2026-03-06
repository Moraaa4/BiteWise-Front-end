import React from 'react';

export interface DashboardIngredient {
    id: string;
    name: string;
    qty: number | string;
}

export function IngredientList({ ingredients }: { ingredients: DashboardIngredient[] }) {
    return (
        <div className="bg-white dark:bg-white/5 rounded-xl border border-[#f1f3f1] dark:border-white/10 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-[#f1f3f1] dark:border-white/10 flex justify-between items-center">
                <h3 className="text-[#131613] dark:text-white text-lg font-bold uppercase tracking-tight">TUS INGREDIENTES</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">{ingredients.length} items</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                {ingredients.map((it: DashboardIngredient) => (
                    <div key={it.id} className="flex items-center gap-4 bg-white dark:bg-transparent px-6 py-4 border-b border-[#f1f3f1] dark:border-white/5 hover:bg-background-light dark:hover:bg-white/5 transition-colors group">
                        <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                            <span className="material-symbols-outlined text-xl">{it.name === 'Pechuga pollo' ? 'restaurant' : it.name === 'Jitomate' ? 'nutrition' : 'cooking'}</span>
                        </div>
                        <div className="flex flex-col justify-center flex-1">
                            <p className="text-[#131613] dark:text-white text-base font-semibold leading-normal">{it.name}</p>
                            <p className="text-[#6c7f6d] dark:text-gray-400 text-sm font-normal">Cantidad: x{it.qty}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                            <button className="p-1.5 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-6">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined">add</span>
                    <span>AGREGAR COMPRA</span>
                </button>
            </div>
        </div>
    );
}
