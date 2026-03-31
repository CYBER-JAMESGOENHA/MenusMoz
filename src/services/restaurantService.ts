import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { RESTAURANTS, FEATURED_DISHES } from '../data/mockData'
import { checkIsOpen } from '../utils/timeUtils'

export interface Restaurant {
  id: any;
  name: string;
  slug: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  delivery_time?: string;
  price_level?: string;
  address?: string;
  phone?: string;
  is_featured?: boolean;
  is_open?: boolean;
  isOpen?: boolean;
  description?: string;
  chefName?: string;
  chefImage?: string;
  chefQuote?: string;
  cuisines?: any[];
  menuCategories?: any[];
  reviews?: any[];
  latitude?: number;
  longitude?: number;
  avg_consumption?: string;
  tags?: string[];
  features?: string[];
  logo?: string;
}

/**
 * SERVIÇO DE RESTAURANTES
 * Usa Supabase se configurado, caso contrário usa dados locais como fallback.
 */

const mapRestaurant = (r: any) => ({
  ...r,
  image: r.image_url,
  lat: r.latitude || (r.coords?.lat),
  lng: r.longitude || (r.coords?.lng),
  chefName: r.chef_name,
  chefImage: r.chef_image,
  chefQuote: r.chef_quote,
  reviewCount: r.review_count,
  cuisines: r.tags || [{ name: r.cuisine, slug: r.cuisine?.toLowerCase() }],
  isOpen: r.is_open !== undefined ? r.is_open : checkIsOpen(r.hours),
  menuCategories: (r.menu_categories || []).map((cat: any) => ({
    ...cat,
    items: (cat.menu_items || []).map((item: any) => ({
      ...item,
      price: item.price_value ? `${item.price_value} ${item.currency || 'MT'}` : item.price,
      priceValue: item.price_value,
      desc: item.description
    }))
  })),
  reviews: (r.reviews || []).map((rev: any) => ({
    ...rev,
    userName: rev.profiles?.full_name || 'Utilizador',
    avatar: rev.profiles?.avatar_url
  }))
});

export const restaurantService = {
  async getAll() {
    if (!isSupabaseConfigured || !supabase) {
      return RESTAURANTS
    }

    const { data, error } = await supabase
      .from('active_restaurants_view')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        ),
        reviews (
          *,
          profiles (full_name, avatar_url)
        )
      `)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Supabase error [getAll]:', error)
      return RESTAURANTS
    }
    return data.map(mapRestaurant)
  },

  async getBySlug(slug: string) {
    if (!isSupabaseConfigured || !supabase) {
      return RESTAURANTS.find(r => r.slug === slug) || null
    }

    const { data, error } = await supabase
      .from('active_restaurants_view')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        ),
        reviews (
          *,
          profiles (full_name, avatar_url)
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Supabase error [getBySlug]:', error)
      return RESTAURANTS.find(r => r.slug === slug) || null
    }
    return mapRestaurant(data)
  },

  async getHeroSlides(lang: string = 'pt') {
    if (!isSupabaseConfigured || !supabase) return FEATURED_DISHES
    
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase error [getHeroSlides]:', error)
      return FEATURED_DISHES
    }

    return data.map(s => ({
      id: s.id,
      name: s[`name_${lang}` as keyof any] || s[`title_${lang}` as keyof any] || s.title_pt || s.name_pt,
      tagline: s[`tagline_${lang}` as keyof any] || s.tagline_pt,
      desc: s[`description_${lang}` as keyof any] || s.description_pt,
      image: s.image_url,
      link: s.button_link || '/'
    }))
  },

  async getBlogPosts(lang: string = 'pt') {
    const { BLOG_POSTS } = await import('../data/mockData')
    if (!isSupabaseConfigured || !supabase) return BLOG_POSTS

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Supabase error [getBlogPosts]:', error)
      return BLOG_POSTS
    }

    return data.map(p => ({
      id: p.id,
      title: p[`title_${lang}` as keyof any] || p.title_pt,
      excerpt: p[`excerpt_${lang}` as keyof any] || p.excerpt_pt,
      image: p.image_url,
      author: p.author,
      date: new Date(p.published_at).toLocaleDateString(lang === 'pt' ? 'pt-MZ' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      slug: p.slug,
      category: p.category,
      content: p[`content_${lang}` as keyof any] || p.content_pt
    }))
  },

  async toggleFavorite(userId: string, restaurantId: string | number, isCurrentlyFavorite: boolean) {
    if (!isSupabaseConfigured || !supabase) return

    if (isCurrentlyFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, restaurant_id: restaurantId })
      if (error) {
        console.error('Supabase error [removeFavorite]:', error)
        throw error
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, restaurant_id: restaurantId }])
      if (error) {
        console.error('Supabase error [addFavorite]:', error)
        throw error
      }
    }
  }
}
