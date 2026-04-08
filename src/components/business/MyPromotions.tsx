import { useState, useEffect } from "react";
import { useFrontendPromotions } from "@/hooks/useFrontendPromotions";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Eye, Edit, Trash2, AlertCircle,
    CheckCircle, XCircle, Clock, PieChart,
    Layers, Check, Filter, ArrowRight, Star, ChevronLeft, ChevronRight, X, Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPromotionsByBusinessId } from "@/data/businessData";
import { BusinessPromotion } from "@/types/business";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PromotionParticipants } from "@/components/business/PromotionParticipants";
import { generateMockParticipants } from "@/data/mockParticipants";

interface MyPromotionsProps {
    businessId: string;
}

const MyPromotions = ({ businessId }: MyPromotionsProps) => {
    const { promotions: frontendPromos } = useFrontendPromotions(businessId);
    const [promotions, setPromotions] = useState<BusinessPromotion[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const [viewingPromotion, setViewingPromotion] = useState<BusinessPromotion | null>(null);
    const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
    const [selectedPromotionForParticipants, setSelectedPromotionForParticipants] = useState<BusinessPromotion | null>(null);

    useEffect(() => {
        if (frontendPromos && frontendPromos.length > 0) {
            loadPromotions();
        }
    }, [businessId, frontendPromos]);

    const loadPromotions = () => {
        // Use frontend promotions with proper structure
        if (!frontendPromos || frontendPromos.length === 0) {
            setPromotions([]);
            return;
        }

        const mappedPromos = frontendPromos.map((promo: any) => ({
            ...promo,
            approvalStatus: {
                status: promo.approval_status || 'pending_approval',
                rejectionReason: promo.rejection_reason
            },
            lotteryEnabled: promo.promotion_type === 'lottery',
            promotionType: promo.promotion_type, // Keep exact type
            totalWinners: promo.winner_count || 0,
            slotsAvailable: 100,
            slotsUsed: 0,
            startsAt: promo.start_date,
            endsAt: promo.end_date,
            originalPrice: promo.original_price || 0,
            ticketPrice: promo.ticket_price || 0,
            discountedPrice: promo.discounted_price,
            imageUrl: promo.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=60',
            serviceDescription: promo.terms_and_conditions || ''
        }));
        setPromotions(mappedPromos);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "draft":
                return <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Qoralama</Badge>;
            case "pending_approval":
                return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0">Kutilmoqda</Badge>;
            case "approved":
                return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">Tasdiqlangan</Badge>;
            case "rejected":
                return <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-0">Rad etilgan</Badge>;
            case "active":
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">Faol</Badge>;
            case "expired":
                return <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0">Tugagan</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredPromotions = promotions.filter((promo) => {
        if (filter === "all") return true;
        return promo.approvalStatus.status === filter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedPromotions = filteredPromotions.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const stats = {
        total: promotions.length,
        pending: promotions.filter((p) => p.approvalStatus.status === "pending_approval").length,
        approved: promotions.filter((p) => p.approvalStatus.status === "approved").length,
        rejected: promotions.filter((p) => p.approvalStatus.status === "rejected").length,
        active: promotions.filter((p) => p.approvalStatus.status === "active").length,
    };

    const statCards = [
        { id: "all", label: "Jami", value: stats.total, icon: Layers, color: "text-slate-600", bg: "bg-slate-50" },
        { id: "pending_approval", label: "Kutilmoqda", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { id: "approved", label: "Tasdiqlangan", value: stats.approved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
        { id: "rejected", label: "Rad etilgan", value: stats.rejected, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
        { id: "active", label: "Faol", value: stats.active, icon: PieChart, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    return (
        <div className="space-y-4">
            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                {statCards.map((stat) => (
                    <motion.div
                        key={stat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter(stat.id)}
                        className={`p-2 rounded-xl cursor-pointer transition-all ${filter === stat.id
                            ? `ring-2 ring-primary/20 ${stat.bg} shadow-sm`
                            : "bg-card border border-border hover:border-primary/30"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-tight truncate mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Compact Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
                {[
                    { id: "all", label: "Barchasi", icon: Layers },
                    { id: "pending_approval", label: "Kutilmoqda", icon: Clock },
                    { id: "approved", label: "Tasdiqlangan", icon: CheckCircle },
                    { id: "rejected", label: "Rad etilgan", icon: XCircle },
                    { id: "active", label: "Faol", icon: PieChart }
                ].map((item) => {
                    const isActive = filter === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(item.id)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <item.icon className="w-3 h-3" />
                            {item.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Promotions List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredPromotions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="p-12 text-center border-dashed border-2 bg-muted/20">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                                <p className="text-muted-foreground font-medium">
                                    {filter === "all" ? "Sizda hali aksiyalar yo'q" : `${filter.replace('_approval', '')} holatidagi aksiyalar yo'q`}
                                </p>
                                {filter !== "all" && (
                                    <Button variant="link" onClick={() => setFilter("all")} className="mt-2 text-primary">
                                        Barchasini ko'rish
                                    </Button>
                                )}
                            </Card>
                        </motion.div>
                    ) : (
                        paginatedPromotions.map((promo, index) => (
                            <motion.div
                                key={promo.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden shadow-soft border-0 hover:shadow-lg transition-all">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Image Area - Clickable */}
                                        <div
                                            className="relative w-full sm:w-28 h-28 flex-shrink-0 cursor-pointer group"
                                            onClick={() => setViewingPromotion(promo)}
                                        >
                                            <img
                                                src={promo.imageUrl}
                                                alt={promo.serviceName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                                                {getStatusBadge(promo.approvalStatus.status)}
                                                {promo.lotteryEnabled && (
                                                    <Badge className="bg-purple-600 text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                                                        <Star className="w-2.5 h-2.5 mr-0.5 fill-white" />
                                                        LOTEREYA
                                                    </Badge>
                                                )}
                                                {promo.promotionType === 'buy_one_get_one' && (
                                                    <Badge className="bg-orange-500 text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                                                        <Users className="w-2.5 h-2.5 mr-0.5" />
                                                        1 + 1 AKSIYA
                                                    </Badge>
                                                )}
                                                {promo.promotionType === 'service_bundle' && (
                                                    <Badge className="bg-pink-600 text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                                                        📦 PAKET
                                                    </Badge>
                                                )}
                                                {promo.promotionType === 'loyalty_card' && (
                                                    <Badge className="bg-teal-600 text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                                                        🎫 SADOQAT
                                                    </Badge>
                                                )}
                                                {promo.promotionType === 'free_service' && (
                                                    <Badge className="bg-emerald-500 text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                                                        BEPUL
                                                    </Badge>
                                                )}
                                                {promo.promotionType === 'discount' && (
                                                    <Badge className="bg-blue-500 text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                                                        CHEGIRMA
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Area - More Compact */}
                                        <div className="flex-1 p-3 flex flex-col min-h-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-sm truncate mb-0.5">{promo.serviceName}</h3>
                                                    <p className="text-[10px] text-muted-foreground leading-tight mb-2 overflow-hidden"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            maxHeight: '14px'
                                                        }}
                                                        title={promo.serviceDescription}
                                                    >
                                                        {promo.serviceDescription}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    {promo.promotionType === 'service_bundle' ? (
                                                        <>
                                                            <p className="text-sm font-black text-pink-600">
                                                                {((promo as any).bundle_price || 0).toLocaleString()} so'm
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground line-through">
                                                                {promo.originalPrice.toLocaleString()} so'm
                                                            </p>
                                                        </>
                                                    ) : promo.promotionType === 'free_service' || promo.promotionType === 'loyalty_card' ? (
                                                        <p className="text-sm font-black text-primary">
                                                            {promo.originalPrice.toLocaleString()} so'm
                                                        </p>
                                                    ) : promo.promotionType === 'lottery' ? (
                                                        <p className="text-sm font-black text-purple-600">
                                                            {promo.ticketPrice} tanga
                                                        </p>
                                                    ) : promo.promotionType === 'discount' ? (
                                                        <>
                                                            <p className="text-sm font-black text-blue-600">
                                                                {(promo as any).discount_type === 'percentage'
                                                                    ? (promo.originalPrice * (1 - ((promo as any).discount_value || 0) / 100)).toLocaleString()
                                                                    : (promo.originalPrice - ((promo as any).discount_value || 0)).toLocaleString()} so'm
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground line-through">
                                                                {promo.originalPrice.toLocaleString()} so'm
                                                            </p>
                                                        </>
                                                    ) : promo.promotionType === 'buy_one_get_one' ? (
                                                        <p className="text-sm font-black text-orange-600">
                                                            {promo.originalPrice.toLocaleString()} so'm
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm font-black text-primary">
                                                            {promo.originalPrice.toLocaleString()} so'm
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-auto grid grid-cols-2 gap-2 border-t pt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="p-1 bg-primary/10 rounded-md">
                                                        <Calendar className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">BOSHLANISH</p>
                                                        <p className="text-[10px] font-semibold">
                                                            {promo.startsAt ? new Date(promo.startsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <div className="p-1 bg-primary/10 rounded-md">
                                                        <Calendar className="w-3 h-3 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">TUGASH</p>
                                                        <p className="text-[10px] font-semibold">
                                                            {promo.endsAt ? new Date(promo.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Places/Winners Row - Moved below dates */}
                                            <div className="mt-2 flex items-center gap-1.5 border-t pt-2">
                                                <div className="p-1 bg-secondary/10 rounded-md">
                                                    <Layers className="w-3 h-3 text-secondary-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                                                        {promo.lotteryEnabled ? "G'OLIBLAR" : "JOYLAR"}
                                                    </p>
                                                    <p className="text-[10px] font-semibold">
                                                        {promo.lotteryEnabled ? promo.totalWinners : `${promo.slotsUsed}/${promo.slotsAvailable}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Specific Info */}
                                            {promo.approvalStatus.status === "rejected" && (
                                                <div className="mt-2 p-2 bg-rose-50 rounded-lg border border-rose-100 flex gap-1.5">
                                                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                                                    <p className="text-[10px] text-rose-700 italic">
                                                        <span className="font-bold not-italic">Rad etilgan:</span> {promo.approvalStatus.rejectionReason}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {/* Eye icon removed */}
                                                    {(promo.approvalStatus.status === "draft" || promo.approvalStatus.status === "rejected") && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 bg-primary/10 hover:bg-primary/20 text-primary"
                                                            onClick={() => {
                                                                // TODO: Open edit dialog
                                                                console.log('Edit promotion:', promo.id);
                                                            }}
                                                            title="Tahrirlash"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                    {promo.approvalStatus.status === "draft" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 bg-rose-100/50 hover:bg-rose-100 text-rose-600"
                                                            onClick={() => {
                                                                if (confirm('Aksiyani o\'chirishni xohlaysizmi?')) {
                                                                    // TODO: Delete promotion
                                                                    console.log('Delete promotion:', promo.id);
                                                                }
                                                            }}
                                                            title="O'chirish"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>

                                                {promo.approvalStatus.status === "approved" && (
                                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Ko'rinmoqda</span>
                                                    </div>
                                                )}

                                                {promo.approvalStatus.status === "pending_approval" && (
                                                    <div className="flex items-center gap-1.5 text-amber-600 animate-pulse">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Ko'rib chiqilmoqda</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {filteredPromotions.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="gap-1 h-8"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Orqaga
                    </Button>

                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-medium">
                            Sahifa {currentPage} / {totalPages}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            ({filteredPromotions.length} ta aksiya)
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="gap-1 h-8"
                    >
                        Keyingi
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}
            {/* Promotion Details Dialog */}
            <Dialog open={!!viewingPromotion} onOpenChange={(open) => !open && setViewingPromotion(null)}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    {viewingPromotion && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{viewingPromotion.serviceName}</DialogTitle>
                                <DialogDescription>
                                    {viewingPromotion.salonName}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                    <img
                                        src={viewingPromotion.imageUrl}
                                        alt={viewingPromotion.serviceName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                                        {getStatusBadge(viewingPromotion.approvalStatus.status)}
                                    </div>
                                </div>

                                {/* Type-Specific Details */}
                                {viewingPromotion.promotionType === 'lottery' && (
                                    <div className="space-y-3">
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-purple-900 mb-3">🎟️ Lotereya Ma'lumotlari</p>

                                            {/* Basic Info */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-purple-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Kirish narxi:</span>
                                                    <span className="font-bold text-purple-900">{viewingPromotion.ticketPrice} tanga</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">G'oliblar soni:</span>
                                                    <span className="font-bold text-purple-900">{viewingPromotion.totalWinners} ta</span>
                                                </div>
                                            </div>

                                            {/* Selected Services */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-purple-200">
                                                <p className="text-xs font-semibold text-purple-800 mb-1.5">Tanlangan xizmatlar:</p>
                                                {/* Mock services - In real app, fetch from lottery_service_ids */}
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-sm bg-purple-50 p-2 rounded">
                                                        <span className="text-purple-700">Erkaklar soch turmagi</span>
                                                        <span className="text-purple-600">50,000 so'm</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm bg-purple-50 p-2 rounded">
                                                        <span className="text-purple-700">Soch turish</span>
                                                        <span className="text-purple-600">30,000 so'm</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm bg-purple-50 p-2 rounded">
                                                        <span className="text-purple-700">Soqol olish</span>
                                                        <span className="text-purple-600">40,000 so'm</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-sm pt-2 border-t border-purple-200 mt-2">
                                                    <span className="text-purple-700 font-bold">Jami qiymat:</span>
                                                    <span className="font-bold text-purple-900">120,000 so'm</span>
                                                </div>
                                            </div>

                                            {/* Additional Details */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-purple-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Tavsif:</span>
                                                    <span className="text-purple-900 text-xs text-right max-w-[60%]">{viewingPromotion.serviceDescription || 'Tavsif yo\'q'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Tur:</span>
                                                    <span className="font-medium text-purple-900">Lotereya</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Yaratish narxi:</span>
                                                    <span className="font-medium text-purple-900">150 tanga</span>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-purple-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Boshlanish sanasi:</span>
                                                    <span className="text-purple-900">{new Date(viewingPromotion.startsAt).toLocaleDateString('uz-UZ')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-purple-700">Tugash sanasi:</span>
                                                    <span className="text-purple-900">{viewingPromotion.endsAt ? new Date(viewingPromotion.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}</span>
                                                </div>
                                            </div>

                                            {/* Advanced Settings */}
                                            {((viewingPromotion as any).min_client_trust_score || (viewingPromotion as any).target_region) && (
                                                <div className="space-y-2 mb-3 pb-3 border-b border-purple-200">
                                                    {(viewingPromotion as any).min_client_trust_score && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-purple-700">Mijoz ishonch reytingi:</span>
                                                            <span className="font-medium text-purple-900">{(viewingPromotion as any).min_client_trust_score}+</span>
                                                        </div>
                                                    )}
                                                    {(viewingPromotion as any).target_region && (
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-purple-700">Ko'rinish hududi:</span>
                                                                <span className="font-medium text-purple-900">{(viewingPromotion as any).target_region}</span>
                                                            </div>
                                                            {(viewingPromotion as any).target_districts && (viewingPromotion as any).target_districts.length > 0 && (
                                                                <div className="text-xs text-purple-700">
                                                                    Tumanlar: {(viewingPromotion as any).target_districts.join(', ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Registered Participants - Show only for active promotions */}
                                            {viewingPromotion.approvalStatus.status === 'active' && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs font-semibold text-purple-700">Ro'yxatdan o'tganlar:</p>
                                                        <span className="text-xs font-medium text-purple-900">{viewingPromotion.currentEntries || 0} kishi</span>
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto space-y-1.5">
                                                        {/* Mock registered users */}
                                                        {[
                                                            { name: 'Alisher Karimov', phone: '+998 90 123 45 67', date: '2026-02-08' },
                                                            { name: 'Dilnoza Rahimova', phone: '+998 91 234 56 78', date: '2026-02-09' },
                                                            { name: 'Sardor Toshmatov', phone: '+998 93 345 67 89', date: '2026-02-09' },
                                                            { name: 'Nigora Hamidova', phone: '+998 94 456 78 90', date: '2026-02-10' },
                                                            { name: 'Jasur Ahmadov', phone: '+998 95 567 89 01', date: '2026-02-10' }
                                                        ].map((user, idx) => (
                                                            <div key={idx} className="bg-purple-50 rounded p-2 text-xs">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <p className="font-medium text-purple-900">{user.name}</p>
                                                                        <p className="text-purple-600">{user.phone}</p>
                                                                    </div>
                                                                    <span className="text-purple-500 text-[10px]">{user.date}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {viewingPromotion.promotionType === 'buy_one_get_one' && (
                                    <div className="space-y-3">
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-orange-900 mb-3">🎁 1+1 Aksiya Tafsilotlari</p>

                                            {/* Basic Offer Info */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-orange-200">
                                                <p className="text-xs font-semibold text-orange-800 mb-1.5">Tanlangan xizmat:</p>
                                                <div className="bg-orange-50 p-2 rounded border border-orange-200 mb-2">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm font-medium text-orange-900">{viewingPromotion.serviceName}</p>
                                                        <span className="text-xs text-orange-700">({(viewingPromotion as any).min_purchase_quantity || 1} ta puliga {((viewingPromotion as any).min_purchase_quantity || 1) + ((viewingPromotion as any).free_quantity || 1)} ta)</span>
                                                    </div>
                                                    <p className="text-xs text-orange-600 mt-1">{viewingPromotion.originalPrice.toLocaleString()} so'm</p>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Sotib oling:</span>
                                                    <span className="font-bold text-orange-900">{(viewingPromotion as any).min_purchase_quantity || 1} ta</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Bepul oling:</span>
                                                    <span className="font-bold text-orange-900">{(viewingPromotion as any).free_quantity || 1} ta</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Xizmat narxi:</span>
                                                    <span className="font-bold text-orange-900">{viewingPromotion.originalPrice.toLocaleString()} so'm</span>
                                                </div>
                                                <div className="bg-orange-100 rounded p-2 mt-2">
                                                    <p className="text-xs text-orange-800 font-medium text-center">
                                                        📦 Jami: {(viewingPromotion as any).min_purchase_quantity || 1} ta puliga {((viewingPromotion as any).min_purchase_quantity || 1) + ((viewingPromotion as any).free_quantity || 1)} ta
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Promotion Details */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-orange-200">
                                                <p className="text-xs font-semibold text-orange-800 mb-1.5">Aksiya ma'lumotlari:</p>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Tavsif:</span>
                                                    <span className="text-orange-900 text-xs text-right max-w-[60%]">{viewingPromotion.serviceDescription || 'Tavsif yo\'q'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Tur:</span>
                                                    <span className="font-medium text-orange-900">1+1 Taklif</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Yaratish narxi:</span>
                                                    <span className="font-medium text-orange-900">50 tanga</span>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-orange-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Boshlanish sanasi:</span>
                                                    <span className="text-orange-900">{new Date(viewingPromotion.startsAt).toLocaleDateString('uz-UZ')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-orange-700">Tugash sanasi:</span>
                                                    <span className="text-orange-900">{viewingPromotion.endsAt ? new Date(viewingPromotion.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}</span>
                                                </div>
                                            </div>


                                            {/* Limit */}
                                            {(viewingPromotion as any).max_customers && (
                                                <div className="mb-3 pb-3 border-b border-orange-200">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-orange-700 font-semibold">Limit:</span>
                                                        <span className="font-medium text-orange-900">{(viewingPromotion as any).max_customers} ta mijoz</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Limits and Advanced */}
                                            <div className="space-y-2">
                                                {(viewingPromotion as any).min_client_trust_score && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-orange-700">Mijoz ishonch reytingi:</span>
                                                        <span className="font-medium text-orange-900">{(viewingPromotion as any).min_client_trust_score}+</span>
                                                    </div>
                                                )}
                                                {(viewingPromotion as any).target_region && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-orange-700">Ko'rinish hududi:</span>
                                                            <span className="font-medium text-orange-900">{(viewingPromotion as any).target_region}</span>
                                                        </div>
                                                        {(viewingPromotion as any).target_districts && (viewingPromotion as any).target_districts.length > 0 && (
                                                            <div className="text-xs text-orange-700">
                                                                Tumanlar: {(viewingPromotion as any).target_districts.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewingPromotion.promotionType === 'discount' && (
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-blue-900 mb-3">💰 Chegirma Aksiyasi</p>

                                            {/* Promotion Details */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-blue-200">
                                                <p className="text-xs font-semibold text-blue-800 mb-1.5">Aksiya ma'lumotlari:</p>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Tavsif:</span>
                                                    <span className="text-blue-900 text-xs text-right max-w-[60%]">{viewingPromotion.serviceDescription || 'Tavsif yo\'q'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Tur:</span>
                                                    <span className="font-medium text-blue-900">Chegirma</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Yaratish narxi:</span>
                                                    <span className="font-medium text-blue-900">50 tanga</span>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-blue-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Boshlanish sanasi:</span>
                                                    <span className="text-blue-900">{new Date(viewingPromotion.startsAt).toLocaleDateString('uz-UZ')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-blue-700">Tugash sanasi:</span>
                                                    <span className="text-blue-900">{viewingPromotion.endsAt ? new Date(viewingPromotion.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}</span>
                                                </div>
                                            </div>

                                            {/* Selected Services with Pricing */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-blue-200">
                                                <p className="text-xs font-semibold text-blue-800 mb-1.5">Tanlangan xizmatlar:</p>
                                                {/* Mock services - In real app, fetch from service IDs */}
                                                <div className="space-y-1.5">
                                                    <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                                        <p className="text-sm font-medium text-blue-900 mb-1">{viewingPromotion.serviceName}</p>
                                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                                            <div>
                                                                <p className="text-blue-600">Asl narxi:</p>
                                                                <p className="font-medium text-blue-900">{viewingPromotion.originalPrice.toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-blue-600">Chegirma:</p>
                                                                <p className="font-medium text-blue-900">
                                                                    {(viewingPromotion as any).discount_type === 'percentage'
                                                                        ? (viewingPromotion.originalPrice * (1 - ((viewingPromotion as any).discount_value || 0) / 100)).toLocaleString()
                                                                        : (viewingPromotion.originalPrice - ((viewingPromotion as any).discount_value || 0)).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-blue-600">Tejash:</p>
                                                                <p className="font-medium text-green-600">
                                                                    -{(viewingPromotion as any).discount_type === 'percentage'
                                                                        ? (viewingPromotion.originalPrice * ((viewingPromotion as any).discount_value || 0) / 100).toLocaleString()
                                                                        : ((viewingPromotion as any).discount_value || 0).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Total Summary */}
                                                <div className="bg-blue-100 rounded p-2 mt-2 space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-blue-700 font-bold">Jami:</span>
                                                        <span className="font-bold text-blue-900">
                                                            {(viewingPromotion as any).discount_type === 'percentage'
                                                                ? (viewingPromotion.originalPrice * (1 - ((viewingPromotion as any).discount_value || 0) / 100)).toLocaleString()
                                                                : (viewingPromotion.originalPrice - ((viewingPromotion as any).discount_value || 0)).toLocaleString()} so'm
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-blue-600">Jami arzonlashtirildi:</span>
                                                        <span className="font-medium text-green-600">
                                                            {(viewingPromotion as any).discount_type === 'percentage'
                                                                ? (viewingPromotion.originalPrice * ((viewingPromotion as any).discount_value || 0) / 100).toLocaleString()
                                                                : ((viewingPromotion as any).discount_value || 0).toLocaleString()} so'm
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Advanced Settings */}
                                            <div className="space-y-2">
                                                {(viewingPromotion as any).min_client_trust_score && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-blue-700">Mijoz ishonch reytingi:</span>
                                                        <span className="font-medium text-blue-900">{(viewingPromotion as any).min_client_trust_score}+</span>
                                                    </div>
                                                )}
                                                {(viewingPromotion as any).target_region && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-blue-700">Ko'rinish hududi:</span>
                                                            <span className="font-medium text-blue-900">{(viewingPromotion as any).target_region}</span>
                                                        </div>
                                                        {(viewingPromotion as any).target_districts && (viewingPromotion as any).target_districts.length > 0 && (
                                                            <div className="text-xs text-blue-700">
                                                                Tumanlar: {(viewingPromotion as any).target_districts.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewingPromotion.promotionType === 'free_service' && (
                                    <div className="space-y-3">
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-emerald-900 mb-3">✨ Bepul Xizmat</p>

                                            {/* Promotion Details */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-emerald-200">
                                                <p className="text-xs font-semibold text-emerald-800 mb-1.5">Aksiya ma'lumotlari:</p>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-emerald-700">Tavsif:</span>
                                                    <span className="text-emerald-900 text-xs text-right max-w-[60%]">{viewingPromotion.serviceDescription || 'Tavsif yo\'q'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-emerald-700">Tur:</span>
                                                    <span className="font-medium text-emerald-900">Bepul Xizmat</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-emerald-700">Yaratish narxi:</span>
                                                    <span className="font-medium text-emerald-900">100 tanga</span>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-emerald-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-emerald-700">Boshlanish sanasi:</span>
                                                    <span className="text-emerald-900">{new Date(viewingPromotion.startsAt).toLocaleDateString('uz-UZ')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-emerald-700">Tugash sanasi:</span>
                                                    <span className="text-emerald-900">{viewingPromotion.endsAt ? new Date(viewingPromotion.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}</span>
                                                </div>
                                            </div>

                                            {/* Selected Service */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-emerald-200">
                                                <p className="text-xs font-semibold text-emerald-800 mb-1.5">Tanlangan xizmat:</p>
                                                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                                                    <p className="text-sm font-medium text-emerald-900 mb-1">{viewingPromotion.serviceName}</p>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-xs text-emerald-600">Asl narxi:</p>
                                                            <p className="text-sm line-through text-emerald-600">{viewingPromotion.originalPrice.toLocaleString()} so'm</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-emerald-900">BEPUL</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Total Summary */}
                                                <div className="bg-emerald-100 rounded p-2 mt-2 space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-700 font-bold">Jami:</span>
                                                        <span className="font-bold text-emerald-900 text-lg">BEPUL</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-emerald-600">Jami arzonlashtirildi:</span>
                                                        <span className="font-medium text-green-600">{viewingPromotion.originalPrice.toLocaleString()} so'm</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Advanced Settings */}
                                            <div className="space-y-2">
                                                {(viewingPromotion as any).min_client_trust_score && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-700">Mijoz ishonch reytingi:</span>
                                                        <span className="font-medium text-emerald-900">{(viewingPromotion as any).min_client_trust_score}+</span>
                                                    </div>
                                                )}
                                                {(viewingPromotion as any).target_region && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-emerald-700">Ko'rinish hududi:</span>
                                                            <span className="font-medium text-emerald-900">{(viewingPromotion as any).target_region}</span>
                                                        </div>
                                                        {(viewingPromotion as any).target_districts && (viewingPromotion as any).target_districts.length > 0 && (
                                                            <div className="text-xs text-emerald-700">
                                                                Tumanlar: {(viewingPromotion as any).target_districts.join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewingPromotion.promotionType === 'loyalty_card' && (
                                    <div className="space-y-3">
                                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-teal-900 mb-2">🎫 Sadoqat Kartasi</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-teal-700">Xizmat narxi:</span>
                                                    <span className="font-bold text-teal-900">{viewingPromotion.originalPrice.toLocaleString()} so'm</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-teal-700">Kerakli tashriflar:</span>
                                                    <span className="font-bold text-teal-900">{(viewingPromotion as any).required_visits} ta</span>
                                                </div>
                                                {(viewingPromotion as any).max_redemptions && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-teal-700">Maksimal foydalanish:</span>
                                                        <span className="font-bold text-teal-900">{(viewingPromotion as any).max_redemptions} ta</span>
                                                    </div>
                                                )}
                                                <div className="bg-teal-100 rounded p-2 mt-2">
                                                    <p className="text-xs text-teal-800 font-medium text-center">
                                                        🎁 {(viewingPromotion as any).required_visits} ta tashrif - 1 ta BEPUL!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewingPromotion.promotionType === 'service_bundle' && (
                                    <div className="space-y-3">
                                        <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-pink-900 mb-2">📦 Paket Taklif</p>

                                            {/* Individual Services */}
                                            <div className="space-y-2 mb-3 pb-3 border-b border-pink-200">
                                                <p className="text-xs font-semibold text-pink-800 mb-1.5">Paket tarkibi:</p>
                                                {/* Mock services - In real app, fetch from bundle_service_ids */}
                                                {viewingPromotion.id === 'promo-bundle-1' && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Soch olish</span>
                                                            <span className="text-pink-600">50,000 so'm</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Soqol olish</span>
                                                            <span className="text-pink-600">40,000 so'm</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Yuz parvarishi</span>
                                                            <span className="text-pink-600">160,000 so'm</span>
                                                        </div>
                                                    </>
                                                )}
                                                {viewingPromotion.id === 'promo-bundle-2' && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Massaj</span>
                                                            <span className="text-pink-600">300,000 so'm</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Hamom</span>
                                                            <span className="text-pink-600">250,000 so'm</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Yuz parvarishi</span>
                                                            <span className="text-pink-600">200,000 so'm</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-pink-700">Manikyur</span>
                                                            <span className="text-pink-600">100,000 so'm</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-pink-700 font-semibold">Jami:</span>
                                                    <span className="line-through text-pink-600 font-semibold">{viewingPromotion.originalPrice.toLocaleString()} so'm</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-pink-700">Paket narxi:</span>
                                                    <span className="font-bold text-pink-900 text-lg">{((viewingPromotion as any).bundle_price || 0).toLocaleString()} so'm</span>
                                                </div>
                                                <div className="flex justify-between text-sm pt-2 border-t border-pink-200">
                                                    <span className="text-pink-700 font-bold">Paket tejamkori:</span>
                                                    <span className="font-bold text-pink-900">
                                                        {(viewingPromotion.originalPrice - ((viewingPromotion as any).bundle_price || 0)).toLocaleString()} so'm
                                                    </span>
                                                </div>
                                                <div className="bg-pink-100 rounded p-2 mt-2">
                                                    <p className="text-xs text-pink-800 font-medium text-center">
                                                        🎉 {Math.round(((viewingPromotion.originalPrice - ((viewingPromotion as any).bundle_price || 0)) / viewingPromotion.originalPrice) * 100)}% tejang!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Common Date Information - Skip for lottery, 1+1, discount, and free_service as already shown */}
                                {viewingPromotion.promotionType !== 'lottery' &&
                                    viewingPromotion.promotionType !== 'buy_one_get_one' &&
                                    viewingPromotion.promotionType !== 'discount' &&
                                    viewingPromotion.promotionType !== 'free_service' && (
                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">Boshlanish</p>
                                                <p className="text-sm font-medium">{new Date(viewingPromotion.startsAt).toLocaleDateString('uz-UZ')}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">Tugash</p>
                                                <p className="text-sm font-medium">{viewingPromotion.endsAt ? new Date(viewingPromotion.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}</p>
                                            </div>
                                        </div>
                                    )}

                                {/* View Participants Button - For all promotion types */}
                                <div className="mt-6 pt-4 border-t">
                                    <Button
                                        onClick={() => {
                                            setSelectedPromotionForParticipants(viewingPromotion);
                                            setParticipantsDialogOpen(true);
                                        }}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Ro'yxatdan o'tganlarni ko'rish
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Participants Management Dialog */}
            {selectedPromotionForParticipants && (
                <PromotionParticipants
                    open={participantsDialogOpen}
                    onOpenChange={setParticipantsDialogOpen}
                    promotionId={selectedPromotionForParticipants.id}
                    promotionName={selectedPromotionForParticipants.serviceName}
                    participants={generateMockParticipants(selectedPromotionForParticipants.id, 15)}
                />
            )}
        </div>
    );
};

export default MyPromotions;
