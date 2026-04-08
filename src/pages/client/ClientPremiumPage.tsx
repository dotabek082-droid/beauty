import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Star, Sparkles, Shield, ChevronLeft, ChevronRight, History, ArrowUpCircle, ArrowDownCircle, RefreshCw, CreditCard, Calendar, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { upgradeClientSubscription } from '@/utils/subscriptionUtils';
import { Badge } from '@/components/ui/badge';
import { ClientSubscriptionTier } from '@/data/subscriptionOptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock subscription history for current user
const userSubscriptionHistory = [
    { id: 1, action: "subscribe", planFrom: null, planTo: "Gold", amount: 50000, paymentMethod: "Click", date: "10.01.2026", time: "14:30" },
    { id: 2, action: "upgrade", planFrom: "Gold", planTo: "Platinum", amount: 120000, paymentMethod: "Payme", date: "10.02.2026", time: "09:15" },
    { id: 3, action: "renew", planFrom: "Platinum", planTo: "Platinum", amount: 120000, paymentMethod: "Click", date: "10.03.2026", time: "10:00" },
];

const getActionInfo = (action: string) => {
    switch (action) {
        case "subscribe": return { label: "Yangi obuna", icon: Star, color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" };
        case "upgrade": return { label: "Oshirish", icon: ArrowUpCircle, color: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-50" };
        case "downgrade": return { label: "Tushirish", icon: ArrowDownCircle, color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50" };
        case "renew": return { label: "Yangilash", icon: RefreshCw, color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50" };
        case "cancel": return { label: "Bekor qilish", icon: Clock, color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" };
        default: return { label: action, icon: History, color: "bg-slate-500", textColor: "text-slate-600", bgColor: "bg-slate-50" };
    }
};

const getPlanColor = (plan: string | null) => {
    if (!plan) return "bg-slate-200 text-slate-600";
    switch (plan.toLowerCase()) {
        case "platinum": return "bg-purple-500 text-white";
        case "gold": return "bg-amber-500 text-white";
        default: return "bg-slate-200 text-slate-600";
    }
};

const ClientPremiumPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, refreshProfile, profile } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("plans");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "6months" | "yearly">("monthly");

    const currentTier = profile?.subscription?.tier || 'standard';

    const handleSubscribe = async (planId: ClientSubscriptionTier) => {
        if (!user) {
            toast({ title: "Xatolik", description: "Iltimos, avval tizimga kiring", variant: "destructive" });
            navigate('/auth');
            return;
        }

        setLoading(planId);

        // Determine duration based on billing cycle
        let durationMonths = 1;
        if (billingCycle === '6months') durationMonths = 6;
        if (billingCycle === 'yearly') durationMonths = 12;

        setTimeout(async () => {
            setLoading(null);

            // Pass duration to utils
            upgradeClientSubscription(user.id, planId, durationMonths);

            await refreshProfile();

            toast({
                title: "Muvaffaqiyatli obuna!",
                description: `Sizning tarifingiz o'zgartirildi: ${planId.toUpperCase()} (${billingCycle})`,
                className: "bg-green-500 text-white"
            });

            navigate('/profile');
        }, 1500);
    };

    const plans = [
        {
            id: 'standard',
            name: 'Standard',
            price: 0,
            priceLabel: "Bepul",
            description: "Boshlanish uchun",
            icon: Shield,
            features: [
                "Bepul e'lonlarni ko'rish",
                "Oson band qilish",
                "Sharhlar qoldirish"
            ],
            bgColor: "bg-white",
            iconBg: "bg-slate-100",
            iconColor: "text-slate-600",
            recommended: false
        },
        {
            id: 'gold',
            name: 'Gold Client',
            price: 50000,
            priceLabel: "50,000",
            description: "Eng mashhur tarif",
            icon: Star,
            features: [
                "Reklamasiz interfeys",
                "Oyiga 1,000 tanga bepul",
                "5% Keshbek (tangalarda)",
                "Aksiyalarga 1 soat oldin kirish"
            ],
            bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            recommended: true
        },
        {
            id: 'platinum',
            name: 'Platinum VIP',
            price: 120000,
            priceLabel: "120,000",
            description: "Maksimal imkoniyatlar",
            icon: Crown,
            features: [
                "Barcha Gold imkoniyatlari",
                "Oyiga 3,000 tanga bepul",
                "10% Keshbek (tangalarda)",
                "Maxsus VIP belgisi",
                "Premium xizmat ko'rsatish"
            ],
            bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            recommended: false
        }
    ];

    // Calculate total spent
    const totalSpent = userSubscriptionHistory.reduce((acc, h) => acc + h.amount, 0);

    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 pt-12 pb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-1 text-white/80 hover:text-white"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Orqaga</span>
                </button>

                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">Premium Imkoniyatlar</h1>
                </div>
                <p className="text-white/90 text-sm">
                    Ko'proq tangalar, keshbek va maxsus takliflarga ega bo'ling.
                </p>
            </div>

            {/* Tabs */}
            <div className="px-4 -mt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 bg-white shadow-md rounded-xl p-1">
                        <TabsTrigger value="plans" className="rounded-lg gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                            <Crown className="w-4 h-4" />
                            Tariflar
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                            <History className="w-4 h-4" />
                            Tarix
                        </TabsTrigger>
                    </TabsList>

                    {/* Plans Tab */}
                    <TabsContent value="plans" className="mt-4 space-y-4">
                        {/* Billing Cycle Toggle */}
                        <div className="flex justify-center gap-2 mb-6 flex-wrap">
                            {[
                                { id: 'monthly', label: '1 Oy', discount: null },
                                { id: '6months', label: '6 Oy', discount: '-15%' },
                                { id: 'yearly', label: '1 Yil', discount: '-25%' }
                            ].map((cycle) => (
                                <button
                                    key={cycle.id}
                                    onClick={() => setBillingCycle(cycle.id as any)}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${billingCycle === cycle.id
                                        ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500 ring-offset-2'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {cycle.label}
                                    {billingCycle === cycle.id && cycle.discount && (
                                        <span className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                                            {cycle.discount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {plans.map((plan) => {
                            const isCurrent = currentTier === plan.id;
                            const isGold = plan.id === 'gold';
                            const isPlatinum = plan.id === 'platinum';
                            const IconComponent = plan.icon;

                            // Pricing Calculation Logic
                            let originalPrice = plan.price;
                            let periodLabel = "/oy";
                            let discountRate = 0; // 0% default

                            if (billingCycle === '6months') {
                                originalPrice = plan.price * 6;
                                periodLabel = "/6 oy";
                                discountRate = 0.15;
                            } else if (billingCycle === 'yearly') {
                                originalPrice = plan.price * 12;
                                periodLabel = "/yil";
                                discountRate = 0.25;
                            }

                            const discountedPrice = originalPrice * (1 - discountRate);

                            return (
                                <div
                                    key={plan.id}
                                    className={`
                                        rounded-2xl p-5 shadow-lg border-2 transition-all relative overflow-hidden
                                        ${plan.bgColor}
                                        ${plan.recommended ? 'border-amber-400' : 'border-transparent'}
                                    `}
                                >
                                    {plan.recommended && (
                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                                    )}

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${plan.iconBg}`}>
                                                <IconComponent className={`w-6 h-6 ${plan.iconColor}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                                                <p className="text-xs text-slate-500">{plan.description}</p>
                                            </div>
                                        </div>
                                        {plan.recommended && (
                                            <Badge className="bg-amber-500 text-white border-0 text-xs shadow-sm">TAVSIYA</Badge>
                                        )}
                                    </div>

                                    <div className="mb-4 bg-white/50 p-3 rounded-xl border border-white/60">
                                        {plan.price === 0 ? (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-extrabold text-slate-900">Bepul</span>
                                            </div>
                                        ) : (
                                            <div>
                                                {discountRate > 0 && (
                                                    <div className="text-xs text-slate-400 line-through mb-0.5">
                                                        {new Intl.NumberFormat('uz-UZ').format(originalPrice)} so'm
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-3xl font-extrabold text-slate-900">
                                                        {new Intl.NumberFormat('uz-UZ').format(discountedPrice)}
                                                    </span>
                                                    <span className="text-sm text-slate-500 font-medium">so'm</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    {discountRate > 0 ? (
                                                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5 py-0.5">
                                                            Birinchi to'lov: -{discountRate * 100}%
                                                        </Badge>
                                                    ) : <div></div>}
                                                    <span className="text-[10px] text-slate-400">
                                                        Keyin: {new Intl.NumberFormat('uz-UZ').format(originalPrice)} {periodLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-2.5 mb-5">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2.5">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isGold ? 'bg-amber-500 text-white' : isPlatinum ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className="text-sm text-slate-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={`w-full py-6 font-semibold text-base rounded-xl transition-all
                                            ${isCurrent
                                                ? 'bg-slate-200 text-slate-500 hover:bg-slate-200 cursor-not-allowed'
                                                : isGold
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5'
                                                    : isPlatinum
                                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5'
                                                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                                            }
                                        `}
                                        onClick={() => handleSubscribe(plan.id as ClientSubscriptionTier)}
                                        disabled={isCurrent || loading !== null}
                                    >
                                        {loading === plan.id ? (
                                            "Bajarilmoqda..."
                                        ) : isCurrent ? (
                                            "Joriy Tarif"
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Obuna bo'lish
                                                <ChevronRight className="w-5 h-5" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            );
                        })}

                        <div className="mt-6 text-center text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <Info className="w-3.5 h-3.5 inline mr-1.5 text-blue-500 -mt-0.5" />
                            Obuna shartlari: {billingCycle === 'monthly' ? "Oylik to'lov, istalgan vaqtda bekor qilish mumkin." : `Birinchi to'lov uchun ${billingCycle === '6months' ? '15%' : '25%'} chegirma amal qiladi.`} Keyingi to'lovlar to'liq miqdorda ({billingCycle === 'monthly' ? 'oylik' : billingCycle === '6months' ? 'har 6 oyda' : 'yillik'}) yechib olinadi. Istalgan vaqtda bekor qilish mumkin.
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="mt-4 space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-md">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-amber-700">Jami to'lovlar</p>
                                            <p className="text-lg font-bold text-amber-800">{totalSpent.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-md">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                                            <History className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-purple-700">Tranzaksiyalar</p>
                                            <p className="text-lg font-bold text-purple-800">{userSubscriptionHistory.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* History List */}
                        <Card className="border-0 shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    Obuna tarixi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {userSubscriptionHistory.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">
                                        <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>Obuna tarixi mavjud emas</p>
                                    </div>
                                ) : (
                                    userSubscriptionHistory.map((item) => {
                                        const actionInfo = getActionInfo(item.action);
                                        const IconComponent = actionInfo.icon;

                                        return (
                                            <div key={item.id} className={`p-4 rounded-xl ${actionInfo.bgColor} border border-slate-100`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl ${actionInfo.color} flex items-center justify-center`}>
                                                            <IconComponent className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className={`font-semibold ${actionInfo.textColor}`}>{actionInfo.label}</p>
                                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                <Calendar className="w-3 h-3" />
                                                                {item.date} • {item.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-green-600">+{item.amount.toLocaleString()}</p>
                                                        <p className="text-xs text-slate-500">UZS</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
                                                    <div className="flex items-center gap-2">
                                                        {item.planFrom && (
                                                            <>
                                                                <Badge className={getPlanColor(item.planFrom)}>{item.planFrom}</Badge>
                                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                                            </>
                                                        )}
                                                        {item.planTo && (
                                                            <Badge className={getPlanColor(item.planTo)}>{item.planTo}</Badge>
                                                        )}
                                                    </div>
                                                    <Badge variant="outline" className="bg-white">
                                                        <CreditCard className="w-3 h-3 mr-1" />
                                                        {item.paymentMethod}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {/* Current Subscription Info */}
                        {currentTier !== 'standard' && (
                            <Card className="border-0 shadow-md bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                                <Crown className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white/80 text-sm">Joriy obuna</p>
                                                <p className="font-bold text-lg">{currentTier.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/80 text-sm">Keyingi to'lov</p>
                                            <p className="font-bold">
                                                {profile?.subscription?.expiryDate
                                                    ? new Date(profile.subscription.expiryDate).toLocaleDateString('ru-RU')
                                                    : "Doimiy"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer */}
            <div className="px-4 mt-8 text-center">
                <p className="text-slate-500 text-sm">
                    Savollaringiz bormi?{' '}
                    <a href="/profile/support" className="text-amber-600 font-medium">
                        Qo'llab-quvvatlash
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ClientPremiumPage;
