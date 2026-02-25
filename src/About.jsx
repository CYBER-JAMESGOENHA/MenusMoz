import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Users, Target, Rocket } from 'lucide-react';

export default function About() {
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
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-24 reveal">
                    <span className="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6 inline-block">
                        A Nossa História
                    </span>
                    <h1 className="text-5xl md:text-7xl mb-8 tracking-tighter text-text-main">
                        Digitalizando o sabor de <span className="text-primary italic">Moçambique</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-text-dim max-w-3xl mx-auto font-medium leading-relaxed">
                        O MenusMOZ nasceu da paixão pela gastronomia e da vontade de colocar os melhores restaurantes do país na palma da mão de todos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 mb-32 reveal">
                    <div>
                        <h2 className="text-3xl mb-6 text-text-main italic">A Missão</h2>
                        <p className="text-text-dim text-lg leading-relaxed">
                            Nossa missão é democratizar o acesso à informação gastronómica de qualidade em Moçambique, ajudando restauradores a crescerem e clientes a descobrirem novas experiências inesquecíveis.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-3xl mb-6 text-text-main italic">O Futuro</h2>
                        <p className="text-text-dim text-lg leading-relaxed">
                            Queremos ser a maior rede de menus digitais de África Austral, começando pelo coração da nossa Pérola do Índico.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 reveal">
                    {[
                        { icon: Users, title: "Equipa Jovem", desc: "Desenvolvedores e foodies moçambicanos." },
                        { icon: Target, title: "Foco no Cliente", desc: "Simplicidade e rapidez na descoberta." },
                        { icon: Rocket, title: "Inovação", desc: "Tecnologia de ponta para a restauração." }
                    ].map((item, i) => (
                        <div key={i} className="bg-surface p-10 rounded-[3rem] border border-border-subtle text-center">
                            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl text-primary mx-auto mb-6">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-text-main uppercase">{item.title}</h3>
                            <p className="text-text-dim">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
