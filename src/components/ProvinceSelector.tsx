'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PROVINCES = [
    "Bangkok", "Krabi", "Kanchanaburi", "Kalasin", "Kamphaeng Phet", "Khon Kaen",
    "Chanthaburi", "Chachoengsao", "Chon Buri", "Chainat", "Chaiyaphum", "Chumphon",
    "Chiang Rai", "Chiang Mai", "Trang", "Trat", "Tak", "Nakhon Nayok",
    "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Si Thammarat",
    "Nakhon Sawan", "Nonthaburi", "Narathiwat", "Nan", "Bueng Kan", "Buriram",
    "Pathum Thani", "Prachuap Khiri Khan", "Prachinburi", "Pattani", "Phra Nakhon Si Ayutthaya",
    "Phayeo", "Phang Nga", "Phatthalung", "Phichit", "Phitsanulok", "Phetchaburi",
    "Phetchabun", "Phrae", "Phuket", "Maha Sarakham", "Mukdahan", "Mae Hong Son",
    "Yasothon", "Yala", "Roi Et", "Ranong", "Rayong", "Ratchaburi", "Lop Buri",
    "Lampang", "Lamphun", "Loei", "Sisaket", "Sakon Nakhon", "Songkhla", "Satun",
    "Samut Prakan", "Samut Songkhram", "Samut Sakhon", "Sa Kaeo", "Saraburi",
    "Sing Buri", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Nong Khai",
    "Nong Bua Lam Phu", "Ang Thong", "Amnat Charoen", "Udon Thani", "Uttaradit",
    "Uthai Thani", "Ubon Ratchathani"
].sort();

export default function ProvinceSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialProvince = searchParams.get('province') || '';
    const [province, setProvince] = useState(initialProvince);
    const [loading, setLoading] = useState(false);

    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value;
        setProvince(newProvince);
        if (newProvince) {
            setLoading(true);
            router.push(`/provincial?province=${newProvince}`);
            setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <div className="glass p-6 max-w-lg mx-auto mb-12 text-center">
            <label htmlFor="province-select" className="label-text block mb-3">
                Select Location
            </label>
            <div className="relative group">
                <select
                    id="province-select"
                    value={province}
                    onChange={handleProvinceChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-lg focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all cursor-pointer appearance-none"
                    style={{ colorScheme: 'dark' }}
                >
                    <option value="" disabled>Choose a Province</option>
                    {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
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
