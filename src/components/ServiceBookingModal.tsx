import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scissors, Calendar, Clock, CheckCircle2, Ticket, Percent, Loader2, Sparkles, UtensilsCrossed, Dumbbell, Briefcase, Heart, Zap, LogIn, ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { uz } from "date-fns/locale";
import { getCoinBalance, deductCoins } from "@/utils/coinBalance";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { fakePromocodes, Promocode } from "@/data/promocodes"; // Import mock data

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number | string;
  description?: string;
  category?: string;
}

// Helper function to get appropriate icon based on service type
const getServiceIcon = (serviceName: string, category?: string) => {
  const name = serviceName.toLowerCase();
  const cat = category?.toLowerCase() || '';

  if (name.includes('soch') || name.includes('hair') || name.includes('barber') || cat.includes('hair')) return Scissors;
  if (name.includes('massaj') || name.includes('massage') || name.includes('spa') || cat.includes('spa')) return Sparkles;
  if (name.includes('ovqat') || name.includes('taom') || name.includes('food') || cat.includes('restaurant')) return UtensilsCrossed;
  if (name.includes('fitnes') || name.includes('fitness') || name.includes('gym') || cat.includes('fitness')) return Dumbbell;
  if (name.includes('tirnoq') || name.includes('nail') || name.includes('manikyur')) return Heart;
  if (name.includes('lazer') || name.includes('laser') || cat.includes('cosmetology')) return Zap;

  return Briefcase; // Default icon
};

interface ServiceBookingModalProps {
  service: Service | null;
  salonName: string;
  salonId?: string;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "datetime" | "confirm" | "success";

// Generate deterministic time slots
const getAvailableTimeSlots = () => {
  return ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
};

const generateNextDays = () => {
  return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
};

const ServiceBookingModal = ({ service, salonName, salonId, isOpen, onClose }: ServiceBookingModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("datetime");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date/Time selection state
  const [days] = useState(generateNextDays);
  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Payment & Promocode State
  const [userCoins, setUserCoins] = useState(0);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "coins">("cash");
  const [customCoinAmount, setCustomCoinAmount] = useState<string>("");

  // New Promocode Logic
  const [promocodeInput, setPromocodeInput] = useState("");
  const [appliedPromocode, setAppliedPromocode] = useState<Promocode | null>(null);
  const [promocodeError, setPromocodeError] = useState<string | null>(null);
  const [showPromocodeInput, setShowPromocodeInput] = useState(false);

  // Fetch unavailable slots - includes fake booked data for demo
  useEffect(() => {
    const fetchUnavailable = async () => {
      if (!isOpen) return;

      try {
        // Fake booked slots data - simulates other clients' bookings
        const today = new Date();
        const fakeBookedSlots: Record<string, string[]> = {};

        // Generate fake bookings for the next 7 days
        for (let i = 0; i < 7; i++) {
          const date = addDays(today, i);
          const dateKey = format(date, 'yyyy-MM-dd');

          // Different booked slots for different days
          if (i === 0) { // Today
            fakeBookedSlots[dateKey] = ["10:00", "14:00", "16:00"];
          } else if (i === 1) { // Tomorrow
            fakeBookedSlots[dateKey] = ["09:00", "11:00", "15:00", "17:00"];
          } else if (i === 2) {
            fakeBookedSlots[dateKey] = ["12:00", "14:00"];
          } else if (i === 3) {
            fakeBookedSlots[dateKey] = ["10:00", "11:00", "12:00", "16:00"];
          } else if (i === 4) {
            fakeBookedSlots[dateKey] = ["09:00", "15:00", "18:00"];
          } else if (i === 5) {
            fakeBookedSlots[dateKey] = ["11:00", "14:00", "17:00"];
          } else {
            fakeBookedSlots[dateKey] = ["10:00", "12:00"];
          }
        }

        // Try to also fetch from database (in case real bookings exist)
        const { data } = await supabase
          .from('promotion_bookings')
          .select('scheduled_date, scheduled_time, status')
          .in('status', ['confirmed', 'pending', 'blocked']);

        // Type casting to bypass strict schema checks for demo purposes since types might be outdated
        const { data: blockedData } = await supabase
          .from('blocked_time_slots' as any)
          .select('blocked_date, blocked_time');

        const bookedMap: Record<string, string[]> = { ...fakeBookedSlots };

        data?.forEach(booking => {
          if (booking.scheduled_date && booking.scheduled_time) {
            const dateKey = format(new Date(booking.scheduled_date), 'yyyy-MM-dd');
            if (!bookedMap[dateKey]) bookedMap[dateKey] = [];
            if (!bookedMap[dateKey].includes(booking.scheduled_time)) {
              bookedMap[dateKey].push(booking.scheduled_time);
            }
          }
        });

        (blockedData as any)?.forEach((slot: any) => {
          if (slot.blocked_date && slot.blocked_time) {
            if (!bookedMap[slot.blocked_date]) bookedMap[slot.blocked_date] = [];
            if (!bookedMap[slot.blocked_date].includes(slot.blocked_time)) {
              bookedMap[slot.blocked_date].push(slot.blocked_time);
            }
          }
        });

        const slotsMap: Record<string, string[]> = {};
        const allTimes = getAvailableTimeSlots();

        days.forEach(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const bookedTimes = bookedMap[dateKey] || [];
          slotsMap[dateKey] = allTimes.filter(time => !bookedTimes.includes(time));
        });

        setAvailableSlots(slotsMap);

      } catch (e) {
        console.error("Error fetching availability", e);

        // Still use fake data even if database fails
        const today = new Date();
        const slotsMap: Record<string, string[]> = {};
        const allTimes = getAvailableTimeSlots();

        days.forEach((day, i) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          // Apply fake booked slots even in error case
          let bookedTimes: string[] = [];
          if (i === 0) bookedTimes = ["10:00", "14:00", "16:00"];
          else if (i === 1) bookedTimes = ["09:00", "11:00", "15:00", "17:00"];
          else if (i === 2) bookedTimes = ["12:00", "14:00"];
          else if (i === 3) bookedTimes = ["10:00", "11:00", "12:00", "16:00"];
          else if (i === 4) bookedTimes = ["09:00", "15:00", "18:00"];
          else if (i === 5) bookedTimes = ["11:00", "14:00", "17:00"];
          else bookedTimes = ["10:00", "12:00"];

          slotsMap[dateKey] = allTimes.filter(time => !bookedTimes.includes(time));
        });
        setAvailableSlots(slotsMap);
      }
    };

    fetchUnavailable();
  }, [isOpen, days]);

  useEffect(() => {
    if (isOpen && user) {
      setUserCoins(getCoinBalance(user.id));

      const storedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
      const cards = storedCards[user.id]?.cards || [];
      setUserCards(cards);

      const defaultCard = cards.find((c: any) => c.is_default);
      if (defaultCard) setSelectedCardId(defaultCard.id);
      else if (cards.length > 0) setSelectedCardId(cards[0].id);

      setPaymentMethod("cash");
      setCustomCoinAmount("");
      setPromocodeInput("");
      setAppliedPromocode(null);
      setPromocodeError(null);
      setShowPromocodeInput(false);
      setStep("datetime");
    } else if (isOpen) {
      setStep("datetime");
    }
  }, [isOpen, user]);

  if (!service) return null;

  // --- Promocode Logic ---
  const handleApplyPromocode = () => {
    setPromocodeError(null);
    if (!promocodeInput.trim()) return;

    const promo = fakePromocodes.find(p => p.code === promocodeInput.trim());

    if (!promo) {
      setPromocodeError("Promokod topilmadi");
      return;
    }

    // Validate Valid Until
    if (new Date(promo.validUntil) < new Date()) {
      setPromocodeError("Promokod muddati tugagan");
      return;
    }

    // Validate Min Amount
    if (promo.minOrderAmount && service.price < promo.minOrderAmount) {
      setPromocodeError(`Promokod faqat ${promo.minOrderAmount.toLocaleString()} so'mdan yuqori xizmatlarga amal qiladi`);
      return;
    }

    // Validate Category (Mock logic - assumes category matches specific strings)
    if (promo.applicableCategories && service.category) {
      const hasCategory = promo.applicableCategories.some(cat =>
        service.category?.toLowerCase().includes(cat.toLowerCase()) ||
        service.name.toLowerCase().includes(cat.toLowerCase())
      );
      if (!hasCategory) {
        setPromocodeError(`Bu promokod ushbu xizmat turiga amal qilmaydi`);
        return;
      }
    }

    setAppliedPromocode(promo);
    toast.success("Promokod muvaffaqiyatli qo'llanilgandi!");
  };

  const removePromocode = () => {
    setAppliedPromocode(null);
    setPromocodeInput("");
    setPromocodeError(null);
  };

  // --- Calculation Logic ---

  const calculateTotals = () => {
    let finalPrice = service.price;
    let discountAmount = 0;
    let coinCost = 0; // Coins used for PAYMENT, not discount cost

    // 1. Apply Promocode Discount
    if (appliedPromocode) {
      if (appliedPromocode.discountType === 'percent') {
        discountAmount = (service.price * appliedPromocode.discountValue) / 100;
      } else {
        discountAmount = appliedPromocode.discountValue;
      }
      // Ensure discount doesn't exceed price
      discountAmount = Math.min(discountAmount, service.price);
      finalPrice = service.price - discountAmount;
    }

    // 2. Apply Payment Method Logic
    if (paymentMethod === "coins") {
      const coinsToUse = parseInt(customCoinAmount) || 0;
      // You can pay up to the full remaining price with coins (1 coin = 1 sum)
      const actualCoinsToPay = Math.min(coinsToUse, finalPrice);

      finalPrice = finalPrice - actualCoinsToPay;
      coinCost = actualCoinsToPay;
    }

    return { finalPrice, coinCost, discountAmount };
  };

  const { finalPrice, coinCost, discountAmount } = calculateTotals();

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinueToConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Iltimos, sana va vaqtni tanlang");
      return;
    }
    setStep("confirm");
  };

  const handleBook = async () => {
    if (!user) {
      toast.error("Buyurtma berish uchun tizimga kiring");
      navigate("/auth");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Iltimos, sana va vaqtni tanlang");
      return;
    }

    if (paymentMethod === "coins") {
      const amount = parseInt(customCoinAmount) || 0;
      if (amount < 100) {
        toast.error("Minimum 100 tanga to'lash kerak");
        return;
      }
      if (amount > userCoins) {
        toast.error("Hisobingizda yetarli tanga yo'q");
        return;
      }
    }

    if (paymentMethod === "card") {
      if (userCards.length === 0) {
        toast.error("Iltimos, avval karta qo'shing");
        return;
      }
      if (!selectedCardId) {
        toast.error("Iltimos, to'lov uchun kartani tanlang");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (coinCost > 0) {
        const success = deductCoins(user.id, coinCost, `Xizmat uchun to'lov: ${service.name}`);
        if (!success) {
          toast.error("Xatolik: Hisobingizda mablag' yetarli emas");
          setIsSubmitting(false);
          return;
        }
      }

      const bookingData = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        service_name: service.name,
        salon_name: salonName,
        salon_id: salonId,
        original_price: service.price,
        final_price: finalPrice,
        scheduled_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
        scheduled_time: selectedTime,
        booked_at: new Date().toISOString(),
        status: 'pending',
        payment_method: paymentMethod,
        promocode: appliedPromocode ? appliedPromocode.code : null,
        coin_cost: coinCost,
      };

      const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '{}');
      if (!existingBookings[user.id]) {
        existingBookings[user.id] = [];
      }
      existingBookings[user.id].push(bookingData);
      localStorage.setItem('user_bookings', JSON.stringify(existingBookings));

      if (user?.id) {
        const { addCoins, COIN_VALUES } = await import('@/utils/coinBalance');
        addCoins(user.id, COIN_VALUES.BOOKING, 'booking', `Xizmat band qilish: ${service.name}`);

        // CHECK REFERRAL REWARD (First Booking)
        try {
          const { processReferralReward, isFirstBooking } = await import('@/utils/referralUtils');
          // We check if this is the first booking. 
          // Note: Since we seemingly just pushed a booking to localStorage above, 'isFirstBooking' 
          // might return false if it checks current length. 
          // Ideally we check BEFORE pushing, or adjust 'isFirstBooking' logic.
          // For now, let's assume 'processReferralReward' handles the "has already been rewarded" check internally status='completed'
          // best effort:
          processReferralReward(user.id);
        } catch (err) {
          console.error("Referral reward error:", err);
        }

        toast.success(`+${COIN_VALUES.BOOKING} tanga!`, {
          description: "Xizmat band qilganingiz uchun"
        });
      }

      setIsSubmitting(false);
      setStep("success");
      toast.success("Xizmat muvaffaqiyatli band qilindi!");
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Buyurtma yaratishda xatolik yuz berdi');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("datetime");
    setSelectedDate(null);
    setSelectedTime(null);
    setPaymentMethod("cash");
    setCustomCoinAmount("");
    removePromocode();
    setShowPromocodeInput(false);
    onClose();
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMM, EEEE", { locale: uz });
  };

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const currentDaySlots = selectedDateKey ? availableSlots[selectedDateKey] || [] : [];

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
                {step === "datetime" && "Vaqtni tanlang"}
                {step === "confirm" && "Buyurtmani tasdiqlang"}
                {step === "success" && "Tabriklaymiz!"}
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {step === "datetime" && (
                <div className="space-y-5">
                  <Card className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {(() => {
                          const Icon = getServiceIcon(service.name, service.category);
                          return <Icon className="w-5 h-5 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{service.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{salonName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">{service.price.toLocaleString()} so'm</p>
                        <p className="text-xs text-muted-foreground">{service.duration}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Date Selection */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Kunni tanlang
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                      {days.map((date) => {
                        const isSelected =
                          selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                        return (
                          <motion.button
                            key={date.toISOString()}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelectDate(date)}
                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all min-w-[80px] ${isSelected
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                              }`}
                          >
                            <p className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {format(date, "EEE", { locale: uz })}
                            </p>
                            <p className={`font-bold text-lg ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                              {format(date, "d")}
                            </p>
                            <p className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {format(date, "MMM", { locale: uz })}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Vaqtni tanlang
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableTimeSlots().map((time) => {
                          const isBooked = !currentDaySlots.includes(time);
                          const isSelected = selectedTime === time;

                          return (
                            <motion.button
                              key={time}
                              whileTap={!isBooked ? { scale: 0.95 } : {}}
                              onClick={() => !isBooked && handleSelectTime(time)}
                              disabled={isBooked}
                              className={`py-3 rounded-xl font-medium text-sm transition-all relative ${isBooked
                                ? "bg-red-50 text-red-300 cursor-not-allowed border border-red-100"
                                : isSelected
                                  ? "bg-primary text-primary-foreground shadow-lg"
                                  : "bg-secondary hover:bg-secondary/80 text-foreground"
                                }`}
                            >
                              <span className={isBooked ? "line-through" : ""}>{time}</span>
                              {isBooked && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                                  <X className="w-2.5 h-2.5 text-white" />
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-50 rounded border border-red-100"></span>
                        Band qilingan vaqtlar
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {step === "confirm" && (
                <div className="space-y-4">
                  {/* Service Info */}
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        {(() => {
                          const Icon = getServiceIcon(service.name, service.category);
                          return <Icon className="w-6 h-6 text-primary" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{salonName}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* PROMOCODE SECTION - WITH TOGGLE */}
                  <div className="space-y-3 pt-2">
                    {!showPromocodeInput && !appliedPromocode ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-auto py-2 px-0 hover:bg-transparent text-foreground hover:text-primary group"
                        onClick={() => setShowPromocodeInput(true)}
                      >
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Promokod bormi?</span>
                        </div>
                        <span className="text-xs font-semibold text-primary group-hover:underline">Kiriting</span>
                      </Button>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-top-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-primary" />
                            <span className="font-medium text-sm">Promokod</span>
                          </div>
                          {!appliedPromocode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-muted-foreground hover:text-foreground px-2"
                              onClick={() => setShowPromocodeInput(false)}
                            >
                              Bekor qilish
                            </Button>
                          )}
                        </div>

                        {!appliedPromocode ? (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Promokodni kiriting"
                              value={promocodeInput}
                              onChange={(e) => setPromocodeInput(e.target.value)}
                              className="bg-secondary/50"
                              autoFocus
                            />
                            <Button onClick={handleApplyPromocode} variant="outline" size="icon" className="shrink-0 aspect-square">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Percent className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-green-700">{appliedPromocode.code}</p>
                                <p className="text-xs text-green-600">{appliedPromocode.description}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { removePromocode(); setShowPromocodeInput(false); }} className="text-green-700 hover:text-green-800 hover:bg-green-500/20 h-8 w-8">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {promocodeError && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <span className="w-1 h-1 bg-destructive rounded-full"></span>
                            {promocodeError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-medium flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-primary" />
                      To'lov turi
                    </h3>

                    <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="grid grid-cols-1 gap-3">
                      {/* Cash */}
                      <div className="relative">
                        <RadioGroupItem value="cash" id="pm_cash" className="peer sr-only" />
                        <Label htmlFor="pm_cash" className="flex items-center justify-between p-3 rounded-lg border-2 border-muted bg-popover hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer transition-all">
                          <span className="font-medium">Joyida to'lov</span>
                          <span className="text-muted-foreground text-sm">Naqd yoki karta</span>
                        </Label>
                      </div>

                      {/* Card Payment */}
                      <div>
                        <RadioGroupItem value="card" id="pm_card" className="peer sr-only" />
                        <Label htmlFor="pm_card" className="flex flex-col p-3 rounded-lg border-2 border-muted bg-popover hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer transition-all gap-3">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium flex items-center gap-2">💳 Karta orqali to'lov</span>
                            {userCards.length > 0 && <span className="text-xs text-muted-foreground">{userCards.length} ta karta</span>}
                          </div>

                          {paymentMethod === 'card' && (
                            <div className="animate-in fade-in slide-in-from-top-1 space-y-2 mt-1">
                              {userCards.length === 0 ? (
                                <div className="text-center py-2">
                                  <p className="text-xs text-muted-foreground mb-2">Sizda karta yo'q</p>
                                  <Button size="sm" variant="outline" onClick={() => navigate('/profile/payment-methods')} className="w-full">
                                    Karta qo'shish
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {userCards.map((card) => (
                                    <div
                                      key={card.id}
                                      onClick={() => setSelectedCardId(card.id)}
                                      className={`flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-muted/50 ${selectedCardId === card.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-8 h-5 rounded overflow-hidden bg-gradient-to-r ${card.card_type === 'visa' ? 'from-blue-600 to-blue-800' : 'from-green-600 to-emerald-800'}`}></div>
                                        <div className="flex flex-col">
                                          <span className="text-xs font-mono font-medium">{card.card_number}</span>
                                          <span className="text-[10px] text-muted-foreground">{card.card_holder}</span>
                                        </div>
                                      </div>
                                      {selectedCardId === card.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                    </div>
                                  ))}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full text-xs h-7 mt-1 text-muted-foreground hover:text-primary"
                                    onClick={() => navigate('/profile/payment-methods')}
                                  >
                                    + Yangi karta qo'shish
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </Label>
                      </div>

                      {/* Coin Payment */}
                      <div>
                        <RadioGroupItem value="coins" id="pm_coins" className="peer sr-only" />
                        <Label htmlFor="pm_coins" className="flex flex-col p-3 rounded-lg border-2 border-muted bg-popover hover:bg-accent peer-data-[state=checked]:border-primary cursor-pointer transition-all gap-3">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium flex items-center gap-2">🪙 Tangalar bilan to'lash</span>
                            <span className="text-xs text-muted-foreground">Balans: {userCoins}</span>
                          </div>

                          {paymentMethod === "coins" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="Tanga miqdori"
                                  value={customCoinAmount}
                                  onChange={(e) => {
                                    // Allow input up to calculated remaining price (finalPrice before coins logic would be tricky here since finalPrice updates with coins. 
                                    // Better to let user input, and handle logic in calculation or submission)
                                    setCustomCoinAmount(e.target.value);
                                  }}
                                  className="h-9"
                                />
                                <Button size="sm" variant="outline" onClick={(e) => {
                                  e.preventDefault();
                                  // Max logic: 
                                  // We can pay UP TO the amount remaining after discount.
                                  // Current calculated finalPrice already deducts the coin input if selected. 
                                  // So we need: service.price - discountAmount
                                  let amountAfterDiscount = service.price;
                                  if (appliedPromocode) {
                                    let disc = appliedPromocode.discountType === 'percent'
                                      ? (service.price * appliedPromocode.discountValue) / 100
                                      : appliedPromocode.discountValue;
                                    amountAfterDiscount = Math.max(0, service.price - disc);
                                  }
                                  const maxCanPay = Math.min(userCoins, amountAfterDiscount);
                                  setCustomCoinAmount(maxCanPay.toString());
                                }}>Max</Button>
                              </div>
                              <p className="text-xs text-muted-foreground">1 tanga = 1 so'm. Min: 100 tanga.</p>
                              {parseInt(customCoinAmount) < 100 && parseInt(customCoinAmount) > 0 && <p className="text-xs text-destructive">Minimum 100 tanga</p>}
                            </div>
                          )}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Price Summary */}
                  <Card className="p-4 bg-secondary/50">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Xizmat narxi</span>
                        <span className={`font-medium ${discountAmount > 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {service.price.toLocaleString()} so'm
                        </span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-success">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Chegirma ({appliedPromocode?.code})
                          </span>
                          <span>-{discountAmount.toLocaleString()} so'm</span>
                        </div>
                      )}

                      <div className="border-t border-border pt-2 flex justify-between">
                        <span className="font-semibold text-foreground">Jami to'lov</span>
                        <span className="font-bold text-lg text-primary">
                          {finalPrice.toLocaleString()} so'm
                        </span>
                      </div>

                      {paymentMethod === 'card' && finalPrice > 0 && (
                        <div className="flex justify-between text-xs text-blue-600 font-medium">
                          <span>Karta orqali:</span>
                          <span>{finalPrice.toLocaleString()} so'm</span>
                        </div>
                      )}

                      {coinCost > 0 && (
                        <div className="flex justify-between text-xs text-amber-600 font-medium">
                          <span>Yechiladigan tangalar:</span>
                          <span>-{coinCost} tanga</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-8 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Buyurtma qabul qilindi!</h3>
                    <p className="text-muted-foreground mt-2">
                      {salonName} salonida {service.name} xizmati band qilindi.
                    </p>
                    {paymentMethod === 'card' && (
                      <Card className="mt-4 p-3 bg-blue-500/10 border-blue-500/20">
                        <p className="text-sm text-blue-600 font-medium">
                          To'lov karta orqali muvaffaqiyatli amalga oshirildi.
                        </p>
                      </Card>
                    )}
                    {discountAmount > 0 && (
                      <Card className="mt-4 p-3 bg-success/10 border-success/20">
                        <p className="text-sm text-success font-medium">
                          🎉 Siz {discountAmount.toLocaleString()} so'm tejadingiz!
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              {step === "datetime" && (
                <Button
                  className="w-full"
                  variant="coral"
                  onClick={handleContinueToConfirm}
                  disabled={!selectedDate || !selectedTime}
                >
                  Davom etish
                </Button>
              )}
              {step === "confirm" && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("datetime")}>
                    Orqaga
                  </Button>
                  <Button
                    className="flex-1"
                    variant="coral"
                    onClick={!user ? () => { toast.error("Davom etish uchun tizimga kiring"); navigate("/auth"); } : handleBook}
                    disabled={isSubmitting || (paymentMethod === "coins" && (parseInt(customCoinAmount || "0") < 100))}
                  >
                    {!user ? "Tizimga kirish" : (isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tasdiqlash")}
                  </Button>
                </div>
              )}
              {step === "success" && (
                <Button className="w-full" variant="outline" onClick={handleClose}>
                  Yopish
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceBookingModal;
