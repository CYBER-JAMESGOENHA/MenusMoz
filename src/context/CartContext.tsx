import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  name: string;
  price: string;
  qty: number;
  categoryName: string;
  image_url?: string;
  note?: string;
}

interface CartMetadata {
  restaurantId: string;
  restaurantName: string;
  whatsapp: string | null;
  restaurantSlug?: string;
}

interface CartContextType {
  cart: CartItem[];
  itemNotes: Record<string, string>;
  setItemNote: (key: string, note: string) => void;
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (name: string, categoryName: string) => void;
  updateQty: (name: string, categoryName: string, qty: number) => void;
  clearCart: () => void;
  getItemQty: (name: string, categoryName: string) => number;
  totalItems: number;
  grandTotal: number;
  restaurantId: string | null;
  restaurantName: string | null;
  whatsapp: string | null;
  setRestaurantContext: (id: string, name: string, whatsapp: string | null, slug?: string) => void;
  formatTotal: (amount: number) => string;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_METADATA_KEY = 'menusmoz_cart_metadata';

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  let cleaned = priceStr.replace(/MT|MZN/gi, '').trim();
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(/\./g, '');
  }
  return parseFloat(cleaned) || 0;
};

export const formatPrice = (amount: number): string => {
  if (amount === 0) return '0 MZN';
  return `${amount.toFixed(0)} MZN`;
};

const getStoredMetadata = (): CartMetadata | null => {
  try {
    const saved = localStorage.getItem(CART_METADATA_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveMetadata = (metadata: CartMetadata) => {
  try {
    localStorage.setItem(CART_METADATA_KEY, JSON.stringify(metadata));
  } catch {}
};

const scanAndRestoreCart = (): { cart: CartItem[]; metadata: CartMetadata | null; itemNotes: Record<string, string> } => {
  try {
    const allKeys = Object.keys(localStorage);
    const cartKeys = allKeys.filter(k => k.startsWith('menusmoz_cart_') && k !== CART_METADATA_KEY);
    
    if (cartKeys.length === 0) {
      return { cart: [], metadata: null, itemNotes: {} };
    }

    let mostRecentKey: string | null = null;
    let mostRecentTime = 0;

    for (const key of cartKeys) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const lastModified = localStorage.getItem(`${key}_mtime`);
            const time = lastModified ? parseInt(lastModified, 10) : 0;
            if (time >= mostRecentTime) {
              mostRecentTime = time;
              mostRecentKey = key;
            }
          }
        } catch {}
      }
    }

    if (mostRecentKey) {
      const saved = localStorage.getItem(mostRecentKey);
      const metadata = getStoredMetadata();
      if (saved && metadata) {
        const cart = JSON.parse(saved);
        const itemNotesStr = localStorage.getItem(`${mostRecentKey}_notes`);
        const itemNotes = itemNotesStr ? JSON.parse(itemNotesStr) : {};
        return { cart: Array.isArray(cart) ? cart : [], metadata, itemNotes: typeof itemNotes === 'object' ? itemNotes : {} };
      }
    }

    return { cart: [], metadata: null, itemNotes: {} };
  } catch {
    return { cart: [], metadata: null, itemNotes: {} };
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const restoredData = scanAndRestoreCart();
  
  const [cart, setCart] = useState<CartItem[]>(restoredData.cart);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>(restoredData.itemNotes);
  const [restaurantId, setRestaurantId] = useState<string | null>(restoredData.metadata?.restaurantId || null);
  const [restaurantName, setRestaurantName] = useState<string | null>(restoredData.metadata?.restaurantName || null);
  const [whatsapp, setWhatsapp] = useState<string | null>(restoredData.metadata?.whatsapp || null);

  const CART_KEY = `menusmoz_cart_${restaurantId || 'default'}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {}
  }, [CART_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      localStorage.setItem(`${CART_KEY}_mtime`, Date.now().toString());
      localStorage.setItem(`${CART_KEY}_notes`, JSON.stringify(itemNotes));
      if (restaurantId && restaurantName) {
        saveMetadata({
          restaurantId,
          restaurantName,
          whatsapp,
        });
      }
    } catch {}
  }, [cart, itemNotes, CART_KEY, restaurantId, restaurantName, whatsapp]);

  const setRestaurantContext = (id: string, name: string, wh: string | null, _slug?: string) => {
    if (id !== restaurantId) {
      const newKey = `menusmoz_cart_${id}`;
      try {
        const saved = localStorage.getItem(newKey);
        setCart(saved ? JSON.parse(saved) : []);
      } catch {
        setCart([]);
      }
      setRestaurantId(id);
      setRestaurantName(name);
      setWhatsapp(wh);
    }
  };

  const addToCart = useCallback((item: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name && c.categoryName === item.categoryName);
      if (existing) {
        return prev.map(c =>
          c.name === item.name && c.categoryName === item.categoryName
            ? { ...c, qty: c.qty + 1 }
            : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name} adicionado!`, {
      icon: '🛒',
      style: { borderRadius: '1rem', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
    });
  }, []);

  const removeFromCart = useCallback((name: string, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === name && c.categoryName === categoryName);
      if (existing && existing.qty > 1) {
        return prev.map(c =>
          c.name === name && c.categoryName === categoryName
            ? { ...c, qty: c.qty - 1 }
            : c
        );
      }
      return prev.filter(c => !(c.name === name && c.categoryName === categoryName));
    });
  }, []);

  const updateQty = useCallback((name: string, categoryName: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(c => !(c.name === name && c.categoryName === categoryName)));
    } else {
      setCart(prev =>
        prev.map(c =>
          c.name === name && c.categoryName === categoryName ? { ...c, qty } : c
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setItemNotes({});
  }, []);

  const setItemNote = useCallback((key: string, note: string) => {
    setItemNotes(prev => ({ ...prev, [key]: note }));
  }, []);

  const getItemQty = useCallback((name: string, categoryName: string) => {
    return cart.find(c => c.name === name && c.categoryName === categoryName)?.qty || 0;
  }, [cart]);

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const grandTotal = cart.reduce((sum, c) => sum + parsePrice(c.price) * c.qty, 0);

  return (
    <CartContext.Provider value={{
      cart,
      itemNotes,
      setItemNote,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      getItemQty,
      totalItems,
      grandTotal,
      restaurantId,
      restaurantName,
      whatsapp,
      setRestaurantContext,
      formatTotal: formatPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}