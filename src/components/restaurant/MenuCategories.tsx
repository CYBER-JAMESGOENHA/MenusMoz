import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ShoppingBag, Plus, Minus, X, Utensils, CupSoda, IceCream, MessageCircle, ChevronRight, ChevronLeft, ChefHat, Star, StickyNote, Trash2, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import './MenuCategories.css';
import { translations } from '../../translations';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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
  note?: string;
}

/* ─── Price Parsing ─────────────────────────────────────────────── */
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  // Handle formats like "350 MZN", "350MTn", "350,00", "350.00", "MZN 350"
  const cleaned = priceStr.replace(/[^\d,.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const formatTotal = (amount: number): string => {
  if (amount === 0) return '0 MZN';
  return `${amount.toFixed(0)} MZN`;
};

interface MenuCategoriesProps {
  restaurant: any;
  menuCategories?: MenuCategory[];
  restaurantName?: string;
  whatsapp?: string;
  user?: any;
  lang?: string;
  t?: any;
  onLoginOpen?: () => void;
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

const getCategoryType = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('carne') || n.includes('frango') || n.includes('bife') || n.includes('picanha') || n.includes('steak') || n.includes('burguer') || n.includes('chicken')) return 'meat';
  if (n.includes('marisco') || n.includes('peixe') || n.includes('camarão') || n.includes('lagosta') || n.includes('sushi') || n.includes('fish') || n.includes('seafood') || n.includes('shrimp')) return 'seafood';
  if (n.includes('vegetariano') || n.includes('salada') || n.includes('vegan') || n.includes('veggie') || n.includes('salad') || n.includes('legumes')) return 'veggie';
  if (n.includes('massa') || n.includes('pasta') || n.includes('pizza') || n.includes('esparguete') || n.includes('lasanha') || n.includes('spaghetti')) return 'pasta';
  if (n.includes('bebida') || n.includes('cocktail') || n.includes('vinho') || n.includes('cerveja') || n.includes('sumo') || n.includes('drink') || n.includes('juice') || n.includes('wine') || n.includes('beer')) return 'drink';
  if (n.includes('sobremesa') || n.includes('doce') || n.includes('gelado') || n.includes('bolo') || n.includes('dessert') || n.includes('sweet') || n.includes('cake') || n.includes('ice cream')) return 'dessert';
  return 'default';
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
        img: restaurant.menu_food_image || findImg(COMIDA_KEYWORDS) || DEFAULT_GROUP_CONFIG.Comida.img
      },
      Bebidas: {
        ...DEFAULT_GROUP_CONFIG.Bebidas,
        img: restaurant.menu_drinks_image || findImg(BEBIDAS_KEYWORDS) || DEFAULT_GROUP_CONFIG.Bebidas.img
      },
      Sobremesas: {
        ...DEFAULT_GROUP_CONFIG.Sobremesas,
        img: restaurant.menu_desserts_image || findImg(SOBREMESAS_KEYWORDS) || DEFAULT_GROUP_CONFIG.Sobremesas.img
      }
    };
  }, [restaurant]);

  /* ─── State ────────────────────────────────────────────────── */
  const [view, setView] = useState<MenuView>('entry');
  const [selectedGroup, setSelectedGroup] = useState<MenuGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  
  const CART_KEY = `menusmoz_cart_${restaurant?.id || restaurant?.slug || 'default'}`;

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, CART_KEY]);
  
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
        setExpandedCard(null);
        
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
    // Micro-feedback toast
    toast.success(`${item.name} adicionado!`, {
      icon: '🛒',
      duration: 1500,
      style: { fontSize: '0.75rem' }
    });
  }, []);

  const removeFromCart = useCallback((itemName: string, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === itemName && c.categoryName === categoryName);
      if (existing && existing.qty > 1) return prev.map(c => c.name === itemName && c.categoryName === categoryName ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => !(c.name === itemName && c.categoryName === categoryName));
    });
  }, []);

  const removeItemCompletely = useCallback((itemName: string, categoryName: string) => {
    setCart(prev => prev.filter(c => !(c.name === itemName && c.categoryName === categoryName)));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setItemNotes({});
  }, []);

  const getItemQty = (itemName: string, categoryName: string) => 
    cart.find(c => c.name === itemName && c.categoryName === categoryName)?.qty || 0;

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);

  const grandTotal = useMemo(() => {
    return cart.reduce((sum, c) => sum + parsePrice(c.price) * c.qty, 0);
  }, [cart]);

  const noteKey = (itemName: string, cat: string) => `${itemName}__${cat}`;

  const sendToWhatsApp = () => {
    if (!whatsapp || cart.length === 0) return;
    const lines = cart.map(c => {
      const note = itemNotes[noteKey(c.name, c.categoryName)];
      return `• ${c.qty}x ${c.name} (${c.price})${note ? ` — Nota: ${note}` : ''}`;
    });
    const totalLine = grandTotal > 0 ? `\n\nTotal estimado: ${formatTotal(grandTotal)}` : '';
    const msg = `Olá, gostaria de fazer o seguinte pedido no ${restaurantName} via Locais de Moz:\n\n${lines.join('\n')}${totalLine}\n\nObrigado!`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    // Show success state
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowCart(false);
      clearCart();
    }, 2500);
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
                <EntryCard title="Bebidas" config={GROUP_CONFIG.Bebidas} onClick={() => navigateTo('subcategory', 'Bebidas')} />
              </div>
              <div>
                <EntryCard title="Sobremesas" config={GROUP_CONFIG.Sobremesas} onClick={() => navigateTo('subcategory', 'Sobremesas')} />
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
            
            <div className="netflix-sections-container">
              {(() => {
                const sections = getSubcategorySections(groupedMenu[selectedGroup]);
                
                // Helper to chunk array
                const chunkArray = (arr, size) => {
                  const chunks = [];
                  for (let i = 0; i < arr.length; i += size) {
                    chunks.push(arr.slice(i, i + size));
                  }
                  return chunks;
                };

                return SECTION_ORDER.filter(s => sections[s]?.length > 0).flatMap(section => {
                  const subcategories = sections[section];
                  const chunks = chunkArray(subcategories, 3);
                  
                  return chunks.map((chunk, chunkIdx) => (
                    <div key={`${section}-${chunkIdx}`} className="netflix-section-group">
                      <h3 className="netflix-section-group-title">
                        {chunkIdx === 0 ? section : `${section} (...)`}
                      </h3>
                      <div className="netflix-section-grid pb-2">
                        {chunk.map((cat, idx) => {
                          const isExpanded = expandedCard === cat.name;
                          return (
                            <div 
                              key={idx}
                              className={`netflix-card-container ${isExpanded ? 'is-expanded' : ''}`}
                            >
                              <button 
                                onClick={() => setExpandedCard(isExpanded ? null : cat.name)}
                                className={`netflix-card group ${isExpanded ? 'expanded' : ''}`}
                                data-category-type={getCategoryType(cat.name)}
                              >
                                <h4 className="netflix-card-title">
                                  {cat.name}
                                </h4>
                                
                                {isExpanded && (
                                  <div className="netflix-card-preview animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="preview-items-list">
                                      {cat.items?.slice(0, 3).map((item, i) => (
                                        <div key={i} className="preview-item line-clamp-1">
                                          {item.name}
                                        </div>
                                      ))}
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateTo('dishes', selectedGroup, cat);
                                      }}
                                      className="netflix-cta-button"
                                    >
                                      Ver Cardápio <ChevronRight size={14} />
                                    </button>
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                });
              })()}
            </div>
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

      {/* 3. Floating Cart Bar — UberEats style */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-bottom duration-500">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-[#111] text-white h-[60px] rounded-2xl flex items-center justify-between px-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-white text-sm shadow-sm">
                {totalItems}
              </div>
              <div className="text-left">
                <span className="font-black uppercase tracking-widest text-[9px] block opacity-60">O Seu Pedido</span>
                <span className="font-black text-sm">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {grandTotal > 0 && (
                <span className="font-black text-primary text-base">{formatTotal(grandTotal)}</span>
              )}
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                <ShoppingBag size={16} className="text-white" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer — Premium UberEats-inspired */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[110] backdrop-blur-md animate-in fade-in" onClick={() => setShowCart(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[120] bg-surface rounded-t-[2.5rem] max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500 lg:max-w-lg lg:left-auto lg:top-0 lg:rounded-l-[2.5rem] lg:rounded-tr-none lg:h-screen lg:max-h-none">
            
            {/* Success State */}
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center flex-1 py-20 px-8 text-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter text-text-main">Pedido Enviado!</h3>
                  <p className="text-text-dim text-sm mt-2">A redirecionar para o WhatsApp do restaurante...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-border-subtle shrink-0">
                  <div>
                    <h3 className="text-2xl font-display font-black italic uppercase tracking-tighter">O Seu Pedido</h3>
                    <p className="text-text-dim text-[9px] font-black uppercase tracking-widest opacity-50 mt-0.5">{restaurantName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="h-9 px-3 rounded-xl bg-bg border border-border-subtle text-text-dim hover:text-red-500 hover:border-red-200 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Limpar
                      </button>
                    )}
                    <button 
                      onClick={() => setShowCart(false)}
                      className="w-10 h-10 rounded-xl bg-bg border border-border-subtle flex items-center justify-center hover:bg-black hover:text-white transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-7 py-5">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                      <div className="w-20 h-20 bg-bg rounded-3xl border border-border-subtle flex items-center justify-center text-4xl">
                        🛒
                      </div>
                      <div>
                        <p className="font-black text-text-main uppercase tracking-tight text-lg">Carrinho vazio</p>
                        <p className="text-text-dim text-sm mt-1">Adicione itens do menu para começar</p>
                      </div>
                      <button
                        onClick={() => setShowCart(false)}
                        className="mt-2 px-6 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all"
                      >
                        Ver Menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {cart.map((item, i) => {
                        const nk = noteKey(item.name, item.categoryName);
                        const isNoteOpen = expandedNote === nk;
                        return (
                          <div key={i} className="py-4 border-b border-border-subtle/40 last:border-0">
                            <div className="flex items-start gap-3">
                              {/* Thumbnail */}
                              {item.image_url && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border-subtle bg-bg">
                                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-text-main block leading-snug text-base">{item.name}</span>
                                <span className="text-[9px] font-black uppercase tracking-wider text-text-dim opacity-60">{item.categoryName}</span>
                                {/* Note preview */}
                                {itemNotes[nk] && !isNoteOpen && (
                                  <p className="text-[11px] text-text-dim mt-1 italic line-clamp-1">📝 {itemNotes[nk]}</p>
                                )}
                              </div>
                              {/* Right side: price + qty */}
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="font-black text-primary text-base">{item.price}</span>
                                <div className="flex items-center gap-1.5 bg-bg rounded-xl p-1 border border-border-subtle shadow-sm">
                                  <button
                                    onClick={() => removeFromCart(item.name, item.categoryName)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                                  >
                                    {item.qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                                  </button>
                                  <span className="w-5 text-center font-black text-sm">{item.qty}</span>
                                  <button
                                    onClick={() => addToCart(item, item.categoryName)}
                                    className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all"
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Special note toggle */}
                            <div className="mt-2 ml-0">
                              {isNoteOpen ? (
                                <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                                  <input
                                    type="text"
                                    placeholder="Ex: sem cebola, bem passado..."
                                    value={itemNotes[nk] || ''}
                                    onChange={e => setItemNotes(prev => ({ ...prev, [nk]: e.target.value }))}
                                    onBlur={() => setExpandedNote(null)}
                                    autoFocus
                                    className="flex-1 text-xs bg-bg border border-border-subtle rounded-xl px-3 py-2 text-text-main placeholder-text-dim/40 outline-none focus:border-primary/50 transition-colors"
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => setExpandedNote(nk)}
                                  className="flex items-center gap-1.5 text-[10px] text-text-dim hover:text-primary transition-colors mt-1.5 font-black uppercase tracking-wider"
                                >
                                  <StickyNote size={11} />
                                  {itemNotes[nk] ? 'Editar nota' : 'Adicionar nota'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer — Total + CTA */}
                {cart.length > 0 && (
                  <div className="shrink-0 px-7 pt-5 pb-8 border-t border-border-subtle bg-surface">
                    {/* Order summary */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-text-dim text-sm font-bold">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                        {grandTotal > 0 && (
                          <span className="font-black text-text-main text-sm">{formatTotal(grandTotal)}</span>
                        )}
                      </div>
                      {grandTotal > 0 && (
                        <div className="flex items-center justify-between border-t border-border-subtle pt-2">
                          <span className="font-black uppercase tracking-wider text-xs text-text-main">Total estimado</span>
                          <span className="font-black text-primary text-xl">{formatTotal(grandTotal)}</span>
                        </div>
                      )}
                      <p className="text-[9px] text-text-dim opacity-50 font-bold">* O valor final será confirmado pelo restaurante</p>
                    </div>

                    {whatsapp ? (
                      <button 
                        onClick={sendToWhatsApp}
                        className="w-full bg-[#25D366] text-white h-[60px] rounded-2xl flex items-center justify-center gap-3 font-black text-base shadow-lg hover:bg-[#1ebe5a] hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        <MessageCircle size={22} fill="white" />
                        Finalizar via WhatsApp
                      </button>
                    ) : (
                      <div className="w-full bg-bg border border-border-subtle h-[60px] rounded-2xl flex items-center justify-center text-text-dim text-sm font-bold">
                        WhatsApp não disponível
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {view === 'entry' && restaurant && (
        <div className="mt-16 pt-12 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-black uppercase tracking-tighter text-text-main">
              Reviews
            </h2>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-black text-text-main">{restaurant.rating || '0.0'}</span>
              <span className="text-text-dim text-sm">({restaurant.review_count || 0})</span>
            </div>
          </div>

          <div className="space-y-4">
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.slice(0, 3).map((review: any, idx: number) => (
                <div key={idx} className="bg-surface border border-border-subtle rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-white font-black">
                        {(review.user_name || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-text-main">{review.user_name || 'Anónimo'}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-text-dim'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-text-dim text-sm">{review.date || ''}</span>
                  </div>
                  <p className="text-text-main text-sm leading-relaxed">{review.text || review.comment || ''}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-dim">
                <p>Ainda não há reviews.</p>
              </div>
            )}
          </div>

          {restaurant.reviews && restaurant.reviews.length > 3 && (
            <button className="w-full mt-6 py-4 border border-border-subtle rounded-2xl font-bold text-text-main hover:bg-surface transition-all">
              Ver todas as reviews
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default MenuCategories;
