'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
            <button
                onClick={() => setLanguage('th')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'th'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
            >
                TH
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${language === 'en'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
