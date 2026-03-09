import { Suspense } from "react";
import RecipeDetailView from "@/features/recipes-details/components/RecipeDetailView";

export default function RecipeDetailPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando aplicación...</div>}>
            <RecipeDetailView />
        </Suspense>
    );
}
