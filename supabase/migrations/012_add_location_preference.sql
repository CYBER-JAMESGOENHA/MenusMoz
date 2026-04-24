-- Add location preference columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_location TEXT,
ADD COLUMN IF NOT EXISTS preferred_latitude NUMERIC,
ADD COLUMN IF NOT EXISTS preferred_longitude NUMERIC;