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

    // ── Brute Force Protection (fix S3) ──────────────────────────────
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    const [lockoutCountdown, setLockoutCountdown] = useState(0);
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_SECONDS = 30;

    useEffect(() => {
        if (!lockoutUntil) return;
        const interval = setInterval(() => {
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
            if (remaining <= 0) {
                setLockoutUntil(null);
                setLockoutCountdown(0);
                setFailedAttempts(0);
            } else {
                setLockoutCountdown(remaining);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [lockoutUntil]);

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
        attempts_left: 'tentativas restantes',
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
        attempts_left: 'attempts left',
    };

    useEffect(() => {
        if (!isOpen) {
            setError('');
            setSuccess('');
            setEmail('');
            setPassword('');
            setMode('login');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
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
    }, [isOpen, mode, onClose]);

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

        // Brute force check
        if (lockoutUntil && Date.now() < lockoutUntil) {
            setError(
                lang === 'pt'
                    ? `Demasiadas tentativas. Aguarda ${lockoutCountdown}s.`
                    : `Too many attempts. Wait ${lockoutCountdown}s.`
            );
            return;
        }

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
                setFailedAttempts(0);
                setSuccess(t.success_login);
                setTimeout(() => onClose(), 1200);
            } else {
                const { error: err } = await supabase.auth.signUp({ email, password });
                if (err) throw err;
                setSuccess(t.success_register);
            }
        } catch (err) {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            if (newAttempts >= MAX_ATTEMPTS) {
                const until = Date.now() + LOCKOUT_SECONDS * 1000;
                setLockoutUntil(until);
                setLockoutCountdown(LOCKOUT_SECONDS);
                setError(
                    lang === 'pt'
                        ? `Conta temporariamente bloqueada. Aguarda ${LOCKOUT_SECONDS}s.`
                        : `Account temporarily locked. Wait ${LOCKOUT_SECONDS}s.`
                );
            } else {
                setError(
                    `${getErrorMessage(err)} (${MAX_ATTEMPTS - newAttempts} ${t.attempts_left})`
                );
            }
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
                className="relative w-full max-w-md bg-surface/90 backdrop-blur-3xl p-6 sm:p-8 rounded-[2rem] border border-white/20 shadow-premium overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-moz-green/5 rounded-full blur-3xl -ml-16 -mb-16" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl glass hover:bg-primary/10 text-text-main transition-all z-10"
                    aria-label="Fechar"
                >
                    <X size={18} />
                </button>

                <div className="text-center mb-5 login-reveal">
                    <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-primary-glow">
                        {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                    </div>
                    <h2 className="text-2xl font-display italic text-text-main mb-1 tracking-tighter">
                        {mode === 'login' ? t.title_login : t.title_register}
                    </h2>
                    <p className="text-sm text-text-dim font-medium italic opacity-70">
                        {mode === 'login' ? t.subtitle_login : t.subtitle_register}
                    </p>
                </div>

                <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="space-y-1 login-reveal">
                        <label htmlFor="modal-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-1 block">
                            {t.email}
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                id="modal-email"
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                className="w-full h-12 pl-11 pr-4 rounded-xl glass border-border-subtle focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm"
                                placeholder="oseu@email.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1 login-reveal">
                        <label htmlFor="modal-pass" className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim/60 px-1 block">
                            {t.pass}
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                id="modal-pass"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                className="w-full h-12 pl-11 pr-11 rounded-xl glass border-border-subtle focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-medium text-sm"
                                placeholder="••••••••"
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-primary transition-colors"
                                aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 login-reveal">
                            <AlertCircle size={15} className="text-red-500 shrink-0" />
                            <p className="text-xs font-bold text-red-600">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 login-reveal">
                            <CheckCircle size={15} className="text-green-500 shrink-0" />
                            <p className="text-xs font-bold text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="login-reveal pt-1">
                        <button
                            type="submit"
                            disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
                            className="w-full bg-text-main text-surface h-16 rounded-2xl font-black text-base hover:bg-primary hover:text-white transition-all shadow-premium hover:shadow-primary-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            aria-busy={isLoading}
                        >
                            {isLoading ? <Loader2 size={22} className="animate-spin" aria-hidden="true" /> : null}
                            {lockoutUntil && Date.now() < lockoutUntil
                                ? `${lockoutCountdown}s`
                                : mode === 'login' ? t.login : t.register
                            }
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="my-4 flex items-center gap-4 text-text-dim/30 login-reveal">
                    <div className="h-px bg-current flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] shrink-0">{t.or}</span>
                    <div className="h-px bg-current flex-1" />
                </div>

                {/* OAuth buttons */}
                <div className="grid grid-cols-2 gap-3 login-reveal">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="h-10 rounded-xl glass flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-text-main disabled:opacity-60"
                        aria-label="Login com Google"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                        className="h-10 rounded-xl glass flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-text-main disabled:opacity-60"
                        aria-label="Login com GitHub"
                    >
                        <Github size={16} />
                        GitHub
                    </button>
                </div>

                {/* Mode toggle */}
                <p className="mt-4 text-center text-xs font-bold text-text-dim login-reveal">
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
