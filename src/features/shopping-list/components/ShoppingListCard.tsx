"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, MoreVertical, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import type { ShoppingList } from "../listaData";

interface ShoppingListCardProps {
    list: ShoppingList;
    onViewDetails: (list: ShoppingList) => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ShoppingListCard({ list, onViewDetails, onEdit, onDelete }: ShoppingListCardProps) {
    const isComplete = list.progress === list.total;
    const progressPercent = Math.round((list.progress / list.total) * 100);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
            {/* Card Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{list.name}</h3>
                        {list.status === "urgent" && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                                Urgente
                            </span>
                        )}
                        {list.status === "complete" && (
                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <Calendar size={11} className="text-gray-400" />
                        <span className="text-[11px] text-gray-400">Creada: {list.createdLabel}</span>
                    </div>
                </div>
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 -mr-1"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
                            <button
                                onClick={() => { setIsMenuOpen(false); onEdit(); }}
                                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Edit2 size={14} /> Editar
                            </button>
                            <button
                                onClick={() => { setIsMenuOpen(false); onDelete(); }}
                                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer to push progress to bottom */}
            <div className="flex-1" />

            {/* Progress */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Progreso</span>
                    <span
                        className={`text-[11px] font-semibold ${isComplete ? "text-green-600" : "text-gray-600"
                            }`}
                    >
                        {list.progress}/{list.total} items
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${isComplete ? "bg-green-500" : list.status === "urgent" ? "bg-red-400" : "bg-green-400"
                            }`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Button */}
            <button
                onClick={() => onViewDetails(list)}
                className="w-full py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
                Ver Detalles
            </button>
        </div>
    );
}
