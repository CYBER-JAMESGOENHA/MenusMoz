import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Users, Target, Rocket, Heart, Globe, Award } from 'lucide-react';
import { translations } from '../translations';

interface AboutProps {
    lang?: string;
}

export default function About({ lang = 'pt' }: AboutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';
    const t = translations[selectedLang]?.about || translations.pt.about;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 80,
                opacity: 0,
                duration: 1.5,
                stagger: 0.3,
                ease: "power4.out"
            });
            gsap.to(".float", {
                y: 20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="pt-56 pb-48 bg-bg overflow-hidden selection:bg-primary/30">
            {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-20 left-1/2 -translate-x-1/2 text-[25rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-6">
                    Manifesto
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-40 reveal">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <div className="h-px w-10 bg-primary/30" />
                        <span className="bg-primary text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-primary-glow">
                             {t.manifesto}
                        </span>
                        <div className="h-px w-10 bg-primary/30" />
                    </div>
                    <h1 className="text-[12vw] md:text-[9rem] mb-12 tracking-tighter text-text-main font-display italic leading-[0.8] uppercase font-black">
                        {t.title} <br /> <span className="text-primary italic">{selectedLang === 'pt' ? 'Moçambique' : 'Mozambique'}</span>
                    </h1>
                    <p className="text-xl md:text-4xl text-text-dim max-w-5xl mx-auto font-black leading-[1.1] italic uppercase tracking-tighter opacity-80">
                        "{t.subtitle}"
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-24 mb-48 reveal items-center">
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-primary/5 rounded-[5rem] blur-3xl group-hover:bg-primary/10 transition-all duration-1000 opacity-60" />
                        <div className="relative bg-surface p-12 md:p-24 rounded-[4rem] border border-border-subtle shadow-premium overflow-hidden group">
                             <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
                             <h2 className="text-5xl md:text-7xl mb-10 text-text-main font-display font-black tracking-tighter uppercase italic leading-none">{t.mission}</h2>
                             <p className="text-text-dim text-xl md:text-2xl leading-relaxed font-bold italic uppercase tracking-tight opacity-70">
                                {t.mission_desc}
                             </p>
                             <div className="mt-16 h-2 w-32 bg-primary rounded-full shadow-primary-glow" />
                        </div>
                    </div>
                    
                    <div className="space-y-20 lg:pl-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Award className="text-primary" size={24} />
                                <h2 className="font-black uppercase tracking-[0.4em] text-[10px] text-primary">{t.future}</h2>
                            </div>
                            <p className="text-text-dim text-3xl md:text-5xl font-display font-black leading-[0.95] italic uppercase tracking-tighter">
                                {t.future_desc}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                             <div className="p-10 bg-surface rounded-[2.5rem] border border-border-subtle shadow-premium hover:border-primary/30 transition-all group overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative block text-5xl md:text-7xl font-display font-black text-primary mb-3 tracking-tighter">500+</span>
                                <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 italic">{selectedLang === 'pt' ? 'Restaurantes' : 'Restaurants'}</span>
                             </div>
                             <div className="p-10 bg-surface rounded-[2.5rem] border border-border-subtle shadow-premium hover:border-moz-green/30 transition-all group overflow-hidden">
                                <div className="absolute inset-0 bg-moz-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative block text-5xl md:text-7xl font-display font-black text-moz-green mb-3 tracking-tighter">10k+</span>
                                <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 italic">{selectedLang === 'pt' ? 'Exploradores' : 'Explorers'}</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12 reveal">
                    {[
                        { icon: Users, title: selectedLang === 'pt' ? "Equipa Visionária" : "Visionary Team", desc: selectedLang === 'pt' ? "Mentes unidas pela vontade de elevar o padrão gastronómico nacional." : "Minds united by the desire to elevate the national gastronomic standard.", color: "primary" },
                        { icon: Target, title: selectedLang === 'pt' ? "Curadoria de Elite" : "Elite Curation", desc: selectedLang === 'pt' ? "Processo rigoroso para garantir apenas boas experiências." : "Rigorous process to ensure only great experiences.", color: "accent" },
                        { icon: Rocket, title: selectedLang === 'pt' ? "Foco no Utilizador" : "User Focused", desc: selectedLang === 'pt' ? "Experiência digital impecável, desenhada para emocionar." : "Impeccable digital experience, designed to thrive emociones.", color: "moz-green" }
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-surface p-12 md:p-16 rounded-[4rem] border border-border-subtle hover:border-primary/50 transition-all hover:shadow-premium overflow-hidden h-full flex flex-col">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="w-20 h-20 bg-primary/10 flex items-center justify-center rounded-[2rem] text-primary mb-10 transition-all group-hover:scale-110 group-hover:rotate-12 shadow-sm">
                                <item.icon size={36} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black mb-6 text-text-main uppercase text-sm tracking-[0.3em] italic leading-tight">{item.title}</h3>
                            <p className="text-text-dim leading-relaxed font-bold italic opacity-70 uppercase text-xs tracking-tight">{item.desc}</p>
                            
                            <div className="mt-auto pt-10">
                                <div className="h-1 w-12 bg-border-subtle group-hover:bg-primary group-hover:w-full transition-all duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
