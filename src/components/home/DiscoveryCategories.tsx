import React, { useState, useRef } from 'react';
import { 
  Waves, 
  Flame, 
  UtensilsCrossed, 
  Music, 
  Palmtree, 
  Heart, 
  Compass,
  Zap
} from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: Category[] = [
  { id: 'vistas', label: 'Vistas Mar', icon: Waves },
  { id: 'grelhados', label: 'Grelhados', icon: Flame },
  { id: 'musica', label: 'Música ao Vivo', icon: Music },
  { id: 'local', label: 'Sabores Locais', icon: UtensilsCrossed },
  { id: 'tropical', label: 'Tropical', icon: Palmtree },
  { id: 'romantico', label: 'Romântico', icon: Heart },
  { id: 'novo', label: 'Novidades', icon: Zap },
  { id: 'explorar', label: 'Explorar', icon: Compass },
];

export const DiscoveryCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('vistas');
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-20 z-40 bg-bg/95 backdrop-blur-md border-b border-border-subtle transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div 
          ref={scrollerRef}
          className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4 snap-x"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex flex-col items-center gap-2 flex-shrink-0 snap-start group transition-all
                  ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
                `}
              >
                <div className={`
                  transition-transform duration-300 group-hover:scale-110
                  ${isActive ? 'text-moz-yellow' : 'text-text-main'}
                `}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className={`
                  text-[11px] font-bold uppercase tracking-widest whitespace-nowrap
                  ${isActive ? 'text-text-main' : 'text-text-dim'}
                `}>
                  {cat.label}
                </span>
                
                {/* Airbnb-style Active Underline */}
                <div className={`
                  h-[2px] w-full transition-all duration-300
                  ${isActive ? 'bg-moz-yellow scale-x-100' : 'bg-transparent scale-x-0 group-hover:bg-text-dim/20 group-hover:scale-x-50'}
                `} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
