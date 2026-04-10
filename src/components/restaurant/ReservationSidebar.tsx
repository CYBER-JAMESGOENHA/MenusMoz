import React, { useState } from 'react';
import { 
    MessageCircle, 
    Phone, 
    Star, 
    ChevronDown, 
    Users, 
    Calendar, 
    Clock, 
    CheckCircle2,
    CalendarPlus,
    MapPin,
    Share2
} from 'lucide-react';

interface Review {
    rating: number;
    comment: string;
    userName: string;
}

interface Restaurant {
    name: string;
    whatsapp: string;
    reviews?: Review[];
}

interface ReservationSidebarProps {
    restaurant: Restaurant;
    t: any;
    lang: string;
}

export const ReservationSidebar: React.FC<ReservationSidebarProps> = ({ restaurant, t, lang }) => {
    const [guests, setGuests] = useState(2);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('19:30');
    const [isReserved, setIsReserved] = useState(false);

    const timeSlots = ['12:00', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00'];

    const constructBookingMessage = () => {
        const text = `Olá! Gostaria de solicitar uma reserva:\n\n📍 *Restaurante:* ${restaurant.name}\n👥 *Pessoas:* ${guests}\n📅 *Data:* ${date}\n🕒 *Hora:* ${time}\n\nReserva feita via Locais de Moz.`;
        return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(text)}`;
    };

    const handleReserve = () => {
        setIsReserved(true);
        window.open(constructBookingMessage(), '_blank');
    };

    const handleAddToCalendar = () => {
        const title = `Jantar no ${restaurant.name}`;
        const start = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
        const end = `${date.replace(/-/g, '')}T${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}${time.split(':')[1]}00`;
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=Reserva via Locais de Moz`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Booking Form Card */}
            <div className="bg-surface border border-border-subtle p-8 rounded-[2.5rem] shadow-premium space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl italic uppercase tracking-tighter">Reservar Mesa</h3>
                    <p className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">Escolha os detalhes da sua visita</p>
                </div>

                <div className="space-y-5">
                    {/* Guests & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 ml-1 flex items-center gap-1">
                                <Users size={10} /> Pessoas
                            </label>
                            <div className="flex items-center justify-between bg-bg border border-border-subtle rounded-xl p-2 h-12">
                                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center font-bold">-</button>
                                <span className="font-black text-sm">{guests}</span>
                                <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center font-bold">+</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 ml-1 flex items-center gap-1">
                                <Calendar size={10} /> Data
                            </label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-bg border border-border-subtle rounded-xl px-3 h-12 font-bold text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim/60 ml-1 flex items-center gap-1">
                            <Clock size={10} /> Horários Disponíveis
                        </label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {timeSlots.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={`shrink-0 px-4 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${
                                        time === t 
                                        ? 'bg-primary text-white shadow-lg scale-105' 
                                        : 'bg-bg text-text-dim border border-border-subtle hover:border-primary/40'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reserve Button */}
                    <div className="pt-2">
                        {isReserved ? (
                            <div className="space-y-3">
                                <button 
                                    className="w-full bg-green-500 text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-sm shadow-xl"
                                    disabled
                                >
                                    <CheckCircle2 size={18} /> Resposta Enviada
                                </button>
                                <button 
                                    onClick={handleAddToCalendar}
                                    className="w-full bg-surface text-text-main border border-border-subtle h-12 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-bg transition-all"
                                >
                                    <CalendarPlus size={14} /> Adicionar ao Calendário
                                </button>
                                <p className="text-[9px] text-center text-text-dim font-medium italic mt-2 opacity-60">O restaurante entrará em contacto para confirmar.</p>
                            </div>
                        ) : (
                            <button 
                                onClick={handleReserve}
                                className="w-full bg-primary text-white h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-primary-glow hover:scale-[1.02] active:scale-95 transition-all group"
                            >
                                <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" /> Reservar Mesa
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Review snippet */}
            {restaurant.reviews && restaurant.reviews.length > 0 && !isReserved && (
                <div className="bg-surface border border-border-subtle p-8 rounded-[2.5rem] shadow-premium relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full -mr-8 -mt-8" />
                    <div className="flex items-center gap-2 mb-4 text-accent relative z-10 bg-accent/5 w-fit px-2.5 py-1 rounded-xl border border-accent/10">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i <= Math.round(restaurant.reviews![0].rating ?? 5) ? 'currentColor' : 'none'}
                                    className={i <= Math.round(restaurant.reviews![0].rating ?? 5) ? 'text-accent' : 'text-text-dim/20'}
                                />
                            ))}
                        </div>
                        <span className="ml-1.5 font-black text-base text-text-main leading-none">{(restaurant.reviews[0].rating ?? 5).toFixed(1)}</span>
                    </div>
                    <p className="italic text-lg mb-6 text-text-main relative z-10 leading-relaxed font-display font-medium tracking-tight">
                        "{restaurant.reviews[0].comment}"
                    </p>
                    <div className="flex items-center gap-3 relative z-10 border-t border-border-subtle pt-5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[9px] border border-primary/20 uppercase tracking-tighter">
                            {restaurant.reviews[0].userName.substring(0, 2)}
                        </div>
                        <p className="font-black uppercase text-[9px] tracking-[0.2em] text-text-dim/60">
                            {restaurant.reviews[0].userName} • {lang === 'pt' ? 'Verificado' : 'Verified'}
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile scroll hint */}
            <div className="flex flex-col items-center gap-2 text-text-dim/30 lg:hidden py-12">
                <ChevronDown size={18} className="animate-bounce" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black">{t.scroll_more}</span>
            </div>
        </div>
    );
};

interface MobileReservationBarProps {
    restaurant: Restaurant;
    t: any;
}

/** Fixed bottom bar with action rail — mobile only */
export const MobileReservationBar: React.FC<MobileReservationBarProps> = ({ restaurant, t }) => {
    const whatsappLink = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do Locais de Moz.`)}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ 
                    title: `Locais de Moz — ${restaurant.name}`, 
                    text: `Olha este restaurante que encontrei no Locais de Moz!`, 
                    url: window.location.href 
                });
            } catch (err) {
                console.log('Share error:', err);
            }
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
            <div className="bg-bg/90 backdrop-blur-2xl border-t border-border-subtle p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-2 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] theme-dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)] px-4">
                
                {/* Secondary Actions */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <a
                        href={`tel:${restaurant.whatsapp}`}
                        className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-text-dim hover:text-primary transition-colors shrink-0"
                    >
                        <Phone size={18} />
                    </a>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-text-dim hover:text-primary transition-colors shrink-0"
                    >
                        <MapPin size={18} />
                    </a>
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-text-dim hover:text-primary transition-colors shrink-0"
                    >
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Primary Action */}
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all duration-300 max-w-[200px]"
                >
                    <MessageCircle size={18} /> Reservar
                </a>
            </div>
        </div>
    );
};
