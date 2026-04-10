import React from 'react';
import { 
    Clock, 
    MapPin, 
    Navigation, 
    Phone, 
    Globe, 
    CreditCard, 
    Car, 
    Accessibility, 
    Shirt, 
    Users, 
    CheckCircle2,
    CalendarCheck
} from 'lucide-react';

interface VisitSectionProps {
    restaurant: any;
    lang: string;
}

export const VisitSection: React.FC<VisitSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    const days = [
        { key: 'Segunda', label: isEn ? 'Monday' : 'Segunda' },
        { key: 'Terça', label: isEn ? 'Tuesday' : 'Terça' },
        { key: 'Quarta', label: isEn ? 'Wednesday' : 'Quarta' },
        { key: 'Quinta', label: isEn ? 'Thursday' : 'Quinta' },
        { key: 'Sexta', label: isEn ? 'Friday' : 'Sexta' },
        { key: 'Sábado', label: isEn ? 'Saturday' : 'Sábado' },
        { key: 'Domingo', label: isEn ? 'Sunday' : 'Domingo' }
    ];

    const currentDay = new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'long' }).format(new Date());
    const isOpenNow = restaurant.isOpen;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- LOCATION & HOURS GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hours Card */}
                <div className="bg-surface rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-border-subtle shadow-sm space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Clock size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-display font-black text-text-main italic uppercase tracking-tighter">Horário</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isOpenNow ? 'text-green-600' : 'text-red-600'}`}>
                                        {isOpenNow ? (isEn ? 'Open Now' : 'Aberto Agora') : (isEn ? 'Closed' : 'Encerrado')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {days.map(day => {
                            const hours = restaurant.working_hours?.[day.key] || restaurant.hours?.[day.key] || (isEn ? 'Closed' : 'Cerrado');
                            const isToday = currentDay.toLowerCase().includes(day.key.toLowerCase());
                            return (
                                <div key={day.key} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${isToday ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-bg/50 border-border-subtle/30'}`}>
                                    <span className={`font-black text-xs uppercase tracking-widest ${isToday ? 'text-primary' : 'text-text-dim'}`}>{day.label}</span>
                                    <span className={`font-bold text-sm ${isToday ? 'text-text-main' : 'text-text-dim'}`}>{hours}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Map & Directions Card */}
                <div className="bg-surface rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-border-subtle shadow-sm flex flex-col gap-6 md:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <MapPin size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-display font-black text-text-main italic uppercase tracking-tighter">Localização</h3>
                            <p className="text-text-dim text-xs font-medium mt-0.5">{restaurant.address || 'Maputo, Moçambique'}</p>
                        </div>
                    </div>

                    {/* Google Maps Embed Placeholder/Container */}
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] rounded-3xl md:rounded-[2rem] bg-bg border border-border-subtle overflow-hidden relative group">
                        <img 
                            src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80`} 
                            alt="Map Location"
                            className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                             <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address || restaurant.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"
                             >
                                <Navigation size={18} /> {isEn ? 'Get Directions' : 'Como Chegar'}
                             </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FACILITIES & AMENITIES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        icon: <Shirt size={20} />, 
                        label: isEn ? 'Dress Code' : 'Código de Vestuário', 
                        value: restaurant.dress_code || (isEn ? 'Smart Casual' : 'Casual Elegante') 
                    },
                    { 
                        icon: <Car size={20} />, 
                        label: isEn ? 'Parking' : 'Estacionamento', 
                        value: restaurant.parking || (isEn ? 'Valet & Street' : 'Valet e Rua') 
                    },
                    { 
                        icon: <CreditCard size={20} />, 
                        label: isEn ? 'Payments' : 'Pagamentos', 
                        value: restaurant.payment_methods?.join(', ') || 'M-Pesa, POS, Cash' 
                    },
                    { 
                        icon: <Accessibility size={20} />, 
                        label: isEn ? 'Accessibility' : 'Acessibilidade', 
                        value: restaurant.accessibility?.join(', ') || (isEn ? 'Family Friendly, Wheelchair' : 'Familiar, Cadeira de Rodas') 
                    }
                ].map((item, i) => (
                    <div key={i} className="bg-surface rounded-3xl p-6 border border-border-subtle hover:border-primary/30 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-bg border border-border-subtle text-text-dim flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                            {item.icon}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-dim/50 mb-1">{item.label}</p>
                        <p className="font-bold text-text-main text-sm">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* --- CONTACT & SOCIAL --- */}
            <div className="bg-black text-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
                 <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-black italic uppercase tracking-tighter">Reservas & Contactos</h2>
                        <p className="text-white/40 text-lg font-medium leading-relaxed">Pode reservar a sua mesa diretamente por telefone ou via WhatsApp para uma resposta imediata.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <a 
                            href={`tel:${restaurant.phone || restaurant.whatsapp}`}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white text-black px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
                        >
                            <Phone size={16} className="md:w-[18px]" /> {isEn ? 'Call Now' : 'Ligar Agora'}
                        </a>
                        <a 
                            href={`https://wa.me/${restaurant.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            <CalendarCheck size={16} className="md:w-[18px]" /> WhatsApp
                        </a>
                    </div>
                 </div>
            </div>
        </div>
    );
};
