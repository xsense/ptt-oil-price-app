'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Default to 'th' if no param is present
    const currentLang = searchParams.get('lang') === 'en' ? 'en' : 'th';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    return (
        <div className="flex bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10">
            <Link
                href={pathname + '?' + createQueryString('lang', 'th')}
                replace
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${currentLang === 'th'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'text-white/60 hover:text-white'
                    }`}
            >
                TH
            </Link>
            <Link
                href={pathname + '?' + createQueryString('lang', 'en')}
                replace
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${currentLang === 'en'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-white/60 hover:text-white'
                    }`}
            >
                EN
            </Link>
        </div>
    );
}
