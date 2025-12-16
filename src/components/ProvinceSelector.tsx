'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { VALID_PROVINCES } from '@/lib/provinces';

export default function ProvinceSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialProvince = searchParams.get('province') || '';
    const [province, setProvince] = useState(initialProvince);
    const [loading, setLoading] = useState(false);

    // Get lang to preserve it
    const lang = searchParams.get('lang') || 'th';

    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value;
        setProvince(newProvince);
        if (newProvince) {
            setLoading(true);
            router.push(`/provincial?lang=${lang}&province=${newProvince}`);
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const provinceList = Object.keys(VALID_PROVINCES).sort();

    return (
        <div className="glass p-6 max-w-lg mx-auto mb-12 text-center">
            <label htmlFor="province-select" className="label-text block mb-3 flex justify-center items-center gap-2">
                {lang === 'th' ? 'เลือกจังหวัด' : 'Select Location'} <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Supports Real-time Data"></span>
            </label>
            <div className="relative group">
                <select
                    id="province-select"
                    value={province}
                    onChange={handleProvinceChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-lg focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all cursor-pointer appearance-none"
                    style={{ colorScheme: 'dark' }}
                >
                    <option value="" disabled>{lang === 'th' ? 'เลือกจังหวัด...' : 'Choose a Province'}</option>
                    {provinceList.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <div className="absolute right-5 top-4 pointer-events-none text-white/30 group-hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
                {loading && (
                    <div className="absolute right-12 top-4 text-white/80">
                        <span className="block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    </div>
                )}
            </div>
        </div>
    );
}
