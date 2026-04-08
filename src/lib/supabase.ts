import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// ── Loud warning when running on mock data ──────────────────────
if (!isSupabaseConfigured) {
  const msg = [
    '%c⚠️  SUPABASE NOT CONFIGURED — RUNNING ON MOCK DATA  ⚠️',
    'background: #ff6b00; color: #fff; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;',
  ]
  console.warn(msg[0], msg[1])
  console.warn(
    '🔧 To connect to real data:\n' +
    '   1. Copy .env.local.example → .env.local\n' +
    '   2. Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
    '   3. Restart the dev server (`npm run dev`)\n' +
    '   See README.md for full instructions.'
  )
}

export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null
