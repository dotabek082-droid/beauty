-- Fix function search_path for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Give new user the SARTAROSH20 promo code
  INSERT INTO public.promo_codes (user_id, code, discount_percentage)
  VALUES (NEW.id, 'SARTAROSH20', 20);
  
  RETURN NEW;
END;
$$;