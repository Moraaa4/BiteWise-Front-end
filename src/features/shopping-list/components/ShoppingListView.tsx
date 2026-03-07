"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import ShoppingListCard from "@/features/shopping-list/components/ShoppingListCard";
import CreateListCard from "@/features/shopping-list/components/CreateListCard";
import { SHOPPING_LISTS, type ShoppingList } from "../listaData";

export default function ListaDeComprasView() {
    const [lists, setLists] = useState<ShoppingList[]>(SHOPPING_LISTS);

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
            setLists([...lists, newList]);
        }
    };

    const handleViewDetails = (list: ShoppingList) => {
        alert(`Ver detalles de: ${list.name}`);
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
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
                    <h1 className="text-2xl md:text-3xl font-black text-[#131613]">
                        Listas de Compras
                    </h1>
                    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                            U
                        </div>
                        Mi Perfil
                    </button>
                </header>

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
