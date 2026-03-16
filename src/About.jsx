import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Users, Target, Rocket } from 'lucide-react';

export default function About() {
    const containerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="pt-48 pb-40 px-4 selection:bg-primary/20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-32 reveal">
                    <span className="bg-primary/10 text-primary px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
                        O Nosso Manifesto
                    </span>
                    <h1 className="text-6xl md:text-9xl mb-10 tracking-tighter text-text-main font-display italic leading-[0.85]">
                        Digitalizando o sabor de <br /> <span className="text-primary italic">Moçambique</span>
                    </h1>
                    <p className="text-xl md:text-3xl text-text-dim max-w-4xl mx-auto font-medium leading-relaxed italic">
                        "Locais de Moz nasceu da paixão pela gastronomia e da vontade de colocar a alma culinária do país na palma da mão de todos."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-24 mb-40 reveal items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-2xl group-hover:bg-primary/10 transition-all duration-1000" />
                        <div className="relative bg-surface p-12 md:p-16 rounded-[3.5rem] border border-border-subtle shadow-premium">
                             <h2 className="text-4xl md:text-5xl mb-8 text-text-main font-display tracking-tight">A Nossa Missão</h2>
                             <p className="text-text-dim text-xl leading-relaxed font-medium">
                                Democratizamos o acesso à informação gastronómica de qualidade em Moçambique, capacitando restauradores locais com ferramentas digitais de elite e guiando clientes a descobertas autênticas.
                             </p>
                             <div className="mt-12 h-1 w-24 bg-primary rounded-full" />
                        </div>
                    </div>
                    
                    <div className="space-y-16">
                        <div>
                            <h2 className="text-3xl mb-6 text-text-main font-black uppercase tracking-widest text-xs text-primary">O Futuro</h2>
                            <p className="text-text-dim text-2xl font-display leading-tight italic">
                                Queremos ser a maior rede de curadoria gastronómica de África Austral, celebrando a diversidade da nossa Pérola do Índico.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                             <div className="p-8 bg-surface rounded-3xl border border-border-subtle shadow-sm">
                                <span className="block text-4xl font-display text-primary mb-2">500+</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Restaurantes</span>
                             </div>
                             <div className="p-8 bg-surface rounded-3xl border border-border-subtle shadow-sm">
                                <span className="block text-4xl font-display text-moz-green mb-2">10k+</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Foodies Ativos</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10 reveal">
                    {[
                        { icon: Users, title: "Equipa Visionária", desc: "Criativos e engenheiros moçambicanos unidos pelo paladar.", color: "primary" },
                        { icon: Target, title: "Curadoria de Elite", desc: "Apenas o melhor que Moçambique tem para oferecer.", color: "accent" },
                        { icon: Rocket, title: "Vanguarda Tecnológica", desc: "UX premium desenhado para a velocidade e beleza.", color: "moz-green" }
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-surface p-12 rounded-[3.5rem] border border-border-subtle hover:border-primary/50 transition-all hover:shadow-premium overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                            <div className={`w-20 h-20 bg-primary/5 flex items-center justify-center rounded-3xl text-primary mb-8 transition-transform group-hover:rotate-12`}>
                                <item.icon size={40} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-text-main tracking-tight uppercase text-sm tracking-widest">{item.title}</h3>
                            <p className="text-text-dim leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
