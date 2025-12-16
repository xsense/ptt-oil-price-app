import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'PTT Oil Price Premium',
    description: 'Real-time oil prices from PTT OR',
};

import Navbar from '@/components/Navbar';

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30`}>
                <Navbar />
                <main className="pt-20">
                    {children}
                </main>
            </body>
        </html>
    );
}
