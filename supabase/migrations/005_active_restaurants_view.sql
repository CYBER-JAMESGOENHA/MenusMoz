-- ================================================================
-- MIGRATION 005 — ACTIVE RESTAURANTS VIEW
-- MenusMoz / Locais de Moz
-- ================================================================
-- restaurantService.getAll() and getBySlug() query from
-- 'active_restaurants_view'. This view must expose all columns of
-- the restaurants table (so the nested select `*, menu_categories(...)`
-- works) while filtering only active restaurants.
-- ================================================================

-- Drop if exists so re-running is safe
DROP VIEW IF EXISTS public.active_restaurants_view;

CREATE VIEW public.active_restaurants_view AS
SELECT
  r.*,
  -- Extract lat/lng from coords JSONB for convenience
  (r.coords->>'lat')::DOUBLE PRECISION  AS latitude,
  (r.coords->>'lng')::DOUBLE PRECISION  AS longitude
FROM public.restaurants r
WHERE r.is_active = true;
