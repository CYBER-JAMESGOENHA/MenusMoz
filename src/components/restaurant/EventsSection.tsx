import React from 'react';
import { Calendar, Music, Clock, Star, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface EventsSectionProps {
    restaurant: any;
    lang: string;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    const events = restaurant.events || [];
    const specials = restaurant.specials || [];

    return (
        <div className="space-y-10 lg:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- UPCOMING EVENTS --- */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-5xl lg:text-6xl font-display font-black text-text-main italic uppercase tracking-tighter leading-none">
                            {isEn ? 'Events & Nights' : 'Eventos & Noites'}
                        </h2>
                        <p className="text-text-dim text-sm font-bold uppercase tracking-widest mt-4">Experiências vibrantes para todos</p>
                    </div>
                </div>

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.map((event: any) => (
                            <div key={event.id} className="group bg-surface rounded-3xl md:rounded-[2.5rem] border border-border-subtle overflow-hidden flex flex-col hover:shadow-premium transition-all duration-500">
                                <div className="aspect-[16/9] relative overflow-hidden">
                                    <img 
                                        src={event.image_url || "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?w=1200&q=80"} 
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                            {event.is_recurring ? (isEn ? 'Weekly' : 'Semanal') : (isEn ? 'One-time' : 'Único')}
                                        </div>
                                    </div>
                                    {event.event_date && (
                                        <div className="absolute bottom-6 left-6 bg-primary text-white p-3 rounded-2xl flex flex-col items-center justify-center min-w-[64px] shadow-primary-glow">
                                            <span className="text-lg font-black leading-none">
                                                {new Date(event.event_date).getDate()}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {new Date(event.event_date).toLocaleDateString(lang, { month: 'short' })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 md:p-8 space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Music size={18} />
                                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">{event.title}</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-text-main italic uppercase tracking-tighter line-clamp-1">{event.title}</h3>
                                    <p className="text-text-dim text-sm leading-relaxed line-clamp-2">{event.description}</p>
                                    
                                    <div className="pt-4 flex items-center justify-between border-t border-border-subtle/50">
                                        <div className="flex items-center gap-2 text-text-dim/60">
                                            <Clock size={14} />
                                            <span className="font-bold text-[10px] uppercase tracking-widest">{event.event_time || '20:00 - 23:00'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Fallback event cards */}
                         {[
                            { title: isEn ? 'Live Jazz Nights' : 'Noites de Jazz ao Vivo', time: isEn ? 'Thursdays, 19:30' : 'Quintas-feiras, 19:30', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?w=800&q=80', desc: isEn ? 'Relax with the city\'s finest jazz and our gourmet tapas.' : 'Desfrute de uma noite relaxante com o melhor do jazz local enquanto saboreia as nossas especialidades.' },
                            { title: isEn ? 'Sunday Brunch' : 'Brunch de Domingo', time: isEn ? 'Sundays, 11:00 - 15:00' : 'Domingos, 11:00 - 15:00', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80', desc: isEn ? 'The most complete buffet with ambient music and bottomless mimosas.' : 'O buffet mais completo da cidade com música ambiente e mimosas ilimitadas.' }
                         ].map((ev, i) => (
                            <div key={i} className="group bg-surface rounded-3xl md:rounded-[2.5rem] border border-border-subtle overflow-hidden flex flex-col hover:shadow-premium transition-all duration-500">
                                <div className="aspect-[16/9] relative overflow-hidden bg-bg">
                                     <img src={ev.img} alt={ev.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                                     <div className="absolute top-6 left-6 bg-primary text-white px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                         Em Destaque
                                     </div>
                                </div>
                                <div className="p-6 md:p-8 space-y-4">
                                    <h3 className="text-2xl font-display font-black text-text-main italic uppercase tracking-tighter">{ev.title}</h3>
                                    <p className="text-text-dim text-sm leading-relaxed">{ev.desc}</p>
                                    <div className="pt-4 flex items-center justify-between border-t border-border-subtle/50">
                                        <div className="flex items-center gap-2 text-text-dim/60 font-bold text-[10px] uppercase tracking-widest">
                                            <Clock size={14} /> {ev.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         ))}
                    </div>
                )}
            </section>

            {/* --- SPECIALS & PROMOS --- */}
            <section className="bg-black text-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-16 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="relative z-10 space-y-10">
                    <div>
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Sparkles size={20} />
                            <span className="font-black text-xs uppercase tracking-[0.4em] italic">Especiais da Semana</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-black italic uppercase tracking-tighter leading-tight">Happy Hour & Sabores Atemporais</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {specials.length > 0 ? (
                            specials.map((special: any) => (
                                <div key={special.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] space-y-4 hover:border-primary/50 transition-colors">
                                    <h4 className="text-xl font-display font-black italic uppercase tracking-tighter">{special.title}</h4>
                                    <p className="text-white/50 text-sm leading-relaxed">{special.description}</p>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{special.valid_hours}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">{special.valid_days.join(', ')}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Fallback specials
                            [
                                { title: 'Happy Hour Cocktails', desc: '50% de desconto em todos os cocktails de assinatura e cerveja local.', hours: '17:00 - 19:00', days: 'Segunda a Sexta' },
                                { title: 'Noite de Mariscos', desc: 'Platô de marisco para dois com garrafa de vinho branco incluída.', hours: 'Toda a noite', days: 'Quartas-feiras' },
                                { title: 'Menu Executivo', desc: 'Entrada, prato principal e café por um preço fixo premium.', hours: '12:00 - 15:00', days: 'Dias úteis' }
                            ].map((s, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] space-y-4 hover:border-primary/20 transition-colors">
                                    <h4 className="text-xl font-display font-black italic uppercase tracking-tighter">{s.title}</h4>
                                    <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{s.hours}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">{s.days}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
