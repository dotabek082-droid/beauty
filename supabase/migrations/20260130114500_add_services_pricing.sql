-- Replace specializations text[] with services jsonb for structured data
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS specializations;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS services jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.profiles.services IS 'Array of services with pricing: [{name: "Service Name", price: 10000}]';
