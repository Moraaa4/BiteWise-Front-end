"use client";

import React from "react";
import { Plus } from "lucide-react";

interface CreateListCardProps {
    onCreate: () => void;
}

export default function CreateListCard({ onCreate }: CreateListCardProps) {
    return (
        <button
            onClick={onCreate}
            className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-green-400 hover:bg-green-50/40 transition-all duration-200 min-h-[200px] group"
        >
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 group-hover:border-green-400 flex items-center justify-center transition-colors duration-200">
                <Plus size={20} className="text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                    Crear Nueva Lista
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Empieza a planificar</p>
            </div>
        </button>
    );
}
