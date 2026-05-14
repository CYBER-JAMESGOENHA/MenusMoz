import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';

interface Dish {
    slug: string;
    image: string;
    dishName: string;
    dishPrice: string;
    dishDesc: string;
    name: string; // Restaurant name
}

interface DishCardProps {
    dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
    return (
        <Link 
            to={`/restaurante/${dish.slug}`} 
            className="group relative bg-surface border border-border-subtle rounded-[1.5rem] p-5 flex flex-col h-[340px] w-[260px] hover:border-primary hover:shadow-premium transition-all duration-700 overflow-hidden shrink-0"
        >
            {/* Artistic Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <img 
                    src={dish.image} 
                    alt="" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover opacity-[0.04] group-hover:opacity-[0.1] transition-all duration-1000 grayscale scale-110 group-hover:scale-125 rotate-3 group-hover:rotate-6" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/90 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[9px] font-bold tracking-wider shadow-primary-glow group-hover:scale-105 transition-transform">
                        {dish.dishPrice}
                    </span>
                    <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-text-dim/30 hover:text-primary hover:bg-primary/10 transition-all duration-300">
                        <Heart size={18} />
                    </button>
                </div>
                
                <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-display font-extrabold leading-tight text-text-main group-hover:text-primary transition-colors duration-500 mb-4 tracking-tight line-clamp-3">
                        {dish.dishName}
                    </h3>
                    <p className="text-xs text-text-dim/70 font-medium leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {dish.dishDesc}
                    </p>
                </div>
                
                <div className="mt-6 border-t border-border-subtle pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-border-subtle shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-700 bg-gray-100">
                        <img 
                            src={dish.image} 
                            alt={dish.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[8px] uppercase tracking-widest font-extrabold text-primary mb-0.5 opacity-60">Sabor do</p>
                        <p className="text-xs font-bold text-text-main truncate group-hover:text-primary transition-colors tracking-tight">{dish.name}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl border border-border-subtle flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:shadow-primary-glow transition-all duration-500 group-hover:rotate-12">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
};
