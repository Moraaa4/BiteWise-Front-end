import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/config/constants';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface HeaderProps {
    title?: string;
}

export function Header({ title = "Dashboard Principal" }: HeaderProps) {
    const [name, setName] = useState("Mi Perfil");
    const [initials, setInitials] = useState("M");

    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.name) {
                    setName(userData.name);
                    const match = userData.name.match(/(\w)/);
                    if (match) setInitials(match[1].toUpperCase());
                }
            } catch (e) {
                console.error("Error al parsear el usuario del localStorage", e);
            }
        }
    }, []);

    return (
        <header className="flex items-center justify-between bg-white dark:bg-background-dark px-8 py-4 border-b border-[#f1f3f1] dark:border-white/10 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold dark:text-white">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 p-1 pr-4 bg-background-light dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:bg-emerald-600 transition-colors">
                        {initials}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                </Link>
            </div>
        </header>
    );
}
