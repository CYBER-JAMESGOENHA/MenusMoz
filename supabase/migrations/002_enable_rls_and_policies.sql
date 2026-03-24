-- ================================================================
-- MIGRATION 002 — ENABLE ROW LEVEL SECURITY + POLICIES
-- MenusMoz / Locais de Moz — Security Hardening
-- ================================================================

-- 1. Activar RLS em TODAS as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- RESTAURANTS — Leitura pública só de restaurantes activos
-- ----------------------------------------------------------------
CREATE POLICY "restaurants_select_public"
  ON public.restaurants FOR SELECT
  USING (is_active = true);

CREATE POLICY "restaurants_insert_owner"
  ON public.restaurants FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "restaurants_update_owner"
  ON public.restaurants FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "restaurants_delete_owner"
  ON public.restaurants FOR DELETE
  USING (auth.uid() = owner_id);

-- Admin tem acesso total
CREATE POLICY "restaurants_admin_all"
  ON public.restaurants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ----------------------------------------------------------------
-- MENU CATEGORIES — Leitura pública, escrita só do dono
-- ----------------------------------------------------------------
CREATE POLICY "menu_categories_select_public"
  ON public.menu_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.is_active = true
    )
  );

CREATE POLICY "menu_categories_write_owner"
  ON public.menu_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- MENU ITEMS — Leitura pública, escrita só do dono do restaurante
-- ----------------------------------------------------------------
CREATE POLICY "menu_items_select_public"
  ON public.menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "menu_items_write_owner"
  ON public.menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.menu_categories mc
      JOIN public.restaurants r ON r.id = mc.restaurant_id
      WHERE mc.id = category_id AND r.owner_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- PROFILES — Cada utilizador só vê/edita o seu próprio perfil
-- ----------------------------------------------------------------
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ----------------------------------------------------------------
-- FAVORITES — Privados, cada um só vê/edita os seus
-- ----------------------------------------------------------------
CREATE POLICY "favorites_all_own"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- REVIEWS — Leitura pública, escrita/edição só do autor
-- ----------------------------------------------------------------
CREATE POLICY "reviews_select_public"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "reviews_update_own"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);
