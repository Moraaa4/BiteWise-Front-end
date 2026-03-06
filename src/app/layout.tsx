import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import ThemeSwitch from '@/components/ThemeSwitch';

export const metadata: Metadata = {
  title: "BiteWise - Cocina Inteligente",
  description: "Ahorra tiempo y reduce el desperdicio de comida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body>
        <ThemeProvider attribute="class">
          {children}
          <ThemeSwitch />
        </ThemeProvider>
      </body>
    </html>
  );
}