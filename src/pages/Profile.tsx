import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { User as UserIcon, Mail, Calendar, Heart, MessageSquare, Settings, LogOut, ChevronRight, Shield, Award, Camera, MapPin, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { translations } from '../translations';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
    lang: string;
}

interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
}

interface Stats {
    favorites: number;
    reviews: number;
}

export default function Profile({ lang }: ProfileProps) {
    const { user: authUser, updatePassword } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<Stats>({ favorites: 0, reviews: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ── Password Reset Flow ──────────────────────────────────────
    const isResetMode = searchParams.get('reset') === 'true';
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetStatus, setResetStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [resetError, setResetError] = useState('');
    
    const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';
    const t = (translations[selectedLang]?.profile || translations.pt.profile) as any;

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            const { data: { session } } = await supabase!.auth.getSession();
            if (!session) {
                // If in reset mode, Supabase may still be processing the token.
                // Wait briefly for onAuthStateChange to fire.
                if (!isResetMode) {
                    navigate('/');
                }
                setLoading(false);
                return;
            }
            setUser(session.user);

            // Fetch profile data
            const { data: profileData } = await supabase!
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData);

            // Fetch stats
            const [favs, revs] = await Promise.all([
                supabase!.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
                supabase!.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id)
            ]);

            setStats({
                favorites: favs.count || 0,
                reviews: revs.count || 0
            });
            setLoading(false);
        };

        fetchUserData();
    }, [navigate, isResetMode]);

    // Use authUser as fallback when user state hasn't been set yet
    useEffect(() => {
        if (authUser && !user) {
            setUser(authUser);
        }
    }, [authUser, user]);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');

        if (newPassword.length < 6) {
            setResetError(selectedLang === 'pt' ? 'A palavra-passe deve ter pelo menos 6 caracteres.' : 'Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setResetError(selectedLang === 'pt' ? 'As palavras-passe não coincidem.' : 'Passwords do not match.');
            return;
        }

        setResetStatus('submitting');
        try {
            const result = await updatePassword(newPassword);
            if (result.error) {
                setResetError(typeof result.error === 'string' ? result.error : result.error.message || (selectedLang === 'pt' ? 'Erro ao atualizar.' : 'Update failed.'));
                setResetStatus('error');
            } else {
                setResetStatus('success');
                setTimeout(() => {
                    navigate('/perfil', { replace: true });
                }, 2000);
            }
        } catch (err: any) {
            setResetError(err?.message || (selectedLang === 'pt' ? 'Erro inesperado.' : 'Unexpected error.'));
            setResetStatus('error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="relative w-16 h-16">
                     <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                     <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    // ── Password Reset UI ────────────────────────────────────────
    if (isResetMode) {
        return (
            <div className="min-h-screen bg-bg pt-40 pb-24 selection:bg-primary/20">
                <Helmet>
                    <title>{selectedLang === 'pt' ? 'Nova Palavra-passe' : 'New Password'} | Locais de Moz</title>
                </Helmet>

                <div className="max-w-md mx-auto px-6">
                    <div className="bg-surface rounded-[3.5rem] p-10 md:p-14 border border-border-subtle shadow-premium relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-[80px] -mr-30 -mt-30" />

                        <div className="text-center mb-8 relative z-10">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-primary-glow">
                                <Lock size={26} />
                            </div>
                            <h1 className="text-3xl font-display font-black italic text-text-main mb-2 tracking-tighter uppercase">
                                {selectedLang === 'pt' ? 'Nova Palavra-passe' : 'New Password'}
                            </h1>
                            <p className="text-xs text-text-dim font-bold italic opacity-70 uppercase tracking-widest">
                                {selectedLang === 'pt' ? 'Defina a sua nova palavra-passe' : 'Set your new password'}
                            </p>
                        </div>

                        {resetStatus === 'success' ? (
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <p className="text-sm font-black text-green-600 uppercase tracking-tight text-center">
                                    {selectedLang === 'pt' ? 'Palavra-passe actualizada com sucesso!' : 'Password updated successfully!'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordReset} className="space-y-5 relative z-10">
                                <div className="space-y-1.5">
                                    <label htmlFor="new-password" className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim/60 px-1 ml-0.5 block">
                                        {selectedLang === 'pt' ? 'Nova Palavra-passe' : 'New Password'}
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            id="new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="w-full h-14 pl-12 pr-4 rounded-xl glass border border-border-subtle focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold text-sm"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="confirm-password" className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim/60 px-1 ml-0.5 block">
                                        {selectedLang === 'pt' ? 'Confirmar Palavra-passe' : 'Confirm Password'}
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full h-14 pl-12 pr-4 rounded-xl glass border border-border-subtle focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold text-sm"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                {resetError && (
                                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                                        <p className="text-[11px] font-black uppercase tracking-tighter text-red-600 leading-tight">{resetError}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={resetStatus === 'submitting'}
                                    className="w-full bg-text-main text-surface h-16 rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-premium hover:shadow-primary-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 duration-300"
                                >
                                    {resetStatus === 'submitting' ? (
                                        <div className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                                    ) : (
                                        <Lock size={18} />
                                    )}
                                    {selectedLang === 'pt' ? 'Actualizar Palavra-passe' : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const initials = user.email?.substring(0, 2).toUpperCase() || 'LM';
    const rawJoinDate = new Date(user.created_at);
    const joinDate = rawJoinDate.toLocaleDateString(selectedLang === 'pt' ? 'pt-PT' : 'en-US', {
        month: 'long',
        year: 'numeric'
    });

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-bg pt-40 pb-24 selection:bg-primary/20">
            <Helmet>
                <title>{t.title} | Locais de Moz</title>
            </Helmet>

            <div className="max-w-5xl mx-auto px-6">
                {/* Profile Identity Bar */}
                <div className="relative mb-12 blog-post-reveal">
                    <div className="bg-surface rounded-[3.5rem] p-10 md:p-14 border border-border-subtle shadow-premium relative overflow-hidden group">
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-moz-green/5 rounded-full blur-[80px] -ml-30 -mb-30" />
                        
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                            {/* Avatar Section */}
                            <div className="relative flex-shrink-0">
                                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[3.5rem] bg-primary/10 flex items-center justify-center text-primary text-5xl md:text-6xl font-display font-black border-4 border-surface shadow-premium overflow-hidden group-hover:rotate-3 transition-all duration-700">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="italic uppercase tracking-tighter">{initials}</span>
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-text-main text-surface rounded-2xl flex items-center justify-center shadow-premium hover:bg-primary hover:scale-110 transition-all border-4 border-surface">
                                    <Camera size={20} />
                                </button>
                            </div>
                            
                            {/* Info Section */}
                            <div className="text-center md:text-left flex-1 py-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-text-main italic uppercase leading-none">
                                        {profile?.full_name || user.email?.split('@')[0]}
                                    </h1>
                                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 w-fit mx-auto md:mx-0">
                                        <Award size={14} className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Explorador Gold</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-text-dim/60 font-black text-[10px] uppercase tracking-[0.2em] italic">
                                    <span className="flex items-center gap-2.5">
                                        <Mail size={16} className="text-primary/50" /> {user.email}
                                    </span>
                                    <span className="flex items-center gap-2.5">
                                        <MapPin size={16} className="text-primary/50" /> Moçambique
                                    </span>
                                    <span className="flex items-center gap-2.5">
                                        <Calendar size={16} className="text-primary/50" /> {t.joined} {joinDate}
                                    </span>
                                </div>
                            </div>

                            {/* Logout Action */}
                            <button 
                                onClick={handleLogout}
                                className="group bg-red-500/10 text-red-600 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center gap-3 active:scale-95 duration-300 italic"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> {t.logout}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 reveal">
                    <Link to="/favoritos" className="bg-surface p-10 rounded-[3rem] border border-border-subtle shadow-premium hover:border-primary/50 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Heart size={32} fill={stats.favorites > 0 ? 'currentColor' : 'none'} strokeWidth={2.5} />
                            </div>
                            <ChevronRight size={24} className="text-text-dim/20 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-7xl font-display font-black text-text-main leading-none mb-4 italic tracking-tighter relative z-10">{stats.favorites}</p>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-text-dim/60 italic relative z-10">{t.favorites}</p>
                    </Link>

                    <div className="bg-surface p-10 rounded-[3rem] border border-border-subtle shadow-premium hover:border-accent/50 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-16 h-16 bg-accent/10 rounded-[1.5rem] flex items-center justify-center text-accent mb-8 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                            <MessageSquare size={32} strokeWidth={2.5} />
                        </div>
                        <p className="text-7xl font-display font-black text-text-main leading-none mb-4 italic tracking-tighter relative z-10">{stats.reviews}</p>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-text-dim/60 italic relative z-10">{t.reviews}</p>
                    </div>
                </div>

                {/* Settings & Management Portal */}
                <div className="space-y-6 reveal">
                    <div className="bg-surface rounded-[3.5rem] border border-border-subtle overflow-hidden shadow-premium">
                        <div className="p-10 border-b border-border-subtle bg-primary/5 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                    <Settings size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary italic">
                                    {t.settings}
                                </h3>
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-text-dim/40 italic">Portal de Controlo</span>
                        </div>
                        
                        <div className="divide-y divide-border-subtle/30 px-6">
                            {[
                                { icon: UserIcon, title: t.personal_info, desc: selectedLang === 'pt' ? 'Nome, Identidade e Idioma' : 'Name, Identity and Language', label: 'Geral' },
                                { icon: Shield, title: t.security, desc: selectedLang === 'pt' ? 'Palavra-passe e Sessões Ativas' : 'Password and Active Sessions', label: 'Privacidade' }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-8 md:p-10 hover:bg-primary/5 transition-all duration-300 group rounded-[2rem] my-2">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border-subtle flex items-center justify-center text-text-dim group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                                            <item.icon size={26} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-2xl font-display font-black text-text-main italic uppercase tracking-tight group-hover:text-primary transition-colors leading-none mb-2">{item.title}</p>
                                            <p className="text-[10px] text-text-dim/60 uppercase font-black tracking-widest italic">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-text-dim/30 opacity-0 group-hover:opacity-100 transition-opacity italic">{item.label}</span>
                                        <ChevronRight size={22} className="text-text-dim/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Account Deletion Area (Secondary) */}
                <div className="mt-16 flex justify-center reveal">
                     <button className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500/40 hover:text-red-500 transition-colors italic border-b border-transparent hover:border-red-500/20 pb-1">
                        {selectedLang === 'pt' ? 'Apagar Conta Permanentemente' : 'Delete Account Permanently'}
                     </button>
                </div>
            </div>
        </div>
    );
}
