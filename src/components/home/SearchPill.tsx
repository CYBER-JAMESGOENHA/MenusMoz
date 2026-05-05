import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export const SearchPill: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-surface/40 backdrop-blur-xl border border-white/10 shadow-premium group transition-all hover:bg-surface/60">
        
        {/* Search Icon & Placeholder */}
        <div className="flex-grow flex items-center gap-4 pl-6 cursor-pointer">
          <Search size={18} className="text-moz-yellow" />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-tighter text-text-main">
              Onde queres ir?
            </span>
            <span className="text-[10px] text-text-dim/60 font-bold uppercase tracking-widest">
              Qualquer lugar · Qualquer Vibe
            </span>
          </div>
        </div>

        {/* Filter Button */}
        <button className="p-3 rounded-full border border-white/5 bg-white/5 text-text-main hover:bg-white/10 transition-all active:scale-90">
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </div>
  );
};
