import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, LogIn, Github, Loader2, CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: string;
}

export default function LoginModal({ isOpen, onClose, lang }: LoginModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const t = lang === 'pt' ? {
        title: 'Aceder ao MenusMoz',
        subtitle: 'Acesso seguro sem palavras-passe.',
        email: 'O teu Email',
        login: 'Enviar Magic Link',
        or: 'Ou autenticar via',
        google: 'Continuar com Google',
        github: 'Continuar com GitHub',
        error_invalid: 'Email inválido.',
        error_generic: 'Ocorreu um erro. Tenta novamente.',
        success_magic: 'Enviámos um Magic Link! Verifica a tua caixa de entrada para entrar.',
        supabase_missing: 'Serviço de autenticação não disponível.',
    } : {
        title: 'Sign in to MenusMoz',
        subtitle: 'Secure passwordless access.',
        email: 'Your Email address',
        login: 'Send Magic Link',
        or: 'Or authenticate via',
        google: 'Continue with Google',
        github: 'Continue with GitHub',
        error_invalid: 'Invalid email address.',
        error_generic: 'An error occurred. Please try again.',
        success_magic: 'Magic Link sent! Check your inbox to sign in.',
        supabase_missing: 'Authentication service unavailable.',
    };

    useEffect(() => {
        if (!isOpen) {
            setError('');
            setSuccess('');
            setEmail('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
            const ctx = gsap.context(() => {
                gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
                gsap.fromTo(contentRef.current,
                    { scale: 0.95, y: 40, opacity: 0 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'power4.out' }
                );
                gsap.from('.login-reveal', {
                    y: 20, opacity: 0, duration: 0.5, stagger: 0.05, delay: 0.2, ease: 'power2.out'
                });
            });
            return () => {
                ctx.revert();
                window.removeEventListener('keydown', handleKeyDown);
            };
        } else {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isSupabaseConfigured || !supabase) {
            setError(t.supabase_missing);
            return;
        }

        if (!email || !email.includes('@')) {
            setError(t.error_invalid);
            return;
        }

        setIsLoading(true);
        try {
            const { error: err } = await supabase.auth.signInWithOtp({ 
                email,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });
            if (err) throw err;
            setSuccess(t.success_magic);
        } catch (err: any) {
            console.error('Magic Link Error:', err);
            setError(t.error_generic);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured || !supabase) { setError(t.supabase_missing); return; }
        setIsLoading(true);
        const { error: err } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (err) { setError(t.error_generic); setIsLoading(false); }
    };

    const handleGithubLogin = async () => {
        if (!isSupabaseConfigured || !supabase) { setError(t.supabase_missing); return; }
        setIsLoading(true);
        const { error: err } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin }
        });
        if (err) { setError(t.error_generic); setIsLoading(false); }
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                ref={contentRef}
                className="relative w-full max-w-md bg-surface/90 backdrop-blur-3xl p-6 sm:p-10 rounded-[2.5rem] border border-white/20 shadow-premium overflow-hidden animate-in fade-in zoom-in-95 duration-500"
                onClick={e => e.stopPropagation()}
            >
                {/* Background glows */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-moz-yellow/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl glass hover:bg-primary/10 text-text-main transition-all z-10 hover:text-primary"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8 login-reveal">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-primary-glow group hover:scale-110 hover:rotate-3 transition-transform duration-500">
                        <Wand2 size={30} className="group-hover:animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-display font-black italic text-text-main mb-2 tracking-tighter uppercase">
                        {t.title}
                    </h2>
                    <p className="text-xs text-text-dim font-bold italic opacity-80 uppercase tracking-widest leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    {/* Email Input */}
                    <div className="space-y-1.5 login-reveal">
                        <label htmlFor="modal-email" className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim/60 px-1 ml-0.5 block">
                            {t.email}
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                id="modal-email"
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                className="w-full h-14 pl-12 pr-4 rounded-xl glass border border-border-subtle focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold text-sm"
                                placeholder="nome@exemplo.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 login-reveal">
                            <AlertCircle size={18} className="text-red-500 shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-tighter text-red-600 leading-tight">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 login-reveal">
                            <CheckCircle size={18} className="text-primary shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-tighter text-text-main leading-tight">{success}</p>
                        </div>
                    )}

                    {/* Send Magic Link Button */}
                    <div className="login-reveal pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full overflow-hidden bg-text-main text-surface h-16 rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-premium hover:shadow-primary-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 duration-300"
                            aria-busy={isLoading}
                        >
                            {isLoading ? <Loader2 size={24} className="animate-spin" aria-hidden="true" /> : <Mail size={20} />}
                            {t.login}
                        </button>
                    </div>
                </form>

                <div className="my-7 flex items-center gap-4 text-text-dim/30 login-reveal">
                    <div className="h-px bg-current flex-1 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] shrink-0 text-text-dim/80">{t.or}</span>
                    <div className="h-px bg-current flex-1 opacity-20" />
                </div>

                <div className="grid grid-cols-2 gap-4 login-reveal">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="h-14 rounded-xl glass border border-white/10 flex items-center justify-center gap-3 hover:bg-white transition-all hover:text-black font-black uppercase text-[10px] tracking-widest text-text-main disabled:opacity-60 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                        className="h-14 rounded-xl glass border border-white/10 flex items-center justify-center gap-3 hover:bg-black transition-all hover:text-white font-black uppercase text-[10px] tracking-widest text-text-main disabled:opacity-60 shadow-sm"
                    >
                        <Github size={18} />
                        GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}
