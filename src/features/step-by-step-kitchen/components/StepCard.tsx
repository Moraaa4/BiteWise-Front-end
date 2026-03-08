"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { CookingStep } from "@/features/step-by-step-kitchen/pasoAPasoTypes";

interface StepCardProps {
    step: CookingStep;
    isCompleted: boolean;
    isActive: boolean;
    onToggle: (id: string) => void;
}

export default function StepCard({ step, isCompleted, isActive, onToggle }: StepCardProps) {
    return (
        <div
            className={`bg-white dark:bg-zinc-900 border rounded-xl p-5 flex gap-4 transition-all duration-200 ${isActive
                ? "border-green-300 dark:border-green-600 shadow-sm shadow-green-100 dark:shadow-green-900/20"
                : isCompleted
                    ? "border-gray-100 dark:border-zinc-700 opacity-70"
                    : "border-gray-200 dark:border-zinc-700"
                }`}
        >
            {/* Step number */}
            <div className="shrink-0 pt-0.5">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-2 border-green-400"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"
                        }`}
                >
                    {step.stepNumber}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3
                            className={`text-sm font-bold mb-1 ${isCompleted ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-white"
                                }`}
                        >
                            {step.title}
                        </h3>
                        <p className={`text-xs leading-relaxed ${isCompleted ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
                            {step.description}
                        </p>
                    </div>

                    {/* Complete toggle */}
                    <button
                        onClick={() => onToggle(step.id)}
                        className="shrink-0 mt-0.5 transition-transform hover:scale-110"
                    >
                        {isCompleted ? (
                            <CheckCircle2 size={22} className="text-green-500" />
                        ) : (
                            <Circle size={22} className="text-gray-300 dark:text-gray-600 hover:text-green-400 transition-colors" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
