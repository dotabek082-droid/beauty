import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Briefcase, Search, DollarSign, Clock, ChevronLeft, Power, PowerOff, AlertCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BusinessBottomNav from "@/components/BusinessBottomNav";

export type ServiceStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE' | 'ARCHIVED';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    status: ServiceStatus;
    rejectReason?: string;
    createdAt: Date;
}

const BusinessServicesPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { toast } = useToast();

    const [services, setServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        isActive: true, // Internal state for the toggle
    });

    // Fake service data for beauty salon
    const fakeServices: Service[] = [
        {
            id: "1",
            name: "Kattalar soch turmagi",
            description: "Erkaklar va ayollar uchun professional soch kesish xizmati",
            price: 50000,
            duration: 45,
            status: 'APPROVED',
            createdAt: new Date("2024-01-15"),
        },
        {
            id: "2",
            name: "Bolalar soch turmagi",
            description: "3-14 yosh oralig'idagi bolalar uchun soch kesish",
            price: 20000,
            duration: 30,
            status: 'APPROVED',
            createdAt: new Date("2024-01-15"),
        },
        {
            id: "3",
            name: "Soch bo'yash",
            description: "Professional bo'yoq bilan sochni to'liq bo'yash",
            price: 150000,
            duration: 120,
            status: 'APPROVED',
            createdAt: new Date("2024-01-16"),
        },
        {
            id: "4",
            name: "Manikür",
            description: "Klassik manikür va tirnoq parvarishi",
            price: 35000,
            duration: 60,
            status: 'APPROVED',
            createdAt: new Date("2024-01-16"),
        },
        {
            id: "5",
            name: "Pedikür",
            description: "Klassik pedikür va oyoq parvarishi",
            price: 40000,
            duration: 75,
            status: 'APPROVED',
            createdAt: new Date("2024-01-17"),
        },
        {
            id: "6",
            name: "Soqol olish",
            description: "Klassik ustara bilan soqol olish va yuz massaji",
            price: 30000,
            duration: 30,
            status: 'APPROVED',
            createdAt: new Date("2024-01-17"),
        },
        {
            id: "7",
            name: "Soch to'g'rilash",
            description: "Professional keratin bilan sochni to'g'rilash",
            price: 200000,
            duration: 180,
            status: 'APPROVED',
            createdAt: new Date("2024-01-18"),
        },
        {
            id: "8",
            name: "Yuz tozalash",
            description: "Chuqur tozalash va yuz parvarishi",
            price: 80000,
            duration: 90,
            status: 'APPROVED',
            createdAt: new Date("2024-01-18"),
        },
        {
            id: "9",
            name: "Laminatsiya",
            description: "Kipriklar va qoshlar uchun professional laminatsiya",
            price: 120000,
            duration: 60,
            status: 'REJECTED',
            rejectReason: "Narx juda baland ko'rsatilgan. Iltimos, bozor narxlariga muvofiqlashtiring.",
            createdAt: new Date("2024-01-19"),
        },
    ];

    // Load services from localStorage on mount
    useEffect(() => {
        if (user?.id) {
            const storedServices = localStorage.getItem(`business_services_v3_${user.id}`);
            if (storedServices) {
                const parsed = JSON.parse(storedServices);
                setServices(parsed.map((s: any) => ({
                    ...s,
                    createdAt: new Date(s.createdAt)
                })));
            } else {
                // Load fake data if no stored services
                setServices(fakeServices);
                localStorage.setItem(`business_services_v3_${user.id}`, JSON.stringify(fakeServices));
            }
        }
    }, [user]);

    // Save services to localStorage whenever they change
    useEffect(() => {
        if (user?.id && services.length > 0) {
            localStorage.setItem(`business_services_v3_${user.id}`, JSON.stringify(services));
        }
    }, [services, user]);

    const handleAddService = () => {
        if (!formData.name || !formData.price || !formData.duration) {
            toast({
                title: "Xatolik",
                description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
                variant: "destructive",
            });
            return;
        }

        const newService: Service = {
            id: Date.now().toString(),
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            duration: parseInt(formData.duration),
            status: 'DRAFT', // Starts as draft per best practice
            createdAt: new Date(),
        };

        setServices([...services, newService]);
        setIsAddDialogOpen(false);
        resetForm();

        toast({
            title: "Muvaffaqiyatli!",
            description: "Xizmat qo'shildi",
            className: "bg-green-500 text-white border-green-600",
        });
    };

    const handleEditService = () => {
        if (!selectedService || !formData.name || !formData.price || !formData.duration) {
            toast({
                title: "Xatolik",
                description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
                variant: "destructive",
            });
            return;
        }

        setServices(services.map(s => {
            if (s.id === selectedService.id) {
                // If the user toggled it to Active but it was Inactive, move to PENDING
                // If the user toggled it to Inactive, set it to INACTIVE
                let newStatus = s.status;
                if (!formData.isActive) {
                    newStatus = 'INACTIVE';
                } else if (s.status === 'INACTIVE') {
                    newStatus = 'PENDING'; // Needs admin approval to reactivate
                }

                return {
                    ...s,
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                    status: newStatus,
                };
            }
            return s;
        }));

        setIsEditDialogOpen(false);
        setSelectedService(null);
        resetForm();

        toast({
            title: "Muvaffaqiyatli!",
            description: "Xizmat tahrirlandi",
            className: "bg-green-500 text-white border-green-600",
        });
    };

    const handleDeleteService = (id: string, status: ServiceStatus) => {
        if (status !== 'DRAFT') {
            toast({
                title: "O'chirish imkonsiz",
                description: "Faqat 'Chornavoy' holatidagi xizmatlarni o'chirish mumkin. Faol xizmatlarni faolsizlantirishingiz mumkin.",
                variant: "destructive",
            });
            return;
        }

        setServices(services.filter(s => s.id !== id));
        toast({
            title: "O'chirildi",
            description: "Xizmat o'chirildi",
        });
    };
    
    const sendToAdmin = (id: string) => {
        setServices(services.map(s => 
            s.id === id ? { ...s, status: 'PENDING' } : s
        ));
        
        toast({
            title: "Yuborildi",
            description: "Xizmat tasdiqlash uchun adminga yuborildi",
            className: "bg-blue-600 text-white border-blue-700",
        });
    };

    const toggleServiceStatus = (id: string, currentStatus: ServiceStatus) => {
        const newStatus: ServiceStatus = currentStatus === 'INACTIVE' ? 'PENDING' : 'INACTIVE';
        
        setServices(services.map(s => 
            s.id === id ? { ...s, status: newStatus } : s
        ));
        
        toast({
            title: newStatus === 'INACTIVE' ? "Faolsizlantirildi" : "Faollashtirish so'raldi",
            description: newStatus === 'INACTIVE' 
                ? "Xizmat mijozlarga ko'rinmaydi" 
                : "Xizmat tasdiqlash uchun adminga yuborildi",
        });
    };

    const openEditDialog = (service: Service) => {
        if (service.status === 'REJECTED' || service.status === 'PENDING') {
            toast({
                title: "Tahrirlash imkonsiz",
                description: service.status === 'REJECTED' 
                    ? "Rad etilgan xizmatni tahrirlash mumkin emas." 
                    : "Xizmat tasdiqlash jarayonida. Tasdiqlangandan so'ng tahrirlashingiz mumkin.",
                variant: "destructive",
            });
            return;
        }
        
        setSelectedService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price.toString(),
            duration: service.duration.toString(),
            isActive: service.status !== 'INACTIVE',
        });
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "",
            isActive: true,
        });
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => navigate('/profile')}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Xizmatlar
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {services.length} ta xizmat
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            setIsAddDialogOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Qo'shish
                    </Button>
                </div>

                {/* Search */}
                {services.length > 0 && (
                    <div className="px-4 pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Xizmat izlash..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Services List */}
            <div className="px-4 py-6">
                {filteredServices.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {searchQuery ? "Xizmat topilmadi" : "Xizmatlar yo'q"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            {searchQuery
                                ? "Boshqa kalit so'z bilan qidirish"
                                : "Birinchi xizmatni qo'shish uchun yuqoridagi tugmani bosing"}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => {
                                    resetForm();
                                    setIsAddDialogOpen(true);
                                }}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Xizmat Qo'shish
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredServices.map((service, index) => {
                                const statusConfig: Record<ServiceStatus, { border: string; bg: string; label: string; dot: string }> = {
                                    DRAFT: { border: 'border-l-gray-400', bg: 'bg-white dark:bg-gray-900', label: 'Chornavoy', dot: 'bg-gray-400' },
                                    PENDING: { border: 'border-l-yellow-400', bg: 'bg-white dark:bg-gray-900', label: 'Kutilmoqda', dot: 'bg-yellow-400' },
                                    APPROVED: { border: 'border-l-emerald-500', bg: 'bg-white dark:bg-gray-900', label: 'Tasdiqlangan', dot: 'bg-emerald-500' },
                                    REJECTED: { border: 'border-l-red-500', bg: 'bg-white dark:bg-gray-900', label: 'Rad etilgan', dot: 'bg-red-500' },
                                    INACTIVE: { border: 'border-l-gray-300', bg: 'bg-gray-50/80 dark:bg-gray-900/60', label: 'Faolsiz', dot: 'bg-gray-300' },
                                    ARCHIVED: { border: 'border-l-gray-200', bg: 'bg-gray-50/50 dark:bg-gray-900/40', label: 'Arxivlangan', dot: 'bg-gray-200' },
                                };
                                const cfg = statusConfig[service.status];

                                return (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100, opacity: 0 }}
                                        transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
                                    >
                                        <div className={`
                                            group relative rounded-xl border border-gray-100 dark:border-gray-800
                                            border-l-[3px] ${cfg.border} ${cfg.bg}
                                            ${service.status === 'INACTIVE' ? 'opacity-50' : ''}
                                            hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30
                                            transition-all duration-300 ease-out
                                            overflow-hidden
                                        `}>
                                            {/* Top Row: Name + Status + Actions */}
                                            <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <h3 className="font-semibold text-[15px] text-foreground truncate">
                                                        {service.name}
                                                    </h3>
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                                            {cfg.label}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-0.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={service.status === 'REJECTED' || service.status === 'PENDING'}
                                                        className={`h-7 w-7 p-0 rounded-lg ${
                                                            (service.status === 'REJECTED' || service.status === 'PENDING') 
                                                            ? 'opacity-50 cursor-not-allowed' 
                                                            : 'hover:bg-primary/10'
                                                        }`}
                                                        onClick={() => openEditDialog(service)}
                                                    >
                                                        <Edit2 className={`w-3.5 h-3.5 ${
                                                            (service.status === 'REJECTED' || service.status === 'PENDING') 
                                                            ? 'text-gray-400' 
                                                            : 'text-primary'
                                                        }`} />
                                                    </Button>
                                                    {service.status === 'DRAFT' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteService(service.id, service.status)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rejection Reason */}
                                            {service.status === 'REJECTED' && service.rejectReason && (
                                                <div className="mx-4 mb-2 flex items-start gap-1.5 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    <span>{service.rejectReason}</span>
                                                </div>
                                            )}

                                            {/* Description */}
                                            {service.description && (
                                                <p className="px-4 text-[13px] text-muted-foreground line-clamp-1 mb-2">
                                                    {service.description}
                                                </p>
                                            )}

                                            {/* Bottom Bar: Price, Duration, Send Action */}
                                            <div className={`
                                                px-4 py-2.5 flex items-center gap-2 flex-wrap
                                                border-t border-gray-100/80 dark:border-gray-800/80
                                                bg-gray-50/50 dark:bg-gray-800/20
                                            `}>
                                                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                                                    <DollarSign className="w-3 h-3" />
                                                    <span className="text-xs font-semibold">{service.price.toLocaleString()} so'm</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-xs font-medium">{service.duration} daq</span>
                                                </div>
                                                {service.status === 'DRAFT' && (
                                                    <Button
                                                        size="sm"
                                                        className="ml-auto h-7 px-3 text-[11px] font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-sm shadow-blue-500/25"
                                                        onClick={() => sendToAdmin(service.id)}
                                                    >
                                                        <Send className="w-3 h-3 mr-1.5" />
                                                        Adminga yuborish
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add Service Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Yangi Xizmat Qo'shish</DialogTitle>
                        <DialogDescription>
                            Xizmat haqida ma'lumot kiriting
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Xizmat nomi *</Label>
                            <Input
                                id="name"
                                placeholder="Masalan: Soch kesish"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Tavsif</Label>
                            <Textarea
                                id="description"
                                placeholder="Xizmat haqida qisqacha ma'lumot"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Narxi (so'm) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="50000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Davomiyligi (daqiqa) *</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="30"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsAddDialogOpen(false);
                            resetForm();
                        }}>
                            Bekor qilish
                        </Button>
                        <Button onClick={handleAddService} className="bg-primary hover:bg-primary/90">
                            Qo'shish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Service Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Xizmatni Tahrirlash</DialogTitle>
                        <DialogDescription>
                            Xizmat ma'lumotlarini yangilang
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Xizmat nomi *</Label>
                            <Input
                                id="edit-name"
                                placeholder="Masalan: Soch kesish"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Tavsif</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Xizmat haqida qisqacha ma'lumot"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Narxi (so'm) *</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    placeholder="150000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-duration">Davomiyligi (daqiqa) *</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    placeholder="60"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Status</Label>
                                <p className="text-[12px] text-muted-foreground">
                                    {formData.isActive ? "Xizmat faol va mijozlarga ko'rinadi" : "Xizmat faolsizlantirilgan"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                    {formData.isActive ? "Faol" : "Faolsiz"}
                                </span>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsEditDialogOpen(false);
                            setSelectedService(null);
                            resetForm();
                        }}>
                            Bekor qilish
                        </Button>
                        <Button onClick={handleEditService} className="bg-primary hover:bg-primary/90">
                            Saqlash
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bottom Navigation */}
            <BusinessBottomNav activeTab="profile" onTabChange={() => { }} />
        </div>
    );
};

export default BusinessServicesPage;
