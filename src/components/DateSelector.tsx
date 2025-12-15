'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DateSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(initialDate);
    const [loading, setLoading] = useState(false);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        setLoading(true);
        router.push(`/history?date=${newDate}`);
        // Reset loading state effectively happens on navigation complete, 
        // but Next.js router.push is async and doesn't promise completion like that easily.
        // For simple UI feedback, simple timeout or effect in parent is better, 
        // but we'll keep it simple for now.
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="glass p-6 max-w-lg mx-auto mb-12 text-center">
            <label htmlFor="history-date" className="label-text block mb-3">
                Select Date
            </label>
            <div className="relative group">
                <input
                    type="date"
                    id="history-date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-lg focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all cursor-pointer font-sans"
                    style={{ colorScheme: 'dark' }}
                />
                {loading && (
                    <div className="absolute right-5 top-4 text-white/80">
                        <span className="block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    </div>
                )}
            </div>
        </div>
    );
}
