import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PromoCode {
  id: string;
  user_id: string;
  code: string;
  discount_percentage: number;
  used_at: string | null;
}

export const usePromoCode = () => {
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPromoCode();
    } else {
      setPromoCode(null);
    }
  }, [user]);

  const fetchPromoCode = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("user_id", user.id)
        .eq("code", "SARTAROSH20")
        .maybeSingle();

      if (error) {
        console.error("Error fetching promo code:", error);
        return;
      }

      setPromoCode(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateCode = async (code: string): Promise<{ valid: boolean; discount?: number; error?: string }> => {
    if (!user) {
      return { valid: false, error: "Tizimga kiring" };
    }

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("user_id", user.id)
        .eq("code", code.toUpperCase())
        .maybeSingle();

      if (error) {
        return { valid: false, error: error.message };
      }

      if (!data) {
        return { valid: false, error: "Promo kod topilmadi" };
      }

      if (data.used_at) {
        return { valid: false, error: "Bu promo kod allaqachon ishlatilgan" };
      }

      return { valid: true, discount: data.discount_percentage };
    } catch (err) {
      return { valid: false, error: "Xatolik yuz berdi" };
    }
  };

  const usePromoCodeForPayment = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Tizimga kiring" };
    }

    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("code", code.toUpperCase());

      if (error) {
        return { success: false, error: error.message };
      }

      await fetchPromoCode();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Xatolik yuz berdi" };
    }
  };

  const hasUnusedPromoCode = promoCode && !promoCode.used_at;

  return {
    promoCode,
    isLoading,
    validateCode,
    usePromoCodeForPayment,
    hasUnusedPromoCode,
    refreshPromoCode: fetchPromoCode,
  };
};
