import { getOilPriceHistory } from '@/lib/ptt-client';
import PriceCard from '@/components/PriceCard';
import DateSelector from '@/components/DateSelector';
import Link from 'next/link';
import { Suspense } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface HistoryPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function HistoryContent({ searchParams }: HistoryPageProps) {
    const { date, lang: langParam } = await searchParams;
    const lang = (Array.isArray(langParam) ? langParam[0] : langParam) === 'en' ? 'en' : 'th';
    const dateStr = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const targetDate = new Date(dateStr);

    // Validate date: if invalid, fallback to today
    const validDate = isNaN(targetDate.getTime()) ? new Date() : targetDate;

    // Pass lang to API
    const prices = await getOilPriceHistory(validDate, lang);

    const displayDate = validDate.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="container relative z-10">
            <div className="mb-4">
                {/* Spacer if needed, or rely on layout padding */}
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
            <Suspense fallback={<div>Loading selector...</div>}>
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
    );
}

export default function HistoryPage(props: HistoryPageProps) {
    return (
        <main className="min-h-screen py-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <Suspense fallback={<div className="text-center p-20 text-white">Loading Price History...</div>}>
                <HistoryContent {...props} />
            </Suspense>
        </main>
    );
}
