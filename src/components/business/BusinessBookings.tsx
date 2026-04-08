import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import {
    Calendar, Check, X, CheckCircle, User, Phone,
    Clock, RefreshCw, Filter, MoreHorizontal, Coins, CreditCard, Wallet, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBusinessBookings } from "@/hooks/useBusinessBookings";
import { useBlockedSlots } from "@/hooks/useBlockedSlots";
import { BusinessSchedule } from "./BusinessSchedule";
import { LayoutList, CalendarRange } from "lucide-react";

const BusinessBookings = () => {
    const { bookings: realBookings, loading, confirmBooking: confirmReal, cancelBooking: cancelReal, completeBooking: completeReal, refetch } = useBusinessBookings();
    const { blockedSlots, blockTimeSlot, unblockTimeSlot } = useBlockedSlots();
    const [filter, setFilter] = useState("all");
    const [view, setView] = useState<'list' | 'calendar'>('list');

    // Debug: Log blocked slots
    React.useEffect(() => {
        console.log('BlockedSlots in BusinessBookings:', blockedSlots);
    }, [blockedSlots]);

    // Mock Bookings State
    const [mockBookings, setMockBookings] = useState([
        {
            id: "mock-4",
            promotion_id: "mock-prom-4",
            user_id: "mock-user-4",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            status: "completed",
            scheduled_date: new Date("2026-01-10T16:00:00").toISOString(),
            scheduled_time: "16:00",
            completed_at: new Date("2026-01-10T17:00:00").toISOString(),
            profile: { full_name: "Test Foydalanuvchi", phone: "+998 90 000 00 00" },
            promotion: { service_name: "Soch Bo'yash", original_price: 150000, salon_name: "Mock Salon" },
            paymentMethod: "cash",
            paymentStatus: "paid"
        },
        {
            id: "mock-5",
            promotion_id: "mock-prom-5",
            user_id: "mock-user-5",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: null,
            status: "cancelled",
            scheduled_date: null,
            scheduled_time: null,
            profile: { full_name: "Test Foydalanuvchi", phone: "+998 90 000 00 00" },
            promotion: { service_name: "Qosh Dizayni", original_price: 50000, salon_name: "Mock Salon" },
            paymentMethod: "card",
            paymentStatus: "unpaid"
        },
        {
            id: "mock-6",
            promotion_id: "mock-prom-6",
            user_id: "mock-user-6",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: null,
            status: "cancelled",
            scheduled_date: null,
            scheduled_time: null,
            profile: { full_name: "Test Foydalanuvchi", phone: "+998 90 000 00 00" },
            promotion: { service_name: "Premium Soch Kesish", original_price: 200000, salon_name: "Mock Salon" },
            paymentMethod: "coin",
            paymentStatus: "unpaid"
        },
        {
            id: "mock-7",
            promotion_id: "mock-prom-7",
            user_id: "mock-user-7",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            status: "completed",
            scheduled_date: new Date("2026-01-22T10:30:00").toISOString(),
            scheduled_time: "10:30",
            profile: { full_name: "Test Foydalanuvchi", phone: "+998 90 000 00 00" },
            promotion: { service_name: "Manikur + Pedikur", original_price: 180000, salon_name: "Mock Salon" },
            paymentMethod: "card",
            paymentStatus: "paid"
        },
        {
            id: "mock-8",
            promotion_id: "mock-prom-8",
            user_id: "mock-user-8",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            status: "completed",
            scheduled_date: new Date("2026-01-20T14:00:00").toISOString(),
            scheduled_time: "14:00",
            profile: { full_name: "Test Foydalanuvchi", phone: "+998 90 000 00 00" },
            promotion: { service_name: "Yuz Parvarishi", original_price: 120000, salon_name: "Mock Salon" },
            paymentMethod: "coin",
            paymentStatus: "paid"
        },
        {
            id: "mock-1",
            promotion_id: "mock-prom-1",
            user_id: "mock-user-1",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: null,
            status: "pending",
            scheduled_date: new Date("2026-01-23T14:30:00").toISOString(),
            scheduled_time: "14:30",
            profile: { full_name: "Aziza Rahimova", phone: "+998 90 123 45 67" },
            promotion: { service_name: "Soch bo'yash va turmaklash", original_price: 450000, salon_name: "Mock Salon" },
            paymentMethod: "card",
            paymentStatus: "unpaid"
        },
        {
            id: "mock-2",
            promotion_id: "mock-prom-2",
            user_id: "mock-user-2",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: null,
            status: "pending",
            scheduled_date: new Date("2026-01-24T10:00:00").toISOString(),
            scheduled_time: "10:00",
            profile: { full_name: "Malika Karimova", phone: "+998 93 987 65 43" },
            promotion: { service_name: "Yuz tozalash (Premium)", original_price: 300000, salon_name: "Mock Salon" },
            paymentMethod: "cash",
            paymentStatus: "unpaid"
        },
        {
            id: "mock-3",
            promotion_id: "mock-prom-3",
            user_id: "mock-user-3",
            is_winner: false,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: null,
            status: "confirmed",
            scheduled_date: new Date("2026-01-25T16:00:00").toISOString(),
            scheduled_time: "16:00",
            profile: { full_name: "Sevara Aliyeva", phone: "+998 99 111 22 33" },
            promotion: { service_name: "Kechki makiyaj", original_price: 250000, salon_name: "Mock Salon" },
            paymentMethod: "coin",
            paymentStatus: "paid"
        },
        {
            id: "mock-free",
            promotion_id: "mock-prom-free",
            user_id: "mock-user-free",
            is_winner: true,
            booked_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            completed_at: null,
            status: "pending",
            scheduled_date: new Date("2026-01-26T12:00:00").toISOString(),
            scheduled_time: "12:00",
            profile: { full_name: "Lola (Aksiya G'olibi)", phone: "+998 90 999 99 99" },
            promotion: { service_name: "Soch Turmaklash (Yutuq)", original_price: 0, salon_name: "Mock Salon" },
            paymentMethod: "promotion",
            paymentStatus: "paid"
        }
    ]);

    // Combine Real and Mock Bookings
    const bookings = [...(realBookings || []), ...mockBookings];

    // Wrapped Actions
    const handleAction = async (id: string, action: string) => {
        if (id.startsWith("mock-")) {
            setMockBookings(prev => prev.map(b => {
                if (b.id === id) {
                    if (action === "confirm") return { ...b, status: "confirmed" };
                    if (action === "cancel") return { ...b, status: "cancelled" };
                    if (action === "complete") return { ...b, status: "completed" };
                }
                return b;
            }));
            return;
        }

        if (action === "confirm") await confirmReal(id);
        if (action === "cancel") await cancelReal(id);
        if (action === "complete") await completeReal(id);
    };

    // Stats
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;

    // Filtered bookings
    const filteredBookings = bookings.filter(booking => {
        if (filter === "all") return true;
        if (filter === "history") return booking.status === "completed" || booking.status === "cancelled";
        return booking.status === filter;
    }).sort((a, b) => {
        const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
        const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
        return dateB - dateA;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Kutilmoqda</Badge>;
            case 'confirmed':
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Tasdiqlangan</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Bajarilgan</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200">Bekor qilingan</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 flexflex-col items-center justify-center text-center shadow-sm border-amber-100 bg-amber-50/50">
                    <span className="text-2xl font-bold text-amber-600 mb-1">{pendingCount}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700/70 tracking-wider">Kutilmoqda</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center shadow-sm border-blue-100 bg-blue-50/50">
                    <span className="text-2xl font-bold text-blue-600 mb-1">{confirmedCount}</span>
                    <span className="text-[10px] uppercase font-bold text-blue-700/70 tracking-wider">Tasdiqlangan</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center shadow-sm border-green-100 bg-green-50/50">
                    <span className="text-2xl font-bold text-green-600 mb-1">{completedCount}</span>
                    <span className="text-[10px] uppercase font-bold text-green-700/70 tracking-wider">Bajarilgan</span>
                </Card>
            </div>

            {/* Filter Tabs */}
            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* View Toggle */}
                {/* View Toggle */}
                <div className="bg-muted p-1 rounded-lg">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setView('list')}
                            title="Ro'yxat ko'rinishi"
                        >
                            <LayoutList className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === 'calendar' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setView('calendar')}
                            title="Jadval ko'rinishi"
                        >
                            <CalendarRange className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {view === 'list' && (
                    <div className="flex-1 flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        <div className="flex p-1 bg-muted rounded-lg w-full sm:w-auto">
                            <Button
                                variant={filter === 'all' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-8 text-xs rounded-md px-3 ${filter === 'all' ? 'shadow-sm bg-background text-foreground' : 'text-muted-foreground'}`}
                                onClick={() => setFilter('all')}
                            >
                                Barchasi
                            </Button>
                            <Button
                                variant={filter === 'pending' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-8 text-xs rounded-md px-3 ${filter === 'pending' ? 'shadow-sm bg-background text-amber-600' : 'text-muted-foreground'}`}
                                onClick={() => setFilter('pending')}
                            >
                                Kutilmoqda
                            </Button>
                            <Button
                                variant={filter === 'confirmed' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-8 text-xs rounded-md px-3 ${filter === 'confirmed' ? 'shadow-sm bg-background text-blue-600' : 'text-muted-foreground'}`}
                                onClick={() => setFilter('confirmed')}
                            >
                                Tasdiq
                            </Button>
                            <Button
                                variant={filter === 'completed' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-8 text-xs rounded-md px-3 ${filter === 'completed' ? 'shadow-sm bg-background text-green-600' : 'text-muted-foreground'}`}
                                onClick={() => setFilter('completed')}
                            >
                                Bajarildi
                            </Button>
                            <Button
                                variant={filter === 'history' ? 'secondary' : 'ghost'}
                                size="sm"
                                className={`h-8 text-xs rounded-md px-3 ${filter === 'history' ? 'shadow-sm bg-background text-gray-600' : 'text-muted-foreground'}`}
                                onClick={() => setFilter('history')}
                            >
                                Tarix
                            </Button>
                        </div>
                    </div>
                )}

                <div className="ml-auto">
                    <Button variant="outline" size="sm" onClick={refetch} className="h-9 w-9 p-0">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {view === 'calendar' ? (
                <div className="w-full animate-in fade-in duration-300">
                    <BusinessSchedule
                        bookings={bookings}
                        onBlockSlot={blockTimeSlot}
                        onUnblockSlot={unblockTimeSlot}
                    />
                </div>
            ) : (
                /* Bookings List */
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredBookings.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 text-center"
                            >
                                <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">Buyurtmalar topilmadi</p>
                                <p className="text-xs text-muted-foreground/60">Hozircha bu bo'lim bo'sh</p>
                            </motion.div>
                        ) : (
                            filteredBookings.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow bg-card">
                                        <div className="p-4">
                                            <div className="flex gap-4">
                                                {/* Avatar / Icon */}
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-6 h-6 text-primary" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h4 className="font-bold text-base truncate pr-2">
                                                                {booking.profile?.full_name || "Mijoz"}
                                                            </h4>
                                                            <p className="text-sm text-primary font-medium truncate">
                                                                {booking.promotion?.service_name || "Xizmat"}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {booking.promotion?.original_price === 0 ? (
                                                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 h-5 text-[10px]">
                                                                        <Gift className="w-3 h-3 mr-1" />
                                                                        Bepul (Aksiya)
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-xs font-semibold text-muted-foreground">
                                                                        {booking.promotion?.original_price ? booking.promotion.original_price.toLocaleString('ru-RU') + " so'm" : ""}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            {getStatusBadge(booking.status)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>
                                                                {booking.scheduled_date
                                                                    ? format(new Date(booking.scheduled_date), "d MMM, yyyy", { locale: uz })
                                                                    : "--"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>
                                                                {booking.scheduled_time || "--:--"}
                                                            </span>
                                                        </div>
                                                        {booking.profile?.phone && (
                                                            <div className="flex items-center gap-1 text-foreground">
                                                                <Phone className="w-3.5 h-3.5" />
                                                                <span>{booking.profile.phone}</span>
                                                            </div>
                                                        )}

                                                        {/* Payment Info */}
                                                        {(booking as any).paymentMethod && (booking as any).paymentMethod !== 'promotion' && (
                                                            <div className="flex items-center gap-2 pl-2 border-l">
                                                                <div className="flex items-center gap-1 text-foreground" title="To'lov turi">
                                                                    {(booking as any).paymentMethod === 'card' && <CreditCard className="w-3.5 h-3.5 text-blue-500" />}
                                                                    {(booking as any).paymentMethod === 'cash' && <Wallet className="w-3.5 h-3.5 text-green-500" />}
                                                                    {(booking as any).paymentMethod === 'coin' && <Coins className="w-3.5 h-3.5 text-amber-500" />}
                                                                    <span className="capitalize">{(booking as any).paymentMethod === 'coin' ? 'Tanga' : (booking as any).paymentMethod === 'cash' ? 'Naqd' : 'Karta'}</span>
                                                                </div>
                                                                <Badge variant={(booking as any).paymentStatus === 'paid' ? "secondary" : "outline"} className={`text-[10px] h-5 ${(booking as any).paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'text-amber-600'}`}>
                                                                    {(booking as any).paymentStatus === 'paid' ? "To'landi" : "To'lanmagan"}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {booking.status === 'pending' && (
                                                <div className="flex gap-2 mt-4 pt-3 border-t">
                                                    <Button
                                                        className="flex-1 bg-green-600 hover:bg-green-700 h-9"
                                                        size="sm"
                                                        onClick={() => handleAction(booking.id, "confirm")}
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Tasdiqlash
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 h-9"
                                                        size="sm"
                                                        onClick={() => handleAction(booking.id, "cancel")}
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Bekor qilish
                                                    </Button>
                                                </div>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <div className="flex gap-2 mt-4 pt-3 border-t">
                                                    <Button
                                                        className="flex-1 h-9"
                                                        size="sm"
                                                        onClick={() => handleAction(booking.id, "complete")}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Bajarildi
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-rose-600 focus:text-rose-600"
                                                                onClick={() => handleAction(booking.id, "cancel")}
                                                            >
                                                                <X className="w-4 h-4 mr-2" />
                                                                Bekor qilish
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default BusinessBookings;
