import { useEffect, useState } from "react";
import { Coins, Calendar, Gift, Star, Shield, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getCoinBalance, getTransactionsSummary } from "@/utils/coinBalance";
import { useNavigate } from "react-router-dom";
import { useClientBookings } from "@/hooks/useClientBookings";

// Helper to get review count from LS
const getReviewCount = (userId: string) => {
    try {
        const reviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
        return reviews.filter((r: any) => r.user_id === userId).length;
    } catch {
        return 0;
    }
};

// Helper to get promotion participation count
// mixing mock data count + real DB count simulation
const getPromotionCount = (userId: string) => {
    // For demo, we assume the user has participated in a few.
    // We can try to read 'promotion_bookings' from LS if we were saving them there.
    // Since MyRegistrationsPage uses internal mocks, we'll return a static number + LS count
    // or just a placeholder for the "Mock" experience if no real data.
    return 5; // As per user request example "5 Aksiyalar"
};

const ClientDashboardStats = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [summary, setSummary] = useState({ today: 0, week: 0, total: 0 });
    const { bookings } = useClientBookings();
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            setBalance(getCoinBalance(user.id));
            setSummary(getTransactionsSummary(user.id));
            setReviewCount(getReviewCount(user.id));
        }
    }, [user?.id]);

    if (!user) return null;

    return (
        <div className="grid grid-cols-2 gap-3">
            {/* 1. Bookings */}
            <Card
                className="p-3 cursor-pointer hover:shadow-md transition-all border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800"
                onClick={() => navigate('/bookings')}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-xl text-blue-900 dark:text-blue-100">
                        {bookings.length}
                    </h4>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Buyurtmalar</p>
            </Card>

            {/* 2. Promotions */}
            <Card
                className="p-3 cursor-pointer hover:shadow-md transition-all border-purple-100 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800"
                onClick={() => navigate('/my-registrations')}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Gift className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-xl text-purple-900 dark:text-purple-100">
                        {getPromotionCount(user.id)}
                    </h4>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Aksiyalar</p>
            </Card>

            {/* 3. Reviews */}
            <Card
                className="p-3 cursor-pointer hover:shadow-md transition-all border-amber-100 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800"
                onClick={() => navigate('/profile/reviews')}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                        <Star className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-xl text-amber-900 dark:text-amber-100">
                        {reviewCount}
                    </h4>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Sharhlar</p>
            </Card>

            {/* 4. Coins (Replaces Trust Score) */}
            <Card
                className="p-3 cursor-pointer hover:shadow-md transition-all bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg relative overflow-hidden group"
                onClick={() => navigate('/profile/coins')}
            >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-white/20 transition-all" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-white/80 font-medium mb-0.5">Jami balans</p>
                            <h3 className="text-xl font-bold tracking-tight">{balance.toLocaleString()}</h3>
                        </div>
                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Coins className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="space-y-1 mt-2">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-white/80">Ekvivalent</p>
                                <p className="text-xs font-semibold">{balance.toLocaleString()} so'm</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded w-fit backdrop-blur-sm">
                            <TrendingUp className="w-3 h-3" />
                            <span>Bugun: +{summary.today}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ClientDashboardStats;
