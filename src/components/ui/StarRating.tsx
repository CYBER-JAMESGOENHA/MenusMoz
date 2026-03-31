import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/5 rounded-full border border-accent/10">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star
                        key={i}
                        size={10}
                        className={i <= full ? 'text-accent fill-accent' : i === full + 1 && half ? 'text-accent/60 fill-accent' : 'text-text-dim/20'}
                    />
                ))}
            </div>
            <span className="text-[10px] font-black text-text-main italic leading-none">{rating.toFixed(1)}</span>
        </div>
    );
};
