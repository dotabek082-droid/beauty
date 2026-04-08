import { ShieldCheck, Award, Star, CheckCircle, TrendingUp, Lock, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const BusinessTrust = () => {
    // Mock data - in real app, fetch from backend
    const trustScore = 85;
    const level = "Ishonchli Hamkor";

    const badges = [
        {
            id: "verified",
            name: "Tasdiqlangan",
            description: "Hujjatlar va shaxs to'liq tasdiqlangan",
            icon: ShieldCheck,
            active: true,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20"
        },
        {
            id: "top_rated",
            name: "Top Reyting",
            description: "Mijozlar tomonidan yuqori baholangan (4.8+)",
            icon: Star,
            active: true,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20"
        },
        {
            id: "expert",
            name: "Ekspert",
            description: "100+ muvaffaqiyatli xizmatlar",
            icon: Award,
            active: false, // Locked
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20"
        },
        {
            id: "premium",
            name: "Premium",
            description: "Premium obuna faollashtirilgan",
            icon: TrendingUp,
            active: false,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20"
        }
    ];

    const trustHistory = [
        {
            id: 1,
            title: "Hujjatlar tasdiqlandi",
            date: "22 Yanvar, 2024",
            points: "+50",
            type: "success"
        },
        {
            id: 2,
            title: "Telefon raqam tasdiqlandi",
            date: "20 Yanvar, 2024",
            points: "+20",
            type: "success"
        },
        {
            id: 3,
            title: "Profile to'ldirildi",
            date: "15 Yanvar, 2024",
            points: "+15",
            type: "success"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Trust Score Header */}
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 overflow-hidden relative shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/20"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={351.86} // 2 * PI * 56
                                strokeDashoffset={351.86 - (351.86 * trustScore) / 100}
                                className="text-white transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{trustScore}</span>
                            <span className="text-[10px] uppercase opacity-80">Reyting</span>
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white mb-2 border-0">
                            {level}
                        </Badge>
                        <h2 className="text-2xl font-bold mb-2">Sizning ishonch darajangiz</h2>
                        <p className="text-blue-100 text-sm max-w-md">
                            Yuqori ishonch darajasi sizga qidiruv natijalarida yuqori o'rinlarni va mijozlar ishonchini taqdim etadi.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`p-4 h-full relative overflow-hidden border transition-all ${badge.active
                            ? `${badge.borderColor} ${badge.bgColor}`
                            : "bg-muted/50 border-border grayscale opacity-70"
                            }`}>

                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-xl bg-background shadow-sm ${badge.color}`}>
                                    <badge.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-semibold text-sm ${badge.active ? "text-foreground" : "text-muted-foreground"}`}>
                                            {badge.name}
                                        </h3>
                                        {badge.active ? (
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                        ) : (
                                            <Lock className="w-3 h-3 text-muted-foreground" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-snug">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>

                            {badge.active && (
                                <div className={`absolute top-0 right-0 p-1.5 rounded-bl-lg ${badge.bgColor}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-1">Faol</span>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Trust History */}
            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Ishonch tarixi
                    </h3>
                </div>
                <div className="divide-y">
                    {trustHistory.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-full text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-0">
                                {item.points}
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>



            {/* Rating Rules */}
            <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-foreground">Reyting tizimi qoidalari</h3>
                    <Badge variant="outline" className="ml-auto">Max: 100 ball</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Reyting oshishi</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg border border-green-500/10">
                                <span className="text-muted-foreground">Hujjatlarni to'liq tasdiqlash</span>
                                <span className="font-bold text-green-600">+50</span>
                            </li>
                            <li className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg border border-green-500/10">
                                <span className="text-muted-foreground">Premium obuna sotib olish</span>
                                <span className="font-bold text-green-600">+10</span>
                            </li>
                            <li className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg border border-green-500/10">
                                <span className="text-muted-foreground">5 yulduzli baho olish</span>
                                <span className="font-bold text-green-600">+1</span>
                            </li>
                            <li className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg border border-green-500/10">
                                <span className="text-muted-foreground">Xizmatni muvaffaqiyatli yakunlash</span>
                                <span className="font-bold text-green-600">+2</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-rose-600 mb-2">
                            <TrendingUp className="w-4 h-4 rotate-180" />
                            <span className="text-xs font-bold uppercase tracking-wider">Reyting tushishi</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center justify-between p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                <span className="text-muted-foreground">Mijoz shikoyati (tasdiqlangan)</span>
                                <span className="font-bold text-rose-600">-10</span>
                            </li>
                            <li className="flex items-center justify-between p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                <span className="text-muted-foreground">Buyurtmani sababsiz bekor qilish</span>
                                <span className="font-bold text-rose-600">-5</span>
                            </li>
                            <li className="flex items-center justify-between p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                <span className="text-muted-foreground">Xizmatga kelmaslik (No-show)</span>
                                <span className="font-bold text-rose-600">-15</span>
                            </li>
                            <li className="flex items-center justify-between p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                <span className="text-muted-foreground">Past baho (1-2 yulduz)</span>
                                <span className="font-bold text-rose-600">-2</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BusinessTrust;
