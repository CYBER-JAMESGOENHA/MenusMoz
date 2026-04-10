import React from 'react';
import { Trophy, Utensils, Camera, Quote, Star, Play } from 'lucide-react';
import { OrnamentalDivider } from './DetailShared';

interface ExperienceSectionProps {
    restaurant: any;
    lang: string;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ restaurant, lang }) => {
    const isEn = lang === 'en';
    
    return (
        <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- STORY / CONCEPT --- */}
            <section className="relative">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                            <Utensils size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">A nossa Essência</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-display font-black text-text-main italic uppercase tracking-tighter leading-[0.9]">
                            {isEn ? 'The Art of Mozambican Flavors' : 'A Arte dos Sabores Moçambicanos'}
                        </h2>
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
                    
                    {/* Visual Stamp/Badge */}
                    <div className="w-full md:w-[400px] aspect-square rounded-[3rem] overflow-hidden relative group">
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

            <OrnamentalDivider />

            {/* --- CHEF PHILOSOPHY --- */}
            {restaurant.chefName && (
                <section className="bg-surface rounded-[3rem] p-12 border border-border-subtle overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden rotate-3 hover:rotate-0 transition-all duration-700 shadow-2xl">
                            <img 
                                src={restaurant.chefImage || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"} 
                                alt={restaurant.chefName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <Quote size={48} className="text-primary/20 mb-4 mx-auto md:mx-0" />
                            <p className="text-2xl md:text-3xl italic font-medium text-text-main leading-relaxed">
                                "{restaurant.chefQuote || (isEn 
                                    ? 'Cooking is a language that speaks to the soul through the palate.' 
                                    : 'Cozinhar é uma linguagem que fala à alma através do paladar.')}"
                            </p>
                            <div>
                                <h3 className="text-xl font-display font-black text-primary italic uppercase tracking-tighter">Chef {restaurant.chefName}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-dim mt-1">Executive Chef & Visionary</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- SIGNATURE DISHES --- */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">Pratos de Assinatura</h2>
                        <p className="text-text-dim text-sm font-bold uppercase tracking-widest mt-2">O que nos torna icónicos</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(restaurant.signature_dishes && restaurant.signature_dishes.length > 0) ? (
                        restaurant.signature_dishes.map((dish: any, i: number) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface border border-border-subtle relative">
                                    <img 
                                        src={dish.image_url} 
                                        alt={dish.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <h4 className="text-white font-display font-black text-xl italic uppercase tracking-tighter">{dish.name}</h4>
                                        <p className="text-white/70 text-xs mt-2 line-clamp-2">{dish.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Fallback/Placeholder if none defined in DB yet
                        [
                            { name: 'Lagosta à Laurentina', img: 'https://images.unsplash.com/photo-1553603227-2358aabe2b18?w=800&q=80' },
                            { name: 'Frango Zambeziana', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80' },
                            { name: 'Caril de Caranguejo', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80' }
                        ].map((s, i) => (
                            <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-border-subtle">
                                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-display font-black italic uppercase tracking-tighter">{s.name}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* --- MEDIA GALLERY --- */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl md:text-5xl font-display font-black text-text-main italic uppercase tracking-tighter">Ambiance & Gallery</h2>
                    <div className="flex gap-2">
                        {['Date Night', 'Family', 'Business'].map(tag => (
                            <span key={tag} className="px-4 py-1.5 rounded-full bg-surface border border-border-subtle text-[10px] font-black uppercase tracking-widest text-text-dim">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="columns-2 md:columns-3 gap-6 space-y-6">
                    {(restaurant.gallery && restaurant.gallery.length > 0) ? (
                        restaurant.gallery.map((item: any, i: number) => (
                            <div key={i} className="break-inside-avoid relative rounded-[2rem] overflow-hidden group cursor-zoom-in">
                                <img src={item.url} alt={item.title} className="w-full h-auto object-cover" />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                                            <Play fill="white" size={20} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        // Fallback items
                        [
                            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                            'https://images.unsplash.com/photo-1552566626-52f8b828add9',
                            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
                            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
                        ].map((url, i) => (
                            <div key={i} className="break-inside-avoid relative rounded-[2.5rem] overflow-hidden border border-border-subtle">
                                <img src={`${url}?w=800&q=80`} alt="Gallery" className="w-full h-auto object-cover" />
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* --- AWARDS --- */}
            {restaurant.awards && restaurant.awards.length > 0 && (
                <section className="bg-black text-white rounded-[3rem] p-12 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-display font-black italic uppercase tracking-tighter mb-4">Reconhecimento & Prémios</h2>
                            <p className="text-white/50 font-medium text-lg leading-relaxed">O nosso compromisso com a excelência culinária e hospitalidade foi reconhecido por líderes da indústria.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {restaurant.awards.map((award: any, i: number) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center p-4">
                                        <Trophy className="text-primary" size={32} />
                                    </div>
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
