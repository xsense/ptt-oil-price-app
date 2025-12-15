import { getProvincialOilPrice } from '@/lib/ptt-client';
import PriceCard from '@/components/PriceCard';
import ProvinceSelector from '@/components/ProvinceSelector';
import Link from 'next/link';
import { Suspense } from 'react';

interface ProvincialPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProvincialPage() {
    // Static export: Dynamic searchParams are available only at runtime, 
    // but Server Components don't re-run on client.
    // And client-side fetching is blocked by CORS.
    // So this feature is disabled for the static demo.
    const provinceName = '';
    const prices: any[] = [];

    return (
        <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            {/* Background accent different from home */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container relative z-10">
                <div className="mb-8">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-4 rounded-lg mb-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
                    ⚠️ Note: Provincial prices referencing is disabled in this static demo due to API CORS restrictions.
                </div>

                <header className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Provincial Prices
                    </h1>
                    <p className="text-xl text-gold font-light">
                        Select a location
                    </p>
                </header>

                <Suspense fallback={<div>Loading...</div>}>
                    <ProvinceSelector />
                </Suspense>

                <div className="text-center text-gray-500 mt-10 animate-fade-in">
                    Provincial data is not available in static mode.
                </div>
            </div>
        </main>
    );
}
