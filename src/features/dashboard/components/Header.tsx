import React from 'react';

export function Header() {
    return (
        <header className="flex items-center justify-between bg-white dark:bg-background-dark px-8 py-4 border-b border-[#f1f3f1] dark:border-white/10 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold dark:text-white">Dashboard Principal</h2>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 p-1 pr-4 bg-background-light dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaEH8cHpHUZ_D6HlMf8PaS08PbWgbQVPTcPIzKcrqq97ysn6hzlBvCSUiF1Z8AThMs4TKy-HDRlF_xi9UXPwOigYM0ovJBYCxkFCyaIT7mC109HYMlKsKBfyG91prnWzWc2dcrsl-mtsOO9hDha-cAXDIqgQcAcZFqadWOHTV54RC98zyjwDgw_pmYiqQ1aTXopFQU_ganKxjHHPWpyrlxBOQdTzOAMYpsPL7MU2Y7sJdN6sBksVz29EY5dX6_lUsvJx7-Bim6coXc')" }}></div>
                    <span className="text-sm font-medium">Mi Perfil</span>
                </button>
            </div>
        </header>
    );
}
