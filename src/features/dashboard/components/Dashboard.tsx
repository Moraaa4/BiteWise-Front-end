import React from 'react';
import { fetchIngredients, fetchSuggestedRecipes } from '../service';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IngredientList } from './IngredientList';
import { RecipeGrid } from './RecipeGrid';

export default async function Dashboard() {
  const [ingredients, recipes] = await Promise.all([
    fetchIngredients(),
    fetchSuggestedRecipes()
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <div className="p-8 max-w-[1200px] mx-auto w-full space-y-8">
          <section className="space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c7f6d]">search</span>
              <input className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" placeholder="Buscar recetas, ingredientes o tipos de comida..." type="text" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow-sm">Todos</button>
              <button className="px-5 py-2 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors">Desayuno</button>
              <button className="px-5 py-2 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors">Almuerzo</button>
              <button className="px-5 py-2 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors">Cena</button>
              <button className="px-5 py-2 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors">Snacks</button>
              <button className="px-5 py-2 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors">Vegetariano</button>
              <button className="px-5 py-2 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors">Saludable</button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1 flex flex-col h-full">
              <IngredientList ingredients={ingredients} />
            </section>

            <RecipeGrid recipes={recipes} />
          </div>
        </div>

        <footer className="mt-auto p-8 border-t border-[#f1f3f1] dark:border-white/10 text-center">
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">© 2024 BiteWise. Come mejor, desperdicia menos.</p>
        </footer>
      </main>
    </div>
  );
}
