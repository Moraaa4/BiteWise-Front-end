"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import ShoppingListCard from "@/features/shopping-list/components/ShoppingListCard";
import CreateListCard from "@/features/shopping-list/components/CreateListCard";
import { SHOPPING_LISTS, type ShoppingList } from "../listaData";
import { BRAND_TEXT, STORAGE_KEYS, LIMITS } from "@/config/constants";

export default function ListaDeComprasView() {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
        let loadedLists: ShoppingList[] = [];
        if (saved && saved !== "[]") {
            loadedLists = JSON.parse(saved);
        }

        // Sincronizamos el progreso real y el total desde el almacenamiento local
        const updatedLists = loadedLists.map((list: ShoppingList) => {
            try {
                const itemsStr = localStorage.getItem(`biteWise_list_items_${list.id}`);
                if (itemsStr) {
                    const items = JSON.parse(itemsStr);
                    const total = items.length;
                    const progress = items.filter((i: any) => i.checked).length;
                    const status = total > 0 && progress === total ? "complete" : list.status;
                    return { ...list, total, progress, status };
                }
            } catch { /* si hay error, lo ignoramos */ }
            return list;
        });

        setLists(updatedLists);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(lists));
        }
    }, [lists, isLoaded]);

    const router = useRouter();

    const handleCreate = () => {
        const newListName = prompt("Nombre de la nueva lista:");
        if (newListName) {
            const newList: ShoppingList = {
                id: Date.now().toString(),
                name: newListName,
                status: "incomplete",
                createdLabel: "Justo ahora",
                progress: 0,
                total: 0
            };
            const updatedLists = [...lists, newList];
            setLists(updatedLists);
            localStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(updatedLists));

            // Nos aseguramos de que la nueva lista empiece vacía
            localStorage.setItem(`biteWise_list_items_${newList.id}`, JSON.stringify([]));
            localStorage.setItem(STORAGE_KEYS.CURRENT_LIST, JSON.stringify([])); // limpiamos cualquier dato anterior

            router.push(`/shopping-list-detail?id=${newList.id}`);
        }
    };

    const handleViewDetails = (list: ShoppingList) => {
        router.push(`/shopping-list-detail?id=${list.id}`);
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta lista?")) {
            setLists(lists.filter(l => l.id !== id));
        }
    };

    const handleEdit = (id: string) => {
        const newName = prompt("Nuevo nombre para la lista:");
        if (newName) {
            setLists(lists.map(l => l.id === id ? { ...l, name: newName } : l));
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="lista" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Listas de Compras" />

                {/* Cuadrícula de listas */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
                        {/* Crear nueva lista - siempre al principio */}
                        <CreateListCard onCreate={handleCreate} />

                        {/* Tarjetas de listas de compras */}
                        {lists.map((list) => (
                            <ShoppingListCard
                                key={list.id}
                                list={list}
                                onViewDetails={handleViewDetails}
                                onDelete={() => handleDelete(list.id)}
                                onEdit={() => handleEdit(list.id)}
                            />
                        ))}
                    </div>
                </main>

                {/* Pie de página */}
                <footer className="py-4 text-center mt-auto">
                    <p className="text-xs text-gray-400">
                        {BRAND_TEXT.FOOTER_COPYRIGHT} <span className="font-semibold">{BRAND_TEXT.APP_NAME}</span>. {BRAND_TEXT.TAGLINE}.
                    </p>
                </footer>
            </div>
        </div>
    );
}
