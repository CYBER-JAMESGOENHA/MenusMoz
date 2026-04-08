import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { restaurantService } from '../services/restaurantService';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  email?: string;
}

export const useFavorites = (user: User | null) => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('locais-moz-favorites');
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(id => Number(id))
        .filter(id => !Number.isNaN(id));
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('locais-moz-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const syncFavorites = useCallback(async () => {
    if (!user || !isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('restaurant_id')
        .eq('user_id', user.id);
      
      if (!error && data) {
        const dbIds = data
          .map(f => Number(f.restaurant_id))
          .filter(id => !Number.isNaN(id));
        // When logged in, Supabase is the source of truth
        setFavorites(dbIds);
      }
    } catch (err) {
      console.error('Sync favorites error:', err);
    }
  }, [user]);

  useEffect(() => {
    syncFavorites();
  }, [syncFavorites]);

  const toggleFavorite = async (id: string | number) => {
    const restaurantId = Number(id);
    if (Number.isNaN(restaurantId)) return;
    
    const isCurrentlyFavorite = favorites.includes(restaurantId);
    
    // Optimistic update
    setFavorites(prev =>
      isCurrentlyFavorite ? prev.filter(f => f !== restaurantId) : [...prev, restaurantId]
    );

    // Feedback
    if (isCurrentlyFavorite) {
        toast.success('Removido dos favoritos', {
            icon: '💔',
            style: { borderRadius: '1rem', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
        });
    } else {
        toast.success('Adicionado aos favoritos', {
            icon: '❤️',
            style: { borderRadius: '1rem', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
        });
    }

    if (user && isSupabaseConfigured) {
      try {
        await restaurantService.toggleFavorite(user.id, restaurantId, isCurrentlyFavorite);
      } catch (err) {
        // Rollback on error
        setFavorites(prev =>
          isCurrentlyFavorite ? [...prev, restaurantId] : prev.filter(f => f !== restaurantId)
        );
        toast.error('Erro ao sincronizar favoritos');
      }
    }
  };

  return { favorites, toggleFavorite };
};
