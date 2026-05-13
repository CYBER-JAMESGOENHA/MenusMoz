import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
    User as UserIcon, Mail, Calendar, Heart, MessageSquare, Settings, LogOut, 
    ChevronRight, Shield, Award, Camera, MapPin, Lock, CheckCircle, 
    AlertCircle, CreditCard, Receipt, Download, Compass, Bookmark, 
    Clock, Utensils, Zap, Share2, Edit3, Bell, Grid, List, X, Loader2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { translations } from '../translations';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/ui/RestaurantCard';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

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
    collections: number;
    points: number;
}

export default function Profile({ lang }: ProfileProps) {
    const { user: authUser, updatePassword: updatePasswordFn } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<Stats>({ favorites: 0, reviews: 0, collections: 2, points: 1250 });
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Edit Profile States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        phone: ''
    });

    // Dynamic Data States
    const [activities, setActivities] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);

    const modalRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

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
                if (!isResetMode) navigate('/');
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
            
            if (profileData) {
                setProfile(profileData);
                setEditForm({
                    full_name: profileData.full_name || '',
                    phone: profileData.phone || ''
                });
            }

            // Fetch favorites with restaurant details
            const { data: favsData } = await supabase!
                .from('favorites')
                .select('created_at, restaurant_id, restaurants(*)')
                .eq('user_id', session.user.id);
            
            let restaurants: any[] = [];
            if (favsData) {
                restaurants = favsData.map(f => f.restaurants).filter(Boolean);
                setFavoriteRestaurants(restaurants);
                setStats(prev => ({ ...prev, favorites: restaurants.length }));
            }

            // Fetch reviews
            const { data: reviewsData, count: revsCount } = await supabase!
                .from('reviews')
                .select('id, created_at, rating, comment, restaurant_id, restaurants(name)', { count: 'exact' })
                .eq('user_id', session.user.id);

            setStats(prev => ({
                ...prev,
                reviews: revsCount || 0
            }));

            // Process Activities
            const allActivities = [
                ...(favsData?.map(f => ({
                    type: 'favorite',
                    title: f.restaurants?.name,
                    date: new Date(f.created_at),
                    detail: selectedLang === 'pt' ? `Adicionou ${f.restaurants?.name} aos favoritos` : `Added ${f.restaurants?.name} to favorites`
                })) || []),
                ...(reviewsData?.map(r => ({
                    type: 'review',
                    title: r.restaurants?.name,
                    date: new Date(r.created_at),
                    detail: selectedLang === 'pt' ? `Publicou uma review de ${r.rating} estrelas` : `Published a ${r.rating} stars review`
                })) || [])
            ].sort((a, b) => b.date.getTime() - a.date.getTime());

            setActivities(allActivities);

            // Calculate Insights
            if (restaurants.length > 0) {
                const cuisines = restaurants.map(r => r.cuisine).filter(Boolean);
                const mostFrequentCuisine = cuisines.sort((a,b) =>
                    cuisines.filter(v => v===a).length - cuisines.filter(v => v===b).length
                ).pop();

                const locations = restaurants.map(r => r.location).filter(Boolean);
                const topLocation = locations.sort((a,b) =>
                    locations.filter(v => v===a).length - locations.filter(v => v===b).length
                ).pop();

                setInsights([
                    { icon: Utensils, label: selectedLang === 'pt' ? 'Cozinha Favorita' : 'Favorite Cuisine', value: mostFrequentCuisine || 'N/A', color: 'from-orange-500/20 to-orange-500/5' },
                    { icon: MapPin, label: selectedLang === 'pt' ? 'Zona Explorada' : 'Explored Area', value: topLocation || 'N/A', color: 'from-blue-500/20 to-blue-500/5' },
                    { icon: Zap, label: selectedLang === 'pt' ? 'Estilo de Vida' : 'Lifestyle Style', value: restaurants.length > 5 ? 'Elite Explorer' : 'Active Foodie', color: 'from-purple-500/20 to-purple-500/5' },
                    { icon: Clock, label: selectedLang === 'pt' ? 'Frequência' : 'Frequency', value: reviewsData && reviewsData.length > 3 ? 'Contributor' : 'Discoverer', color: 'from-emerald-500/20 to-emerald-500/5' },
                ]);
            } else {
                setInsights([
                    { icon: Utensils, label: selectedLang === 'pt' ? 'Cozinha Favorita' : 'Favorite Cuisine', value: '---', color: 'from-orange-500/20 to-orange-500/5' },
                    { icon: MapPin, label: selectedLang === 'pt' ? 'Zona Explorada' : 'Explored Area', value: '---', color: 'from-blue-500/20 to-blue-500/5' },
                    { icon: Zap, label: selectedLang === 'pt' ? 'Estilo de Vida' : 'Lifestyle Style', value: 'Newcomer', color: 'from-purple-500/20 to-purple-500/5' },
                    { icon: Clock, label: selectedLang === 'pt' ? 'Frequência' : 'Frequency', value: 'N/A', color: 'from-emerald-500/20 to-emerald-500/5' },
                ]);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [navigate, isResetMode]);

    useEffect(() => {
        if (authUser && !user) setUser(authUser);
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
            if (!updatePasswordFn) {
                setResetError(selectedLang === 'pt' ? 'Funcionalidade não disponível.' : 'Functionality not available.');
                setResetStatus('error');
                return;
            }
            const result = await updatePasswordFn(newPassword);
            if (result && result.error) {
                setResetError(typeof result.error === 'string' ? result.error : (result.error as any).message || (selectedLang === 'pt' ? 'Erro ao atualizar.' : 'Update failed.'));
                setResetStatus('error');
            } else {
                setResetStatus('success');
                setTimeout(() => navigate('/perfil', { replace: true }), 2000);
            }
        } catch (err: any) {
            setResetError(err?.message || (selectedLang === 'pt' ? 'Erro inesperado.' : 'Unexpected error.'));
            setResetStatus('error');
        }
    };

    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
        navigate('/');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !supabase) return;
        
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editForm.full_name,
                    phone: editForm.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            
            setProfile(prev => prev ? { ...prev, full_name: editForm.full_name } : null);
            toast.success(selectedLang === 'pt' ? 'Perfil actualizado!' : 'Profile updated!');
            setIsEditModalOpen(false);
        } catch (err: any) {
            toast.error(err.message || 'Error updating profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !supabase) return;

        // Validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error(selectedLang === 'pt' ? 'O ficheiro deve ter menos de 2MB' : 'File must be under 2MB');
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
            toast.success(selectedLang === 'pt' ? 'Foto actualizada!' : 'Photo updated!');
        } catch (err: any) {
            toast.error(err.message || 'Error uploading photo');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (isEditModalOpen) {
            const ctx = gsap.context(() => {
                gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                gsap.fromTo(contentRef.current, 
                    { y: 50, opacity: 0, scale: 0.95 }, 
                    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
                );
            });
            return () => ctx.revert();
        }
    }, [isEditModalOpen]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="relative w-16 h-16">
                     <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                     <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (isResetMode) {
        return (
            <div className="min-h-screen bg-[#050505] pt-40 pb-24 selection:bg-primary/20">
                <Helmet><title>{selectedLang === 'pt' ? 'Nova Palavra-passe' : 'New Password'} | Locais de Moz</title></Helmet>
                <div className="max-w-md mx-auto px-6">
                    <div className="bg-[#0A0A0A] rounded-[3.5rem] p-10 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-[80px] -mr-30 -mt-30" />
                        <div className="text-center mb-8 relative z-10">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-primary-glow">
                                <Lock size={26} />
                            </div>
                            <h1 className="text-3xl font-display font-black italic text-white mb-2 tracking-tighter uppercase">
                                {selectedLang === 'pt' ? 'Nova Palavra-passe' : 'New Password'}
                            </h1>
                        </div>

                        {resetStatus === 'success' ? (
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <p className="text-sm font-black text-green-500 uppercase tracking-tight text-center">
                                    {selectedLang === 'pt' ? 'Palavra-passe actualizada com sucesso!' : 'Password updated successfully!'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordReset} className="space-y-5 relative z-10">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-1 ml-0.5 block">
                                        {selectedLang === 'pt' ? 'Nova Palavra-passe' : 'New Password'}
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full h-14 px-6 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all text-white font-bold text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-1 ml-0.5 block">
                                        {selectedLang === 'pt' ? 'Confirmar' : 'Confirm'}
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full h-14 px-6 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all text-white font-bold text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                {resetError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-500 text-[11px] font-black uppercase tracking-tighter">
                                        {resetError}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={resetStatus === 'submitting'}
                                    className="w-full bg-white text-black h-16 rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all disabled:opacity-60"
                                >
                                    {selectedLang === 'pt' ? 'Actualizar' : 'Update'}
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

    const sidebarItems = [
        { id: 'overview', icon: Compass, label: selectedLang === 'pt' ? 'Visão Geral' : 'Overview' },
        { id: 'activity', icon: Clock, label: selectedLang === 'pt' ? 'Actividade' : 'Activity' },
        { id: 'favorites', icon: Heart, label: selectedLang === 'pt' ? 'Favoritos' : 'Favorites' },
        { id: 'collections', icon: Bookmark, label: selectedLang === 'pt' ? 'Colecções' : 'Collections' },
        { id: 'settings', icon: Settings, label: selectedLang === 'pt' ? 'Definições' : 'Settings' },
    ];

    const discoveryInsights = [
        { icon: Utensils, label: 'Cozinha Favorita', value: 'Fusion Mediterrânea', color: 'from-orange-500/20 to-orange-500/5' },
        { icon: MapPin, label: 'Zona Explorada', value: 'Polana Cimento', color: 'from-blue-500/20 to-blue-500/5' },
        { icon: Zap, label: 'Atmosfera Preferida', value: 'Cosy Editorial', color: 'from-purple-500/20 to-purple-500/5' },
        { icon: Clock, label: 'Horas Activas', value: '20:00 - 23:00', color: 'from-emerald-500/20 to-emerald-500/5' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/20">
            <Helmet>
                <title>{t.title} | Locais de Moz</title>
                <style>{`
                    body { background-color: #050505 ! from-black to-[#0A0A0A]; }
                    .profile-sidebar-item { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                    .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
                `}</style>
            </Helmet>

            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 opacity-30" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-moz-green/5 rounded-full blur-[120px] translate-y-1/2 opacity-20" />
                <div className="absolute inset-0 noise-overlay opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-24">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Sidebar Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-32 space-y-2">
                            <div className="mb-10 px-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic mb-1">Discovery</p>
                                <h2 className="text-xl font-display font-black italic tracking-tighter text-white uppercase">Dashboard</h2>
                            </div>
                            
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full profile-sidebar-item flex items-center gap-4 px-6 py-4 rounded-2xl group ${
                                            activeTab === item.id 
                                            ? 'bg-white/5 text-white' 
                                            : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <item.icon size={20} className={`${activeTab === item.id ? 'text-primary' : 'text-current'} transition-colors`} />
                                        <span className="text-[11px] font-black uppercase tracking-widest italic">{item.label}</span>
                                        {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(220,38,38,0.5)]" />}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-12 pt-12 border-t border-white/5 space-y-1">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-4 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group"
                                >
                                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-widest italic">{t.logout}</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        
                        {/* Cinematic Header */}
                        <section className="relative mb-12 rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent z-0" />
                            <div className="absolute inset-0 bg-cover bg-center opacity-20 grayscale scale-110 group-hover:scale-100 transition-transform duration-1000" style={{ backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none' }} />
                            <div className="absolute inset-0 backdrop-blur-3xl z-0" />
                            
                            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
                                {/* Avatar */}
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleAvatarUpload} 
                                    />
                                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] overflow-hidden border-4 border-white/10 shadow-2xl relative">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-7xl font-display font-black italic">
                                                {initials}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {isUploading ? (
                                                <Loader2 size={32} className="text-white animate-spin" />
                                            ) : (
                                                <Camera size={32} className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-primary px-4 py-1.5 rounded-full border-4 border-[#0A0A0A] shadow-xl">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white italic flex items-center gap-2">
                                            <Award size={12} /> Gold
                                        </span>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="text-center md:text-left flex-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                        <h1 className="text-5xl md:text-8xl font-display font-black italic tracking-tighter uppercase leading-none">
                                            {profile?.full_name || user.email?.split('@')[0]}
                                        </h1>
                                        <button 
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
                                        >
                                            <Edit3 size={18} className="text-white/40 group-hover:text-white" />
                                        </button>
                                    </div>
                                    
                                    <p className="text-lg text-white/60 font-medium italic mb-8 max-w-lg">
                                        Entusiasta da gastronomia local, sempre em busca de sabores autênticos e atmosferas que contam histórias.
                                    </p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-8">
                                        {[
                                            { icon: Heart, label: t.favorites, value: stats.favorites },
                                            { icon: MessageSquare, label: 'Reviews', value: stats.reviews },
                                            { icon: List, label: 'Listas', value: stats.collections },
                                            { icon: Zap, label: 'Points', value: stats.points },
                                        ].map((stat, i) => (
                                            <div key={i} className="flex flex-col items-center md:items-start">
                                                <div className="flex items-center gap-2 text-white/40 mb-1">
                                                    <stat.icon size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                                </div>
                                                <span className="text-2xl font-display font-black italic tracking-tighter text-white">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {activeTab === 'overview' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                
                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Reservar Mesa', icon: Calendar, color: 'bg-primary' },
                                        { label: 'Convidar Amigos', icon: Share2, color: 'bg-white/10' },
                                        { label: 'Escrever Review', icon: MessageSquare, color: 'bg-white/10' },
                                        { label: 'Notificações', icon: Bell, color: 'bg-white/10' },
                                    ].map((action, i) => (
                                        <button key={i} className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border border-white/5 transition-all hover:scale-[1.02] active:scale-95 group ${action.color === 'bg-primary' ? 'bg-primary' : 'bg-white/5 hover:bg-white/10'}`}>
                                            <action.icon size={24} className="mb-4 text-white group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic text-center leading-tight">{action.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Discovery Personality */}
                                <div>
                                    <div className="flex items-center justify-between mb-8 px-4">
                                        <h3 className="text-xl font-display font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
                                            <Compass size={24} className="text-primary" /> Discovery Personality
                                        </h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Insights Lifestyle</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {insights.map((insight, i) => (
                                            <div key={i} className={`p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br ${insight.color} backdrop-blur-sm`}>
                                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 mb-6">
                                                    <insight.icon size={20} />
                                                </div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic mb-2">{insight.label}</p>
                                                <p className="text-base font-display font-black italic tracking-tight text-white uppercase">{insight.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    <div className="lg:col-span-2">
                                        <div className="flex items-center justify-between mb-8 px-4">
                                            <h3 className="text-xl font-display font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
                                                <Clock size={24} className="text-primary" /> Actividade Recente
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {activities.slice(0, 5).map((activity, i) => (
                                                <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] flex items-center gap-6 hover:bg-white/[0.05] transition-all group">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                        activity.type === 'favorite' ? 'bg-red-500/10 text-red-500' :
                                                        activity.type === 'review' ? 'bg-moz-yellow/10 text-moz-yellow' :
                                                        'bg-moz-green/10 text-moz-green'
                                                    }`}>
                                                        {activity.type === 'favorite' ? <Heart size={20} /> :
                                                         activity.type === 'review' ? <MessageSquare size={20} /> :
                                                         <MapPin size={20} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{activity.detail}</p>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                                            {activity.date.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={18} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))}
                                            {activities.length === 0 && (
                                                <div className="p-12 text-center text-white/20 italic font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-[2rem]">
                                                    {selectedLang === 'pt' ? 'Sem actividade recente' : 'No recent activity'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Small Sidebar Stats or Progress */}
                                    <div className="space-y-6">
                                        <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic mb-6">Próximo Nível</h4>
                                            <div className="flex justify-between items-end mb-4">
                                                <span className="text-4xl font-display font-black italic text-white leading-none">PLATINUM</span>
                                                <span className="text-sm font-bold text-primary italic">85%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-8">
                                                <div className="h-full bg-primary w-[85%] shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                                            </div>
                                            <p className="text-[10px] text-white/40 font-bold italic">Faltam 250 pontos para desbloquear benefícios exclusivos.</p>
                                        </div>

                                        <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.02]">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic mb-6">Membro Desde</h4>
                                            <p className="text-2xl font-display font-black italic text-white uppercase tracking-tighter mb-2">{joinDate}</p>
                                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] italic">Legacy Explorer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center justify-between mb-12 px-4">
                                    <h3 className="text-3xl font-display font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
                                        <Heart size={32} className="text-primary fill-primary" /> Meus Favoritos
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button className="p-3 bg-white/10 rounded-xl text-white"><Grid size={18} /></button>
                                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 transition-all"><List size={18} /></button>
                                    </div>
                                </div>
                                
                                {favoriteRestaurants.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {favoriteRestaurants.map((restaurant) => (
                                            <RestaurantCard 
                                                key={restaurant.id} 
                                                restaurant={restaurant} 
                                                lang={selectedLang} 
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-32 flex flex-col items-center text-center px-12 glass-card rounded-[3.5rem]">
                                        <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-white/20 mb-8 border border-white/5">
                                            <Heart size={48} strokeWidth={1} />
                                        </div>
                                        <h4 className="text-2xl font-display font-black italic text-white uppercase mb-4 tracking-tighter">Sua lista está vazia</h4>
                                        <p className="text-white/40 max-w-sm mb-12 italic">Comece a explorar Maputo e guarde os seus lugares favoritos para encontrá-los facilmente aqui.</p>
                                        <Link to="/" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] italic shadow-primary-glow hover:scale-105 active:scale-95 transition-all">Explorar Agora</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'activity' && (
                             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center justify-between mb-12 px-4">
                                    <h3 className="text-3xl font-display font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
                                        <Clock size={32} className="text-primary" /> Timeline de Descoberta
                                    </h3>
                                </div>
                                
                                <div className="space-y-8 relative before:absolute before:left-[31px] before:top-4 before:bottom-4 before:w-px before:bg-white/5">
                                    {Object.entries(
                                        activities.reduce((acc: any, activity) => {
                                            const monthYear = activity.date.toLocaleDateString(selectedLang === 'pt' ? 'pt-PT' : 'en-US', { month: 'long', year: 'numeric' });
                                            if (!acc[monthYear]) acc[monthYear] = [];
                                            acc[monthYear].push(activity);
                                            return acc;
                                        }, {})
                                    ).map(([month, items]: [string, any], i) => (
                                        <div key={i} className="relative z-10">
                                            <div className="bg-[#050505] px-4 py-2 w-fit mb-8 ml-10">
                                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic uppercase">{month}</span>
                                            </div>
                                            <div className="space-y-6">
                                                {items.map((item: any, j: number) => (
                                                    <div key={j} className="flex gap-8 group">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-white shadow-xl relative z-20 group-hover:border-primary group-hover:text-primary transition-all duration-500">
                                                            {item.type === 'favorite' ? <Heart size={24} /> :
                                                             item.type === 'review' ? <MessageSquare size={24} /> :
                                                             item.type === 'order' ? <Calendar size={24} /> :
                                                             <Award size={24} />}
                                                        </div>
                                                        <div className="flex-1 pt-2">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="text-xl font-display font-black italic text-white uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                                                <span className="text-[10px] font-black text-white/20 uppercase italic">
                                                                    {item.date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-white/40 italic">{item.detail}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {activities.length === 0 && (
                                        <div className="py-20 text-center">
                                            <p className="text-white/20 font-black uppercase tracking-widest italic">Nenhuma actividade registada</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        )}

                        {activeTab === 'collections' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center justify-between mb-12 px-4">
                                    <h3 className="text-3xl font-display font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
                                        <Bookmark size={32} className="text-primary fill-primary" /> Minhas Colecções
                                    </h3>
                                    <button className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest italic border border-white/5 transition-all">+ Nova Lista</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { name: 'Jantares de Sábado', count: 5, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
                                        { name: 'Vista para o Mar', count: 3, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80' },
                                    ].map((list, i) => (
                                        <div key={i} className="aspect-[16/9] rounded-[3rem] overflow-hidden relative group cursor-pointer border border-white/5">
                                            <img src={list.image} alt={list.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                            <div className="absolute inset-x-10 bottom-10">
                                                <h4 className="text-2xl font-display font-black italic text-white uppercase tracking-tighter mb-2">{list.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">{list.count} Lugares Guardados</p>
                                            </div>
                                            <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                                <ChevronRight size={24} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-8">
                                <div className="flex items-center justify-between mb-12 px-4">
                                    <h3 className="text-3xl font-display font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
                                        <Settings size={32} className="text-primary" /> Definições de Conta
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { icon: UserIcon, title: t.personal_info, desc: selectedLang === 'pt' ? 'Nome, Identidade e Idioma' : 'Name, Identity and Language', label: 'Geral' },
                                        { icon: Shield, title: t.security, desc: selectedLang === 'pt' ? 'Palavra-passe e Sessões Ativas' : 'Password and Active Sessions', label: 'Privacidade' },
                                        { icon: CreditCard, title: 'Pagamentos', desc: 'Métodos de pagamento e facturação', label: 'Financeiro' },
                                        { icon: Bell, title: 'Notificações', desc: 'Alertas de email e notificações in-app', label: 'Comunicação' }
                                    ].map((item, i) => (
                                        <button key={i} className="w-full flex items-center justify-between p-10 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all duration-300 group rounded-[2.5rem]">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                                                    <item.icon size={26} strokeWidth={2} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-2xl font-display font-black text-white italic uppercase tracking-tight group-hover:text-primary transition-colors mb-2 leading-none">{item.title}</p>
                                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest italic">{item.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 opacity-0 group-hover:opacity-100 transition-opacity italic">{item.label}</span>
                                                <ChevronRight size={22} className="text-white/10 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-16 pt-12 border-t border-white/5 flex flex-col items-center gap-8">
                                    <p className="text-[10px] text-white/20 font-bold italic uppercase tracking-widest">Zonade Risco</p>
                                    <button className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500/30 hover:text-red-500 transition-colors italic border-b border-transparent hover:border-red-500/20 pb-1">
                                        {selectedLang === 'pt' ? 'Apagar Conta Permanentemente' : 'Delete Account Permanently'}
                                    </button>
                                </div>
                             </div>
                        )}

                    </main>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div 
                    ref={modalRef}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div 
                        ref={contentRef}
                        className="relative w-full max-w-xl bg-[#0A0A0A] rounded-[3rem] p-12 border border-white/10 shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                        
                        <button 
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-display font-black italic tracking-tighter text-white uppercase mb-2">Editar Perfil</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Personalize a sua identidade digital</p>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-1 block">Nome Completo</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                    <input 
                                        type="text"
                                        value={editForm.full_name}
                                        onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                        className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all text-white font-bold"
                                        placeholder="Seu nome"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-1 block">Telemóvel</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                    <input 
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all text-white font-bold"
                                        placeholder="+258 -- --- ----"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSaving}
                                className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] italic shadow-primary-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        <span>A Guardar...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Guardar Alterações</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
