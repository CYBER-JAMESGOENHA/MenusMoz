import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BLOG_POSTS } from './data';
import { Link } from 'react-router-dom';

export default function Blog({ lang, posts = [] }) {
    const containerRef = useRef(null);
    // Use dynamic posts if available, fallback to static data
    const displayPosts = posts.length > 0 ? posts : BLOG_POSTS;

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="pt-48 pb-40 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32 reveal">
                    <div className="max-w-3xl">
                         <span className="bg-primary/10 text-primary px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
                            Diário Gastronómico
                        </span>
                        <h1 className="text-6xl md:text-9xl mb-8 tracking-tighter text-text-main font-display italic leading-[0.85]">
                            O Sabor de <span className="text-primary italic">Moz</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-text-dim font-medium leading-relaxed italic">
                            Curiosidades, receitas ancestrais e histórias por trás dos pratos que definem a nossa identidade.
                        </p>
                    </div>
                    <div className="flex gap-4">
                         {['Cultura', 'Reviews', 'Receitas', 'Notícias'].map(cat => (
                             <button key={cat} className="px-6 py-3 rounded-full border border-border-subtle hover:border-primary font-black text-[10px] uppercase tracking-widest transition-all">
                                {cat}
                             </button>
                         ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 reveal">
                    {displayPosts.map((post, i) => (
                        <article key={post.id} className="group cursor-pointer">
                            <Link to={post.slug ? `/blog/${post.slug}` : '#'} className="block">
                            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-10 border border-border-subtle shadow-lg group-hover:shadow-premium transition-all duration-700">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute top-8 left-8">
                                     <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">
                                        Exploração
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-10 right-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                     <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2">
                                        Ler Detalhes <ArrowRight size={16} />
                                     </button>
                                </div>
                            </div>
                            
                            <div className="px-4">
                                <div className="flex items-center gap-6 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim/50">
                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-primary" aria-hidden="true" /> {post.date}</div>
                                    <div className="flex items-center gap-2 bg-primary/5 px-2 py-1 rounded-md text-primary"><User size={14} aria-hidden="true" /> {post.author}</div>
                                </div>
                                <h3 className="text-4xl mb-6 text-text-main font-display leading-[1.1] group-hover:text-primary transition-colors tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="text-text-dim text-lg mb-8 line-clamp-2 leading-relaxed font-medium italic">
                                    "{post.excerpt}"
                                </p>
                            </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
