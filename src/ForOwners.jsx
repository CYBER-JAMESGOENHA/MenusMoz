import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TrendingUp, Globe, ShieldCheck, Mail } from 'lucide-react';

export default function ForOwners() {
    const containerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="pt-44 pb-32 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
                    <div className="reveal">
                        <span className="bg-accent/10 text-accent px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6 inline-block">
                            MenusMOZ para Empresas
                        </span>
                        <h1 className="text-5xl md:text-7xl mb-8 tracking-tighter text-text-main">
                            Faça crescer o seu <br /><span className="text-primary italic">Restaurante</span>
                        </h1>
                        <p className="text-xl text-text-dim mb-12 font-medium leading-relaxed">
                            Junte-se à maior plataforma de menus digitais de Moçambique e alcance milhares de novos clientes todos os meses.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: TrendingUp, title: "Mais Visibilidade", desc: "Apareça nos primeiros resultados de pesquisa culinária." },
                                { icon: Globe, title: "Menu Digital", desc: "Um link único para partilhar nas redes sociais." },
                                { icon: ShieldCheck, title: "Confiança", desc: "Plataforma segura e robusta para o seu negócio." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main uppercase mb-1">{item.title}</h4>
                                        <p className="text-text-dim">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface p-8 md:p-12 rounded-[3rem] border border-border-subtle shadow-2xl shadow-primary/5 reveal">
                        <h3 className="text-3xl mb-8 text-text-main">Registe o seu interesse</h3>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase text-text-dim">Nome do Restaurante</label>
                                <input type="text" className="w-full h-14 bg-bg border border-border-subtle rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Ex: Sabor da Zambézia" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase text-text-dim">Seu Email</label>
                                <input type="email" className="w-full h-14 bg-bg border border-border-subtle rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="email@contacto.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase text-text-dim">Telefone</label>
                                <input type="tel" className="w-full h-14 bg-bg border border-border-subtle rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="+258..." />
                            </div>
                            <button className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:bg-black transition-all text-xl mt-4">
                                Enviar Pedido
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
