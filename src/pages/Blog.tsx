import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Calendar, User, Search, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { translations } from '../translations';

interface BlogPost {
    id: string | number;
    title: string;
    slug: string;
    image: string;
    category: string;
    date: string;
    author: string;
    excerpt: string;
}

interface BlogProps {
    lang: string;
    posts?: BlogPost[];
}

export default function Blog({ lang, posts = [] }: BlogProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = useState('Tudo');
    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';
    const t = translations[selectedLang]?.blog ?? translations.pt.blog;
    
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
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 80,
                opacity: 0,
                duration: 1.5,
                stagger: 0.25,
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
                scale: 0.95,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "all"
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, [activeCategory]);

    return (
        <div ref={containerRef} className="pt-48 pb-32 bg-bg selection:bg-primary/30 min-h-screen">
             {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[20rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-3">
                    Crónicas
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-28 reveal">
                    <div className="max-w-4xl">
                         <div className="flex items-center gap-3 mb-8">
                            <Tag size={12} className="text-primary" />
                            <span className="bg-primary/10 text-primary px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-sm">
                                {t.tag}
                            </span>
                         </div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 tracking-tighter text-text-main font-display font-black italic leading-[0.85] uppercase">
                            {t.title} <span className="text-primary italic">Moz</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-text-dim font-bold leading-relaxed italic uppercase opacity-60 tracking-tight max-w-2xl">
                            {t.subtitle}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 pb-2 self-start lg:self-end">
                         {categories.map(cat => (
                             <button 
                                key={cat.key} 
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-8 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 ${
                                    activeCategory === cat.key 
                                    ? 'bg-primary border-primary text-white shadow-primary-glow scale-105' 
                                    : 'border-border-subtle hover:border-primary text-text-dim/60 hover:text-primary'
                                }`}
                             >
                                <span className="italic">{cat.label}</span>
                             </button>
                         ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
                    {filteredPosts.map((post) => (
                        <article key={post.id} className="group cursor-pointer post-card relative h-full flex flex-col">
                            <Link to={post.slug ? `/blog/${post.slug}` : '#'} className="block h-full flex flex-col">
                                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-10 border border-border-subtle shadow-premium transition-all duration-700 bg-surface">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                    
                                    {/* Category Badge Floating */}
                                    <div className="absolute top-8 left-8">
                                         <div className="bg-white/95 dark:bg-black/95 backdrop-blur-3xl px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-2xl skew-x-[-10deg]">
                                            <span className="skew-x-[10deg] block italic">{post.category || (selectedLang === 'pt' ? 'Gourmet' : 'Gourmet')}</span>
                                        </div>
                                    </div>

                                    {/* Action Button Floating */}
                                    <div className="absolute bottom-12 left-10 right-10 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10">
                                         <div className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-primary-glow flex items-center justify-center gap-3 italic">
                                            {t.read_more} <ArrowRight size={20} strokeWidth={3} />
                                         </div>
                                    </div>
                                </div>
                                
                                <div className="px-4 flex flex-col flex-grow">
                                    <div className="flex items-center gap-6 mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-text-dim/40 italic">
                                        <div className="flex items-center gap-2"><Calendar size={16} className="text-primary/50" aria-hidden="true" /> {post.date}</div>
                                        <div className="flex items-center gap-2 text-primary opacity-80"><User size={16} aria-hidden="true" /> {post.author}</div>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl mb-6 text-text-main font-display font-black leading-[0.9] group-hover:text-primary transition-all duration-500 tracking-tighter uppercase italic">
                                        {post.title}
                                    </h3>
                                    <p className="text-text-dim/60 text-lg mb-10 line-clamp-2 leading-relaxed font-bold italic uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                                        "{post.excerpt}"
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                    
                    {filteredPosts.length === 0 && (
                        <div className="col-span-full py-48 text-center glass rounded-[4rem] border border-border-subtle shadow-premium overflow-hidden">
                             <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none" />
                             <div className="w-32 h-32 bg-primary/10 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                                <Search size={48} />
                             </div>
                             <h3 className="text-5xl font-display font-black text-text-main italic tracking-tighter mb-4 uppercase">
                                {selectedLang === 'pt' ? 'Vazio por enquanto' : 'Empty for now'}
                             </h3>
                             <p className="text-text-dim font-bold text-xl max-w-md mx-auto leading-relaxed italic uppercase opacity-60 tracking-tight">
                                {selectedLang === 'pt' ? 'Brevemente novos contos nesta mesa.' : 'New stories at this table soon.'}
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
