import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Gift, MapPin, Calendar, Users, Clock, Star,
  CheckCircle2, Ticket, Share2, Heart, ShieldCheck, AlertCircle,
  Coins, Trophy, Sparkles, Timer, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockPromotions, Promotion } from "@/data/promotionData";
import PromotionBookingModal from "@/components/PromotionBookingModal";
import LotteryEntryModal from "@/components/LotteryEntryModal";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "dd.MM.yyyy");
  } catch {
    return dateStr;
  }
};

const PromotionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLotteryModalOpen, setIsLotteryModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const found = mockPromotions.find(p => p.id === id);
    if (found) {
      setPromotion(found);
    }
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!promotion) return;

    const deadline = promotion.lotteryEnabled
      ? promotion.entryDeadline
      : promotion.endsAt;

    if (!deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(deadline);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Muddat tugagan");
        return;
      }

      const days = differenceInDays(end, now);
      const hours = differenceInHours(end, now) % 24;
      const minutes = differenceInMinutes(end, now) % 60;

      if (days > 0) {
        setTimeLeft(`${days} kun ${hours} soat`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} soat ${minutes} daqiqa`);
      } else {
        setTimeLeft(`${minutes} daqiqa`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [promotion]);

  if (!promotion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Gift className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Aksiya topilmadi</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Orqaga</Button>
        </div>
      </div>
    );
  }

  const isLottery = promotion.lotteryEnabled;
  const remainingSlots = promotion.slotsAvailable - promotion.slotsUsed;
  const isFull = remainingSlots <= 0;
  const isAlmostFull = remainingSlots <= 3;
  const registrationProgress = (promotion.slotsUsed / promotion.slotsAvailable) * 100;

  const entryDeadlinePassed = isLottery && promotion.entryDeadline
    ? new Date(promotion.entryDeadline) < new Date()
    : false;

  const endDatePassed = promotion.endsAt
    ? new Date(promotion.endsAt) < new Date()
    : false;

  const isExpired = isLottery ? entryDeadlinePassed : (endDatePassed || isFull);

  // Determine badge and colors
  const getBadgeConfig = () => {
    if (promotion.promotionType === "1+1") return { label: "1+1 AKSIYA", color: "bg-purple-600 text-white", icon: Sparkles };
    if (isLottery) return { label: "LOTEREYA", color: "bg-gradient-to-r from-purple-600 to-pink-600 text-white", icon: Ticket };
    if (promotion.discountedPrice === 0 || promotion.promotionType === "regular") return { label: "BEPUL", color: "bg-emerald-500 text-white", icon: Gift };
    return { label: "CHEGIRMA", color: "bg-blue-600 text-white", icon: Star };
  };

  const badgeConfig = getBadgeConfig();
  const BadgeIcon = badgeConfig.icon;

  // Determine display price
  const getDisplayPrice = () => {
    if (isLottery) {
      return {
        original: `${promotion.originalPrice.toLocaleString()} so'm`,
        final: "0 so'm",
        label: "Sovg'a qiymati",
        sublabel: "G'olib uchun bepul"
      };
    }
    if (promotion.promotionType === "1+1") {
      return {
        original: `${promotion.originalPrice.toLocaleString()} so'm`,
        final: `${(promotion.discountedPrice ?? 0).toLocaleString()} so'm`,
        label: "Narx",
        sublabel: "Ikkinchisi bepul!"
      };
    }
    if (promotion.discountedPrice === 0 || promotion.promotionType === "regular") {
      return {
        original: `${promotion.originalPrice.toLocaleString()} so'm`,
        final: "BEPUL",
        label: "Xizmat narxi",
        sublabel: "To'lov talab etilmaydi"
      };
    }
    return {
      original: `${promotion.originalPrice.toLocaleString()} so'm`,
      final: `${(promotion.discountedPrice ?? 0).toLocaleString()} so'm`,
      label: "Chegirma narxi",
      sublabel: `${Math.round(((promotion.originalPrice - (promotion.discountedPrice ?? 0)) / promotion.originalPrice) * 100)}% tejamkorlik`
    };
  };

  const priceInfo = getDisplayPrice();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Image */}
      <div className="relative">
        <div className="h-64 sm:h-80 overflow-hidden">
          <img
            src={promotion.imageUrl}
            alt={promotion.serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between safe-top">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: promotion.serviceName,
                    text: promotion.serviceDescription,
                    url: window.location.href,
                  });
                }
              }}
              className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-white"}`} />
            </motion.button>
          </div>
        </div>

        {/* Badges on hero */}
        <div className="absolute top-16 left-4 flex gap-2 flex-wrap">
          <Badge className={`${badgeConfig.color} px-3 py-1.5 text-sm font-bold shadow-lg`}>
            <BadgeIcon className="w-4 h-4 mr-1.5" />
            {badgeConfig.label}
          </Badge>
          {isLottery && (
            <Badge className="bg-amber-500 text-white px-3 py-1.5 text-sm font-bold shadow-lg">
              CHEGIRMA
            </Badge>
          )}
        </div>

        {/* Title overlay on hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white mb-1">{promotion.serviceName}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{promotion.salonName}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-2 relative z-10 space-y-4">

        {/* Countdown Timer */}
        {timeLeft && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`p-4 ${isExpired ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpired ? "bg-red-100 dark:bg-red-900/50" : "bg-amber-100 dark:bg-amber-900/50"}`}>
                    <Timer className={`w-5 h-5 ${isExpired ? "text-red-600" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isExpired ? "text-red-600" : "text-amber-700 dark:text-amber-400"}`}>
                      {isLottery ? "Ishtirok etish muddati" : "Ro'yxatdan o'tish muddati"}
                    </p>
                    <p className={`text-lg font-bold ${isExpired ? "text-red-700 dark:text-red-400" : "text-amber-800 dark:text-amber-300"}`}>
                      {timeLeft}
                    </p>
                  </div>
                </div>
                {!isExpired && (
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Qoldi</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 bg-card border shadow-soft">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{priceInfo.label}</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-sm line-through text-muted-foreground">{priceInfo.original}</span>
                </div>
                <p className={`text-3xl font-extrabold mt-1 ${isLottery ? "text-purple-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {priceInfo.final}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg ${isLottery ? "bg-purple-100 dark:bg-purple-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                <p className={`text-xs font-bold ${isLottery ? "text-purple-700 dark:text-purple-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                  {priceInfo.sublabel}
                </p>
              </div>
            </div>

            {/* Coin ticket price for lottery */}
            {promotion.ticketPrice > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Ishtirok narxi: {promotion.ticketPrice} tanga</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">Tangalar hisobdan yechiladi</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-4">
            <h3 className="font-bold text-foreground mb-2">Tavsif</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {promotion.serviceDescription}
            </p>
          </Card>
        </motion.div>

        {/* Salon Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/salon/${promotion.salonId}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{promotion.salonName}</p>
                  <p className="text-xs text-muted-foreground">Salonni ko'rish →</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </motion.div>

        {/* Lottery-specific: Stats & Info */}
        {isLottery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-4 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-600" />
                Lotereya Ma'lumotlari
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 dark:bg-black/20 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xl font-extrabold text-foreground">{promotion.currentEntries.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Ishtirokchilar</p>
                </div>
                <div className="bg-white/70 dark:bg-black/20 rounded-xl p-3 text-center">
                  <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-xl font-extrabold text-foreground">{promotion.totalWinners}</p>
                  <p className="text-xs text-muted-foreground">G'oliblar soni</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-muted-foreground">Oxirgi muddat:</span>
                  <span className="font-bold text-foreground ml-auto">
                    {promotion.entryDeadline ? formatDate(promotion.entryDeadline) : "Belgilanmagan"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span className="text-muted-foreground">G'oliblar e'lon qilinadi:</span>
                  <span className="font-bold text-foreground ml-auto">
                    {promotion.winnerSelectionDate ? formatDate(promotion.winnerSelectionDate) : "Belgilanmagan"}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Non-lottery: Slots & Registration Info */}
        {!isLottery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Ro'yxatdan o'tish
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ro'yxatdan o'tganlar:</span>
                  <span className={`font-bold ${isAlmostFull ? "text-destructive" : "text-foreground"}`}>
                    {promotion.slotsUsed} / {promotion.slotsAvailable}
                  </span>
                </div>

                <Progress value={registrationProgress} className="h-3" />

                <p className={`text-sm text-center font-medium ${isFull ? "text-destructive" : isAlmostFull ? "text-amber-600" : "text-emerald-600"}`}>
                  {isFull ? "Joylar tugadi!" : `${remainingSlots} ta joy qoldi`}
                </p>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Boshlanish:</span>
                    <span className="font-medium text-foreground ml-auto">{formatDate(promotion.startsAt)}</span>
                  </div>
                  {promotion.endsAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span className="text-muted-foreground">Tugash:</span>
                      <span className="font-medium text-foreground ml-auto">{formatDate(promotion.endsAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Conditions / Rules */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 border-primary/20 bg-primary/5">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Shartlar
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Xizmatdan so'ng rasm bilan fikr-mulohaza qoldirish majburiy</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>10 ta savolga javob berishingiz kerak</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{promotion.reviewDeadlineHours} soat ichida sharh qoldirish talab etiladi</span>
              </li>
              {promotion.ticketPrice > 0 && (
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Kirish narxi: <strong>{promotion.ticketPrice} tanga</strong></span>
                </li>
              )}
              {isLottery && (
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>G'oliblar tasodifiy tarzda tanlanadi</span>
                </li>
              )}
            </ul>
          </Card>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <p className="font-semibold mb-1">Diqqat!</p>
                <p>
                  {isLottery
                    ? "G'olib bo'lsangiz va xizmatdan foydalansangiz, xizmat tugagandan keyin 48 soat ichida sharh qoldirish, rasm yuklash va 10 ta savolga javob berish MAJBURIY! Aks holda bloklangan bo'lasiz."
                    : "Xizmatdan foydalangandan so'ng 48 soat ichida sharh qoldirish MAJBURIY! Aks holda keyingi aksiyalarda ishtirok eta olmaysiz."
                  }
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 safe-bottom">
          <div className="flex items-center gap-3">
            {/* Price summary */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{isLottery ? "Sovg'a" : "Narx"}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xs line-through text-muted-foreground">{promotion.originalPrice.toLocaleString()}</span>
                <span className={`text-lg font-extrabold ${isLottery ? "text-purple-600" : "text-emerald-600"}`}>
                  {isLottery
                    ? "0 so'm"
                    : promotion.discountedPrice !== undefined
                      ? (promotion.discountedPrice === 0 ? "BEPUL" : `${promotion.discountedPrice.toLocaleString()} so'm`)
                      : "BEPUL"
                  }
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className={`px-8 font-bold text-base ${isLottery
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  : isExpired
                    ? ""
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                }`}
              disabled={isExpired}
              onClick={() => {
                if (isLottery) {
                  setIsLotteryModalOpen(true);
                } else {
                  setIsBookingModalOpen(true);
                }
              }}
            >
              {isExpired
                ? (isLottery ? "Muddat tugagan" : (isFull ? "Joylar tugadi" : "Muddat tugagan"))
                : isLottery
                  ? "Ishtirok etish"
                  : promotion.promotionType === "1+1"
                    ? "1+1 Olish"
                    : promotion.discountedPrice !== undefined && promotion.discountedPrice > 0
                      ? "Chegirma olish"
                      : "Bepul olish"
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PromotionBookingModal
        promotion={promotion}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {promotion && (
        <LotteryEntryModal
          promotion={promotion}
          isOpen={isLotteryModalOpen}
          onClose={() => setIsLotteryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PromotionDetailPage;
