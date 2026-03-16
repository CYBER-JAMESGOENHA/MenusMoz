import { useEffect, useRef } from 'react';
import { X, Mail, Lock, LogIn, Github } from 'lucide-react';
import { gsap } from 'gsap';

export default function LoginModal({ isOpen, onClose, lang }) {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const ctx = gsap.context(() => {
                gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
                gsap.fromTo(contentRef.current, 
                    { scale: 0.95, y: 40, opacity: 0 }, 
                    { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
                );
                gsap.from(".login-reveal", {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.05,
                    delay: 0.2,
                    ease: "power2.out"
                });
            });
            return () => ctx.revert();
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const t = lang === 'pt' ? {
        title: 'Bem-vindo de volta',
        subtitle: 'O sabor de Moçambique espera por ti.',
        email: 'Endereço de Email',
        pass: 'Palavra-passe',
        login: 'Aceder à Minha Conta',
        or: 'Ou autenticar via',
        noAccount: 'Novo por aqui? Criar Identidade'
    } : {
        title: 'Welcome back',
        subtitle: 'The flavor of Mozambique awaits you.',
        email: 'Email Address',
        pass: 'Password',
        login: 'Access My Account',
        or: 'Or authenticate via',
        noAccount: "New here? Create Identity"
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                ref={contentRef}
                className="relative w-full max-w-lg bg-surface/80 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-premium overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                 {/* Decorative background depth */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-moz-green/5 rounded-full blur-3xl -ml-20 -mb-20" />

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 text-text-main transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-12 login-reveal">
                    <div className="w-20 h-20 bg-primary rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-primary-glow group-hover:rotate-12 transition-transform">
                        <LogIn size={36} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display italic text-text-main mb-3 tracking-tighter">
                        {t.title}
                    </h2>
                    <p className="text-lg text-text-dim font-medium italic opacity-60 px-4">{t.subtitle}</p>
                </div>

                <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                    <div className="space-y-3 login-reveal">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2">{t.email}</label>
                        <div className="relative group">
                            <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                className="w-full h-20 pl-16 pr-8 rounded-3xl glass border-border-subtle focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                                placeholder="oseu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 login-reveal">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2">{t.pass}</label>
                        <div className="relative group">
                            <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                className="w-full h-20 pl-16 pr-8 rounded-3xl glass border-border-subtle focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="login-reveal pt-4">
                        <button className="w-full bg-text-main text-surface h-20 rounded-3xl font-black text-xl hover:bg-primary hover:text-white transition-all shadow-premium hover:shadow-primary-glow">
                            {t.login}
                        </button>
                    </div>
                </form>

                <div className="my-10 flex items-center gap-6 text-text-dim/30 login-reveal">
                    <div className="h-px bg-current flex-1"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] shrink-0">{t.or}</span>
                    <div className="h-px bg-current flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-6 login-reveal">
                    <button className="h-16 rounded-2xl glass flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-text-main">
                        <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Google
                    </button>
                    <button className="h-16 rounded-2xl glass flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-text-main">
                        <Github size={24} />
                        GitHub
                    </button>
                </div>

                <p className="mt-12 text-center text-xs font-black uppercase tracking-widest text-text-dim hover:text-primary transition-colors cursor-pointer login-reveal">
                    {t.noAccount}
                </p>
            </div>
        </div>
    );
}
