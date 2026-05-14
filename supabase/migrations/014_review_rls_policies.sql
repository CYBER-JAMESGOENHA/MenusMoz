-- ================================================================
-- MIGRATION 014 — REVIEW RLS POLICIES
-- Add explicit review INSERT policy for authenticated users
-- ================================================================

-- Add public SELECT policy for reviews if not exists
-- (Already exists in migration 002, but added for completeness)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'reviews_select_public'
      AND tablename = 'reviews'
      AND schemaname = 'public'
  ) THEN
    CREATE POLICY "reviews_select_public"
      ON public.reviews FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Add authenticated INSERT policy for reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'reviews_insert_auth'
      AND tablename = 'reviews'
      AND schemaname = 'public'
  ) THEN
    CREATE POLICY "reviews_insert_auth"
      ON public.reviews FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;