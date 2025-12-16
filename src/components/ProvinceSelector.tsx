'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { VALID_PROVINCES } from '@/lib/provinces';
import { PROVINCE_TH_MAP } from '@/lib/province-th';

export default function ProvinceSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialProvince = searchParams.get('province') || '';
    const [province, setProvince] = useState(initialProvince);
    const [loading, setLoading] = useState(false);

    // Get lang to preserve it
    const lang = (searchParams.get('lang') || 'th') as 'th' | 'en';

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
        <div className="glass p-6 max-w-lg mx-auto mb-12 text-center relative z-20">
            <div className="flex justify-center items-center gap-2 mb-3">
                <label htmlFor="province-select" className="label-text">
                    {lang === 'th' ? 'เลือกจังหวัด' : 'Select Location'}
                </label>
                <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                    <span className="text-xs text-green-300 font-medium">Online</span>
                </div>
            </div>

            <div className="relative group">
                <select
                    id="province-select"
                    value={province}
                    onChange={handleProvinceChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-lg focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all cursor-pointer appearance-none"
                    style={{ colorScheme: 'dark' }}
                >
                    <option value="" disabled>{lang === 'th' ? 'กรุณาเลือกจังหวัด...' : 'Choose a Province'}</option>
                    {provinceList.map((p) => {
                        const displayName = lang === 'th' ? (PROVINCE_TH_MAP[p] || p) : p;
                        return (
                            <option key={p} value={p}>
                                {displayName}
                            </option>
                        );
                    })}
                </select>
                <div className="absolute right-5 top-4 pointer-events-none text-white/30 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {loading && <div className="mt-2 text-sm text-white/60 animate-pulse">{lang === 'th' ? 'กำลังโหลด...' : 'Loading...'}</div>}
        </div>
    );
}
