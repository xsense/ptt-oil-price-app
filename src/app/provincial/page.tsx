import { getProvincialOilPrice } from '@/lib/ptt-client';
import PriceCard from '@/components/PriceCard';
import ProvinceSelector from '@/components/ProvinceSelector';
import Link from 'next/link';
import { Suspense } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ProvincialPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function ProvincialContent({ searchParams }: ProvincialPageProps) {
    const { province, lang: langParam } = await searchParams;
    const lang = (Array.isArray(langParam) ? langParam[0] : langParam) === 'en' ? 'en' : 'th';
    const provinceName = typeof province === 'string' ? province : '';

    // Pass lang to API
    const prices = provinceName ? await getProvincialOilPrice(provinceName, lang) : [];

    return (
        <div className="container relative z-10">
            <div className="fixed top-4 right-4 z-[100]">
                <LanguageSwitcher />
            </div>
            <div className="mb-8">
                <Link href={`/?lang=${lang}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    ← {lang === 'th' ? 'กลับไปหน้าหลัก' : 'Back to Home'}
                </Link>
            </div>

            <header className="text-center mb-8 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Provincial Prices
                </h1>
                <p className="text-xl text-gold font-light">
                    {provinceName || "Select a location"}
                </p>
            </header>

            <Suspense fallback={<div>Loading selector...</div>}>
                <ProvinceSelector />
            </Suspense>

            {!provinceName ? (
                <div className="text-center text-gray-500 mt-10 animate-fade-in">
                    Please select a province to view oil prices.
                </div>
            ) : prices.length === 0 ? (
                <div className="text-center text-gray-400 glass p-12 max-w-2xl mx-auto animate-fade-in">
                    <p className="mb-2 text-xl">No data available for {provinceName}.</p>
                    <p className="text-sm opacity-60">Try selecting a different province or check your connection.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(
                        prices.reduce((acc, price) => {
                            const loc = price.LOCATION || 'General';
                            if (!acc[loc]) acc[loc] = [];
                            acc[loc].push(price);
                            return acc;
                        }, {} as Record<string, typeof prices>)
                    ).sort(([a], [b]) => a.localeCompare(b)).map(([location, locationPrices], locIndex) => (
                        <section key={location} className="animate-fade-in" style={{ animationDelay: `${locIndex * 100}ms` }}>
                            <h2 className="text-2xl font-semibold mb-6 text-white border-b border-white/10 pb-2 inline-block">
                                {location}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {locationPrices.map((fuel, index) => (
                                    <PriceCard
                                        key={`${fuel.PRODUCT}-${fuel.LOCATION}-${index}`}
                                        product={fuel.PRODUCT}
                                        price={fuel.PRICE}
                                        location={fuel.LOCATION} // Redundant if grouped
                                        delay={index * 50}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProvincialPage(props: ProvincialPageProps) {
    return (
        <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <Suspense fallback={<div className="text-center p-20 text-white">Loading Provincial Data...</div>}>
                <ProvincialContent {...props} />
            </Suspense>
        </main>
    );
}
