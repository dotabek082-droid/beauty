import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, MessageSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { uz } from "date-fns/locale";
import { ClientBooking } from "@/hooks/useClientBookings";

interface BookingCardProps {
  booking: ClientBooking;
  onCancel?: (bookingId: string) => void;
  onFeedback?: (bookingId: string) => void;
  isLoading?: boolean;
  index?: number;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: "Kutilmoqda",
    variant: "secondary",
    icon: <Clock className="w-3 h-3" />,
    color: "text-muted-foreground",
  },
  confirmed: {
    label: "Tasdiqlangan",
    variant: "default",
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "text-primary",
  },
  scheduled: {
    label: "Rejalashtirilgan",
    variant: "default",
    icon: <Calendar className="w-3 h-3" />,
    color: "text-primary",
  },
  completed: {
    label: "Bajarilgan",
    variant: "outline",
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "text-success",
  },
  cancelled: {
    label: "Bekor qilingan",
    variant: "destructive",
    icon: <XCircle className="w-3 h-3" />,
    color: "text-destructive",
  },
  no_show: {
    label: "Kelmadingiz",
    variant: "destructive",
    icon: <AlertCircle className="w-3 h-3" />,
    color: "text-destructive",
  },
};

import { useLanguage } from "@/contexts/LanguageContext";
import { getDateLocale } from "@/utils/dateLocale";

const BookingCard = ({ booking, onCancel, onFeedback, isLoading, index = 0 }: BookingCardProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const config = statusConfig[booking.status] || statusConfig.pending;
  const isPast = booking.status === "completed" || booking.status === "cancelled" || booking.status === "no_show";
  const canCancel = booking.status === "pending" || booking.status === "confirmed";
  const canFeedback = booking.status === "completed" && !booking.has_feedback;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM, yyyy", { locale: getDateLocale(language) });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr?.slice(0, 5) || "";
  };

  const formatBookedAt = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMM, HH:mm", { locale: getDateLocale(language) });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate(`/bookings/${booking.id}`)}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md ${isPast ? "opacity-80 grayscale-[0.3]" : "bg-card"}`}>
        <div className="flex p-3 sm:p-4 gap-3 sm:gap-4 h-full">
          {/* Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/50">
            <img
              src={booking.promotion?.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200"}
              alt={booking.promotion?.service_name || "Xizmat"}
              className="w-full h-full object-cover"
            />
            {booking.is_winner && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-1">
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500/50 text-[10px] font-bold px-1.5 py-0.5 shadow-sm">
                  🏆 G'olib
                </Badge>
              </div>
            )}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${booking.status === 'confirmed' ? 'bg-green-500' :
              booking.status === 'pending' ? 'bg-yellow-500' :
                'bg-transparent'
              }`}></div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-foreground text-sm sm:text-base line-clamp-2 leading-tight">
                  {booking.promotion?.service_name || "Xizmat nomi"}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
                <span className="line-clamp-1 font-medium">{booking.promotion?.salon_name || "Salon"}</span>
              </div>

              {/* Scheduled time */}
              {booking.scheduled_date && booking.scheduled_time ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 bg-secondary/30 rounded-md p-1.5 w-fit">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(booking.scheduled_date)}</span>
                  </div>
                  <div className="w-px h-3 bg-border"></div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(booking.scheduled_time)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 bg-secondary/20 rounded-md p-1.5 w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ro'yxatdan: {formatBookedAt(booking.booked_at)}</span>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/20 rounded-md p-1.5 w-fit">
              {(!booking.payment_method || booking.payment_method === 'cash') && (
                <>
                  <span>💰</span>
                  <span className="font-medium">Joyida to'lov (Naqd yoki karta)</span>
                </>
              )}
              {booking.payment_method === 'card' && (
                <>
                  <span>💳</span>
                  <span className="font-medium">Karta orqali to'lov</span>
                </>
              )}
              {booking.payment_method === 'coins' && (
                <>
                  <span>🪙</span>
                  <span className="font-medium">Tangalar bilan to'lash</span>
                </>
              )}
            </div>

            {/* Status and Actions */}
            <div className="flex items-end justify-between mt-3 pt-2 border-t border-dashed border-border/50">
              <Badge variant={config.variant} className={`text-[10px] sm:text-xs px-2 py-0.5 border ${booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : ''
                }`}>
                {config.icon}
                <span className="ml-1.5 font-medium">{config.label}</span>
              </Badge>

              <div className="flex gap-2">
                {canFeedback && onFeedback && (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFeedback(booking.id);
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Fikr qoldirish
                  </Button>
                )}

                {booking.has_feedback && (
                  <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full border border-green-100">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Fikr yuborildi</span>
                  </div>
                )}

                {canCancel && onCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(booking.id);
                    }}
                    disabled={isLoading}
                    title="Bekor qilish"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookingCard;
