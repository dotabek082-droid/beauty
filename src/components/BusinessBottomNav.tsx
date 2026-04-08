import { motion } from "framer-motion";
import { Home, Search, Gift, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BusinessBottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems = [
    { id: "home", icon: Home, label: "Bosh sahifa" },
    { id: "search", icon: Search, label: "Qidirish" },
    { id: "promotions", icon: Gift, label: "Imtiyozlar" },
    { id: "bookings", icon: Calendar, label: "Buyurtmalar" },
    { id: "profile", icon: User, label: "Profil" },
];

const BusinessBottomNav = ({ activeTab, onTabChange }: BusinessBottomNavProps) => {
    const navigate = useNavigate();

    const handleTabClick = (itemId: string) => {
        if (itemId === "profile") {
            navigate("/profile");
        } else {
            onTabChange(itemId);
        }
    };

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom z-50"
        >
            <div className="flex items-center justify-around h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTabClick(item.id)}
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

export default BusinessBottomNav;
