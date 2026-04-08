import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Briefcase, Search, DollarSign, Clock, ChevronLeft } from "lucide-react";
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

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
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
    });

    // Fake service data for beauty salon
    const fakeServices: Service[] = [
        {
            id: "1",
            name: "Kattalar soch turmagi",
            description: "Erkaklar va ayollar uchun professional soch kesish xizmati",
            price: 50000,
            duration: 45,
            createdAt: new Date("2024-01-15"),
        },
        {
            id: "2",
            name: "Bolalar soch turmagi",
            description: "3-14 yosh oralig'idagi bolalar uchun soch kesish",
            price: 20000,
            duration: 30,
            createdAt: new Date("2024-01-15"),
        },
        {
            id: "3",
            name: "Soch bo'yash",
            description: "Professional bo'yoq bilan sochni to'liq bo'yash",
            price: 150000,
            duration: 120,
            createdAt: new Date("2024-01-16"),
        },
        {
            id: "4",
            name: "Manikür",
            description: "Klassik manikür va tirnoq parvarishi",
            price: 35000,
            duration: 60,
            createdAt: new Date("2024-01-16"),
        },
        {
            id: "5",
            name: "Pedikür",
            description: "Klassik pedikür va oyoq parvarishi",
            price: 40000,
            duration: 75,
            createdAt: new Date("2024-01-17"),
        },
        {
            id: "6",
            name: "Soqol olish",
            description: "Klassik ustara bilan soqol olish va yuz massaji",
            price: 30000,
            duration: 30,
            createdAt: new Date("2024-01-17"),
        },
        {
            id: "7",
            name: "Soch to'g'rilash",
            description: "Professional keratin bilan sochni to'g'rilash",
            price: 200000,
            duration: 180,
            createdAt: new Date("2024-01-18"),
        },
        {
            id: "8",
            name: "Yuz tozalash",
            description: "Chuqur tozalash va yuz parvarishi",
            price: 80000,
            duration: 90,
            createdAt: new Date("2024-01-18"),
        },
    ];

    // Load services from localStorage on mount
    useEffect(() => {
        if (user?.id) {
            const storedServices = localStorage.getItem(`business_services_${user.id}`);
            if (storedServices) {
                const parsed = JSON.parse(storedServices);
                setServices(parsed.map((s: any) => ({
                    ...s,
                    createdAt: new Date(s.createdAt)
                })));
            } else {
                // Load fake data if no stored services
                setServices(fakeServices);
                localStorage.setItem(`business_services_${user.id}`, JSON.stringify(fakeServices));
            }
        }
    }, [user]);

    // Save services to localStorage whenever they change
    useEffect(() => {
        if (user?.id && services.length > 0) {
            localStorage.setItem(`business_services_${user.id}`, JSON.stringify(services));
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

        setServices(services.map(s =>
            s.id === selectedService.id
                ? {
                    ...s,
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                }
                : s
        ));

        setIsEditDialogOpen(false);
        setSelectedService(null);
        resetForm();

        toast({
            title: "Muvaffaqiyatli!",
            description: "Xizmat tahrirlandi",
            className: "bg-green-500 text-white border-green-600",
        });
    };

    const handleDeleteService = (id: string) => {
        setServices(services.filter(s => s.id !== id));
        toast({
            title: "O'chirildi",
            description: "Xizmat o'chirildi",
        });
    };

    const openEditDialog = (service: Service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price.toString(),
            duration: service.duration.toString(),
        });
        setIsEditDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "",
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
                            {filteredServices.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-foreground mb-1">
                                                    {service.name}
                                                </h3>
                                                {service.description && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {service.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                        <span className="font-semibold">
                                                            {service.price.toLocaleString()} so'm
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{service.duration} daqiqa</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => openEditDialog(service)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteService(service.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
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
                                    placeholder="50000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-duration">Davomiyligi (daqiqa) *</Label>
                                <Input
                                    id="edit-duration"
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
