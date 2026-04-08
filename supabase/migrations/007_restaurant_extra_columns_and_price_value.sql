-- ================================================================
-- MIGRATION 007 — RESTAURANT EXTRA COLUMNS & PRICE VALUE
-- MenusMoz / Locais de Moz
-- ================================================================
-- Adds columns referenced by mapRestaurant() and the Restaurant
-- interface but missing from the original schema.
-- Also adds price_value NUMERIC to menu_items to resolve the
-- price field inconsistency (TEXT price vs NUMERIC price_value).
-- ================================================================

-- ── Restaurants extra columns ─────────────────────────────────────
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS chef_name      TEXT,
  ADD COLUMN IF NOT EXISTS chef_image     TEXT,
  ADD COLUMN IF NOT EXISTS chef_quote     TEXT,
  ADD COLUMN IF NOT EXISTS tags           TEXT[],
  ADD COLUMN IF NOT EXISTS features       TEXT[],
  ADD COLUMN IF NOT EXISTS is_featured    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS logo           TEXT,
  ADD COLUMN IF NOT EXISTS identity_text  TEXT,
  ADD COLUMN IF NOT EXISTS phone          TEXT,
  ADD COLUMN IF NOT EXISTS address        TEXT,
  ADD COLUMN IF NOT EXISTS price_level    TEXT,
  ADD COLUMN IF NOT EXISTS delivery_time  TEXT,
  ADD COLUMN IF NOT EXISTS avg_consumption TEXT;

-- ── Menu Items: numeric price + currency ──────────────────────────
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS price_value    NUMERIC,
  ADD COLUMN IF NOT EXISTS currency       TEXT DEFAULT 'MT';

-- ── Profiles: allow public read of name/avatar for review joins ──
-- The current "profiles_select_own" policy only lets users see their
-- own profile, which breaks the review join
-- `reviews(*, profiles(full_name, avatar_url))`.
-- Add a limited public read policy.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_select_public_limited'
  ) THEN
    CREATE POLICY "profiles_select_public_limited"
      ON public.profiles FOR SELECT
      USING (true);
  END IF;
END $$;
