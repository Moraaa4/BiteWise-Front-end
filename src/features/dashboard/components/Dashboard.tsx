"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useRouter } from 'next/navigation';
import { API_CONFIG, STORAGE_KEYS, BRAND_TEXT } from '@/config/constants';
import { catalogService, type Recipe } from '@/services/catalog.service';
import { inventoryService, type InventoryItem } from '@/services/inventory.service';

const CATEGORY_MAP: Record<string, string[]> = {
  'Desayuno': ['breakfast'],
  'Almuerzo': ['lunch', 'beef', 'chicken', 'pork', 'lamb', 'seafood', 'pasta', 'goat'],
  'Cena': ['dinner', 'side', 'starter'],
  'Snacks': ['snack', 'dessert'],
  'Vegetariano': ['vegetarian', 'vegan'],
  'Saludable': ['miscellaneous', 'healthy'],
};

const CATEGORY_ICONS: Record<string, string> = {
  'chicken': '🍗',
  'beef': '🥩',
  'pasta': '🍝',
  'vegetarian': '🥗',
  'dessert': '🍰',
  'breakfast': '🍳',
  'seafood': '🦐',
  'default': '🍽️',
};

function getRecipeIcon(category: string): string {
  const lower = (category || '').toLowerCase();
  return CATEGORY_ICONS[lower] ?? CATEGORY_ICONS['default'];
}

export default function Dashboard() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);


  // Cargamos el inventario desde la API
  useEffect(() => {
    const loadInventory = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) return;
      setLoadingInventory(true);
      try {
        const res = await fetch(`${API_CONFIG.INVENTORY_URL}/api/inventory`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setInventoryItems(data.items || []);
        } else if (res.status === 401 || res.status === 403) {
          console.error('Error de autenticación en Inventario:', res.status);
        }
      } catch (e) {
        console.error('Error loading inventory', e);
      } finally {
        setLoadingInventory(false);
      }
    };
    loadInventory();
  }, []);

  // Cargamos las recetas desde el catálogo
  useEffect(() => {
    const loadRecipes = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) return;
      setLoadingRecipes(true);
      try {
        const res = await fetch(`${API_CONFIG.CATALOG_URL}/api/recipes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecipes(data.recipes || []);
        }
      } catch (e) {
        console.error('Error loading recipes', e);
      } finally {
        setLoadingRecipes(false);
      }
    };
    loadRecipes();
  }, []);

  // Aplicamos los filtros de categoría y búsqueda cada vez que cambian
  useEffect(() => {
    let result = [...recipes];

    if (activeCategory !== 'Todos') {
      const allowedCats = CATEGORY_MAP[activeCategory] || [activeCategory.toLowerCase()];
      result = result.filter(r => {
        const recipeCat = (r.category || r.title || '').toLowerCase();
        return allowedCats.some(cat => recipeCat.includes(cat));
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.ingredients?.some((ing: any) => ing.name?.toLowerCase().includes(q))
      );
    }

    setFilteredRecipes(result);
  }, [recipes, activeCategory, searchQuery]);

  const categories = ['Todos', 'Desayuno', 'Almuerzo', 'Cena', 'Snacks', 'Vegetariano', 'Saludable'];

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
      <Sidebar activeTab="inicio" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 pt-6">
          <div className="max-w-[1200px] mx-auto w-full space-y-6 md:space-y-8">

            {/* Search + Category Filter */}
            <section className="space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <span translate="no" className="material-symbols-outlined notranslate absolute left-4 top-1/2 -translate-y-1/2 text-[#6c7f6d] dark:text-gray-400">search</span>
                <input
                  className="w-full pl-12 pr-4 py-2 sm:py-3 md:py-4 bg-white dark:bg-white/5 border border-[#f1f3f1] dark:border-white/10 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm text-sm text-gray-900 dark:text-white dark:placeholder-gray-400"
                  placeholder="Buscar recetas, ingredientes..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all whitespace-nowrap ${cat === activeCategory
                      ? 'bg-[#4cae4f] text-white border border-[#4cae4f]'
                      : 'bg-white dark:bg-white/5 text-[#6c7f6d] dark:text-gray-300 border border-[#f1f3f1] dark:border-white/10 hover:bg-[#4cae4f] hover:border-[#4cae4f] hover:text-white dark:hover:bg-[#4cae4f] dark:hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

              {/* Inventory Section */}
              <section className="lg:col-span-1">
                <div className="bg-white dark:bg-white/5 rounded-xl border border-[#f1f3f1] dark:border-white/10 shadow-sm flex flex-col max-h-[480px]">
                  <div className="p-5 border-b border-[#f1f3f1] dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-[#131613] dark:text-white text-base font-bold uppercase tracking-tight">Tu Inventario</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                      {loadingInventory ? '...' : `${inventoryItems.length} items`}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3f1] dark:divide-white/5">
                    {loadingInventory ? (
                      <div className="p-6 text-center text-sm text-gray-400">Cargando inventario...</div>
                    ) : inventoryItems.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-400">
                        No tienes ingredientes en tu inventario aún.
                      </div>
                    ) : (
                      inventoryItems.map((item: any) => {
                        const name = item.ingredients?.name ?? item.name ?? 'Sin nombre';
                        const wpu = Number(item.ingredients?.weight_per_unit || 1);
                        const rawQty = Number(item.current_quantity || 0);
                        const displayQty = wpu > 1 ? rawQty / wpu : rawQty;
                        const finalQty = Math.round(displayQty * 10) / 10;
                        const unit = wpu > 1 ? 'unidades' : (item.ingredients?.unit_default || 'g');

                        return (
                          <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-9 text-lg">
                              🥗
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <p className="text-[#131613] dark:text-white text-sm font-semibold truncate">{name}</p>
                              <p className="text-[#6c7f6d] dark:text-gray-400 text-xs">{finalQty} {unit}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-4 border-t border-[#f1f3f1] dark:border-white/10">
                    <button
                      onClick={() => router.push('/inventory')}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <span translate="no" className="material-symbols-outlined notranslate text-base">open_in_new</span>
                      Ver Inventario Completo
                    </button>
                  </div>
                </div>
              </section>

              {/* Recipes Section */}
              <section className="lg:col-span-2">
                <div className="bg-white dark:bg-white/5 rounded-xl border border-[#f1f3f1] dark:border-white/10 shadow-sm flex flex-col max-h-[480px]">
                  <div className="p-5 border-b border-[#f1f3f1] dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-[#131613] dark:text-white text-base font-bold uppercase tracking-tight">
                      {activeCategory === 'Todos' ? 'Recetas del Catálogo' : `Recetas: ${activeCategory}`}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                      {loadingRecipes ? '...' : `${filteredRecipes.length} recetas`}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3f1] dark:divide-white/5">
                    {loadingRecipes ? (
                      <div className="p-6 text-center text-sm text-gray-400">Cargando recetas...</div>
                    ) : filteredRecipes.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-400">
                        {activeCategory !== 'Todos'
                          ? `No hay recetas de "${activeCategory}" en tu catálogo.`
                          : 'No hay recetas en tu catálogo aún.'}
                      </div>
                    ) : (
                      filteredRecipes.map((recipe: any) => (
                        <div
                          key={recipe.id}
                          onClick={() => router.push(`/kitchen?recipeId=${recipe.id}`)}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-background-light dark:hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <div className="size-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-white/10 flex items-center justify-center text-2xl">
                            {recipe.image_url
                              ? <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                              : getRecipeIcon(recipe.category ?? '')
                            }
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-[#131613] dark:text-white text-sm font-semibold truncate group-hover:text-primary transition-colors">
                              {recipe.title}
                            </p>
                            <p className="text-[#6c7f6d] dark:text-gray-400 text-xs">
                              {recipe.ingredients?.length ?? 0} ingredientes
                              {recipe.servings ? ` · ${recipe.servings} porciones` : ''}
                            </p>
                          </div>
                          <span translate="no" className="material-symbols-outlined notranslate text-gray-300 group-hover:text-primary transition-colors text-xl shrink-0">
                            chevron_right
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-[#f1f3f1] dark:border-white/10">
                    <button
                      onClick={() => router.push('/Recipes')}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <span translate="no" className="material-symbols-outlined notranslate text-base">restaurant_menu</span>
                      Explorar todas las Recetas
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        <footer className="mt-auto p-6 md:p-8 border-t border-[#f1f3f1] dark:border-white/10 text-center">
          <p className="text-xs text-[#6c7f6d] dark:text-gray-400">{BRAND_TEXT.FOOTER_COPYRIGHT} {BRAND_TEXT.APP_NAME}. {BRAND_TEXT.TAGLINE}.</p>
        </footer>
      </main>
    </div>
  );
}
