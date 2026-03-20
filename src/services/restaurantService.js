import { supabase } from '../lib/supabase'

/**
 * SERVIÇO DE RESTAURANTES (SPEEDRUN)
 * Implementa a ponte entre o Supabase e os componentes do MenusMoz.
 */

export const restaurantService = {
  // 🔍 BUSCA - Todos os restaurantes ativos
  async getAll() {
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
      console.error('Erro ao buscar restaurantes:', error)
      return []
    }
    return data
  },

  // 📝 BUSCA - Por slug específico para a página de Detalhes
  async getBySlug(slug) {
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
      console.error(`Erro ao buscar restaurante ${slug}:`, error)
      return null
    }
    return data
  },

  // ⭐ FAVORITOS - Adicionar ou Remover
  async toggleFavorite(userId, restaurantId, isCurrentlyFavorite) {
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
