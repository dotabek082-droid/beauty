import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Clock, Ticket, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fakePromocodes, Promocode } from "@/data/promocodes";
import BottomNav from "@/components/BottomNav";
import { format } from "date-fns";

const MyPromocodesPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const activePromocodes = fakePromocodes.filter(p => p.status === 'active');
    const historyPromocodes = fakePromocodes.filter(p => p.status !== 'active');

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast({
            title: "Nusxalandi",
            description: "Promokod buferga saqlandi",
        });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy");
        } catch {
            return dateStr;
        }
    };

    const PromocodeCard = ({ promo }: { promo: Promocode }) => {
        const isAdmin = promo.source === 'admin';
        const isExpired = promo.status === 'expired';
        const isUsed = promo.status === 'used';

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3"
            >
                <div className={`relative overflow-hidden rounded-xl border ${isAdmin ? 'border-amber-400/50 bg-amber-50/10' : 'border-border bg-card'} p-4 shadow-sm hover:shadow-md transition-all`}>
                    {/* Background decoration */}
                    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${isAdmin ? 'bg-amber-400/10' : 'bg-primary/5'} blur-2xl`} />

                    <div className="relative flex justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                {isAdmin && (
                                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 h-5">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        Admin Taklifi
                                    </Badge>
                                )}
                                {isExpired && <Badge variant="destructive" className="text-[10px] h-5">Muddati tugagan</Badge>}
                                {isUsed && <Badge variant="secondary" className="text-[10px] h-5">Ishlatilgan</Badge>}
                            </div>

                            <div className="flex items-baseline gap-2">
                                <h3 className={`text-xl font-bold tracking-tight ${isAdmin ? 'text-amber-700' : 'text-primary'}`}>
                                    {promo.discountType === 'percent' ? `-${promo.discountValue}%` : `-${promo.discountValue.toLocaleString()} so'm`}
                                </h3>
                                <span className="text-sm font-medium text-foreground">{promo.code}</span>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {promo.description}
                            </p>

                            {promo.applicableCategories && promo.applicableCategories.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                    {promo.applicableCategories.map((cat, i) => (
                                        <Badge key={i} variant="secondary" className="text-[9px] h-4 px-1.5 bg-secondary text-secondary-foreground font-normal">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground pt-1">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Amal qilish: {formatDate(promo.validUntil)}</span>
                                </div>
                                {promo.minOrderAmount && (
                                    <div className="flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        <span>Min. buyurtma: {promo.minOrderAmount.toLocaleString()} so'm</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side actions */}
                        <div className="flex flex-col items-end justify-between">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                <Ticket className="w-5 h-5" />
                            </div>

                            {promo.status === 'active' && (
                                <Button
                                    size="sm"
                                    variant={isAdmin ? "default" : "outline"}
                                    className={`h-8 text-xs gap-1.5 ${isAdmin ? 'bg-amber-600 hover:bg-amber-700 text-white border-transparent' : ''}`}
                                    onClick={() => handleCopy(promo.code, promo.id)}
                                >
                                    {copiedId === promo.id ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            Nusxalandi
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Nusxalash
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="flex items-center gap-3 p-3 safe-top">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Promokodlarim</h1>
                        <p className="text-xs text-muted-foreground">Maxsus chegirma kodlari</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="active">Faol ({activePromocodes.length})</TabsTrigger>
                        <TabsTrigger value="history">Tarix</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-3">
                        {activePromocodes.length > 0 ? (
                            activePromocodes.map(promo => (
                                <PromocodeCard key={promo.id} promo={promo} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Ticket className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-sm font-medium">Faol promokodlar yo'q</h3>
                                <p className="text-xs text-muted-foreground mt-1">Yangi aksiyalarni kuting</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-3">
                        {historyPromocodes.map(promo => (
                            <PromocodeCard key={promo.id} promo={promo} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>

            <BottomNav />
        </div>
    );
};

export default MyPromocodesPage;
