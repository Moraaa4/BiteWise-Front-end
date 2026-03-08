"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface EditBudgetModalProps {
    currentBudget: number;
    currency: string;
    onSave: (newBudget: number) => void | Promise<void>;
    onClose: () => void;
}

export default function EditBudgetModal({
    currentBudget,
    currency,
    onSave,
    onClose,
}: EditBudgetModalProps) {
    const [value, setValue] = useState(currentBudget.toString());

    const handleSave = () => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed > 0) {
            onSave(parsed);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Editar Gasto Semanal</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mb-5">
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5 block">
                        Presupuesto semanal ({currency})
                    </label>
                    <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                        <span className="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                            $
                        </span>
                        <input
                            type="number"
                            min="0"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                            className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="0.00"
                            autoFocus
                        />
                        <span className="px-3 py-2.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-l border-gray-200 dark:border-white/10">
                            {currency}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
