import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { RESTAURANTS } from '../data'

/**
 * SERVIÇO DE RESTAURANTES
 * Usa Supabase se configurado, caso contrário usa dados locais como fallback.
 */

const mapRestaurant = (r) => ({
  ...r,
  image: r.image_url,
  reviewCount: r.review_count,
  menuCategories: (r.menu_categories || []).map(cat => ({
    ...cat,
    items: (cat.menu_items || []).map(item => ({
      ...item,
      desc: item.description
    }))
  }))
});

export const restaurantService = {
  // 🔍 BUSCA - Todos os restaurantes ativos
  async getAll() {
    if (!isSupabaseConfigured) {
      console.info('📦 A usar dados locais (data.js)...')
      return RESTAURANTS
    }

    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        )
      `)
      .eq('is_active', true)
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
      .from('restaurants')
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
