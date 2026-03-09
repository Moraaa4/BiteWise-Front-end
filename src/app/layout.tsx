import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import ThemeSwitch from '@/components/ThemeSwitch';
import AuthCheck from '@/components/AuthCheck';
import { EXTERNAL_URLS, BRAND_TEXT } from '@/config/constants';

export const metadata: Metadata = {
  title: BRAND_TEXT.META_TITLE,
  description: BRAND_TEXT.META_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href={EXTERNAL_URLS.GOOGLE_FONTS}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthCheck>
            {children}
          </AuthCheck>
          <ThemeSwitch />
        </ThemeProvider>
      </body>
    </html>
  );
}