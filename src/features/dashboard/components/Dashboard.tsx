'use client';

import Image from 'next/image';
import React from 'react';
import { fetchIngredients, fetchSuggestedRecipes } from '../service';

export default async function Dashboard() {
  // Note: this component is an async server component wrapper for now,
  // but we keep it simple and call the stubs. If you want client-only
  // interactivity we can convert parts to 'use client' later.
  const [ingredients, recipes] = await Promise.all([fetchIngredients(), fetchSuggestedRecipes()]);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white dark:bg-background-dark border-r border-[#f1f3f1] dark:border-white/10 flex flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image src="/icon.svg" alt="BiteWise" width={40} height={40} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#131613] dark:text-white text-lg font-bold leading-none">BiteWise</h1>
              <p className="text-[#6c7f6d] dark:text-gray-400 text-xs">Food Waste Reduction</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-4 py-3 rounded-full bg-primary text-white font-medium" href="#">
              <span className="material-symbols-outlined fill-1">home</span>
              <span>Inicio</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-full text-[#131613] dark:text-white hover:bg-primary/10 transition-colors" href="#">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Inventario</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-full text-[#131613] dark:text-white hover:bg-primary/10 transition-colors" href="#">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>Lista de Compras</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-full text-[#131613] dark:text-white hover:bg-primary/10 transition-colors" href="#">
              <span className="material-symbols-outlined">star</span>
              <span>Favoritos</span>
            </a>
          </nav>
        </div>

        <div className="p-4 bg-primary/10 rounded-xl">
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400 mb-2">Soporte Premium</p>
          <button className="w-full py-2 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider">Actualizar</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between bg-white dark:bg-background-dark px-8 py-4 border-b border-[#f1f3f1] dark:border-white/10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Dashboard Principal</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 p-1 pr-4 bg-background-light dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaEH8cHpHUZ_D6HlMf8PaS08PbWgbQVPTcPIzKcrqq97ysn6hzlBvCSUiF1Z8AThMs4TKy-HDRlF_xi9UXPwOigYM0ovJBYCxkFCyaIT7mC109HYMlKsKBfyG91prnWzWc2dcrsl-mtsOO9hDha-cAXDIqgQcAcZFqadWOHTV54RC98zyjwDgw_pmYiqQ1aTXopFQU_ganKxjHHPWpyrlxBOQdTzOAMYpsPL7MU2Y7sJdN6sBksVz29EY5dX6_lUsvJx7-Bim6coXc');" }}></div>
              <span className="text-sm font-medium">Mi Perfil</span>
            </button>
          </div>
        </header>

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
              <div className="bg-white dark:bg-white/5 rounded-xl border border-[#f1f3f1] dark:border-white/10 shadow-sm flex flex-col h-full">
                <div className="p-6 border-b border-[#f1f3f1] dark:border-white/10 flex justify-between items-center">
                  <h3 className="text-[#131613] dark:text-white text-lg font-bold uppercase tracking-tight">TUS INGREDIENTES</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">{ingredients.length} items</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {ingredients.map((it: any) => (
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
            </section>

            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[#131613] dark:text-white text-lg font-bold uppercase tracking-tight">RECETAS SUGERIDAS</h3>
                <button className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Ver todas
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipes.map((r: any) => (
                  <div key={r.id} className="bg-white dark:bg-white/5 rounded-xl border border-[#f1f3f1] dark:border-white/10 overflow-hidden shadow-sm group">
                    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${r.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuBFv-MES7YvygZWrWusWM5dyb4MeACmKE9omZ6IHT5EGIhAmqM5UX5Vaku9d6zZhHhooMQDILjJZ8tL4XDxCW68EttQBGEIyJIO9W2qi66oH59Elbe4yHz2aF4NWGW79_Re19OKvpnDSmTM5vfivJXria5R1-cCkwUWec6duUOtgffvPHs6jRSnNINiDDEayJ1PVxiD-EtgbzMKg-K5aAYzA0puArLoiks3XB9VtSmJ1IuM1z8wxkabL6XpUe-lHzw71CHN0dWllYv6"}` }}>
                      <div className="p-3">
                        <span className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> {r.time}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <h4 className="font-bold text-base leading-tight">{r.title}</h4>
                      <button className="w-full py-2 bg-primary/10 text-primary rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">Ver receta</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-background-light dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full text-sm font-bold hover:bg-[#eceeec] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>ACTUALIZAR SUGERENCIAS</span>
                </button>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-auto p-8 border-t border-[#f1f3f1] dark:border-white/10 text-center">
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">© 2024 BiteWise. Come mejor, desperdicia menos.</p>
        </footer>
      </main>
    </div>
  );
}
