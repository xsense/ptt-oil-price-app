
import React from 'react';

interface PriceCardProps {
    product: string;
    price: number;
    location?: string;
    delay?: number;
}

export default function PriceCard({ product, price, location, delay = 0 }: PriceCardProps) {
    return (
        <div
            className="glass p-8 flex flex-col items-center justify-center cursor-pointer animate-fade-in group relative"
            style={{ animationDelay: `${delay}ms` }}
        >

            <h3 className="text-white/70 mb-3 text-center text-sm font-medium tracking-wide mt-2">{product}</h3>

            <div className="text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-2xl">
                {price.toFixed(2)}
            </div>

            <div className="label-text mt-2 text-white/40">THB / Liter</div>
        </div>
    );
}
