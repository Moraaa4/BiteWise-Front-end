'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            let loginTimestamp = localStorage.getItem('loginTimestamp');
            const isPublicPath = ['/login', '/register', '/landing'].includes(pathname) || pathname === '/';

            if (token) {
                // Migración: Si tiene token pero no timestamp, le damos uno ahora
                if (!loginTimestamp) {
                    loginTimestamp = Date.now().toString();
                    localStorage.setItem('loginTimestamp', loginTimestamp);
                }

                const now = Date.now();
                const twentyFourHours = 24 * 60 * 60 * 1000;
                const loginTime = parseInt(loginTimestamp, 10);

                if (now - loginTime > twentyFourHours) {
                    // Sesión realmente expirada
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('loginTimestamp');
                    if (!isPublicPath) {
                        router.push('/login');
                    } else {
                        setIsChecking(false);
                    }
                    return;
                }

                // Si llegamos aquí, la sesión es válida (o se acaba de migrar)
                if (isPublicPath && pathname !== '/dashboard' && pathname !== '/landing') {
                    router.push('/dashboard');
                } else {
                    setIsChecking(false);
                }
            } else {
                if (!isPublicPath) {
                    router.push('/login');
                } else {
                    setIsChecking(false);
                }
            }
        };

        checkAuth();
        window.addEventListener('focus', checkAuth);
        return () => window.removeEventListener('focus', checkAuth);
    }, [pathname, router]);

    if (isChecking && !['/login', '/register', '/landing', '/'].includes(pathname)) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
