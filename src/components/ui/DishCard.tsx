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
            className="group relative bg-surface border border-border-subtle rounded-[2rem] p-7 flex flex-col h-[380px] w-[300px] hover:border-primary hover:shadow-premium transition-all duration-700 overflow-hidden shrink-0"
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
                <div className="flex justify-between items-start mb-8">
                    <span className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-primary-glow group-hover:scale-105 transition-transform">
                        {dish.dishPrice}
                    </span>
                    <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-dim/30 hover:text-primary hover:bg-primary/10 transition-all duration-300">
                        <Heart size={20} />
                    </button>
                </div>
                
                <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-display font-black leading-[0.95] text-text-main group-hover:text-primary transition-colors duration-500 mb-6 italic line-clamp-3 uppercase tracking-tighter">
                        {dish.dishName}
                    </h3>
                    <p className="text-sm text-text-dim/80 font-medium leading-relaxed line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "{dish.dishDesc}"
                    </p>
                </div>
                
                <div className="mt-8 border-t border-border-subtle pt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-surface shadow-premium shrink-0 group-hover:scale-110 transition-transform duration-700 bg-gray-100">
                        <img 
                            src={dish.image} 
                            alt={dish.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-primary mb-1 opacity-70">Sabor do</p>
                        <p className="text-sm font-black text-text-main truncate group-hover:text-primary transition-colors tracking-tight italic uppercase">{dish.name}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl border border-border-subtle flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:shadow-primary-glow transition-all duration-500 group-hover:rotate-12">
                        <ArrowUpRight size={22} />
                    </div>
                </div>
            </div>
        </Link>
    );
};
