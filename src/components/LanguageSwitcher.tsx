'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Default to 'th' if no param is present (or 'en' if browser logic was preferred, but for URL persistence 'th' default is safer for consistent SSR)
    // Actually, let's keep it simple: check param, default 'th'.
    const currentLang = searchParams.get('lang') === 'en' ? 'en' : 'th';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const switchLanguage = (lang: 'th' | 'en') => {
        router.push(pathname + '?' + createQueryString('lang', lang));
    };

    return (
        <div className="flex bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
                onClick={() => switchLanguage('th')}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${currentLang === 'th'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'text-white/60 hover:text-white'
                    }`}
            >
                TH
            </button>
            <button
                onClick={() => switchLanguage('en')}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${currentLang === 'en'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-white/60 hover:text-white'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
