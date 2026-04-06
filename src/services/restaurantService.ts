import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { RESTAURANTS, FEATURED_DISHES } from '../data/mockData'
import { checkIsOpen } from '../utils/timeUtils'

export interface Restaurant {
  id: string | number;
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
  cuisines?: { name: string; slug: string }[];
  menuCategories?: MenuCategory[];
  reviews?: Review[];
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  avg_consumption?: string;
  tags?: string[];
  features?: string[];
  logo?: string;
  identity_text?: string;
}

export interface MenuItem {
  id?: string | number;
  name: string;
  description?: string;
  desc?: string;
  price: string;
  priceValue?: number;
  image_url?: string;
  is_available?: boolean;
}

export interface MenuCategory {
  id?: string | number;
  name: string;
  items?: MenuItem[];
  subcategories?: MenuCategory[];
}

export interface Review {
  id: string | number;
  rating: number;
  comment: string;
  created_at: string;
  userName: string;
  avatar?: string;
}

/**
 * SERVIÇO DE RESTAURANTES
 * Usa Supabase se configurado, caso contrário usa dados locais como fallback.
 */

const BASE_RESTAURANT_QUERY = `
  *,
  menu_categories (
    *,
    menu_items (*)
  ),
  reviews (
    *,
    profiles (full_name, avatar_url)
  )
`;

const mapRestaurant = (r: any): Restaurant => ({
  ...r,
  image: r.image_url,
  logo: r.logo || null,
  identity_text: r.identity_text || null,
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
    subcategories: cat.subcategories,
    items: (cat.menu_items || cat.items || []).map((item: any) => ({
      ...item,
      price: item.price_value
        ? `${Number(item.price_value).toLocaleString('pt-MZ')} ${item.currency || 'MT'}`
        : item.price,
      priceValue: item.price_value ? Number(item.price_value) : undefined,
      desc: item.description || item.desc
    }))
  })),
  reviews: (r.reviews || []).map((rev: any) => ({
    ...rev,
    userName: rev.profiles?.full_name || 'Utilizador',
    avatar: rev.profiles?.avatar_url
  }))
});

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    if (!isSupabaseConfigured || !supabase) {
      return RESTAURANTS as Restaurant[]
    }

    const { data, error } = await supabase
      .from('active_restaurants_view')
      .select(BASE_RESTAURANT_QUERY)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Supabase error [getAll]:', error)
      return RESTAURANTS as Restaurant[]
    }
    return data.map(mapRestaurant)
  },

  async getBySlug(slug: string): Promise<Restaurant | null> {
    if (!isSupabaseConfigured || !supabase) {
      return (RESTAURANTS.find(r => r.slug === slug) as Restaurant) || null
    }

    const { data, error } = await supabase
      .from('active_restaurants_view')
      .select(BASE_RESTAURANT_QUERY)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Supabase error [getBySlug]:', error)
      return (RESTAURANTS.find(r => r.slug === slug) as Restaurant) || null
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

