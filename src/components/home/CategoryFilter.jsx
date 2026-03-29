import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_DATA = [
    { name: 'Mariscos', icon: '🦀', style: 'bg-blue-50 text-blue-800 border-blue-200 hover:shadow-blue-500/20 hover:border-blue-400' },
    { name: 'Portuguesa', icon: '🇵🇹', style: 'bg-green-50 text-green-800 border-green-200 hover:shadow-green-500/20 hover:border-green-400' },
    { name: 'Pastelaria', icon: '🥐', style: 'bg-amber-50 text-amber-800 border-amber-200 hover:shadow-amber-500/20 hover:border-amber-400' },
    { name: 'Street Food', icon: '🍔', style: 'bg-red-50 text-red-800 border-red-200 hover:shadow-red-500/20 hover:border-red-400' },
    { name: 'Moçambicana', icon: '🇲🇿', style: 'bg-teal-50 text-teal-800 border-teal-200 hover:shadow-teal-500/20 hover:border-teal-400' },
    { name: 'Grelhados', icon: '🥩', style: 'bg-orange-50 text-orange-800 border-orange-200 hover:shadow-orange-500/20 hover:border-orange-400' },
];

export const CategoryFilter = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 mb-10 w-full mt-4">
            <h2 className="font-display font-black text-2xl md:text-3xl text-text-main italic mb-6">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {CATEGORY_DATA.map(cat => (
                    <Link
                        key={cat.name}
                        to={`/restaurantes?category=${encodeURIComponent(cat.name)}`}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.style}`}
                    >
                        <span className="text-4xl md:text-5xl mb-3 drop-shadow-sm">{cat.icon}</span>
                        <span className="font-black text-sm md:text-base text-center w-full truncate tracking-tight">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};
