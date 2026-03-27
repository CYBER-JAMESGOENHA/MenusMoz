import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';

export const DishCard = ({ dish }) => {
    return (
        <Link to={`/restaurante/${dish.slug}`} className="group relative bg-surface border border-border-subtle rounded-[1.5rem] p-5 flex flex-col h-[320px] w-[280px] hover:border-primary hover:shadow-premium transition-all duration-500 overflow-hidden">
            
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src={dish.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <span className="bg-text-main text-surface px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        {dish.dishPrice}
                    </span>
                    <Heart size={20} className="text-black/20 group-hover:text-primary transition-colors" />
                </div>
                
                <div className="mb-auto">
                    <h3 className="text-3xl font-display font-black leading-tight text-text-main group-hover:text-primary transition-colors mb-4 italic line-clamp-3">
                        {dish.dishName}
                    </h3>
                    <p className="text-sm text-text-dim font-medium leading-relaxed line-clamp-3">
                        {dish.dishDesc}
                    </p>
                </div>
                
                <div className="mt-6 border-t border-black/10 pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface shadow-md shrink-0">
                        <img src={dish.image} alt={dish.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[8px] uppercase tracking-widest font-black text-primary mb-0.5">Disponível no</p>
                        <p className="text-sm font-bold text-text-main truncate group-hover:text-primary transition-colors">{dish.name}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
};
