import { getCurrentOilPrice } from '@/lib/ptt-client';
import HomeClient from '@/components/HomeClient';
import { Suspense } from 'react';

export const revalidate = 60; // Revalidate every 1 minute

interface HomeProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: HomeProps) {
    const searchParams = await props.searchParams;
    // Get lang from URL, default to 'th'
    const lang = (searchParams?.lang === 'en' ? 'en' : 'th') as 'th' | 'en';

    // Fetch prices in the requested language
    const prices = await getCurrentOilPrice(lang);

    return (
        <Suspense fallback={<div className="text-center p-20 text-white">Loading...</div>}>
            <HomeClient initialPrices={prices} currentLang={lang} />
        </Suspense>
    );
}
