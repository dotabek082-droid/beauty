import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Search,
    Check,
    X,
    Clock,
    DollarSign,
    Building2,
    Filter,
    AlertCircle,
    ChevronDown,
    Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type ServiceStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE' | 'ARCHIVED';

interface AdminService {
    id: string;
    businessId: string;
    businessName: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    status: ServiceStatus;
    rejectReason?: string;
    submittedAt: Date;
}

type FilterTab = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';

const AdminServicesPage = () => {
    const { toast } = useToast();
    const [services, setServices] = useState<AdminService[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTab>('PENDING');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<AdminService | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    // Mock data — in production, this would come from an API
    const mockServices: AdminService[] = [
        {
            id: "pending-1",
            businessId: "biz-1",
            businessName: "Baraka Beauty Salon",
            name: "Soch laminirlash",
            description: "Professional keratin bilan sochni laminirlash va parvarish qilish",
            price: 180000,
            duration: 90,
            status: 'PENDING',
            submittedAt: new Date("2024-01-20T10:30:00"),
        },
        {
            id: "pending-2",
            businessId: "biz-2",
            businessName: "Nilufar Salon",
            name: "Qosh olish",
            description: "Professional usulda qosh shakl berish va olish",
            price: 25000,
            duration: 20,
            status: 'PENDING',
            submittedAt: new Date("2024-01-20T14:15:00"),
        },
        {
            id: "pending-3",
            businessId: "biz-1",
            businessName: "Baraka Beauty Salon",
            name: "Soch davolash",
            description: "Zaif va shikastlangan sochlar uchun professional davolash",
            price: 250000,
            duration: 120,
            status: 'PENDING',
            submittedAt: new Date("2024-01-21T09:00:00"),
        },
        {
            id: "approved-1",
            businessId: "biz-1",
            businessName: "Baraka Beauty Salon",
            name: "Kattalar soch turmagi",
            description: "Erkaklar va ayollar uchun professional soch kesish xizmati",
            price: 50000,
            duration: 45,
            status: 'APPROVED',
            submittedAt: new Date("2024-01-15T08:00:00"),
        },
        {
            id: "approved-2",
            businessId: "biz-2",
            businessName: "Nilufar Salon",
            name: "Manikür",
            description: "Klassik manikür va tirnoq parvarishi",
            price: 35000,
            duration: 60,
            status: 'APPROVED',
            submittedAt: new Date("2024-01-16T11:00:00"),
        },
        {
            id: "rejected-1",
            businessId: "biz-3",
            businessName: "Gulnora Studio",
            name: "Botoks in'ektsiyasi",
            description: "Yuz terisi uchun botoks protsedurasi",
            price: 500000,
            duration: 60,
            status: 'REJECTED',
            rejectReason: "Tibbiy protseduralar faqat litsenziyalangan tibbiy muassasalarda amalga oshirilishi kerak.",
            submittedAt: new Date("2024-01-18T15:30:00"),
        },
    ];

    useEffect(() => {
        // Load from localStorage or use mock data
        const stored = localStorage.getItem('admin_services_queue');
        if (stored) {
            const parsed = JSON.parse(stored);
            setServices(parsed.map((s: any) => ({
                ...s,
                submittedAt: new Date(s.submittedAt),
            })));
        } else {
            setServices(mockServices);
            localStorage.setItem('admin_services_queue', JSON.stringify(mockServices));
        }
    }, []);

    useEffect(() => {
        if (services.length > 0) {
            localStorage.setItem('admin_services_queue', JSON.stringify(services));
        }
    }, [services]);

    const handleApprove = (id: string) => {
        setServices(services.map(s =>
            s.id === id ? { ...s, status: 'APPROVED' as ServiceStatus } : s
        ));
        toast({
            title: "Tasdiqlandi ✓",
            description: "Xizmat turi muvaffaqiyatli tasdiqlandi",
            className: "bg-emerald-600 text-white border-emerald-700",
        });
    };

    const openRejectDialog = (service: AdminService) => {
        setSelectedService(service);
        setRejectReason("");
        setRejectDialogOpen(true);
    };

    const handleReject = () => {
        if (!selectedService || !rejectReason.trim()) {
            toast({
                title: "Xatolik",
                description: "Iltimos, rad etish sababini kiriting",
                variant: "destructive",
            });
            return;
        }

        setServices(services.map(s =>
            s.id === selectedService.id
                ? { ...s, status: 'REJECTED' as ServiceStatus, rejectReason: rejectReason }
                : s
        ));
        setRejectDialogOpen(false);
        setSelectedService(null);
        setRejectReason("");

        toast({
            title: "Rad etildi",
            description: "Xizmat turi rad etildi va biznes egasiga xabar yuborildi",
        });
    };

    const openDetailDialog = (service: AdminService) => {
        setSelectedService(service);
        setDetailDialogOpen(true);
    };

    const tabs: { key: FilterTab; label: string; count: number }[] = [
        { key: 'PENDING', label: 'Kutilmoqda', count: services.filter(s => s.status === 'PENDING').length },
        { key: 'APPROVED', label: 'Tasdiqlangan', count: services.filter(s => s.status === 'APPROVED').length },
        { key: 'REJECTED', label: 'Rad etilgan', count: services.filter(s => s.status === 'REJECTED').length },
        { key: 'ALL', label: 'Barchasi', count: services.length },
    ];

    const filteredServices = services
        .filter(s => activeTab === 'ALL' || s.status === activeTab)
        .filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const statusConfig: Record<ServiceStatus, { dot: string; label: string; badgeClass: string }> = {
        DRAFT: { dot: 'bg-gray-400', label: 'Chornavoy', badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' },
        PENDING: { dot: 'bg-yellow-400', label: 'Kutilmoqda', badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        APPROVED: { dot: 'bg-emerald-500', label: 'Tasdiqlangan', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        REJECTED: { dot: 'bg-red-500', label: 'Rad etilgan', badgeClass: 'bg-red-50 text-red-700 border-red-200' },
        INACTIVE: { dot: 'bg-gray-300', label: 'Faolsiz', badgeClass: 'bg-gray-100 text-gray-600 border-gray-200' },
        ARCHIVED: { dot: 'bg-gray-200', label: 'Arxivlangan', badgeClass: 'bg-gray-50 text-gray-500 border-gray-100' },
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-white" />
                                </div>
                                Xizmat Turlari Boshqaruvi
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
                                Biznes egalari tomonidan yuborilgan xizmat turlarini tasdiqlash yoki rad etish
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    flex-1 flex items-center justify-center gap-2
                                    px-4 py-2.5 rounded-lg text-sm font-medium
                                    transition-all duration-200
                                    ${activeTab === tab.key
                                        ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }
                                `}
                            >
                                {tab.label}
                                <span className={`
                                    text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full
                                    ${activeTab === tab.key
                                        ? tab.key === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : tab.key === 'APPROVED'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : tab.key === 'REJECTED'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-200 text-gray-700'
                                        : 'bg-gray-200/70 text-gray-500'
                                    }
                                `}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Xizmat nomi yoki biznes nomi bo'yicha qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 bg-white dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-800"
                    />
                </div>

                {/* Services List */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            {searchQuery ? "Xizmat topilmadi" : "Hozircha xizmat yo'q"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery
                                ? "Boshqa kalit so'z bilan qidirib ko'ring"
                                : activeTab === 'PENDING'
                                ? "Hozircha tasdiqlanishi kerak bo'lgan xizmatlar yo'q"
                                : "Bu bo'limda xizmatlar topilmadi"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredServices.map((service, index) => {
                                const cfg = statusConfig[service.status];
                                return (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
                                    >
                                        <div className="
                                            group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
                                            hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30
                                            transition-all duration-300 overflow-hidden
                                        ">
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    {/* Left: Service Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2.5 mb-2">
                                                            <h3 className="font-semibold text-[16px] text-foreground">
                                                                {service.name}
                                                            </h3>
                                                            <Badge variant="outline" className={`text-[10px] px-2 py-0 ${cfg.badgeClass}`}>
                                                                {cfg.label}
                                                            </Badge>
                                                        </div>

                                                        {/* Business Name */}
                                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                                                            <Building2 className="w-3.5 h-3.5" />
                                                            <span className="font-medium">{service.businessName}</span>
                                                            <span className="text-gray-300 dark:text-gray-600">·</span>
                                                            <span className="text-xs">
                                                                {service.submittedAt.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>

                                                        {service.description && (
                                                            <p className="text-[13px] text-muted-foreground line-clamp-2 mb-3">
                                                                {service.description}
                                                            </p>
                                                        )}

                                                        {/* Rejection Reason */}
                                                        {service.status === 'REJECTED' && service.rejectReason && (
                                                            <div className="flex items-start gap-1.5 text-[12px] text-red-600 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-100 dark:border-red-800 mb-3">
                                                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                                <span>{service.rejectReason}</span>
                                                            </div>
                                                        )}

                                                        {/* Price & Duration Chips */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                                                                <DollarSign className="w-3 h-3" />
                                                                <span className="text-xs font-semibold">{service.price.toLocaleString()} so'm</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                                                                <Clock className="w-3 h-3" />
                                                                <span className="text-xs font-medium">{service.duration} daq</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Actions */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 px-3 text-xs rounded-lg"
                                                            onClick={() => openDetailDialog(service)}
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                            Ko'rish
                                                        </Button>
                                                        {service.status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    className="h-9 px-4 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                    onClick={() => handleApprove(service.id)}
                                                                >
                                                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                                                    Tasdiqlash
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-9 px-4 text-xs rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                    onClick={() => openRejectDialog(service)}
                                                                >
                                                                    <X className="w-3.5 h-3.5 mr-1.5" />
                                                                    Rad etish
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            Xizmatni Rad Etish
                        </DialogTitle>
                        <DialogDescription>
                            Rad etish sababini kiriting. Bu sabab biznes egasiga ko'rsatiladi.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedService && (
                        <div className="space-y-4 py-2">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <p className="font-semibold text-sm">{selectedService.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {selectedService.businessName} · {selectedService.price.toLocaleString()} so'm
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reject-reason">Rad etish sababi *</Label>
                                <Textarea
                                    id="reject-reason"
                                    placeholder="Masalan: Narx juda baland ko'rsatilgan. Iltimos, bozor narxlariga muvofiqlashtiring."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Bekor qilish
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectReason.trim()}
                        >
                            Rad etish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Xizmat Tafsilotlari</DialogTitle>
                        <DialogDescription>
                            Xizmat turi haqida to'liq ma'lumot
                        </DialogDescription>
                    </DialogHeader>
                    {selectedService && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Xizmat nomi</span>
                                    <span className="font-semibold text-sm">{selectedService.name}</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Biznes</span>
                                    <span className="font-medium text-sm">{selectedService.businessName}</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Narxi</span>
                                    <span className="font-semibold text-sm text-emerald-600">{selectedService.price.toLocaleString()} so'm</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Davomiyligi</span>
                                    <span className="font-medium text-sm">{selectedService.duration} daqiqa</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge variant="outline" className={`text-[10px] px-2 py-0 ${statusConfig[selectedService.status].badgeClass}`}>
                                        {statusConfig[selectedService.status].label}
                                    </Badge>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Yuborilgan sana</span>
                                    <span className="text-sm">{selectedService.submittedAt.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                {selectedService.description && (
                                    <>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                        <div>
                                            <span className="text-sm text-muted-foreground block mb-1">Tavsif</span>
                                            <p className="text-sm text-foreground">{selectedService.description}</p>
                                        </div>
                                    </>
                                )}
                                {selectedService.status === 'REJECTED' && selectedService.rejectReason && (
                                    <>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                        <div>
                                            <span className="text-sm text-red-600 block mb-1 font-medium">Rad etish sababi</span>
                                            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">{selectedService.rejectReason}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedService?.status === 'PENDING' && (
                            <div className="flex gap-2 w-full">
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => {
                                        handleApprove(selectedService.id);
                                        setDetailDialogOpen(false);
                                    }}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Tasdiqlash
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        setDetailDialogOpen(false);
                                        openRejectDialog(selectedService);
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Rad etish
                                </Button>
                            </div>
                        )}
                        {selectedService?.status !== 'PENDING' && (
                            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                                Yopish
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminServicesPage;
