-- Enable realtime for promotion_bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.promotion_bookings;

-- Add business_owner policy to view bookings for their promotions
CREATE POLICY "Business owners can view bookings for their promotions"
ON public.promotion_bookings
FOR SELECT
TO authenticated
USING (
  promotion_id IN (
    SELECT id FROM promotions 
    WHERE salon_id IN (
      SELECT salon_id FROM profiles WHERE user_id = auth.uid()
    )
  )
  OR has_role(auth.uid(), 'business_owner'::app_role)
);

-- Add business_owner policy to update bookings status
CREATE POLICY "Business owners can update booking status"
ON public.promotion_bookings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'business_owner'::app_role))
WITH CHECK (has_role(auth.uid(), 'business_owner'::app_role));

-- Add salon_id to profiles for business owners
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salon_id text;

-- Update the business owner's profile with a salon_id
UPDATE public.profiles 
SET salon_id = 'salon-1' 
WHERE user_id = (SELECT user_id FROM user_roles WHERE role = 'business_owner' LIMIT 1);