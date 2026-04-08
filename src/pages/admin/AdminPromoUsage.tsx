import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Tag, Search, ArrowUpDown, CheckCircle2, Clock, User, Building2, Calendar, TrendingUp, BarChart3, Percent, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface PromoUsage {
    id: string;
    code: string;
    clientName: string;
    clientPhone: string;
    businessName: string;
    serviceName: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    originalPrice: number;
    finalPrice: number;
    usedAt: string;
    source: 'system' | 'admin' | 'referral';
    paymentStatus?: 'paid' | 'unpaid'; // Added back
    reimbursedAt?: string; // Added back
}

const fakePromoUsages: PromoUsage[] = [
    { id: 'pu-1', code: 'SARTAROSH20', clientName: 'Dilnoza Rahimova', clientPhone: '+998 91 234 56 78', businessName: 'Belleza Studio', serviceName: "Soch Bo'yash", discountType: 'percent', discountValue: 20, originalPrice: 450000, finalPrice: 360000, usedAt: '2026-02-12T12:00:00Z', source: 'system', paymentStatus: 'unpaid' },
    { id: 'pu-2', code: 'BAHOR25', clientName: 'Shaxlo Alimova', clientPhone: '+998 94 012 34 56', businessName: 'Luxe Lashes', serviceName: 'Qosh terish va shakllashtirish', discountType: 'percent', discountValue: 25, originalPrice: 60000, finalPrice: 45000, usedAt: '2026-02-08T09:00:00Z', source: 'system', paymentStatus: 'paid', reimbursedAt: '2026-02-10T10:00:00Z' },
    { id: 'pu-3', code: 'BAHOR25', clientName: 'Dilshod Umarov', clientPhone: '+998 95 123 45 67', businessName: 'Royal Wedding', serviceName: 'Kelin obrazi', discountType: 'percent', discountValue: 25, originalPrice: 1500000, finalPrice: 1125000, usedAt: '2026-02-07T07:00:00Z', source: 'system', paymentStatus: 'unpaid' },
    { id: 'pu-4', code: 'SALOM2026', clientName: 'Jasur Toshmatov', clientPhone: '+998 90 789 01 23', businessName: 'Belleza Studio', serviceName: 'Kechki makiyaj', discountType: 'percent', discountValue: 15, originalPrice: 200000, finalPrice: 170000, usedAt: '2026-02-09T18:00:00Z', source: 'system', paymentStatus: 'unpaid' },
    { id: 'pu-5', code: 'VIPCLIENT', clientName: 'Gulnora Rahimova', clientPhone: '+998 91 890 12 34', businessName: 'Premium Style', serviceName: 'VIP Xizmat', discountType: 'fixed', discountValue: 50000, originalPrice: 800000, finalPrice: 750000, usedAt: '2026-02-09T14:00:00Z', source: 'admin' },
    { id: 'pu-6', code: 'HAIRSTYLE25', clientName: 'Aziza Karimova', clientPhone: '+998 90 123 45 67', businessName: 'Oltin Qaychi', serviceName: 'Soch turmaklash', discountType: 'percent', discountValue: 15, originalPrice: 120000, finalPrice: 102000, usedAt: '2026-02-06T10:00:00Z', source: 'system', paymentStatus: 'paid', reimbursedAt: '2026-02-08T09:00:00Z' },
    { id: 'pu-7', code: 'SPA-RELAX', clientName: 'Nodira Karimova', clientPhone: '+998 97 678 90 12', businessName: 'Lola SPA', serviceName: 'Aromaterapiya massaj', discountType: 'percent', discountValue: 20, originalPrice: 500000, finalPrice: 400000, usedAt: '2026-02-05T15:00:00Z', source: 'admin' },
    { id: 'pu-8', code: 'AVTOMOYKA', clientName: 'Bekzod Karimov', clientPhone: '+998 93 901 23 45', businessName: "Tez Yuvish", serviceName: 'Avto yuvish premium', discountType: 'fixed', discountValue: 15000, originalPrice: 80000, finalPrice: 65000, usedAt: '2026-02-04T11:00:00Z', source: 'system', paymentStatus: 'unpaid' },
    { id: 'pu-9', code: 'ADMIN-GIFT', clientName: 'Sardor Aliyev', clientPhone: '+998 95 567 89 01', businessName: 'Oltin Qaychi', serviceName: "Erkaklar uchun soch kesish va soqol olish", discountType: 'fixed', discountValue: 100000, originalPrice: 350000, finalPrice: 250000, usedAt: '2026-02-03T16:00:00Z', source: 'admin' },
    { id: 'pu-10', code: 'SARTAROSH20', clientName: 'Malika Toshmatova', clientPhone: '+998 94 456 78 90', businessName: "G'uncha Go'zallik", serviceName: 'Kiprik uzaytirish', discountType: 'percent', discountValue: 20, originalPrice: 250000, finalPrice: 200000, usedAt: '2026-02-02T13:00:00Z', source: 'system', paymentStatus: 'unpaid' },
];

const sourceLabels: Record<string, { label: string; color: string }> = {
    system: { label: 'Tizim', color: 'bg-blue-100 text-blue-700' },
    admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
    referral: { label: 'Referal', color: 'bg-green-100 text-green-700' },
};

const AdminPromoUsage = () => {
    const navigate = useNavigate();
    const { toast } = useToast(); // Added toast
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCode, setFilterCode] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false); // Added state
    const [selectedUsage, setSelectedUsage] = useState<PromoUsage | null>(null); // Added state
    const [promoUsages, setPromoUsages] = useState<PromoUsage[]>(fakePromoUsages); // Using state for updates

    // Get unique codes for filter
    const uniqueCodes = [...new Set(promoUsages.map(p => p.code))];

    let filtered = promoUsages.filter(p => {
        const matchesSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.businessName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCode = filterCode === 'all' || p.code === filterCode;
        return matchesSearch && matchesCode;
    });

    filtered = filtered.sort((a, b) => {
        const diff = new Date(a.usedAt).getTime() - new Date(b.usedAt).getTime();
        return sortOrder === 'desc' ? -diff : diff;
    });

    // Summary
    const totalUsages = promoUsages.length;
    const totalSaved = promoUsages.reduce((s, p) => s + (p.originalPrice - p.finalPrice), 0);
    // Calculated debt for system unpaid
    const totalDebt = promoUsages
        .filter(p => p.source === 'system' && p.paymentStatus === 'unpaid')
        .reduce((s, p) => s + (p.originalPrice - p.finalPrice), 0);

    const mostUsedCode = Object.entries(
        promoUsages.reduce<Record<string, number>>((acc, p) => { acc[p.code] = (acc[p.code] || 0) + 1; return acc; }, {})
    ).sort((a, b) => b[1] - a[1])[0];
    const uniqueClients = new Set(promoUsages.map(p => p.clientName)).size;

    const handlePayClick = (usage: PromoUsage) => {
        setSelectedUsage(usage);
        setPaymentDialogOpen(true);
    };

    const confirmPayment = () => {
        if (!selectedUsage) return;

        setPromoUsages(prev => prev.map(p =>
            p.id === selectedUsage.id
                ? { ...p, paymentStatus: 'paid', reimbursedAt: new Date().toISOString() }
                : p
        ));

        toast({
            title: "To'lov tasdiqlandi",
            description: `${selectedUsage.businessName} uchun to'lov muvaffaqiyatli amalga oshirildi.`,
            variant: "default",
        });

        setPaymentDialogOpen(false);
        setSelectedUsage(null);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Promokod Foydalanish</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold">{totalUsages}</p>
                        <p className="text-[10px] text-primary-foreground/70">Jami ishlatilgan</p>
                    </div>
                    {/* Debt Stat */}
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        {totalDebt > 0 ? (
                            <>
                                <p className="text-lg font-bold text-red-200">{(totalDebt / 1000).toFixed(0)}K</p>
                                <p className="text-[10px] text-primary-foreground/70">To'lanishi kerak</p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-bold">{(totalSaved / 1000).toFixed(0)}K</p>
                                <p className="text-[10px] text-primary-foreground/70">Jami chegirma</p>
                            </>
                        )}
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold">{uniqueClients}</p>
                        <p className="text-[10px] text-primary-foreground/70">Noyob mijozlar</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-xs">{mostUsedCode?.[0] || '—'}</p>
                        <p className="text-[10px] text-primary-foreground/70">Eng mashhur ({mostUsedCode?.[1]}x)</p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-4 space-y-3">
                {/* Search & Sort */}
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Kod, mijoz, yoki biznes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')} className="h-9">
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>

                {/* Code filter chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setFilterCode('all')}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterCode === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                        Barchasi
                    </button>
                    {uniqueCodes.map(code => (
                        <button
                            key={code}
                            onClick={() => setFilterCode(code)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors font-mono ${filterCode === code ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                        >
                            {code}
                        </button>
                    ))}
                </div>

                {/* Usage List */}
                <div className="space-y-2">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Foydalanish topilmadi</p>
                        </div>
                    ) : (
                        filtered.map((usage, idx) => {
                            const saved = usage.originalPrice - usage.finalPrice;
                            const src = sourceLabels[usage.source];
                            const isSystem = usage.source === 'system';

                            return (
                                <motion.div
                                    key={usage.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                >
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-3">
                                            <div className="flex items-start gap-3">
                                                {/* Code badge */}
                                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 shrink-0">
                                                    <Tag className="w-4 h-4 text-purple-600" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {/* Top row: code + saved */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-sm font-mono font-bold text-primary">{usage.code}</span>
                                                        <span className="text-sm font-bold text-green-600">
                                                            -{saved.toLocaleString()} so'm
                                                        </span>
                                                    </div>

                                                    {/* Client & Business */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <User className="w-3 h-3" />
                                                            <span className="truncate">{usage.clientName}</span>
                                                        </div>
                                                        <span className="text-muted-foreground/30">·</span>
                                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <Building2 className="w-3 h-3" />
                                                            <span className="truncate">{usage.businessName}</span>
                                                        </div>
                                                    </div>

                                                    {/* Service + Price */}
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {usage.serviceName}: <span className="line-through">{usage.originalPrice.toLocaleString()}</span> → <span className="font-semibold text-foreground">{usage.finalPrice.toLocaleString()} so'm</span>
                                                    </p>

                                                    {/* Footer Row (Badges & Actions) */}
                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <Badge className={`${src.color} text-[10px] font-medium border-0`}>
                                                                {src.label}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-[10px] gap-0.5">
                                                                {usage.discountType === 'percent' ? (
                                                                    <><Percent className="w-2.5 h-2.5" />{usage.discountValue}%</>
                                                                ) : (
                                                                    <>-{(usage.discountValue / 1000).toFixed(0)}K</>
                                                                )}
                                                            </Badge>
                                                        </div>

                                                        {/* Payment Action */}
                                                        {isSystem && (
                                                            <div>
                                                                {usage.paymentStatus === 'paid' ? (
                                                                    <div className="flex items-center gap-1 text-green-600">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                        <span className="text-[10px] font-medium">To'landi</span>
                                                                    </div>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        className="h-6 text-[10px] px-2 bg-amber-500 hover:bg-amber-600 text-white"
                                                                        onClick={() => handlePayClick(usage)}
                                                                    >
                                                                        To'lash
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {!isSystem && (
                                                            <div className="text-[10px] text-muted-foreground">
                                                                {format(new Date(usage.usedAt), 'd MMM HH:mm', { locale: uz })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Payment Confirmation Dialog */}
            <AlertDialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>To'lovni tasdiqlash</AlertDialogTitle>
                        <AlertDialogDescription>
                            Siz <strong>{selectedUsage?.businessName}</strong> ga <strong>{(selectedUsage ? selectedUsage.originalPrice - selectedUsage.finalPrice : 0).toLocaleString()} so'm</strong> to'lamoqdasiz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPayment} className="bg-green-600 hover:bg-green-700">
                            Tasdiqlash
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminPromoUsage;
