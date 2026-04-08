-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  trust_score INTEGER NOT NULL DEFAULT 100,
  total_wins INTEGER NOT NULL DEFAULT 0,
  total_feedbacks INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create time_slots table for winner booking
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  salon_id TEXT NOT NULL,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- RLS policies for time_slots
CREATE POLICY "Anyone can view available time slots"
ON public.time_slots FOR SELECT
USING (true);

CREATE POLICY "Admins can manage time slots"
ON public.time_slots FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add columns to promotion_bookings for time slot booking
ALTER TABLE public.promotion_bookings
ADD COLUMN time_slot_id UUID REFERENCES public.time_slots(id),
ADD COLUMN scheduled_date DATE,
ADD COLUMN scheduled_time TIME,
ADD COLUMN is_winner BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN winner_selected_at TIMESTAMP WITH TIME ZONE;

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES public.promotion_bookings(id),
  amount NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  final_amount NUMERIC NOT NULL,
  promo_code TEXT,
  payment_method TEXT, -- 'click', 'payme', 'card'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for payments
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own payments"
ON public.payments FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage payments"
ON public.payments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create promo_codes table for tracking used codes
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  code TEXT NOT NULL,
  discount_percentage INTEGER NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for promo_codes
CREATE POLICY "Users can view own promo codes"
ON public.promo_codes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own promo codes"
ON public.promo_codes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own promo codes"
ON public.promo_codes FOR UPDATE
USING (user_id = auth.uid());

-- Function to update trust score
CREATE OR REPLACE FUNCTION public.update_trust_score(p_user_id UUID, p_change INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_score INTEGER;
BEGIN
  UPDATE public.profiles
  SET trust_score = GREATEST(0, LEAST(100, trust_score + p_change))
  WHERE user_id = p_user_id
  RETURNING trust_score INTO new_score;
  
  RETURN COALESCE(new_score, 100);
END;
$$;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();