import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Ban, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/hooks/useBusinessBookings";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlockSlotDialog } from "./BlockSlotDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDateLocale } from "@/utils/dateLocale";

export interface BlockedSlot {
    id: string;
    blocked_date: string;
    blocked_time: string;
    reason?: string | null;
}

interface BusinessScheduleProps {
    bookings: Booking[];
    blockedSlots?: BlockedSlot[];
    onBlockSlot?: (date: string, time: string, reason?: string) => void;
    onUnblockSlot?: (blockingId: string) => void;
}

export const BusinessSchedule = ({ bookings, blockedSlots = [], onBlockSlot, onUnblockSlot }: BusinessScheduleProps) => {
    const { language } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);

    // Generate week days
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    // Time slots (9:00 to 18:00)
    const timeSlots = Array.from({ length: 10 }, (_, i) => {
        const hour = i + 9;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    const getBookingsForSlot = (date: Date, time: string) => {
        const dateStr = format(date, 'yyyy-MM-dd');

        // Get regular bookings
        const regularBookings = bookings.filter(booking => {
            if (!booking.scheduled_date || !booking.scheduled_time) return false;

            const bookingDate = new Date(booking.scheduled_date);
            const isDateMatch = isSameDay(bookingDate, date);

            // Check hour match
            const bookingHour = parseInt(booking.scheduled_time.split(':')[0]);
            const slotHour = parseInt(time.split(':')[0]);

            return isDateMatch && bookingHour === slotHour && booking.status !== 'cancelled';
        });

        // Get blocked slots for this time
        const blockedSlotItems = blockedSlots.filter(slot => {
            if (!slot.blocked_date || !slot.blocked_time) return false;

            const isDateMatch = slot.blocked_date === dateStr;
            const slotHour = parseInt(slot.blocked_time.split(':')[0]);
            const timeHour = parseInt(time.split(':')[0]);

            return isDateMatch && slotHour === timeHour;
        }).map(slot => ({
            ...slot,
            status: 'blocked' as const,
            scheduled_date: slot.blocked_date,
            scheduled_time: slot.blocked_time,
        }));

        const combined = [...regularBookings, ...blockedSlotItems as any];

        // Debug: log when we find blocked slots
        if (blockedSlotItems.length > 0) {
            console.log('🟠 Found blocked slot!', {
                date: dateStr,
                time,
                blockedSlotItems
            });
        }

        return combined;
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return "";
        return timeStr.split(':').slice(0, 2).join(':');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
            case 'pending': return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
            case 'completed': return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
            case 'blocked': return "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const handleSlotClick = (date: Date, time: string) => {
        console.log('Slot clicked:', date, time);
        setSelectedSlot({ date, time });
        setIsBlockDialogOpen(true);
    };

    const handleConfirmBlock = (date: string, time: string, reason?: string) => {
        console.log('Block confirmed:', date, time, reason);
        if (onBlockSlot) {
            onBlockSlot(date, time, reason);
        }
    };

    const handleUnblock = (blockingId: string) => {
        console.log('Unblock requested:', blockingId);
        if (onUnblockSlot) {
            onUnblockSlot(blockingId);
        }
    };

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <h2 className="text-lg sm:text-xl font-bold capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: getDateLocale(language) })}
                        </h2>
                        <div className="flex items-center bg-secondary rounded-lg p-0.5">
                            <Button variant="ghost" size="icon" onClick={prevWeek} className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-background rounded-md">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={today} className="h-7 sm:h-8 px-2 sm:px-3 text-xs font-medium hover:bg-background rounded-md">
                                Bugun
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextWeek} className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-background rounded-md">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-200"></div>
                            <span>Tasdiqlangan</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-200"></div>
                            <span>Kutilmoqda</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-100 border border-green-200"></div>
                            <span>Bajarilgan</span>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-background rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                    {/* Days Header */}
                    <div className="flex border-b divide-x bg-muted/30">
                        <div className="w-14 sm:w-16 flex-shrink-0 p-2 text-center text-[10px] uppercase font-medium text-muted-foreground flex items-center justify-center">
                            Vaqt
                        </div>
                        <div className="flex-1 grid grid-cols-7 divide-x">
                            {weekDays.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className={cn(
                                        "text-center py-2 relative flex flex-col items-center justify-center gap-0.5 min-w-[40px]",
                                        isSameDay(day, new Date()) ? "bg-primary/5" : ""
                                    )}
                                >
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase hidden sm:block">
                                        {format(day, 'EEE', { locale: getDateLocale(language) })}
                                    </span>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase sm:hidden">
                                        {format(day, 'EEEEE', { locale: getDateLocale(language) })}
                                    </span>
                                    <div className={cn(
                                        "text-sm sm:text-base font-bold w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center",
                                        isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : "text-foreground"
                                    )}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="divide-y relative overflow-y-auto max-h-[600px]">
                        {timeSlots.map((time) => (
                            <div key={time} className="flex min-h-[60px]">
                                {/* Time Label */}
                                <div className="w-14 sm:w-16 flex-shrink-0 p-2 border-r text-xs font-medium text-muted-foreground text-center flex flex-col items-center justify-start bg-muted/10">
                                    <span className="-mt-1.5 bg-background px-1 rounded text-[10px] sm:text-xs">{time}</span>
                                </div>

                                {/* Days Cells */}
                                <div className="flex-1 grid grid-cols-7 divide-x">
                                    {weekDays.map((day) => {
                                        const slotBookings = getBookingsForSlot(day, time);

                                        return (
                                            <div
                                                key={day.toISOString()}
                                                className={cn(
                                                    "p-0.5 relative group transition-colors hover:bg-muted/30 min-w-[40px]",
                                                    isSameDay(day, new Date()) ? "bg-primary/[0.02]" : ""
                                                )}
                                            >
                                                <div className="flex flex-col gap-1 h-full">
                                                    {slotBookings.map(booking => {
                                                        if (booking.status === 'blocked') {
                                                            return (
                                                                <div
                                                                    key={booking.id}
                                                                    className={cn(
                                                                        "p-2 rounded-lg text-[11px] border-2 cursor-pointer transition-all group/blocked relative shadow-sm",
                                                                        "bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 hover:border-orange-400"
                                                                    )}
                                                                    onClick={() => handleUnblock(booking.id)}
                                                                    title="Bloklangan vaqt - o'chirish uchun bosing"
                                                                >
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Ban className="w-4 h-4 text-orange-600" />
                                                                            <span className="font-bold text-orange-800">BLOKLANGAN</span>
                                                                        </div>
                                                                        <X className="w-3.5 h-3.5 opacity-0 group-hover/blocked:opacity-100 text-orange-600" />
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-orange-700">
                                                                        <Clock className="w-3 h-3" />
                                                                        <span className="font-semibold">{formatTime(booking.scheduled_time || "")}</span>
                                                                    </div>
                                                                    {(booking as any).reason && (
                                                                        <div className="mt-1 text-[10px] text-orange-600 truncate">
                                                                            {(booking as any).reason}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <TooltipProvider key={booking.id}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div
                                                                            className={cn(
                                                                                "p-1 rounded text-[10px] border cursor-pointer truncate transition-all",
                                                                                getStatusColor(booking.status)
                                                                            )}
                                                                        >
                                                                            <div className="font-semibold truncate leading-tight">
                                                                                {booking.profile?.full_name?.split(' ')[0] || "Mijoz"}
                                                                            </div>
                                                                            <div className="flex items-center gap-0.5 opacity-80 text-[9px] leading-tight">
                                                                                <Clock className="w-2.5 h-2.5" />
                                                                                {formatTime(booking.scheduled_time || "")}
                                                                            </div>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="right" className="p-3 text-xs max-w-[200px]">
                                                                        <p className="font-bold mb-1">{booking.profile?.full_name}</p>
                                                                        <p className="text-muted-foreground mb-1">{booking.promotion?.service_name}</p>
                                                                        <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                                                            <Badge variant="outline" className="h-5 text-[10px]">
                                                                                {formatTime(booking.scheduled_time || "")}
                                                                            </Badge>
                                                                        </div>
                                                                        <p className="mt-1 font-mono text-xs">{booking.promotion?.original_price?.toLocaleString()} so'm</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        );
                                                    })}

                                                    {slotBookings.length === 0 && onBlockSlot && (
                                                        <div className="w-full h-full min-h-[50px] flex items-center justify-center">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleSlotClick(day, time);
                                                                }}
                                                                className="w-10 h-10 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all flex items-center justify-center group/block"
                                                                title="Vaqtni bloklash"
                                                                type="button"
                                                            >
                                                                <Ban className="w-5 h-5 text-orange-500 group-hover/block:text-orange-600" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BlockSlotDialog
                isOpen={isBlockDialogOpen}
                onClose={() => setIsBlockDialogOpen(false)}
                selectedDate={selectedSlot?.date || null}
                selectedTime={selectedSlot?.time || null}
                onConfirm={handleConfirmBlock}
            />
        </>
    );
};
