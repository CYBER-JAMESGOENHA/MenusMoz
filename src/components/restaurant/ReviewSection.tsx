import React, { useState, useCallback } from 'react';
import { Star, Send, LogIn, ThumbsUp, CheckCircle2, Users } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Review {
    id: string | number;
    rating: number;
    comment: string;
    userName?: string;
    avatar?: string;
    profiles?: {
        full_name?: string;
        avatar_url?: string;
    };
}

interface StarPickerProps {
    rating: number;
    onChange: (rating: number) => void;
    disabled?: boolean;
}

const StarPicker: React.FC<StarPickerProps> = ({ rating, onChange, disabled }) => (
    <div className="flex items-center gap-1" role="group" aria-label="Escolha uma avaliação">
        {[1, 2, 3, 4, 5].map(n => (
            <button
                key={n}
                type="button"
                disabled={disabled}
                onClick={() => onChange(n)}
                aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
                className="transition-transform duration-150 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
                <Star
                    size={28}
                    className={n <= rating ? 'text-accent fill-accent' : 'text-text-dim/20'}
                />
            </button>
        ))}
    </div>
);

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const stars = Math.round(review.rating ?? 5);
    const initials = (review.userName || review.profiles?.full_name || 'U').substring(0, 2).toUpperCase();
    const displayName = review.userName || review.profiles?.full_name || 'Utilizador';
    const avatarUrl = review.avatar || review.profiles?.avatar_url;

    return (
        <div className="bg-surface border border-border-subtle rounded-[2rem] p-8 flex flex-col gap-6 hover:shadow-premium transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                    {avatarUrl ? (
                        <div className="relative">
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                                <CheckCircle2 size={10} />
                            </div>
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg border border-primary/20 shadow-sm relative">
                            {initials}
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                                <CheckCircle2 size={10} />
                            </div>
                        </div>
                    )}
                    <div>
                        <p className="font-black text-text-main text-base uppercase tracking-tight italic">{displayName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-green-600 font-black uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                                Diner Verificado
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 bg-accent/5 px-2.5 py-1.5 rounded-xl border border-accent/10">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={12} className={i <= stars ? 'text-accent fill-accent' : 'text-text-dim/20'} />
                    ))}
                </div>
            </div>
            
            <div className="relative">
                <p className="text-text-dim text-base leading-relaxed italic font-medium relative z-10">
                    "{review.comment}"
                </p>
            </div>

            {/* Simulated Owner Response */}
            {review.id === (typeof review.id === 'number' ? review.id : 0) && (
                <div className="mt-2 pl-6 border-l-2 border-primary/20 py-2 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Users size={12} /> Resposta do Proprietário
                    </p>
                    <p className="text-sm text-text-dim/80 font-medium italic">
                        "Obrigado pela sua visita e pelo feedback positivo. Esperamos vê-lo(a) novamente em breve!"
                    </p>
                </div>
            )}
        </div>
    );
};

interface ReviewSectionProps {
    restaurant: any;
    user: User | null;
    lang: string;
    t: any;
    onLoginOpen: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ restaurant, user, lang, t, onLoginOpen }) => {
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [localReviews, setLocalReviews] = useState<Review[]>(restaurant.reviews ?? []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || userRating === 0 || !comment.trim()) return;
        setStatus('submitting');

        const newReviewData = {
            restaurant_id: restaurant.id,
            user_id: user.id,
            rating: userRating,
            comment: comment.trim(),
        };

        // Optimistic add
        const optimistic: Review = {
            id: Date.now(),
            rating: userRating,
            comment: comment.trim(),
            userName: (user.user_metadata as any)?.full_name || user.email?.split('@')[0] || 'Eu',
            avatar: (user.user_metadata as any)?.avatar_url,
        };
        
        setLocalReviews(prev => [optimistic, ...prev]);
        setComment('');
        setUserRating(0);

        if (isSupabaseConfigured && supabase) {
            const { error } = await supabase
                .from('reviews')
                .insert([newReviewData]);

            if (error) {
                console.error('Review submit error:', error);
                setLocalReviews(prev => prev.filter(r => r.id !== optimistic.id));
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
                return;
            }
        }

        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
    }, [user, userRating, comment, restaurant.id]);

    const avgRating = localReviews.length > 0
        ? (localReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / localReviews.length).toFixed(1)
        : null;

    return (
        <div className="mt-16 pt-12 border-t-2 border-border-subtle/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-text-main italic uppercase leading-none">
                        {t.reviews_title ?? 'O que dizem os clientes'}
                    </h2>
                    {avgRating && (
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-xl border border-accent/20">
                                <span className="text-lg font-black text-accent leading-none">{avgRating}</span>
                                <div className="flex items-center">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={14} className={i <= Math.round(Number(avgRating)) ? 'text-accent fill-accent' : 'text-text-dim/20'} />
                                    ))}
                                </div>
                            </div>
                            <span className="text-xs font-black text-text-dim uppercase tracking-widest pl-2 border-l-2 border-border-subtle">
                                {localReviews.length} avaliações
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Write Review Form */}
            <div className="glass rounded-[2rem] p-8 mb-12 border border-border-subtle shadow-premium">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Send size={20} />
                    </div>
                    <h3 className="font-black text-lg text-text-main uppercase tracking-tighter italic">
                        {t.write_review ?? 'Escrever Avaliação'}
                    </h3>
                </div>

                {!user ? (
                    <button
                        onClick={onLoginOpen}
                        className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 shadow-primary-glow hover:scale-[1.02] active:scale-95"
                    >
                        <LogIn size={18} />
                        {t.review_login ?? 'Inicie sessão para avaliar'}
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-dim/70 ml-1">Sua Pontuação</p>
                            <StarPicker
                                rating={userRating}
                                onChange={setUserRating}
                                disabled={status === 'submitting'}
                            />
                        </div>
                        
                        <div className="relative group">
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder={t.review_placeholder ?? 'Partilhe a sua experiência...'}
                                disabled={status === 'submitting'}
                                rows={4}
                                className="w-full bg-surface/50 border-2 border-border-subtle rounded-2xl px-5 py-4 text-sm text-text-main font-bold placeholder:text-text-dim/40 outline-none focus:border-primary transition-all duration-300 resize-none group-hover:border-primary/30"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={status === 'submitting' || userRating === 0 || !comment.trim()}
                                className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 h-14 active:scale-95 transition-all duration-300 shadow-primary-glow disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {status === 'submitting' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                                {status === 'submitting' ? 'A publicar...' : (t.review_submit ?? 'Publicar Avaliação')}
                            </button>
                            
                            {status === 'success' && (
                                <div className="flex items-center gap-2 text-primary font-black text-sm animate-bounce">
                                    <ThumbsUp size={18} />
                                    {t.review_thanks ?? 'Obrigado!'}
                                </div>
                            )}
                            
                            {status === 'error' && (
                                <span className="text-red-500 font-black text-sm uppercase tracking-tighter">
                                    {t.review_error ?? 'Erro. Tente novamente.'}
                                </span>
                            )}
                        </div>
                    </form>
                )}
            </div>

            {/* Existing Reviews */}
            {localReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {localReviews.map((review, idx) => (
                        <ReviewCard key={review.id ?? idx} review={review} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center glass rounded-[2.5rem] border-2 border-dashed border-border-subtle/50">
                    <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent/10">
                        <Star size={32} className="text-accent/30" />
                    </div>
                    <p className="font-black text-text-dim text-lg italic uppercase tracking-tighter leading-none">
                        {lang === 'pt' ? 'Seja o primeiro a avaliar!' : 'Be the first to review!'}
                    </p>
                    <p className="text-text-dim/50 text-xs font-bold uppercase tracking-widest mt-3">Partilhe o seu sabor com a comunidade</p>
                </div>
            )}
        </div>
    );
};
