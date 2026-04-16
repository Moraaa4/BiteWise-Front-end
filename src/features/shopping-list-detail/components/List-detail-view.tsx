"use client";

import React, { useState, useRef } from "react";
import { Search, CheckCircle2, Trash2, PartyPopper } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import ShoppingItemRow from "@/features/shopping-list-detail/components/ShoppingItemRow";
import { type ShoppingItem } from "@/features/shopping-list-detail/listaDetalleData";
import { useSearchParams } from "next/navigation";
import { STORAGE_KEYS, BRAND_TEXT } from "@/config/constants";
import { shoppingService } from "@/services/shopping.service";
import { catalogService } from "@/services/catalog.service";

export default function ListaDetalleView() {
    const searchParams = useSearchParams();
    const urlListId = searchParams.get('id');

    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [listName, setListName] = useState("Mi Lista de Compras");
    const [activeListId, setActiveListId] = useState<string>("default");
    const [isCompleting, setIsCompleting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const hasInitialized = useRef(false);

    // Initialize list and merge any pending items sent from Recipe Detail
    React.useEffect(() => {
        let activeId: string = urlListId ?? "";

        // Find best active ID
        const savedLists = localStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
        let parsedLists: { id: string, name: string }[] = [];
        if (savedLists) {
            try { parsedLists = JSON.parse(savedLists); } catch (e) { }
        }

        if (!activeId) {
            if (parsedLists.length > 0) {
                activeId = parsedLists[0].id;
                setListName(parsedLists[0].name);
            } else {
                activeId = "default";
            }
        } else {
            const found = parsedLists.find((l) => l.id === activeId);
            if (found) {
                setListName(found.name);
            }
        }

        setActiveListId(activeId);

        let currentItems: ShoppingItem[] = [];

        // 1. Try to load existing active list items
        const storageKey = `${STORAGE_KEYS.LIST_ITEMS_PREFIX}${activeId}`;
        const savedList = localStorage.getItem(storageKey);

        if (savedList) {
            try {
                const parsed = JSON.parse(savedList);
                if (Array.isArray(parsed)) {
                    currentItems = parsed;
                }
            } catch (e) {
                console.error("Error parsing saved list", e);
            }
        }

        // 2. Try to load pending items to append
        const pending = localStorage.getItem(STORAGE_KEYS.PENDING_ITEMS);
        if (pending) {
            try {
                const parsed = JSON.parse(pending) as ShoppingItem[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const existingNames = new Set(currentItems.map(i => i.name.toLowerCase()));
                    const newItems = parsed.filter(i => !existingNames.has(i.name.toLowerCase()));

                    if (newItems.length > 0) {
                        currentItems = [...newItems, ...currentItems];
                    }
                }
            } catch (e) {
                console.error("Error parsing pending items", e);
            }
            localStorage.removeItem(STORAGE_KEYS.PENDING_ITEMS);
        }

        // Save items immediately if we loaded any
        localStorage.setItem(storageKey, JSON.stringify(currentItems));

        setItems(currentItems);

        // Mark as initialized AFTER React commits the state
        setTimeout(() => { hasInitialized.current = true; }, 0);
    }, [urlListId]);

    // Save changes to localStorage whenever items change — only AFTER initialization
    React.useEffect(() => {
        if (hasInitialized.current) {
            localStorage.setItem(`${STORAGE_KEYS.LIST_ITEMS_PREFIX}${activeListId}`, JSON.stringify(items));
        }
    }, [items, activeListId]);

    const checkedCount = items.filter((i) => i.checked).length;
    const allChecked = checkedCount === items.length && items.length > 0;

    const handleToggle = (id: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const handleDelete = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleAddItem = () => {
        const trimmed = newItemName.trim();
        if (!trimmed) return;
        const newItem: ShoppingItem = {
            id: `item-${Date.now()}`,
            name: trimmed,
            quantity: "",
            checked: false,
        };
        setItems((prev) => [...prev, newItem]);
        setNewItemName("");
    };

    const handleMarkAll = () => {
        setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    };

    const handleComplete = async () => {
        if (items.length === 0) return;

        // Visual feedback first
        const allCheckedItems = items.map(item => ({ ...item, checked: true }));
        setItems(allCheckedItems);

        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            alert("Necesitas iniciar sesión para completar la compra.");
            return;
        }

        setIsCompleting(true);

        try {
            const ingredientsRes = await catalogService.getIngredients(token);
            let allIngredients: Array<{ id: number; name: string; purchase_price?: number }> = [];
            if (ingredientsRes.ok && Array.isArray(ingredientsRes.data)) {
                allIngredients = ingredientsRes.data;
            }

            const itemsToPurchase: Array<{ ingredient_id: number; purchase_price: number; purchase_quantity: number }> = [];
            let totalEstimado = 0;
            let addedCount = 0;

            for (const item of allCheckedItems) {
                let ingredient_id: number | null = null;
                const found = allIngredients.find(
                    (ing) => ing.name?.toLowerCase().trim() === item.name.toLowerCase().trim()
                );

                if (found) {
                    ingredient_id = found.id;
                }

                if (!ingredient_id) {
                    const qtyStr = item.quantity.toLowerCase();
                    const isMass = qtyStr.includes('g') || qtyStr.includes('ml') || qtyStr.includes('kg') || qtyStr.includes('l');
                    const createRes = await catalogService.createIngredient({
                        name: item.name,
                        category: 'General',
                        purchase_price: 15,
                        purchase_quantity: 1,
                        unit_default: isMass && qtyStr.includes('ml') ? 'ml' : isMass ? 'g' : 'unidad',
                        weight_per_unit: 1
                    }, token);

                    if (createRes.ok && createRes.data?.ingredient) {
                        ingredient_id = createRes.data.ingredient.id;
                        allIngredients.push(createRes.data.ingredient);
                    }
                }

                if (!ingredient_id) continue;

                const numericMatch = item.quantity.match(/(\d+(\.\d+)?)/);
                const qty = numericMatch ? parseFloat(numericMatch[0]) : 1;
                const purchasePrice = found?.purchase_price ?? 15;

                itemsToPurchase.push({
                    ingredient_id,
                    purchase_price: purchasePrice,
                    purchase_quantity: qty
                });
                
                // CORRECCIÓN APLICADA: Validar si existe total_price de la DB
                if ((item as any).total_price) {
                    totalEstimado += Number((item as any).total_price);
                } else {
                    const qtyStr = item.quantity.toLowerCase();
                    const isGramsOrMl = qtyStr.includes('g') || qtyStr.includes('ml');
                    totalEstimado += isGramsOrMl ? purchasePrice : (qty * purchasePrice);
                }
                
                addedCount += 1;
            }

            if (itemsToPurchase.length === 0) {
                alert("No se pudo agregar ningún artículo al inventario.");
                setIsCompleting(false);
                return;
            }

            const purchaseRes = await shoppingService.completePurchase(Number(activeListId), token);
            if (!purchaseRes.ok) {
                alert("No se pudo completar la compra.");
                setIsCompleting(false);
                return;
            }

            setReportData({
                gasto_total_estimado: totalEstimado,
                ingredientes_analizados: addedCount,
                ahorro_estimado_porcentaje: 15
            });
            setShowSuccessModal(true);

            // Actualizar estado de la lista localmente
            const savedLists = localStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
            if (savedLists) {
                try {
                    let parsed = JSON.parse(savedLists);
                    parsed = parsed.map((l: any) => l.id === activeListId ? { ...l, status: "complete" } : l);
                    localStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(parsed));
                } catch (e) { }
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión al completar la lista.");
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="lista" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Detalles de la Lista" />

                <main className="flex-1 overflow-y-auto flex flex-col items-center pt-12 px-4 sm:px-8 pb-8">
                    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                        {/* List card */}
                        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                            {/* Card header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-white/10">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                    {listName}
                                </h2>
                                <span className="text-[11px] text-emerald-500 font-semibold">
                                    {checkedCount}/{items.length} productos
                                </span>
                            </div>

                            {/* Items */}
                            <div className="px-4 sm:px-6 py-2">
                                {items.map((item) => (
                                    <ShoppingItemRow
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>

                            {/* Add item input */}
                            <div className="px-4 sm:px-6 pb-4 pt-2">
                                <div className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all bg-white dark:bg-white/5">
                                    <Search size={13} className="text-gray-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="+ Agregar producto"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                                        className="flex-1 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="px-4 sm:px-6 pb-4">
                                <button
                                    onClick={allChecked ? undefined : handleComplete}
                                    disabled={allChecked || isCompleting}
                                    className={`w-full py-3 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 ${allChecked
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 cursor-default"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                                        }`}
                                >
                                    {isCompleting ? (
                                        <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            {allChecked ? "¡Todo completado!" : "TODO COMPRADO"}
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                                    LOS ARTÍCULOS MARCADOS SE TRANSFERIRÁN A TU INVENTARIO
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-4 text-center">
                    <p className="text-xs text-gray-400">
                        {BRAND_TEXT.FOOTER_COPYRIGHT} <span className="font-semibold">{BRAND_TEXT.APP_NAME}</span>. {BRAND_TEXT.TAGLINE}.
                    </p>
                </footer>
            </div>

            {/* Modal de Éxito de Compra */}
            {showSuccessModal && reportData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-emerald-500/10 p-6 flex flex-col items-center justify-center border-b border-emerald-500/20">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <PartyPopper size={32} className="text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white text-center">¡Compra completada!</h3>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium text-center mt-1">
                                Tus ingredientes ya están en el inventario.
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                                <span className="text-sm font-medium text-gray-500">Gasto Total Estimado</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">${reportData.gasto_total_estimado?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                                <span className="text-sm font-medium text-gray-500">Ingredientes Comprados</span>
                                <span className="text-base font-bold text-gray-900 dark:text-white">{reportData.ingredientes_analizados || items.length}</span>
                            </div>

                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    window.location.href = "/inventory";
                                }}
                                className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Ir a mi inventario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}