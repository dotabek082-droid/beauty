import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Gift, Percent, Check, CheckCircle, XCircle, Tag,
    Calendar, Clock, Info, Eye, Filter, ChevronLeft,
    AlertTriangle, Building2, Ticket, Package, Star, StopCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockPromotions as initialPromotions } from "@/data/promotionData";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

const pendingPromos = [
    {
        ...initialPromotions[0],
        id: "pending-lottery",
        serviceName: "Yangi Yil Makiyaji",
        salonName: "Guzallik Salon",
        status: "pending",
        promotionType: "lottery",
        lotteryEnabled: true,
        imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
        serviceDescription: "Yangi yil kechasi uchun maxsus makiyaj yutib oling! G'oliblar tasodifiy aniqlanadi.",
        startsAt: "2026-02-01",
        endsAt: "2026-02-10",
        coinCost: 1500,
        submittedAt: "2026-01-30",
    },
    {
        ...initialPromotions[1],
        id: "pending-1plus1",
        serviceName: "1+1: Soch Kesish",
        salonName: "Barbershop Pro",
        status: "pending",
        promotionType: "buy_one_get_one",
        lotteryEnabled: false,
        serviceDescription: "Do'stingiz bilan keling, 2-chi soch kesish bepul! Faqat ish kunlari amal qiladi.",
        imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
        startsAt: "2026-02-05",
        endsAt: "2026-03-05",
        coinCost: 500,
        submittedAt: "2026-01-31",
    },
    {
        ...initialPromotions[2],
        id: "pending-discount",
        serviceName: "Manikyur -30%",
        salonName: "Nail Art Studio",
        status: "pending",
        promotionType: "discount",
        lotteryEnabled: false,
        discountedPrice: 70000,
        originalPrice: 100000,
        serviceDescription: "Barcha turdagi manikyur xizmatlariga 30% chegirma. Shoshiling!",
        imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
        startsAt: "2026-02-01",
        endsAt: "2026-02-28",
        coinCost: 500,
        submittedAt: "2026-02-01",
    },
    {
        ...initialPromotions[3],
        id: "pending-free",
        serviceName: "Bepul Maslahat",
        salonName: "Dermatologiya Markazi",
        status: "pending",
        promotionType: "free_service",
        lotteryEnabled: false,
        originalPrice: 0,
        serviceDescription: "Dermatolog ko'rigi va maslahati mutlaqo bepul. Faqat birinchi tashrif.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
        startsAt: "2026-02-10",
        endsAt: "2026-02-20",
        coinCost: 1000,
        submittedAt: "2026-02-02",
    },
];

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    lottery:        { label: "Lotereya",    color: "text-purple-700", bg: "bg-purple-100", icon: <Ticket className="w-3.5 h-3.5" /> },
    buy_one_get_one:{ label: "1+1 Taklif", color: "text-green-700",  bg: "bg-green-100",  icon: <Gift className="w-3.5 h-3.5" /> },
    discount:       { label: "Chegirma",   color: "text-orange-700", bg: "bg-orange-100", icon: <Percent className="w-3.5 h-3.5" /> },
    free_service:   { label: "Bepul Xizmat", color: "text-blue-700", bg: "bg-blue-100",   icon: <Star className="w-3.5 h-3.5" /> },
    loyalty_card:   { label: "Sadoqat",    color: "text-teal-700",   bg: "bg-teal-100",   icon: <Tag className="w-3.5 h-3.5" /> },
    service_bundle: { label: "Paket",      color: "text-pink-700",   bg: "bg-pink-100",   icon: <Package className="w-3.5 h-3.5" /> },
    "1+1":          { label: "1+1 Aksiya", color: "text-green-700",  bg: "bg-green-100",  icon: <Gift className="w-3.5 h-3.5" /> },
    regular:        { label: "Oddiy",      color: "text-gray-700",   bg: "bg-gray-100",   icon: <Tag className="w-3.5 h-3.5" /> },
};

const getType = (type?: string) => typeConfig[type ?? ""] ?? typeConfig["regular"];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending:     { label: "Kutilmoqda",   color: "text-amber-700",  bg: "bg-amber-100"  },
    active:      { label: "Faol",          color: "text-green-700",  bg: "bg-green-100"  },
    rejected:    { label: "Rad etilgan",   color: "text-red-700",    bg: "bg-red-100"    },
    completed:   { label: "Yakunlangan",   color: "text-gray-600",   bg: "bg-gray-100"   },
    fulfillment: { label: "Jarayonda",     color: "text-blue-700",   bg: "bg-blue-100"   },
    stopped:     { label: "To'xtatilgan",  color: "text-red-700",    bg: "bg-red-100"    },
};

const AdminPromotions = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [promotions, setPromotions] = useState(() => {
        const mapped = initialPromotions.map((p) => ({
            ...p,
            status: p.isActive ? "active" : "completed",
            promotionType: p.promotionType || "regular",
            coinCost: 500,
            submittedAt: "2026-01-15",
        }));

        const activePromo = {
            id: "active-loyalty",
            serviceName: "Sadoqat Kartasi: 5 Tashrif",
            salonName: "Sadoqat Spa & Beauty",
            status: "active",
            promotionType: "loyalty_card",
            lotteryEnabled: false,
            imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
            serviceDescription: "5 ta tashrif qilgan mijozlarga 1 ta bepul spa protsedura sovg'a qilinadi! Sadoqatli mijozlarimizni rag'batlantiramiz.",
            startsAt: "2026-01-15",
            endsAt: "2026-06-01",
            coinCost: 750,
            submittedAt: "2026-01-10",
            originalPrice: 150000,
            discountedPrice: 0,
            slotsAvailable: 20,
            isActive: true,
        };

        const activePromo2 = {
            id: "active-bundle",
            serviceName: "Kelinlar uchun Paket",
            salonName: "Luxe Beauty Center",
            status: "active",
            promotionType: "service_bundle",
            lotteryEnabled: false,
            imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop",
            serviceDescription: "Makiyaj, pricheska va manikyur birgalikda 20% chegirma bilan! Eng baxtli kun uchun eng yaxshi xizmatlar.",
            startsAt: "2026-02-01",
            endsAt: "2026-05-31",
            coinCost: 600,
            submittedAt: "2026-01-20",
            originalPrice: 1200000,
            discountedPrice: 960000,
            slotsAvailable: 10,
            isActive: true,
        };

        return [...pendingPromos, activePromo, activePromo2, ...mapped];
    });

    const [tab, setTab] = useState<"pending" | "active" | "all">("pending");
    const [search, setSearch] = useState("");
    const [detail, setDetail] = useState<(typeof promotions)[0] | null>(null);
    const [rejectDialog, setRejectDialog] = useState<(typeof promotions)[0] | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectError, setRejectError] = useState("");

    const [stopDialog, setStopDialog] = useState<(typeof promotions)[0] | null>(null);
    const [stopReason, setStopReason] = useState("");
    const [stopError, setStopError] = useState("");

    const filtered = promotions.filter((p) => {
        const matchSearch =
            p.serviceName.toLowerCase().includes(search.toLowerCase()) ||
            p.salonName.toLowerCase().includes(search.toLowerCase());
        if (tab === "pending") return matchSearch && p.status === "pending";
        if (tab === "active")  return matchSearch && p.status === "active";
        return matchSearch;
    });

    const counts = {
        pending: promotions.filter((p) => p.status === "pending").length,
        active:  promotions.filter((p) => p.status === "active").length,
        stopped: promotions.filter((p) => p.status === "stopped").length,
        total:   promotions.length,
    };

    const approve = (id: string) => {
        setPromotions((prev) => prev.map((p) => p.id === id ? { ...p, status: "active" } : p));
        setDetail(null);
        toast({ title: "✅ Tasdiqlandi", description: "Aksiya faollashtirildi va biznesga xabar yuborildi." });
    };

    const reject = (id: string) => {
        if (!rejectReason.trim()) {
            setRejectError("Iltimos, rad etish sababini kiriting.");
            return;
        }
        setPromotions((prev) => prev.map((p) => p.id === id ? { ...p, status: "rejected", rejectReason } : p));
        setRejectDialog(null);
        setRejectReason("");
        setRejectError("");
        setDetail(null);
        toast({ title: "❌ Rad etildi", description: `Sabab: "${rejectReason}" — biznes egasiga yuborildi.`, variant: "destructive" });
    };

    const stopPromotion = (id: string) => {
        if (!stopReason.trim()) {
            setStopError("Iltimos, to'xtatish sababini kiriting.");
            return;
        }
        setPromotions((prev) => prev.map((p) => p.id === id ? { ...p, status: "stopped", stopReason } : p));
        setStopDialog(null);
        setStopReason("");
        setStopError("");
        setDetail(null);
        toast({ title: "⛔ To'xtatildi", description: `Aksiya to'xtatildi. Sabab: "${stopReason}"`, variant: "destructive" });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">
            {/* Header */}
            <div className="bg-white dark:bg-card border-b sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-foreground">Aksiyalar Boshqaruvi</h1>
                        <p className="text-xs text-muted-foreground">Biznes aksiyalarini ko'rib chiqing va tasdiqlang</p>
                    </div>
                    <Badge className="bg-amber-500 text-white text-sm px-3 py-1">
                        {counts.pending} kutilmoqda
                    </Badge>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Kutilmoqda", value: counts.pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: <Clock className="w-5 h-5 text-amber-500" /> },
                        { label: "Faol",        value: counts.active,  color: "text-green-600", bg: "bg-green-50 border-green-200",  icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
                        { label: "Jami",        value: counts.total,   color: "text-blue-600",  bg: "bg-blue-50 border-blue-200",    icon: <Filter className="w-5 h-5 text-blue-500" /> },
                    ].map((s) => (
                        <Card key={s.label} className={`p-4 border ${s.bg}`}>
                            <div className="flex items-center justify-between mb-1">{s.icon}</div>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                        </Card>
                    ))}
                </div>

                {/* Search + Tabs */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Aksiya yoki salon nomini qidirish..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex rounded-lg border bg-white dark:bg-card overflow-hidden">
                        {(["pending", "active", "all"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    tab === t
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                {t === "pending" ? `Kutilmoqda (${counts.pending})` : t === "active" ? "Faol" : "Hammasi"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Aksiyalar topilmadi</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filtered.map((promo, i) => {
                                const type = getType(promo.promotionType);
                                const st = statusConfig[promo.status] ?? statusConfig["completed"];
                                return (
                                    <motion.div
                                        key={promo.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border">
                                            {/* Image */}
                                            <div className="relative h-36">
                                                <img
                                                    src={promo.imageUrl}
                                                    alt={promo.serviceName}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                {/* Badges overlay */}
                                                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${type.bg} ${type.color}`}>
                                                        {type.icon} {type.label}
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                                                        {st.label}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-2 left-3 right-3">
                                                    <p className="text-white font-bold text-sm leading-tight line-clamp-1">{promo.serviceName}</p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Building2 className="w-3 h-3 text-white/70" />
                                                        <p className="text-white/80 text-xs">{promo.salonName}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-3 flex flex-col gap-2 flex-1">
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {promo.serviceDescription}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{promo.startsAt} — {promo.endsAt || "∞"}</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                        🪙 {(promo as any).coinCost?.toLocaleString() ?? "—"} tanga
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-xs h-7 px-2 text-primary"
                                                        onClick={() => setDetail(promo)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5 mr-1" /> Ko'rish
                                                    </Button>
                                                </div>

                                                {/* Action buttons for pending */}
                                                {promo.status === "pending" && (
                                                    <div className="flex gap-2 mt-1 pt-2 border-t">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                                                            onClick={() => approve(promo.id)}
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Tasdiqlash
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="flex-1 text-xs h-8"
                                                            onClick={() => { setRejectDialog(promo); setRejectReason(""); setRejectError(""); }}
                                                        >
                                                            <XCircle className="w-3.5 h-3.5 mr-1" /> Rad etish
                                                        </Button>
                                                    </div>
                                                )}
                                                {/* Stop button for active */}
                                                {promo.status === "active" && (
                                                    <div className="pt-2 mt-1 border-t">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="w-full text-xs h-8 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                            onClick={() => { setStopDialog(promo); setStopReason(""); setStopError(""); }}
                                                        >
                                                            <StopCircle className="w-3.5 h-3.5 mr-1" /> Aksiyani to'xtatish
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
                <DialogContent className="max-w-lg">
                    {detail && (() => {
                        const type = getType(detail.promotionType);
                        const st = statusConfig[detail.status] ?? statusConfig["completed"];
                        return (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <span className={`p-1.5 rounded-lg ${type.bg} ${type.color}`}>{type.icon}</span>
                                        {detail.serviceName}
                                    </DialogTitle>
                                    <DialogDescription className="flex items-center gap-2 mt-1">
                                        <Building2 className="w-3.5 h-3.5" /> {detail.salonName}
                                        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Image */}
                                <div className="rounded-lg overflow-hidden h-44 -mx-1">
                                    <img src={detail.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-muted/40 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">Aksiya turi</p>
                                        <p className={`font-semibold ${type.color} flex items-center gap-1`}>{type.icon}{type.label}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">Coin narxi</p>
                                        <p className="font-semibold text-amber-600">🪙 {(detail as any).coinCost?.toLocaleString() ?? "—"}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">Boshlanish</p>
                                        <p className="font-semibold">{detail.startsAt}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">Tugash</p>
                                        <p className="font-semibold">{detail.endsAt || "Cheksiz"}</p>
                                    </div>
                                </div>

                                <div className="bg-muted/30 rounded-lg p-3 text-sm">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Tavsif</p>
                                    <p className="text-muted-foreground leading-relaxed">{detail.serviceDescription}</p>
                                </div>

                                {detail.status === "pending" && (
                                    <div className="flex gap-3 pt-1">
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => approve(detail.id)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" /> Tasdiqlash
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => { setRejectDialog(detail); setDetail(null); setRejectReason(""); setRejectError(""); }}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Rad etish
                                        </Button>
                                    </div>
                                )}
                                {detail.status === "active" && (
                                    <div className="pt-1">
                                        <Button
                                            variant="outline"
                                            className="w-full border-red-300 text-red-600 hover:bg-red-50"
                                            onClick={() => { setStopDialog(detail); setDetail(null); setStopReason(""); setStopError(""); }}
                                        >
                                            <StopCircle className="w-4 h-4 mr-2" /> Aksiyani to'xtatish
                                        </Button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={!!rejectDialog} onOpenChange={(o) => { if (!o) { setRejectDialog(null); setRejectError(""); } }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" /> Aksiyani rad etish
                        </DialogTitle>
                        <DialogDescription>
                            <strong>{rejectDialog?.serviceName}</strong> — <span className="text-muted-foreground">{rejectDialog?.salonName}</span>
                            <br />Biznes egasiga sabab yuboriladi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1">
                            Rad etish sababi
                            <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            className={`w-full border rounded-lg p-3 text-sm resize-none h-24 bg-background focus:outline-none focus:ring-2 transition-colors ${
                                rejectError ? "border-destructive focus:ring-destructive/30" : "focus:ring-primary/30"
                            }`}
                            placeholder="Masalan: Shartlarga mos kelmaydi, rasm sifati past, tavsif noto'g'ri..."
                            value={rejectReason}
                            onChange={(e) => { setRejectReason(e.target.value); if (e.target.value.trim()) setRejectError(""); }}
                        />
                        {rejectError && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {rejectError}
                            </p>
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectError(""); }}>Bekor qilish</Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => rejectDialog && reject(rejectDialog.id)}
                            disabled={!rejectReason.trim()}
                        >
                            <XCircle className="w-4 h-4 mr-2" /> Rad etish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stop Promotion Dialog */}
            <Dialog open={!!stopDialog} onOpenChange={(o) => { if (!o) { setStopDialog(null); setStopError(""); } }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <StopCircle className="w-5 h-5" /> Aksiyani to'xtatish
                        </DialogTitle>
                        <DialogDescription>
                            <strong>{stopDialog?.serviceName}</strong> — <span className="text-muted-foreground">{stopDialog?.salonName}</span>
                            <br />Aksiya darhol to'xtatiladi va biznes egasiga sabab yuboriladi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>Bu amalni qaytarib bo'lmaydi. Aksiya darhol foydalanuvchilar uchun yopiladi.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1">
                            To'xtatish sababi
                            <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            className={`w-full border rounded-lg p-3 text-sm resize-none h-24 bg-background focus:outline-none focus:ring-2 transition-colors ${
                                stopError ? "border-destructive focus:ring-destructive/30" : "focus:ring-red-300"
                            }`}
                            placeholder="Masalan: Shikoyat kelib tushdi, shartlarga zid, muddati tugadi..."
                            value={stopReason}
                            onChange={(e) => { setStopReason(e.target.value); if (e.target.value.trim()) setStopError(""); }}
                        />
                        {stopError && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {stopError}
                            </p>
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => { setStopDialog(null); setStopError(""); }}>Bekor qilish</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => stopDialog && stopPromotion(stopDialog.id)}
                            disabled={!stopReason.trim()}
                        >
                            <StopCircle className="w-4 h-4 mr-2" /> To'xtatish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPromotions;
