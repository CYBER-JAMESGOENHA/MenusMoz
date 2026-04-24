import React from 'react';
import { 
    Clock, 
    MapPin, 
    Phone, 
    CreditCard, 
    Car, 
    Accessibility, 
    Shirt, 
    Utensils,
    ArrowRight,
    Trophy,
    CalendarCheck,
    Navigation,
    Info,
    ChefHat
} from 'lucide-react';

interface AboutSectionProps {
    restaurant: any;
    lang: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    
    const isOpenNow = restaurant.isOpen;

    const handleMenuClick = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent === 'MENU') {
                btn.click();
            }
        });
    };

    // Action buttons data
    const actions = [
        {
            id: 'menu',
            icon: <Utensils size={24} />,
            title: isEn ? 'Explore Menu' : 'Explorar Menu',
            desc: isEn ? 'Discover our dishes' : 'Descubra os pratos',
            onClick: handleMenuClick
        },
        {
            id: 'reserve',
            icon: <CalendarCheck size={24} />,
            title: isEn ? 'Book a Table' : 'Reservar Mesa',
            desc: isEn ? 'Secure your spot' : 'Garanta o seu lugar',
            onClick: () => window.open(`https://wa.me/${restaurant.whatsapp?.replace(/\D/g, '')}`, '_blank')
        },
        {
            id: 'call',
            icon: <Phone size={24} />,
            title: isEn ? 'Call Us' : 'Ligar Agora',
            desc: restaurant.phone || restaurant.whatsapp || (isEn ? 'Get in touch' : 'Contacte-nos'),
            onClick: () => window.open(`tel:${restaurant.phone || restaurant.whatsapp}`)
        },
        {
            id: 'directions',
            icon: <Navigation size={24} />,
            title: isEn ? 'Directions' : 'Como Chegar',
            desc: restaurant.location?.split(',')[0] || (isEn ? 'Find us on map' : 'Encontre-nos no mapa'),
            onClick: () => {
                const url = (restaurant.lat && restaurant.lng)
                    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                    : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`;
                window.open(url, '_blank');
            }
        }
    ];

    return (
        <div className="space-y-16 md:space-y-24 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Main Actions */}
            <div className="pt-8 flex flex-col gap-12">
                {/* Title and Short Bio */}
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-text-main italic uppercase tracking-tighter">
                        Welcome to <br className="md:hidden" /><span className="text-primary">{restaurant.name}</span>
                    </h1>
                    <p className="text-text-dim text-lg md:text-xl leading-relaxed mx-auto max-w-3xl font-medium px-4">
                        {restaurant.bio || restaurant.description || (isEn 
                            ? 'Experience a culinary journey that combines passion, exceptional ingredients, and unforgettable flavors.' 
                            : 'Experiencie uma viagem culinária que combina paixão, ingredientes excepcionais e sabores inesquecíveis.')}
                    </p>
                    
                    {/* Status Badge */}
                    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                        <div className={`px-5 py-2 rounded-full border ${isOpenNow ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} flex items-center gap-2 text-sm font-bold uppercase tracking-wider`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            {isOpenNow ? (isEn ? 'Open Now' : 'Aberto Agora') : (isEn ? 'Closed' : 'Encerrado')}
                        </div>
                        {restaurant.cuisine && (
                            <div className="px-5 py-2 rounded-full bg-surface border border-border-subtle text-text-dim text-sm font-bold uppercase tracking-wider">
                                {restaurant.cuisine}
                            </div>
                        )}
                    </div>
                </div>

                {/* Primary Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {actions.map((action, i) => (
                        <button 
                            key={i}
                            onClick={action.onClick}
                            className="group relative overflow-hidden bg-surface border border-border-subtle rounded-[2rem] p-6 hover:border-primary/50 transition-all duration-500 text-left flex flex-col h-full shadow-sm hover:shadow-md"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex items-start justify-between mb-10">
                                <div className="w-16 h-16 rounded-full bg-bg border border-border-subtle flex items-center justify-center text-text-main group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-sm">
                                    {action.icon}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-text-dim group-hover:text-primary group-hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-500">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                            <div className="relative z-10 mt-auto">
                                <h3 className="font-display font-black text-2xl uppercase tracking-wider text-text-main mb-2">{action.title}</h3>
                                <p className="text-text-dim text-sm font-medium">{action.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Signature Dishes */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                    <div>
                        <span className="text-primary font-black uppercase tracking-widest text-sm mb-2 block">
                            {isEn ? 'Highlights' : 'Destaques'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">
                            {isEn ? 'Signature Dishes' : 'Pratos de Assinatura'}
                        </h2>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(restaurant.signature_dishes && restaurant.signature_dishes.length > 0) ? (
                        restaurant.signature_dishes.map((dish: any, i: number) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-surface border border-border-subtle relative shadow-sm">
                                    <img src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h4 className="text-white font-display font-black text-3xl italic uppercase tracking-tighter mb-3">{dish.name}</h4>
                                        <p className="text-white/80 text-sm line-clamp-2 font-medium leading-relaxed">{dish.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        [
                            { name: isEn ? 'Chef\'s Special' : 'Especialidade do Chef', img: 'https://images.unsplash.com/photo-1553603227-2358aabe2b18?w=800&q=80', desc: isEn ? 'Our most requested culinary masterpiece.' : 'A nossa obra-prima culinária mais requisitada.' },
                            { name: isEn ? 'Local Flavors' : 'Sabores Locais', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', desc: isEn ? 'Authentic taste with premium ingredients.' : 'Sabor autêntico com ingredientes premium.' },
                            { name: isEn ? 'Premium Cut' : 'Corte Premium', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80', desc: isEn ? 'Perfectly cooked to your exact preference.' : 'Cozinhado na perfeição de acordo com a sua preferência.' }
                        ].map((s, i) => (
                            <div key={i} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-border-subtle bg-surface shadow-sm">
                                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-primary text-[11px] font-black tracking-widest uppercase mb-3 block">{isEn ? 'Signature' : 'Assinatura'}</span>
                                    <h4 className="text-white font-display font-black text-3xl italic uppercase tracking-tighter mb-3">{s.name}</h4>
                                    <p className="text-white/80 text-sm font-medium line-clamp-2 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Amenities & Info Grid */}
            <section className="bg-surface border border-border-subtle rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 relative z-10">
                    
                    {/* Essential Info */}
                    <div className="space-y-8 lg:col-span-1">
                        <div>
                            <h3 className="font-display font-black text-3xl uppercase tracking-tighter text-text-main mb-8">
                                {isEn ? 'Essential Info' : 'Informação Essencial'}
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-full bg-bg border border-border-subtle flex items-center justify-center text-primary shrink-0 shadow-sm">
                                        <Clock size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-black text-xs uppercase tracking-widest text-text-dim mb-2">{isEn ? 'Working Hours' : 'Horário de Funcionamento'}</p>
                                        <p className="font-bold text-text-main text-base">{restaurant.hours || (isEn ? '12:00 PM - 11:00 PM' : '12:00 - 23:00')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-full bg-bg border border-border-subtle flex items-center justify-center text-primary shrink-0 shadow-sm">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-black text-xs uppercase tracking-widest text-text-dim mb-2">{isEn ? 'Location' : 'Localização'}</p>
                                        <p className="font-bold text-text-main text-base">{restaurant.location || restaurant.address || 'Maputo, Moçambique'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="lg:col-span-2">
                        <h3 className="font-display font-black text-3xl uppercase tracking-tighter text-text-main mb-8">
                            {isEn ? 'Facilities & Amenities' : 'Facilidades e Comodidades'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { icon: <Shirt size={20} />, label: isEn ? 'Dress Code' : 'Código de Vestuário', value: restaurant.dress_code || (isEn ? 'Smart Casual' : 'Casual Elegante') },
                                { icon: <Car size={20} />, label: isEn ? 'Parking' : 'Estacionamento', value: restaurant.parking || (isEn ? 'Valet & Street' : 'Valet e Rua') },
                                { icon: <CreditCard size={20} />, label: isEn ? 'Payments' : 'Pagamentos', value: restaurant.payment_methods?.join(', ') || 'M-Pesa, POS, Cash' },
                                { icon: <Accessibility size={20} />, label: isEn ? 'Accessibility' : 'Acessibilidade', value: restaurant.accessibility?.join(', ') || (isEn ? 'Family Friendly, Wheelchair' : 'Familiar, Cadeira de Rodas') }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-bg border border-border-subtle hover:border-primary/30 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-text-main shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-black text-[10px] uppercase tracking-widest text-text-dim mb-1">{item.label}</p>
                                        <p className="font-bold text-text-main text-base">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Awards (Only if present) */}
            {restaurant.awards && restaurant.awards.length > 0 && (
                <section className="bg-text-main text-surface rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 overflow-hidden relative shadow-xl">
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-primary font-black uppercase tracking-widest text-sm mb-3 block">
                                {isEn ? 'Excellence' : 'Excelência'}
                            </span>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-black italic uppercase tracking-tighter mb-6">
                                {isEn ? 'Recognition & Awards' : 'Reconhecimento e Prémios'}
                            </h3>
                            <p className="text-surface/70 font-medium text-lg lg:text-xl max-w-xl leading-relaxed">
                                {isEn ? 'Our commitment to culinary excellence has been recognized by industry leaders.' : 'O nosso compromisso com a excelência culinária foi reconhecido por líderes da indústria.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {restaurant.awards.map((award: any, i: number) => (
                                <div key={i} className="flex flex-col items-center justify-center p-8 bg-surface/10 backdrop-blur-md rounded-[2rem] border border-surface/20 min-w-[160px] hover:bg-surface/20 transition-colors">
                                    <Trophy className="text-primary mb-4" size={36} />
                                    <p className="font-black text-sm uppercase tracking-widest text-center mb-2">{award.title}</p>
                                    <p className="text-xs text-surface/50 font-bold uppercase">{award.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
