import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

interface BlogPostType {
    id: string | number;
    title: string;
    slug: string;
    image: string;
    category: string;
    date: string;
    author: string;
    excerpt: string;
    content?: string;
}

interface BlogPostProps {
    lang: string;
    posts?: BlogPostType[];
}

export default function BlogPost({ lang, posts = [] }: BlogPostProps) {
    const { slug } = useParams<{ slug: string }>();
    const containerRef = useRef<HTMLDivElement>(null);
    const post = posts.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!post || !containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.blog-post-reveal', {
                y: 60,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: 'power4.out',
                clearProps: 'all'
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, [post]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 pt-40 px-6 text-center bg-bg">
                <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary text-6xl font-display font-black shadow-primary-glow/10">404</div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-text-main tracking-tighter uppercase italic">Não Encontrado</h1>
                <p className="text-text-dim text-xl font-bold uppercase italic opacity-60">O sabor que procura fugiu da cozinha.</p>
                <Link to="/blog" className="mt-4 bg-text-main text-surface px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-premium flex items-center gap-3 italic">
                    <ArrowLeft size={20} /> Voltar às Crónicas
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="pt-48 pb-32 px-6 md:px-12 bg-bg selection:bg-primary/20 overflow-hidden">
             {/* Artistic Background Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.07]">
                <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[15rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none rotate-6">
                    {post.category || 'Gourmet'}
                </span>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12 blog-post-reveal">
                    <Link
                        to="/blog"
                        className="group inline-flex items-center gap-3 text-text-dim hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.4em] italic"
                    >
                        <div className="w-10 h-10 rounded-xl glass border border-border-subtle flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        {lang === 'pt' ? 'Voltar ao Editorial' : 'Back to Editorial'}
                    </Link>

                    <button className="w-10 h-10 rounded-xl glass border border-border-subtle flex items-center justify-center text-text-dim hover:text-primary hover:border-primary transition-all shadow-sm">
                        <Share2 size={18} />
                    </button>
                </div>

                <div className="relative aspect-[16/9] rounded-[3.5rem] overflow-hidden mb-16 shadow-premium border border-border-subtle blog-post-reveal group">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" aria-hidden="true" />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-10 left-10">
                         <div className="bg-white/95 dark:bg-black/95 backdrop-blur-3xl px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-primary shadow-2xl skew-x-[-10deg]">
                            <span className="skew-x-[10deg] block italic">Moz Chronicles</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 mb-10 text-[10px] font-black uppercase tracking-[0.4em] text-text-dim/40 blog-post-reveal italic pb-8 border-b border-border-subtle/50">
                    <div className="flex items-center gap-2.5"><Calendar size={18} className="text-primary/40" /> {post.date}</div>
                    <div className="flex items-center gap-2.5 text-primary opacity-80"><User size={18} /> {post.author}</div>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-text-main mb-10 leading-[0.85] blog-post-reveal uppercase italic">
                    {post.title}
                </h1>

                <p className="text-2xl md:text-3xl text-text-dim font-bold leading-tight italic blog-post-reveal uppercase tracking-tight opacity-70 mb-20 border-l-4 border-primary pl-8">
                    "{post.excerpt}"
                </p>

                <div className="mt-20 blog-post-reveal">
                    {post.content ? (
                        <div className="max-w-none space-y-12">
                            {post.content.split('\n\n').map((para, i) => (
                                <p key={i} className="text-text-main text-xl leading-relaxed font-bold italic uppercase tracking-tight opacity-90 first-letter:text-5xl first-letter:font-black first-letter:mr-1 first-letter:float-left first-letter:text-primary">
                                    {para}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface p-12 rounded-[3.5rem] border border-border-subtle shadow-premium text-center">
                            <p className="text-2xl font-display font-black text-text-dim italic uppercase tracking-tighter mb-8">
                                {lang === 'pt'
                                    ? 'A mesa está a ser posta...'
                                    : 'Setting the table...'}
                            </p>
                            <p className="text-text-dim/60 text-sm font-black uppercase tracking-widest italic leading-relaxed max-w-md mx-auto">
                                {lang === 'pt'
                                    ? 'O conteúdo completo desta crónica está em revisão. Subscreve para seres notificado assim que for servido.'
                                    : 'Full content of this chronicle is under review. Subscribe to be notified as soon as it is served.'}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Final Signature */}
                <div className="mt-24 pt-12 border-t border-border-subtle blog-post-reveal flex flex-col items-center">
                    <div className="w-16 h-1 w-full bg-primary/20 rounded-full mb-10 overflow-hidden">
                        <div className="h-full bg-primary w-1/3 shadow-primary-glow" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-dim italic opacity-40">Locais de Moz Editorial</p>
                </div>
            </div>
        </div>
    );
}
