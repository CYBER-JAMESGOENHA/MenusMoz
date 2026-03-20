import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Wine, X, Check, MapPin, Clock, Search } from 'lucide-react';

const TopBarFilters = ({ lang = 'en' }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filters, setFilters] = useState({
        openNow: false,
        priceRange: [200, 1500],
        type: 'Everything',
        vibes: [],
        highlight: ''
    });

    const toggleVibe = (vibe) => {
        setFilters(prev => ({
            ...prev,
            vibes: prev.vibes.includes(vibe) 
                ? prev.vibes.filter(v => v !== vibe)
                : [...prev.vibes, vibe]
        }));
    };

    const types = ['Everything', 'Restaurants', 'Fast Food', 'Ice Cream', 'Cafés'];
    const vibesList = ['Business Meeting', 'Family Dinner', 'Live Music', 'Romantic', 'Hidden Gem'];
    const highlightsList = ['Best Wine Selection', 'Great Portions', 'Quick Service', 'Award Winning'];

    // Mock histogram data for price slider
    const priceHistogram = [10, 25, 40, 80, 100, 60, 45, 30, 15, 5];

    return (
        <div className="w-full bg-surface border-b border-black/10 text-text-main relative z-50">
            {/* Top Command Bar */}
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                
                {/* Search / Title Area */}
                <div className="flex-shrink-0 flex items-center gap-3 w-full md:w-auto">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
                        <SlidersHorizontal size={18} />
                    </div>
                    <div>
                        <h1 className="font-display font-black text-xl italic leading-none tracking-tight">EXPLORE</h1>
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-50 font-bold">142 Results Found</span>
                    </div>
                </div>

                {/* Primary Filter Pills (Scrollable on mobile) */}
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 md:gap-4 w-full pb-2 md:pb-0">
                    
                    {/* TYPE FILTER (Pills) */}
                    <div className="flex items-center gap-1 bg-black/5 p-1 rounded-full border border-black/5">
                        {types.map(t => (
                            <button 
                                key={t}
                                onClick={() => setFilters(prev => ({ ...prev, type: t }))}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${filters.type === t ? 'bg-black text-white shadow-md' : 'text-black/60 hover:text-black hover:bg-black/5'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-8 bg-black/10 mx-2 hidden md:block"></div>

                    {/* VIBE DROPDOWN TRIGER */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'vibe' ? null : 'vibe')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${activeDropdown === 'vibe' || filters.vibes.length > 0 ? 'border-primary text-primary bg-primary/5' : 'border-black/10 hover:border-black/30 bg-white'}`}
                        >
                            Vibe Check 
                            {filters.vibes.length > 0 && <span className="bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{filters.vibes.length}</span>}
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'vibe' ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Vibe Dropdown Panel */}
                        {activeDropdown === 'vibe' && (
                            <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-black/10 shadow-2xl p-4 rounded-2xl z-50">
                                <h3 className="text-[10px] uppercase tracking-widest text-black/40 font-black mb-3">Atmosphere</h3>
                                <div className="flex flex-wrap gap-2">
                                    {vibesList.map(v => (
                                        <button 
                                            key={v}
                                            onClick={() => toggleVibe(v)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filters.vibes.includes(v) ? 'border-black bg-black text-white' : 'border-black/10 hover:border-black/30 text-black/70'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* REVIEWS & HIGHLIGHTS TRIGER */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'highlight' ? null : 'highlight')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${activeDropdown === 'highlight' || filters.highlight ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-black/10 hover:border-black/30 bg-white'}`}
                        >
                            <Wine size={14} /> Highlights
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'highlight' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'highlight' && (
                            <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-black/10 shadow-2xl p-2 rounded-2xl z-50">
                                {highlightsList.map(h => (
                                    <button 
                                        key={h}
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, highlight: prev.highlight === h ? '' : h }));
                                            setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold hover:bg-black/5 flex items-center justify-between group"
                                    >
                                        <span className={filters.highlight === h ? 'text-orange-600' : 'text-black/70 group-hover:text-black'}>{h}</span>
                                        {filters.highlight === h && <Check size={14} className="text-orange-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PRICE DROPDOWN */}
                    <div className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${activeDropdown === 'price' ? 'border-black text-black bg-black/5' : 'border-black/10 hover:border-black/30 bg-white'}`}
                        >
                            Price: {filters.priceRange[0]} - {filters.priceRange[1]} MZN
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Price Visual Slider Panel */}
                        {activeDropdown === 'price' && (
                            <div className="absolute top-full mt-2 left-0 w-72 bg-white border border-black/10 shadow-2xl p-5 rounded-2xl z-50">
                                <div className="flex justify-between items-end mb-4 h-16 gap-1">
                                    {priceHistogram.map((height, i) => (
                                        <div key={i} className="flex-1 bg-black/10 rounded-t-sm" style={{ height: `${height}%` }}></div>
                                    ))}
                                </div>
                                <div className="relative pt-4">
                                    {/* Mocking a dual slider for visual representation */}
                                    <div className="h-1 w-full bg-black/10 rounded-full">
                                        <div className="absolute h-1 bg-black left-1/4 right-1/4 rounded-full"></div>
                                    </div>
                                    <div className="absolute top-2.5 left-1/4 w-4 h-4 bg-white border-2 border-black rounded-full shadow-sm cursor-grab"></div>
                                    <div className="absolute top-2.5 right-1/4 w-4 h-4 bg-white border-2 border-black rounded-full shadow-sm cursor-grab"></div>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <div className="bg-black/5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">200</div>
                                    <div className="bg-black/5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">1500+</div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Edge: Open Now Toggle */}
                <div className="flex-shrink-0 flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-black/10">
                    <button 
                        onClick={() => setFilters(prev => ({ ...prev, openNow: !prev.openNow }))}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border  ${filters.openNow ? 'border-green-500 bg-green-50 text-green-700' : 'border-black/10 bg-white text-black/60 hover:border-black/30 hover:text-black'}`}
                    >
                        <Clock size={14} className={filters.openNow ? 'text-green-500' : ''} />
                        Open Now
                        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${filters.openNow ? 'bg-green-500' : 'bg-black/20'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${filters.openNow ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Active Filters Summary Bar (Only shows if filters are applied) */}
            {(filters.vibes.length > 0 || filters.highlight || filters.type !== 'Everything') && (
                <div className="bg-black/5 px-4 md:px-8 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
                    <span className="text-[9px] uppercase tracking-widest font-black opacity-50">Active:</span>
                    
                    {filters.type !== 'Everything' && (
                        <span className="flex items-center gap-1.5 bg-white border border-black/10 px-3 py-1 rounded-full text-[10px] font-bold">
                            Type: {filters.type}
                            <button onClick={() => setFilters(prev => ({ ...prev, type: 'Everything' }))}><X size={10} className="opacity-50 hover:opacity-100" /></button>
                        </span>
                    )}

                    {filters.vibes.map(v => (
                        <span key={v} className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold">
                            {v}
                            <button onClick={() => toggleVibe(v)}><X size={10} className="hover:text-black" /></button>
                        </span>
                    ))}

                    {filters.highlight && (
                        <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-bold">
                            {filters.highlight}
                            <button onClick={() => setFilters(prev => ({ ...prev, highlight: '' }))}><X size={10} className="hover:text-black" /></button>
                        </span>
                    )}

                    <button 
                        onClick={() => setFilters({ openNow: false, priceRange: [200, 1500], type: 'Everything', vibes: [], highlight: '' })}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline ml-2"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopBarFilters;
