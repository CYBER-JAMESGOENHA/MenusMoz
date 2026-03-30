import React, { useState, useCallback } from 'react';
import { Star, Send, LogIn, ThumbsUp } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const StarPicker = ({ rating, onChange, disabled }) => (
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

const ReviewCard = ({ review }) => {
    const stars = Math.round(review.rating ?? 5);
    const initials = (review.userName || 'U').substring(0, 2).toUpperCase();

    return (
        <div className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {review.avatar ? (
                        <img
                            src={review.avatar}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-text-main text-sm">{review.userName || 'Utilizador'}</p>
                        <p className="text-[10px] text-text-dim/50 font-medium uppercase tracking-wider">
                            Cliente Verificado
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={12} className={i <= stars ? 'text-accent fill-accent' : 'text-text-dim/20'} />
                    ))}
                </div>
            </div>
            <p className="text-text-dim text-sm leading-relaxed italic">"{review.comment}"</p>
        </div>
    );
};

export const ReviewSection = ({ restaurant, user, lang, t, onLoginOpen }) => {
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [localReviews, setLocalReviews] = useState(restaurant.reviews ?? []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!user || userRating === 0 || !comment.trim()) return;
        setStatus('submitting');

        const newReview = {
            restaurant_id: restaurant.id,
            user_id: user.id,
            rating: userRating,
            comment: comment.trim(),
        };

        // Optimistic add
        const optimistic = {
            ...newReview,
            id: Date.now(),
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Eu',
            avatar: user.user_metadata?.avatar_url,
        };
        setLocalReviews(prev => [optimistic, ...prev]);
        setComment('');
        setUserRating(0);

        if (isSupabaseConfigured) {
            const { error } = await supabase
                .from('reviews')
                .insert([newReview]);

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
        <div className="mt-12 pt-10 border-t border-border-subtle">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-display font-black tracking-tighter text-text-main italic">
                        {t.reviews_title ?? 'O que dizem os clientes'}
                    </h2>
                    {avgRating && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <Star key={i} size={14} className={i <= Math.round(Number(avgRating)) ? 'text-accent fill-accent' : 'text-text-dim/20'} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-text-main">{avgRating}</span>
                            <span className="text-xs text-text-dim">({localReviews.length} avaliações)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Write Review Form */}
            <div className="glass rounded-2xl p-6 mb-8 border border-border-subtle">
                <h3 className="font-black text-base text-text-main mb-4 uppercase tracking-wider">
                    {t.write_review ?? 'Escrever Avaliação'}
                </h3>

                {!user ? (
                    <button
                        onClick={onLoginOpen}
                        className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 border border-primary/20"
                    >
                        <LogIn size={16} />
                        {t.review_login ?? 'Inicie sessão para avaliar'}
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <StarPicker
                            rating={userRating}
                            onChange={setUserRating}
                            disabled={status === 'submitting'}
                        />
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder={t.review_placeholder ?? 'Partilhe a sua experiência...'}
                            disabled={status === 'submitting'}
                            rows={3}
                            className="w-full bg-bg border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-main font-medium placeholder:text-text-dim/50 outline-none focus:border-primary transition-colors duration-200 resize-none"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={status === 'submitting' || userRating === 0 || !comment.trim()}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black text-sm hover:brightness-110 active:scale-95 transition-all duration-200 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                <Send size={15} />
                                {status === 'submitting' ? 'A publicar...' : (t.review_submit ?? 'Publicar Avaliação')}
                            </button>
                            {status === 'success' && (
                                <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-pulse">
                                    <ThumbsUp size={15} />
                                    {t.review_thanks ?? 'Obrigado!'}
                                </div>
                            )}
                            {status === 'error' && (
                                <span className="text-red-500 font-bold text-sm">
                                    {t.review_error ?? 'Erro. Tente novamente.'}
                                </span>
                            )}
                        </div>
                    </form>
                )}
            </div>

            {/* Existing Reviews */}
            {localReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {localReviews.map((review, idx) => (
                        <ReviewCard key={review.id ?? idx} review={review} />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center glass rounded-2xl border border-border-subtle">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Star size={28} className="text-accent" />
                    </div>
                    <p className="font-bold text-text-dim text-sm">
                        {lang === 'pt' ? 'Seja o primeiro a avaliar este restaurante!' : 'Be the first to review this restaurant!'}
                    </p>
                </div>
            )}
        </div>
    );
};
