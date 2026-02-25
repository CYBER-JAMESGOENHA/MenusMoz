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
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const filteredRestaurants = RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div ref={containerRef} className="pt-32 pb-20 min-h-screen bg-bg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 reveal">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-primary font-bold mb-4 hover:gap-3 transition-all">
                            <ChevronLeft size={20} /> {t.detail.back}
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-text-main">
                            Explorar o <span className="text-primary italic">Mapa</span>
                        </h1>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder={t.hero.search_placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-6 pr-12 rounded-2xl glass border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-main"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8 h-[70vh] reveal">
                    {/* Sidebar List */}
                    <div className="lg:col-span-1 bg-surface rounded-[2rem] border border-border-subtle overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border-subtle">
                            <p className="text-xs font-bold uppercase tracking-widest text-text-dim">Resultados ({filteredRestaurants.length})</p>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                            {filteredRestaurants.map(rest => (
                                <button
                                    key={rest.id}
                                    onClick={() => setSelectedRestaurant(rest)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedRestaurant?.id === rest.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-bg/50 border-transparent hover:border-border-subtle'}`}
                                >
                                    <h4 className="font-bold text-text-main mb-1">{rest.name}</h4>
                                    <p className="text-xs text-text-dim uppercase tracking-wider mb-2">{rest.cuisine}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-text-dim/60">
                                        <MapPin size={10} /> {rest.location}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Styled Map Placeholder */}
                    <div className="lg:col-span-3 relative bg-surface rounded-[3rem] border border-border-subtle overflow-hidden shadow-2xl">
                        {/* Mock Map Background (Abstract Grid) */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--border-subtle) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                        <div className="absolute inset-0 flex items-center justify-center p-20">
                            <div className="relative w-full h-full border-2 border-dashed border-border-subtle/50 rounded-[2rem] flex items-center justify-center bg-bg/20 overflow-hidden">
                                <Navigation className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/5 pointer-events-none" size={400} />

                                {/* Pins */}
                                {filteredRestaurants.map((rest, idx) => (
                                    <button
                                        key={rest.id}
                                        onClick={() => setSelectedRestaurant(rest)}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                                        style={{
                                            left: `${(rest.coords.lng + 35) * 5}%`,
                                            top: `${(Math.abs(rest.coords.lat) - 15) * 8}%`
                                        }}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedRestaurant?.id === rest.id ? 'bg-primary text-white scale-125 shadow-xl shadow-primary/40' : 'bg-white text-primary shadow-lg hover:scale-110'}`}>
                                            <MapPin size={20} fill={selectedRestaurant?.id === rest.id ? "white" : "none"} />
                                        </div>
                                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${selectedRestaurant?.id === rest.id ? 'opacity-100 translate-y-0' : 'translate-y-2'}`}>
                                            {rest.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Info Overlay */}
                        {selectedRestaurant && (
                            <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 bg-surface p-6 rounded-[2rem] border border-primary/20 shadow-2xl reveal shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex gap-4 mb-6">
                                    <img src={selectedRestaurant.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main">{selectedRestaurant.name}</h3>
                                        <p className="text-xs text-text-dim uppercase tracking-widest">{selectedRestaurant.cuisine}</p>
                                    </div>
                                    <button onClick={() => setSelectedRestaurant(null)} className="ml-auto text-text-dim hover:text-text-main">
                                        <ChevronLeft className="rotate-90" size={20} />
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <Link to={`/restaurante/${selectedRestaurant.slug}`} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-center hover:bg-black transition-all">
                                        Ver Menu
                                    </Link>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.coords.lat},${selectedRestaurant.coords.lng}`} target="_blank" rel="noreferrer" className="glass px-4 rounded-xl flex items-center justify-center hover:bg-accent/20 transition-all text-text-main">
                                        <Navigation size={18} />
                                    </a>
                                </div>
                            </div>
                        )}

                        {!selectedRestaurant && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-surface/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-border-subtle flex items-center gap-3 text-text-dim">
                                    <Info size={18} /> Clique num pin ou escolha na lista para explorar
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
