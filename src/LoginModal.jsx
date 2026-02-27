import { useEffect, useRef } from 'react';
import { X, Mail, Lock, LogIn, Github } from 'lucide-react';
import { gsap } from 'gsap';

export default function LoginModal({ isOpen, onClose, lang }) {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(contentRef.current, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" });
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
        login: 'Entrar agora',
        or: 'Ou continuar com',
        noAccount: 'Não tem conta? Registe-se'
    } : {
        title: 'Welcome back',
        subtitle: 'The flavor of Mozambique awaits you.',
        email: 'Email Address',
        pass: 'Password',
        login: 'Login now',
        or: 'Or continue with',
        noAccount: "Don't have an account? Sign up"
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                ref={contentRef}
                className="relative w-full max-w-md bg-surface/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-primary/10 text-text-main transition-all"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/20">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-text-main mb-2 tracking-tighter">
                        {t.title}
                    </h2>
                    <p className="text-text-dim">{t.subtitle}</p>
                </div>

                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-text-dim px-2">{t.email}</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                className="w-full h-16 pl-14 pr-6 rounded-2xl glass border-border-subtle focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main"
                                placeholder="exemplo@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-text-dim px-2">{t.pass}</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                className="w-full h-16 pl-14 pr-6 rounded-2xl glass border-border-subtle focus:ring-4 focus:ring-primary/10 outline-none transition-all text-text-main"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-primary text-white h-16 rounded-2xl font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-primary/20 mt-4">
                        {t.login}
                    </button>
                </form>

                <div className="my-8 flex items-center gap-4 text-text-dim/40">
                    <div className="h-px bg-current flex-1"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest shrink-0">{t.or}</span>
                    <div className="h-px bg-current flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="h-14 rounded-2xl glass flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-bold text-text-main">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Google
                    </button>
                    <button className="h-14 rounded-2xl glass flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-bold text-text-main">
                        <Github size={20} />
                        GitHub
                    </button>
                </div>

                <p className="mt-10 text-center text-sm font-bold text-text-dim hover:text-primary transition-colors cursor-pointer">
                    {t.noAccount}
                </p>
            </div>
        </div>
    );
}
