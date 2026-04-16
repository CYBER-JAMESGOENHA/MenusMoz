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


