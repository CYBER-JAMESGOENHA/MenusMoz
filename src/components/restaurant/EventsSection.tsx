import React from 'react';
import { Music, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface EventsSectionProps {
    restaurant: any;
    lang: string;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    const events = restaurant.events || [];
    const specials = restaurant.specials || [];

    return (
        <div className="space-y-10">
            {/* Compact Upcoming Events */}
            {events.length > 0 && (
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-xl md:text-2xl font-display font-black text-text-main italic uppercase tracking-tighter leading-none">
                                {isEn ? 'Events' : 'Eventos'}
                            </h2>
                            <p className="text-text-dim text-[10px] font-black uppercase tracking-widest mt-2">{isEn ? 'Upcoming experiences' : 'Experiências'}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                        {events.map((event: any, i: number) => (
                            <div key={i} className="flex-none w-[240px] bg-surface border border-border-subtle rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                                <div className="relative h-36 overflow-hidden">
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {event.event_date && (
                                        <div className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1.5 rounded-xl text-center shadow-lg">
                                            <span className="text-sm font-black block leading-none">{new Date(event.event_date).getDate()}</span>
                                            <span className="text-[8px] font-black uppercase tracking-wider">{new Date(event.event_date).toLocaleDateString(lang, { month: 'short' })}</span>
                                        </div>
                                    )}
                                    {event.is_recurring && (
                                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                                            {isEn ? 'Weekly' : 'Semanal'}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">{event.title}</p>
                                    <h3 className="text-sm font-bold text-text-main leading-tight line-clamp-1">{event.title}</h3>
                                    <p className="text-text-dim text-xs line-clamp-2 leading-relaxed">{event.description}</p>
                                    <div className="flex items-center gap-1.5 text-text-dim/60 pt-1">
                                        <Clock size={11} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{event.event_time || '20:00'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Specials — Compact Dark Banner */}
            {specials.length > 0 && (
                <section className="bg-text-main text-surface rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-primary">{isEn ? 'Weekly Specials' : 'Especiais da Semana'}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {specials.map((special: any, i: number) => (
                                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:border-primary/30 transition-colors">
                                    <h4 className="text-base font-display font-black italic uppercase tracking-tighter mb-2">{special.title}</h4>
                                    <p className="text-surface/50 text-xs leading-relaxed line-clamp-2">{special.description}</p>
                                    <div className="pt-3 border-t border-white/10 mt-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{special.valid_hours}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-0.5">{special.valid_days?.join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
