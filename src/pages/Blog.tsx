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
        <div ref={containerRef} className="pt-32 pb-16 bg-bg selection:bg-primary/30 min-h-screen">
             {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[40vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[10rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-3">
                    Crónicas
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 reveal">
                    <div className="max-w-4xl">
                         <div className="flex items-center gap-3 mb-6">
                            <Tag size={12} className="text-primary" />
                            <span className="bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-sm">
                                {t.tag}
                            </span>
                         </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tighter text-text-main font-display font-black italic leading-[0.85] uppercase">
                            {t.title} <span className="text-primary italic">Moz</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-dim font-bold leading-relaxed italic uppercase opacity-60 tracking-tight max-w-2xl">
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredPosts.map((post) => (
                        <article key={post.id} className="group cursor-pointer post-card relative h-full flex flex-col">
                            <Link to={post.slug ? `/blog/${post.slug}` : '#'} className="block h-full flex flex-col">
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 border border-border-subtle shadow-premium transition-all duration-700 bg-surface">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                    
                                    {/* Category Badge Floating */}
                                    <div className="absolute top-4 left-4">
                                         <div className="bg-white/95 dark:bg-black/95 backdrop-blur-3xl px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-2xl skew-x-[-10deg]">
                                            <span className="skew-x-[10deg] block italic">{post.category || (selectedLang === 'pt' ? 'Gourmet' : 'Gourmet')}</span>
                                        </div>
                                    </div>

                                    {/* Action Button Floating */}
                                    <div className="absolute bottom-6 left-6 right-6 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10">
                                         <div className="w-full bg-white text-black py-3 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-primary-glow flex items-center justify-center gap-3 italic">
                                            {t.read_more} <ArrowRight size={20} strokeWidth={3} />
                                         </div>
                                    </div>
                                </div>
                                
                                <div className="px-2 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/40 italic">
                                        <div className="flex items-center gap-2"><Calendar size={16} className="text-primary/50" aria-hidden="true" /> {post.date}</div>
                                        <div className="flex items-center gap-2 text-primary opacity-80"><User size={16} aria-hidden="true" /> {post.author}</div>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl mb-4 text-text-main font-display font-black leading-[0.9] group-hover:text-primary transition-all duration-500 tracking-tighter uppercase italic">
                                        {post.title}
                                    </h3>
                                    <p className="text-text-dim/60 text-sm mb-6 line-clamp-2 leading-relaxed font-bold italic uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                                        "{post.excerpt}"
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                    
                    {filteredPosts.length === 0 && (
                        <div className="col-span-full py-16 text-center glass rounded-2xl border border-border-subtle shadow-premium overflow-hidden">
                             <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none" />
                             <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Search size={32} />
                             </div>
                             <h3 className="text-3xl font-display font-black text-text-main italic tracking-tighter mb-3 uppercase">
                                {selectedLang === 'pt' ? 'Vazio por enquanto' : 'Empty for now'}
                             </h3>
                              <p className="text-text-dim font-bold text-sm max-w-md mx-auto leading-relaxed italic uppercase opacity-60 tracking-tight">
                                {selectedLang === 'pt' ? 'Brevemente novos contos nesta mesa.' : 'New stories at this table soon.'}
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
