import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { RESTAURANTS, checkIsOpen } from '../data'

/**
 * SERVIÇO DE RESTAURANTES
 * Usa Supabase se configurado, caso contrário usa dados locais como fallback.
 */

const mapRestaurant = (r) => ({
  ...r,
  image: r.image_url,
  // Usar coordenadas decimais se disponíveis, senão o fallback JSONB
  lat: r.latitude || (r.coords?.lat),
  lng: r.longitude || (r.coords?.lng),
  reviewCount: r.review_count,
  // A View já nos dá as tags normalizadas e o estado is_open calculado no servidor
  cuisines: r.tags || [{ name: r.cuisine, slug: r.cuisine?.toLowerCase() }],
  isOpen: r.is_open !== undefined ? r.is_open : checkIsOpen(r.hours),
  menuCategories: (r.menu_categories || []).map(cat => ({
    ...cat,
    items: (cat.menu_items || []).map(item => ({
      ...item,
      // Usar novo preço numérico formatado
      price: item.price_value ? `${item.price_value} ${item.currency || 'MT'}` : item.price,
      priceValue: item.price_value,
      desc: item.description
    }))
  }))
});

export const restaurantService = {
  // 🔍 BUSCA - Todos os restaurantes ativos usando a VIEW inteligente
  async getAll() {
    if (!isSupabaseConfigured) {
      console.info('📦 A usar dados locais (data.js)...')
      return RESTAURANTS
    }

    const { data, error } = await supabase
      .from('active_restaurants_view')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        )
      `)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Erro ao buscar restaurantes, fallback para dados locais:', error)
      return RESTAURANTS
    }
    return data.map(mapRestaurant)
  },

  // 📝 BUSCA - Por slug específico
  async getBySlug(slug) {
    if (!isSupabaseConfigured) {
      return RESTAURANTS.find(r => r.slug === slug) || null
    }

    const { data, error } = await supabase
      .from('active_restaurants_view')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error(`Erro ao buscar restaurante ${slug}, fallback:`, error)
      return RESTAURANTS.find(r => r.slug === slug) || null
    }
    return mapRestaurant(data)
  },

  // ⭐ FAVORITOS - Adicionar ou Remover
  async toggleFavorite(userId, restaurantId, isCurrentlyFavorite) {
    if (!isSupabaseConfigured) return

    if (isCurrentlyFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, restaurant_id: restaurantId })
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, restaurant_id: restaurantId }])
      if (error) throw error
    }
  }
}
