import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MyPromotions from "@/components/business/MyPromotions";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePromotionWizard } from "@/components/business/CreatePromotionWizard";
import { useFrontendPromotions } from "@/hooks/useFrontendPromotions";
import { motion, AnimatePresence } from "framer-motion";

const BusinessPromotionsPage = () => {
    const { user, isRole, profile } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [activeTab, setActiveTab] = useState<"list" | "create">("list");
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const { createPromotion } = useFrontendPromotions(profile?.id || "");

    // Protect route
    useEffect(() => {
        if (!user) {
            navigate("/auth");
        } else if (!isRole("business_owner") && !isRole("admin")) {
            navigate("/");
        }
    }, [user, isRole, navigate]);

    // Handle initial tab from query params if needed
    useEffect(() => {
        const tab = searchParams.get("view");
        if (tab === "create") {
            setActiveTab("create");
            setIsWizardOpen(true);
        }
    }, [searchParams]);

    if (!user) return null;

    const handleTabChange = (tab: string) => {
        if (tab === "home") navigate("/business");
        else if (tab === "search") navigate("/search");
        else if (tab === "bookings") navigate("/business/bookings");
        // promotions is current page
        else if (tab === "profile") navigate("/profile");
    };

    const handleCreateSubmit = async (data: any) => {
        await createPromotion(data);
        setIsWizardOpen(false);
        setActiveTab("list");
    };

    const handleWizardClose = () => {
        setIsWizardOpen(false);
        // If we were in create mode effectively, switch back to list or just stay
        if (activeTab === "create") {
            setActiveTab("list");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <div className="px-4 pt-6 pb-12 space-y-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/profile")}
                        className="shrink-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Imtiyozlar</h2>
                            <p className="text-xs text-muted-foreground">Mijozlarni jalb qilish uchun qulay imkoniyatlar</p>
                        </div>
                        <div className="p-1 bg-muted/50 rounded-xl flex">
                            <button
                                onClick={() => setActiveTab("list")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                            >
                                Ro'yxat
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab("create");
                                    setIsWizardOpen(true);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "create" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                            >
                                Yaratish
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "list" ? (
                            <motion.div
                                key="list-view"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                            >
                                <MyPromotions businessId={profile?.id || ""} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="create-view"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <div className="bg-card rounded-lg p-6 text-center">
                                    <h3 className="text-lg font-bold mb-2">Yangi aksiya yaratish</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Maxsus taklif yaratish uchun pastdagi tugmani bosing
                                    </p>
                                    <Button onClick={() => setIsWizardOpen(true)}>
                                        Aksiya yaratishni boshlash
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Create Wizard Modal */}
            <CreatePromotionWizard
                isOpen={isWizardOpen}
                onClose={handleWizardClose}
                onSubmit={handleCreateSubmit}
            />

            <BusinessBottomNav activeTab="promotions" onTabChange={handleTabChange} />
        </div>
    );
};

export default BusinessPromotionsPage;
