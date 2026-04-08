-- Add business_owner to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'business_owner';

-- Create RLS policy for user_roles to allow users to read their own role
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);