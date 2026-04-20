import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ShoppingBag, Plus, Minus, X, Utensils, CupSoda, IceCream, MessageCircle, ChevronRight, ChevronLeft, ChefHat } from 'lucide-react';
import { gsap } from 'gsap';
import './MenuCategories.css';

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
  restaurant: any;
  menuCategories?: MenuCategory[];
  restaurantName?: string;
  whatsapp?: string;
}

type MenuView = 'entry' | 'subcategory' | 'dishes';
type MenuGroup = 'Comida' | 'Bebidas' | 'Sobremesas';

/* ─── Constants & Helpers ───────────────────────────────────────── */
const COMIDA_KEYWORDS = ['comida', 'entradas', 'pratos', 'carnes', 'peixes', 'mariscos', 'burgers', 'pizzas', 'pastas', 'saladas', 'vegetariano', 'infantil', 'extras', 'acompanhamentos', 'tostas', 'miudezas', 'mutxutxus'];
const SOBREMESAS_KEYWORDS = ['sobremesa', 'doce', 'pastelaria', 'gelado', 'pudim', 'mousse', 'tarte'];
const BEBIDAS_KEYWORDS = ['bebida', 'cocktail', 'cerveja', 'vinho', 'gin', 'café', 'cafes', 'refrigerante', 'agua', 'cidra', 'espirituosa'];

const getGroup = (name: string): MenuGroup => {
  const n = name.toLowerCase();
  if (SOBREMESAS_KEYWORDS.some(k => n.includes(k))) return 'Sobremesas';
  if (BEBIDAS_KEYWORDS.some(k => n.includes(k))) return 'Bebidas';
  return 'Comida';
};

const DEFAULT_GROUP_CONFIG = {
  Comida: {
    icon: <Utensils size={16} />,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    subtitle: 'Pratos Principais & Entradas'
  },
  Bebidas: {
    icon: <CupSoda size={16} />,
    img: 'https://images.unsplash.com/photo-1536935338218-844c798056d7?w=1200&q=80',
    subtitle: 'Vinhos, Cocktails & Refrescos'
  },
  Sobremesas: {
    icon: <IceCream size={16} />,
    img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80',
    subtitle: 'Doces & Pastelaria Fina'
  }
};

/* ─── Sub-Components ──────────────────────────────────────────── */

const EntryCard = ({ title, config, onClick }: { title: string, config: any, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden rounded-[2rem] w-full h-full min-h-[140px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-premium bg-surface border border-border-subtle"
  >
    <img 
      src={config.img} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/60 transition-colors duration-500" />
    
    <div className="absolute bottom-4 left-5 text-left z-10 transition-transform duration-500 group-hover:translate-x-2 text-white">
      <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
        <div className="p-1.5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20">
          {config.icon}
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-70">
          {config.subtitle}
        </span>
      </div>
      <h3 className="text-2xl md:text-3xl font-display font-black italic uppercase tracking-tighter leading-none">
        {title}
      </h3>
    </div>
  </button>
);

const MenuItemCard = ({ item, onAdd, onRemove, qty }: { item: MenuItem, onAdd: () => void, onRemove: () => void, qty: number }) => (
  <div className={`group bg-surface border rounded-[1.5rem] p-4 transition-all duration-300 ${qty > 0 ? 'border-primary/50 shadow-premium' : 'border-border-subtle hover:border-primary/30'}`}>
    <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-bg border border-border-subtle">
      <img 
        src={item.image_url || 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400&q=80'} 
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

const MenuItemList = ({ item, onAdd, onRemove, qty }: { item: MenuItem, onAdd: () => void, onRemove: () => void, qty: number }) => (
  <div className={`group border-b border-border-subtle/50 py-4 transition-all duration-300 ${qty > 0 ? 'bg-primary/5 -mx-4 px-4 rounded-2xl border-x border-t border-b border-primary/30' : ''}`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-text-main text-lg leading-tight">{item.name}</h4>
        {item.desc || item.description ? (
          <p className="text-text-dim text-sm mt-1.5 leading-relaxed">{item.desc || item.description}</p>
        ) : null}
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-black text-primary text-lg">{item.price}</span>
        
        {qty === 0 ? (
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-primary text-white font-black text-sm rounded-xl hover:bg-primary/90 transition-all duration-300 active:scale-95"
          >
            Adicionar
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-primary rounded-xl p-1">
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center font-black text-sm text-white">{qty}</span>
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform"
            >
              <Plus size={12} />
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
  restaurant,
  menuCategories: propCategories,
  restaurantName: propName,
  whatsapp: propWhatsapp,
}) => {
  const menuCategories = propCategories || restaurant?.menuCategories || [];
  const restaurantName = propName || restaurant?.name || '';
  const whatsapp = propWhatsapp || restaurant?.whatsapp || '';

  const GROUP_CONFIG = useMemo(() => {
    const gallery = restaurant?.gallery || [];
    const signatures = restaurant?.signature_dishes || [];
    
    const findImg = (keywords: string[]) => {
      // 1. Try signatures first
      const sigMatch = signatures.find((s: any) => keywords.some(k => s.name.toLowerCase().includes(k) || s.description?.toLowerCase().includes(k)));
      if (sigMatch) return sigMatch.image_url;
      
      // 2. Try gallery
      const gallMatch = gallery.find((g: any) => keywords.some(k => g.title?.toLowerCase().includes(k)));
      if (gallMatch) return gallMatch.url;
      
      return null;
    };

    return {
      Comida: {
        ...DEFAULT_GROUP_CONFIG.Comida,
        img: findImg(COMIDA_KEYWORDS) || DEFAULT_GROUP_CONFIG.Comida.img
      },
      Bebidas: {
        ...DEFAULT_GROUP_CONFIG.Bebidas,
        img: findImg(BEBIDAS_KEYWORDS) || DEFAULT_GROUP_CONFIG.Bebidas.img
      },
      Sobremesas: {
        ...DEFAULT_GROUP_CONFIG.Sobremesas,
        img: findImg(SOBREMESAS_KEYWORDS) || DEFAULT_GROUP_CONFIG.Sobremesas.img
      }
    };
  }, [restaurant]);

  /* ─── State ────────────────────────────────────────────────── */
  const [view, setView] = useState<MenuView>('entry');
  const [selectedGroup, setSelectedGroup] = useState<MenuGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const viewContainerRef = useRef<HTMLDivElement>(null);

  /* ─── Grouping Logic ───────────────────────────────────────── */
const getSubcategorySection = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('entradas') || n.includes('aperitivo') || n.includes('começar') || n.includes('frito')) return 'Para Começar';
  if (n.includes('carne') || n.includes('frango') || n.includes('peixe') || n.includes('marisco') || n.includes('prato') || n.includes('grelh')) return 'Pratos Principais';
  if (n.includes('salada') || n.includes('sopa') || n.includes('leve') || n.includes('acompanh') || n.includes('tosta') || n.includes('burger') || n.includes('pizza') || n.includes('pasta')) return 'Leves & Casuais';
  return 'Outros';
};

const SECTION_ORDER = ['Para Começar', 'Pratos Principais', 'Leves & Casuais', 'Outros'];

const groupedMenu = useMemo(() => {
  const result: Record<MenuGroup, MenuCategory[]> = {
    Comida: [],
    Bebidas: [],
    Sobremesas: []
  };
  menuCategories.forEach(cat => {
    const group = getGroup(cat.name);
    result[group].push(cat);
  });
  return result;
}, [menuCategories]);

const getSubcategorySections = (categories: MenuCategory[]) => {
  const sections: Record<string, MenuCategory[]> = {};
  categories.forEach(cat => {
    const section = getSubcategorySection(cat.name);
    if (!sections[section]) sections[section] = [];
    sections[section].push(cat);
  });
  return sections;
};

  /* ─── Navigation Logic ──────────────────────────────────────── */
  const navigateTo = (newView: MenuView, group: MenuGroup | null = null, cat: MenuCategory | null = null) => {
    const tl = gsap.timeline();
    
    // Smooth transition out
    tl.to(viewContainerRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.2,
      onComplete: () => {
        setView(newView);
        if (group !== undefined) setSelectedGroup(group);
        if (cat !== undefined) setSelectedCategory(cat);
        
        // Final objective transition in
        gsap.fromTo(viewContainerRef.current, 
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
  };

  const handleBack = () => {
    if (view === 'dishes') navigateTo('subcategory', selectedGroup);
    else if (view === 'subcategory') navigateTo('entry', null);
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

  /* ─── Render Helpers ────────────────────────────────────────── */

  const renderBreadcrumbs = () => {
    if (view === 'entry') return null;
    return (
      <nav className="breadcrumb-nav">
        <span className="breadcrumb-item" onClick={() => navigateTo('entry', null)}>MENU</span>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <span 
          className={`breadcrumb-item ${view === 'subcategory' ? 'active' : ''}`}
          onClick={view === 'dishes' ? () => navigateTo('subcategory', selectedGroup) : undefined}
        >
          {selectedGroup}
        </span>
        {view === 'dishes' && (
          <>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{selectedCategory?.name}</span>
          </>
        )}
      </nav>
    );
  };

  return (
    <div className="menu-navigator-container">
      
      {/* 1. HEADER / BREADCRUMBS */}
      <div className="flex flex-col gap-4 mb-2">
        {renderBreadcrumbs()}
        {view !== 'entry' && (
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:opacity-70 transition-opacity w-fit"
          >
            <ChevronLeft size={16} /> Voltar
          </button>
        )}
      </div>

      <div ref={viewContainerRef} className="view-wrapper">
        
        {/* LEVEL 1 — Entry View */}
        {view === 'entry' && (
          <div className="entry-card-container">
             <div>
               <EntryCard title="Comida" config={GROUP_CONFIG.Comida} onClick={() => navigateTo('subcategory', 'Comida')} />
             </div>
             <div>
               <EntryCard title="Sobremesas" config={GROUP_CONFIG.Sobremesas} onClick={() => navigateTo('subcategory', 'Sobremesas')} />
             </div>
             <div>
               <EntryCard title="Bebidas" config={GROUP_CONFIG.Bebidas} onClick={() => navigateTo('subcategory', 'Bebidas')} />
             </div>
          </div>
        )}

        {/* LEVEL 2 — Subcategories View */}
        {view === 'subcategory' && selectedGroup && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center text-primary">
                {GROUP_CONFIG[selectedGroup].icon}
              </div>
              <h2 className="text-4xl font-display font-black italic uppercase tracking-tighter text-text-main line-clamp-1">
                {selectedGroup}
              </h2>
            </div>
            
            {(() => {
              const sections = getSubcategorySections(groupedMenu[selectedGroup]);
              return SECTION_ORDER.filter(s => sections[s]?.length > 0).map(section => (
                <div key={section} className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-wider text-text-main pl-1">{section}</h3>
                  <div className="flex gap-4 overflow-x-auto netflix-section pb-2 px-1">
                    {sections[section].map((cat, idx) => {
                      const isExpanded = expandedCard === `${selectedGroup}-${cat.name}`;
                      const trendingItems = cat.items?.slice(0, 3) || [];
                      const isHero = idx === 0;
                      
                      return (
                        <button 
                          key={idx}
                          onClick={() => setExpandedCard(isExpanded ? null : `${selectedGroup}-${cat.name}`)}
                          className={`relative netflix-card group bg-surface border rounded-3xl p-5 text-left transition-all duration-300 ${
                            isExpanded 
                              ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                              : 'border-border-subtle hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]'
                          } ${isHero ? 'w-80 md:w-96' : 'w-48 md:w-56'}`}
                        >
                          <span className={`font-bold text-lg text-text-main block mb-2 transition-colors ${isExpanded ? 'text-primary' : 'group-hover:text-primary'}`}>
                            {cat.name}
                          </span>
                          
                          <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'mt-3' : ''}`}>
                            {isExpanded && (
                              <div className="space-y-2 mt-2 animate-in fade-in duration-200">
                                {trendingItems.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm border-b border-border-subtle/50 pb-2">
                                    <span className="text-text-main font-medium truncate flex-1 mr-2">{item.name}</span>
                                    <span className="text-primary font-black shrink-0">{item.price}</span>
                                  </div>
                                ))}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateTo('dishes', selectedGroup, cat);
                                    setExpandedCard(null);
                                  }}
                                  className="w-full mt-3 py-2.5 bg-primary text-white font-black text-sm rounded-xl hover:bg-primary/90 transition-colors"
                                >
                                  Ver Menu Completo
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute bottom-3 right-3 opacity-5 pointer-events-none">
                            <ChefHat className="w-16 h-16" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* LEVEL 3 — Dishes View */}
        {view === 'dishes' && selectedCategory && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between border-b border-border-subtle pb-6">
              <div>
                <h2 className="text-4xl font-display font-black italic uppercase tracking-tighter text-text-main">
                  {selectedCategory.name}
                </h2>
                <p className="text-text-dim text-[10px] uppercase font-black tracking-[0.4em] mt-2">
                  {selectedCategory.items?.length || 0} Itens Disponíveis
                </p>
              </div>
              <button 
                onClick={() => navigateTo('subcategory', selectedGroup)}
                className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:opacity-70 transition-opacity"
              >
                <ChevronLeft size={16} /> Voltar
              </button>
            </div>

            {/* Direct Dishes - List View */}
            {selectedCategory.items && selectedCategory.items.length > 0 && (
              <div className="menu-list-container">
                {selectedCategory.items.map((item, i) => (
                  <MenuItemList 
                    key={i} 
                    item={item} 
                    qty={getItemQty(item.name, selectedCategory.name)}
                    onAdd={() => addToCart(item, selectedCategory.name)}
                    onRemove={() => removeFromCart(item.name, selectedCategory.name)}
                  />
                ))}
              </div>
            )}

            {/* Nested Sub-subcategories */}
            {selectedCategory.subcategories?.filter(sub => sub.name.toLowerCase() !== 'geral').map((sub, i) => (
              <div key={i} className="space-y-6 pt-8 border-t border-border-subtle/30">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-text-main tracking-tight uppercase italic">{sub.name}</h3>
                  <div className="flex-1 h-px bg-border-subtle/30" />
                </div>
                <div className="menu-list-container">
                  {(sub.items || []).map((item, j) => (
                    <MenuItemList 
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
        )}
      </div>

      {/* 3. Floating Cart UI (Preserved) */}
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

      {/* Cart Drawer Overlay (Preserved) */}
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
