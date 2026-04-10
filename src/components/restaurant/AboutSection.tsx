import React from 'react';
import { 
    Clock, 
    MapPin, 
    Navigation, 
    Phone, 
    CreditCard, 
    Car, 
    Accessibility, 
    Shirt, 
    CalendarCheck,
    Utensils,
    Quote,
    Trophy,
    Info,
    ArrowRight
} from 'lucide-react';
import { ExperienceSection } from './ExperienceSection';
import { VisitSection } from './VisitSection';
import { OrnamentalDivider } from './DetailShared';

interface AboutSectionProps {
    restaurant: any;
    lang: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    const t = isEn ? {
        intro: "Discover the Space",
        introDesc: "Travel through our history, atmosphere and everything we have prepared for you.",
        explore: "Explore Sections",
        history: "History",
        gallery: "Gallery",
        map: "Map",
        amenities: "Amenities",
        contact: "Contact"
    } : {
        intro: "Conheça o Espaço",
        introDesc: "Viaje pela nossa história, ambiente e tudo o que preparámos para si.",
        explore: "Explorar Secções",
        history: "História",
        gallery: "Galeria",
        map: "Mapa",
        amenities: "Facilidades",
        contact: "Contacto"
    };

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 140; // sticky nav height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- INTRO CARD --- */}
            <section className="bg-surface rounded-3xl md:rounded-[3rem] p-8 md:p-12 border border-border-subtle relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-primary/10 transition-colors duration-700" />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-6">
                        <Info size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.intro}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-text-main italic uppercase tracking-tighter leading-[0.9] mb-6">
                        {restaurant.name}: <span className="text-primary">Muito mais</span> que um restaurante.
                    </h2>
                    <p className="text-text-dim text-lg md:text-xl font-medium leading-relaxed mb-8">
                        {t.introDesc}
                    </p>

                    {/* Social Proof Chips */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {[
                            { label: isEn ? "Family Friendly" : "Bom para famílias", dot: "bg-blue-400" },
                            { label: isEn ? "Sea View" : "Vista mar", dot: "bg-cyan-400" },
                            { label: isEn ? "Live Music" : "Música ao vivo", dot: "bg-pink-400" },
                            { label: isEn ? "Free Wi-Fi" : "Wi-Fi Grátis", dot: "bg-green-400" }
                        ].map(chip => (
                            <div key={chip.label} className="flex items-center gap-2 bg-bg/50 border border-border-subtle px-3 py-1.5 rounded-full">
                                <div className={`w-1.5 h-1.5 rounded-full ${chip.dot}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-main">{chip.label}</span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Sub-Nav / Anchor Links */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: 'story', label: t.history },
                            { id: 'gallery', label: t.gallery },
                            { id: 'location', label: t.map },
                            { id: 'amenities', label: t.amenities },
                            { id: 'contact', label: t.contact }
                        ].map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollTo(link.id)}
                                className="px-4 py-2 bg-bg border border-border-subtle hover:border-primary/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary transition-all flex items-center gap-2"
                            >
                                {link.label}
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STORY / EXPERIENCE CONTENT --- */}
            <div id="story">
                <ExperienceSection restaurant={restaurant} lang={lang} />
            </div>

            <OrnamentalDivider />

            {/* --- VISIT / INFO CONTENT --- */}
            <div id="location">
                <VisitSection restaurant={restaurant} lang={lang} />
            </div>
            
            {/* Added IDs to sections inside VisitSection/ExperienceSection might be needed if I want precise anchor scrolling */}
            {/* But since I'm wrapping them, I can add extra IDs here if needed or modify the components */}
        </div>
    );
};
