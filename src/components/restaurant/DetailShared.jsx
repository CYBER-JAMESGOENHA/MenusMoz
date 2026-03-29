import React from 'react';
import { Star } from 'lucide-react';

/** Variant com tamanho maior para uso na página de detalhe */
export const DetailStarRating = ({ rating, reviewCount }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1.5 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={18}
                    className={i <= full ? 'text-accent' : i === full + 1 && half ? 'text-accent opacity-60' : 'text-text-dim/30'}
                    fill={i <= full ? 'currentColor' : i === full + 1 && half ? 'currentColor' : 'none'}
                />
            ))}
            <span className="text-sm font-bold text-text-dim ml-1">{rating?.toFixed(1)}</span>
            {reviewCount && <span className="text-sm text-text-dim/60">({reviewCount} avaliações)</span>}
        </div>
    );
};

export const OrnamentalDivider = () => (
    <div className="flex items-center justify-center gap-3 my-8 text-primary/40 select-none">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
        <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
            <path d="M10 2 L11.5 8.5 L18 10 L11.5 11.5 L10 18 L8.5 11.5 L2 10 L8.5 8.5 Z" fill="currentColor" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
            <circle cx="6" cy="6" r="3" fill="currentColor" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
            <path d="M10 2 L11.5 8.5 L18 10 L11.5 11.5 L10 18 L8.5 11.5 L2 10 L8.5 8.5 Z" fill="currentColor" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
    </div>
);
