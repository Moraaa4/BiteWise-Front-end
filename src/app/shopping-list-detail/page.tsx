import { Suspense } from "react";
import ListaDetalleView from "@/features/shopping-list-detail/components/List-detail-view";

export default function ShoppingListDetailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
            <ListaDetalleView />
        </Suspense>
    );
}