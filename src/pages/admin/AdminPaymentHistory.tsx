import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, Calendar, Search, Filter, Download, ArrowUpDown, CheckCircle2, Clock, XCircle, Banknote, Smartphone, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

interface Payment {
    id: string;
    clientName: string;
    clientPhone: string;
    businessName: string;
    serviceName: string;
    amount: number;
    method: 'cash' | 'card' | 'coins' | 'payme' | 'click';
    status: 'completed' | 'pending' | 'refunded' | 'failed';
    date: string;
    promoCode?: string;
    discount?: number;
}

const fakePayments: Payment[] = [
    { id: 'pay-1', clientName: 'Aziza Karimova', clientPhone: '+998 90 123 45 67', businessName: 'Oltin Qaychi', serviceName: 'Soch kesish', amount: 80000, method: 'card', status: 'completed', date: '2026-02-12T14:30:00Z' },
    { id: 'pay-2', clientName: 'Dilnoza Rahimova', clientPhone: '+998 91 234 56 78', businessName: 'Belleza Studio', serviceName: "Soch Bo'yash", amount: 315000, method: 'payme', status: 'completed', date: '2026-02-12T12:00:00Z', promoCode: 'SARTAROSH20', discount: 20 },
    { id: 'pay-3', clientName: 'Jamshid Aliyev', clientPhone: '+998 93 345 67 89', businessName: "G'uncha Go'zallik", serviceName: 'Makiyaj', amount: 200000, method: 'cash', status: 'completed', date: '2026-02-11T16:00:00Z' },
    { id: 'pay-4', clientName: 'Malika Toshmatova', clientPhone: '+998 94 456 78 90', businessName: 'Lola Nails', serviceName: 'Manikyur + Gel Lak', amount: 0, method: 'coins', status: 'completed', date: '2026-02-11T10:30:00Z', promoCode: 'BEPUL-MANIKUR', discount: 100 },
    { id: 'pay-5', clientName: 'Sardor Aliyev', clientPhone: '+998 95 567 89 01', businessName: 'Oltin Qaychi', serviceName: 'Soqol olish', amount: 50000, method: 'click', status: 'completed', date: '2026-02-10T15:00:00Z' },
    { id: 'pay-6', clientName: 'Nodira Karimova', clientPhone: '+998 97 678 90 12', businessName: 'Lola SPA', serviceName: 'Aromaterapiya', amount: 400000, method: 'card', status: 'refunded', date: '2026-02-10T12:00:00Z' },
    { id: 'pay-7', clientName: 'Jasur Toshmatov', clientPhone: '+998 90 789 01 23', businessName: 'Belleza Studio', serviceName: 'Kechki makiyaj', amount: 170000, method: 'payme', status: 'completed', date: '2026-02-09T18:00:00Z', promoCode: 'SALOM2026', discount: 15 },
    { id: 'pay-8', clientName: 'Gulnora Rahimova', clientPhone: '+998 91 890 12 34', businessName: 'Premium Style', serviceName: 'VIP Xizmat', amount: 750000, method: 'card', status: 'pending', date: '2026-02-09T14:00:00Z', promoCode: 'VIPCLIENT' },
    { id: 'pay-9', clientName: 'Bekzod Karimov', clientPhone: '+998 93 901 23 45', businessName: 'Silk Beauty Center', serviceName: 'Facial Cleansing', amount: 300000, method: 'cash', status: 'completed', date: '2026-02-08T11:00:00Z' },
    { id: 'pay-10', clientName: 'Shaxlo Alimova', clientPhone: '+998 94 012 34 56', businessName: 'Luxe Lashes', serviceName: 'Qosh terish', amount: 40000, method: 'coins', status: 'completed', date: '2026-02-08T09:00:00Z', promoCode: 'BAHOR25', discount: 25 },
    { id: 'pay-11', clientName: 'Dilshod Umarov', clientPhone: '+998 95 123 45 67', businessName: 'Royal Wedding', serviceName: 'Kelin obrazi', amount: 1125000, method: 'card', status: 'completed', date: '2026-02-07T07:00:00Z', promoCode: 'BAHOR25', discount: 25 },
    { id: 'pay-12', clientName: 'Madina Karimova', clientPhone: '+998 97 234 56 78', businessName: 'Belleza Studio', serviceName: 'Lotereya kirish', amount: 0, method: 'coins', status: 'completed', date: '2026-02-06T12:00:00Z' },
];

const methodLabels: Record<string, { label: string; icon: typeof CreditCard; color: string }> = {
    cash: { label: 'Naqd', icon: Banknote, color: 'text-green-600 bg-green-100' },
    card: { label: 'Karta', icon: CreditCard, color: 'text-blue-600 bg-blue-100' },
    coins: { label: 'Tangalar', icon: Coins, color: 'text-amber-600 bg-amber-100' },
    payme: { label: 'Payme', icon: Smartphone, color: 'text-cyan-600 bg-cyan-100' },
    click: { label: 'Click', icon: Smartphone, color: 'text-indigo-600 bg-indigo-100' },
};

const statusLabels: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    completed: { label: 'Yakunlangan', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    pending: { label: 'Kutilmoqda', color: 'bg-amber-100 text-amber-700', icon: Clock },
    refunded: { label: 'Qaytarilgan', color: 'bg-orange-100 text-orange-700', icon: XCircle },
    failed: { label: 'Xatolik', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const AdminPaymentHistory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMethod, setFilterMethod] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    let filtered = fakePayments.filter(p => {
        const matchesSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.promoCode && p.promoCode.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMethod = filterMethod === 'all' || p.method === filterMethod;
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesMethod && matchesStatus;
    });

    filtered = filtered.sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'desc' ? -diff : diff;
    });

    // Summary stats
    const totalAmount = fakePayments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const totalTransactions = fakePayments.length;
    const withPromo = fakePayments.filter(p => p.promoCode).length;
    const refunded = fakePayments.filter(p => p.status === 'refunded').length;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">To'lovlar Tarixi</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold">{totalTransactions}</p>
                        <p className="text-[10px] text-primary-foreground/70">Jami tranzaksiya</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold">{(totalAmount / 1000000).toFixed(1)}M</p>
                        <p className="text-[10px] text-primary-foreground/70">Jami summa</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold">{withPromo}</p>
                        <p className="text-[10px] text-primary-foreground/70">Promokod bilan</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold">{refunded}</p>
                        <p className="text-[10px] text-primary-foreground/70">Qaytarilgan</p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-4 space-y-3">
                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')} className="h-9">
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['all', 'cash', 'card', 'payme', 'click', 'coins'].map(m => (
                        <button
                            key={m}
                            onClick={() => setFilterMethod(m)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterMethod === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                        >
                            {m === 'all' ? 'Barchasi' : methodLabels[m]?.label || m}
                        </button>
                    ))}
                </div>

                {/* Status filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['all', 'completed', 'pending', 'refunded'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                        >
                            {s === 'all' ? 'Barcha status' : statusLabels[s]?.label || s}
                        </button>
                    ))}
                </div>

                {/* Payment List */}
                <div className="space-y-2">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">To'lovlar topilmadi</p>
                        </div>
                    ) : (
                        filtered.map((payment, idx) => {
                            const method = methodLabels[payment.method];
                            const status = statusLabels[payment.status];
                            const MethodIcon = method.icon;
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                >
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="p-3">
                                            <div className="flex items-start gap-3">
                                                {/* Method icon */}
                                                <div className={`p-2 rounded-xl shrink-0 ${method.color}`}>
                                                    <MethodIcon className="w-4 h-4" />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="text-sm font-semibold truncate">{payment.clientName}</h4>
                                                            <p className="text-[11px] text-muted-foreground">{payment.clientPhone}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-sm font-bold">
                                                                {payment.amount === 0 ? 'Bepul' : `${payment.amount.toLocaleString()} so'm`}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                {format(new Date(payment.date), 'd MMM HH:mm', { locale: uz })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        <span className="text-[11px] text-muted-foreground truncate">
                                                            {payment.businessName} · {payment.serviceName}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                                        <Badge className={`${status.color} text-[10px] font-medium border-0 gap-0.5`}>
                                                            <StatusIcon className="w-2.5 h-2.5" />{status.label}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-[10px] gap-0.5">
                                                            <MethodIcon className="w-2.5 h-2.5" />{method.label}
                                                        </Badge>
                                                        {payment.promoCode && (
                                                            <Badge className="bg-purple-100 text-purple-700 text-[10px] font-medium border-0">
                                                                🏷️ {payment.promoCode} {payment.discount && `(-${payment.discount}%)`}
                                                            </Badge>
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
        </div>
    );
};

export default AdminPaymentHistory;
