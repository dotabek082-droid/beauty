import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const usePromotionRegistration = (promotionId: string | null) => {
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!promotionId || !user) {
      setIsRegistered(false);
      setRegistrationStatus(null);
      return;
    }

    checkRegistration();
  }, [promotionId, user]);

  const checkRegistration = async () => {
    if (!promotionId || !user) return;

    setIsLoading(true);
    try {
      // Local Storage Check
      const allRegistrations = JSON.parse(localStorage.getItem('user_promotion_registrations') || '{}');
      const userRegistrations = allRegistrations[user.id] || [];

      const registered = userRegistrations.includes(promotionId);

      setIsRegistered(registered);
      setRegistrationStatus(registered ? "booked" : null);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (ticketPrice: number = 0): Promise<{ success: boolean; error?: string }> => {
    if (!promotionId || !user) {
      return { success: false, error: "Iltimos, tizimga kiring" };
    }

    if (isRegistered) {
      return { success: false, error: "Siz allaqachon ro'yxatdan o'tgansiz" };
    }

    setIsLoading(true);
    try {
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const allRegistrations = JSON.parse(localStorage.getItem('user_promotion_registrations') || '{}');
      const userRegistrations = allRegistrations[user.id] || [];

      if (userRegistrations.includes(promotionId)) {
        setIsRegistered(true);
        return { success: false, error: "Siz allaqachon ro'yxatdan o'tgansiz" };
      }

      // Check and Deduct Coins
      if (ticketPrice > 0) {
        // Dynamic import to avoid cycles
        const { deductCoins } = await import('@/utils/coinBalance');
        const success = deductCoins(user.id, ticketPrice, `Aksiyada ishtirok: Promo ${promotionId}`);

        if (!success) {
          return { success: false, error: "Hisobingizda mablag' yetarli emas" };
        }
      }

      // Add new registration
      userRegistrations.push(promotionId);
      allRegistrations[user.id] = userRegistrations;

      localStorage.setItem('user_promotion_registrations', JSON.stringify(allRegistrations));

      setIsRegistered(true);
      setRegistrationStatus("booked");
      return { success: true };
    } catch (err) {
      return { success: false, error: "Xatolik yuz berdi" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isRegistered,
    isLoading,
    registrationStatus,
    register,
    checkRegistration,
  };
};

