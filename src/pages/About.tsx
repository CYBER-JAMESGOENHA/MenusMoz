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
        <div ref={containerRef} className="pt-32 pb-16 bg-bg overflow-hidden selection:bg-primary/30">
            {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[50vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-20 left-1/2 -translate-x-1/2 text-[12rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-6">
                    Manifesto
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16 reveal">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-8 bg-primary/30" />
                        <span className="bg-primary text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-primary-glow">
                             {t.manifesto}
                        </span>
                        <div className="h-px w-8 bg-primary/30" />
                    </div>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl mb-8 tracking-tighter text-text-main font-display italic leading-[0.85] uppercase font-black">
                        {t.title} <br /> <span className="text-primary italic">{selectedLang === 'pt' ? 'Moçambique' : 'Mozambique'}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-text-dim max-w-3xl mx-auto font-black leading-[1.1] italic uppercase tracking-tighter opacity-80">
                        "{t.subtitle}"
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mb-16 reveal items-center">
                    <div className="relative group">
                        <div className="absolute -inset-6 bg-primary/5 rounded-2xl blur-3xl group-hover:bg-primary/10 transition-all duration-1000 opacity-60" />
                        <div className="relative bg-surface p-8 md:p-10 rounded-2xl border border-border-subtle shadow-premium overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                             <h2 className="text-3xl md:text-4xl mb-6 text-text-main font-display font-black tracking-tighter uppercase italic leading-none">{t.mission}</h2>
                             <p className="text-text-dim text-sm md:text-base leading-relaxed font-bold italic uppercase tracking-tight opacity-70">
                                {t.mission_desc}
                             </p>
                             <div className="mt-8 h-1.5 w-20 bg-primary rounded-full shadow-primary-glow" />
                        </div>
                    </div>
                    
                    <div className="space-y-10 lg:pl-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Award className="text-primary" size={20} />
                                <h2 className="font-black uppercase tracking-[0.3em] text-[10px] text-primary">{t.future}</h2>
                            </div>
                            <p className="text-text-dim text-2xl md:text-3xl font-display font-black leading-[0.95] italic uppercase tracking-tighter">
                                {t.future_desc}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                             <div className="p-6 bg-surface rounded-2xl border border-border-subtle shadow-premium hover:border-primary/30 transition-all group overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative block text-3xl md:text-4xl font-display font-black text-primary mb-2 tracking-tighter">500+</span>
                                <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 italic">{selectedLang === 'pt' ? 'Restaurantes' : 'Restaurants'}</span>
                             </div>
                             <div className="p-6 bg-surface rounded-2xl border border-border-subtle shadow-premium hover:border-moz-green/30 transition-all group overflow-hidden">
                                <div className="absolute inset-0 bg-moz-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative block text-3xl md:text-4xl font-display font-black text-moz-green mb-2 tracking-tighter">10k+</span>
                                <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 italic">{selectedLang === 'pt' ? 'Exploradores' : 'Explorers'}</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 reveal">
                    {[
                        { icon: Users, title: selectedLang === 'pt' ? "Equipa Visionária" : "Visionary Team", desc: selectedLang === 'pt' ? "Mentes unidas pela vontade de elevar o padrão gastronómico nacional." : "Minds united by the desire to elevate the national gastronomic standard.", color: "primary" },
                        { icon: Target, title: selectedLang === 'pt' ? "Curadoria de Elite" : "Elite Curation", desc: selectedLang === 'pt' ? "Processo rigoroso para garantir apenas boas experiências." : "Rigorous process to ensure only great experiences.", color: "accent" },
                        { icon: Rocket, title: selectedLang === 'pt' ? "Foco no Utilizador" : "User Focused", desc: selectedLang === 'pt' ? "Experiência digital impecável, desenhada para emocionar." : "Impeccable digital experience, designed to thrive emociones.", color: "moz-green" }
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-surface p-8 md:p-10 rounded-2xl border border-border-subtle hover:border-primary/50 transition-all hover:shadow-premium overflow-hidden h-full flex flex-col">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-xl text-primary mb-6 transition-all group-hover:scale-110 group-hover:rotate-12 shadow-sm">
                                <item.icon size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black mb-4 text-text-main uppercase text-xs tracking-[0.2em] italic leading-tight">{item.title}</h3>
                            <p className="text-text-dim leading-relaxed font-bold italic opacity-70 uppercase text-xs tracking-tight">{item.desc}</p>
                            
                            <div className="mt-auto pt-6">
                                <div className="h-0.5 w-8 bg-border-subtle group-hover:bg-primary group-hover:w-full transition-all duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
