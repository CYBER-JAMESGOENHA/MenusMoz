import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { RESTAURANTS, checkIsOpen, FEATURED_DISHES } from '../data'

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

  // 🖼️ CMS - Slides do Hero
  async getHeroSlides(lang = 'pt') {
    if (!isSupabaseConfigured) return FEATURED_DISHES
    
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Erro ao buscar slides, fallback para local:', error)
      return FEATURED_DISHES
    }

    return data.map(s => ({
      id: s.id,
      name: s[`title_${lang}`] || s.title_pt,
      tagline: s[`tagline_${lang}`] || s.tagline_pt,
      desc: s[`description_${lang}`] || s.description_pt,
      image: s.image_url,
      link: s.button_link || '/'
    }))
  },

  // ✍️ CMS - Posts do Blog
  async getBlogPosts(lang = 'pt') {
    const { BLOG_POSTS } = await import('../data')
    if (!isSupabaseConfigured) return BLOG_POSTS

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar blog, fallback para local:', error)
      return BLOG_POSTS
    }

    return data.map(p => ({
      id: p.id,
      title: p[`title_${lang}`] || p.title_pt,
      excerpt: p[`excerpt_${lang}`] || p.excerpt_pt,
      image: p.image_url,
      author: p.author,
      date: new Date(p.published_at).toLocaleDateString(lang === 'pt' ? 'pt-MZ' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      slug: p.slug
    }))
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
