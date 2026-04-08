import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, MapPin, CheckCircle2, Camera, Star, AlertCircle, Loader2, QrCode, CreditCard, Wallet, Banknote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Promotion, mockFeedbackQuestions } from "@/data/promotionData";
import { usePromotionRegistration } from "@/hooks/usePromotionRegistration";
import { useAuth } from "@/contexts/AuthContext";
import AddCardDialog from "@/components/AddCardDialog";

interface PromotionBookingModalProps {
  promotion: Promotion | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "confirm" | "payment" | "booked" | "feedback" | "already-registered";
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_month: string;
  expiry_year: string;
  card_type: string;
  is_default: boolean;
  added_at: string;
  balance?: number;
}

const PromotionBookingModal = ({ promotion, isOpen, onClose }: PromotionBookingModalProps) => {
  const { user } = useAuth();
  const { isRegistered, isLoading, register } = usePromotionRegistration(promotion?.id || null);
  const [step, setStep] = useState<Step>("confirm");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cash");
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  // Reset step when modal opens and check registration status
  useEffect(() => {
    if (isOpen && promotion) {
      if (isRegistered) {
        setStep("already-registered");
      } else {
        setStep("confirm");
      }
    }
  }, [isOpen, isRegistered, promotion]);

  // Load cards
  useEffect(() => {
    if (user && isOpen) {
      loadCards();
    }
  }, [user, isOpen]);

  const loadCards = () => {
    if (!user) return;
    const storedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
    let userCards = storedCards[user.id]?.cards || [];

    // Inject specific demo card if not present (same as PaymentCardsPage)
    const demoCardExists = userCards.some((c: PaymentCard) => c.card_number.includes('1234') && c.card_holder === 'BIZNES EGASI');

    if (!demoCardExists) {
      const demoCard: PaymentCard = {
        id: 'demo-card-123',
        card_number: '8600 **** **** 1234',
        card_holder: 'BIZNES EGASI',
        expiry_month: '12',
        expiry_year: '28',
        card_type: 'uzcard',
        is_default: true,
        added_at: new Date().toISOString(),
        balance: 5000000
      };
      userCards = [demoCard, ...userCards];
      if (!storedCards[user.id]) storedCards[user.id] = {};
      storedCards[user.id].cards = userCards;
      localStorage.setItem('user_payment_cards', JSON.stringify(storedCards));
    }

    // Ensure balance exists
    userCards = userCards.map((card: PaymentCard) => ({
      ...card,
      balance: card.balance !== undefined ? card.balance : Math.floor(Math.random() * 1000000)
    }));

    setCards(userCards);

    // Select default card if available
    const defaultCard = userCards.find((c: PaymentCard) => c.is_default);
    if (defaultCard) {
      setSelectedCardId(defaultCard.id);
    } else if (userCards.length > 0) {
      setSelectedCardId(userCards[0].id);
    }
  };

  const handleBook = async () => {
    if (!user) {
      toast.error("Iltimos, avval tizimga kiring");
      return;
    }

    // If there is a price to pay (discountedPrice > 0), show payment step first
    if (promotion?.discountedPrice && promotion.discountedPrice > 0 && step !== "payment") {
      setStep("payment");
      return;
    }

    setIsSubmitting(true);

    // Fake payment simulation
    if (step === "payment") {
      if (selectedPaymentMethod === "card") {
        if (!selectedCardId) {
          toast.error("Iltimos, to'lov kartasini tanlang");
          setIsSubmitting(false);
          return;
        }

        const selectedCard = cards.find(c => c.id === selectedCardId);
        const price = promotion?.discountedPrice || 0;

        if (selectedCard && (selectedCard.balance || 0) < price) {
          toast.error("Mablag' yetarli emas", {
            description: `Kartangizda ${(selectedCard.balance || 0).toLocaleString()} so'm mavjud`
          });
          setIsSubmitting(false);
          return;
        }

        toast.loading("Karta orqali to'lanmoqda...", {
          duration: 2000,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Deduct balance
        if (selectedCard) {
          const storedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
          const userCards = storedCards[user.id]?.cards || [];
          const updatedCards = userCards.map((c: PaymentCard) => {
            if (c.id === selectedCard.id) {
              return { ...c, balance: (c.balance || 0) - price };
            }
            return c;
          });
          storedCards[user.id].cards = updatedCards;
          localStorage.setItem('user_payment_cards', JSON.stringify(storedCards));

          // Add transaction record
          const storedTransactions = JSON.parse(localStorage.getItem('user_transactions') || '{}');
          const userTransactions = storedTransactions[user.id] || [];
          userTransactions.push({
            id: crypto.randomUUID(),
            amount: -price,
            type: 'payment',
            description: promotion?.serviceName || "Xizmat uchun to'lov",
            date: new Date().toISOString(),
            status: 'success'
          });
          storedTransactions[user.id] = userTransactions;
          localStorage.setItem('user_transactions', JSON.stringify(storedTransactions));
        }

      } else if (selectedPaymentMethod === "click") {
        toast.loading("To'lov tizimiga yo'naltirilmoqda...", {
          duration: 2000,
        });
      }

      if (selectedPaymentMethod === "card" || selectedPaymentMethod === "click") {
        if (selectedPaymentMethod === "click") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        toast.dismiss();
        toast.success("To'lov muvaffaqiyatli amalga oshirildi!");
      }
    }

    // Pass ticket price for deduction
    const result = await register(promotion?.ticketPrice || 0);
    setIsSubmitting(false);

    if (result.success) {
      setStep("booked");
      setBookingTime(new Date().toLocaleString());
      if (promotion?.isCharity) {
        toast.success("Ro'yxatdan o'tish muvaffaqiyatli!", {
          description: "QR kodni saqlab qo'ying va biznes egasiga ko'rsating."
        });
      } else if (promotion?.discountedPrice && promotion.discountedPrice > 0) {
        // Already showed payment success toast
      } else {
        toast.success("Siz muvaffaqiyatli ro'yxatdan o'tdingiz!");
      }
    } else {
      if (result.error?.includes("allaqachon")) {
        setStep("already-registered");
      }
      toast.error(result.error || "Xatolik yuz berdi");
    }
  };

  const handleStartFeedback = () => {
    setStep("feedback");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (questionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmitFeedback = () => {
    if (!photoPreview) {
      toast.error("Iltimos, xizmat natijasi rasmini yuklang");
      return;
    }

    const unansweredQuestions = mockFeedbackQuestions.filter(
      (q) => !ratings[q.id]
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Iltimos, barcha savollarga javob bering");
      return;
    }

    if (overallRating === 0) {
      toast.error("Iltimos, umumiy bahoingizni bering");
      return;
    }

    toast.success("Fikr-mulohazangiz uchun rahmat!");
    handleClose();
  };

  const handleClose = () => {
    setStep("confirm");
    setRatings({});
    setOverallRating(0);
    setComments("");
    setPhotoPreview(null);
    onClose();
  };

  if (!promotion) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {step === "confirm" && (promotion.promotionType === "1+1" ? "1+1 Aksiya" : (promotion.discountedPrice !== undefined && promotion.discountedPrice > 0 ? "Chegirma olish" : "Bepul xizmat"))}
                {step === "payment" && "To'lov turi"}
                {step === "booked" && "Tabriklaymiz!"}
                {step === "feedback" && "Fikr-mulohaza"}
                {step === "already-registered" && "Ro'yxatdan o'tilgan"}
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {step === "confirm" && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={promotion.imageUrl}
                      alt={promotion.serviceName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`${promotion.promotionType === "1+1" ? "bg-purple-600 text-white" : (promotion.discountedPrice === 0 ? "bg-success text-success-foreground" : "bg-blue-600 text-white")} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                        <Gift className="w-4 h-4" />
                        {promotion.promotionType === "1+1" ? "1+1 AKSIYA" : (promotion.discountedPrice === 0 ? "BEPUL" : "CHEGIRMA")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">{promotion.serviceName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{promotion.salonName}</span>
                    </div>
                  </div>



                  <Card className="p-4 bg-secondary/50">
                    <p className="text-sm text-muted-foreground">
                      {promotion.serviceDescription}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg line-through text-muted-foreground">
                          {promotion.originalPrice.toLocaleString()} so'm
                        </span>
                        <span className="text-2xl font-bold text-success">
                          {(promotion.discountedPrice !== undefined ? promotion.discountedPrice : 0).toLocaleString()} so'm
                        </span>
                      </div>

                      {promotion.ticketPrice > 0 && (
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">Kirish narxi</span>
                          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-500">{promotion.ticketPrice} tanga</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {!promotion.isCharity && (
                    <Card className="p-4 border-primary/20 bg-primary/5">
                      <h4 className="font-semibold text-foreground mb-2">Shartlar:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          Xizmatdan so'ng rasm bilan fikr-mulohaza qoldirish majburiy
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          10 ta savolga javob berishingiz kerak
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          Kirish narxi: {promotion.ticketPrice > 0 ? `${promotion.ticketPrice} tanga` : "Tekin"}
                        </li>
                      </ul>
                    </Card>
                  )}

                  {promotion.isCharity && (
                    <Card className="p-4 border-primary/20 bg-primary/5">
                      <h4 className="font-semibold text-foreground mb-2">Eslatma:</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ushbu xizmat ijtimoiy yordam sifatida taqdim etilmoqda.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          Ro'yxatdan o'ting
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          Joyiga borib QR kodni ko'rsating
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          Nonni olib ketishingiz mumkin
                        </li>
                      </ul>
                    </Card>
                  )}
                </div>

              )}

              {step === "already-registered" && (
                <div className="space-y-4">
                  <Card className="p-4 bg-amber-500/10 border-amber-500/30 flex flex-col items-center animate-in fade-in transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-amber-800 dark:text-amber-500">Siz allaqachon ro'yxatdan o'tgansiz!</p>
                        <p className="text-xs text-muted-foreground">{promotion.serviceName} • {promotion.salonName}</p>
                      </div>
                    </div>

                    {/* QR Code Display for All Confirmed/Registered */}
                    <div className="mt-2 flex flex-col items-center p-4 bg-white rounded-xl border-2 border-dashed border-amber-500/50 w-full">
                      <div className="w-full flex justify-between items-center mb-3 pb-3 border-b border-dashed border-gray-200">
                        <div className="text-left">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Xizmat</p>
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{promotion.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Status</p>
                          <p className="text-xs font-bold text-green-600">Tasdiqlandi</p>
                        </div>
                      </div>
                      <QrCode className="w-32 h-32 text-slate-800" strokeWidth={1.5} />
                      <p className="text-center text-[10px] text-slate-500 mt-2 font-mono">ID: {user?.id?.slice(0, 8).toUpperCase()}</p>
                      <p className="text-center text-[10px] text-slate-400 mt-1">
                        Vaqt: {bookingTime || new Date().toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400 mt-2 text-center">QR kodni biznes egasiga ko'rsatib xizmatdan foydalaning.</p>
                  </Card>
                </div>
              )}

              {step === "booked" && (
                <div className="space-y-4">
                  <Card className="p-4 bg-green-500/10 border-green-500/30 flex flex-col items-center animate-in zoom-in-95 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-800 dark:text-green-500">Muvaffaqiyatli band qilindi!</p>
                        <p className="text-xs text-muted-foreground">{promotion.serviceName}</p>
                      </div>
                    </div>

                    {/* QR Code Display for New Booking */}
                    <div className="mt-2 flex flex-col items-center p-4 bg-white rounded-xl border-2 border-dashed border-green-500/50 w-full">
                      <div className="w-full flex justify-between items-center mb-3 pb-3 border-b border-dashed border-gray-200">
                        <div className="text-left">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">To'lov</p>
                          <p className="text-xs font-bold text-gray-800">
                            {promotion.discountedPrice && promotion.discountedPrice > 0
                              ? `${promotion.discountedPrice.toLocaleString()} so'm`
                              : "BEPUL"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Status</p>
                          <p className="text-xs font-bold text-green-600">Tasdiqlandi</p>
                        </div>
                      </div>

                      <QrCode className="w-40 h-40 text-slate-800" strokeWidth={1.5} />
                      <p className="text-center text-xs text-slate-500 mt-2 font-mono font-bold">ID: {user?.id?.slice(0, 8).toUpperCase()}</p>
                      <p className="text-center text-[10px] text-slate-400 mt-1">
                        Yaratildi: {bookingTime}
                      </p>
                    </div>
                    <p className="text-xs text-green-700/80 dark:text-green-400 mt-2 text-center">Ushbu kodni saqlab qo'ying va joyida ko'rsating.</p>
                  </Card>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-xl mb-4">
                    <p className="text-sm text-muted-foreground mb-1">To'lov miqdori:</p>
                    <p className="text-2xl font-bold text-foreground">{(promotion.discountedPrice || 0).toLocaleString()} so'm</p>
                  </div>

                  <h3 className="text-sm font-medium text-muted-foreground mb-2">To'lov usulini tanlang:</h3>
                  <div className="space-y-3">
                    <div
                      onClick={() => setSelectedPaymentMethod("card")}
                      className={`flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedPaymentMethod === "card" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Karta orqali</p>
                          <p className="text-xs text-muted-foreground">Humo / UzCard</p>
                        </div>
                        {selectedPaymentMethod === "card" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>

                      {/* Card Selection Area */}
                      {selectedPaymentMethod === "card" && (
                        <div className="w-full pl-12 pr-2 pb-2 space-y-3 animate-in slide-in-from-top-2">
                          {cards.length > 0 ? (
                            <div className="space-y-2">
                              {cards.map((card) => (
                                <div
                                  key={card.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCardId(card.id);
                                  }}
                                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCardId === card.id
                                    ? "bg-background border-primary shadow-sm ring-1 ring-primary/20"
                                    : "bg-background/50 border-transparent hover:bg-background"
                                    }`}
                                >
                                  <div className={`w-10 h-6 rounded bg-gradient-to-br ${card.card_type === 'humo' ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-blue-700'} flex items-center justify-center text-[8px] text-white font-bold shadow-sm`}>
                                    {card.card_type.toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                      •••• {card.card_number.slice(-4)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Balans: <span className="font-medium text-green-600 dark:text-green-400">{(card.balance || 0).toLocaleString()} so'm</span>
                                    </p>
                                  </div>
                                  {selectedCardId === card.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Saqlangan kartalar yo'q</p>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs gap-2 border-dashed"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAddCardOpen(true);
                            }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Yangi karta qo'shish
                          </Button>
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setSelectedPaymentMethod("click");
                        setSelectedCardId(null);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedPaymentMethod === "click" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Click / Payme</p>
                        <p className="text-xs text-muted-foreground">Tezkor to'lov</p>
                      </div>
                      {selectedPaymentMethod === "click" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>

                    <div
                      onClick={() => {
                        setSelectedPaymentMethod("cash");
                        setSelectedCardId(null);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedPaymentMethod === "cash" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Naqd pul</p>
                        <p className="text-xs text-muted-foreground">Joyida to'lov</p>
                      </div>
                      {selectedPaymentMethod === "cash" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                </div>
              )}

              {step === "feedback" && (
                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" />
                      Natija rasmi (majburiy)
                    </h4>
                    <label className="block">
                      {photoPreview ? (
                        <div className="relative rounded-2xl overflow-hidden">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={() => setPhotoPreview(null)}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                          <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Rasm yuklash uchun bosing
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Umumiy baho</h4>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setOverallRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${star <= overallRating
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Savollar</h4>
                    {mockFeedbackQuestions.map((question, index) => (
                      <Card key={question.id} className="p-4">
                        <p className="text-sm text-foreground mb-3">
                          {index + 1}. {question.questionUz}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {question.questionRu}
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleRatingChange(question.id, rating)}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${ratings[question.id] === rating
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Additional Comments */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Qo'shimcha fikrlar (ixtiyoriy)
                    </h4>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Fikrlaringizni yozing..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              {step === "confirm" && (
                <Button
                  className="w-full"
                  variant="coral"
                  onClick={handleBook}
                  disabled={isSubmitting || isLoading || !user}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : !user ? (
                    "Avval tizimga kiring"
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      {promotion.promotionType === "1+1" ? "1+1 Olish" : (promotion.discountedPrice !== undefined && promotion.discountedPrice > 0 ? "Chegirma olish" : "Bepul xizmatni olish")}
                    </>
                  )}
                </Button>
              )}
              {step === "payment" && (
                <Button
                  className="w-full"
                  variant="success"
                  onClick={handleBook}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      To'lanmoqda...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === "cash" ? (
                        "Joyida to'lash va band qilish"
                      ) : (
                        "To'lash va band qilish"
                      )}
                    </>
                  )}
                </Button>
              )}
              {step === "already-registered" && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleClose}>
                    Yopish
                  </Button>
                </div>
              )}
              {step === "booked" && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleClose}>
                    Yopish
                  </Button>
                </div>
              )}
              {step === "feedback" && (
                <Button className="w-full" variant="success" onClick={handleSubmitFeedback}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Yuborish
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )
      }
      <AddCardDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        onSuccess={loadCards}
      />
    </AnimatePresence >
  );
};

export default PromotionBookingModal;
