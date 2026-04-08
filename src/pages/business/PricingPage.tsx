
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, Crown, ChevronLeft, History, ArrowUpCircle, ArrowDownCircle, RefreshCw, CreditCard, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BUSINESS_PLANS, BusinessSubscriptionTier } from '@/data/subscriptionOptions';
import { useAuth } from '@/contexts/AuthContext';
import { mockBusinesses } from '@/data/businessData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock business subscription history
const businessSubscriptionHistory = [
    { id: 1, action: "subscribe", planFrom: null, planTo: "Pro", amount: 150000, paymentMethod: "Click", date: "15.12.2025", time: "09:00" },
    { id: 2, action: "upgrade", planFrom: "Pro", planTo: "Elite", amount: 400000, paymentMethod: "Payme", date: "15.01.2026", time: "14:30" },
    { id: 3, action: "renew", planFrom: "Elite", planTo: "Elite", amount: 400000, paymentMethod: "Click", date: "15.02.2026", time: "10:15" },
];

const getActionInfo = (action: string) => {
    switch (action) {
        case "subscribe": return { label: "Yangi obuna", icon: Zap, color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" };
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
        case "elite": return "bg-purple-500 text-white";
        case "pro": return "bg-amber-500 text-white";
        default: return "bg-slate-200 text-slate-600";
    }
};

const PricingPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("plans");

    const business = mockBusinesses.find(b => b.ownerId === user?.id);
    const currentTier = business?.subscription?.tier || 'free';

    const handleSubscribe = (planId: BusinessSubscriptionTier) => {
        setLoading(planId);

        setTimeout(() => {
            setLoading(null);

            if (business) {
                if (!business.subscription) {
                    business.subscription = {
                        tier: planId,
                        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        isAutoRenew: true
                    };
                } else {
                    business.subscription.tier = planId;
                    business.subscription.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                }
            }

            toast({
                title: "Muvaffaqiyatli obuna!",
                description: `Sizning tarifingiz o'zgartirildi: ${planId.toUpperCase()}`,
                className: "bg-green-500 text-white"
            });

            navigate('/business/dashboard');
        }, 1500);
    };

    // Calculate total spent
    const totalSpent = businessSubscriptionHistory.reduce((acc, h) => acc + h.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 pt-12 pb-24 text-white px-4">
                <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-white/80 hover:text-white">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Orqaga</span>
                </button>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Biznesingizni keyingi bosqichga olib chiqing</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Bizning tariflarimiz sizga mijozlar bazasini kengaytirish va daromadni oshirishda yordam beradi.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-16">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full max-w-sm mx-auto grid grid-cols-2 bg-white shadow-lg rounded-xl p-1 mb-8">
                        <TabsTrigger value="plans" className="rounded-lg gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Crown className="w-4 h-4" />
                            Tariflar
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <History className="w-4 h-4" />
                            Tarix
                        </TabsTrigger>
                    </TabsList>

                    {/* Plans Tab */}
                    <TabsContent value="plans">
                        <div className="grid md:grid-cols-3 gap-8">
                            {BUSINESS_PLANS.map((plan) => {
                                const isCurrent = currentTier === plan.id;
                                const isRecommended = plan.recommended;

                                return (
                                    <Card key={plan.id} className={`relative flex flex-col h-full ${isRecommended ? 'border-purple-500 shadow-xl scale-105 z-10' : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
                                        {isRecommended && (
                                            <div className="absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Tavsiya etiladi
                                                </span>
                                            </div>
                                        )}

                                        <CardHeader className="text-center pb-2">
                                            <div className="mb-2 flex justify-center">
                                                {plan.id === 'free' && <Shield className="w-10 h-10 text-gray-400" />}
                                                {plan.id === 'pro' && <Zap className="w-10 h-10 text-amber-500" />}
                                                {plan.id === 'elite' && <Crown className="w-10 h-10 text-purple-500" />}
                                            </div>
                                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                            <div className="mt-4 mb-2">
                                                <span className="text-4xl font-extrabold">
                                                    {plan.price === 0 ? "Bepul" : plan.price.toLocaleString()}
                                                </span>
                                                {plan.price > 0 && <span className="text-muted-foreground ml-1">{plan.currency}/oy</span>}
                                            </div>
                                            <CardDescription>{isCurrent ? "Joriy tarif" : "Barcha imkoniyatlar"}</CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex-1">
                                            <ul className="space-y-3 mt-4">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <Check className={`w-5 h-5 flex-shrink-0 ${isRecommended ? 'text-purple-500' : 'text-green-500'}`} />
                                                        <span className="text-sm text-gray-600">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>

                                        <CardFooter>
                                            <Button
                                                className={`w-full ${isRecommended ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                                onClick={() => handleSubscribe(plan.id)}
                                                disabled={isCurrent || loading !== null}
                                                variant={isRecommended ? "default" : "outline"}
                                                size="lg"
                                            >
                                                {loading === plan.id ? "Bajarilmoqda..." : isCurrent ? "Joriy Tarif" : "Tanlash"}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history">
                        <div className="max-w-2xl mx-auto space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-700">Jami to'lovlar</p>
                                                <p className="text-xl font-bold text-purple-800">{totalSpent.toLocaleString()} UZS</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                                <History className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-700">Tranzaksiyalar</p>
                                                <p className="text-xl font-bold text-blue-800">{businessSubscriptionHistory.length}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Current Subscription */}
                            {currentTier !== 'free' && (
                                <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                                    <Crown className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-white/80 text-sm">Joriy obuna</p>
                                                    <p className="font-bold text-xl">{currentTier.toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/80 text-sm">Keyingi to'lov</p>
                                                <p className="font-bold text-lg">15.03.2026</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* History List */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <History className="w-5 h-5" />
                                        Obuna tarixi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {businessSubscriptionHistory.length === 0 ? (
                                        <div className="text-center py-10 text-slate-500">
                                            <History className="w-14 h-14 mx-auto mb-4 opacity-30" />
                                            <p>Obuna tarixi mavjud emas</p>
                                        </div>
                                    ) : (
                                        businessSubscriptionHistory.map((item) => {
                                            const actionInfo = getActionInfo(item.action);
                                            const IconComponent = actionInfo.icon;

                                            return (
                                                <div key={item.id} className={`p-5 rounded-xl ${actionInfo.bgColor} border border-slate-100`}>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-xl ${actionInfo.color} flex items-center justify-center`}>
                                                                <IconComponent className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className={`font-semibold text-lg ${actionInfo.textColor}`}>{actionInfo.label}</p>
                                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    {item.date} • {item.time}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg text-green-600">+{item.amount.toLocaleString()}</p>
                                                            <p className="text-sm text-slate-500">UZS</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50">
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
                                                            <CreditCard className="w-3.5 h-3.5 mr-1" />
                                                            {item.paymentMethod}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Barcha narxlar QQS bilan ko'rsatilgan.</p>
                    <p className="mt-2">Savollaringiz bormi? <a href="/profile/support" className="text-purple-600 underline">Qo'llab-quvvatlash xizmati</a> bilan bog'laning.</p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
