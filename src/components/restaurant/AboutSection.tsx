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
    ChefHat,
    Star,
    Leaf,
    Flame,
    Heart,
    Users
} from 'lucide-react';

interface AboutSectionProps {
    restaurant: any;
    lang: string;
    setActiveTab?: (tab: 'menu' | 'about' | 'events') => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant, lang, setActiveTab }) => {
    const isEn = lang === 'en';
    const isOpenNow = restaurant.isOpen;

    const handleMenuClick = () => {
        if (setActiveTab) {
            setActiveTab('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Fallback for older integration
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.textContent === 'MENU') {
                    btn.click();
                }
            });
        }
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

    // Popular items mock/real data
    const popularItems = [
        { 
            name: isEn ? 'Premium Platter' : 'Prato de Assinatura', 
            img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            price: '1.250 MZN',
            tag: isEn ? 'Best Seller' : 'Mais Vendido'
        },
        { 
            name: isEn ? 'Chef\'s Special' : 'Especial do Chef', 
            img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
            price: '950 MZN',
            tag: isEn ? 'Trending' : 'Tendência'
        },
        { 
            name: isEn ? 'Coastal Delight' : 'Delícia Costeira', 
            img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
            price: '1.400 MZN',
            tag: isEn ? 'Signature' : 'Assinatura'
        }
    ];

    const reasons = [
        {
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
            title: isEn ? 'Fresh Ingredients' : 'Ingredientes Frescos',
            desc: isEn ? 'We source daily from local organic farms.' : 'Abastecemo-nos diariamente em quintas biológicas locais.'
        },
        {
            image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
            title: isEn ? 'Expert Craft' : 'Artesanato Especializado',
            desc: isEn ? 'Our chefs bring decades of international experience.' : 'Os nossos chefs trazem décadas de experiência internacional.'
        },
        {
            image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80',
            title: isEn ? 'Made with Love' : 'Feito com Amor',
            desc: isEn ? 'Every dish is a testament to our culinary passion.' : 'Cada prato é um testemunho da nossa paixão culinária.'
        },
        {
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80',
            title: isEn ? 'Perfect for Groups' : 'Ideal para Grupos',
            desc: isEn ? 'Spacious settings for unforgettable gatherings.' : 'Ambientes espaçosos para reuniões inesquecíveis.'
        }
    ];

    return (
        <div className="space-y-20 md:space-y-32 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. Header & Main Actions */}
            <div className="pt-8 flex flex-col gap-12">
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-text-main italic uppercase tracking-tighter">
                        Welcome to <br className="md:hidden" /><span className="text-primary">{restaurant.name}</span>
                    </h1>
                    
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* 2. About Us Section */}
            <section className="relative group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <div>
                            <span className="text-primary font-black uppercase tracking-widest text-sm mb-3 block">
                                {isEn ? 'Our Story' : 'A Nossa História'}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-text-main italic uppercase tracking-tighter leading-[0.9]">
                                {isEn ? 'Crafting Moments' : 'Criando Momentos'} <br /> 
                                <span className="text-text-dim/30">{isEn ? 'Since' : 'Desde'} 2018</span>
                            </h2>
                        </div>
                        <div className="space-y-6 text-text-dim text-lg leading-relaxed font-medium">
                            <p>
                                {restaurant.bio || restaurant.description || (isEn 
                                    ? 'Born from a passion for authentic culinary experiences, our restaurant has become a landmark for those who value quality and tradition.' 
                                    : 'Nascido de uma paixão por experiências culinárias autênticas, o nosso restaurante tornou-se um marco para quem valoriza a qualidade e a tradição.')}
                            </p>
                            <p>
                                {isEn 
                                    ? 'Every ingredient is handpicked, and every recipe is crafted to tell a story of heritage and innovation.' 
                                    : 'Cada ingrediente é escolhido a dedo, e cada receita é elaborada para contar uma história de herança e inovação.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-display font-black text-text-main">150+</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{isEn ? 'Daily Guests' : 'Clientes Diários'}</span>
                            </div>
                            <div className="w-px h-12 bg-border-subtle mx-4 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-display font-black text-text-main">12</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{isEn ? 'Awards Won' : 'Prémios Ganhos'}</span>
                            </div>
                            <div className="w-px h-12 bg-border-subtle mx-4 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-display font-black text-text-main">100%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">{isEn ? 'Organic' : 'Orgânico'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2 h-[350px] md:h-[420px] rounded-[3rem] overflow-hidden group shadow-2xl">
                        <img 
                            src={restaurant.hero_image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80'} 
                            alt="About Us" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
                            <p className="text-white text-sm font-medium italic">
                                "{isEn ? 'Cooking is an art, and every plate is our canvas.' : 'Cozinhar é uma arte, e cada prato é a nossa tela.'}"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Most Popular Food */}
            <section className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-black uppercase tracking-widest text-sm mb-3 block">
                            {isEn ? 'Favorites' : 'Favoritos'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">
                            {isEn ? 'Most Popular Food' : 'Pratos Mais Populares'}
                        </h2>
                    </div>
                    <button 
                        onClick={handleMenuClick}
                        className="flex items-center gap-2 px-8 py-4 bg-surface border border-border-subtle rounded-full font-black text-xs uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all group"
                    >
                        {isEn ? 'View Full Menu' : 'Ver Menu Completo'}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(restaurant.signature_dishes && restaurant.signature_dishes.length > 0 ? restaurant.signature_dishes : popularItems).slice(0, 3).map((item: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={handleMenuClick}
                            className="group cursor-pointer space-y-6"
                        >
                            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-lg">
                                <img 
                                    src={item.image_url || item.img} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                    {item.tag || (isEn ? 'Signature' : 'Assinatura')}
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                            </div>
                            <div className="px-2 flex justify-between items-start">
                                <div>
                                    <h4 className="text-2xl font-display font-black italic uppercase tracking-tighter text-text-main group-hover:text-primary transition-colors">
                                        {item.name}
                                    </h4>
                                    <p className="text-text-dim text-xs font-bold mt-1 uppercase tracking-widest opacity-60">
                                        {item.description ? (item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description) : (isEn ? 'Chef\'s Top Selection' : 'Seleção do Chef')}
                                    </p>
                                </div>
                                {item.price && <span className="font-black text-primary text-lg">{item.price}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Map & Hours Card (Figma Inspired) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hours Card */}
                <div className="lg:col-span-1 bg-surface border border-border-subtle rounded-[2.5rem] p-10 flex flex-col shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter text-text-main">
                            {isEn ? 'Opening Hours' : 'Horário'}
                        </h3>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        {[
                            { days: isEn ? 'Monday - Friday' : 'Segunda - Sexta', hours: restaurant.hours_weekday || '12:00 - 23:00' },
                            { days: isEn ? 'Saturday' : 'Sábado', hours: restaurant.hours_saturday || '12:00 - 00:00' },
                            { days: isEn ? 'Sunday' : 'Domingo', hours: restaurant.hours_sunday || '12:00 - 22:00' }
                        ].map((h, i) => (
                            <div key={i} className="flex justify-between items-center pb-4 border-b border-border-subtle/50 last:border-0 last:pb-0">
                                <span className="text-text-dim text-sm font-black uppercase tracking-widest">{h.days}</span>
                                <span className="text-text-main font-black text-sm">{h.hours}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-10 pt-10 border-t border-border-subtle flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs font-black uppercase tracking-widest text-text-dim">
                            {isOpenNow 
                                ? (isEn ? 'Currently Open' : 'Atualmente Aberto') 
                                : (isEn ? 'Currently Closed' : 'Atualmente Encerrado')}
                        </span>
                    </div>
                </div>

                {/* Map Card */}
                <div className="lg:col-span-2 bg-text-main text-surface rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl min-h-[400px] flex flex-col justify-between group">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]" />
                    
                    {/* Mock Map Background Visual */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none grayscale invert group-hover:scale-110 transition-transform duration-[10s] ease-linear">
                         <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80" className="w-full h-full object-cover" alt="Map" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                        <div className="max-w-md space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter">
                                    {isEn ? 'Our Location' : 'Localização'}
                                </h3>
                            </div>
                            <p className="text-surface/70 text-lg font-medium leading-relaxed">
                                {restaurant.location || restaurant.address || 'Maputo, Moçambique'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="p-6 bg-surface/10 backdrop-blur-md rounded-2xl border border-surface/20">
                                <p className="text-[10px] font-black uppercase tracking-widest text-surface/50 mb-1">{isEn ? 'Nearest Landmark' : 'Ponto de Referência'}</p>
                                <p className="font-bold text-sm">Polana Cimento, Maputo</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => {
                                const url = (restaurant.lat && restaurant.lng)
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                    : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`;
                                window.open(url, '_blank');
                            }}
                            className="flex-1 bg-primary text-white h-[64px] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                        >
                            <Navigation size={18} />
                            {isEn ? 'Get Directions' : 'Como Chegar'}
                        </button>
                        <button 
                            onClick={() => window.open(`tel:${restaurant.phone || restaurant.whatsapp}`)}
                            className="flex-1 bg-surface/10 backdrop-blur-md border border-surface/20 text-surface h-[64px] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-surface/20 transition-all"
                        >
                            <Phone size={18} />
                            {isEn ? 'Contact Us' : 'Contactar'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Awards (Only if present) */}
            {restaurant.awards && restaurant.awards.length > 0 && (
                <section className="bg-surface border border-border-subtle rounded-[3rem] p-10 md:p-14 overflow-hidden relative shadow-sm">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-primary font-black uppercase tracking-widest text-sm mb-3 block">
                                {isEn ? 'Excellence' : 'Excelência'}
                            </span>
                            <h3 className="text-4xl md:text-5xl font-display font-black italic uppercase tracking-tighter mb-6">
                                {isEn ? 'Recognition' : 'Reconhecimento'}
                            </h3>
                            <p className="text-text-dim font-medium text-lg max-w-xl leading-relaxed">
                                {isEn ? 'Our commitment to culinary excellence has been recognized by industry leaders.' : 'O nosso compromisso com a excelência culinária foi reconhecido por líderes da indústria.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {restaurant.awards.map((award: any, i: number) => (
                                <div key={i} className="flex flex-col items-center justify-center p-8 bg-bg rounded-[2rem] border border-border-subtle min-w-[160px] hover:border-primary/30 transition-colors shadow-sm">
                                    <Trophy className="text-primary mb-4" size={32} />
                                    <p className="font-black text-sm uppercase tracking-widest text-center mb-2">{award.title}</p>
                                    <p className="text-xs text-text-dim font-bold uppercase">{award.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
