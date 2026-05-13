import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ShoppingBag, Plus, Minus, X, Utensils, CupSoda, IceCream, MessageCircle, ChevronRight, ChevronLeft, Star, StickyNote, Trash2, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import './MenuCategories.css';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

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

type MenuView = 'entry' | 'subcategory' | 'dishes';
type MenuGroup = 'Comida' | 'Bebidas' | 'Sobremesas';

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
  Comida: { icon: <Utensils size={14} />, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80', subtitle: 'Pratos & Entradas' },
  Bebidas: { icon: <CupSoda size={14} />, img: 'https://images.unsplash.com/photo-1536935338218-844c798056d7?w=1200&q=80', subtitle: 'Vinhos & Cocktails' },
  Sobremesas: { icon: <IceCream size={14} />, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80', subtitle: 'Doces & Pastelaria' }
};

const EntryCard = ({ title, config, onClick }: { title: string, config: any, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden rounded-[1.5rem] w-full h-full min-h-[120px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-surface border border-border-subtle"
  >
    <img src={config.img} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/70 transition-colors duration-500" />
    <div className="absolute bottom-3 left-4 text-left z-10 text-white">
      <div className="flex items-center gap-1.5 mb-1 opacity-90">
        <div className="p-1 bg-white/10 backdrop-blur-xl rounded-md border border-white/20">{config.icon}</div>
        <span className="text-[7px] font-black uppercase tracking-[0.25em] opacity-70">{config.subtitle}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-display font-black italic uppercase tracking-tighter leading-none">{title}</h3>
    </div>
  </button>
);

const MenuItemList = ({ item, onAdd, onRemove, qty }: { item: MenuItem, onAdd: () => void, onRemove: () => void, qty: number }) => (
  <div className={`group flex items-center justify-between gap-4 py-3 px-3 rounded-xl transition-all duration-300 cursor-pointer ${qty > 0 ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'border-b border-border-subtle/50 hover:bg-surface'}`}>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-text-main text-[15px] leading-tight">{item.name}</h4>
      {(item.desc || item.description) && <p className="text-text-dim text-xs mt-0.5 leading-relaxed line-clamp-2">{item.desc || item.description}</p>}
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <span className="font-black text-primary text-[15px]">{item.price}</span>
      {qty === 0 ? (
        <button onClick={onAdd} className="px-3 py-1.5 bg-primary text-white font-black text-xs rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-95">
          +
        </button>
      ) : (
        <div className="flex items-center gap-1 bg-primary rounded-lg p-0.5">
          <button onClick={onRemove} className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform">
            {item.qty === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
          </button>
          <span className="w-5 text-center font-black text-xs text-white">{qty}</span>
          <button onClick={onAdd} className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform">
            <Plus size={10} />
          </button>
        </div>
      )}
    </div>
  </div>
);

interface MenuCategoriesProps {
  restaurant: any;
  menuCategories?: MenuCategory[];
  restaurantName?: string;
  whatsapp?: string;
}

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
    const signatures = restaurant?.signature_dishes || [];
    const findImg = (keywords: string[]) => {
      const sigMatch = signatures.find((s: any) => keywords.some(k => s.name.toLowerCase().includes(k) || s.description?.toLowerCase().includes(k)));
      return sigMatch?.image_url || null;
    };
    return {
      Comida: { ...DEFAULT_GROUP_CONFIG.Comida, img: restaurant.menu_food_image || findImg(COMIDA_KEYWORDS) || DEFAULT_GROUP_CONFIG.Comida.img },
      Bebidas: { ...DEFAULT_GROUP_CONFIG.Bebidas, img: restaurant.menu_drinks_image || findImg(BEBIDAS_KEYWORDS) || DEFAULT_GROUP_CONFIG.Bebidas.img },
      Sobremesas: { ...DEFAULT_GROUP_CONFIG.Sobremesas, img: restaurant.menu_desserts_image || findImg(SOBREMESAS_KEYWORDS) || DEFAULT_GROUP_CONFIG.Sobremesas.img }
    };
  }, [restaurant]);

  const [view, setView] = useState<MenuView>('entry');
  const [selectedGroup, setSelectedGroup] = useState<MenuGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const { addToCart, removeFromCart, clearCart, getItemQty, totalItems, grandTotal, setRestaurantContext, cart } = useCart();

  const [showCart, setShowCart] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setRestaurantContext(restaurant.id || restaurant.slug || 'default', restaurantName || 'Restaurante', whatsapp || null);
    }
  }, [restaurant, restaurantName, whatsapp, setRestaurantContext]);

  const viewContainerRef = useRef<HTMLDivElement>(null);

  const getSubcategorySection = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('entradas') || n.includes('aperitivo') || n.includes('começar') || n.includes('frito')) return 'Para Começar';
    if (n.includes('carne') || n.includes('frango') || n.includes('peixe') || n.includes('marisco') || n.includes('prato') || n.includes('grelh')) return 'Pratos Principais';
    if (n.includes('salada') || n.includes('sopa') || n.includes('leve') || n.includes('acompanh') || n.includes('tosta') || n.includes('burger') || n.includes('pizza') || n.includes('pasta')) return 'Leves & Casuais';
    return 'Outros';
  };

  const SECTION_ORDER = ['Para Começar', 'Pratos Principais', 'Leves & Casuais', 'Outros'];

  const groupedMenu = useMemo(() => {
    const result: Record<MenuGroup, MenuCategory[]> = { Comida: [], Bebidas: [], Sobremesas: [] };
    menuCategories.forEach((cat: MenuCategory) => result[getGroup(cat.name)].push(cat));
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

  const navigateTo = (newView: MenuView, group: MenuGroup | null = null, cat: MenuCategory | null = null) => {
    if (!viewContainerRef.current) {
      setView(newView);
      if (group !== undefined) setSelectedGroup(group);
      if (cat !== undefined) setSelectedCategory(cat);
      return;
    }
    gsap.to(viewContainerRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        setView(newView);
        if (group !== undefined) setSelectedGroup(group);
        if (cat !== undefined) setSelectedCategory(cat);
        setExpandedCard(null);
        gsap.fromTo(viewContainerRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    });
  };

  const noteKey = (itemName: string, cat: string) => `${itemName}__${cat}`;

  const sendToWhatsApp = () => {
    if (!whatsapp || cart.length === 0) return;
    const lines = cart.map(c => {
      const note = itemNotes[noteKey(c.name, c.categoryName)];
      return `• ${c.qty}x ${c.name} (${c.price})${note ? ` — Nota: ${note}` : ''}`;
    });
    const totalLine = grandTotal > 0 ? `\n\nTotal estimado: ${grandTotal.toFixed(0)} MZN` : '';
    const msg = `Olá, gostaria de fazer o seguinte pedido no ${restaurantName} via Locais de Moz:\n\n${lines.join('\n')}${totalLine}\n\nObrigado!`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); setShowCart(false); }, 2500);
  };

  const formatTotal = (amount: number) => amount === 0 ? '0 MZN' : `${amount.toFixed(0)} MZN`;

  return (
    <div className="menu-navigator-container">
      <div ref={viewContainerRef} className="view-wrapper">

        {/* LEVEL 1 — Entry */}
        {view === 'entry' && (
          <div className="entry-card-container">
            <div><EntryCard title="Comida" config={GROUP_CONFIG.Comida} onClick={() => navigateTo('subcategory', 'Comida')} /></div>
            <div><EntryCard title="Bebidas" config={GROUP_CONFIG.Bebidas} onClick={() => navigateTo('subcategory', 'Bebidas')} /></div>
            <div><EntryCard title="Sobremesas" config={GROUP_CONFIG.Sobremesas} onClick={() => navigateTo('subcategory', 'Sobremesas')} /></div>
          </div>
        )}

        {/* LEVEL 2 — Subcategories */}
        {view === 'subcategory' && selectedGroup && (
          <div className="animate-in fade-in duration-300">
            {/* Unified nav: back + breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={() => navigateTo('entry', null)}
                className="flex items-center gap-1.5 text-primary font-black uppercase tracking-widest text-[9px] hover:opacity-60 transition-opacity"
              >
                <ChevronLeft size={12} /> Menu
              </button>
              <span className="text-text-dim/30 text-[9px]">/</span>
              <span className="text-text-main font-black uppercase tracking-widest text-[9px]">{selectedGroup}</span>
            </div>

            <div className="netflix-sections-container">
              {(() => {
                const sections = getSubcategorySections(groupedMenu[selectedGroup]);
                return SECTION_ORDER.filter(s => sections[s]?.length > 0).flatMap(section => {
                  const subcategories = sections[section];
                  return (
                    <div key={section} className="netflix-section-group">
                      <h3 className="netflix-section-group-title">{section}</h3>
                      <div className="netflix-section-grid">
                        {subcategories.map((cat: MenuCategory, idx: number) => {
                          const isExpanded = expandedCard === cat.name;
                          return (
                            <div key={idx} className={`netflix-card-container ${isExpanded ? 'is-expanded' : ''}`}>
                              <button
                                onClick={() => setExpandedCard(isExpanded ? null : cat.name)}
                                className={`netflix-card group ${isExpanded ? 'expanded' : ''}`}
                                data-category-type={getCategoryType(cat.name)}
                              >
                                <div className="netflix-card-header">
                                  <div className="netflix-card-info">
                                    <span className="netflix-card-index">0{idx + 1}</span>
                                    <h4 className="netflix-card-title">{cat.name}</h4>
                                  </div>
                                  <div className="netflix-card-count">
                                    {cat.items?.length || 0}
                                    <span className="text-[8px] opacity-40 ml-1">Itens</span>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="netflix-card-preview">
                                    <div className="preview-items-list">
                                      {cat.items?.slice(0, 3).map((item: MenuItem, i: number) => (
                                        <div key={i} className="preview-item">
                                          <div className="preview-item-dot" />
                                          <span className="preview-item-name">{item.name}</span>
                                          <span className="preview-item-price">{item.price}</span>
                                        </div>
                                      ))}
                                      {(cat.items?.length || 0) > 3 && (
                                        <div className="preview-item-more">
                                          Descobrir +{(cat.items?.length || 0) - 3} opções exclusivas
                                        </div>
                                      )}
                                    </div>
                                    <div className="netflix-card-footer">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); navigateTo('dishes', selectedGroup, cat); }}
                                        className="netflix-cta-button"
                                      >
                                        <span>Explorar Seleção</span>
                                        <ChevronRight size={14} strokeWidth={3} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* LEVEL 3 — Dishes */}
        {view === 'dishes' && selectedCategory && (
          <div className="animate-in fade-in duration-300">
            {/* Unified nav: back + breadcrumb */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border-subtle/50">
              <button
                onClick={() => navigateTo('subcategory', selectedGroup)}
                className="flex items-center gap-1.5 text-primary font-black uppercase tracking-widest text-[9px] hover:opacity-60 transition-opacity"
              >
                <ChevronLeft size={12} /> {selectedGroup}
              </button>
              <span className="text-text-dim/30 text-[9px]">/</span>
              <span className="text-text-main font-black uppercase tracking-widest text-[9px]">{selectedCategory.name}</span>
            </div>

            <div className="mb-1">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-display font-black italic uppercase tracking-tighter text-text-main">{selectedCategory.name}</h2>
                <p className="text-[9px] font-black uppercase tracking-widest text-text-dim/60">{selectedCategory.items?.length || 0} itens</p>
              </div>
            </div>

            {/* Dish list */}
            {selectedCategory.items && selectedCategory.items.length > 0 && (
              <div className="menu-list-container">
                {selectedCategory.items.map((item, i) => (
                  <MenuItemList
                    key={i}
                    item={item}
                    qty={getItemQty(item.name, selectedCategory.name)}
                    onAdd={() => addToCart({ ...item, categoryName: selectedCategory.name })}
                    onRemove={() => removeFromCart(item.name, selectedCategory.name)}
                  />
                ))}
              </div>
            )}

            {/* Sub-subcategories */}
            {selectedCategory.subcategories?.filter(sub => sub.name.toLowerCase() !== 'geral').map((sub, i) => (
              <div key={i} className="mt-6 pt-5 border-t border-border-subtle/30">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-bold text-text-main tracking-tight uppercase italic">{sub.name}</h3>
                  <div className="flex-1 h-px bg-border-subtle/20" />
                </div>
                <div className="menu-list-container">
                  {(sub.items || []).map((item, j) => (
                    <MenuItemList
                      key={j}
                      item={item}
                      qty={getItemQty(item.name, sub.name)}
                      onAdd={() => addToCart({ ...item, categoryName: sub.name })}
                      onRemove={() => removeFromCart(item.name, sub.name)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {totalItems > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-bottom duration-400">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-[#111] text-white h-[52px] rounded-2xl flex items-center justify-between px-5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center font-black text-white text-xs shadow-sm">{totalItems}</div>
              <div>
                <span className="font-black uppercase tracking-widest text-[8px] block opacity-50">O Seu Pedido</span>
                <span className="font-black text-sm">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {grandTotal > 0 && <span className="font-black text-primary text-sm">{formatTotal(grandTotal)}</span>}
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><ShoppingBag size={14} className="text-white" /></div>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[110] backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowCart(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[120] bg-surface rounded-t-[2rem] max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-400 lg:max-w-lg lg:left-auto lg:top-0 lg:rounded-l-[2rem] lg:rounded-tr-none lg:h-screen lg:max-h-none">

            {showSuccess ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16 px-8 text-center gap-5">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black italic uppercase tracking-tighter text-text-main">Pedido Enviado!</h3>
                  <p className="text-text-dim text-xs mt-1">A redirecionar para o WhatsApp...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-border-subtle shrink-0">
                  <div>
                    <h3 className="text-xl font-display font-black italic uppercase tracking-tighter">O Seu Pedido</h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-dim opacity-40 mt-0.5">{restaurantName}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cart.length > 0 && (
                      <button onClick={clearCart} className="h-8 px-2.5 rounded-lg bg-bg border border-border-subtle text-text-dim hover:text-red-500 hover:border-red-200 transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Trash2 size={10} /> Limpar
                      </button>
                    )}
                    <button onClick={() => setShowCart(false)} className="w-9 h-9 rounded-lg bg-bg border border-border-subtle flex items-center justify-center hover:bg-black hover:text-white transition-all">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                      <div className="w-16 h-16 bg-bg rounded-2xl border border-border-subtle flex items-center justify-center text-3xl">🛒</div>
                      <p className="font-black text-text-main uppercase tracking-tight text-base">Carrinho vazio</p>
                      <p className="text-text-dim text-xs">Adicione itens do menu</p>
                      <button onClick={() => setShowCart(false)} className="mt-1 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all">
                        Ver Menu
                      </button>
                    </div>
                  ) : (
                    <div>
                      {cart.map((item, i) => {
                        const nk = noteKey(item.name, item.categoryName);
                        const isNoteOpen = expandedNote === nk;
                        return (
                          <div key={i} className="py-3 border-b border-border-subtle/30 last:border-0">
                            <div className="flex items-start gap-3">
                              {item.image_url && (
                                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-bg">
                                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-text-main block leading-snug text-sm">{item.name}</span>
                                <span className="text-[8px] font-black uppercase tracking-wider text-text-dim opacity-50">{item.categoryName}</span>
                                {itemNotes[nk] && !isNoteOpen && <p className="text-[10px] text-text-dim mt-0.5 italic line-clamp-1">📝 {itemNotes[nk]}</p>}
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className="font-black text-primary text-sm">{item.price}</span>
                                <div className="flex items-center gap-1 bg-bg rounded-lg p-0.5 border border-border-subtle shadow-sm">
                                  <button onClick={() => removeFromCart(item.name, item.categoryName)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                    {item.qty === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                                  </button>
                                  <span className="w-4 text-center font-black text-xs">{item.qty}</span>
                                  <button onClick={() => addToCart({ ...item, categoryName: item.categoryName })} className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all">
                                    <Plus size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-1.5 ml-0">
                              {isNoteOpen ? (
                                <input
                                  type="text"
                                  placeholder="Ex: sem cebola..."
                                  value={itemNotes[nk] || ''}
                                  onChange={e => setItemNotes(prev => ({ ...prev, [nk]: e.target.value }))}
                                  onBlur={() => setExpandedNote(null)}
                                  autoFocus
                                  className="flex-1 text-xs bg-bg border border-border-subtle rounded-lg px-3 py-1.5 text-text-main placeholder-text-dim/40 outline-none focus:border-primary/50 transition-colors"
                                />
                              ) : (
                                <button onClick={() => setExpandedNote(nk)} className="flex items-center gap-1 text-[9px] text-text-dim hover:text-primary transition-colors font-black uppercase tracking-wider">
                                  <StickyNote size={9} />
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

                {cart.length > 0 && (
                  <div className="shrink-0 px-6 pt-4 pb-6 border-t border-border-subtle bg-surface">
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-text-dim text-xs font-bold">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                        {grandTotal > 0 && <span className="font-black text-text-main text-xs">{formatTotal(grandTotal)}</span>}
                      </div>
                      {grandTotal > 0 && (
                        <div className="flex items-center justify-between border-t border-border-subtle pt-1.5">
                          <span className="font-black uppercase tracking-wider text-[10px] text-text-main">Total estimado</span>
                          <span className="font-black text-primary text-lg">{formatTotal(grandTotal)}</span>
                        </div>
                      )}
                      <p className="text-[8px] text-text-dim opacity-40 font-bold">* Valor final confirmado pelo restaurante</p>
                    </div>
                    {whatsapp ? (
                      <button onClick={sendToWhatsApp} className="w-full bg-[#25D366] text-white h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-black text-sm shadow-lg hover:bg-[#1ebe5a] hover:scale-[1.01] active:scale-0.98 transition-all">
                        <MessageCircle size={18} fill="white" />
                        Finalizar via WhatsApp
                      </button>
                    ) : (
                      <div className="w-full bg-bg border border-border-subtle h-[52px] rounded-xl flex items-center justify-center text-text-dim text-xs font-bold">
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
    </div>
  );
};

export default MenuCategories;
