-- ================================================================
-- MIGRATION 009 - REFRESH ACTIVE RESTAURANTS VIEW
-- MenusMoz / Locais de Moz
-- ================================================================
-- The original active_restaurants_view was created before newer media
-- columns like cover_url, hero_image_url, logo_url and gallery were
-- added to public.restaurants. PostgreSQL views do not automatically
-- pick up newly added columns, so we recreate the view here.
-- ================================================================

DROP VIEW IF EXISTS public.active_restaurants_view;

CREATE VIEW public.active_restaurants_view AS
SELECT
  r.*,
  (r.coords->>'lat')::DOUBLE PRECISION AS latitude,
  (r.coords->>'lng')::DOUBLE PRECISION AS longitude
FROM public.restaurants r
WHERE r.is_active = true;
