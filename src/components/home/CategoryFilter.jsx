import React from 'react';

const CATEGORIES = ['Todos', 'Mariscos', 'Grelhados', 'Pastelaria', 'Street Food', 'Pizzas'];

export const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
    return (
        <section className="max-w-7xl mx-auto px-4 mb-2 overflow-x-auto no-scrollbar w-full">
            <div className="flex gap-3 md:gap-4 min-w-0 md:min-w-max pb-1">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 md:px-10 py-2.5 md:py-3 rounded-full font-black text-xs md:text-sm transition-all duration-500 whitespace-nowrap min-h-[40px] ${activeCategory === cat
                            ? 'bg-primary text-white shadow-premium shadow-primary/30 -translate-y-1 scale-105'
                            : 'bg-surface text-text-main border border-border-subtle hover:border-primary/50 hover:shadow-lg'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>
    );
};
