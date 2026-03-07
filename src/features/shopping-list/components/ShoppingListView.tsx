"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import ShoppingListCard from "@/features/shopping-list/components/ShoppingListCard";
import CreateListCard from "@/features/shopping-list/components/CreateListCard";
import { SHOPPING_LISTS, type ShoppingList } from "../listaData";

export default function ListaDeComprasView() {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("biteWise_shoppingLists");
        if (saved) {
            setLists(JSON.parse(saved));
        } else {
            setLists(SHOPPING_LISTS);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("biteWise_shoppingLists", JSON.stringify(lists));
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
                total: 5
            };
            const updatedLists = [...lists, newList];
            setLists(updatedLists);
            localStorage.setItem("biteWise_shoppingLists", JSON.stringify(updatedLists));
            router.push(`/shopping-list-detail`);
        }
    };

    const handleViewDetails = (list: ShoppingList) => {
        router.push(`/shopping-list-detail`);
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

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header title="Listas de Compras" />

                {/* Grid */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
                        {/* Create New List — always first */}
                        <CreateListCard onCreate={handleCreate} />

                        {/* Shopping List Cards */}
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

                {/* Footer */}
                <footer className="py-4 text-center mt-auto">
                    <p className="text-xs text-gray-400">
                        © 2024 <span className="font-semibold">BiteWise</span>. Come mejor, desperdicia menos.
                    </p>
                </footer>
            </div>
        </div>
    );
}
