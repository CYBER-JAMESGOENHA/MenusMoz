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
        <div className="space-y-6">
            {/* Compact About Card */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Heart size={16} />
                    </div>
                    <h3 className="text-xl font-display font-extrabold tracking-tight text-text-main">
                        {isEn ? 'About' : 'Sobre Nós'}
                    </h3>
                </div>
                <p className="text-text-dim text-[13px] leading-relaxed">
                    {restaurant.bio || restaurant.description || (isEn
                        ? 'A landmark for those who value quality and tradition.'
                        : 'Um marco para quem valoriza a qualidade e a tradição.')}
                </p>
                {restaurant.awards && restaurant.awards.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {restaurant.awards.map((award: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-bg rounded-full border border-border-subtle">
                                <Star size={10} className="text-primary fill-primary" />
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-main opacity-80">{award.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hours & Location */}
            <div className="bg-surface border border-border-subtle rounded-3xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Clock size={16} />
                    </div>
                    <h3 className="text-xl font-display font-extrabold tracking-tight text-text-main">
                        {isEn ? 'Hours & Location' : 'Horário & Localização'}
                    </h3>
                </div>

                <div className="space-y-2 mb-4">
                    {[
                        { days: isEn ? 'Mon – Fri' : 'Seg – Sex', hours: restaurant.hours_weekday || '12:00 – 23:00' },
                        { days: isEn ? 'Saturday' : 'Sábado', hours: restaurant.hours_saturday || '12:00 – 00:00' },
                        { days: isEn ? 'Sunday' : 'Domingo', hours: restaurant.hours_sunday || '12:00 – 22:00' }
                    ].map((h, i) => (
                        <div key={i} className="flex justify-between items-center pb-2 border-b border-border-subtle/30 last:border-0 last:pb-0">
                            <span className="text-text-dim text-[10px] font-extrabold uppercase tracking-widest opacity-60">{h.days}</span>
                            <span className="text-text-main text-[11px] font-bold">{h.hours}</span>
                        </div>
                    ))}
                </div>

                <div className={`flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest mb-4 ${isOpenNow ? 'text-green-500' : 'text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    {isOpenNow ? (isEn ? 'Open Now' : 'Aberto Agora') : (isEn ? 'Closed' : 'Fechado')}
                </div>

                {restaurant.location && (
                    <div className="pt-4 border-t border-border-subtle">
                        <div className="flex items-start gap-2 mb-3">
                            <MapPin size={14} className="text-text-dim mt-0.5 shrink-0" />
                            <p className="text-text-main text-[13px] font-medium leading-snug">{restaurant.location}</p>
                        </div>
                        <button
                            onClick={() => {
                                const url = (restaurant.lat && restaurant.lng)
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                    : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`;
                                window.open(url, '_blank');
                            }}
                            className="flex items-center gap-2 text-primary font-extrabold uppercase tracking-widest text-[9px] hover:opacity-70 transition-opacity"
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
