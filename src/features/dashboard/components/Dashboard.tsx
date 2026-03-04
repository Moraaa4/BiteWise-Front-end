import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IngredientList } from './IngredientList';
import { RecipeGrid } from './RecipeGrid';

export default function Dashboard() {
  const ingredients = [
    { id: 'i1', name: 'Jitomate', qty: 4 },
    { id: 'i2', name: 'Pechuga pollo', qty: 2 },
    { id: 'i3', name: 'Cebolla', qty: 3 },
  ];

  const recipes = [
    { id: 'r1', title: 'Pollo en salsa jitomate', time: '15min', img: '' },
    { id: 'r2', title: 'Arroz con verduras', time: '20min', img: '' },
    { id: 'r3', title: 'Tacos rápidos', time: '12min', img: '' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab="inicio" />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <div className="p-4 pt-16 md:p-8 max-w-[1200px] mx-auto w-full space-y-6 md:space-y-8">
          <section className="space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c7f6d]">search</span>
              <input className="w-full pl-12 pr-4 py-3 md:py-4 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm text-sm" placeholder="Buscar recetas, ingredientes..." type="text" />
            </div>
            <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Todos', 'Desayuno', 'Almuerzo', 'Cena', 'Snacks', 'Vegetariano', 'Saludable'].map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all whitespace-nowrap ${cat === 'Todos'
                    ? 'bg-primary text-white'
                    : 'bg-white text-[#6c7f6d] border border-[#f1f3f1] hover:bg-primary hover:border-primary hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <section className="lg:col-span-1 flex flex-col h-full">
              <IngredientList ingredients={ingredients} />
            </section>

            <RecipeGrid recipes={recipes} />
          </div>
        </div>

        <footer className="mt-auto p-6 md:p-8 border-t border-[#f1f3f1] dark:border-white/10 text-center">
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">© 2024 BiteWise. Come mejor, desperdicia menos.</p>
        </footer>
      </main>
    </div>
  );
}
