import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';

interface EmptyFavoritesProps {
    lang: string;
}

export const EmptyFavorites: React.FC<EmptyFavoritesProps> = ({ lang }) => {
    const t = lang === 'pt' ? 'Não tens favoritos ainda.' : 'No favorites yet.';
    const sub = lang === 'pt' ? 'Explora os melhores sabores de Moçambique e guarda os teus preferidos aqui.' : 'Explore the best flavors of Mozambique and save your favorites here.';
    const btn = lang === 'pt' ? 'Explorar Agora' : 'Explore Now';
    return (
        <div className="col-span-full py-32 text-center reveal">
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-premium">
                <Heart size={64} />
            </div>
            <h2 className="text-4xl md:text-5xl font-display mb-6 tracking-tighter text-text-main italic uppercase font-black">{t}</h2>
            <p className="text-text-dim text-xl max-w-md mx-auto mb-12 font-medium leading-relaxed italic">"{sub}"</p>
            <Link to="/" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full font-black text-lg shadow-premium hover:shadow-primary-glow hover:scale-105 transition-all">
                {btn} <ChevronRight size={24} />
            </Link>
        </div>
    );
};
