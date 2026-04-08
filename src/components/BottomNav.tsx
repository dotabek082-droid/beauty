import { motion } from "framer-motion";
import { Home, Search, Gift, Heart, User, Users, Building2, MessageSquare, Percent } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const userNavItems = [
  { icon: Home, label: "Bosh sahifa", path: "/" },
  { icon: Search, label: "Qidirish", path: "/search" },
  { icon: Gift, label: "Aksiyalarim", path: "/my-registrations" },
  { icon: Heart, label: "Sevimlilar", path: "/favorites" },
  { icon: User, label: "Profil", path: "/profile" },
];

const adminNavItems = [
  { icon: Home, label: "Bosh sahifa", path: "/" },
  { icon: Users, label: "Foydalanuvchilar", path: "/admin/users" },
  { icon: Building2, label: "Bizneslar", path: "/admin/businesses" },
  { icon: Percent, label: "Aksiyalar", path: "/admin/promotions" },
  { icon: MessageSquare, label: "Sharhlar", path: "/admin/reviews" },
  { icon: User, label: "Profil", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isRole } = useAuth();

  const navItems = isRole("admin") ? adminNavItems : userNavItems;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom z-50 ${isRole("admin") ? "md:hidden" : ""}`}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : ""}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
