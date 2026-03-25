import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPost({ lang, posts = [] }) {
    const { slug } = useParams();
    const containerRef = useRef(null);

    const post = posts.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!post) return;
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.blog-post-reveal', {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: 'power4.out'
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, [post]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-32 px-4 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary text-5xl font-display font-black">404</div>
                <h1 className="text-4xl font-display font-black text-text-main tracking-tighter">Artigo não encontrado</h1>
                <p className="text-text-dim font-medium">O artigo que procura não existe ou foi removido.</p>
                <Link to="/blog" className="bg-primary text-white px-10 py-4 rounded-full font-black hover:brightness-110 transition-all shadow-primary-glow flex items-center gap-2">
                    <ArrowLeft size={18} aria-hidden="true" /> Voltar ao Blog
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="pt-40 pb-32 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-text-dim hover:text-primary transition-colors font-black text-xs uppercase tracking-widest mb-12 blog-post-reveal"
                >
                    <ArrowLeft size={16} aria-hidden="true" /> Voltar ao Blog
                </Link>

                <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-12 shadow-premium border border-border-subtle blog-post-reveal">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
                </div>

                <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim/50 blog-post-reveal">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-primary" aria-hidden="true" /> {post.date}</div>
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg text-primary"><User size={14} aria-hidden="true" /> {post.author}</div>
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-text-main mb-8 leading-[1.0] blog-post-reveal">
                    {post.title}
                </h1>

                <p className="text-xl text-text-dim font-medium leading-relaxed italic blog-post-reveal">
                    "{post.excerpt}"
                </p>

                <div className="mt-16 pt-8 border-t border-border-subtle blog-post-reveal">
                    {post.content ? (
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {post.content.split('\n\n').map((para, i) => (
                                <p key={i} className="text-text-main text-lg leading-relaxed mb-6 font-medium">
                                    {para}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-dim text-sm font-medium italic">
                            {lang === 'pt'
                                ? 'Conteúdo completo disponível em breve. Subscreve a newsletter para seres o primeiro a saber.'
                                : 'Full content coming soon. Subscribe to our newsletter to be the first to know.'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
