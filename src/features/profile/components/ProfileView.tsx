"use client";

import React, { useState, useEffect } from "react";
import { Mail, Wallet, Calendar, Pencil, PencilLine, Loader2 } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";
import EditBudgetModal from "@/features/profile/components/EditBudgetModal";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import type { UserProfile } from "@/features/profile/perfilTypes";
import { usersService } from "@/services/users.service";

function getInitials(name: string): string {
    if (!name) return "?";
    return name.split(' ')
        .map(n => n[0])
        .filter(c => !!c)
        .join('')
        .substring(0, 2)
        .toUpperCase() || "?";
}

function formatDate(isoDate: string): string {
    try {
        const date = new Date(isoDate);
        return date.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return isoDate;
    }
}

export default function ProfileView() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            setError("No se encontró sesión activa. Inicia sesión de nuevo.");
            setLoading(false);
            return;
        }

        try {
            const res = await usersService.getProfile(userId, token);
            if (res.ok && res.data && res.data.user) {
                const u = res.data.user;
                const budgetNum = u.weekly_budget !== undefined && u.weekly_budget !== null
                    ? Number(u.weekly_budget)
                    : 0;

                // Load stats from localStorage with multiple possible keys for robustness
                let recipeCount = 0;
                let listCount = 0;
                let savingsPercent = 0;

                try {
                    const cookHistory = JSON.parse(localStorage.getItem('biteWise_cookHistory') || '[]');
                    recipeCount = Array.isArray(cookHistory) ? cookHistory.length : 0;
                } catch (e) { console.error("Error parsing cookHistory", e); }

                try {
                    const sessionsRaw = localStorage.getItem('biteWise_cookingSessions');
                    if (sessionsRaw) {
                        const sessions = JSON.parse(sessionsRaw);
                        const sessionValues = Object.values(sessions);
                        const sessionsStarted = sessionValues.length;
                        const sessionsDone = sessionValues.filter((s: any) => s.isCompleted).length;
                        // We use whichever is higher between the history and started sessions
                        recipeCount = Math.max(recipeCount, sessionsStarted, sessionsDone);
                    }
                } catch (e) { console.error("Error parsing cookingSessions", e); }

                try {
                    const lists = JSON.parse(localStorage.getItem('biteWise_shoppingLists') || '[]');
                    listCount = Array.isArray(lists) ? lists.length : 0;
                } catch (e) { console.error("Error parsing shoppingLists", e); }

                // Basic savings logic
                if (recipeCount > 0) {
                    savingsPercent = Math.min(45, 12 + (recipeCount * 2));
                }

                setProfile({
                    id: u.id,
                    name: u.name,
                    initials: getInitials(u.name),
                    plan: u.role === "admin" ? "Admin" : "Cliente",
                    role: u.role,
                    email: u.email,
                    weeklyBudget: budgetNum,
                    currency: "MXN",
                    memberSince: u.created_at ? formatDate(u.created_at) : "—",
                    stats: {
                        recipes: recipeCount,
                        lists: listCount,
                        savings: savingsPercent,
                    },
                });
            } else {
                setError(res.error || "No se pudo obtener el perfil.");
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
            setError("Error de conexión al obtener el perfil.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveBudget = async (newBudget: number) => {
        const token = localStorage.getItem("token");
        const userId = profile?.id;
        if (!token || !userId) return;

        try {
            const res = await usersService.updateProfile(userId, { weekly_budget: newBudget }, token);
            if (res.ok) {
                setProfile((prev) => prev ? { ...prev, weeklyBudget: newBudget } : prev);
            } else {
                alert(res.error || "No se pudo actualizar el presupuesto.");
            }
        } catch {
            alert("Error de conexión al actualizar el presupuesto.");
        }
    };

    const handleSaveProfile = async (updates: Partial<UserProfile>) => {
        const token = localStorage.getItem("token");
        const userId = profile?.id;
        if (!token || !userId) return;

        try {
            const res = await usersService.updateProfile(userId, { name: updates.name }, token);
            if (res.ok) {
                setProfile((prev) => {
                    if (!prev) return prev;
                    const newName = updates.name || prev.name;
                    return {
                        ...prev,
                        ...updates,
                        name: newName,
                        initials: getInitials(newName),
                    };
                });
                // Update localStorage too
                const stored = localStorage.getItem("user");
                if (stored) {
                    const user = JSON.parse(stored);
                    user.name = updates.name || user.name;
                    localStorage.setItem("user", JSON.stringify(user));
                }
            } else {
                alert(res.error || "No se pudo actualizar el perfil.");
            }
        } catch {
            alert("Error de conexión al actualizar el perfil.");
        }
    };

    const formatBudget = (amount: number) =>
        amount > 0
            ? `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${profile?.currency || "MXN"}`
            : "—";

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
                <Sidebar activeTab="perfil" />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <Header title="Mi Perfil" />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <p className="text-sm text-gray-500">Cargando perfil...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
                <Sidebar activeTab="perfil" />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <Header title="Mi Perfil" />
                    <main className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center max-w-sm">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Error al cargar perfil</h3>
                            <p className="text-sm text-gray-500 mb-4">{error || "No se pudieron obtener los datos."}</p>
                            <button
                                onClick={() => { setLoading(true); setError(""); fetchProfile(); }}
                                className="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

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
                                            Presupuesto Semanal
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-gray-100 dark:divide-white/10 px-2 py-4">
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
                {showBudgetModal && profile && (
                    <EditBudgetModal
                        currentBudget={profile.weeklyBudget}
                        currency={profile.currency}
                        onSave={handleSaveBudget}
                        onClose={() => setShowBudgetModal(false)}
                    />
                )}

                {/* Edit Profile Modal */}
                {showProfileModal && profile && (
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
