import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Search, Navigation, Info } from 'lucide-react';
import { gsap } from 'gsap';
import { RESTAURANTS } from './data';
import { translations } from './translations';

export default function Map({ lang }) {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef(null);
    const t = translations[lang];

    useEffect(() => {
         window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const filteredRestaurants = RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div ref={containerRef} className="pt-48 pb-20 min-h-screen bg-bg selection:bg-primary/20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 reveal">
                    <div className="max-w-2xl">
                         <span className="bg-primary/10 text-primary px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
                            Geolocalização
                        </span>
                        <h1 className="text-6xl md:text-9xl mb-8 tracking-tighter text-text-main font-display italic leading-[0.85]">
                            Roteiro de <span className="text-primary italic">Moz</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-text-dim font-medium leading-relaxed italic">
                            Encontre os santuários da gastronomia perto de si através do nosso mapa interactivo.
                        </p>
                    </div>

                    <div className="relative w-full lg:w-[450px] group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <input
                            type="text"
                            placeholder={t.hero?.search_placeholder || 'Onde quer ir?'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="relative w-full h-20 pl-8 pr-16 rounded-3xl bg-surface border-none focus:ring-4 focus:ring-primary/10 text-xl font-display font-medium text-text-main placeholder:text-text-dim/30 shadow-2xl transition-all"
                        />
                        <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-primary" size={28} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-12 h-[80vh] reveal items-stretch">
                    {/* Sidebar List */}
                    <div className="lg:col-span-1 glass bg-surface/50 rounded-[3.5rem] border border-border-subtle overflow-hidden flex flex-col shadow-premium">
                        <div className="p-8 border-b border-border-subtle bg-white/50 dark:bg-black/50 backdrop-blur-md">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-main">Destinos ({filteredRestaurants.length})</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                            {filteredRestaurants.map(rest => (
                                <button
                                    key={rest.id}
                                    onClick={() => setSelectedRestaurant(rest)}
                                    className={`w-full text-left p-6 rounded-[2.5rem] transition-all border duration-500 group ${selectedRestaurant?.id === rest.id ? 'bg-primary/5 border-primary/30 shadow-premium scale-[1.02]' : 'bg-transparent border-transparent hover:border-border-subtle hover:bg-white/30'}`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <h4 className={`font-black uppercase text-xs tracking-widest transition-colors ${selectedRestaurant?.id === rest.id ? 'text-primary' : 'text-text-main group-hover:text-primary'}`}>{rest.name}</h4>
                                        <p className="text-[10px] text-text-dim/60 font-black uppercase tracking-[0.2em]">{rest.cuisine}</p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dim/40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-moz-green animate-pulse" /> {rest.location}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Styled Map Container */}
                    <div className="lg:col-span-3 h-[70vh] lg:h-auto relative bg-surface rounded-[4rem] border border-border-subtle overflow-hidden shadow-premium">
                        {/* Map Grid Pattern */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" 
                             style={{ 
                                backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary-dark) 1px, transparent 0)`, 
                                backgroundSize: '60px 60px' 
                             }} 
                        />
                        
                         {/* Animated Glowing Blobs */}
                        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-moz-green/5 rounded-full blur-[120px]" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full p-20 flex items-center justify-center">
                                {/* Large Navigation Icon as Background */}
                                <Navigation className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/[0.03] pointer-events-none" size={600} strokeWidth={0.5} />

                                {/* Interactive Pins */}
                                {filteredRestaurants.map((rest) => (
                                    <div
                                        key={rest.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 hover:z-50"
                                        style={{
                                            left: `${(rest.coords.lng + 35) * 5}%`,
                                            top: `${(Math.abs(rest.coords.lat) - 15) * 8}%`
                                        }}
                                    >
                                        <button
                                            onClick={() => setSelectedRestaurant(rest)}
                                            className="group relative flex flex-col items-center"
                                        >
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl ${selectedRestaurant?.id === rest.id ? 'bg-primary text-white scale-125 ring-[12px] ring-primary/10' : 'bg-white/90 backdrop-blur-md text-primary hover:scale-110 hover:bg-white border border-border-subtle shadow-black/5'}`}>
                                                <MapPin size={28} fill={selectedRestaurant?.id === rest.id ? "white" : "none"} />
                                            </div>
                                            
                                            {/* Tooltip Label */}
                                            <div className={`mt-4 bg-black/90 backdrop-blur-xl text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 whitespace-nowrap pointer-events-none ${selectedRestaurant?.id === rest.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                                {rest.name}
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected Info Card Overlay */}
                        {selectedRestaurant && (
                            <div className="absolute bottom-10 left-10 right-10 md:right-auto md:w-[450px] overflow-hidden bg-surface/80 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/20 shadow-premium animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                
                                <div className="flex gap-8 mb-10 items-center">
                                    <div className="relative shrink-0">
                                        <img src={selectedRestaurant.image} className="w-24 h-24 rounded-3xl object-cover shadow-2xl" alt="" />
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-moz-yellow rounded-2xl flex items-center justify-center text-black shadow-xl">
                                             <Star size={18} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                         <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                                            Em Destaque
                                        </div>
                                        <h3 className="text-3xl font-display italic text-text-main leading-none mb-2">{selectedRestaurant.name}</h3>
                                        <p className="text-[10px] text-text-dim/60 font-black uppercase tracking-[0.3em] font-mono">{selectedRestaurant.cuisine}</p>
                                    </div>
                                    <button onClick={() => setSelectedRestaurant(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-text-dim hover:text-primary transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to={`/restaurante/${selectedRestaurant.slug}`} className="bg-text-main text-surface py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-primary transition-all shadow-xl flex items-center justify-center gap-2">
                                        Explorar Menu <ChevronRight size={14} />
                                    </Link>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.coords.lat},${selectedRestaurant.coords.lng}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="glass flex items-center justify-center gap-3 rounded-2xl font-black text-xs uppercase tracking-widest text-text-main hover:bg-primary/5 transition-all"
                                    >
                                        <Navigation size={18} /> GPS
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Floating Interaction Helper */}
                        {!selectedRestaurant && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                                <div className="bg-primary/5 backdrop-blur-3xl px-12 py-6 rounded-[2.5rem] border border-primary/20 flex flex-col items-center gap-4 text-center animate-bounce-slow">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <MapPin size={32} />
                                    </div>
                                    <div>
                                         <p className="text-sm font-black uppercase tracking-[0.2em] text-text-main">Inicie a Exploração</p>
                                         <p className="text-xs font-medium text-text-dim mt-1 italic opacity-60">"Toque num santuário no mapa para detalhar."</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
