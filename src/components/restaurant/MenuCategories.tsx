import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ShoppingBag, Plus, Minus, X, ChevronRight } from 'lucide-react';

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
  'pratos principais':  { icon: '🍽️', desc: 'O melhor da nossa cozinha' },
  'sobremesas':         { icon: '🍮', desc: 'O doce final perfeito' },
  'bebidas':            { icon: '🥂', desc: 'Para acompanhar a refeição' },
  'peixes':             { icon: '🐟', desc: 'Frescos do Índico' },
  'mariscos':           { icon: '🦐', desc: 'Direto da nossa costa' },
  'tradicionais':       { icon: '🫕', desc: 'Sabor autêntico moçambicano' },
  'acompanhamentos':    { icon: '🥗', desc: 'O complemento ideal' },
  'burgers':            { icon: '🍔', desc: 'Artesanais e suculentos' },
  'espetadas':          { icon: '🥩', desc: 'Grelhadas no carvão' },
  'carnes':             { icon: '🥩', desc: 'Seleção premium na brasa' },
  'pastelaria':         { icon: '🥐', desc: 'Doçaria artesanal' },
  'cafés':              { icon: '☕', desc: 'Aromas selecionados' },
};

const getCategoryMeta = (name: string) => {
  const key = name.toLowerCase().trim();
  return CATEGORY_META[key] || { icon: '📋', desc: `${name} do nosso menu` };
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  menuCategories,
  restaurantName,
  whatsapp,
}) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const itemsSectionRef = useRef<HTMLDivElement>(null);
  const categoryGridRef = useRef<HTMLDivElement>(null);

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

  /* ─── Category click handler ────────────────────────────────── */
  const handleCategoryClick = (idx: number) => {
    if (activeCategory === idx) {
      // Collapse: animate out then set null
      if (itemsSectionRef.current) {
        gsap.to(itemsSectionRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => setActiveCategory(null),
        });
      } else {
        setActiveCategory(null);
      }
      return;
    }

    setActiveCategory(idx);
  };

  /* ─── Animate items in when category changes ────────────────── */
  useEffect(() => {
    if (activeCategory === null || !itemsSectionRef.current) return;

    // Smooth scroll to items
    const yOffset = -100;
    const element = itemsSectionRef.current;
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // Animate items
    gsap.fromTo(
      itemsSectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );

    // Stagger individual items
    const items = itemsSectionRef.current.querySelectorAll('.menu-item-card');
    gsap.fromTo(
      items,
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.15 }
    );
  }, [activeCategory]);

  /* ─── Send to WhatsApp ──────────────────────────────────────── */
  const sendToWhatsApp = () => {
    if (!whatsapp || cart.length === 0) return;
    const lines = cart.map(c => `• ${c.qty}x ${c.name} (${c.price})`);
    const msg = `Olá, gostaria de fazer o seguinte pedido no ${restaurantName} via Locais de Moz:\n\n${lines.join('\n')}\n\nObrigado!`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentCategory = activeCategory !== null ? menuCategories[activeCategory] : null;

  return (
    <div className="menu-categories-root">
      {/* ─── Section Title ──────────────────────────────────────── */}
      <div className="menu-section-header">
        <span className="menu-section-label">Cardápio Digital</span>
        <h2 className="menu-section-title">Explore o Menu</h2>
        <p className="menu-section-subtitle">
          Escolha uma categoria para ver os pratos disponíveis
        </p>
      </div>

      {/* ─── Category Grid ──────────────────────────────────────── */}
      <div ref={categoryGridRef} className="category-grid">
        {menuCategories.map((cat, idx) => {
          const meta = getCategoryMeta(cat.name);
          const isActive = activeCategory === idx;
          const itemCount = cat.items?.length || 0;

          return (
            <button
              key={idx}
              onClick={() => handleCategoryClick(idx)}
              className={`category-card ${isActive ? 'category-card--active' : ''}`}
              aria-expanded={isActive}
            >
              <div className="category-card__icon">{meta.icon}</div>
              <div className="category-card__content">
                <h3 className="category-card__name">{cat.name}</h3>
                <p className="category-card__desc">{meta.desc}</p>
              </div>
              <div className="category-card__meta">
                <span className="category-card__count">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
                <ChevronRight
                  size={16}
                  className={`category-card__chevron ${isActive ? 'category-card__chevron--open' : ''}`}
                />
              </div>
              {/* Active indicator bar */}
              <div className={`category-card__indicator ${isActive ? 'category-card__indicator--active' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* ─── Items Section (expands below categories) ───────────── */}
      {currentCategory && (
        <div ref={itemsSectionRef} className="items-section" id="menu-items">
          {/* Items header */}
          <div className="items-section__header">
            <div className="items-section__header-left">
              <span className="items-section__icon">{getCategoryMeta(currentCategory.name).icon}</span>
              <div>
                <h3 className="items-section__title">{currentCategory.name}</h3>
                <p className="items-section__count">{currentCategory.items?.length || 0} pratos disponíveis</p>
              </div>
            </div>
            <button
              onClick={() => setActiveCategory(null)}
              className="items-section__close"
              aria-label="Fechar categoria"
            >
              <X size={18} />
            </button>
          </div>

          {/* Items grid */}
          <div className="items-grid">
            {currentCategory.items?.map((item, i) => {
              const qty = getItemQty(item.name, currentCategory.name);
              const description = item.desc || item.description || '';

              return (
                <div key={i} className="menu-item-card">
                  <div className="menu-item-card__body">
                    <div className="menu-item-card__info">
                      <h4 className="menu-item-card__name">{item.name}</h4>
                      {description && (
                        <p className="menu-item-card__desc">{description}</p>
                      )}
                    </div>
                    <div className="menu-item-card__action">
                      <span className="menu-item-card__price">{item.price}</span>
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item, currentCategory.name)}
                          className="menu-item-card__add-btn"
                          aria-label={`Adicionar ${item.name}`}
                        >
                          <Plus size={16} />
                          <span>Adicionar</span>
                        </button>
                      ) : (
                        <div className="menu-item-card__qty-control">
                          <button
                            onClick={() => removeFromCart(item.name, currentCategory.name)}
                            className="qty-btn qty-btn--minus"
                            aria-label="Remover"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-display">{qty}</span>
                          <button
                            onClick={() => addToCart(item, currentCategory.name)}
                            className="qty-btn qty-btn--plus"
                            aria-label="Adicionar mais"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Progress bar subtle accent */}
                  {qty > 0 && <div className="menu-item-card__selected-bar" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Floating Cart Button ────────────────────────────────── */}
      {totalItems > 0 && (
        <div className="floating-cart-wrapper">
          <button
            onClick={() => setShowCart(!showCart)}
            className="floating-cart-btn"
          >
            <ShoppingBag size={20} />
            <span className="floating-cart-btn__text">
              Ver pedido ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
            </span>
            <span className="floating-cart-btn__badge">{totalItems}</span>
          </button>
        </div>
      )}

      {/* ─── Cart Drawer ─────────────────────────────────────────── */}
      {showCart && totalItems > 0 && (
        <>
          <div className="cart-overlay" onClick={() => setShowCart(false)} />
          <div className="cart-drawer">
            <div className="cart-drawer__header">
              <h3 className="cart-drawer__title">O Seu Pedido</h3>
              <button onClick={() => setShowCart(false)} className="cart-drawer__close">
                <X size={20} />
              </button>
            </div>

            <div className="cart-drawer__items">
              {cart.map((item, i) => (
                <div key={i} className="cart-item">
                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.name}</span>
                    <span className="cart-item__cat">{item.categoryName}</span>
                  </div>
                  <div className="cart-item__right">
                    <div className="cart-item__qty-control">
                      <button onClick={() => removeFromCart(item.name, item.categoryName)} className="qty-btn qty-btn--small">
                        <Minus size={12} />
                      </button>
                      <span className="qty-display--small">{item.qty}</span>
                      <button onClick={() => addToCart(item, item.categoryName)} className="qty-btn qty-btn--small">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="cart-item__price">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {whatsapp && (
              <button onClick={sendToWhatsApp} className="cart-drawer__submit">
                Enviar pedido via WhatsApp
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuCategories;
