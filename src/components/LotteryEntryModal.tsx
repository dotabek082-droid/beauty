import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Gift, Calendar, Users, AlertCircle, Coins, Loader2, LogIn, PlusCircle, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Promotion } from "@/data/promotionData";
import { generateId, addLotteryEntry, hasUserEntered, isUserBlocked } from "@/data/lotteryData";
import { PromotionEntry } from "@/types/lottery";
import { getCoinBalance, deductCoins, addCoins } from "@/utils/coinBalance";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface LotteryEntryModalProps {
    promotion: Promotion;
    isOpen: boolean;
    onClose: () => void;
    readOnly?: boolean;
    booking?: any;
    onBook?: (date: string, time: string) => void;
}

const LotteryEntryModal = (props: LotteryEntryModalProps) => {
    const { promotion, isOpen, onClose, readOnly } = props;
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coinBalance, setCoinBalance] = useState(0);


    const MIN_TRUST_SCORE = 80;

    useEffect(() => {
        if (isOpen && user) {
            updateBalance();
            if (profile) {
                setUserName(profile.full_name || "");
                setUserPhone(profile.phone || "");
            }
        }
    }, [isOpen, user, profile]);


    // Safe Property Access Adapter
    const safePromotion = promotion ? {
        id: promotion.id,
        imageUrl: promotion.imageUrl || (promotion as any).image_url || "/placeholder.svg",
        serviceName: promotion.serviceName || (promotion as any).service_name || "Xizmat",
        salonName: promotion.salonName || (promotion as any).salon_name || "Salon",
        serviceDescription: promotion.serviceDescription || (promotion as any).service_description || "Tavsif yo'q",
        originalPrice: promotion.originalPrice ?? (promotion as any).original_price ?? 0,
        currentEntries: promotion.currentEntries ?? (promotion as any).current_entries ?? 0,
        totalWinners: promotion.totalWinners ?? (promotion as any).total_winners ?? 1,
        entryDeadline: promotion.entryDeadline || (promotion as any).entry_deadline || new Date().toISOString(),
        winnerSelectionDate: promotion.winnerSelectionDate || (promotion as any).winner_selection_date || new Date().toISOString(),
        reviewDeadlineHours: promotion.reviewDeadlineHours ?? (promotion as any).review_deadline_hours ?? 48,
        lotteryEnabled: promotion.lotteryEnabled ?? (promotion as any).lottery_enabled ?? ((promotion as any).promotion_type === 'lottery'),
        promotionType: promotion.promotionType || (promotion as any).promotion_type || 'regular',
        qrRequired: promotion.qrRequired ?? true,
        ticketPrice: promotion.ticketPrice ?? (promotion as any).ticket_price ?? 0 // Default to 0, override for lottery
    } : null;

    if (!safePromotion) return null;

    // Logic to determine cost and type
    const isLottery = safePromotion.lotteryEnabled || safePromotion.promotionType === 'lottery';
    const finalTicketPrice = isLottery ? (safePromotion.ticketPrice > 0 ? safePromotion.ticketPrice : 120) : 0; // Only lotteries cost coins by default

    if (!isOpen) return null;

    const updateBalance = () => {
        if (user) {
            const balance = getCoinBalance(user.id);
            setCoinBalance(balance);
        }
    };

    const handleTestAddCoins = () => {
        if (!user) return;
        addCoins(user.id, 10000, 'daily_login', 'Test: Bonus Coins');
        toast.success("Test: 10,000 tanga qo'shildi!");
        updateBalance();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!userName.trim()) {
            toast.error("Ismingizni kiriting");
            return;
        }

        if (!userPhone.trim()) {
            toast.error("Telefon raqamingizni kiriting");
            return;
        }

        if (!agreed) {
            toast.error("Shartlarga rozilik bildiring");
            return;
        }

        if (user && isUserBlocked(user.id)) {
            toast.error("Siz bloklangansiz. Avvalgi sharhni yuboring!");
            return;
        }

        // Check trust score
        if ((profile?.trust_score || 0) < MIN_TRUST_SCORE) {
            toast.error(`Reytingingiz past! Ishtirok etish uchun reytingingiz ${MIN_TRUST_SCORE} yoki undan yuqori bo'lishi kerak.`);
            return;
        }

        // Check if already entered
        if (user && hasUserEntered(user.id, promotion.id)) {
            toast.error(isLottery ? "Siz allaqachon bilet olgansiz!" : "Siz allaqachon ro'yxatdan o'tgansiz!");
            return;
        }

        // Check coin balance (only if price > 0)
        const currentBalance = user ? getCoinBalance(user.id) : 0;
        if (finalTicketPrice > 0 && currentBalance < finalTicketPrice) {
            toast.error(`Yetarli tanga yo'q! Sizda ${currentBalance} tanga bor, ${finalTicketPrice} tanga kerak.`);
            return;
        }

        setIsSubmitting(true);

        try {
            if (!user) return; // Should be handled by early return in render

            // Create entry
            const entry: PromotionEntry = {
                id: generateId(),
                userId: user.id,
                userName: userName.trim(),
                userPhone: userPhone.trim(),
                promotionId: promotion.id,
                enteredAt: new Date(),
                status: isLottery ? "pending" : "approved", // Auto-approve non-lotteries for now (or 'booking_pending')
            };

            // Add to lottery/promotion DB
            addLotteryEntry(entry);

            // Deduct coins ONLY if applicable
            if (finalTicketPrice > 0) {
                const deducted = deductCoins(
                    user.id,
                    finalTicketPrice,
                    `Aksiya ishtirok: ${safePromotion?.serviceName}`
                );

                if (!deducted) {
                    throw new Error("Tangalarni yechishda xatolik");
                }
            }

            // Update promotion entry count
            // promotion.currentEntries += 1; // Direct mutation is risky with mixed types, relying on state update or reload

            toast.success(isLottery ? "Muvaffaqiyatli bilet sotib oldingiz!" : "Muvaffaqiyatli ro'yxatdan o'tdingiz!");

            setTimeout(() => {
                setIsSubmitting(false);

                // For non-lottery (direct booking), trigger the onBook callback to refresh parent data
                if (!isLottery && props.onBook) {
                    props.onBook(new Date().toISOString().split('T')[0], "00:00");
                } else {
                    onClose();
                }
            }, 1000);

        } catch (error) {
            console.error(error);
            toast.error("Xatolik yuz berdi");
            setIsSubmitting(false);
        }
    };

    // Read Only View (for My Registrations)
    if (props.readOnly) {
        if (!safePromotion) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-xl font-bold">Aksiya Tafsilotlari</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-4">
                            <img
                                src={safePromotion.imageUrl}
                                alt={safePromotion.serviceName}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-bold text-lg">{safePromotion.serviceName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{safePromotion.salonName}</p>
                            <p className="text-sm text-gray-700">{safePromotion.serviceDescription}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-2xl font-bold text-success">
                                    {safePromotion.originalPrice === 0 ? "BEPUL" : "CHEGIRMA"}
                                </span>
                                {safePromotion.originalPrice > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {safePromotion.originalPrice.toLocaleString()} so'm
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Status Message */}
                            <div className={`border rounded-lg p-4 flex gap-3 ${props.booking?.status === 'won' || props.booking?.status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' :
                                props.booking?.status === 'lost' ? 'bg-red-50 border-red-200 text-red-800' :
                                    props.booking?.status === 'pending' || props.booking?.status === 'booking_pending' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                        'bg-green-50 border-green-200 text-green-800'
                                }`}>
                                {props.booking?.status === 'won' || props.booking?.status === 'approved' ? <Gift className="w-5 h-5 flex-shrink-0" /> :
                                    props.booking?.status === 'lost' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> :
                                        <Clock className="w-5 h-5 flex-shrink-0" />}

                                <p className="text-sm font-medium">
                                    {props.booking?.status === 'won' ? "Tabriklaymiz! Siz g'olib bo'ldingiz!" :
                                        props.booking?.status === 'approved' ? "Sizning yutug'ingiz tasdiqlandi!" :
                                            props.booking?.status === 'lost' ? "Afsuski, bu safar omadingiz kelmadi." :
                                                props.booking?.status === 'pending' ? "Natija kutilmoqda. G'oliblar tez orada aniqlanadi." :
                                                    props.booking?.status === 'booking_pending' ? "So'rovingiz ko'rib chiqilmoqda." :
                                                        isLottery ? "Siz ushbu aksiyada ishtirok etmoqdasiz!" : "Siz muvaffaqiyatli ro'yxatdan o'tgansiz!"}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <span>Oxirgi muddat: <strong>{new Date(safePromotion.entryDeadline).toLocaleDateString('uz-UZ')}</strong></span>
                            </div>

                            {isLottery && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <span>G'oliblar e'lon qilinadi: <strong>{new Date(safePromotion.winnerSelectionDate).toLocaleDateString('uz-UZ')}</strong></span>
                                </div>
                            )}
                        </div>

                        <div className="pt-2 space-y-3">
                            {/* Booking Flow for Winners */}
                            {props.booking?.status === 'won' && !props.booking?.booking_details && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                                    <h4 className="font-semibold text-blue-900">Xizmat vaqtini belgilash</h4>
                                    <p className="text-xs text-blue-700">
                                        Yutuqdan foydalanish uchun o'zingizga qulay vaqtni tanlang va so'rov yuboring.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Sana</label>
                                            <input
                                                type="date"
                                                className="w-full text-sm p-2 border rounded-md"
                                                id="booking-date"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Vaqt</label>
                                            <input
                                                type="time"
                                                className="w-full text-sm p-2 border rounded-md"
                                                id="booking-time"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => {
                                            const date = (document.getElementById('booking-date') as HTMLInputElement).value;
                                            const time = (document.getElementById('booking-time') as HTMLInputElement).value;
                                            if (!date || !time) {
                                                toast.error("Iltimos, sana va vaqtni tanlang");
                                                return;
                                            }
                                            if (props.onBook) {
                                                props.onBook(date, time);
                                            }
                                        }}
                                    >
                                        So'rov yuborish
                                    </Button>
                                </div>
                            )}

                            {/* Pending Approval State */}
                            {props.booking?.status === 'booking_pending' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                    <h4 className="font-semibold text-yellow-900">Tasdiq kutilmoqda</h4>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        Sizning so'rovingiz biznes egasiga yuborildi. Tasdiqlangandan so'ng QR kod paydo bo'ladi.
                                    </p>
                                </div>
                            )}

                            {/* Approved Booking Details */}
                            {props.booking?.status === 'approved' && props.booking?.booking_details && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Tasdiqlangan Vaqt
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <p className="text-xs text-green-700">Sana</p>
                                            <p className="font-medium text-green-900">{props.booking.booking_details.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-700">Vaqt</p>
                                            <p className="font-medium text-green-900">{props.booking.booking_details.time}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Approved / QR Code State / Default QR */}
                            {(props.booking?.status === 'approved' || (safePromotion.qrRequired && !['won', 'booking_pending', 'lost'].includes(props.booking?.status || ''))) && (
                                <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${safePromotion.id}-${user?.id}`}
                                        alt="QR Code"
                                        className="w-32 h-32 mb-2"
                                    />
                                    <p className="text-xs text-center text-muted-foreground font-mono">
                                        {safePromotion.id.split('-')[1]}-{user?.id?.substring(0, 6).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-center text-green-600 font-medium mt-1">
                                        Biznes egasiga ko'rsating
                                    </p>
                                </div>
                            )}
                            <Button onClick={(e) => { e.preventDefault(); onClose(); }} className="w-full" type="button">Yopish</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isOpen || !safePromotion) return null;

    const handleLogin = () => {
        onClose();
        navigate("/auth");
    };

    if (!user) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Tizimga kiring</h2>
                    <p className="text-gray-600">
                        Aksiyada ishtirok etish uchun oldin tizimga kirishingiz kerak.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Bekor qilish
                        </Button>
                        <Button className="flex-1" onClick={handleLogin}>
                            Kirish
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold">
                        {isLottery ? "Lotereya bileti olish" :
                            safePromotion.promotionType === 'discount' ? "Chegirma olish" :
                                safePromotion.promotionType === '1+1' ? "Aksiyada qatnashish" :
                                    safePromotion.promotionType === 'free' ? "Bepul xizmatga yozilish" : "Ishtirok etish"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Trust Score Requirement - Moved to Top */}
                    <div className={`border rounded-xl p-4 flex items-center justify-between ${(profile?.trust_score || 0) >= MIN_TRUST_SCORE ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${(profile?.trust_score || 0) >= MIN_TRUST_SCORE ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`text-sm font-semibold ${(profile?.trust_score || 0) >= MIN_TRUST_SCORE ? 'text-green-800' : 'text-red-800'}`}>
                                    Reyting talabi: {MIN_TRUST_SCORE}+
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Sizning reytingingiz: <strong>{profile?.trust_score || 0}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            {(profile?.trust_score || 0) >= MIN_TRUST_SCORE ? (
                                <span className="text-green-600 font-bold text-sm">Mos keladi</span>
                            ) : (
                                <span className="text-red-600 font-bold text-sm">Past</span>
                            )}
                        </div>
                    </div>

                    {/* Coin Cost Info - Show only if cost > 0 */}
                    {finalTicketPrice > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <Coins className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Ishtirok narxi</p>
                                    <p className="text-xs text-muted-foreground">Sizning balansingiz: {coinBalance.toLocaleString()} tanga</p>
                                </div>
                            </div>
                            <div className="text-right z-10">
                                <p className="text-2xl font-bold text-amber-600">{finalTicketPrice}</p>
                                <p className="text-xs text-muted-foreground">tanga</p>
                            </div>
                        </div>
                    )}

                    {/* Promotion Info */}
                    <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-4">
                        <img
                            src={safePromotion.imageUrl}
                            alt={safePromotion.serviceName}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-bold text-lg">{safePromotion.serviceName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{safePromotion.salonName}</p>
                        <p className="text-sm text-gray-700">{safePromotion.serviceDescription}</p>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-2xl font-bold text-success">
                                {safePromotion.originalPrice === 0 || safePromotion.promotionType === 'free' ? "BEPUL" : "CHEGIRMA"}
                            </span>
                            {safePromotion.originalPrice > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                    {safePromotion.originalPrice.toLocaleString()} so'm
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Lottery Info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <span>
                                <strong>{safePromotion.currentEntries}</strong> kishi ishtirok etmoqda
                            </span>
                        </div>
                        {isLottery && (
                            <div className="flex items-center gap-2 text-sm">
                                <Gift className="w-4 h-4 text-success" />
                                <span>
                                    <strong>{safePromotion.totalWinners}</strong> ta g'olib tanlanadi
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>
                                Oxirgi muddat:{" "}
                                <strong>
                                    {new Date(safePromotion.entryDeadline).toLocaleDateString('uz-UZ')}
                                </strong>
                            </span>
                        </div>
                        {isLottery && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span>
                                    G'oliblar e'lon qilinadi:{" "}
                                    <strong>
                                        {new Date(safePromotion.winnerSelectionDate).toLocaleDateString('uz-UZ')}
                                    </strong>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                            <p className="font-semibold mb-1">Diqqat!</p>
                            <p className="mb-2">
                                {isLottery
                                    ? "Agar siz g'olib bo'lsangiz va xizmatdan foydalansangiz, xizmat tugagandan keyin 48 soat ichida sharh qoldirish, rasm yuklash va 10 ta savolga javob berish MAJBURIY!"
                                    : "Xizmatdan foydalangandan so'ng 48 soat ichida sharh qoldirish MAJBURIY!"}
                            </p>
                            <p>
                                Sharh qoldirmasangiz, keyingi aksiyalarda ishtirok eta olmaysiz (bloklangan bo'lasiz).
                            </p>
                        </div>
                    </div>

                    {/* Entry Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Contact Info Confirmation (Read-only by default if data exists) */}
                        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-semibold text-foreground">Aloqa ma'lumotlari</h4>
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-primary"
                                    onClick={() => {
                                        // Simple toggle logic could be added here if needed
                                    }}
                                >
                                </Button>
                            </div>

                            <div className="grid gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground block mb-1">Ismingiz</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none py-1 text-sm font-medium"
                                        placeholder="Ismingiz"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground block mb-1">Telefon raqam</label>
                                    <input
                                        type="tel"
                                        value={userPhone}
                                        onChange={(e) => setUserPhone(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none py-1 text-sm font-medium"
                                        placeholder="+998..."
                                        required
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                * {isLottery ? "G'olib bo'lsangiz" : "Tasdiqlansa"}, ushbu ma'lumotlar orqali bog'lanamiz.
                            </p>
                        </div>

                        {/* Agreement Checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                required
                            />
                            <span className="text-sm text-gray-700">
                                Men shartlarga roziman: Xizmatdan foydalansam, 48 soat ichida sharh qoldiraman. Aks holda, keyingi aksiyalarda ishtirok eta olmasligimni tushunaman.
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !agreed || (finalTicketPrice > 0 && coinBalance < finalTicketPrice) || (profile?.trust_score || 0) < MIN_TRUST_SCORE}
                            className={`w-full text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 ${safePromotion.promotionType === 'free' ? 'bg-green-600 hover:bg-green-700' :
                                safePromotion.promotionType === '1+1' ? 'bg-blue-600 hover:bg-blue-700' :
                                    'bg-primary hover:bg-primary/90'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Yuborilmoqda...
                                </>
                            ) : finalTicketPrice > 0 ? (
                                <>
                                    <Coins className="w-5 h-5" />
                                    {coinBalance < finalTicketPrice ? "Yetarli tanga yo'q" : `${finalTicketPrice} tanga bilan ishtirok etish`}
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    {safePromotion.promotionType === 'discount' ? "Chegirma olish" :
                                        safePromotion.promotionType === '1+1' ? "Aksiyaga yozilish" :
                                            safePromotion.promotionType === 'free' ? "Bepul olish" : "Tasdiqlash"}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LotteryEntryModal;
