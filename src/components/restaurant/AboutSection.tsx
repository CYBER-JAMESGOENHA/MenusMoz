import React from 'react';
import { 
    Clock, 
    MapPin, 
    Navigation, 
    Phone, 
    CreditCard, 
    Car, 
    Accessibility, 
    Shirt, 
    CalendarCheck,
    Utensils,
    Quote,
    Trophy,
    Info,
    ArrowRight,
    Star,
    Play,
    Globe,
    Users
} from 'lucide-react';
import { DetailStarRating } from './DetailShared';

interface AboutSectionProps {
    restaurant: any;
    lang: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    const t = isEn ? {
        intro: "Experience & Visit",
        introDesc: "Travel through our history, atmosphere and everything we have prepared for you.",
        explore: "Explore Sections",
        history: "Our Essence",
        gallery: "Ambiance",
        map: "Location",
        amenities: "Amenities",
        contact: "Contact",
        hours: "Opening Hours",
        directions: "Get Directions",
        openNow: "Open Now",
        closed: "Closed",
        signature: "Signature Dishes",
        awards: "Recognition & Awards",
        reservation: "Bookings & Contact",
        callNow: "Call Now"
    } : {
        intro: "Visita & Experiência",
        introDesc: "Viaje pela nossa história, ambiente e tudo o que preparámos para si.",
        explore: "Explorar Secções",
        history: "A nossa Essência",
        gallery: "Ambiance & Galeria",
        map: "Localização",
        amenities: "Facilidades",
        contact: "Contacto",
        hours: "Horário",
        directions: "Como Chegar",
        openNow: "Aberto Agora",
        closed: "Encerrado",
        signature: "Pratos de Assinatura",
        awards: "Reconhecimento & Prémios",
        reservation: "Reservas & Contactos",
        callNow: "Ligar Agora"
    };

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

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 140; // sticky nav height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-16 md:space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- INTRO CARD --- */}
            <section className="bg-surface rounded-3xl md:rounded-[3rem] p-8 md:p-12 border border-border-subtle relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-primary/10 transition-colors duration-700" />
                <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-6">
                        <Info size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.intro}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-black text-text-main italic uppercase tracking-tighter leading-[0.9] mb-6">
                        {restaurant.name}: <span className="text-primary">Muito mais</span> que um restaurante.
                    </h2>
                    <p className="text-text-dim text-lg md:text-2xl font-medium leading-relaxed mb-8">
                        {t.introDesc}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: 'story', label: t.history },
                            { id: 'gallery', label: isEn ? 'Gallery' : 'Galeria' },
                            { id: 'location', label: t.map },
                            { id: 'amenities', label: t.amenities },
                            { id: 'contact', label: t.contact }
                        ].map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollTo(link.id)}
                                className="px-4 py-2 bg-bg border border-border-subtle hover:border-primary/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary transition-all flex items-center gap-2"
                            >
                                {link.label}
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STORY / ESSENCE --- */}
            <section id="story" className="relative">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                            <Utensils size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.history}</span>
                        </div>
                        <h3 className="text-2xl md:text-5xl lg:text-6xl font-display font-black text-text-main italic uppercase tracking-tighter leading-[0.9]">
                            {isEn ? 'The Art of Mozambican Flavors' : 'A Arte dos Sabores Moçambicanos'}
                        </h3>
                        <div className="text-text-dim text-lg leading-relaxed font-medium space-y-4">
                            {restaurant.story ? (
                                <p className="whitespace-pre-line">{restaurant.story}</p>
                            ) : (
                                <p>
                                    {restaurant.description || (isEn 
                                        ? 'Founded with a passion for excellence, our restaurant brings together the freshest local ingredients and global culinary techniques.' 
                                        : 'Fundado com uma paixão pela excelência, o nosso restaurante reúne os ingredientes locais mais frescos e técnicas culinárias globais.')}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="w-full md:w-[320px] lg:w-[400px] aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden relative group">
                        <img 
                            src={restaurant.image} 
                            alt="Atmosphere" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <p className="font-display font-black text-2xl italic uppercase tracking-tighter">Est. 2012</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-1">Maputo, Moçambique</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Restaurant About Card */}
            <section className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-12 border border-border-subtle overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center relative z-10">
                    {/* Image Section - Restaurant Logo/Interior */}
                    <div className="w-40 h-40 md:w-56 lg:w-64 md:h-56 lg:h-64 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <img 
                            src={restaurant.logo || restaurant.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=random&color=fff&size=128&bold=true`} 
                            alt={`${restaurant.name} logo`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                        {/* OvereLine Text */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
                            <Info size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">SOBRE O RESTAURANTE</span>
                        </div>
                        
                        {/* Heading - Restaurant Name */}
                        <h3 className="text-xl font-display font-black text-text-main italic uppercase tracking-tighter mb-4">
                            {restaurant.name}
                        </h3>
                        
                        {/* Premium Bio Paragraph */}
                        <p className="text-text-dim text-base md:text-lg leading-relaxed">
                            {restaurant.bio || restaurant.description || (isEn 
                                ? 'Founded with a passion for excellence, our restaurant brings together the freshest local ingredients and global culinary techniques.' 
                                : 'Fundado com uma paixão pela excelência, o nosso restaurante reúne os ingredientes locais mais frescos e técnicas culinárias globais.')}
                        </p>
                        
                        {/* Sleek Pill/Tag for Location or Cuisine Style */}
                        <div className="flex items-center gap-2 mt-3">
                            {restaurant.cuisine && (
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] font-medium">
                                    {restaurant.cuisine}
                                </span>
                            )}
                            {!restaurant.cuisine && restaurant.location && (
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] font-medium">
                                    {restaurant.location.split(',')[0]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SIGNATURE DISHES --- */}
            <section className="space-y-8">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">{t.signature}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(restaurant.signature_dishes && restaurant.signature_dishes.length > 0) ? (
                        restaurant.signature_dishes.map((dish: any, i: number) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface border border-border-subtle relative">
                                    <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <h4 className="text-white font-display font-black text-xl italic uppercase tracking-tighter">{dish.name}</h4>
                                        <p className="text-white/70 text-xs mt-2 line-clamp-2">{dish.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        [
                            { name: 'Lagosta à Laurentina', img: 'https://images.unsplash.com/photo-1553603227-2358aabe2b18?w=800&q=80' },
                            { name: 'Frango Zambeziana', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
                            { name: 'Caril de Caranguejo', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80' }
                        ].map((s, i) => (
                            <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-border-subtle">
                                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-display font-black italic uppercase tracking-tighter">{s.name}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            
            <div id="location" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hours Card */}
                <div className="bg-surface rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-border-subtle shadow-sm space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Clock size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-display font-black text-text-main italic uppercase tracking-tighter">{t.hours}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isOpenNow ? 'text-green-600' : 'text-red-600'}`}>
                                    {isOpenNow ? t.openNow : t.closed}
                                </span>
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

                {/* Map Card */}
                <div className="bg-surface rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-border-subtle shadow-sm flex flex-col gap-6 md:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <MapPin size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-display font-black text-text-main italic uppercase tracking-tighter">{t.map}</h3>
                            <p className="text-text-dim text-xs font-medium mt-0.5">{restaurant.location || restaurant.address || 'Maputo, Moçambique'}</p>
                        </div>
                    </div>
                    {/* Google Maps embed — precise pin if lat/lng, text search otherwise */}
                    <div className="flex-1 min-h-[250px] md:min-h-[300px] rounded-3xl md:rounded-[2rem] border border-border-subtle overflow-hidden relative">
                        {(restaurant.lat && restaurant.lng) ? (
                            <iframe
                                title={`${restaurant.name} - Localização`}
                                width="100%"
                                height="100%"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${restaurant.lat},${restaurant.lng}&z=16&output=embed`}
                                className="absolute inset-0 w-full h-full border-0"
                            />
                        ) : (
                            <iframe
                                title={`${restaurant.name} - Localização`}
                                width="100%"
                                height="100%"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name + ' Moçambique')}&z=15&output=embed`}
                                className="absolute inset-0 w-full h-full border-0"
                            />
                        )}
                    </div>
                    {/* Directions CTA */}
                    <a
                        href={
                            (restaurant.lat && restaurant.lng)
                                ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-text-main text-surface rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-sm hover:shadow-primary-glow/20 active:scale-95 duration-300"
                    >
                        <Navigation size={18} />
                        {t.directions}
                        {restaurant.lat && restaurant.lng && (
                            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">GPS</span>
                        )}
                    </a>
                </div>
            </div>

            {/* --- GALLERY --- */}
            <section id="gallery" className="space-y-8">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">{t.gallery}</h3>
                <div className="columns-2 md:columns-3 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
                    {(restaurant.gallery && restaurant.gallery.length > 0) ? (
                        restaurant.gallery.map((item: any, i: number) => (
                            <div key={i} className="break-inside-avoid relative rounded-[2rem] overflow-hidden group">
                                <img src={item.url} alt={item.title} className="w-full h-auto object-cover" />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white"><Play fill="white" size={20} /></div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'https://images.unsplash.com/photo-1552566626-52f8b828add9', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'].map((url, i) => (
                            <div key={i} className="break-inside-avoid relative rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-border-subtle"><img src={`${url}?w=800&q=80`} alt="Gallery" className="w-full h-auto object-cover" /></div>
                        ))
                    )}
                </div>
            </section>

            {/* --- FACILITIES --- */}
            <div id="amenities" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <Shirt size={20} />, label: isEn ? 'Dress Code' : 'Código de Vestuário', value: restaurant.dress_code || (isEn ? 'Smart Casual' : 'Casual Elegante') },
                    { icon: <Car size={20} />, label: isEn ? 'Parking' : 'Estacionamento', value: restaurant.parking || (isEn ? 'Valet & Street' : 'Valet e Rua') },
                    { icon: <CreditCard size={20} />, label: isEn ? 'Payments' : 'Pagamentos', value: restaurant.payment_methods?.join(', ') || 'M-Pesa, POS, Cash' },
                    { icon: <Accessibility size={20} />, label: isEn ? 'Accessibility' : 'Acessibilidade', value: restaurant.accessibility?.join(', ') || (isEn ? 'Family Friendly, Wheelchair' : 'Familiar, Cadeira de Rodas') }
                ].map((item, i) => (
                    <div key={i} className="bg-surface rounded-3xl p-6 border border-border-subtle hover:border-primary/30 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-bg border border-border-subtle text-text-dim flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">{item.icon}</div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-dim/50 mb-1">{item.label}</p>
                        <p className="font-bold text-text-main text-sm">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* --- AWARDS --- */}
            {restaurant.awards && restaurant.awards.length > 0 && (
                <section className="bg-black text-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-black italic uppercase tracking-tighter mb-4">{t.awards}</h3>
                            <p className="text-white/50 font-medium text-base md:text-lg leading-relaxed">O nosso compromisso com a excelência culinária e hospitalidade foi reconhecido por líderes da indústria.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {restaurant.awards.map((award: any, i: number) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center p-4"><Trophy className="text-primary" size={32} /></div>
                                    <div className="text-center">
                                        <p className="font-black text-xs uppercase tracking-widest leading-tight">{award.title}</p>
                                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">{award.year}</p>
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
