import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, Globe, ShieldCheck, Mail, Rocket } from 'lucide-react';

export default function ForOwners() {
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
        <div ref={containerRef} className="pt-48 pb-40 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-32 items-center mb-40">
                    <div className="reveal">
                        <span className="bg-moz-yellow/10 text-moz-yellow px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
                            Business Solutions
                        </span>
                        <h1 className="text-6xl md:text-9xl mb-10 tracking-tighter text-text-main font-display italic leading-[0.85]">
                            Evolua o seu <br /><span className="text-primary italic">Negócio</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-dim mb-16 font-medium leading-relaxed italic">
                            "Junte-se à plataforma de elite para a gastronomia moçambicana e transforme cliques em clientes fiéis."
                        </p>

                        <div className="space-y-12">
                            {[
                                { icon: TrendingUp, title: "Visibilidade Orgânica", desc: "Apareça com destaque nos resultados de busca por culinária.", color: "primary" },
                                { icon: Globe, title: "Identidade Digital", desc: "Um showcase interativo e elegante para o seu menu.", color: "accent" },
                                { icon: ShieldCheck, title: "Infraestrutura Premium", desc: "Tecnologia robusta desenhada para performance real.", color: "moz-green" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className={`w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-main uppercase text-xs tracking-[0.2em] mb-2">{item.title}</h4>
                                        <p className="text-text-dim text-lg font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative reveal">
                         {/* Decorative glowing blobs */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-moz-green/10 rounded-full blur-[100px]" />

                        <div className="relative bg-surface/80 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-premium">
                            <h3 className="text-4xl md:text-5xl mb-12 text-text-main font-display tracking-tight">Candidatar-se à Rede</h3>
                            <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2 text-primary">Nome do Estabelecimento</label>
                                    <input type="text" className="w-full h-16 glass border-border-subtle rounded-3xl px-8 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium placeholder:text-text-dim/30" placeholder="Ex: Baía Lounge" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2 text-primary">Email Corporativo</label>
                                    <input type="email" className="w-full h-16 glass border-border-subtle rounded-3xl px-8 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium placeholder:text-text-dim/30" placeholder="gestao@restaurante.com" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2 text-primary">WhatsApp de Contacto</label>
                                    <input type="tel" className="w-full h-16 glass border-border-subtle rounded-3xl px-8 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium placeholder:text-text-dim/30" placeholder="+258 8..." />
                                </div>
                                <button className="w-full bg-text-main text-surface py-6 rounded-3xl font-black text-xl hover:bg-primary hover:text-white hover:shadow-primary-glow transition-all flex items-center justify-center gap-3 mt-10">
                                    Enviar Solicitação <Rocket size={24} />
                                </button>
                                <p className="text-center text-[10px] font-black uppercase tracking-widest text-text-dim mt-6">
                                    A nossa equipa entrará em contacto em breve.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
