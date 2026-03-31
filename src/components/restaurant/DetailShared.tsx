import React from 'react';
import { Star } from 'lucide-react';

interface DetailStarRatingProps {
    rating: number;
    reviewCount?: number;
}

/** Variant com tamanho maior para uso na página de detalhe */
export const DetailStarRating: React.FC<DetailStarRatingProps> = ({ rating, reviewCount }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/10">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star
                        key={i}
                        size={16}
                        className={i <= full ? 'text-accent fill-accent' : i === full + 1 && half ? 'text-accent/60 fill-accent' : 'text-text-dim/20'}
                    />
                ))}
            </div>
            <div className="flex items-baseline gap-2 ml-1">
                <span className="text-xl font-black text-text-main italic leading-none">{rating?.toFixed(1)}</span>
                {reviewCount && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim/50 border-l border-border-subtle pl-2">
                        {reviewCount} avaliações
                    </span>
                )}
            </div>
        </div>
    );
};

export const OrnamentalDivider: React.FC = () => (
    <div className="flex items-center justify-center gap-4 my-10 text-primary/30 select-none px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-primary/40" />
        <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0 group-hover:rotate-45 transition-transform duration-1000">
                <path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z" fill="currentColor" />
            </svg>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0 group-hover:rotate-45 transition-transform duration-1000">
                <path d="M12 2 L13.8 10.2 L22 12 L13.8 13.8 L12 22 L10.2 13.8 L2 12 L10.2 10.2 Z" fill="currentColor" />
            </svg>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/20 to-primary/40" />
    </div>
);
