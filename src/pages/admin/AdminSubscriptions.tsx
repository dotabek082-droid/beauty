
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Crown, Search, Building2, Users, TrendingUp, TrendingDown,
    Calendar, Phone, Mail, Eye, Download, MoreHorizontal, RefreshCw,
    XCircle, Bell, CheckCircle, AlertCircle, Clock, History,
    ArrowUpCircle, ArrowDownCircle, ArrowRightCircle, CreditCard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for business subscriptions
const businessSubscriptions = [
    { id: 1, businessName: "Elite Beauty Salon", ownerName: "Nodira Azimova", phone: "+998 90 123 45 67", email: "nodira@elitebeauty.uz", plan: "Elite", price: 400000, status: "active", startDate: "01.01.2026", endDate: "01.03.2026", daysLeft: 25, autoRenew: true, avatar: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100" },
    { id: 2, businessName: "Sardor Barbershop", ownerName: "Sardor Kamolov", phone: "+998 91 234 56 78", email: "sardor@barbershop.uz", plan: "Pro", price: 150000, status: "active", startDate: "15.01.2026", endDate: "15.02.2026", daysLeft: 11, autoRenew: true, avatar: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100" },
    { id: 3, businessName: "Guzal SPA Center", ownerName: "Dilnoza Rahimova", phone: "+998 93 345 67 89", email: "dilnoza@guzalspa.uz", plan: "Pro", price: 150000, status: "active", startDate: "20.01.2026", endDate: "20.02.2026", daysLeft: 16, autoRenew: false, avatar: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100" },
    { id: 4, businessName: "Oltin Qaychi", ownerName: "Akbar Toshmatov", phone: "+998 94 456 78 90", email: "akbar@oltinqaychi.uz", plan: "Bepul", price: 0, status: "active", startDate: "01.02.2026", endDate: "-", daysLeft: -1, autoRenew: false, avatar: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=100" },
    { id: 5, businessName: "Premium Nails Studio", ownerName: "Malika Usmanova", phone: "+998 95 567 89 01", email: "malika@premiumnails.uz", plan: "Elite", price: 400000, status: "expired", startDate: "01.12.2025", endDate: "01.01.2026", daysLeft: 0, autoRenew: false, avatar: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=100" },
    { id: 6, businessName: "Glamour Studio", ownerName: "Shaxnoza Qodirova", phone: "+998 90 678 90 12", email: "shaxnoza@glamour.uz", plan: "Pro", price: 150000, status: "active", startDate: "01.02.2026", endDate: "01.03.2026", daysLeft: 5, autoRenew: true, avatar: null },
    { id: 7, businessName: "Royal Barbers", ownerName: "Jasur Alimov", phone: "+998 91 789 01 23", email: "jasur@royalbarbers.uz", plan: "Elite", price: 400000, status: "cancelled", startDate: "15.12.2025", endDate: "15.01.2026", daysLeft: 0, autoRenew: false, avatar: null }
];

// Mock data for client subscriptions
const clientSubscriptions = [
    { id: 1, name: "Aziza Karimova", phone: "+998 90 111 22 33", email: "aziza@mail.uz", plan: "Platinum", price: 120000, status: "active", startDate: "10.01.2026", endDate: "10.04.2026", daysLeft: 65, coins: 3000, cashback: "10%", avatar: null },
    { id: 2, name: "Jamshid Aliyev", phone: "+998 91 222 33 44", email: "jamshid@mail.uz", plan: "Gold", price: 50000, status: "active", startDate: "05.02.2026", endDate: "05.03.2026", daysLeft: 28, coins: 1000, cashback: "5%", avatar: null },
    { id: 3, name: "Sevinch Ergasheva", phone: "+998 93 333 44 55", email: "sevinch@mail.uz", plan: "Gold", price: 50000, status: "active", startDate: "15.01.2026", endDate: "15.02.2026", daysLeft: 3, coins: 1000, cashback: "5%", avatar: null },
    { id: 4, name: "Bobur Rahmonov", phone: "+998 94 444 55 66", email: "bobur@mail.uz", plan: "Standard", price: 0, status: "active", startDate: "-", endDate: "-", daysLeft: -1, coins: 0, cashback: "0%", avatar: null },
    { id: 5, name: "Nilufar Saidova", phone: "+998 95 555 66 77", email: "nilufar@mail.uz", plan: "Platinum", price: 120000, status: "expired", startDate: "01.11.2025", endDate: "01.02.2026", daysLeft: 0, coins: 500, cashback: "10%", avatar: null }
];

// Subscription History Mock Data
const subscriptionHistory = [
    { id: 1, type: "business", entityName: "Elite Beauty Salon", entityId: 1, action: "renew", planFrom: "Elite", planTo: "Elite", amount: 400000, paymentMethod: "Click", date: "01.01.2026", time: "10:30" },
    { id: 2, type: "client", entityName: "Aziza Karimova", entityId: 1, action: "upgrade", planFrom: "Gold", planTo: "Platinum", amount: 120000, paymentMethod: "Payme", date: "10.01.2026", time: "14:15" },
    { id: 3, type: "business", entityName: "Sardor Barbershop", entityId: 2, action: "subscribe", planFrom: null, planTo: "Pro", amount: 150000, paymentMethod: "Click", date: "15.01.2026", time: "09:00" },
    { id: 4, type: "client", entityName: "Sevinch Ergasheva", entityId: 3, action: "subscribe", planFrom: null, planTo: "Gold", amount: 50000, paymentMethod: "Uzcard", date: "15.01.2026", time: "11:45" },
    { id: 5, type: "business", entityName: "Royal Barbers", entityId: 7, action: "cancel", planFrom: "Elite", planTo: null, amount: 0, paymentMethod: null, date: "15.01.2026", time: "16:20", reason: "Xarajatlarni kamaytirish" },
    { id: 6, type: "business", entityName: "Guzal SPA Center", entityId: 3, action: "renew", planFrom: "Pro", planTo: "Pro", amount: 150000, paymentMethod: "Payme", date: "20.01.2026", time: "12:00" },
    { id: 7, type: "business", entityName: "Premium Nails Studio", entityId: 5, action: "expire", planFrom: "Elite", planTo: null, amount: 0, paymentMethod: null, date: "01.01.2026", time: "00:00", reason: "Avto uzaytirish o'chirilgan" },
    { id: 8, type: "business", entityName: "Glamour Studio", entityId: 6, action: "subscribe", planFrom: null, planTo: "Pro", amount: 150000, paymentMethod: "Uzcard", date: "01.02.2026", time: "08:30" },
    { id: 9, type: "client", entityName: "Jamshid Aliyev", entityId: 2, action: "renew", planFrom: "Gold", planTo: "Gold", amount: 50000, paymentMethod: "Click", date: "05.02.2026", time: "10:00" },
    { id: 10, type: "client", entityName: "Nilufar Saidova", entityId: 5, action: "expire", planFrom: "Platinum", planTo: null, amount: 0, paymentMethod: null, date: "01.02.2026", time: "00:00", reason: "To'lov qilinmagan" },
    { id: 11, type: "business", entityName: "Elite Beauty Salon", entityId: 1, action: "upgrade", planFrom: "Pro", planTo: "Elite", amount: 400000, paymentMethod: "Payme", date: "01.12.2025", time: "15:40" },
    { id: 12, type: "client", entityName: "Aziza Karimova", entityId: 1, action: "subscribe", planFrom: null, planTo: "Gold", amount: 50000, paymentMethod: "Click", date: "10.10.2025", time: "09:15" },
    { id: 13, type: "business", entityName: "Oltin Qaychi", entityId: 4, action: "downgrade", planFrom: "Pro", planTo: "Bepul", amount: 0, paymentMethod: null, date: "01.02.2026", time: "18:00", reason: "Biznes hajmi kamaydi" }
];

const getPlanBadgeClass = (plan: string | null) => {
    if (!plan) return "bg-slate-200 text-slate-700";
    switch (plan.toLowerCase()) {
        case "elite": return "bg-purple-600 text-white";
        case "pro": return "bg-amber-500 text-white";
        case "platinum": return "bg-purple-600 text-white";
        case "gold": return "bg-amber-500 text-white";
        default: return "bg-slate-200 text-slate-700";
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "active": return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" />Faol</Badge>;
        case "expired": return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50"><XCircle className="w-3 h-3 mr-1" />Tugagan</Badge>;
        case "cancelled": return <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50"><XCircle className="w-3 h-3 mr-1" />Bekor</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const getActionBadge = (action: string) => {
    switch (action) {
        case "subscribe": return <Badge className="bg-green-500 text-white"><ArrowRightCircle className="w-3 h-3 mr-1" />Yangi obuna</Badge>;
        case "renew": return <Badge className="bg-blue-500 text-white"><RefreshCw className="w-3 h-3 mr-1" />Yangilash</Badge>;
        case "upgrade": return <Badge className="bg-purple-500 text-white"><ArrowUpCircle className="w-3 h-3 mr-1" />Oshirish</Badge>;
        case "downgrade": return <Badge className="bg-orange-500 text-white"><ArrowDownCircle className="w-3 h-3 mr-1" />Tushirish</Badge>;
        case "cancel": return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />Bekor qilish</Badge>;
        case "expire": return <Badge className="bg-slate-500 text-white"><Clock className="w-3 h-3 mr-1" />Muddati tugadi</Badge>;
        default: return <Badge>{action}</Badge>;
    }
};

const getDaysLeftBadge = (daysLeft: number, status: string) => {
    if (status !== "active" || daysLeft < 0) return null;
    if (daysLeft <= 7) {
        return <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" />{daysLeft} kun</span>;
    } else if (daysLeft <= 14) {
        return <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" />{daysLeft} kun</span>;
    }
    return <span className="text-xs text-slate-500">{daysLeft} kun</span>;
};

const AdminSubscriptions = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [historyTypeFilter, setHistoryTypeFilter] = useState("all");
    const [historyActionFilter, setHistoryActionFilter] = useState("all");
    const [historyDateFilter, setHistoryDateFilter] = useState("all");

    const stats = useMemo(() => {
        const activeBusinesses = businessSubscriptions.filter(s => s.status === "active");
        const activeClients = clientSubscriptions.filter(s => s.status === "active" && s.plan !== "Standard");
        const expiredBusinesses = businessSubscriptions.filter(s => s.status === "expired" || s.status === "cancelled");
        const expiredClients = clientSubscriptions.filter(s => s.status === "expired");
        const expiringBusinesses = businessSubscriptions.filter(s => s.status === "active" && s.daysLeft > 0 && s.daysLeft <= 7);
        const expiringClients = clientSubscriptions.filter(s => s.status === "active" && s.daysLeft > 0 && s.daysLeft <= 7);
        const totalBusinessRevenue = activeBusinesses.reduce((acc, s) => acc + s.price, 0);
        const totalClientRevenue = activeClients.reduce((acc, s) => acc + s.price, 0);
        const renewalRate = Math.round((activeBusinesses.filter(s => s.autoRenew).length / Math.max(activeBusinesses.length, 1)) * 100);
        const totalHistoryRevenue = subscriptionHistory.filter(h => h.amount > 0).reduce((acc, h) => acc + h.amount, 0);
        return {
            totalRevenue: totalBusinessRevenue + totalClientRevenue,
            businessRevenue: totalBusinessRevenue,
            clientRevenue: totalClientRevenue,
            activeBusinessCount: activeBusinesses.length,
            activeClientCount: activeClients.length,
            expiredCount: expiredBusinesses.length + expiredClients.length,
            expiringCount: expiringBusinesses.length + expiringClients.length,
            renewalRate,
            totalHistoryRevenue,
            totalTransactions: subscriptionHistory.length
        };
    }, []);

    const filteredBusinessSubs = useMemo(() => {
        return businessSubscriptions.filter(sub => {
            const matchesSearch = sub.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || sub.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPlan = planFilter === "all" || sub.plan.toLowerCase() === planFilter.toLowerCase();
            const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
            return matchesSearch && matchesPlan && matchesStatus;
        });
    }, [searchTerm, planFilter, statusFilter]);

    const filteredClientSubs = useMemo(() => {
        return clientSubscriptions.filter(sub => {
            const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPlan = planFilter === "all" || sub.plan.toLowerCase() === planFilter.toLowerCase();
            const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
            return matchesSearch && matchesPlan && matchesStatus;
        });
    }, [searchTerm, planFilter, statusFilter]);

    const filteredHistory = useMemo(() => {
        return subscriptionHistory.filter(h => {
            const matchesSearch = h.entityName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = historyTypeFilter === "all" || h.type === historyTypeFilter;
            const matchesAction = historyActionFilter === "all" || h.action === historyActionFilter;
            return matchesSearch && matchesType && matchesAction;
        }).sort((a, b) => {
            // Sort by date descending (most recent first)
            const dateA = a.date.split('.').reverse().join('');
            const dateB = b.date.split('.').reverse().join('');
            return dateB.localeCompare(dateA);
        });
    }, [searchTerm, historyTypeFilter, historyActionFilter]);

    const handleExtendSubscription = (id: number, name: string) => {
        toast({ title: "Obuna uzaytirildi", description: `${name} obunasi 30 kunga uzaytirildi` });
    };

    const handleCancelSubscription = (id: number, name: string) => {
        toast({ title: "Obuna bekor qilindi", description: `${name} obunasi bekor qilindi`, variant: "destructive" });
    };

    const handleSendReminder = (id: number, name: string) => {
        toast({ title: "Eslatma yuborildi", description: `${name} ga obuna eslatmasi yuborildi` });
    };

    const handleExport = (type: "business" | "client" | "history") => {
        let csvContent = "";
        if (type === "business") {
            csvContent = "Biznes,Egasi,Reja,Status,Tugash,Narx\n" + filteredBusinessSubs.map(s => `${s.businessName},${s.ownerName},${s.plan},${s.status},${s.endDate},${s.price}`).join("\n");
        } else if (type === "client") {
            csvContent = "Foydalanuvchi,Telefon,Reja,Status,Tugash,Tangalar\n" + filteredClientSubs.map(s => `${s.name},${s.phone},${s.plan},${s.status},${s.endDate},${s.coins}`).join("\n");
        } else {
            csvContent = "Sana,Vaqt,Turi,Nomi,Amal,Oldingi reja,Yangi reja,Summa,To'lov usuli\n" + filteredHistory.map(h => `${h.date},${h.time},${h.type},${h.entityName},${h.action},${h.planFrom || '-'},${h.planTo || '-'},${h.amount},${h.paymentMethod || '-'}`).join("\n");
        }
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_subscriptions.csv`;
        link.click();
        toast({ title: "Eksport qilindi", description: `${type === "business" ? "Biznes" : type === "client" ? "Mijoz" : "Tarix"} ma'lumotlari CSV formatida yuklab olindi` });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Obunalar Boshqaruvi</h1>
                    <p className="text-slate-500 mt-1">Biznes va mijoz obunalarini kuzating va boshqaring</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/80">Jami Daromad (Oy)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-white/60" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} UZS</div>
                        <div className="flex gap-4 mt-2 text-xs text-white/70">
                            <span>Biznes: {stats.businessRevenue.toLocaleString()}</span>
                            <span>Mijoz: {stats.clientRevenue.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faol Bizneslar</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.activeBusinessCount}</div>
                        <p className="text-xs text-muted-foreground">obuna</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faol Mijozlar</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.activeClientCount}</div>
                        <p className="text-xs text-muted-foreground">Gold & Platinum</p>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-800">Tugayapti</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.expiringCount}</div>
                        <p className="text-xs text-amber-700">7 kun ichida</p>
                    </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-800">Tugagan/Bekor</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.expiredCount}</div>
                        <p className="text-xs text-red-700">Yangilash kerak</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="business">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <TabsList>
                        <TabsTrigger value="business" className="gap-2">
                            <Building2 className="w-4 h-4" />
                            Biznes ({filteredBusinessSubs.length})
                        </TabsTrigger>
                        <TabsTrigger value="client" className="gap-2">
                            <Users className="w-4 h-4" />
                            Mijoz ({filteredClientSubs.length})
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="w-4 h-4" />
                            Tarix ({filteredHistory.length})
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Filters for Business/Client */}
                <TabsContent value="business">
                    <div className="flex flex-wrap items-center gap-3 py-4 bg-slate-50 p-4 rounded-lg mb-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Qidirish..." className="pl-9 bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Reja" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha rejalar</SelectItem>
                                <SelectItem value="elite">Elite</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="bepul">Bepul</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha status</SelectItem>
                                <SelectItem value="active">Faol</SelectItem>
                                <SelectItem value="expired">Tugagan</SelectItem>
                                <SelectItem value="cancelled">Bekor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setPlanFilter("all"); setStatusFilter("all"); }}>Tozalash</Button>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Biznes Obunalari</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => handleExport("business")}>
                                <Download className="w-4 h-4 mr-2" /> CSV Export
                            </Button>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Biznes</TableHead>
                                    <TableHead>Egasi</TableHead>
                                    <TableHead>Reja</TableHead>
                                    <TableHead>Holat</TableHead>
                                    <TableHead>Qolgan vaqt</TableHead>
                                    <TableHead>Narx</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBusinessSubs.map((sub) => (
                                    <TableRow key={sub.id} className={sub.daysLeft > 0 && sub.daysLeft <= 7 && sub.status === "active" ? "bg-red-50/50" : ""}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10"><AvatarImage src={sub.avatar || undefined} /><AvatarFallback>{sub.businessName.charAt(0)}</AvatarFallback></Avatar>
                                                <div><span className="font-medium block">{sub.businessName}</span><span className="text-xs text-muted-foreground">{sub.email}</span></div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{sub.ownerName}</TableCell>
                                        <TableCell><Badge className={getPlanBadgeClass(sub.plan)}>{sub.plan}</Badge></TableCell>
                                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                        <TableCell>{getDaysLeftBadge(sub.daysLeft, sub.status)}</TableCell>
                                        <TableCell className="font-medium">{sub.price > 0 ? `${sub.price.toLocaleString()} UZS` : "Bepul"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleExtendSubscription(sub.id, sub.businessName)}><RefreshCw className="w-4 h-4 mr-2" /> Uzaytirish</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleSendReminder(sub.id, sub.businessName)}><Bell className="w-4 h-4 mr-2" /> Eslatma</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleCancelSubscription(sub.id, sub.businessName)}><XCircle className="w-4 h-4 mr-2" /> Bekor qilish</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="client">
                    <div className="flex flex-wrap items-center gap-3 py-4 bg-slate-50 p-4 rounded-lg mb-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Qidirish..." className="pl-9 bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Reja" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha rejalar</SelectItem>
                                <SelectItem value="platinum">Platinum</SelectItem>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha status</SelectItem>
                                <SelectItem value="active">Faol</SelectItem>
                                <SelectItem value="expired">Tugagan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setPlanFilter("all"); setStatusFilter("all"); }}>Tozalash</Button>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Mijoz Obunalari</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => handleExport("client")}>
                                <Download className="w-4 h-4 mr-2" /> CSV Export
                            </Button>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Foydalanuvchi</TableHead>
                                    <TableHead>Telefon</TableHead>
                                    <TableHead>Reja</TableHead>
                                    <TableHead>Holat</TableHead>
                                    <TableHead>Qolgan vaqt</TableHead>
                                    <TableHead>Tangalar</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClientSubs.map((sub) => (
                                    <TableRow key={sub.id} className={sub.daysLeft > 0 && sub.daysLeft <= 7 && sub.status === "active" ? "bg-red-50/50" : ""}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10"><AvatarFallback>{sub.name.charAt(0)}</AvatarFallback></Avatar>
                                                <div><span className="font-medium block">{sub.name}</span><span className="text-xs text-muted-foreground">{sub.email}</span></div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{sub.phone}</TableCell>
                                        <TableCell><Badge className={getPlanBadgeClass(sub.plan)}>{sub.plan}</Badge></TableCell>
                                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                        <TableCell>{getDaysLeftBadge(sub.daysLeft, sub.status)}</TableCell>
                                        <TableCell>
                                            <span className="font-medium text-amber-600">{sub.coins.toLocaleString()}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({sub.cashback})</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleExtendSubscription(sub.id, sub.name)}><RefreshCw className="w-4 h-4 mr-2" /> Uzaytirish</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleSendReminder(sub.id, sub.name)}><Bell className="w-4 h-4 mr-2" /> Eslatma</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleCancelSubscription(sub.id, sub.name)}><XCircle className="w-4 h-4 mr-2" /> Bekor qilish</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <div className="flex flex-wrap items-center gap-3 py-4 bg-slate-50 p-4 rounded-lg mb-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Qidirish..." className="pl-9 bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={historyTypeFilter} onValueChange={setHistoryTypeFilter}>
                            <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Turi" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barchasi</SelectItem>
                                <SelectItem value="business">Biznes</SelectItem>
                                <SelectItem value="client">Mijoz</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={historyActionFilter} onValueChange={setHistoryActionFilter}>
                            <SelectTrigger className="w-[160px] bg-white"><SelectValue placeholder="Amal turi" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha amallar</SelectItem>
                                <SelectItem value="subscribe">Yangi obuna</SelectItem>
                                <SelectItem value="renew">Yangilash</SelectItem>
                                <SelectItem value="upgrade">Oshirish</SelectItem>
                                <SelectItem value="downgrade">Tushirish</SelectItem>
                                <SelectItem value="cancel">Bekor qilish</SelectItem>
                                <SelectItem value="expire">Muddati tugadi</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setHistoryTypeFilter("all"); setHistoryActionFilter("all"); }}>Tozalash</Button>
                    </div>

                    {/* History Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700">Jami tushumlar</p>
                                        <p className="text-xl font-bold text-green-800">{stats.totalHistoryRevenue.toLocaleString()} UZS</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                        <History className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Jami tranzaksiyalar</p>
                                        <p className="text-xl font-bold">{stats.totalTransactions}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                                        <ArrowUpCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Oshirishlar</p>
                                        <p className="text-xl font-bold">{subscriptionHistory.filter(h => h.action === "upgrade").length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                                        <XCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-red-700">Bekor/Tugagan</p>
                                        <p className="text-xl font-bold text-red-800">{subscriptionHistory.filter(h => h.action === "cancel" || h.action === "expire").length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Obuna Tarixi
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => handleExport("history")}>
                                <Download className="w-4 h-4 mr-2" /> CSV Export
                            </Button>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Sana</TableHead>
                                    <TableHead>Turi</TableHead>
                                    <TableHead>Nomi</TableHead>
                                    <TableHead>Amal</TableHead>
                                    <TableHead>Reja o'zgarishi</TableHead>
                                    <TableHead>Summa</TableHead>
                                    <TableHead>To'lov usuli</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHistory.map((h) => (
                                    <TableRow key={h.id} className={h.action === "cancel" || h.action === "expire" ? "bg-red-50/30" : h.action === "upgrade" ? "bg-purple-50/30" : ""}>
                                        <TableCell>
                                            <div>
                                                <span className="font-medium">{h.date}</span>
                                                <span className="text-xs text-slate-500 block">{h.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={h.type === "business" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-pink-200 bg-pink-50 text-pink-700"}>
                                                {h.type === "business" ? <Building2 className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                                                {h.type === "business" ? "Biznes" : "Mijoz"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{h.entityName}</TableCell>
                                        <TableCell>{getActionBadge(h.action)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {h.planFrom && <Badge className={getPlanBadgeClass(h.planFrom)}>{h.planFrom}</Badge>}
                                                {h.planFrom && h.planTo && <ArrowRightCircle className="w-4 h-4 text-slate-400" />}
                                                {h.planTo && <Badge className={getPlanBadgeClass(h.planTo)}>{h.planTo}</Badge>}
                                                {!h.planFrom && !h.planTo && <span className="text-slate-400">-</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className={h.amount > 0 ? "font-medium text-green-600" : "text-slate-400"}>
                                            {h.amount > 0 ? `+${h.amount.toLocaleString()} UZS` : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {h.paymentMethod ? (
                                                <Badge variant="outline" className="bg-slate-50">
                                                    <CreditCard className="w-3 h-3 mr-1" />{h.paymentMethod}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSubscriptions;
