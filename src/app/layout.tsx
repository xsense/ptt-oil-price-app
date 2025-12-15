import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
    title: 'PTT Oil Price Premium',
    description: 'Real-time oil prices from PTT OR',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="relative min-h-screen p-4 sm:p-8">
                <Providers>
                    <main className="max-w-7xl mx-auto">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
