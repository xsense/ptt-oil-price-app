import { getCurrentOilPrice } from '@/lib/ptt-client';
import HomeClient from '@/components/HomeClient';



export default async function Home() {
    // Fetch both languages at build time
    const [thPrices, enPrices] = await Promise.all([
        getCurrentOilPrice('th'),
        getCurrentOilPrice('en')
    ]);

    return (
        <HomeClient initialPrices={{ th: thPrices, en: enPrices }} />
    );
}
