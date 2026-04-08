-- Add business_status column to profiles table for admin approval flow
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS business_status text DEFAULT 'pending';

COMMENT ON COLUMN public.profiles.business_status IS 'Status of business registration: pending, approved, rejected';
