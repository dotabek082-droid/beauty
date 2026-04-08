import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SalonCard from "@/components/SalonCard";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { featuredSalons } from "@/data/mockData";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  // Use new fake data directly
  const favorites = featuredSalons;

  // Removed strict redirect to allow guest view
  /*
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if (!user) return null; // Removed early return

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Sevimlilar
        </motion.h1>
      </div>

      {/* Content */}
      <div className="px-4 space-y-3">
        {!user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Tizimga kiring</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                Sevimli salonlaringizni saqlash va ularni kuzatib borish uchun tizimga kiring.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full max-w-[200px]">
                Kirish
              </Button>
            </Card>
          </motion.div>
        ) : favorites.length > 0 ? (
          favorites.map((salon, index) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SalonCard
                salon={salon}
                variant="compact"
                onClick={() => navigate(`/salon/${salon.id}`)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Hozircha bo'sh</h2>
            <p className="text-sm text-muted-foreground text-center max-w-[200px]">
              O'zingizga yoqgan salonlarni saqlab qo'ying
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FavoritesPage;
