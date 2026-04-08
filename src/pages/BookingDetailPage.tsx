import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, Calendar, Clock, MapPin,
    CreditCard, CheckCircle2, XCircle, AlertCircle,
    MessageSquare, Share2, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useClientBookings, ClientBooking } from "@/hooks/useClientBookings";
import FeedbackModal from "@/components/FeedbackModal";
import { format, parseISO } from "date-fns";
import { uz } from "date-fns/locale";

const BookingDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { bookings, isLoading, refreshBookings } = useClientBookings();
    const [booking, setBooking] = useState<ClientBooking | null>(null);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

    useEffect(() => {
        if (bookings.length > 0 && id) {
            const found = bookings.find(b => b.id === id);
            if (found) {
                setBooking(found);
            }
        } else {
            refreshBookings();
        }
    }, [bookings, id, refreshBookings]);

    if (isLoading && !booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Buyurtma topilmadi</h2>
                <Button onClick={() => navigate('/bookings')}>Ortga qaytish</Button>
            </div>
        )
    }

    const statusConfig: any = {
        pending: { label: "Kutilmoqda", color: "bg-yellow-100 text-yellow-700", icon: Clock },
        confirmed: { label: "Tasdiqlangan", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
        scheduled: { label: "Rejalashtirilgan", color: "bg-blue-100 text-blue-700", icon: Calendar },
        completed: { label: "Bajarilgan", color: "bg-gray-100 text-gray-700", icon: CheckCircle2 },
        cancelled: { label: "Bekor qilingan", color: "bg-red-100 text-red-700", icon: XCircle },
        no_show: { label: "Kelmadingiz", color: "bg-red-100 text-red-700", icon: AlertCircle },
    };

    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), "d MMMM, yyyy", { locale: uz });
        } catch {
            return dateStr;
        }
    };

    // Fake QR Code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.id}`;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b sticky top-0 z-10 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="font-semibold text-lg">Buyurtma tafsilotlari</h1>
            </div>

            <div className="p-4 space-y-6 max-w-md mx-auto">
                {/* Status Card */}
                <Card className="p-4 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${status.color.replace('text-', 'bg-').replace('100', '100')}`}>
                        <StatusIcon className={`w-8 h-8 ${status.color.replace('bg-', 'text-').replace('100', '600')}`} />
                    </div>
                    <h2 className="text-xl font-bold mb-1">{status.label}</h2>
                    <p className="text-sm text-muted-foreground">ID: #{booking.id.slice(0, 8)}</p>
                </Card>

                {/* QR Code Section - Only for Confirmed/Scheduled */}
                {(booking.status === 'confirmed' || booking.status === 'scheduled') && (
                    <Card className="p-6 flex flex-col items-center text-center space-y-4 border-primary/20 bg-primary/5">
                        <h3 className="font-semibold text-lg">Xizmatga kirish kodi</h3>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                            Salonga kelganingizda ushbu QR kodni ko'rsating
                        </p>

                        <div className="bg-white p-3 rounded-xl shadow-sm border">
                            <img src={qrCodeUrl} alt="Booking QR Code" className="w-48 h-48 mix-blend-multiply" />
                        </div>

                        <p className="text-xs font-mono bg-white px-3 py-1 rounded border">
                            {booking.id}
                        </p>
                    </Card>
                )}

                {/* Service Details */}
                <Card className="overflow-hidden">
                    <div className="p-4 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={booking.promotion?.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200"}
                                    alt={booking.promotion?.service_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{booking.promotion?.service_name}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{booking.promotion?.salon_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Sana</p>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {booking.scheduled_date ? formatDate(booking.scheduled_date) : '-'}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Vaqt</p>
                                <div className="flex items-center gap-2 font-medium">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {booking.scheduled_time?.slice(0, 5) || '-'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-xs text-muted-foreground mb-2">To'lov turi</p>
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                {(!booking.payment_method || booking.payment_method === 'cash') && <span className="text-lg">💰</span>}
                                {booking.payment_method === 'card' && <span className="text-lg">💳</span>}
                                {booking.payment_method === 'coins' && <span className="text-lg">🪙</span>}

                                <span className="font-medium text-sm">
                                    {(!booking.payment_method || booking.payment_method === 'cash') && "Joyida to'lov (Naqd yoki karta)"}
                                    {booking.payment_method === 'card' && "Karta orqali to'lov"}
                                    {booking.payment_method === 'coins' && "Tangalar bilan to'lash"}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                {booking.status === 'completed' && !booking.has_feedback && (
                    <Button
                        onClick={() => setFeedbackModalOpen(true)}
                        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base shadow-lg shadow-primary/20"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Fikr qoldirish
                    </Button>
                )}

                {booking.status === 'confirmed' && (
                    <Button variant="outline" className="w-full h-12 border-dashed">
                        <Share2 className="w-4 h-4 mr-2" />
                        Chekni ulashish
                    </Button>
                )}

            </div>

            <FeedbackModal
                bookingId={booking.id}
                isOpen={feedbackModalOpen}
                onClose={() => {
                    setFeedbackModalOpen(false);
                    refreshBookings();
                }}
                isLottery={booking.is_winner}
                category="default"
            />
        </div>
    );
};

export default BookingDetailPage;
