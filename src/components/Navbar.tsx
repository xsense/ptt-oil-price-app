'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') || 'th') as 'th' | 'en';

    const isHome = pathname === '/';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 pointer-events-none">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between pointer-events-auto">
                {/* Left Side: Logo or Back Button */}
                <div className="flex items-center">
                    {isHome ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 animate-pulse"></div>
                            <span className="font-bold text-lg tracking-tight">PTT Oil Price</span>
                        </div>
                    ) : (
                        <Link
                            href={`/?lang=${lang}`}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                        >
                            <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="font-medium">{lang === 'th' ? 'หน้าหลัก' : 'Home'}</span>
                        </Link>
                    )}
                </div>

                {/* Right Side: Language Switcher */}
                <div>
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
