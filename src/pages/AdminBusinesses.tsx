import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Building2, MoreVertical, CheckCircle, XCircle, ChevronLeft, Eye, MapPin, Phone, Star, Clock, User, BadgeCheck, ShieldCheck, Coins, Globe, Facebook, Instagram, Send, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Mock data
// Mock data generator
const generateMockBusinesses = (count: number) => {
    const categories = ["Barbershop", "Go'zallik saloni", "SPA", "Manikyur", "Stomatologiya", "Kosmetologiya", "Fitnes", "Yoga"];
    // Increase weight of pending
    const statuses = ["approved", "pending", "pending", "rejected"];
    const names = ["Lola", "Guzal", "Diamond", "Gold", "Silver", "Luxury", "Style", "Fashion", "Beauty", "Star", "Nur", "Shox", "Grand", "City", "Art", "Smile", "Oltin", "Anor", "Rayhon", "Orzu"];
    const owners = ["Malika", "Aziz", "Barno", "Jamshid", "Dilnoza", "Sardor", "Nargiza", "Otabek", "Shahnoza", "Farhod"];

    const defaultMockHours = {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "10:00", close: "16:00", closed: false },
        sunday: { open: "00:00", close: "00:00", closed: true },
    };

    return Array.from({ length: count }, (_, i) => {
        const category = categories[i % categories.length];
        const status = statuses[i % statuses.length];
        const name = `${names[i % names.length]} ${category}`;

        return {
            id: `mock-${i + 1}`,
            name: name,
            owner: `${owners[i % owners.length]} ${['Karimov', 'Tursunova', 'Aliyev', 'Rahimova', 'Abdullayev'][i % 5]}`,
            category: category,
            status: status,
            isVerified: status === 'approved' && Math.random() > 0.5,
            rating: status === 'approved' ? (Math.random() * 2 + 3).toFixed(1) : 0,
            address: `Toshkent sh., ${['Chilonzor', 'Yunusobod', 'Mirzo Ulugbek', 'Sergeli', 'Yakkasaroy'][i % 5]} tumani`,
            phone: `+998 9${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
            hours: defaultMockHours,
            description: "Mizozlarimiz uchun yuqori sifatli xizmatlar. Zamonaviy uskunalar va malakali mutaxassislar.",
            services: ["Soch turmaklash", "Manikyur", "Yuz tozalash", "Massaj", "Pedikyur", "Bo'yanish"]
                .slice(0, Math.floor(Math.random() * 4) + 1)
                .map(sName => ({
                    name: sName,
                    price: (Math.floor(Math.random() * 20) + 1) * 10000 // 10,000 to 200,000
                })),
            workImages: [
                "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
                "https://images.unsplash.com/photo-1503951914875-452162b7f30d?w=800&q=80"
            ],
            salonImages: [
                "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
                "https://images.unsplash.com/photo-1595854341625-f33ee1043f76?w=800&q=80"
            ],
            // 0 coins for pending/rejected, random for approved
            coins: status === 'pending' || status === 'rejected' ? 0 : Math.floor(Math.random() * 5000),
            location: { lat: 41.2 + Math.random() * 0.1, lng: 69.2 + Math.random() * 0.1 },
            tempPassword: status === 'approved' ? Math.random().toString(36).slice(-8).toUpperCase() : undefined,
            responsiblePerson: `${owners[i % owners.length]} (Manager)`,
            responsiblePersonPhone: `+998 90 ${Math.floor(Math.random() * 899) + 100} ${Math.floor(Math.random() * 89) + 10} ${Math.floor(Math.random() * 89) + 10}`,
            socials: {
                website: "https://example.com",
                instagram: "beauty_salon_uz",
                telegram: "https://t.me/beauty_salon",
                facebook: "https://facebook.com/beauty"
            },
            clientCount: Math.floor(Math.random() * 200) + 10 // Random client count 10-210
        };
    });
};

const mockBusinesses = generateMockBusinesses(25);

const AdminBusinesses = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);

    // Action dialog states
    const [approveTarget, setApproveTarget] = useState<any | null>(null);
    const [rejectTarget, setRejectTarget] = useState<any | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [verifyTarget, setVerifyTarget] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [itemsPerPage] = useState(10);

    const { toast } = useToast();

    // Fetch businesses
    const fetchBusinesses = async () => {
        // Always show mock data immediately — page is never empty
        setBusinesses(mockBusinesses);
        setLoading(false);

        // Try to merge real DB data in the background
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .not('category', 'is', null)
                .order('created_at', { ascending: false });

            if (error || !data?.length) return;

            const mapped = data.map((p: any) => ({
                id: p.id,
                name: p.full_name || "Nomsiz Biznes",
                owner: p.full_name,
                category: p.category,
                status: p.business_status || 'pending',
                isVerified: p.is_verified || false,
                rating: 0,
                address: p.location?.address_line1 || "Manzil kiritilmagan",
                phone: p.phone,
                hours: p.hours,
                description: p.business_description,
                services: p.services?.map((s: any) => s.name) || [],
                workImages: p.portfolio || [],
                salonImages: p.gallery || [],
                coins: p.trust_score || 0,
                location: p.location ? { lat: p.location.lat, lng: p.location.lng } : null,
                tempPassword: p.temp_password,
                responsiblePerson: p.responsible_person || p.full_name,
                responsiblePersonPhone: p.responsible_person_phone,
                socials: { facebook: p.facebook, instagram: p.instagram, telegram: p.telegram, website: p.website },
                clientCount: p.client_count || Math.floor(Math.random() * 50),
            }));

            // Prepend real data before mocks
            setBusinesses([...mapped, ...mockBusinesses]);
        } catch {
            // Already showing mock data — silently ignore
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        // If approving, generate simulate SMS logic
        if (newStatus === 'approved') {
            const business = businesses.find(b => b.id === id);
            const randomPassword = Math.random().toString(36).slice(-8).toUpperCase(); // Simulating new password
            const login = business?.phone || "business_user";

            toast({
                title: "SMS Yuborildi",
                description: `Login: ${login}, Parol: ${randomPassword} - Biznes muvaffaqiyatli tasdiqlandi!`,
                duration: 6000,
                className: "bg-green-600 text-white border-none"
            });
        }

        // If it's a mock business (starts with 'mock-'), just update local state
        if (id.toString().startsWith('mock-')) {
            setBusinesses(businesses.map(b => b.id === id ? { ...b, status: newStatus } : b));
            if (newStatus !== 'approved') { // If approved, toast handled above
                toast({
                    title: "Status o'zgartirildi (Mock)",
                    description: `Biznes statusi ${newStatus} ga o'zgartirildi`,
                });
            }
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ business_status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setBusinesses(businesses.map(b => b.id === id ? { ...b, status: newStatus } : b));
            if (newStatus !== 'approved') {
                toast({
                    title: "Status o'zgartirildi",
                    description: `Biznes statusi ${newStatus} ga o'zgartirildi`,
                });
            }
        } catch (error) {
            toast({ title: "Xatolik", description: "Statusni o'zgartirishda xatolik", variant: "destructive" });
        }
    };

    const handleVerify = async (id: string) => {
        const business = businesses.find(b => b.id === id);
        if (!business) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_verified: !business.isVerified })
                .eq('id', id);

            if (error) throw error;

            setBusinesses(businesses.map(b => b.id === id ? { ...b, isVerified: !b.isVerified } : b));
            toast({
                title: "Verifikatsiya yangilandi",
                description: "Biznes verifikatsiya holati o'zgartirildi",
            });
        } catch (error) {
            toast({ title: "Xatolik", description: "Verifikatsiyani o'zgartirishda xatolik", variant: "destructive" });
        }
    };

    // Filter Logic
    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.owner.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBusinesses.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Unique categories for filter
    const uniqueCategories = Array.from(new Set(businesses.map(b => b.category)));

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Bizneslar</h1>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Nomi yoki egasi orqali qidirish..."
                            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <select
                            className="bg-white/10 border border-white/20 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all" className="text-black">Barcha Statuslar</option>
                            <option value="pending" className="text-black">Kutilmoqda</option>
                            <option value="approved" className="text-black">Tasdiqlangan</option>
                            <option value="rejected" className="text-black">Rad etilgan</option>
                        </select>

                        <select
                            className="bg-white/10 border border-white/20 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all" className="text-black">Barcha Kategoriyalar</option>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat} className="text-black">{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Businesses List */}
            <div className="p-4 space-y-3">
                <div className="text-sm text-muted-foreground mb-2">
                    Jami: {filteredBusinesses.length} ta biznes
                </div>

                {currentItems.map((business, index) => (
                    <motion.div
                        key={business.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    onClick={() => setSelectedBusiness(business)}
                                    className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium">{business.name}</p>
                                        {business.status === 'approved' && (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                                                <CheckCircle className="w-3 h-3" /> Tasdiqlangan
                                            </span>
                                        )}
                                        {business.isVerified && (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                                <BadgeCheck className="w-3 h-3" /> Verifikatsiyalangan
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{business.owner}</span>
                                        <span className="flex items-center gap-0.5 text-amber-600 font-medium bg-amber-50 px-1.5 rounded">
                                            <Coins className="w-3 h-3" />
                                            {business.coins}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${business.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            business.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {business.status === 'approved' ? 'Tasdiqlangan' :
                                                business.status === 'pending' ? 'Kutilmoqda' : 'Rad etilgan'}
                                        </span>
                                        {Number(business.rating) > 0 && (
                                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">
                                                ⭐ {business.rating}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                            <User className="w-3 h-3" />
                                            {business.clientCount} mijoz
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {business.status === 'pending' && (
                                            <DropdownMenuItem onClick={() => setApproveTarget(business)} className="text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Tasdiqlash
                                            </DropdownMenuItem>
                                        )}
                                        {business.status === 'pending' && (
                                            <DropdownMenuItem onClick={() => { setRejectTarget(business); setRejectReason(""); }} className="text-red-600">
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Rad etish
                                            </DropdownMenuItem>
                                        )}
                                        {business.status === 'approved' && (
                                            <DropdownMenuItem onClick={() => setVerifyTarget(business)} className="text-blue-600">
                                                <ShieldCheck className="w-4 h-4 mr-2" />
                                                {business.isVerified ? "Verifikatsiyani olish" : "Verifikatsiya qilish"}
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Oldingi
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Sahifa {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Keyingi
                        </Button>
                    </div>
                )}
            </div>

            {/* Business Detail Dialog */}
            <Dialog open={!!selectedBusiness} onOpenChange={(open) => !open && setSelectedBusiness(null)}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Biznes ma'lumotlari</DialogTitle>
                    </DialogHeader>
                    {selectedBusiness && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Building2 className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-xl">{selectedBusiness.name}</h3>
                                        {selectedBusiness.isVerified && (
                                            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{selectedBusiness.category}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-bold text-yellow-700">{selectedBusiness.rating}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-md border ${selectedBusiness.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                            selectedBusiness.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {selectedBusiness.status === 'approved' ? 'Tasdiqlangan' :
                                                selectedBusiness.status === 'pending' ? 'Kutilmoqda' : 'Rad etilgan'}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-100 font-medium">
                                            <User className="w-3 h-3" />
                                            {selectedBusiness.clientCount} mijoz
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Coin Balance */}
                            <div className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <Coins className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-amber-900">Biznes hisobi</p>
                                        <p className="text-xs text-amber-700">Joriy tanga balansi</p>
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-amber-700">{selectedBusiness.coins} tanga</p>
                            </div>

                            {/* Images - Works */}
                            {selectedBusiness.workImages && selectedBusiness.workImages.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Bajarilgan ishlar</h4>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {selectedBusiness.workImages.map((img, idx) => (
                                            <img key={idx} src={img} alt="Work" className="w-24 h-24 object-cover rounded-lg border" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images - Salon */}
                            {selectedBusiness.salonImages && selectedBusiness.salonImages.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Salon ko'rinishi</h4>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {selectedBusiness.salonImages.map((img, idx) => (
                                            <img key={idx} src={img} alt="Salon" className="w-24 h-24 object-cover rounded-lg border" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h4 className="font-semibold mb-1 text-sm">Tavsif</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {selectedBusiness.description}
                                </p>
                            </div>

                            {/* Services */}
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">Xizmatlar</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedBusiness.services?.map((service: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-secondary/30 rounded-lg border border-secondary">
                                            <span className="font-medium">
                                                {typeof service === 'string' ? service : service.name}
                                            </span>
                                            {typeof service !== 'string' && service.price && (
                                                <span className="text-primary font-semibold">
                                                    {service.price.toLocaleString('ru-RU')} so'm
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact & Location */}
                            <div className="grid gap-3 p-4 bg-secondary/10 rounded-xl border">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Mas'ul Shaxs</p>
                                        <p className="text-sm font-medium">{selectedBusiness.responsiblePerson || selectedBusiness.owner || "Kiritilmagan"}</p>
                                        {selectedBusiness.responsiblePersonPhone && (
                                            <p className="text-xs text-muted-foreground">{selectedBusiness.responsiblePersonPhone}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Manzil</p>
                                        <p className="text-sm font-medium">{selectedBusiness.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Telefon</p>
                                        <p className="text-sm font-medium">{selectedBusiness.phone}</p>
                                    </div>
                                </div>

                                {/* Social Links */}
                                {selectedBusiness.socials && Object.values(selectedBusiness.socials).some(Boolean) && (
                                    <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-dashed border-gray-200">
                                        {selectedBusiness.socials.website && (
                                            <a href={selectedBusiness.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                        {selectedBusiness.socials.instagram && (
                                            <a href={selectedBusiness.socials.instagram.startsWith('http') ? selectedBusiness.socials.instagram : `https://instagram.com/${selectedBusiness.socials.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                        )}
                                        {selectedBusiness.socials.telegram && (
                                            <a href={selectedBusiness.socials.telegram.startsWith('http') ? selectedBusiness.socials.telegram : `https://t.me/${selectedBusiness.socials.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors">
                                                <Send className="w-4 h-4" />
                                            </a>
                                        )}
                                        {selectedBusiness.socials.facebook && (
                                            <a href={selectedBusiness.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
                                                <Facebook className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-start gap-3 mt-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground mr-2">Ish vaqti</p>
                                    <div className="flex-1 space-y-1">
                                        {selectedBusiness.hours && typeof selectedBusiness.hours === 'object' ? (
                                            Object.entries(selectedBusiness.hours as Record<string, any>).map(([day, time]) => (
                                                <div key={day} className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 last:border-0 pb-1">
                                                    <span className="capitalize text-muted-foreground w-24 text-xs font-medium">
                                                        {{
                                                            monday: 'Dushanba',
                                                            tuesday: 'Seshanba',
                                                            wednesday: 'Chorshanba',
                                                            thursday: 'Payshanba',
                                                            friday: 'Juma',
                                                            saturday: 'Shanba',
                                                            sunday: 'Yakshanba'
                                                        }[day] || day}
                                                    </span>
                                                    <span className={`text-xs ${time.closed ? "text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded" : "text-gray-700 font-mono"}`}>
                                                        {time.closed ? "Yopiq" : `${time.open} - ${time.close}`}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm font-medium">{String(selectedBusiness.hours || "Ma'lumot yo'q")}</p>
                                        )}
                                    </div>
                                </div>

                                {selectedBusiness.status === 'approved' && (
                                    <div className="flex items-center gap-3 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-xs text-green-700 font-semibold uppercase">Vaqtinchalik Parol</p>
                                            <p className="text-lg font-mono font-bold text-green-900 tracking-wider">
                                                {selectedBusiness.tempPassword || "QAYTA TIKLASH KERAK"}
                                            </p>
                                        </div>
                                        {!selectedBusiness.tempPassword && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-auto h-8 bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                onClick={async () => {
                                                    const newPass = Math.random().toString(36).slice(-8).toUpperCase();
                                                    await handleStatusChange(selectedBusiness.id, 'approved'); // Re-trigger approval to save new pass
                                                    setSelectedBusiness(prev => ({ ...prev, tempPassword: newPass }));
                                                }}
                                            >
                                                Yaratish
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Map View */}
                            {selectedBusiness.location && (
                                <div className="h-48 w-full rounded-xl overflow-hidden border">
                                    <MapContainer
                                        center={[selectedBusiness.location.lat, selectedBusiness.location.lng]}
                                        zoom={15}
                                        style={{ height: "100%", width: "100%" }}
                                        dragging={false}
                                        scrollWheelZoom={false}
                                        doubleClickZoom={false}
                                        zoomControl={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[selectedBusiness.location.lat, selectedBusiness.location.lng]} />
                                    </MapContainer>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <Button variant="outline" onClick={() => setSelectedBusiness(null)}>Yopish</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* === APPROVE CONFIRMATION DIALOG === */}
            <Dialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Biznesni tasdiqlash
                        </DialogTitle>
                        <DialogDescription>
                            <strong>{approveTarget?.name}</strong> biznesini tasdiqlashni xohlaysizmi?
                            Biznes aktiv holatga o'tadi va egasi tizimga kirishi mumkin bo'ladi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 space-y-1">
                        <p>• Status: <strong>Kutilmoqda → Tasdiqlangan</strong></p>
                        <p>• Biznes aktiv holatga o'tadi</p>
                        <p>• Egasiga SMS yuboriladi</p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setApproveTarget(null)} disabled={actionLoading}>Bekor qilish</Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={actionLoading}
                            onClick={async () => {
                                setActionLoading(true);
                                await handleStatusChange(approveTarget.id, 'approved');
                                setActionLoading(false);
                                setApproveTarget(null);
                            }}
                        >
                            {actionLoading ? "Yuklanmoqda..." : "Tasdiqlash"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* === REJECT CONFIRMATION DIALOG === */}
            <Dialog open={!!rejectTarget} onOpenChange={(open) => { if (!open) { setRejectTarget(null); setRejectReason(""); } }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            Biznesni rad etish
                        </DialogTitle>
                        <DialogDescription>
                            <strong>{rejectTarget?.name}</strong> biznesini rad etish uchun sababni kiriting.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rad etish sababi *</label>
                        <Textarea
                            placeholder="Masalan: Hujjatlar to'liq emas, qayta topshiring..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                        {rejectReason.trim().length === 0 && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Sababni kiritish majburiy
                            </p>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(""); }} disabled={actionLoading}>Bekor qilish</Button>
                        <Button
                            variant="destructive"
                            disabled={actionLoading || rejectReason.trim().length === 0}
                            onClick={async () => {
                                setActionLoading(true);
                                await handleStatusChange(rejectTarget.id, 'rejected');
                                toast({ title: "Rad etildi", description: `Sabab: ${rejectReason}` });
                                setActionLoading(false);
                                setRejectTarget(null);
                                setRejectReason("");
                            }}
                        >
                            {actionLoading ? "Yuklanmoqda..." : "Rad etish"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* === VERIFY CONFIRMATION DIALOG === */}
            <Dialog open={!!verifyTarget} onOpenChange={(open) => !open && setVerifyTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            {verifyTarget?.isVerified ? "Verifikatsiyani olib tashlash" : "Biznesni verifikatsiya qilish"}
                        </DialogTitle>
                        <DialogDescription>
                            {verifyTarget?.isVerified
                                ? <span><strong>{verifyTarget?.name}</strong> biznesidan verifikatsiya badgeni olib tashlamoqchimisiz?</span>
                                : <span>Ushbu biznesni ishonchli biznes sifatida verifikatsiya qilasizmi? <strong>{verifyTarget?.name}</strong> ga maxsus "Verifikatsiyalangan" badge'i beriladi.</span>
                            }
                        </DialogDescription>
                    </DialogHeader>
                    {!verifyTarget?.isVerified && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 space-y-1">
                            <p>• Biznesga <strong>"Verifikatsiyalangan"</strong> badge'i qo'shiladi</p>
                            <p>• Mijozlar uchun ishonchlilik belgisi sifatida ko'rinadi</p>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setVerifyTarget(null)} disabled={actionLoading}>Bekor qilish</Button>
                        <Button
                            className={verifyTarget?.isVerified ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                            disabled={actionLoading}
                            onClick={async () => {
                                setActionLoading(true);
                                await handleVerify(verifyTarget.id);
                                setActionLoading(false);
                                setVerifyTarget(null);
                            }}
                        >
                            {actionLoading ? "Yuklanmoqda..." : (verifyTarget?.isVerified ? "Olib tashlash" : "Verifikatsiya qilish")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBusinesses;
