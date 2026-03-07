"use client";

import React, { useState } from "react";
import { Mail, Wallet, Calendar, Pencil, PencilLine } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import EditBudgetModal from "@/features/profile/components/EditBudgetModal";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import type { UserProfile } from "@/features/profile/perfilTypes";

// Empty profile — data will be provided by the user / backend
const EMPTY_PROFILE: UserProfile = {
    name: "John Doe",
    initials: "JD",
    plan: "Premium",
    email: "john.doe@example.com",
    weeklyBudget: 1500,
    currency: "MXN",
    memberSince: "12 Oct, 2023",
    stats: {
        recipes: 0,
        lists: 0,
        savings: 0,
    },
};

export default function ProfileView() {
    const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleSaveBudget = (newBudget: number) => {
        setProfile((prev) => ({ ...prev, weeklyBudget: newBudget }));
    };

    const handleSaveProfile = (updates: Partial<UserProfile>) => {
        setProfile((prev) => ({ ...prev, ...updates }));
    };

    const formatBudget = (amount: number) =>
        amount > 0
            ? `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${profile.currency}`
            : "—";

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="perfil" />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header title="Mi Perfil" />

                {/* Main content */}
                <main className="flex-1 flex items-start justify-center p-4 md:p-8">
                    <div className="w-full max-w-sm mt-8">
                        {/* Profile card */}
                        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                            {/* Avatar + name */}
                            <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-gray-100 dark:border-white/10">
                                <div className="relative mb-3">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                                        <span className="text-white text-2xl font-bold">
                                            {profile.initials || "?"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowProfileModal(true)}
                                        className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <Pencil size={11} className="text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                    {profile.name || "—"}
                                </h2>
                                <span className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold mt-0.5">
                                    {profile.plan || "—"}
                                </span>
                            </div>

                            {/* Info fields */}
                            <div className="px-6 py-4 space-y-4 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-white/5">
                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <Mail size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                                            Email
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                            {profile.email || "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Weekly Budget */}
                                <div className="flex items-center gap-3">
                                    <Wallet size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                                            Weekly Budget
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{formatBudget(profile.weeklyBudget)}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowBudgetModal(true)}
                                        className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-500 font-semibold hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                    >
                                        <PencilLine size={12} />
                                        Editar
                                    </button>
                                </div>

                                {/* Member since */}
                                <div className="flex items-center gap-3">
                                    <Calendar size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                                            Cuenta
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {profile.memberSince ? `Miembro desde: ${profile.memberSince}` : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit profile button */}
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10">
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2"
                                >
                                    <Pencil size={14} />
                                    Editar Perfil
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/10 px-2 py-4">
                                <div className="flex flex-col items-center gap-0.5 px-4">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {profile.stats.recipes || "—"}
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                                        Recetas
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-4">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {profile.stats.lists || "—"}
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                                        Listas
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-4">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {profile.stats.savings > 0 ? `${profile.stats.savings}%` : "—"}
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                                        Ahorro
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Edit Budget Modal */}
                {showBudgetModal && (
                    <EditBudgetModal
                        currentBudget={profile.weeklyBudget}
                        currency={profile.currency}
                        onSave={handleSaveBudget}
                        onClose={() => setShowBudgetModal(false)}
                    />
                )}

                {/* Edit Profile Modal */}
                {showProfileModal && (
                    <EditProfileModal
                        currentProfile={profile}
                        onSave={handleSaveProfile}
                        onClose={() => setShowProfileModal(false)}
                    />
                )}
            </div>
        </div>
    );
}
