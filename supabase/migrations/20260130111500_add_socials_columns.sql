-- Add social media columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS telegram text,
ADD COLUMN IF NOT EXISTS facebook text;

COMMENT ON COLUMN public.profiles.instagram IS 'Instagram profile URL or username';
COMMENT ON COLUMN public.profiles.telegram IS 'Telegram channel/group URL or username';
COMMENT ON COLUMN public.profiles.facebook IS 'Facebook page URL';
