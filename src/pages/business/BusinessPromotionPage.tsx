import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Star, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

const BusinessPromotionPage = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const plans = [
        {
            id: "daily",
            name: "1 Kun",
            price: 50000,
            duration: "24 soat",
            features: [
                "Bosh sahifada 'Mashhur' bo'limida chiqish",
                "Qidiruv natijalarida yuqori o'rin",
                "Mijozlar ishonchini oshirish"
            ],
            recommended: false
        },
        {
            id: "weekly",
            name: "1 Hafta",
            price: 300000,
            duration: "7 kun",
            features: [
                "Bosh sahifada 'Mashhur' bo'limida chiqish",
                "Qidiruv natijalarida yuqori o'rin",
                "Mijozlar ishonchini oshirish",
                "Maxsus 'TOP' belgisi",
                "15% chegirma"
            ],
            recommended: true
        },
        {
            id: "monthly",
            name: "1 Oy",
            price: 1000000,
            duration: "30 kun",
            features: [
                "Bosh sahifada 'Mashhur' bo'limida chiqish",
                "Qidiruv natijalarida yuqori o'rin",
                "Mijozlar ishonchini oshirish",
                "Maxsus 'TOP' belgisi",
                "30% kattaroq chegirma",
                "Premium qo'llab-quvvatlash"
            ],
            recommended: false
        }
    ];

    const handlePurchase = () => {
        if (!selectedPlan) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("To'lov muvaffaqiyatli amalga oshirildi!", {
                description: "Sizning biznesingiz endi TOP ro'yxatda!"
            });
            navigate("/business/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-40 px-4 h-14 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="font-semibold text-lg">Reklama va TOP</h1>
            </header>

            <main className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Biznesingizni TOP ga olib chiqing!</h2>
                    <p className="text-muted-foreground">
                        "Mashhur" bo'limida chiqish orqali mijozlar oqimini 3 barobarga oshiring.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col items-center text-center gap-2 bg-gradient-to-br from-background to-primary/5 border-primary/20">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">Ko'proq Mijozlar</h3>
                        <p className="text-xs text-muted-foreground">Sizning saloningizni 1000 dan ortiq mijozlar ko'radi</p>
                    </Card>
                    <Card className="p-4 flex flex-col items-center text-center gap-2 bg-gradient-to-br from-background to-primary/5 border-primary/20">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">Yuqori Reyting</h3>
                        <p className="text-xs text-muted-foreground">Qidiruv natijalarida birinchi o'rinlarda turish imkoniyati</p>
                    </Card>
                    <Card className="p-4 flex flex-col items-center text-center gap-2 bg-gradient-to-br from-background to-primary/5 border-primary/20">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">Ishonchli Maqom</h3>
                        <p className="text-xs text-muted-foreground">Mijozlar orasida brendingiz nufuzini oshiring</p>
                    </Card>
                </div>

                {/* Plans */}
                <div className="grid gap-4 md:grid-cols-3 pt-4">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlan(plan.id)}
                            className="cursor-pointer"
                        >
                            <Card
                                className={`p-6 relative transition-all border-2 h-full ${selectedPlan === plan.id
                                    ? "border-primary shadow-lg bg-primary/5 ring-1 ring-primary"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                                        Tavsiya etiladi
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{plan.name}</h3>
                                            <p className="text-muted-foreground text-sm">{plan.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-primary">
                                                {plan.price.toLocaleString()} so'm
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="w-4 h-4 text-green-500 shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <p className="text-sm text-muted-foreground">Tanlangan reja:</p>
                        <p className="font-bold">
                            {selectedPlan
                                ? plans.find(p => p.id === selectedPlan)?.name + " - " + plans.find(p => p.id === selectedPlan)?.price.toLocaleString() + " so'm"
                                : "Tanlanmagan"
                            }
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="w-full sm:w-auto min-w-[200px]"
                        disabled={!selectedPlan || isLoading}
                        onClick={handlePurchase}
                    >
                        {isLoading ? "Bajarilmoqda..." : "Sotib olish"}
                    </Button>
                </div>
            </div>

            {/* Added for mobile bottom nav spacing */}
            <div className="h-16 sm:h-0"></div>
        </div>
    );
};

export default BusinessPromotionPage;
