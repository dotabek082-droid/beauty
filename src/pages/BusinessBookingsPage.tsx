import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BusinessBookings from "@/components/business/BusinessBookings";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BusinessBookingsPage = () => {
    const { user, isRole } = useAuth();
    const navigate = useNavigate();

    // Protect route
    useEffect(() => {
        if (!user) {
            navigate("/auth");
        } else if (!isRole("business_owner") && !isRole("admin")) {
            navigate("/");
        }
    }, [user, isRole, navigate]);

    if (!user) return null;

    const handleTabChange = (tab: string) => {
        if (tab === "home") navigate("/business");
        else if (tab === "search") navigate("/search");
        else if (tab === "promotions") navigate("/business/promotions");
        // bookings is current page
        else if (tab === "profile") navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <div className="px-4 pt-6 pb-12 space-y-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/business")}
                        className="shrink-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">Buyurtmalar</h2>
                        <p className="text-xs text-muted-foreground">Sizning barcha buyurtmalaringiz</p>
                    </div>
                </div>
                <BusinessBookings />
            </div>
            <BusinessBottomNav activeTab="bookings" onTabChange={handleTabChange} />
        </div>
    );
};

export default BusinessBookingsPage;
