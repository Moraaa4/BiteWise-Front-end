"use client";

import React, { useState } from "react";
import { X, User, Mail } from "lucide-react";
import type { UserProfile } from "@/features/profile/perfilTypes";

interface EditProfileModalProps {
    currentProfile: UserProfile;
    onSave: (updatedProfile: Partial<UserProfile>) => void;
    onClose: () => void;
}

export default function EditProfileModal({
    currentProfile,
    onSave,
    onClose,
}: EditProfileModalProps) {
    const [name, setName] = useState(currentProfile.name);
    const [email, setEmail] = useState(currentProfile.email);

    const handleSave = () => {
        if (!name.trim() || !email.trim()) return;

        // Extract initials logic based on newly inputted name
        const match = name.match(/(\w)\w*\s*(\w)?/);
        let initials = "?";
        if (match) {
            initials = ((match[1] || "") + (match[2] || "")).toUpperCase();
        }

        onSave({ name, email, initials });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Name */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Nombre
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <User size={16} />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="Tu nombre"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wide">
                            Email
                        </label>
                        <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                            <span className="px-3 py-2.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none bg-white dark:bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>


                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
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
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
