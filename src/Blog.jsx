import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BLOG_POSTS } from './data';

export default function Blog() {
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
                <div className="text-center mb-24 reveal">
                    <span className="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest mb-6 inline-block">
                        Blog MenusMOZ
                    </span>
                    <h1 className="text-5xl md:text-7xl mb-8 tracking-tighter text-text-main">
                        O Sabor de <span className="text-primary italic">Moçambique</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-text-dim max-w-3xl mx-auto font-medium leading-relaxed">
                        Curiosidades, receitas, reviews e histórias por trás dos pratos mais emblemáticos da nossa terra.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 reveal">
                    {BLOG_POSTS.map(post => (
                        <article key={post.id} className="group cursor-pointer">
                            <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-8 border border-border-subtle">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-primary transition-colors">
                                    Gastronomia
                                </div>
                            </div>
                            <div className="flex items-center gap-6 mb-4 text-xs font-bold uppercase tracking-widest text-text-dim/60">
                                <div className="flex items-center gap-2"><Calendar size={14} /> {post.date}</div>
                                <div className="flex items-center gap-2"><User size={14} /> {post.author}</div>
                            </div>
                            <h3 className="text-3xl mb-4 text-text-main group-hover:text-primary transition-colors leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-text-dim mb-8 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                            </p>
                            <button className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-sm group/btn">
                                Ler Artigo <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
