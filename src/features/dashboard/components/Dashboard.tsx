"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IngredientList, DashboardIngredient } from './IngredientList';
import { RecipeGrid } from './RecipeGrid';

export default function Dashboard() {
  const [ingredients, setIngredients] = useState<DashboardIngredient[]>([
    { id: 'i1', name: 'Jitomate', qty: 4 },
    { id: 'i2', name: 'Pechuga pollo', qty: 2 },
    { id: 'i3', name: 'Cebolla', qty: 3 },
  ]);

  const recipes = [
    { id: 'r1', title: 'Pollo en salsa jitomate', time: '15min', img: '' },
    { id: 'r2', title: 'Arroz con verduras', time: '20min', img: '' },
    { id: 'r3', title: 'Tacos rápidos', time: '12min', img: '' },
  ];

  const handleAddIngredient = () => {
    const name = prompt("Nombre del ingrediente:");
    if (name) {
      setIngredients([...ingredients, { id: Date.now().toString(), name, qty: 1 }]);
    }
  };

  const handleEditIngredient = (id: string, currentName: string) => {
    const newName = prompt(`Editar nombre para ${currentName}:`, currentName);
    if (newName) {
      setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, name: newName } : ing));
    }
  };

  const handleDeleteIngredient = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este ingrediente?")) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
      <Sidebar activeTab="inicio" />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <div className="p-4 pt-16 md:p-8 max-w-[1200px] mx-auto w-full space-y-6 md:space-y-8">
          <section className="space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c7f6d] dark:text-gray-400">search</span>
              <input className="w-full pl-12 pr-4 py-3 md:py-4 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm text-sm text-gray-900 dark:text-white dark:placeholder-gray-400" placeholder="Buscar recetas, ingredientes..." type="text" />
            </div>
            <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Todos', 'Desayuno', 'Almuerzo', 'Cena', 'Snacks', 'Vegetariano', 'Saludable'].map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all whitespace-nowrap ${cat === 'Todos'
                    ? 'bg-[#4cae4f] text-white border border-[#4cae4f]'
                    : 'bg-white dark:bg-white/5 text-[#6c7f6d] dark:text-gray-300 border border-[#f1f3f1] dark:border-white/10 hover:bg-[#4cae4f] hover:border-[#4cae4f] hover:text-white dark:hover:bg-[#4cae4f] dark:hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:max-w-4xl lg:mx-auto gap-6 md:gap-8">
            <section className="flex flex-col h-[500px]">
              <IngredientList
                ingredients={ingredients}
                onAdd={handleAddIngredient}
                onEdit={handleEditIngredient}
                onDelete={handleDeleteIngredient}
              />
            </section>
          </div>
        </div>

        <footer className="mt-auto p-6 md:p-8 border-t border-[#f1f3f1] dark:border-white/10 text-center">
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">© 2024 BiteWise. Come mejor, desperdicia menos.</p>
        </footer>
      </main>
    </div>
  );
}
