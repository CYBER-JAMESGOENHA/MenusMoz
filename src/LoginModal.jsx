import { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, LogIn, Github, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function LoginModal({ isOpen, onClose, lang }) {
    const modalRef = useRef(null);
    const contentRef = useRef(null);
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const t = lang === 'pt' ? {
        title_login: 'Bem-vindo de volta',
        title_register: 'Criar Identidade',
        subtitle_login: 'O sabor de Moçambique espera por ti.',
        subtitle_register: 'Junta-te à comunidade gastronómica.',
        email: 'Endereço de Email',
        pass: 'Palavra-passe',
        login: 'Aceder à Minha Conta',
        register: 'Criar Conta',
        or: 'Ou autenticar via',
        noAccount: 'Novo por aqui?',
        hasAccount: 'Já tens conta?',
        register_link: 'Criar Identidade',
        login_link: 'Entrar',
        google: 'Continuar com Google',
        github: 'Continuar com GitHub',
        error_invalid: 'Email ou palavra-passe incorrectos.',
        error_email_exists: 'Este email já está registado.',
        error_weak_password: 'A palavra-passe deve ter pelo menos 6 caracteres.',
        error_generic: 'Ocorreu um erro. Tenta novamente.',
        success_register: 'Conta criada! Verifica o teu email para confirmar.',
        success_login: 'Login efectuado com sucesso!',
        supabase_missing: 'Serviço de autenticação não disponível.',
    } : {
        title_login: 'Welcome back',
        title_register: 'Create Identity',
        subtitle_login: 'The flavor of Mozambique awaits you.',
        subtitle_register: 'Join the gastronomic community.',
        email: 'Email Address',
        pass: 'Password',
        login: 'Access My Account',
        register: 'Create Account',
        or: 'Or authenticate via',
        noAccount: 'New here?',
        hasAccount: 'Already have an account?',
        register_link: 'Create Identity',
        login_link: 'Sign in',
        google: 'Continue with Google',
        github: 'Continue with GitHub',
        error_invalid: 'Invalid email or password.',
        error_email_exists: 'This email is already registered.',
        error_weak_password: 'Password must be at least 6 characters.',
        error_generic: 'An error occurred. Please try again.',
        success_register: 'Account created! Check your email to confirm.',
        success_login: 'Logged in successfully!',
        supabase_missing: 'Authentication service unavailable.',
    };

    useEffect(() => {
        setError('');
        setSuccess('');
        setEmail('');
        setPassword('');
        setMode('login');
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
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
            return () => ctx.revert();
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen, mode]);

    if (!isOpen) return null;

    const getErrorMessage = (err) => {
        const msg = err?.message?.toLowerCase() || '';
        if (msg.includes('invalid login') || msg.includes('invalid credentials')) return t.error_invalid;
        if (msg.includes('already registered') || msg.includes('already exists')) return t.error_email_exists;
        if (msg.includes('password') && msg.includes('characters')) return t.error_weak_password;
        return t.error_generic;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isSupabaseConfigured) {
            setError(t.supabase_missing);
            return;
        }
        if (!email || !password) {
            setError(lang === 'pt' ? 'Preenche todos os campos.' : 'Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError(t.error_weak_password);
            return;
        }

        setIsLoading(true);
        try {
            if (mode === 'login') {
                const { error: err } = await supabase.auth.signInWithPassword({ email, password });
                if (err) throw err;
                setSuccess(t.success_login);
                setTimeout(() => onClose(), 1200);
            } else {
                const { error: err } = await supabase.auth.signUp({ email, password });
                if (err) throw err;
                setSuccess(t.success_register);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured) { setError(t.supabase_missing); return; }
        setIsLoading(true);
        const { error: err } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (err) { setError(getErrorMessage(err)); setIsLoading(false); }
    };

    const handleGithubLogin = async () => {
        if (!isSupabaseConfigured) { setError(t.supabase_missing); return; }
        setIsLoading(true);
        const { error: err } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin }
        });
        if (err) { setError(getErrorMessage(err)); setIsLoading(false); }
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                ref={contentRef}
                className="relative w-full max-w-lg bg-surface/90 backdrop-blur-3xl p-8 sm:p-10 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-white/20 shadow-premium overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-moz-green/5 rounded-full blur-3xl -ml-20 -mb-20" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 text-text-main transition-all z-10"
                    aria-label="Fechar"
                >
                    <X size={22} />
                </button>

                <div className="text-center mb-8 login-reveal">
                    <div className="w-16 h-16 bg-primary rounded-[1.2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-primary-glow">
                        {mode === 'login' ? <LogIn size={30} /> : <UserPlus size={30} />}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display italic text-text-main mb-2 tracking-tighter">
                        {mode === 'login' ? t.title_login : t.title_register}
                    </h2>
                    <p className="text-base text-text-dim font-medium italic opacity-70">
                        {mode === 'login' ? t.subtitle_login : t.subtitle_register}
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="space-y-2 login-reveal">
                        <label htmlFor="modal-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2 block">
                            {t.email}
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                id="modal-email"
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                className="w-full h-16 pl-14 pr-5 rounded-2xl glass border-border-subtle focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm"
                                placeholder="oseu@email.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2 login-reveal">
                        <label htmlFor="modal-pass" className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-2 block">
                            {t.pass}
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                id="modal-pass"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                className="w-full h-16 pl-14 pr-14 rounded-2xl glass border-border-subtle focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm"
                                placeholder="••••••••"
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-text-dim hover:text-primary transition-colors"
                                aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 login-reveal">
                            <AlertCircle size={18} className="text-red-500 shrink-0" />
                            <p className="text-sm font-bold text-red-600">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3 login-reveal">
                            <CheckCircle size={18} className="text-green-500 shrink-0" />
                            <p className="text-sm font-bold text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="login-reveal pt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-text-main text-surface h-16 rounded-2xl font-black text-base hover:bg-primary hover:text-white transition-all shadow-premium hover:shadow-primary-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? <Loader2 size={22} className="animate-spin" /> : null}
                            {mode === 'login' ? t.login : t.register}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-5 text-text-dim/30 login-reveal">
                    <div className="h-px bg-current flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] shrink-0">{t.or}</span>
                    <div className="h-px bg-current flex-1" />
                </div>

                {/* OAuth buttons */}
                <div className="grid grid-cols-2 gap-4 login-reveal">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="h-14 rounded-2xl glass flex items-center justify-center gap-2.5 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-text-main disabled:opacity-60"
                        aria-label="Login com Google"
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
                        className="h-14 rounded-2xl glass flex items-center justify-center gap-2.5 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-text-main disabled:opacity-60"
                        aria-label="Login com GitHub"
                    >
                        <Github size={20} />
                        GitHub
                    </button>
                </div>

                {/* Mode toggle */}
                <p className="mt-8 text-center text-xs font-bold text-text-dim login-reveal">
                    {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
                    <button
                        type="button"
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                        className="text-primary hover:underline font-black uppercase tracking-widest"
                    >
                        {mode === 'login' ? t.register_link : t.login_link}
                    </button>
                </p>
            </div>
        </div>
    );
}
