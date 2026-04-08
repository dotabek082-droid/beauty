import { motion } from "framer-motion";
import { RefreshCw, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import ClientBookings from "@/components/client/ClientBookings";
import { Card } from "@/components/ui/card";
import { useClientBookings } from "@/hooks/useClientBookings";

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshBookings, isLoading } = useClientBookings();

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="px-4 pt-4 pb-6 safe-top">
          <h1 className="text-2xl font-bold text-foreground">Mening buyurtmalarim</h1>
        </div>
        <div className="px-4">
          <Card className="p-8 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">Tizimga kiring</h3>
            <p className="text-sm mb-4">
              Buyurtmalaringizni ko'rish uchun tizimga kiring
            </p>
            <Button variant="coral" onClick={() => navigate("/auth")}>
              Kirish
            </Button>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 safe-top">
          <div className="flex items-center gap-2">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-gray-900"
              >
                Mening buyurtmalarim
              </motion.h1>
              <p className="text-xs text-gray-500 font-medium">
                Barcha xizmatlar tarixi
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshBookings}
            disabled={isLoading}
            className="rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <ClientBookings />
      </div>

      <BottomNav />
    </div>
  );
};

export default BookingsPage;

