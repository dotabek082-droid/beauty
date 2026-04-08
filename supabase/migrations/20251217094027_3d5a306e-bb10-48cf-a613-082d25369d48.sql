-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create promotions table
CREATE TABLE public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    service_description TEXT,
    salon_id TEXT NOT NULL,
    salon_name TEXT NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    slots_available INTEGER NOT NULL DEFAULT 10,
    slots_used INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Everyone can view active promotions
CREATE POLICY "Anyone can view active promotions"
ON public.promotions FOR SELECT
USING (is_active = true);

-- Only admins can manage promotions
CREATE POLICY "Admins can manage promotions"
ON public.promotions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create feedback questions table
CREATE TABLE public.feedback_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_uz TEXT NOT NULL,
    question_ru TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active questions"
ON public.feedback_questions FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage questions"
ON public.feedback_questions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create promotion bookings table
CREATE TABLE public.promotion_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    booked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.promotion_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
ON public.promotion_bookings FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookings"
ON public.promotion_bookings FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookings"
ON public.promotion_bookings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create feedback responses table
CREATE TABLE public.feedback_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.promotion_bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    additional_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
ON public.feedback_responses FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own feedback"
ON public.feedback_responses FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view feedback for display"
ON public.feedback_responses FOR SELECT
USING (true);

-- Create feedback answers table
CREATE TABLE public.feedback_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES public.feedback_responses(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.feedback_questions(id) ON DELETE CASCADE NOT NULL,
    answer_rating INTEGER NOT NULL CHECK (answer_rating >= 1 AND answer_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answers"
ON public.feedback_answers FOR SELECT
TO authenticated
USING (feedback_id IN (SELECT id FROM public.feedback_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can create answers for their feedback"
ON public.feedback_answers FOR INSERT
TO authenticated
WITH CHECK (feedback_id IN (SELECT id FROM public.feedback_responses WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view answers for display"
ON public.feedback_answers FOR SELECT
USING (true);

-- Create feedback photos table
CREATE TABLE public.feedback_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES public.feedback_responses(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own photos"
ON public.feedback_photos FOR SELECT
TO authenticated
USING (feedback_id IN (SELECT id FROM public.feedback_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can upload photos for their feedback"
ON public.feedback_photos FOR INSERT
TO authenticated
WITH CHECK (feedback_id IN (SELECT id FROM public.feedback_responses WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view photos for display"
ON public.feedback_photos FOR SELECT
USING (true);

-- Insert default 10 feedback questions in Uzbek and Russian
INSERT INTO public.feedback_questions (question_uz, question_ru, question_order) VALUES
('Sartaroshning professionallik darajasi qanday edi?', 'Каков был уровень профессионализма парикмахера?', 1),
('Xizmat sifati sizni qoniqtirdimi?', 'Удовлетворило ли вас качество услуги?', 2),
('Salon tozaligi qanday edi?', 'Как была чистота салона?', 3),
('Xodimlar xushmuomalalik bilan munosabatda bo''ldimi?', 'Был ли персонал вежлив в общении?', 4),
('Kutish vaqti qabul qilinadigan darajada edimi?', 'Было ли время ожидания приемлемым?', 5),
('Ishlatiladigan mahsulotlar sifati qanday edi?', 'Каково было качество используемых продуктов?', 6),
('Narx-navo mos keladimi?', 'Соответствовала ли цена качеству?', 7),
('Salonning joylashuvi qulaymi?', 'Удобно ли расположен салон?', 8),
('Bu salonga yana kelasizmi?', 'Вернетесь ли вы в этот салон снова?', 9),
('Do''stlaringizga tavsiya qilasizmi?', 'Порекомендуете ли вы друзьям?', 10);

-- Create storage bucket for feedback photos
INSERT INTO storage.buckets (id, name, public) VALUES ('feedback-photos', 'feedback-photos', true);

-- Storage policies for feedback photos
CREATE POLICY "Authenticated users can upload feedback photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'feedback-photos');

CREATE POLICY "Anyone can view feedback photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'feedback-photos');

-- Function to update promotion slots
CREATE OR REPLACE FUNCTION public.update_promotion_slots()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.promotions
    SET slots_used = slots_used + 1
    WHERE id = NEW.promotion_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to update slots on booking
CREATE TRIGGER on_promotion_booking_created
AFTER INSERT ON public.promotion_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_promotion_slots();

-- Updated_at trigger for promotions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON public.promotions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();