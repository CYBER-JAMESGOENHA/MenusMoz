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
            {/* Welcome Text & Dish of the Day */}
            <div className="pt-4">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">
                            Welcome to <span className="text-primary">{restaurant.name}</span>
                        </h1>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-primary" />
                                <div>
                                    <p className="font-bold text-text-main">{t.hours}</p>
                                    <p className="text-text-dim text-sm">{restaurant.hours || (isEn ? 'Check website for hours' : 'Consulte o site para horários')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-primary" />
                                <div>
                                    <p className="font-bold text-text-main">{t.map}</p>
                                    <p className="text-text-dim text-sm">{restaurant.location || (isEn ? 'Maputo, Mozambique' : 'Maputo, Moçambique')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-primary" />
                                <div>
                                    <p className="font-bold text-text-main">{t.contact}</p>
                                    <p className="text-text-dim text-sm">{restaurant.whatsapp || restaurant.phone || '-'}</p>
                                </div>
                            </div>
                            {restaurant.cuisine && (
                                <div className="flex items-center gap-3">
                                    <Utensils size={20} className="text-primary" />
                                    <div>
                                        <p className="font-bold text-text-main">{isEn ? 'Cuisine' : 'Cozinha'}</p>
                                        <p className="text-text-dim text-sm">{restaurant.cuisine}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-[320px] lg:w-[400px] aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden relative group bg-surface border border-border-subtle">
                        <img 
                            src={restaurant.dish_of_the_day_image || restaurant.hero_image_url || restaurant.image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80'} 
                            alt="Prato do Dia" 
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between text-white">
                            <p className="font-display font-black text-2xl italic uppercase tracking-tighter">Prato do Dia</p>
                            <button className="bg-white text-text-main px-6 py-2 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant About Card */}
            <section className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-12 border border-border-subtle overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center relative z-10">
                    {/* Image Section - Restaurant Logo/Interior */}
                    <div className="w-40 h-40 md:w-56 lg:w-64 md:h-56 lg:h-64 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-bg border border-border-subtle flex items-center justify-center">
                        <img 
                            src={restaurant.logo_url || restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=000&color=fff&size=256&bold=true`} 
                            alt={`${restaurant.name} logo`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                        {/* OvereLine Text */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
                            <Info size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{isEn ? 'ABOUT THE RESTAURANT' : 'SOBRE O RESTAURANTE'}</span>
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
                        <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                            {restaurant.cuisine && (
                                <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {restaurant.cuisine}
                                </span>
                            )}
                            {restaurant.location && (
                                <span className="bg-surface-variant text-text-dim border border-border-subtle px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {restaurant.location.split(',')[0]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SIGNATURE DISHES --- */}
            <section className="space-y-8">
                <h3 className="text-3xl md:text-4xl font-display font-black text-text-main italic uppercase tracking-wider">{t.signature}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(restaurant.signature_dishes && restaurant.signature_dishes.length > 0) ? (
                        restaurant.signature_dishes.map((dish: any, i: number) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface border border-border-subtle relative">
                                    <img src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                            { name: isEn ? 'Ocean Prime' : 'Lagosta à Laurentina', img: 'https://images.unsplash.com/photo-1553603227-2358aabe2b18?w=800&q=80' },
                            { name: isEn ? 'Savanna Spices' : 'Frango Zambeziana', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
                            { name: isEn ? 'Mozambican Gold' : 'Caril de Caranguejo', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80' }
                        ].map((s, i) => (
                            <div key={i} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border-subtle bg-surface">
                                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                    <p className="text-white font-display font-black italic uppercase tracking-tighter text-lg">{s.name}</p>
                                    <span className="text-primary text-[9px] font-black tracking-widest uppercase mt-1 block">{isEn ? 'House Special' : 'Especialidade da Casa'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>


            
            <div id="location" className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-text-dim uppercase tracking-wider">{t.hours}</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${isOpenNow ? 'text-green-600' : 'text-red-600'}`}>
                                {isOpenNow ? t.openNow : t.closed}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block w-px bg-border-subtle" />
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-medium text-text-dim uppercase tracking-wider">{t.map}</span>
                        <p className="text-sm font-medium text-text-main">{restaurant.location || restaurant.address || 'Maputo, Moçambique'}</p>
                    </div>
                    <a
                        href={
                            (restaurant.lat && restaurant.lng)
                                ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-text-main text-surface rounded-full font-bold text-xs uppercase tracking-wider hover:bg-primary transition-all"
                    >
                        {t.directions}
                    </a>
                </div>
            </div>

            {/* --- GALLERY --- */}
            <section id="gallery" className="space-y-8">
                <h3 className="text-3xl md:text-4xl font-display font-black text-text-main italic uppercase tracking-wider">{t.gallery}</h3>
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
