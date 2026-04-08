import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Gift, Loader2, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { featuredSalons, nearbySalons } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useClientBookings } from "@/hooks/useClientBookings";
import BookingCard from "@/components/BookingCard";
import FeedbackModal from "@/components/FeedbackModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClientBookings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { bookings, isLoading, stats, cancelBooking, getUpcomingBookings, getPastBookings, refreshBookings, hasMore, loadMore } =
        useClientBookings();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState<string>("");
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackBookingId, setFeedbackBookingId] = useState<string | null>(null);

    const upcomingBookings = getUpcomingBookings();
    const pastBookings = getPastBookings();

    const handleCancelClick = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setCancelReason("");
        setOtherReason("");
        setCancelDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedBookingId) return;

        setIsCancelling(true);
        const result = await cancelBooking(selectedBookingId);
        setIsCancelling(false);

        if (result.success) {
            setCancelDialogOpen(false);
            setSelectedBookingId(null);
        }
    };

    const handleFeedbackClick = (bookingId: string) => {
        setFeedbackBookingId(bookingId);
        setFeedbackModalOpen(true);
    };

    const handleFeedbackClose = () => {
        setFeedbackModalOpen(false);
        setFeedbackBookingId(null);
        refreshBookings();
    };

    // Not logged in
    if (!user) {
        return (
            <div className="pb-24">
                <div className="px-4">
                    <Card className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="font-semibold text-foreground mb-2">Tizimga kiring</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Buyurtmalaringizni ko'rish uchun tizimga kiring
                        </p>
                        <Button variant="coral" onClick={() => navigate("/auth")}>
                            Kirish
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-lg mx-auto pb-20">
            {/* Removed Header - It will be in the parent page or handled differently */}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Jami</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-yellow-100 shadow-sm flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400/10 rounded-bl-2xl"></div>
                    <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Kutilmoqda</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-green-400/10 rounded-bl-2xl"></div>
                    <span className="text-2xl font-bold text-green-600">{stats.confirmed}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Tasdiqlangan</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-blue-400/10 rounded-bl-2xl"></div>
                    <span className="text-2xl font-bold text-blue-600">{stats.completed}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Bajarilgan</span>
                </div>
            </div>

            {/* Content Tabs */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">Ma'lumotlar yuklanmoqda...</p>
                </div>
            ) : bookings.length === 0 ? (
                <Card className="p-8 text-center border-dashed border-2 bg-gray-50/50">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Hozircha buyurtmalar yo'q</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                        Sevimli xizmatlaringizga yoziling va barchasini shu yerda kuzatib boring!
                    </p>
                    <Button className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold" onClick={() => navigate("/")}>
                        Xizmatlarni izlash
                    </Button>
                </Card>
            ) : (
                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="w-full p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl mb-6 grid grid-cols-2 gap-1 border border-gray-200/50">
                        <TabsTrigger
                            value="upcoming"
                            className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all py-2.5"
                        >
                            Faol buyurtmalar ({upcomingBookings.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all py-2.5"
                        >
                            Tarix ({pastBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4 focus-visible:outline-none">
                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">Faol buyurtmalar mavjud emas</p>
                                <p className="text-xs text-gray-500 mt-1">Yangi xizmatga yozilish vaqti keldi!</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {upcomingBookings.map((booking, index) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        index={index}
                                        onCancel={handleCancelClick}
                                        onFeedback={handleFeedbackClick}
                                    />
                                ))}
                            </div>
                        )}

                        {hasMore && !isLoading && bookings.length > 0 && (
                            <div className="flex justify-center py-4">
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    className="rounded-full px-6"
                                >
                                    Ko'proq yuklash
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4 focus-visible:outline-none">
                        {pastBookings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <ChevronRight className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">Tarix topilmadi</p>
                                <p className="text-xs text-gray-500 mt-1">Siz hali hech qanday xizmatdan foydalanmagansiz</p>
                            </div>
                        ) : (
                            <div className="grid gap-3 opacity-90">
                                {pastBookings.map((booking, index) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        index={index}
                                        onFeedback={handleFeedbackClick}
                                    />
                                ))}
                            </div>
                        )}

                        {hasMore && !isLoading && bookings.length > 0 && (
                            <div className="flex justify-center py-4">
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    className="rounded-full px-6"
                                >
                                    Ko'proq yuklash
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* Cancel confirmation dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent className="rounded-2xl max-w-sm">
                    <AlertDialogHeader>
                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-center text-lg">Buyurtmani bekor qilish</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-sm">
                            Nima sababdan bekor qilmoqchisiz?
                            <div className="flex items-center justify-center gap-1 mt-2 text-destructive font-semibold bg-destructive/5 py-1.5 px-3 rounded-lg border border-destructive/10">
                                <AlertCircle className="w-4 h-4" />
                                <span>Buyurtmani bekor qilish: -5 ball va -5 tanga</span>
                            </div>
                        </AlertDialogDescription>

                        <div className="py-2 text-left">
                            <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="grid gap-3">
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer transition-all">
                                    <RadioGroupItem value="reja_ozgardi" id="r1" />
                                    <Label htmlFor="r1" className="flex-1 cursor-pointer font-medium">Rejalarim o'zgardi</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer transition-all">
                                    <RadioGroupItem value="xatolik" id="r2" />
                                    <Label htmlFor="r2" className="flex-1 cursor-pointer font-medium">Xatolik sabab bron qilib qo'ydim</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer transition-all">
                                    <RadioGroupItem value="boshqa_joy" id="r3" />
                                    <Label htmlFor="r3" className="flex-1 cursor-pointer font-medium">Boshqa joy topdim</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer transition-all">
                                    <RadioGroupItem value="boshqa" id="r4" />
                                    <Label htmlFor="r4" className="flex-1 cursor-pointer font-medium">Boshqa</Label>
                                </div>
                            </RadioGroup>

                            {cancelReason === "boshqa" && (
                                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                    <Input
                                        placeholder="Sababini yozing..."
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            )}
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="grid grid-cols-2 gap-2 mt-2">
                        <AlertDialogCancel disabled={isCancelling} className="mt-0 rounded-xl h-11 border-gray-200">Qaytish</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCancel}
                            disabled={isCancelling || !cancelReason || (cancelReason === 'boshqa' && !otherReason.trim())}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl h-11 flex flex-col items-center justify-center leading-tight py-1"
                        >
                            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            <span>Bekor qilish</span>
                            <span className="text-[10px] opacity-80 font-normal">Jarima (-5 ball, -5 tanga)</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Feedback modal */}
            {(() => {
                const booking = feedbackBookingId ? bookings.find(b => b.id === feedbackBookingId) : null;
                let category = 'default';
                if (booking && booking.promotion) {
                    const salonId = booking.promotion.salon_id;
                    const salon = [...featuredSalons, ...nearbySalons].find(s => s.id === salonId);
                    if (salon) {
                        category = salon.category;
                    } else {
                        // Fallback for fake bookings if they don't exactly match mockData IDs or if mockData is limited
                        if (booking.promotion.service_name.toLowerCase().includes('soch')) category = 'hair';
                        else if (booking.promotion.service_name.toLowerCase().includes('makiyaj')) category = 'makeup';
                        else if (booking.promotion.service_name.toLowerCase().includes('manikyur') || booking.promotion.service_name.toLowerCase().includes('pedikyur')) category = 'nails';
                        else if (booking.promotion.service_name.toLowerCase().includes('yuz') || booking.promotion.service_name.toLowerCase().includes('facial')) category = 'skincare';
                        else if (booking.promotion.service_name.toLowerCase().includes('spa') || booking.promotion.service_name.toLowerCase().includes('massaj') || booking.promotion.service_name.toLowerCase().includes('aromaterapiya')) category = 'spa';
                        else if (booking.promotion.service_name.toLowerCase().includes('qosh') || booking.promotion.service_name.toLowerCase().includes('kiprik')) category = 'brows';
                        else if (booking.promotion.service_name.toLowerCase().includes('kelin')) category = 'wedding';
                        else if (booking.promotion.service_name.toLowerCase().includes('vip')) category = 'premium';
                    }
                }

                return (
                    <FeedbackModal
                        bookingId={feedbackBookingId}
                        isOpen={feedbackModalOpen}
                        onClose={handleFeedbackClose}
                        isLottery={booking?.is_winner || false}
                        category={category}
                    />
                );
            })()}
        </div >
    );
};

export default ClientBookings;
