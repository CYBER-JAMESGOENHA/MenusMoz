import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Calendar, Heart, MessageSquare, Settings, LogOut, ChevronRight, Shield } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { translations } from '../translations';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile({ lang }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ favorites: 0, reviews: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const t = translations[lang]?.profile ?? {
        title: 'O Meu Perfil',
        subtitle: 'Gere a tua conta e preferências',
        joined: 'Membro desde',
        favorites: 'Favoritos',
        reviews: 'Avaliações',
        settings: 'Definições',
        logout: 'Sair da Conta',
        security: 'Segurança',
        personal_info: 'Informação Pessoal',
        no_reviews: 'Ainda não publicaste nenhuma avaliação.',
        no_favorites: 'Ainda não tens restaurantes favoritos.'
    };

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/');
                return;
            }
            setUser(session.user);

            // Fetch profile data
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData);

            // Fetch stats
            const [favs, revs] = await Promise.all([
                supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
                supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id)
            ]);

            setStats({
                favorites: favs.count || 0,
                reviews: revs.count || 0
            });
            setLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const initials = user.email?.substring(0, 2).toUpperCase() || 'U';
    const joinDate = new Date(user.created_at).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-bg pt-32 pb-20">
            <Helmet>
                <title>{t.title} | MenusMoz</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-4">
                {/* Header Card */}
                <div className="bg-surface rounded-[2.5rem] p-8 md:p-12 border border-border-subtle shadow-premium mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary text-4xl font-black border-2 border-primary/20 shadow-lg">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-[2rem]" />
                            ) : initials}
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-text-main italic mb-2">
                                {profile?.full_name || user.email?.split('@')[0]}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-text-dim font-bold text-sm">
                                <span className="flex items-center gap-1.5 bg-surface-alt px-3 py-1 rounded-full border border-border-subtle">
                                    <Mail size={14} className="text-primary" /> {user.email}
                                </span>
                                <span className="flex items-center gap-1.5 bg-surface-alt px-3 py-1 rounded-full border border-border-subtle">
                                    <Calendar size={14} className="text-primary" /> {t.joined} {joinDate}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
                            className="bg-red-500/10 text-red-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                        >
                            <LogOut size={16} /> {t.logout}
                        </button>
                    </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link to="/favoritos" className="bg-surface p-6 rounded-[2rem] border border-border-subtle shadow-sm hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Heart size={24} fill={stats.favorites > 0 ? 'currentColor' : 'none'} />
                            </div>
                            <ChevronRight size={20} className="text-text-dim/30 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-3xl font-black text-text-main leading-none mb-1">{stats.favorites}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-text-dim">{t.favorites}</p>
                    </Link>

                    <div className="bg-surface p-6 rounded-[2rem] border border-border-subtle shadow-sm">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4">
                            <MessageSquare size={24} />
                        </div>
                        <p className="text-3xl font-black text-text-main leading-none mb-1">{stats.reviews}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-text-dim">{t.reviews}</p>
                    </div>
                </div>

                {/* Settings & Info Sections */}
                <div className="space-y-4">
                    <div className="bg-surface rounded-3xl border border-border-subtle overflow-hidden">
                        <div className="p-6 border-b border-border-subtle bg-primary/5">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <Settings size={14} /> {t.settings}
                            </h3>
                        </div>
                        <div className="divide-y divide-border-subtle/50">
                            <button className="w-full flex items-center justify-between p-6 hover:bg-primary/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center text-text-dim group-hover:text-primary transition-colors">
                                        <User size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-text-main">{t.personal_info}</p>
                                        <p className="text-[10px] text-text-dim uppercase font-black tracking-widest">Nome, Foto, Idioma</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-text-dim/30" />
                            </button>

                            <button className="w-full flex items-center justify-between p-6 hover:bg-primary/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center text-text-dim group-hover:text-primary transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-text-main">{t.security}</p>
                                        <p className="text-[10px] text-text-dim uppercase font-black tracking-widest">Palavra-passe, Sessões</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-text-dim/30" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
