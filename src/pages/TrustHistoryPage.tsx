import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Shield, Calendar, Star, XCircle, CheckCircle, Clock, Check, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import { useAuth } from "@/contexts/AuthContext";

interface TrustHistoryItem {
    id: string;
    date: string;
    points: number;
    description: string;
    type: 'usage' | 'review' | 'photo_review' | 'cancel' | 'no_show' | 'late' | 'initial' | 'verification' | 'response' | 'complaint' | 'completed_booking';
}

const MOCK_CLIENT_HISTORY: TrustHistoryItem[] = [
    {
        id: "h1",
        date: "2026-01-28",
        points: 5,
        description: "Ijobiy sharh qoldirish",
        type: "review"
    },
    {
        id: "h2",
        date: "2026-01-25",
        points: 10,
        description: "Xizmatdan foydalanish",
        type: "usage"
    },
    {
        id: "h3",
        date: "2026-01-20",
        points: 15,
        description: "Suratli sharh",
        type: "photo_review"
    },
    {
        id: "h4",
        date: "2026-01-15",
        points: -5,
        description: "Buyurtmani bekor qilish",
        type: "cancel"
    },
    {
        id: "h5",
        date: "2026-01-10",
        points: 10,
        description: "Xizmatdan foydalanish",
        type: "usage"
    },
    {
        id: "h6",
        date: "2026-01-01",
        points: 80,
        description: "Boshlang'ich reyting",
        type: "initial"
    }
];

const MOCK_BUSINESS_HISTORY: TrustHistoryItem[] = [
    {
        id: "b1",
        date: "2026-02-01",
        points: 5,
        description: "Buyurtma muvaffaqiyatli yakunlandi",
        type: "completed_booking"
    },
    {
        id: "b2",
        date: "2026-01-30",
        points: 2,
        description: "Sharhga javob berildi",
        type: "response"
    },
    {
        id: "b3",
        date: "2026-01-28",
        points: 5,
        description: "Buyurtma muvaffaqiyatli yakunlandi",
        type: "completed_booking"
    },
    {
        id: "b4",
        date: "2026-01-15",
        points: 50,
        description: "Biznes verifikatsiyadan o'tdi",
        type: "verification"
    },
    {
        id: "b5",
        date: "2026-01-10",
        points: -10,
        description: "Buyurtma bekor qilindi",
        type: "cancel"
    },
    {
        id: "b6",
        date: "2026-01-01",
        points: 60,
        description: "Boshlang'ich biznes reytingi",
        type: "initial"
    }
];

const TrustHistoryPage = () => {
    const navigate = useNavigate();
    const { isRole } = useAuth();
    const isBusiness = isRole("business_owner");

    // Simulate scores. In real app, fetch from profile
    const currentScore = isBusiness ? 112 : 115;

    const [history, setHistory] = useState<TrustHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate network delay for realistic feel
        const timer = setTimeout(() => {
            setHistory(isBusiness ? MOCK_BUSINESS_HISTORY : MOCK_CLIENT_HISTORY);
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [isBusiness]);

    const getIcon = (type: TrustHistoryItem['type']) => {
        switch (type) {
            case 'usage': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'completed_booking': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'review': return <Star className="w-5 h-5 text-yellow-500" />;
            case 'photo_review': return <Star className="w-5 h-5 text-purple-500" />;
            case 'verification': return <Check className="w-5 h-5 text-blue-500" />;
            case 'response': return <MessageSquare className="w-5 h-5 text-indigo-500" />;
            case 'cancel': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'complaint': return <XCircle className="w-5 h-5 text-destructive" />;
            case 'no_show': return <XCircle className="w-5 h-5 text-destructive" />;
            case 'late': return <Clock className="w-5 h-5 text-orange-500" />;
            case 'initial': return <Shield className="w-5 h-5 text-blue-500" />;
            default: return <Shield className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 px-4 py-3 safe-top">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-gray-100">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </Button>
                    <h1 className="text-lg font-bold text-gray-900">Ishonch Tarixi</h1>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto space-y-6">
                {/* Score Summary */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                        <div className="flex flex-col items-center text-center relative z-10">
                            <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wide">Joriy Reyting</p>
                            <div className="flex items-center justify-center p-1 bg-white rounded-full shadow-sm mb-4">
                                <div className="flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full border-4 border-primary/20">
                                    <span className="text-4xl font-extrabold text-primary">{currentScore}</span>
                                </div>
                            </div>
                            <TrustScoreBadge score={currentScore} size="lg" showLabel={true} />
                            <p className="text-xs text-gray-500 mt-4 max-w-[260px] leading-relaxed">
                                {isBusiness ? (
                                    <span>
                                        <span className="font-semibold text-primary">Ishonchli Hamkor!</span> Yuqori reyting mijozlar ishonchini oshiradi va qidiruv natijalarida yuqori o'rinlarni ta'minlaydi.
                                    </span>
                                ) : (
                                    <span>
                                        <span className="font-semibold text-primary">Ishonchli mijoz!</span> Yuqori reyting sizga eksklyuziv aksiyalarda qatnashish va tezkor band qilish imkoniyatini beradi.
                                    </span>
                                )}
                            </p>
                        </div>
                    </Card>
                </motion.div>

                {/* History List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 pl-1 text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Reyting o'zgarishlari
                    </h3>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Tarix topilmadi</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="p-4 border-transparent shadow-sm hover:shadow-md transition-all duration-200 border-l-4"
                                        style={{ borderLeftColor: item.points > 0 ? '#22c55e' : '#ef4444' }}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <div className={`p-2.5 rounded-xl ${item.points > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                                    {getIcon(item.type)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{item.description}</h4>
                                                    <span className="text-xs text-gray-500">{item.date}</span>
                                                </div>
                                            </div>
                                            <div className={`font-bold text-lg ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.points > 0 ? '+' : ''}{item.points}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rules Section */}
                <Card className="overflow-hidden border-0 shadow-md">
                    <div className="bg-primary/5 p-4 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-gray-900">Reyting Tizimi Haqida</h3>
                        </div>
                    </div>

                    <div className="p-5 space-y-6">
                        {isBusiness ? (
                            <>
                                <div>
                                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3" /> Ball to'plash (Biznes)
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Biznesni verifikatsiya qilish</span>
                                            <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs">+50 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Buyurtmani yakunlash</span>
                                            <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs">+5 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Sharhga javob berish</span>
                                            <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs">+2 ball</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-gray-100 pt-5">
                                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <XCircle className="w-3 h-3" /> Ball yo'qotish (Biznes)
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Mijoz shikoyati (tasdiqlangan)</span>
                                            <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs">-20 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Buyurtmani asossiz bekor qilish</span>
                                            <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs">-10 ball</span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3" /> Ball to'plash
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Xizmatdan foydalanish</span>
                                            <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs">+10 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Ijobiy sharh qoldirish</span>
                                            <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs">+5 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Suratli sharh</span>
                                            <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs">+15 ball</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-gray-100 pt-5">
                                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <XCircle className="w-3 h-3" /> Ball yo'qotish
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Buyurtmani bekor qilish</span>
                                            <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs">-5 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Kelmaslik (No-show)</span>
                                            <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs">-20 ball</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm group">
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Kech qolish (15+ daqiqa)</span>
                                            <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs">-2 ball</span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {isBusiness ? <BusinessBottomNav activeTab="profile" /> : <BottomNav />}
        </div>
    );
};

export default TrustHistoryPage;
