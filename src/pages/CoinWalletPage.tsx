import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import CoinsSection from "@/components/CoinsSection";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const CoinWalletPage = () => {
    const navigate = useNavigate();
    const { user, loading, isRole } = useAuth();
    const isBusiness = isRole("business_owner");

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-foreground"
                    >
                        Tangalar hamyoni
                    </motion.h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <CoinsSection />
                </motion.div>
            </div>

            {isBusiness ? (
                <BusinessBottomNav activeTab="profile" onTabChange={() => { }} />
            ) : (
                <BottomNav />
            )}
        </div>
    );
};

export default CoinWalletPage;
