import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Info, AlertTriangle, Sparkles, CheckCircle2, Calendar, UserPlus, XCircle, Clock, Star, Megaphone } from "lucide-react";
import { getNews, NewsItem } from "@/data/newsData";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessBookings } from "@/hooks/useBusinessBookings"; // Assume this hook exists and returns bookings
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// Combined Notification Type
type NotificationType = 'booking_new' | 'booking_cancelled' | 'booking_completed' |
    'system_news' | 'system_warning' | 'system_feature' |
    'review_new' | 'promotion_status';

interface ConsolidatedNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    date: Date;
    read: boolean;
    data?: any; // To store original object if needed
}

const BusinessNotificationCenter = () => {
    const { user } = useAuth();
    const { bookings } = useBusinessBookings(); // Fetching operational data
    const [notifications, setNotifications] = useState<ConsolidatedNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("activity");

    useEffect(() => {
        if (!user) return;

        // 1. Process Operational Notifications (from Bookings)
        const operationalNotes: ConsolidatedNotification[] = bookings.map(booking => {
            let type: NotificationType = 'booking_new';
            let title = 'Yangi buyurtma';
            const clientName = booking.profile?.full_name || 'Noma\'lum mijoz';
            const serviceName = booking.promotion?.service_name || 'Xizmat';
            const time = booking.scheduled_time || '';

            let message = `${clientName} - ${serviceName} ${time ? `(${time})` : ''}`;

            if (booking.status === 'cancelled') {
                type = 'booking_cancelled';
                title = 'Buyurtma bekor qilindi';
            } else if (booking.status === 'completed') {
                type = 'booking_completed';
                title = 'Xizmat ko\'rsatildi';
            }

            return {
                id: `booking-${booking.id}-${booking.status}`,
                type,
                title,
                message,
                date: new Date(booking.created_at),
                read: false,
                data: booking
            };
        });

        // 2. Process Reviews
        const storedReviews = localStorage.getItem('user_reviews');
        let reviewNotes: ConsolidatedNotification[] = [];
        if (storedReviews) {
            const reviews = JSON.parse(storedReviews);
            // In real app, filter by business ID. Here we mock it or show all for demo if user has a bizId
            // Assuming user.id maps to a business owner who owns 'biz-1' etc.
            // For demo: Show reviews for 'biz-1' (Belleza Studio) or just show recent ones
            reviewNotes = reviews.slice(0, 5).map((review: any) => ({
                id: `review-${review.id}`,
                type: 'review_new' as NotificationType,
                title: 'Yangi sharh',
                message: `${review.user_name || 'Mijoz'}: ${review.comment.substring(0, 50)}...`,
                date: new Date(review.created_at),
                read: false,
                data: review
            }));
        }

        // 3. Process Promotions Status
        const storedPromos = localStorage.getItem('frontend_promotions_v7');
        let promoNotes: ConsolidatedNotification[] = [];
        if (storedPromos) {
            const promotions = JSON.parse(storedPromos);
            // Filter for status changes (active/rejected) 
            // In real app, we'd have a 'status_changed_at' or similar. 
            // Here we just show recent active/rejected ones as notifications.
            promoNotes = promotions
                .filter((p: any) => p.status === 'active' || p.status === 'rejected')
                .slice(0, 5) // Show top 5
                .map((promo: any) => ({
                    id: `promo-status-${promo.id}-${promo.status}`,
                    type: 'promotion_status' as NotificationType,
                    title: promo.status === 'active' ? 'Aksiya tasdiqlandi ✅' : 'Aksiya rad etildi ❌',
                    message: `${promo.service_name}: ${promo.status === 'active' ? 'Endi faol va mijozlarga ko\'rinadi.' : (promo.rejection_reason || 'Sabab ko\'rsatilmagan.')}`,
                    date: new Date(promo.created_at), // Should use updated_at if available
                    read: false,
                    data: promo
                }));
        }

        // 4. Process System News
        const allNews = getNews();
        const businessNews = allNews.filter(n => n.target === 'all' || n.target === 'business');

        const systemNotes: ConsolidatedNotification[] = businessNews.map(n => ({
            id: `news-${n.id}`,
            type: n.type === 'warning' ? 'system_warning' : n.type === 'feature' ? 'system_feature' : 'system_news',
            title: n.title,
            message: n.summary,
            date: new Date(n.date),
            read: false
        }));

        // 5. Merge and Set State
        let allNotes = [...operationalNotes, ...reviewNotes, ...promoNotes, ...systemNotes]
            .sort((a, b) => b.date.getTime() - a.date.getTime());


        // DEMO: Inject fake notifications if NO Reviews or Promotions exist (even if bookings exist)
        const hasReviewsOrPromos = allNotes.some(n => n.type.startsWith('review') || n.type.startsWith('promotion'));

        if (!hasReviewsOrPromos || true) { // FORCE DEMO FOR DEBUGGING
            console.log("Forcing demo...");
            const demoReview: ConsolidatedNotification = {
                id: 'demo-review',
                type: 'review_new',
                title: 'Yangi sharh (Demo)',
                message: 'Malika: Xizmat a\'lo darajada! Rahmat. ⭐⭐⭐⭐⭐',
                date: new Date(),
                read: false
            };
            const demoPromo: ConsolidatedNotification = {
                id: 'demo-promo',
                type: 'promotion_status',
                title: 'Aksiya tasdiqlandi (Demo) ✅',
                message: 'Bahorgi Chegirma aksiyasi admin tomonidan tasdiqlandi.',
                date: new Date(Date.now() - 3600000), // 1 hour ago
                read: false
            };
            allNotes = [demoReview, demoPromo, ...allNotes].sort((a, b) => b.date.getTime() - a.date.getTime());
        }

        // Mock read status loading
        const readIds = JSON.parse(localStorage.getItem(`read_notif_${user.id}`) || '[]');
        const finalNotes = allNotes.map(n => ({
            ...n,
            read: readIds.includes(n.id)
        }));

        setNotifications(finalNotes);
        setUnreadCount(finalNotes.filter(n => !n.read).length);

    }, [user, bookings, isOpen]);

    const markAsRead = (id: string) => {
        const readIds = JSON.parse(localStorage.getItem(`read_notif_${user?.id}`) || '[]');
        if (!readIds.includes(id)) {
            const newReadIds = [...readIds, id];
            localStorage.setItem(`read_notif_${user?.id}`, JSON.stringify(newReadIds));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        localStorage.setItem(`read_notif_${user?.id}`, JSON.stringify(allIds));
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'booking_new': return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'booking_cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'booking_completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'review_new': return <Star className="w-5 h-5 text-yellow-500" />;
            case 'promotion_status': return <Megaphone className="w-5 h-5 text-purple-500" />;
            case 'system_warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'system_feature': return <Sparkles className="w-5 h-5 text-teal-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    // Filter for tabs
    const activityNotifications = notifications.filter(n =>
        n.type.startsWith('booking') || n.type.startsWith('review') || n.type.startsWith('promotion')
    );
    const systemNotifications = notifications.filter(n => n.type.startsWith('system'));

    console.log("All Notifications:", notifications.length);
    console.log("Activity Notifications:", activityNotifications.length, activityNotifications);
    console.log("System Notifications:", systemNotifications.length);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full animate-pulse" />
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background/95 backdrop-blur-sm">
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle>Bildirishnomalar</SheetTitle>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                                <Check className="w-3 h-3 mr-1" />
                                O'qilgan
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                {/* DEBUG: Show raw counts */}
                <div className="px-4 py-2 bg-yellow-100 text-xs">
                    DEBUG: Activity={activityNotifications.length}, System={systemNotifications.length}, Active Tab={activeTab}
                </div>

                <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <div className="px-4 pt-2 bg-gray-50">
                        <TabsList className="grid w-full grid-cols-2 bg-white border">
                            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                Faoliyat ({activityNotifications.length})
                            </TabsTrigger>
                            <TabsTrigger value="system" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                Tizim ({systemNotifications.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 mt-2 h-[500px]">
                        <TabsContent value="activity" className="m-0 h-full p-4 bg-green-50">
                            <h3 className="font-bold mb-2">FAOLIYAT TAB CONTENT:</h3>
                            {activityNotifications.length > 0 ? (
                                activityNotifications.map(n => (
                                    <div key={n.id} className="mb-2 p-2 border rounded bg-white">
                                        {n.title} - {n.type}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-red-100">No Activity Loaded</div>
                            )}
                        </TabsContent>
                        <TabsContent value="system" className="m-0 bg-purple-50 p-4">
                            <h3 className="font-bold mb-2">TIZIM TAB CONTENT:</h3>
                            <NotificationList
                                items={systemNotifications}
                                onRead={markAsRead}
                                getIcon={getIcon}
                                emptyMsg="Tizim yangiliklari yo'q"
                            />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
};

// Sub-component for clean rendering
const NotificationList = ({ items, onRead, getIcon, emptyMsg }: {
    items: ConsolidatedNotification[],
    onRead: (id: string) => void,
    getIcon: (t: NotificationType) => React.ReactNode,
    emptyMsg: string
}) => {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-40">
                <Bell className="w-10 h-10 mb-3 opacity-20" />
                <p>{emptyMsg}</p>
            </div>
        );
    }

    return (
        <div className="divide-y">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer relative ${!item.read ? 'bg-primary/5' : ''}`}
                    onClick={() => onRead(item.id)}
                >
                    {!item.read && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
                    )}
                    <div className="flex gap-4">
                        <div className="mt-1 shrink-0 p-2 bg-background rounded-full shadow-sm">
                            {getIcon(item.type)}
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-semibold ${!item.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {item.title}
                                </h4>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {format(item.date, 'd MMM HH:mm', { locale: uz })}
                                </span>
                            </div>
                            <p className={`text-xs ${!item.read ? 'text-foreground/90' : 'text-muted-foreground'} line-clamp-2`}>
                                {item.message}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BusinessNotificationCenter;
