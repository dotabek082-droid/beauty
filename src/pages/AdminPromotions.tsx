import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Gift, Shuffle, Trophy, Check, ChevronLeft, CheckCircle, XCircle, Tag, Percent, Plus, Calendar, Clock, Info, UserPlus, User, Crown, Send, Star, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockPromotions as initialPromotions } from "@/data/promotionData";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

// Mock registered clients database
const mockRegisteredClients = [
    { id: "u1", name: "Aziz Karimov", email: "aziz@test.com" },
    { id: "u2", name: "Nilufar Rahimova", email: "nilufar@test.com" },
    { id: "u3", name: "Shohruh Aliyev", email: "shohruh@test.com" },
    { id: "u4", name: "Malika Tursunova", email: "malika@test.com" },
    { id: "u5", name: "Behruz Sodikov", email: "behruz@test.com" },
    { id: "u6", name: "Zarina Karimova", email: "zarina@test.com" },
    { id: "u7", name: "Jamshid Toshmatov", email: "jamshid@test.com" },
    { id: "u8", name: "Sevara Nazarova", email: "sevara@test.com" },
];

const AdminPromotions = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Initialize promotions
    const [promotions, setPromotions] = useState(() => {
        const mapped = initialPromotions.map((p) => ({
            ...p,
            status: p.isActive ? 'active' : 'completed'
        }));

        const pendingPromos = [
            {
                ...initialPromotions[0],
                id: 'pending-lottery',
                serviceName: "Yangi Yil Makiyaji (Lotereya)",
                salonName: "Guzallik Salon",
                status: 'pending',
                promotionType: 'lottery',
                lotteryEnabled: true,
                imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
                serviceDescription: "Yangi yil kechasi uchun maxsus makiyaj yutib oling! G'oliblar tasodifiy aniqlanadi.",
                startsAt: "2026-02-01",
                endsAt: "2026-02-10"
            },
            {
                ...initialPromotions[1],
                id: 'pending-1plus1',
                serviceName: "1+1: Soch Kesish",
                salonName: "Barbershop Pro",
                status: 'pending',
                promotionType: '1+1',
                lotteryEnabled: false,
                serviceDescription: "Do'stingiz bilan keling, 2-chi soch kesish bepul! Faqat ish kunlari amal qiladi.",
                imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
                startsAt: "2026-02-05",
                endsAt: "2026-03-05"
            },
            {
                ...initialPromotions[2],
                id: 'pending-discount',
                serviceName: "Manikyur -30%",
                salonName: "Nail Art Studio",
                status: 'pending',
                promotionType: 'discount',
                lotteryEnabled: false,
                discountedPrice: 70000,
                originalPrice: 100000,
                serviceDescription: "Barcha turdagi manikyur xizmatlariga 30% chegirma. Shoshiling, joylar soni cheklangan!",
                imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
                startsAt: "2026-02-01",
                endsAt: "2026-02-28"
            },
            {
                ...initialPromotions[3],
                id: 'pending-free',
                serviceName: "Bepul Maslahat",
                salonName: "Dermatologiya Markazi",
                status: 'pending',
                promotionType: 'regular', // Free service
                lotteryEnabled: false,
                originalPrice: 0,
                serviceDescription: "Dermatolog ko'rigi va maslahati mutlaqo bepul. Faqat birinchi tashrif buyuruvchilar uchun.",
                imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
                startsAt: "2026-02-10",
                endsAt: "2026-02-20"
            }
        ];

        return [...pendingPromos, ...mapped];
    });

    const [selectedPromotion, setSelectedPromotion] = useState(promotions[0]);
    // Current participants for the selected promotion
    const [participants, setParticipants] = useState<typeof mockRegisteredClients>(mockRegisteredClients.slice(0, 5));
    const [winners, setWinners] = useState<typeof mockRegisteredClients>([]);

    // Mock winner progress state
    const [winnerProgress, setWinnerProgress] = useState<Record<string, { status: 'booked' | 'service_done' | 'feedback_given', date?: string, rating?: number, feedback?: string }>>({});

    const [isShuffling, setIsShuffling] = useState(false);
    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
    const [isAddWinnerOpen, setIsAddWinnerOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState("");
    const { toast } = useToast();

    const handleStatusChange = (id: string, newStatus: string) => {
        setPromotions(promotions.map(p => p.id === id ? { ...p, status: newStatus } : p));
        if (selectedPromotion.id === id) {
            setSelectedPromotion({ ...selectedPromotion, status: newStatus });
        }
        toast({
            title: "Status yangilandi",
            description: `Aksiya statusi ${newStatus} ga o'zgartirildi`,
        });
    };

    const handleAddParticipant = (client: typeof mockRegisteredClients[0]) => {
        if (participants.find(p => p.id === client.id)) {
            toast({
                title: "Xatolik",
                description: "Bu foydalanuvchi allaqachon qo'shilgan",
                variant: "destructive"
            });
            return;
        }
        setParticipants([...participants, client]);
        setIsAddParticipantOpen(false);
        toast({
            title: "Qo'shildi",
            description: `${client.name} ishtirokchilar ro'yxatiga qo'shildi`,
        });
    };

    const handleAddWinner = (participant: typeof mockRegisteredClients[0]) => {
        if (winners.length >= selectedPromotion.slotsAvailable) {
            toast({
                title: "Xatolik",
                description: "G'oliblar soni to'liq",
                variant: "destructive"
            });
            return;
        }
        if (winners.find(w => w.id === participant.id)) {
            toast({
                title: "Xatolik",
                description: "Bu ishtirokchi allaqachon g'olib bo'lgan",
                variant: "destructive"
            });
            return;
        }
        setWinners([...winners, participant]);
        setIsAddWinnerOpen(false);
        toast({
            title: "G'olib qo'shildi",
            description: `${participant.name} g'oliblar ro'yxatiga qo'shildi`,
        });
    };

    const handleShuffle = () => {
        if (participants.length === 0) {
            toast({
                title: "Xatolik",
                description: "Ishtirokchilar yo'q",
                variant: "destructive"
            });
            return;
        }

        setIsShuffling(true);
        const remainingSlots = selectedPromotion.slotsAvailable - winners.length;

        if (remainingSlots <= 0) {
            setIsShuffling(false);
            toast({
                title: "Diqqat",
                description: "Barcha g'oliblar o'rinlari band",
                variant: "warning"
            });
            return;
        }

        let shuffleCount = 0;
        const shuffleInterval = setInterval(() => {
            const availableParticipants = participants.filter(p => !winners.find(w => w.id === p.id));

            const randomWinners = [...availableParticipants]
                .sort(() => Math.random() - 0.5)
                .slice(0, remainingSlots);

            shuffleCount++;

            if (shuffleCount >= 10) {
                clearInterval(shuffleInterval);
                setIsShuffling(false);
                setWinners(prev => [...prev, ...randomWinners]);
                toast({
                    title: "G'oliblar aniqlandi!",
                    description: `Qo'shimcha ${randomWinners.length} ta g'olib tanlandi`,
                });
            }
        }, 150);
    };

    const handleConfirmWinners = () => {
        setIsConfirmOpen(false);

        // Mock progress for winners
        const initialProgress: any = {};
        winners.forEach((w, i) => {
            // Simulate different stages for demo
            if (i === 0) initialProgress[w.id] = { status: 'booked', date: '2026-02-15 14:00' };
            else if (i === 1) initialProgress[w.id] = { status: 'feedback_given', rating: 5, feedback: "Ajoyib xizmat! Rahmat." };
            else initialProgress[w.id] = { status: 'booked', date: 'Tanlanmoqda...' };
        });
        setWinnerProgress(initialProgress);

        toast({
            title: "Muvaffaqiyatli yuborildi!",
            description: `Biznes egasi va ${winners.length} ta g'olibga xabarnoma yuborildi`,
            className: "bg-green-600 text-white border-green-700"
        });

        // Change status to 'fulfillment' (Xizmat ko'rsatish jarayoni)
        handleStatusChange(selectedPromotion.id, 'fulfillment');
    };

    const filteredPromotions = promotions.filter(p =>
        p.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.salonName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredClients = mockRegisteredClients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(clientSearch.toLowerCase())
    );

    const getPromotionIcon = (type: string | undefined) => {
        switch (type) {
            case 'lottery': return <Gift className="w-5 h-5" />;
            case '1+1': return <Plus className="w-5 h-5" />;
            case 'discount': return <Percent className="w-5 h-5" />;
            default: return <Tag className="w-5 h-5" />;
        }
    };

    const getPromotionLabel = (type: string | undefined) => {
        switch (type) {
            case 'lottery': return "Lotereya";
            case '1+1': return "1+1 Aksiya";
            case 'discount': return "Chegirma";
            default: return "Bepul / Oddiy";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">Faol</span>;
            case 'pending': return <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">Kutilmoqda</span>;
            case 'fulfillment': return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Jarayonda</span>;
            case 'completed': return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">Yakunlangan</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Aksiyalar</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Qidirish..."
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Promotion Selection */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Aksiyani tanlang</h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {filteredPromotions.map((promo) => (
                            <motion.button
                                key={promo.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedPromotion(promo);
                                    setWinners([]);
                                    setWinnerProgress({});
                                    // Reset participants for demo purposes when switching
                                    setParticipants(mockRegisteredClients.slice(0, 5));
                                }}
                                className="w-full"
                            >
                                <Card className={`p-3 flex items-center justify-between ${selectedPromotion.id === promo.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            <img src={promo.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm line-clamp-1">{promo.serviceName}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                                                    {getPromotionLabel(promo.promotionType)}
                                                </span>
                                                {getStatusBadge(promo.status)}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedPromotion.id === promo.id && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </Card>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Detail Section */}
                <Card className="overflow-hidden border-primary/20">
                    <div className="h-32 bg-secondary relative">
                        <img src={selectedPromotion.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <div className="text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                                        {getPromotionLabel(selectedPromotion.promotionType)}
                                    </span>
                                    {selectedPromotion.status === 'pending' && (
                                        <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Tasdiqlash kutilmoqda
                                        </span>
                                    )}
                                    {selectedPromotion.status === 'fulfillment' && (
                                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Jarayonda
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold leading-tight">{selectedPromotion.serviceName}</h3>
                                <p className="text-white/80 text-sm">{selectedPromotion.salonName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Description */}
                        <div>
                            <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Tavsif
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {selectedPromotion.serviceDescription}
                            </p>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{selectedPromotion.startsAt} — {selectedPromotion.endsAt || "Cheksiz"}</span>
                            </div>
                        </div>

                        {/* Price Info */}
                        <div className="bg-secondary/30 p-3 rounded-lg flex items-center justify-between">
                            <span className="text-sm font-medium">Narxi:</span>
                            <div className="text-right">
                                {selectedPromotion.promotionType === 'discount' ? (
                                    <>
                                        <span className="text-xs text-muted-foreground line-through block">{selectedPromotion.originalPrice} so'm</span>
                                        <span className="text-lg font-bold text-red-500">{selectedPromotion.discountedPrice} so'm</span>
                                    </>
                                ) : selectedPromotion.promotionType === '1+1' ? (
                                    <span className="text-lg font-bold text-primary">1+1 (Bepul)</span>
                                ) : selectedPromotion.originalPrice === 0 ? (
                                    <span className="text-lg font-bold text-green-600">Bepul</span>
                                ) : (
                                    <span className="text-lg font-bold">{selectedPromotion.originalPrice} so'm</span>
                                )}
                            </div>
                        </div>

                        {/* Lottery Specific Info */}
                        {selectedPromotion.promotionType === 'lottery' && (
                            <div className="mt-2">
                                <div className="flex justify-center gap-4 text-sm mb-3">
                                    <div className="bg-background px-3 py-1 rounded-full border shadow-sm">
                                        Ishtirokchilar: <strong>{participants.length}</strong>
                                    </div>
                                    <div className="bg-background px-3 py-1 rounded-full border shadow-sm">
                                        G'oliblar soni: <strong>{selectedPromotion.slotsAvailable}</strong>
                                    </div>
                                </div>

                                {/* Add Participant Button */}
                                {selectedPromotion.status === 'active' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="border-dashed border-primary/50 text-primary hover:bg-primary/5">
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Ishtirokchi
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Ishtirokchi qo'shish</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 pt-4">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Mijozni qidirish..."
                                                            className="pl-9"
                                                            value={clientSearch}
                                                            onChange={(e) => setClientSearch(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                                        {filteredClients.map(client => (
                                                            <div key={client.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                                        <User className="w-4 h-4 text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm">{client.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{client.email}</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleAddParticipant(client)}
                                                                    disabled={participants.some(p => p.id === client.id)}
                                                                >
                                                                    {participants.some(p => p.id === client.id) ? (
                                                                        <Check className="w-4 h-4 text-green-500" />
                                                                    ) : (
                                                                        <Plus className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={isAddWinnerOpen} onOpenChange={setIsAddWinnerOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="border-dashed border-yellow-500/50 text-yellow-600 hover:bg-yellow-50">
                                                    <Crown className="w-4 h-4 mr-2" />
                                                    G'olib
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>G'olibni tanlash</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 pt-4">
                                                    <p className="text-sm text-muted-foreground">
                                                        Ishtirokchilar orasidan g'olibni tanlang:
                                                    </p>
                                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                                        {participants.map(participant => (
                                                            <div key={participant.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                                        <User className="w-4 h-4 text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm">{participant.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{participant.email}</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleAddWinner(participant)}
                                                                    disabled={winners.some(w => w.id === participant.id)}
                                                                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                                                >
                                                                    {winners.some(w => w.id === participant.id) ? (
                                                                        <Check className="w-4 h-4" />
                                                                    ) : (
                                                                        <Crown className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Approval Actions */}
                        {selectedPromotion.status === 'pending' && (
                            <div className="pt-4 border-t flex gap-3">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(selectedPromotion.id, 'active')}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Tasdiqlash
                                </Button>
                                <Button className="flex-1" variant="destructive" onClick={() => handleStatusChange(selectedPromotion.id, 'rejected')}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rad etish
                                </Button>
                            </div>
                        )}

                        {/* Lottery Controls */}
                        {selectedPromotion.promotionType === 'lottery' && selectedPromotion.status === 'active' && (
                            <Button
                                variant="coral"
                                className="w-full h-12 text-lg shadow-lg shadow-primary/20 mt-2"
                                onClick={handleShuffle}
                                disabled={isShuffling || winners.length >= selectedPromotion.slotsAvailable}
                            >
                                <Shuffle className={`w-5 h-5 mr-2 ${isShuffling ? 'animate-spin' : ''}`} />
                                {isShuffling ? "Tanlanmoqda..." :
                                    winners.length >= selectedPromotion.slotsAvailable ? "Barcha g'oliblar aniqlandi" :
                                        "Qolgan g'oliblarni aniqlash"}
                            </Button>
                        )}

                        {/* Confirm Winners Button */}
                        {selectedPromotion.promotionType === 'lottery' && winners.length > 0 && selectedPromotion.status === 'active' && (
                            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">
                                        <Send className="w-4 h-4 mr-2" />
                                        G'oliblarni tasdiqlash va Xabar yuborish
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>G'oliblarni tasdiqlash</DialogTitle>
                                        <DialogDescription>
                                            Siz {winners.length} ta g'olibni tasdiqlamoqchisiz.
                                            Tasdiqlashdan so'ng:
                                            <ul className="list-disc pl-4 mt-2 space-y-1">
                                                <li>Biznes egasiga xabarnoma yuboriladi</li>
                                                <li>Barcha g'oliblarga SMS/Push xabar yuboriladi</li>
                                                <li>Aksiya statusi "Jarayonda" ga o'zgaradi</li>
                                                <li>G'oliblar xizmatga yozilishlari mumkin bo'ladi</li>
                                            </ul>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Bekor qilish</Button>
                                        <Button onClick={handleConfirmWinners} className="bg-green-600 hover:bg-green-700">
                                            Tasdiqlash
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {selectedPromotion.status === 'fulfillment' && (
                            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-200">
                                <div className="flex items-center gap-2 font-medium mb-1">
                                    <Info className="w-4 h-4" />
                                    Xizmat ko'rsatish jarayoni
                                </div>
                                <p className="text-xs opacity-90">
                                    G'oliblar aniqlandi. Endi ular xizmatga yozilishlari va xizmatdan so'ng fikr bildirishlari kutilmoqda.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Winners List with Progress */}
                {selectedPromotion.promotionType === 'lottery' && winners.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-lg font-semibold">G'oliblar ro'yxati</h2>
                        </div>
                        <div className="space-y-2">
                            {winners.map((winner, index) => {
                                const progress = winnerProgress[winner.id];
                                return (
                                    <motion.div
                                        key={winner.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="p-3 bg-yellow-50/50 border-yellow-200">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{winner.name}</p>
                                                    <p className="text-xs text-muted-foreground">{winner.email}</p>
                                                </div>
                                                <Trophy className="w-4 h-4 text-yellow-500" />
                                            </div>

                                            {/* Progress Status */}
                                            {selectedPromotion.status === 'fulfillment' && (
                                                <div className="mt-2 pt-2 border-t border-yellow-200/50 text-xs">
                                                    {progress?.status === 'booked' ? (
                                                        <div className="flex items-center gap-2 text-blue-600">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>Band qilindi: {progress.date}</span>
                                                        </div>
                                                    ) : progress?.status === 'feedback_given' ? (
                                                        <div>
                                                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                <span>Xizmat yakunlandi</span>
                                                            </div>
                                                            <div className="bg-white/50 p-2 rounded border border-yellow-200">
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                    <span className="font-bold">{progress.rating}</span>
                                                                </div>
                                                                <p className="italic text-muted-foreground">"{progress.feedback}"</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Vaqt tanlanmoqda...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div >
    );
};

export default AdminPromotions;
