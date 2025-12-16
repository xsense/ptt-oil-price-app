'use client';

import { OilPrice } from '@/lib/ptt-client';
import PriceCard from '@/components/PriceCard';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

interface HomeClientProps {
    initialPrices: OilPrice[];
    currentLang: 'th' | 'en';
}

export default function HomeClient({ initialPrices, currentLang }: HomeClientProps) {
    const prices = initialPrices;
    const language = currentLang;

    // Helper for simple translations (since we removed the context)
    const t = (th: string, en: string) => (language === 'th' ? th : en);

    const today = new Date().toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen py-12 px-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>

            <div className="container relative z-10">
                <header className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                        <span className="text-gradient">PTT Oil Price</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        {t('ราคาน้ำมันเรียลไทม์จาก ORApi', 'Real-time fuel prices directly from ORApi.')} <br />
                        <span className="text-gold mt-2 block">{today}</span>
                    </p>
                </header>

                {prices.length === 0 ? (
                    <div className="text-center text-red-400 glass p-8 mt-10">
                        {t('ไม่สามารถโหลดข้อมูลราคาน้ำมันได้ กรุณาลองใหม่อีกครั้ง', 'Failed to load prices. Please try again later.')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {prices.map((fuel, index) => (
                            <PriceCard
                                key={`${fuel.PRODUCT}-${language}`}
                                product={fuel.PRODUCT}
                                price={fuel.PRICE}
                                delay={index * 100}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center animate-fade-in flex flex-col md:flex-row gap-4 justify-center" style={{ animationDelay: '0.8s' }}>
                    <Link
                        href={`/history?lang=${language}`}
                        className="inline-block px-8 py-4 rounded-full glass hover:bg-white/20 transition-all font-medium text-lg"
                    >
                        {t('ดูราคาย้อนหลัง →', 'View Price History →')}
                    </Link>
                    <Link
                        href={`/provincial?lang=${language}`}
                        className="inline-block px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all font-medium text-lg text-gold"
                    >
                        {t('เช็คราคาต่างจังหวัด →', 'Check Provincial Price →')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
