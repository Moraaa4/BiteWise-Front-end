'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { STORAGE_KEYS, APP_ROUTES } from '@/config/constants';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            let loginTimestamp = localStorage.getItem(STORAGE_KEYS.LOGIN_TS);
            const isPublicPath = [APP_ROUTES.LOGIN, APP_ROUTES.REGISTER, APP_ROUTES.LANDING].includes(pathname as any) || pathname === '/';

            if (token) {
                // Migración: Si tiene token pero no timestamp, le damos uno ahora
                if (!loginTimestamp) {
                    loginTimestamp = Date.now().toString();
                    localStorage.setItem(STORAGE_KEYS.LOGIN_TS, loginTimestamp);
                }

                const now = Date.now();
                const twentyFourHours = 24 * 60 * 60 * 1000;
                const loginTime = parseInt(loginTimestamp, 10);

                if (now - loginTime > twentyFourHours) {
                    // Sesión realmente expirada
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER_ID);
                    localStorage.removeItem(STORAGE_KEYS.LOGIN_TS);
                    if (!isPublicPath) {
                        router.push(APP_ROUTES.LOGIN);
                    } else {
                        setIsChecking(false);
                    }
                    return;
                }

                // Si llegamos aquí, la sesión es válida (o se acaba de migrar)
                if (isPublicPath && pathname !== '/dashboard' && pathname !== '/landing') {
                    router.push(APP_ROUTES.DASHBOARD);
                } else {
                    setIsChecking(false);
                }
            } else {
                if (!isPublicPath) {
                    router.push(APP_ROUTES.LOGIN);
                } else {
                    setIsChecking(false);
                }
            }
        };

        checkAuth();
        window.addEventListener('focus', checkAuth);
        return () => window.removeEventListener('focus', checkAuth);
    }, [pathname, router]);

    if (isChecking && ![APP_ROUTES.LOGIN, APP_ROUTES.REGISTER, APP_ROUTES.LANDING, '/'].includes(pathname as any)) {
        return (
            <div suppressHydrationWarning className="h-screen w-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div suppressHydrationWarning className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
