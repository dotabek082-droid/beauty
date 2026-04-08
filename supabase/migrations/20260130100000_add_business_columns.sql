-- Add business profile columns to profiles table

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS amenities text[],
ADD COLUMN IF NOT EXISTS gallery text[],
ADD COLUMN IF NOT EXISTS hours jsonb,
ADD COLUMN IF NOT EXISTS location jsonb;

-- Comment on columns
COMMENT ON COLUMN public.profiles.category IS 'Business category (Salon, Gym, etc.)';
COMMENT ON COLUMN public.profiles.amenities IS 'List of amenities provided';
COMMENT ON COLUMN public.profiles.gallery IS 'Array of image URLs for business gallery';
COMMENT ON COLUMN public.profiles.hours IS 'Weekly working hours schedule (JSONB)';
COMMENT ON COLUMN public.profiles.location IS 'Detailed location data (lat, lng, address) (JSONB)';
