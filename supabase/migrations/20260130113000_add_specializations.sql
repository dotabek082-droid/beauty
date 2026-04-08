-- Add specializations column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specializations text[];

COMMENT ON COLUMN public.profiles.specializations IS 'Array of specific services/specializations provided by the business';
