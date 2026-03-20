import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase não configurado. A usar dados locais como fallback.')
  console.log('DEBUG - URL:', !!supabaseUrl, 'Key:', !!supabaseAnonKey)
} else {
  console.log('🚀 Supabase configurado com sucesso! Ligando a:', supabaseUrl)
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
