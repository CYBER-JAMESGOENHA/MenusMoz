import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ShoppingBag, Plus, Minus, X, Utensils, CupSoda, IceCream, MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/* ─── Types ─────────────────────────────────────────────────────── */
interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  description?: string;
  priceValue?: number;
  image_url?: string;
}

interface MenuCategory {
  name: string;
  items?: MenuItem[];
  subcategories?: MenuCategory[];
}

interface CartItem extends MenuItem {
  qty: number;
  categoryName: string;
}

interface MenuCategoriesProps {
  menuCategories: MenuCategory[];
  restaurantName: string;
  whatsapp?: string;
}

/* ─── Grouping Logic ─────────────────────────────────────────── */
const COMIDA_KEYWORDS = ['comida', 'entradas', 'pratos', 'carnes', 'peixes', 'mariscos', 'burgers', 'pizzas', 'pastas', 'saladas', 'vegetariano', 'infantil', 'extras', 'acompanhamentos', 'tostas', 'miudezas', 'mutxutxus'];
const SOBREMESAS_KEYWORDS = ['sobremesa', 'doce', 'pastelaria', 'gelado', 'pudim', 'mousse', 'tarte'];
const BEBIDAS_KEYWORDS = ['bebida', 'cocktail', 'cerveja', 'vinho', 'gin', 'café', 'cafes', 'refrigerante', 'agua', 'cidra', 'espirituosa'];

const getGroup = (name: string): 'Comida' | 'Bebidas' | 'Sobremesas' => {
  const n = name.toLowerCase();
  if (SOBREMESAS_KEYWORDS.some(k => n.includes(k))) return 'Sobremesas';
  if (BEBIDAS_KEYWORDS.some(k => n.includes(k))) return 'Bebidas';
  return 'Comida';
};

const GROUP_CONFIG = {
  Comida: {
    icon: <Utensils size={24} />,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    subtitle: 'Pratos Principais & Entradas'
  },
  Bebidas: {
    icon: <CupSoda size={24} />,
    img: 'https://images.unsplash.com/photo-1536935338218-844c798056d7?w=1200&q=80',
    subtitle: 'Vinhos, Cocktails & Refrescos'
  },
  Sobremesas: {
    icon: <IceCream size={24} />,
    img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80',
    subtitle: 'Doces & Pastelaria Fina'
  }
};

/* ─── Sub-Components ──────────────────────────────────────────── */

const EntryCard = ({ title, config, onClick, isTall = false }: { title: string, config: any, onClick: () => void, isTall?: boolean }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden rounded-[2.5rem] w-full h-full transition-all duration-500 hover:scale-[1.04] active:scale-[0.98] shadow-premium"
  >
    <img 
      src={config.img} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/60 transition-colors duration-500" />
    
    <div className="absolute bottom-8 left-8 text-left z-10 transition-transform duration-500 group-hover:translate-x-2 text-white">
      <div className="flex items-center gap-3 mb-3 opacity-90">
        <div className="p-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          {config.icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
          {config.subtitle}
        </span>
      </div>
      <h3 className="text-4xl md:text-5xl font-display font-black italic uppercase tracking-tighter leading-none">
        {title}
      </h3>
    </div>
  </button>
);

const MenuItemCard = ({ item, onAdd, onRemove, qty }: { item: MenuItem, onAdd: () => void, onRemove: () => void, qty: number }) => (
  <div className={`group bg-surface border rounded-[1.5rem] p-4 transition-all duration-300 ${qty > 0 ? 'border-primary/50 shadow-premium' : 'border-border-subtle hover:border-primary/30'}`}>
    <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
      <img 
        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'} 
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {qty > 0 && (
        <div className="absolute top-3 right-3 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg animate-in zoom-in">
          {qty}
        </div>
      )}
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-bold text-text-main text-base line-clamp-2 leading-tight">{item.name}</h4>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="font-black text-primary text-lg">{item.price}</span>
        
        {qty === 0 ? (
          <button
            onClick={onAdd}
            className="w-10 h-10 rounded-xl bg-bg border border-border-subtle flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Plus size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-1 border border-primary/20">
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center font-black text-xs text-primary">{qty}</span>
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm active:scale-90 transition-transform"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  menuCategories,
  restaurantName,
  whatsapp,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const groupedMenu = useMemo(() => {
    const result = {
      Comida: [] as MenuCategory[],
      Bebidas: [] as MenuCategory[],
      Sobremesas: [] as MenuCategory[]
    };
    
    menuCategories.forEach(cat => {
      const group = getGroup(cat.name);
      result[group].push(cat);
    });
    
    return result;
  }, [menuCategories]);

  const scrollToSection = (id: string) => {
    gsap.to(window, {
      duration: 0.6,
      scrollTo: { y: `#${id}`, offsetY: 40 },
      ease: 'power3.inOut'
    });
  };

  /* ─── Cart Logic ────────────────────────────────────────────── */
  const addToCart = useCallback((item: MenuItem, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name && c.categoryName === categoryName);
      if (existing) return prev.map(c => c.name === item.name && c.categoryName === categoryName ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1, categoryName }];
    });
  }, []);

  const removeFromCart = useCallback((itemName: string, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === itemName && c.categoryName === categoryName);
      if (existing && existing.qty > 1) return prev.map(c => c.name === itemName && c.categoryName === categoryName ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => !(c.name === itemName && c.categoryName === categoryName));
    });
  }, []);

  const getItemQty = (itemName: string, categoryName: string) => 
    cart.find(c => c.name === itemName && c.categoryName === categoryName)?.qty || 0;

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);

  const sendToWhatsApp = () => {
    if (!whatsapp || cart.length === 0) return;
    const lines = cart.map(c => `• ${c.qty}x ${c.name} (${c.price})`);
    const msg = `Olá, gostaria de fazer o seguinte pedido no ${restaurantName} via Locais de Moz:\n\n${lines.join('\n')}\n\nObrigado!`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div ref={containerRef} className="w-full space-y-20">
      
      {/* 1. Pinterest-Style Entry Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-[2] min-h-[250px]">
            <EntryCard title="Comida" config={GROUP_CONFIG.Comida} onClick={() => scrollToSection('Comida')} />
          </div>
          <div className="flex-[1] min-h-[150px]">
            <EntryCard title="Sobremesas" config={GROUP_CONFIG.Sobremesas} onClick={() => scrollToSection('Sobremesas')} />
          </div>
        </div>
        
        {/* RIGHT COLUMN */}
        <div className="h-full min-h-[400px]">
          <EntryCard isTall title="Bebidas" config={GROUP_CONFIG.Bebidas} onClick={() => scrollToSection('Bebidas')} />
        </div>
      </div>

      {/* 2. Structured Menu Below */}
      <div className="space-y-32 pt-10">
        {(Object.entries(groupedMenu) as ['Comida' | 'Bebidas' | 'Sobremesas', MenuCategory[]][]).map(([groupName, categories]) => {
          if (categories.length === 0) return null;
          
          return (
            <section 
              key={groupName} 
              id={groupName}
              ref={el => sectionsRef.current[groupName] = el}
              className="scroll-mt-32"
            >
              {/* Group Header */}
              <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 rounded-3xl bg-surface border border-border-subtle flex items-center justify-center text-primary shadow-sm">
                  {GROUP_CONFIG[groupName].icon}
                </div>
                <div>
                  <h2 className="text-5xl md:text-6xl font-display font-black text-text-main italic uppercase tracking-tighter leading-none">
                    {groupName}
                  </h2>
                  <p className="text-text-dim/60 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
                    {categories.length} Categorias Reais
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border-subtle to-transparent ml-8" />
              </div>

              {/* Subcategories */}
              <div className="space-y-24">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-10">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-text-main tracking-tight whitespace-nowrap">
                        {cat.name}
                      </h3>
                      <div className="flex-1 h-px bg-border-subtle/40" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(cat.items || []).map((item, i) => (
                        <MenuItemCard 
                          key={i} 
                          item={item} 
                          qty={getItemQty(item.name, cat.name)}
                          onAdd={() => addToCart(item, cat.name)}
                          onRemove={() => removeFromCart(item.name, cat.name)}
                        />
                      ))}
                    </div>

                    {cat.subcategories?.map((sub, i) => (
                      <div key={i} className="pl-6 border-l-2 border-primary/10 space-y-10 mt-12">
                         <div className="flex items-center gap-4">
                            <h4 className="text-xl font-bold text-text-dim tracking-tight italic">
                              {sub.name}
                            </h4>
                            <div className="flex-1 h-px bg-border-subtle/20" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(sub.items || []).map((item, j) => (
                              <MenuItemCard 
                                key={j} 
                                item={item} 
                                qty={getItemQty(item.name, sub.name)}
                                onAdd={() => addToCart(item, sub.name)}
                                onRemove={() => removeFromCart(item.name, sub.name)}
                              />
                            ))}
                          </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 3. Floating Cart UI */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-black text-white h-16 rounded-2xl flex items-center justify-between px-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black animate-pulse">
                {totalItems}
              </div>
              <span className="font-black uppercase tracking-widest text-[10px]">O Seu Pedido</span>
            </div>
            <ShoppingBag size={20} className="text-primary" />
          </button>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[110] backdrop-blur-md animate-in fade-in" onClick={() => setShowCart(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[120] bg-surface rounded-t-[3rem] p-8 max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500 lg:max-w-lg lg:left-auto lg:top-0 lg:rounded-l-[3rem] lg:rounded-tr-none lg:h-screen lg:max-h-none">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-display font-black italic uppercase tracking-tighter">O Seu Pedido</h3>
                <p className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">Confirmar detalhes no WhatsApp</p>
              </div>
              <button 
                onClick={() => setShowCart(false)}
                className="w-12 h-12 rounded-2xl bg-bg border border-border-subtle flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              {cart.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4 pb-6 border-b border-border-subtle/50 last:border-0 relative">
                  <div className="space-y-2">
                    <span className="font-bold text-text-main block leading-snug">{item.name}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-text-dim px-2.5 py-1 bg-bg border border-border-subtle rounded-lg block w-fit">{item.categoryName}</span>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="font-black text-primary text-lg">{item.price}</span>
                    <div className="flex items-center gap-2 bg-bg rounded-xl p-1 border border-border-subtle shadow-sm">
                      <button onClick={() => removeFromCart(item.name, item.categoryName)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-all"><Minus size={12} /></button>
                      <span className="w-6 text-center font-black text-xs">{item.qty}</span>
                      <button onClick={() => addToCart(item, item.categoryName)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-all"><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {whatsapp && (
              <div className="mt-8 pt-8 border-t border-border-subtle">
                <button 
                  onClick={sendToWhatsApp}
                  className="w-full bg-primary text-white h-18 rounded-2xl flex items-center justify-center gap-4 font-black text-xl shadow-primary-glow hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle size={28} /> Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default MenuCategories;
