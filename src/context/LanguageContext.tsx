'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (th: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('th');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Only run on client side
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
            setLanguage(savedLang);
        } else {
            // Detect browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('en')) {
                setLanguage('en');
            }
            // Default is 'th' which is already set
        }
        setMounted(true);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (th: string, en: string) => {
        return language === 'en' ? en : th;
    };

    if (!mounted) {
        // Return null or a loader to avoid hydration mismatch if needed, 
        // but for this simple app, rendering with default 'th' is fine 
        // until effect runs. However, to be cleaner with hydration:
        // We can just render children with default 'th' server-side match
        // or suppress warning.
        // Let's stick to default 'th' to show something immediately.
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
