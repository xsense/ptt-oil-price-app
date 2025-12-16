import { getCurrentOilPrice } from '@/lib/ptt-client';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60; // Revalidate every 1 minute

export default async function Home() {
    // Fetch both languages (SSR/ISR on Vercel)
    const [thPrices, enPrices] = await Promise.all([
        getCurrentOilPrice('th'),
        getCurrentOilPrice('en')
    ]);

    return (
        <HomeClient initialPrices={{ th: thPrices, en: enPrices }} />
    );
}
