-- Add unique constraint to prevent duplicate registrations
ALTER TABLE public.promotion_bookings 
ADD CONSTRAINT unique_user_promotion UNIQUE (user_id, promotion_id);