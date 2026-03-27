import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BLOG_POSTS } from '../data';
import { Link } from 'react-router-dom';
import { translations } from '../translations';

export default function Blog({ lang, posts = [] }) {
    const containerRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState('Tudo');
    const t = translations[lang]?.blog ?? translations.pt.blog;
    
    // Use dynamic posts if available, fallback to static data
    const allPosts = posts.length > 0 ? posts : BLOG_POSTS;
    
    const categories = [
        { key: 'Tudo', label: t.all },
        { key: 'Cultura', label: t.culture },
        { key: 'Reviews', label: t.reviews },
        { key: 'Receitas', label: t.recipes },
        { key: 'Notícias', label: t.news }
    ];

    const filteredPosts = activeCategory === 'Tudo' 
        ? allPosts 
        : allPosts.filter(p => p.category === activeCategory);

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
        }, containerRef.current);
        return () => ctx.revert();
    }, []);

    // Animate posts when filter changes
    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from(".post-card", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, [activeCategory]);

    return (
        <div ref={containerRef} className="pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 reveal">
                    <div className="max-w-3xl">
                         <span className="bg-primary/10 text-primary px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-10 inline-block">
                            {t.tag}
                        </span>
                        <h1 className="text-5xl md:text-7xl mb-6 tracking-tighter text-text-main font-display italic leading-tight">
                            {t.title} <span className="text-primary italic">Moz</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-dim font-medium leading-relaxed italic">
                            {t.subtitle}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                         {categories.map(cat => (
                             <button 
                                key={cat.key} 
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-6 py-3 rounded-full border font-black text-[10px] uppercase tracking-widest transition-all ${
                                    activeCategory === cat.key 
                                    ? 'bg-primary border-primary text-white shadow-primary-glow' 
                                    : 'border-border-subtle hover:border-primary text-text-dim'
                                }`}
                             >
                                {cat.label}
                             </button>
                         ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {filteredPosts.map((post) => (
                        <article key={post.id} className="group cursor-pointer post-card">
                            <Link to={post.slug ? `/blog/${post.slug}` : '#'} className="block h-full flex flex-col">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 border border-border-subtle shadow-lg group-hover:shadow-premium transition-all duration-700">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute top-8 left-8">
                                     <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">
                                        {post.category || (lang === 'pt' ? 'Exploração' : 'Exploration')}
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-10 right-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                     <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2">
                                        {t.read_more} <ArrowRight size={16} />
                                     </button>
                                </div>
                            </div>
                            
                            <div className="px-2 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim/50">
                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-primary" aria-hidden="true" /> {post.date}</div>
                                    <div className="flex items-center gap-2 bg-primary/5 px-2 py-1 rounded-md text-primary"><User size={14} aria-hidden="true" /> {post.author}</div>
                                </div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-text-main font-display leading-tight group-hover:text-primary transition-colors tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="text-text-dim text-lg mb-8 line-clamp-2 leading-relaxed font-medium italic">
                                    "{post.excerpt}"
                                </p>
                            </div>
                            </Link>
                        </article>
                    ))}
                    
                    {filteredPosts.length === 0 && (
                        <div className="col-span-full py-40 text-center">
                            <p className="text-text-dim/40 font-display italic text-3xl">
                                {lang === 'pt' ? 'Brevemente novos conteúdos nesta categoria.' : 'New content in this category coming soon.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
