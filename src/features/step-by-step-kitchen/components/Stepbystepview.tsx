"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import StepCard from "@/features/step-by-step-kitchen/components/StepCard";
import type { CookingGuide, CookingStep } from "@/features/step-by-step-kitchen/pasoAPasoTypes";
import { catalogService } from "@/services/catalog.service";
import { useSearchParams, useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/config/constants";

function parseInstructions(instructions: string): CookingStep[] {
    if (!instructions || !instructions.trim()) return [];

    const rawSteps = instructions
        .split(/\r?\n/)
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0);

    return rawSteps.map((text: string, i: number) => ({
        id: `step-${i}`,
        stepNumber: i + 1,
        title: `Paso ${i + 1}`,
        description: text.replace(/^\d+[\.\)\-]\s*/, ""),
    }));
}

// --- LocalStorage helpers for cooking sessions ---
interface CookingSession {
    recipeId: string;
    recipeName: string;
    imageUrl: string;
    totalSteps: number;
    completedStepIds: string[];
    isCompleted: boolean;
    lastUpdated: number;
    instructions: string;
}

function getSessions(): Record<string, CookingSession> {
    if (typeof window === 'undefined') return {};
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.COOKING_SESSIONS) || '{}');
    } catch { return {}; }
}

function saveSession(session: CookingSession) {
    const sessions = getSessions();
    sessions[session.recipeId] = session;
    localStorage.setItem(STORAGE_KEYS.COOKING_SESSIONS, JSON.stringify(sessions));
}

export default function StepByStepView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const recipeId = searchParams.get("recipeId") || "";
    const recipeName = searchParams.get("name") || "";

    const [guide, setGuide] = useState<CookingGuide>({ recipeName: "", steps: [] });
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Restore saved progress if it exists
    useEffect(() => {
        if (!recipeId) return;
        const sessions = getSessions();
        const session = sessions[recipeId];
        if (session && session.completedStepIds.length > 0) {
            setCompletedIds(new Set(session.completedStepIds));
        }
    }, [recipeId]);

    useEffect(() => {
        const loadRecipeData = async () => {
            // 1. Try localStorage (set by RecipeDetail)
            const stored = localStorage.getItem(STORAGE_KEYS.STEP_BY_STEP);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    if (data.instructions && data.instructions.trim()) {
                        const steps = parseInstructions(data.instructions);
                        const finalGuide: CookingGuide = {
                            recipeName: data.name || recipeName,
                            steps: steps.length > 0 ? steps : [{
                                id: "step-0",
                                stepNumber: 1,
                                title: "Preparación",
                                description: data.instructions,
                            }],
                        };
                        setGuide(finalGuide);

                        // Save session for persistence
                        const sessions = getSessions();
                        const existing = sessions[recipeId];
                        saveSession({
                            recipeId,
                            recipeName: data.name || recipeName,
                            imageUrl: data.imageUrl || '',
                            totalSteps: finalGuide.steps.length,
                            completedStepIds: existing?.completedStepIds || [],
                            isCompleted: false,
                            lastUpdated: Date.now(),
                            instructions: data.instructions,
                        });

                        localStorage.removeItem(STORAGE_KEYS.STEP_BY_STEP);
                        setLoading(false);
                        return;
                    }
                } catch { /* continue */ }
            }

            // 2. Try existing session
            const sessions = getSessions();
            const session = sessions[recipeId];
            if (session && session.instructions) {
                const steps = parseInstructions(session.instructions);
                setGuide({
                    recipeName: session.recipeName || recipeName,
                    steps: steps.length > 0 ? steps : [{
                        id: "step-0",
                        stepNumber: 1,
                        title: "Preparación",
                        description: session.instructions,
                    }],
                });
                setLoading(false);
                return;
            }

            // 3. Fallback: API
            if (!recipeId) { setLoading(false); return; }
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) { setLoading(false); return; }

            try {
                const res = await catalogService.getRecipeById(Number(recipeId), undefined, token);
                if (res.ok && res.data?.recipe) {
                    const recipe = res.data.recipe;
                    const instructions = recipe.instructions || "";
                    const steps = parseInstructions(instructions);
                    const finalGuide: CookingGuide = {
                        recipeName: recipe.title || recipeName,
                        steps: steps.length > 0 ? steps : [{
                            id: "step-0",
                            stepNumber: 1,
                            title: "Preparación",
                            description: instructions || "No hay instrucciones disponibles.",
                        }],
                    };
                    setGuide(finalGuide);

                    saveSession({
                        recipeId,
                        recipeName: recipe.title || recipeName,
                        imageUrl: recipe.image_url || '',
                        totalSteps: finalGuide.steps.length,
                        completedStepIds: [],
                        isCompleted: false,
                        lastUpdated: Date.now(),
                        instructions,
                    });
                }
            } catch (e) {
                console.error("Error fetching recipe:", e);
            } finally {
                setLoading(false);
            }
        };

        loadRecipeData();
    }, [recipeId, recipeName]);

    // Persist progress on every toggle
    const toggleStep = useCallback((id: string) => {
        setCompletedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);

            // Save progress
            const sessions = getSessions();
            const session = sessions[recipeId];
            if (session) {
                session.completedStepIds = Array.from(next);
                session.isCompleted = next.size === guide.steps.length;
                session.lastUpdated = Date.now();
                saveSession(session);
            }

            return next;
        });
    }, [recipeId, guide.steps.length]);

    const allCompleted =
        guide.steps.length > 0 && completedIds.size === guide.steps.length;

    const activeStepId =
        guide.steps.find((s) => !completedIds.has(s.id))?.id ?? null;

    const progressPercent =
        guide.steps.length > 0
            ? Math.round((completedIds.size / guide.steps.length) * 100)
            : 0;

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-background-dark">
            <Sidebar activeTab="cocina" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 px-8 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <ArrowLeft size={18} className="text-gray-500 dark:text-gray-400" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {guide.recipeName || recipeName || "Cargando receta..."}
                            </h1>
                            <p className="text-xs text-gray-400">Modo paso a paso</p>
                        </div>
                    </div>

                    {guide.steps.length > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                                {completedIds.size}/{guide.steps.length} pasos
                            </span>
                        </div>
                    )}
                </header>

                {/* Steps list */}
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full gap-3 text-gray-400 text-sm">
                            <Loader2 size={20} className="animate-spin" />
                            Cargando pasos de la receta...
                        </div>
                    ) : guide.steps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-3">
                            <span className="text-4xl">📭</span>
                            No se encontraron instrucciones para esta receta.
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto flex flex-col gap-3">
                            {guide.steps.map((step) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    isCompleted={completedIds.has(step.id)}
                                    isActive={step.id === activeStepId}
                                    onToggle={toggleStep}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* Bottom bar */}
                <div className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-white/10 px-8 py-4 flex justify-between items-center shrink-0">
                    <button
                        onClick={() => router.push("/kitchen")}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors font-medium"
                    >
                        ← Volver a la cocina
                    </button>
                    <button
                        onClick={() => {
                            if (allCompleted) {
                                alert("🎉 ¡Felicidades! Has completado todos los pasos. ¡Buen provecho!");
                                router.push("/kitchen");
                            }
                        }}
                        disabled={!allCompleted}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${allCompleted
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-200 cursor-pointer"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <CheckCircle2 size={15} />
                        {allCompleted ? "¡Cocina Finalizada! 🎉" : `${guide.steps.length - completedIds.size} pasos restantes`}
                    </button>
                </div>
            </div>
        </div>
    );
}
