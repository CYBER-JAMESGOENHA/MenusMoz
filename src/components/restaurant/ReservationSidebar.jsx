import React from 'react';
import { MessageCircle, Phone, Star, ChevronDown } from 'lucide-react';

/** Sidebar card com reserva via WhatsApp e review mais recente */
export const ReservationSidebar = ({ restaurant, t, lang }) => {
    const whatsappLink = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do Locais de Moz.`)}`;
    const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(20); };

    return (
        <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            {/* Reservation Box — desktop */}
            <div className="hidden lg:block bg-primary/5 p-8 rounded-[3rem] border border-primary/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                <h4 className="font-black text-xl mb-6 uppercase tracking-wider text-text-main relative z-10">{t.quick_res}</h4>
                <p className="text-sm text-text-dim mb-8 font-medium relative z-10">{t.res_desc}</p>
                <div className="space-y-4 relative z-10">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={triggerHaptic}
                        className="prism-border w-full bg-primary text-white py-5 rounded-3xl font-black text-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
                    >
                        <MessageCircle size={24} /> {t.whatsapp_res}
                    </a>
                    <a
                        href={`tel:${restaurant.whatsapp}`}
                        className="w-full glass py-4 rounded-2xl font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-text-main border-none shadow-sm"
                    >
                        <Phone size={18} /> Ligar Direto
                    </a>
                </div>
            </div>

            {/* Review snippet */}
            {restaurant.reviews?.length > 0 && (
                <div className="bg-surface border border-border-subtle p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full -mr-8 -mt-8" />
                    <div className="flex items-center gap-2 mb-4 text-accent relative z-10">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                size={20}
                                fill={i <= Math.round(restaurant.reviews[0].rating ?? 5) ? 'currentColor' : 'none'}
                                className={i <= Math.round(restaurant.reviews[0].rating ?? 5) ? 'text-accent' : 'text-text-dim/20'}
                            />
                        ))}
                        <span className="ml-2 font-black text-lg text-text-main">{(restaurant.reviews[0].rating ?? 5).toFixed(1)}</span>
                    </div>
                    <p className="italic text-lg mb-6 text-text-main relative z-10 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                        "{restaurant.reviews[0].comment}"
                    </p>
                    <p className="font-bold uppercase text-xs tracking-[0.2em] text-text-dim/40 relative z-10">
                        — {restaurant.reviews[0].userName}, {lang === 'pt' ? 'Cliente Verificado' : 'Verified Customer'}
                    </p>
                </div>
            )}

            {/* Mobile scroll hint */}
            <div className="flex flex-col items-center gap-2 text-text-dim/30 lg:hidden py-12">
                <ChevronDown size={18} className="animate-bounce" />
                <span className="text-xs uppercase tracking-widest font-bold">Deslize para mais</span>
            </div>
        </div>
    );
};

/** Fixed bottom bar com WhatsApp — mobile only */
export const MobileReservationBar = ({ restaurant, t }) => {
    const whatsappLink = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do Locais de Moz.`)}`;
    const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(20); };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-bg/80 backdrop-blur-xl border-t border-border-subtle px-4 py-4 flex flex-col items-center gap-3 shadow-2xl">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerHaptic}
                    className="w-full max-w-sm bg-primary text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/40 hover:brightness-110 active:scale-95 transition-all"
                >
                    <MessageCircle size={22} /> {t.whatsapp_res}
                </a>
                <a
                    href={`tel:${restaurant.whatsapp}`}
                    onClick={triggerHaptic}
                    className="w-full max-w-sm glass py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-text-main border border-border-subtle text-sm hover:bg-primary/10 active:scale-95 transition-all"
                >
                    <Phone size={16} /> Ligar Direto
                </a>
            </div>
        </div>
    );
};
