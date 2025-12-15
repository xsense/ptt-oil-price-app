import { getOilPriceHistory } from '@/lib/ptt-client';
import PriceCard from '@/components/PriceCard';
import DateSelector from '@/components/DateSelector';
import Link from 'next/link';
import { Suspense } from 'react';

interface HistoryPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HistoryPage() {
    // Static export: Always render for "today" or a fixed date.
    // Dynamic searchParams are not supported in output: 'export'.
    const targetDate = new Date(); // Build time "today"

    // Validate date: if invalid, fallback to today
    const validDate = isNaN(targetDate.getTime()) ? new Date() : targetDate;

    const prices = await getOilPriceHistory(validDate);

    const displayDate = validDate.toLocaleDateString('en-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen py-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container relative z-10">
                <div className="mb-8">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Current Prices
                    </Link>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-4 rounded-lg mb-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
                    ⚠️ Note: Historical data browsing is disabled in this static demo due to API restrictions. Showing data for: {displayDate}
                </div>

                <header className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Price History
                    </h1>
                    <p className="text-xl text-gold font-light">
                        {displayDate}
                    </p>
                </header>

                {/* Client Component for Date Selection */}
                <Suspense fallback={<div>Loading...</div>}>
                    <DateSelector />
                </Suspense>

                {prices.length === 0 ? (
                    <div className="text-center text-gray-400 glass p-12 max-w-2xl mx-auto animate-fade-in">
                        <p className="mb-2 text-xl">No data available for this date.</p>
                        <p className="text-sm opacity-60">Try selecting a different date or check your connection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {prices.map((fuel, index) => (
                            <PriceCard
                                key={fuel.PRODUCT}
                                product={fuel.PRODUCT}
                                price={fuel.PRICE}
                                delay={index * 50}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
