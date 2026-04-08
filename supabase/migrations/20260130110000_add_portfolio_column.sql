-- Add portfolio column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS portfolio text[];

COMMENT ON COLUMN public.profiles.portfolio IS 'Array of image URLs for business portfolio (works)';
