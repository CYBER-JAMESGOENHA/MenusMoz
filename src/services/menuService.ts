import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ================================================================
// TIPOS TYPESCRIPT — Menu hierárquico
// Categorias → Subcategorias → Itens
// ================================================================

export type MenuItem = {
  id: string | number
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_popular: boolean
  tags: string[] | null
  order_index: number
  /** Preço formatado para display (ex: "680 MT") */
  price_formatted?: string
}

export type MenuSubcategory = {
  id: string | number
  name: string
  order_index: number
  items: MenuItem[]
}

export type MenuCategory = {
  id: string | number
  name: string
  order_index: number
  subcategories: MenuSubcategory[]
}

export type RestaurantMenu = MenuCategory[]

// ─── Helpers ─────────────────────────────────────────────────────

/** Formata price_value numérico para string legível */
function formatPrice(priceValue: number | null | undefined, currency = 'MT'): string {
  if (!priceValue && priceValue !== 0) return ''
  return `${Number(priceValue).toLocaleString('pt-MZ')} ${currency}`
}

/** Mapeia item raw da BD para MenuItem tipado */
function mapItem(item: any): MenuItem {
  return {
    id: item.id,
    name: item.name,
    price: item.price_value ?? parseFloat(item.price) ?? 0,
    description: item.description ?? null,
    image_url: item.image_url ?? null,
    is_popular: item.is_popular ?? false,
    tags: item.tags ?? null,
    order_index: item.order_index ?? 0,
    price_formatted: item.price_value
      ? formatPrice(item.price_value, item.currency ?? 'MT')
      : item.price ?? '',
  }
}

// ================================================================
// QUERY 1 — Estrutura completa do menu de um restaurante
// Usado no carregamento inicial da página de restaurante.
// Suporta tanto IDs bigint (number) como uuid (string).
// ================================================================
export async function getMenuStructure(
  restaurantId: string | number
): Promise<RestaurantMenu> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[menuService] Supabase não configurado.')
    return []
  }

  const { data, error } = await supabase
    .from('menu_categories')
    .select(`
      id,
      name,
      order_index,
      subcategories (
        id,
        name,
        order_index,
        menu_items (
          id,
          name,
          price,
          price_value,
          currency,
          description,
          image_url,
          is_popular,
          is_available,
          tags,
          order_index
        )
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('order_index', { ascending: true })
    .order('order_index', { referencedTable: 'subcategories', ascending: true })
    .order('order_index', { referencedTable: 'subcategories.menu_items', ascending: true })

  if (error) {
    console.error('[menuService] getMenuStructure error:', error)
    return []
  }

  return (data ?? []).map((cat: any): MenuCategory => ({
    id: cat.id,
    name: cat.name,
    order_index: cat.order_index ?? 0,
    subcategories: (cat.subcategories ?? []).map((sub: any): MenuSubcategory => ({
      id: sub.id,
      name: sub.name,
      order_index: sub.order_index ?? 0,
      items: (sub.menu_items ?? [])
        .filter((item: any) => item.is_available !== false)
        .map(mapItem),
    })),
  }))
}

// ================================================================
// QUERY 2 — Itens populares de um restaurante
// Usado para a secção "Mais Pedidos" / "Destaques"
// ================================================================
export async function getPopularItems(
  restaurantId: string | number
): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[menuService] Supabase não configurado.')
    return []
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      id,
      name,
      price,
      price_value,
      currency,
      description,
      image_url,
      is_popular,
      tags,
      order_index,
      subcategories!inner (
        id,
        name,
        menu_categories!inner (
          id,
          name,
          restaurant_id
        )
      )
    `)
    .eq('subcategories.menu_categories.restaurant_id', restaurantId)
    .eq('is_popular', true)
    .eq('is_available', true)
    .limit(10)

  if (error) {
    console.error('[menuService] getPopularItems error:', error)
    return []
  }

  return (data ?? []).map(mapItem)
}

// ================================================================
// QUERY 3 — Itens de uma categoria específica (lazy load)
// Usado quando o utilizador navega entre categorias.
// ================================================================
export async function getCategoryItems(
  categoryId: string | number
): Promise<MenuSubcategory[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[menuService] Supabase não configurado.')
    return []
  }

  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      id,
      name,
      order_index,
      menu_items (
        id,
        name,
        price,
        price_value,
        currency,
        description,
        image_url,
        is_popular,
        is_available,
        tags,
        order_index
      )
    `)
    .eq('category_id', categoryId)
    .order('order_index', { ascending: true })
    .order('order_index', { referencedTable: 'menu_items', ascending: true })

  if (error) {
    console.error('[menuService] getCategoryItems error:', error)
    return []
  }

  return (data ?? []).map((sub: any): MenuSubcategory => ({
    id: sub.id,
    name: sub.name,
    order_index: sub.order_index ?? 0,
    items: (sub.menu_items ?? [])
      .filter((item: any) => item.is_available !== false)
      .map(mapItem),
  }))
}

// ================================================================
// QUERY 4 — Categorias de um restaurante (navegação/tab bar)
// Leve: só carrega ids e nomes, sem itens.
// ================================================================
export async function getMenuCategories(
  restaurantId: string | number
): Promise<Pick<MenuCategory, 'id' | 'name' | 'order_index'>[]> {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from('menu_categories')
    .select('id, name, order_index')
    .eq('restaurant_id', restaurantId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('[menuService] getMenuCategories error:', error)
    return []
  }

  return data ?? []
}
