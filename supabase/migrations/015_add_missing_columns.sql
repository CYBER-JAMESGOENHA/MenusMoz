-- ================================================================
-- MIGRATION 015 — ADD MISSING DATABASE COLUMNS
-- Add columns referenced by frontend code
-- ================================================================

-- Add columns to restaurants table
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS hours_weekday TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS hours_saturday TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS hours_sunday TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add created_at to favorites table with default
ALTER TABLE public.favorites ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();