import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ShoppingBag, Plus, Minus, X, ChevronRight, ArrowLeft } from 'lucide-react';

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

/* ─── Category metadata (icons + micro-descriptions) ─────────── */
const CATEGORY_META: Record<string, { icon: string; desc: string }> = {
  'entradas':           { icon: '🥄', desc: 'Sabores para abrir o apetite' },
  'entradas & tapas':   { icon: '🧆', desc: 'Para partilhar' },
  'pratos principais':  { icon: '🍽️', desc: 'O melhor da nossa cozinha' },
  'sobremesas':         { icon: '🍮', desc: 'O doce final perfeito' },
  'bebidas':            { icon: '🥂', desc: 'Para acompanhar' },
  'peixes':             { icon: '🐟', desc: 'Frescos do Índico' },
  'mariscos & peixes':  { icon: '🦐', desc: 'O melhor do mar' },
  'sushi':              { icon: '🍣', desc: 'Rolos, frescos e tradicionais' },
  'tradicionais':       { icon: '🫕', desc: 'Sabor moçambicano' },
  'acompanhamentos':    { icon: '🥗', desc: 'O complemento ideal' },
  'burgers':            { icon: '🍔', desc: 'Artesanais e suculentos' },
  'espetadas':          { icon: '🥩', desc: 'Grelhadas no carvão' },
  'carnes':             { icon: '🥩', desc: 'Premium na brasa' },
  'pastelaria':         { icon: '🥐', desc: 'Doçaria artesanal' },
  'cafés':              { icon: '☕', desc: 'Aromas selecionados' },
};

const getCategoryMeta = (name: string) => {
  const key = name.toLowerCase().trim();
  return CATEGORY_META[key] || { icon: '📋', desc: `Opções de ${name}` };
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  menuCategories,
  restaurantName,
  whatsapp,
}) => {
  const [path, setPath] = useState<MenuCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  /* ─── Cart helpers ──────────────────────────────────────────── */
  const addToCart = useCallback((item: MenuItem, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name && c.categoryName === categoryName);
      if (existing) {
        return prev.map(c =>
          c.name === item.name && c.categoryName === categoryName
            ? { ...c, qty: c.qty + 1 }
            : c
        );
      }
      return [...prev, { ...item, qty: 1, categoryName }];
    });
  }, []);

  const removeFromCart = useCallback((itemName: string, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === itemName && c.categoryName === categoryName);
      if (existing && existing.qty > 1) {
        return prev.map(c =>
          c.name === itemName && c.categoryName === categoryName
            ? { ...c, qty: c.qty - 1 }
            : c
        );
      }
      return prev.filter(c => !(c.name === itemName && c.categoryName === categoryName));
    });
  }, []);

  const getItemQty = useCallback((itemName: string, categoryName: string) => {
    return cart.find(c => c.name === itemName && c.categoryName === categoryName)?.qty || 0;
  }, [cart]);

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);

  /* ─── Navigation Handlers ───────────────────────────────────── */
  const currentCategory = path.length > 0 ? path[path.length - 1] : null;

  const navigateForward = (cat: MenuCategory) => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: () => {
          setPath([...path, cat]);
          gsap.fromTo(containerRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    } else {
      setPath([...path, cat]);
    }
  };

  const navigateBack = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          setPath(path.slice(0, -1));
          gsap.fromTo(containerRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    } else {
      setPath(path.slice(0, -1));
    }
  };

  /* ─── WhatsApp ──────────────────────────────────────────────── */
  const sendToWhatsApp = () => {
    if (!whatsapp || cart.length === 0) return;
    const lines = cart.map(c => `• ${c.qty}x ${c.name} (${c.price})`);
    const msg = `Olá, gostaria de fazer o seguinte pedido no ${restaurantName} via Locais de Moz:\n\n${lines.join('\n')}\n\nObrigado!`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* ─── Render functions ──────────────────────────────────────── */

  const renderBreadcrumb = () => {
    if (path.length === 0) return null;
    return (
      <div className="flex items-center gap-2 mb-6 text-sm text-text-dim px-2">
        <button onClick={navigateBack} className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 font-medium">
          <button onClick={() => setPath([])} className="hover:text-primary transition-colors">Menu</button>
          {path.map((p, i) => (
            <React.Fragment key={p.name}>
              <ChevronRight size={14} className="opacity-50" />
              <button 
                onClick={() => setPath(path.slice(0, i + 1))} 
                className={`transition-colors ${i === path.length - 1 ? 'text-primary font-bold' : 'hover:text-primary'}`}
              >
                {p.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // State 1 & 2: Categories or Subcategories Grid
  const renderCategoriesGrid = (categories: MenuCategory[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, idx) => {
          const meta = getCategoryMeta(cat.name);
          const hasSubs = cat.subcategories && cat.subcategories.length > 0;
          const itemCount = hasSubs ? `${cat.subcategories!.length} seções` : `${cat.items?.length || 0} itens`;

          return (
            <button
              key={idx}
              onClick={() => navigateForward(cat)}
              className="text-left bg-white border border-border-subtle p-5 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {meta.icon}
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-lg mb-0.5">{cat.name}</h3>
                  <p className="text-sm text-text-dim truncate max-w-[200px]">{meta.desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-text-dim/60 bg-bg px-2 py-1 rounded-md uppercase tracking-wider">{itemCount}</span>
                <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight size={16} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // State 3: Items Grid
  const renderItemsList = (items: MenuItem[], categoryName: string) => {
    if (!items || items.length === 0) {
      return <div className="p-8 text-center text-text-dim bg-bg rounded-2xl">Nenhum item nesta categoria.</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        {items.map((item, i) => {
          const qty = getItemQty(item.name, categoryName);
          const description = item.desc || item.description || '';

          return (
            <div key={i} className={`bg-white border rounded-2xl p-5 transition-all overflow-hidden relative ${qty > 0 ? 'border-primary/50 shadow-md' : 'border-border-subtle hover:border-black/10'}`}>
              
              <div className="flex justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <h4 className="font-bold text-text-main text-lg mb-1">{item.name}</h4>
                  {description && <p className="text-sm text-text-dim mb-3 line-clamp-2 md:line-clamp-3">{description}</p>}
                  <span className="font-black text-primary text-xl bg-primary/5 px-3 py-1 rounded-lg inline-block">{item.price}</span>
                </div>
                
                <div className="flex flex-col items-end justify-between shrink-0">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item, categoryName)}
                      className="bg-bg hover:bg-black hover:text-white transition-colors text-text-main font-bold rounded-xl px-4 py-2 flex items-center gap-2 h-10 mt-auto"
                    >
                      <Plus size={16} />
                      <span className="text-sm">Adicionar</span>
                    </button>
                  ) : (
                    <div className="bg-primary text-white rounded-xl flex items-center h-10 mt-auto pl-1 pr-1 overflow-hidden">
                      <button
                        onClick={() => removeFromCart(item.name, categoryName)}
                        className="w-10 h-full flex items-center justify-center hover:bg-black/20 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{qty}</span>
                      <button
                        onClick={() => addToCart(item, categoryName)}
                        className="w-10 h-full flex items-center justify-center hover:bg-black/20 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    );
  };

  const hasSubcategories = currentCategory?.subcategories && currentCategory.subcategories.length > 0;

  return (
    <div className="menu-categories-root w-full max-w-4xl mx-auto">
      
      {/* View Container */}
      <div className="bg-surface rounded-3xl p-2 md:p-4 min-h-[60vh] flex flex-col relative top-0 w-full" ref={containerRef}>
        
        {/* Header / Breadcrumb area */}
        {renderBreadcrumb()}
        
        {path.length === 0 && (
          <div className="mb-6 px-2">
            <h2 className="text-2xl md:text-3xl font-display font-black text-text-main mb-2">Explore o Menu</h2>
            <p className="text-text-dim">Escolha uma categoria para continuar</p>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 w-full pb-20">
          {path.length === 0 && renderCategoriesGrid(menuCategories)}
          {path.length > 0 && hasSubcategories && currentCategory && renderCategoriesGrid(currentCategory.subcategories!)}
          {path.length > 0 && !hasSubcategories && currentCategory && renderItemsList(currentCategory.items || [], currentCategory.name)}
        </div>

      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
          <button
            onClick={() => setShowCart(!showCart)}
            className="pointer-events-auto bg-black text-white px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl hover:scale-105 transition-transform font-bold w-full max-w-md"
          >
            <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-sm">{totalItems}</span>
            </div>
            <span className="flex-1 text-center">Ver o seu pedido</span>
            <ShoppingBag size={20} />
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && totalItems > 0 && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="fixed top-auto bottom-0 left-0 right-0 max-h-[85vh] bg-surface rounded-t-[2rem] z-50 flex flex-col md:max-w-md md:left-auto md:top-0 md:rounded-l-[2rem] md:rounded-tr-none md:h-screen w-full transition-transform">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-display font-black text-2xl">O Seu Pedido</h3>
              <button onClick={() => setShowCart(false)} className="p-2 bg-bg rounded-full hover:bg-black/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              {cart.map((item, i) => (
                <div key={i} className="flex flex-col gap-3 pb-4 border-b border-border-subtle last:border-0 relative">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-bold text-text-main block">{item.name}</span>
                      <span className="text-xs text-text-dim bg-bg px-2 py-0.5 rounded uppercase mt-1 inline-block">
                        {item.categoryName}
                      </span>
                    </div>
                    <span className="font-black text-primary">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-bg rounded-xl flex items-center h-10 w-fit">
                      <button onClick={() => removeFromCart(item.name, item.categoryName)} className="w-10 h-full flex items-center justify-center hover:bg-black/10 transition-colors rounded-l-xl">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                      <button onClick={() => addToCart(item, item.categoryName)} className="w-10 h-full flex items-center justify-center hover:bg-black/10 transition-colors rounded-r-xl">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {whatsapp && (
              <div className="p-6 border-t border-border-subtle bg-bg/50">
                <button onClick={sendToWhatsApp} className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-colors shadow-xl shadow-primary/30">
                  Pedir via WhatsApp
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
