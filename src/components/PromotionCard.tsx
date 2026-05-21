import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Users, Clock, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "@/data/promotionData";
import { format } from "date-fns";

interface PromotionCardProps {
  promotion: Promotion;
  onBook: (promotion: Promotion) => void;
  onEnterLottery?: (promotion: Promotion) => void;
  variant?: "default" | "compact";
}

const formatDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "dd.MM.yyyy");
  } catch {
    return dateStr;
  }
};

const PromotionCard = ({ promotion, onBook, onEnterLottery, variant = "default" }: PromotionCardProps) => {
  const navigate = useNavigate();
  const remainingSlots = promotion.slotsAvailable - promotion.slotsUsed;
  const isAlmostFull = remainingSlots <= 3;
  const isFull = remainingSlots <= 0;
  const registrationProgress = (promotion.slotsUsed / promotion.slotsAvailable) * 100;

  // Lottery mode calculations
  const isLottery = promotion.lotteryEnabled;
  const entryDeadlinePassed = isLottery && promotion.entryDeadline
    ? new Date(promotion.entryDeadline) < new Date()
    : false;

  if (variant === "compact") {
    return (
      <motion.div whileTap={{ scale: 0.98 }}>
        <Card className="overflow-hidden flex cursor-pointer" onClick={() => isLottery && onEnterLottery ? onEnterLottery(promotion) : navigate(`/salon/${promotion.salonId}?promotionId=${promotion.id}`)}>
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={promotion.imageUrl}
              alt={promotion.serviceName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1">
              <Badge className={`${promotion.discountedPrice === 0 ? "bg-success text-success-foreground" : "bg-blue-600 text-white"} text-[10px] px-1.5 py-0.5`}>
                <Gift className="w-2.5 h-2.5 mr-0.5" />
                {promotion.discountedPrice === 0 ? "BEPUL" : "CHEGIRMA"}
              </Badge>
            </div>
          </div>
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-foreground text-sm line-clamp-1">
                {promotion.serviceName}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{promotion.salonName}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span className={isAlmostFull ? "text-destructive font-medium" : ""}>
                  {isLottery ? `${promotion.currentEntries} ishtirok` : `${promotion.slotsUsed}/${promotion.slotsAvailable}`}
                </span>
              </div>
              <Button
                size="sm"
                variant="soft"
                className="h-7 text-xs"
                onClick={() => isLottery && onEnterLottery ? onEnterLottery(promotion) : navigate(`/salon/${promotion.salonId}?promotionId=${promotion.id}`)}
                disabled={isLottery ? entryDeadlinePassed : isFull}
              >
                {isLottery ? "Ishtirok" : (isFull ? "To'ldi" : (promotion.discountedPrice !== undefined && promotion.discountedPrice > 0 ? "Chegirma" : "Olish"))}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="overflow-hidden cursor-pointer" onClick={() => isLottery && onEnterLottery ? onEnterLottery(promotion) : navigate(`/salon/${promotion.salonId}?promotionId=${promotion.id}`)}>
        <div className="relative h-36">
          <img
            src={promotion.imageUrl}
            alt={promotion.serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2">
            <Badge className={`${promotion.promotionType === "1+1" ? "bg-purple-600 text-white" : (promotion.discountedPrice === 0 ? "bg-success text-success-foreground" : "bg-blue-600 text-white")}`}>
              <Gift className="w-3 h-3 mr-1" />
              {promotion.promotionType === "1+1" ? "1+1 AKSIYA" : (promotion.discountedPrice === 0 ? "BEPUL" : "CHEGIRMA")}
            </Badge>
          </div>
          {isLottery && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-purple-600">LOTEREYA</Badge>
            </div>
          )}
          {!isLottery && isFull && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">TO'LDI</Badge>
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-lg font-bold line-through opacity-70">
              {promotion.originalPrice.toLocaleString()} so'm
            </p>
            <p className="text-success text-xl font-bold">
              {(promotion.discountedPrice !== undefined ? promotion.discountedPrice : 0).toLocaleString()} so'm
            </p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-foreground">{promotion.serviceName}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{promotion.salonName}</span>
            </div>
          </div>

          {/* Registration Period or Entry Deadline */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1.5">
            {isLottery ? (
              <>
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">Oxirgi muddat:</span>
                </div>
                <div className="text-xs font-medium text-foreground">
                  {promotion.entryDeadline ? formatDate(promotion.entryDeadline) : "Belgilanmagan"}
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-muted-foreground">G'oliblar e'lon qilinadi:</span>
                </div>
                <div className="text-xs font-medium text-foreground">
                  {promotion.winnerSelectionDate ? formatDate(promotion.winnerSelectionDate) : "Belgilanmagan"}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">Ro'yxatdan o'tish:</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">{formatDate(promotion.startsAt)}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-foreground">
                    {promotion.endsAt ? formatDate(promotion.endsAt) : "Cheksiz"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2">
            {isLottery ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Ishtirokchilar:</span>
                  </div>
                  <span className="font-bold text-foreground">
                    {promotion.currentEntries.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">G'oliblar soni:</span>
                  <span className="font-bold text-success">{promotion.totalWinners}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Ro'yxatdan o'tganlar:</span>
                  </div>
                  <span className={`font-bold ${isAlmostFull ? "text-destructive" : "text-foreground"}`}>
                    {promotion.slotsUsed.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joylar soni:</span>
                  <span className="font-bold text-foreground">{promotion.slotsAvailable}</span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all ${isFull ? "bg-destructive" : isAlmostFull ? "bg-warning" : "bg-success"
                      }`}
                    style={{ width: `${Math.min(registrationProgress, 100)}%` }}
                  />
                </div>
                <p className={`text-xs text-center ${isAlmostFull ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                  {isFull ? "Joylar tugadi!" : `${remainingSlots} ta joy qoldi`}
                </p>
              </>
            )}
          </div>

          <Button
            className="w-full"
            variant={isLottery ? "default" : (isFull ? "outline" : "coral")}
            onClick={() => isLottery && onEnterLottery ? onEnterLottery(promotion) : navigate(`/salon/${promotion.salonId}?promotionId=${promotion.id}`)}
            disabled={isLottery ? entryDeadlinePassed : isFull}
          >
            {isLottery
              ? (entryDeadlinePassed ? "Muddat tugagan" : "Ishtirok etish")
              : (isFull ? "Joylar tugadi" : (promotion.promotionType === "1+1" ? "1+1 Olish" : (promotion.discountedPrice !== undefined && promotion.discountedPrice > 0 ? "Chegirma olish" : "Bepul olish")))
            }
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default PromotionCard;
