-- ================================================================
-- MIGRATION 011 — REFRESH ACTIVE RESTAURANTS VIEW (v2)
-- MenusMoz / Locais de Moz
-- ================================================================
-- Recreates the view to pick up the new media columns added in
-- migrations 008 and 010: menu_food_image, menu_drinks_image,
-- menu_desserts_image, story, awards, signature_dishes, etc.
-- ================================================================

DROP VIEW IF EXISTS public.active_restaurants_view;

CREATE VIEW public.active_restaurants_view AS
SELECT
  r.*,
  -- Derived lat/lng from coords JSONB (legacy) OR explicit columns
  COALESCE(r.latitude,  (r.coords->>'lat')::DOUBLE PRECISION) AS latitude,
  COALESCE(r.longitude, (r.coords->>'lng')::DOUBLE PRECISION) AS longitude
FROM public.restaurants r
WHERE r.is_active = true;
