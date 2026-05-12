import React from 'react';
import {
    Clock,
    MapPin,
    Phone,
    Navigation,
    ArrowRight,
    Heart,
    Star
} from 'lucide-react';

interface AboutSectionProps {
    restaurant: any;
    lang: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    const isOpenNow = restaurant.isOpen;

    return (
        <div className="space-y-8">
            {/* Compact About Card */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Heart size={18} />
                    </div>
                    <h3 className="text-xl font-display font-black italic uppercase tracking-tighter text-text-main">
                        {isEn ? 'About' : 'Sobre Nós'}
                    </h3>
                </div>
                <p className="text-text-dim text-sm leading-relaxed">
                    {restaurant.bio || restaurant.description || (isEn
                        ? 'A landmark for those who value quality and tradition.'
                        : 'Um marco para quem valoriza a qualidade e a tradição.')}
                </p>
                {restaurant.awards && restaurant.awards.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {restaurant.awards.map((award: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg rounded-full border border-border-subtle">
                                <Star size={10} className="text-primary fill-primary" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-text-main">{award.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hours & Location */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Clock size={18} />
                    </div>
                    <h3 className="text-xl font-display font-black italic uppercase tracking-tighter text-text-main">
                        {isEn ? 'Hours & Location' : 'Horário & Localização'}
                    </h3>
                </div>

                <div className="space-y-3 mb-5">
                    {[
                        { days: isEn ? 'Mon – Fri' : 'Seg – Sex', hours: restaurant.hours_weekday || '12:00 – 23:00' },
                        { days: isEn ? 'Saturday' : 'Sábado', hours: restaurant.hours_saturday || '12:00 – 00:00' },
                        { days: isEn ? 'Sunday' : 'Domingo', hours: restaurant.hours_sunday || '12:00 – 22:00' }
                    ].map((h, i) => (
                        <div key={i} className="flex justify-between items-center pb-3 border-b border-border-subtle/50 last:border-0 last:pb-0">
                            <span className="text-text-dim text-xs font-black uppercase tracking-widest">{h.days}</span>
                            <span className="text-text-main text-xs font-bold">{h.hours}</span>
                        </div>
                    ))}
                </div>

                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-4 ${isOpenNow ? 'text-green-500' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    {isOpenNow ? (isEn ? 'Open Now' : 'Aberto Agora') : (isEn ? 'Closed' : 'Fechado')}
                </div>

                {restaurant.location && (
                    <div className="pt-4 border-t border-border-subtle">
                        <div className="flex items-start gap-2 mb-3">
                            <MapPin size={14} className="text-text-dim mt-0.5 shrink-0" />
                            <p className="text-text-main text-sm font-medium">{restaurant.location}</p>
                        </div>
                        <button
                            onClick={() => {
                                const url = (restaurant.lat && restaurant.lng)
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                    : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`;
                                window.open(url, '_blank');
                            }}
                            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:opacity-70 transition-opacity"
                        >
                            <Navigation size={14} />
                            {isEn ? 'Get Directions' : 'Como Chegar'}
                            <ArrowRight size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
