import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import HomeContent from "@/components/HomeContent";
import BottomNav from "@/components/BottomNav";
import { clearAndReseedReviews } from "@/data/reviewSeedData";
import { initializeCoinBalance, checkDailyLogin } from "@/utils/coinBalance";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  const { user, isRole } = useAuth();
  const isBusinessOwner = isRole("business_owner");

  useEffect(() => {
    // FORCE reseed on every load to ensure reviews appear
    console.log("🔄 Clearing and reseeding review data...");
    clearAndReseedReviews();

    // Initialize coin balance for logged in users
    if (user?.id) {
      initializeCoinBalance(user.id);

      // Check and award daily login
      const earnedCoin = checkDailyLogin(user.id);
      if (earnedCoin) {
        toast.success("🪙 Kunlik kirish mukofoti: +1 tanga!", {
          description: "Har kuni kirish orqali tangalar to'plang!"
        });
      }
    }
  }, [user?.id]);

  if (isBusinessOwner) {
    return <Navigate to="/business" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <HomeContent />
      <BottomNav />
    </div>
  );
};

export default Index;
