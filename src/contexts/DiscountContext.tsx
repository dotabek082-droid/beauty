import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface DiscountState {
  code: string;
  percentage: number;
  isActive: boolean;
  usedAt: string | null;
}

interface DiscountContextType {
  discount: DiscountState | null;
  hasActiveDiscount: boolean;
  claimDiscount: () => void;
  applyDiscount: (originalPrice: number) => { 
    finalPrice: number; 
    savings: number; 
    discountApplied: boolean;
  };
  markDiscountUsed: () => void;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

const DISCOUNT_CODE = "SARTAROSH20";
const DISCOUNT_PERCENTAGE = 20;

export const DiscountProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [discount, setDiscount] = useState<DiscountState | null>(null);

  // Load discount state from localStorage
  useEffect(() => {
    if (user) {
      const storedDiscount = localStorage.getItem(`discount_${user.id}`);
      if (storedDiscount) {
        setDiscount(JSON.parse(storedDiscount));
      }
    } else {
      setDiscount(null);
    }
  }, [user]);

  // Save discount state to localStorage
  useEffect(() => {
    if (user && discount) {
      localStorage.setItem(`discount_${user.id}`, JSON.stringify(discount));
    }
  }, [user, discount]);

  const claimDiscount = () => {
    if (!user) {
      toast.error("Chegirmani olish uchun tizimga kiring");
      return;
    }

    if (discount?.usedAt) {
      toast.error("Siz bu chegirmani allaqachon ishlatgansiz");
      return;
    }

    const newDiscount: DiscountState = {
      code: DISCOUNT_CODE,
      percentage: DISCOUNT_PERCENTAGE,
      isActive: true,
      usedAt: null,
    };

    setDiscount(newDiscount);
    toast.success(`${DISCOUNT_PERCENTAGE}% chegirma aktivlashtirildi! Kod: ${DISCOUNT_CODE}`);
  };

  const applyDiscount = (originalPrice: number) => {
    if (discount?.isActive && !discount.usedAt) {
      const savings = Math.round(originalPrice * (discount.percentage / 100));
      return {
        finalPrice: originalPrice - savings,
        savings,
        discountApplied: true,
      };
    }
    return {
      finalPrice: originalPrice,
      savings: 0,
      discountApplied: false,
    };
  };

  const markDiscountUsed = () => {
    if (discount) {
      const updatedDiscount = {
        ...discount,
        isActive: false,
        usedAt: new Date().toISOString(),
      };
      setDiscount(updatedDiscount);
      if (user) {
        localStorage.setItem(`discount_${user.id}`, JSON.stringify(updatedDiscount));
      }
    }
  };

  const hasActiveDiscount = Boolean(discount?.isActive && !discount.usedAt);

  return (
    <DiscountContext.Provider
      value={{
        discount,
        hasActiveDiscount,
        claimDiscount,
        applyDiscount,
        markDiscountUsed,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = () => {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error("useDiscount must be used within a DiscountProvider");
  }
  return context;
};
