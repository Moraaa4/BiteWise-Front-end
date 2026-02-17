import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiteWise Landing Page",
  description: "Cocina fácil sin pensar. Ahorra tiempo, dinero y reduce el desperdicio de comida con nuestro asistente culinario inteligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <body
        className={`${inter.variable} font-display bg-background-light dark:bg-background-dark text-[#111811] dark:text-white transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
