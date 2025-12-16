import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'PTT Oil Price Premium',
    description: 'Real-time oil prices from PTT OR',
};

import Navbar from '@/components/Navbar';
import { Suspense } from 'react';

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30`}>
                <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10" />}>
                    <Navbar />
                </Suspense>
                <main className="pt-24">
                    {children}
                </main>
            </body>
        </html>
    );
}
