import React from 'react';
import { MessageCircle, Phone, Star, ChevronDown } from 'lucide-react';

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

/** Sidebar card com reserva via WhatsApp e review mais recente */
export const ReservationSidebar: React.FC<ReservationSidebarProps> = ({ restaurant, t, lang }) => {
    const whatsappLink = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do Locais de Moz.`)}`;

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Reservation Box — desktop */}
            <div className="card-reserva hidden lg:flex lg:flex-1 bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10 shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                <div className="reservation-content relative z-10 flex flex-col justify-between w-full h-full">
                    <div>
                        <h4 className="font-black text-xl mb-4 uppercase tracking-tighter text-text-main italic">{t.quick_res}</h4>
                        <p className="text-[10px] text-text-dim mb-8 font-bold leading-relaxed uppercase tracking-wider">{t.res_desc}</p>
                    </div>
                    <div className="space-y-4">
                        <a
                             href={whatsappLink}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="prism-border w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 duration-300"
                         >
                            <MessageCircle size={22} /> {t.whatsapp_res}
                        </a>
                        <a
                            href={`tel:${restaurant.whatsapp}`}
                            className="w-full glass py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-text-main border border-border-subtle shadow-sm active:scale-95"
                        >
                            <Phone size={16} /> {t.ligar}
                        </a>
                    </div>
                </div>
            </div>

            {/* Review snippet */}
            {restaurant.reviews && restaurant.reviews.length > 0 && (
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

/** Fixed bottom bar com WhatsApp — mobile only */
export const MobileReservationBar: React.FC<MobileReservationBarProps> = ({ restaurant, t }) => {
    const whatsappLink = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do Locais de Moz.`)}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-bg/85 backdrop-blur-2xl border-t border-border-subtle p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] theme-dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-sm bg-primary text-white h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all duration-300"
                >
                    <MessageCircle size={24} /> {t.whatsapp_res}
                </a>
                <a
                    href={`tel:${restaurant.whatsapp}`}
                    className="w-full max-w-sm glass h-12 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 text-text-main border border-border-subtle text-[10px] hover:bg-primary/5 active:scale-95 transition-all duration-300"
                >
                    <Phone size={16} /> {t.ligar}
                </a>
            </div>
        </div>
    );
};
