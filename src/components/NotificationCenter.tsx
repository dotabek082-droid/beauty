import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Info, AlertTriangle, Sparkles, CheckCircle2, Calendar, XCircle, Star, Megaphone, Clock, ChevronRight, Gift, Percent, Tag } from "lucide-react";
import { getNews, NewsItem } from "@/data/newsData";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { mockPromotions } from "@/data/promotionData";

// Types for activity notifications (both client and business)
type ActivityType =
    // Business types
    'booking_new' | 'booking_cancelled' | 'booking_completed' |
    'review_new' | 'promotion_approved' | 'promotion_rejected' | 'promotion_pending' |
    // Client types
    'client_booking_confirmed' | 'client_booking_scheduled' | 'client_booking_completed' |
    'client_booking_pending' | 'client_booking_cancelled' |
    'client_promo_new' | 'client_promo_lottery' | 'client_promo_free' | 'client_promo_discount';

interface ActivityNotification {
    id: string;
    type: ActivityType;
    title: string;
    message: string;
    date: Date;
    read: boolean;
    navigateTo?: string;
}

const NotificationCenter = () => {
    const navigate = useNavigate();
    const { user, isRole } = useAuth();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [activityNotifications, setActivityNotifications] = useState<ActivityNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'activity' | 'system'>('activity');

    const isBusiness = isRole('business_owner');

    // Load system news
    useEffect(() => {
        const allNews = getNews();
        let userRole: 'admin' | 'business' | 'client' = 'client';
        if (isRole('admin')) userRole = 'admin';
        else if (isRole('business_owner')) userRole = 'business';

        const relevantNews = allNews.filter(n => n.target === 'all' || n.target === userRole);
        const readNewsIds = JSON.parse(localStorage.getItem(`read_news_${user?.id || 'guest'}`) || '[]');
        const processedNews = relevantNews.map(n => ({
            ...n,
            read: readNewsIds.includes(n.id)
        }));
        setNews(processedNews);
    }, [user, isRole, isOpen]);

    // Load activity notifications
    useEffect(() => {
        if (!user) {
            setActivityNotifications([]);
            return;
        }

        const activities: ActivityNotification[] = [];
        const now = new Date();

        if (isBusiness) {
            // ========== BUSINESS OWNER NOTIFICATIONS ==========

            // 1. Process Reviews from localStorage (consolidated)
            try {
                const storedReviews = localStorage.getItem('user_reviews');
                if (storedReviews) {
                    const reviews = JSON.parse(storedReviews);
                    if (Array.isArray(reviews) && reviews.length > 0) {
                        const sorted = [...reviews].sort((a, b) =>
                            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
                        );
                        if (sorted.length >= 3) {
                            activities.push({
                                id: 'reviews-summary',
                                type: 'review_new',
                                title: `${sorted.length} ta yangi sharh`,
                                message: `Mijozlaringizdan ${sorted.length} ta yangi sharh keldi. Batafsil ko'rish uchun bosing.`,
                                date: new Date(sorted[0].date || Date.now()),
                                read: false,
                                navigateTo: '/business/reviews'
                            });
                        }
                        sorted.slice(0, 2).forEach((review: any, idx: number) => {
                            activities.push({
                                id: `review-${review.id || idx}`,
                                type: 'review_new',
                                title: 'Yangi sharh',
                                message: `${review.userName || 'Mijoz'}: "${(review.comment || 'Yaxshi xizmat!').slice(0, 80)}" ${'⭐'.repeat(review.rating || 5)}`,
                                date: new Date(review.date || Date.now()),
                                read: false,
                                navigateTo: '/business/reviews'
                            });
                        });
                    }
                }
            } catch (e) { /* ignore */ }

            // 2. Process ALL Promotions from localStorage
            try {
                const storedPromos = localStorage.getItem('frontend_promotions_v7');
                if (storedPromos) {
                    const promos = JSON.parse(storedPromos);
                    if (Array.isArray(promos)) {
                        promos.forEach((promo: any) => {
                            let type: ActivityType = 'promotion_pending';
                            let title = 'Aksiya kutilmoqda';
                            let message = `"${promo.service_name || 'Aksiya'}" aksiyangiz admin ko'rib chiqishi kutilmoqda.`;
                            if (promo.status === 'approved') {
                                type = 'promotion_approved';
                                title = 'Aksiya tasdiqlandi';
                                message = `"${promo.service_name || 'Aksiya'}" aksiyangiz admin tomonidan tasdiqlandi.`;
                            } else if (promo.status === 'rejected') {
                                type = 'promotion_rejected';
                                title = 'Aksiya rad etildi';
                                message = `"${promo.service_name || 'Aksiya'}" aksiyangiz rad etildi. Qayta ko'rib chiqing.`;
                            }
                            activities.push({
                                id: `promo-${promo.status || 'pending'}-${promo.id}`,
                                type, title, message,
                                date: new Date(promo.updated_at || promo.created_at || Date.now()),
                                read: false,
                                navigateTo: '/business/promotions'
                            });
                        });
                    }
                }
            } catch (e) { /* ignore */ }

            // 3. Business DEMO data
            const businessDemos: ActivityNotification[] = [
                {
                    id: 'demo-booking-1', type: 'booking_new', title: 'Yangi buyurtma',
                    message: 'Aziza Karimova "Soch turmagi" xizmatiga bugun soat 14:00 ga yozildi.',
                    date: new Date(now.getTime() - 30 * 60000), read: false, navigateTo: '/business/bookings'
                },
                {
                    id: 'demo-booking-2', type: 'booking_new', title: 'Yangi buyurtma',
                    message: 'Dilnoza Rahimova "Manikur" xizmatiga ertaga soat 10:00 ga yozildi.',
                    date: new Date(now.getTime() - 2 * 3600000), read: false, navigateTo: '/business/bookings'
                },
                {
                    id: 'demo-review-1', type: 'review_new', title: 'Yangi sharh',
                    message: 'Malika Karimova: "Xizmat a\'lo darajada! Juda mamnunman." ⭐⭐⭐⭐⭐',
                    date: new Date(now.getTime() - 1 * 3600000), read: false, navigateTo: '/business/reviews'
                },
                {
                    id: 'demo-promo-approved', type: 'promotion_approved', title: 'Aksiya tasdiqlandi',
                    message: '"Bahorgi Chegirma — Soch kesish 30% OFF" tasdiqlandi va mijozlarga ko\'rinadi.',
                    date: new Date(now.getTime() - 3 * 3600000), read: false, navigateTo: '/business/promotions'
                },
                {
                    id: 'demo-promo-pending', type: 'promotion_pending', title: 'Aksiya kutilmoqda',
                    message: '"Yoz chegirmasi — Manikur 50% OFF" admin ko\'rib chiqishi kutilmoqda.',
                    date: new Date(now.getTime() - 45 * 60000), read: false, navigateTo: '/business/promotions'
                },
                {
                    id: 'demo-cancelled', type: 'booking_cancelled', title: 'Buyurtma bekor qilindi',
                    message: 'Jasur Toshmatov "Soqol olish" xizmatidan voz kechdi (bugun 16:00).',
                    date: new Date(now.getTime() - 4 * 3600000), read: false, navigateTo: '/business/bookings'
                },
                {
                    id: 'demo-completed', type: 'booking_completed', title: 'Xizmat yakunlandi',
                    message: 'Sardor Aliyev uchun "Soch kesish" muvaffaqiyatli yakunlandi.',
                    date: new Date(now.getTime() - 6 * 3600000), read: false, navigateTo: '/business/bookings'
                }
            ];
            activities.push(...businessDemos);

        } else {
            // ========== CLIENT NOTIFICATIONS ==========

            // 1. Process client bookings from localStorage
            try {
                const localBookings = JSON.parse(localStorage.getItem('user_bookings') || '{}');
                const userLocalBookings = localBookings[user.id] || [];
                if (Array.isArray(userLocalBookings)) {
                    userLocalBookings.forEach((booking: any) => {
                        let type: ActivityType = 'client_booking_pending';
                        let title = 'Buyurtma kutilmoqda';
                        let badgeMsg = 'kutilmoqda';

                        if (booking.status === 'confirmed') {
                            type = 'client_booking_confirmed'; title = 'Buyurtma tasdiqlandi'; badgeMsg = 'tasdiqlandi';
                        } else if (booking.status === 'scheduled') {
                            type = 'client_booking_scheduled'; title = 'Vaqt belgilandi'; badgeMsg = 'rejalashtirilgan';
                        } else if (booking.status === 'completed') {
                            type = 'client_booking_completed'; title = 'Xizmat yakunlandi'; badgeMsg = 'yakunlandi';
                        } else if (booking.status === 'cancelled') {
                            type = 'client_booking_cancelled'; title = 'Buyurtma bekor qilindi'; badgeMsg = 'bekor qilingan';
                        }

                        const salonName = booking.salon_name || 'Salon';
                        const serviceName = booking.service_name || 'Xizmat';
                        const dateStr = booking.scheduled_date ? format(new Date(booking.scheduled_date), 'd MMM', { locale: uz }) : '';
                        const timeStr = booking.scheduled_time || '';

                        activities.push({
                            id: `client-booking-${booking.id}`,
                            type, title,
                            message: `${salonName} — "${serviceName}"${dateStr ? ` ${dateStr}` : ''}${timeStr ? ` soat ${timeStr}` : ''}`,
                            date: new Date(booking.booked_at || Date.now()),
                            read: false,
                            navigateTo: '/bookings'
                        });
                    });
                }
            } catch (e) { /* ignore */ }

            // 2. New promotions available (from mockPromotions — active ones only)
            const activePromos = mockPromotions.filter(p => p.isActive && new Date(p.endsAt || '2099-01-01') > now);
            activePromos.forEach((promo) => {
                let type: ActivityType = 'client_promo_discount';
                let title = '🏷️ Yangi chegirma!';

                if (promo.lotteryEnabled) {
                    type = 'client_promo_lottery';
                    title = '🎰 Lotereya boshlanmoqda!';
                } else if (promo.originalPrice === 0 || promo.discountedPrice === 0) {
                    type = 'client_promo_free';
                    title = '🎁 Bepul xizmat!';
                } else if (promo.promotionType === '1+1') {
                    type = 'client_promo_new';
                    title = '🔥 1+1 Aksiya!';
                }

                const slotsLeft = promo.slotsAvailable - promo.slotsUsed;

                activities.push({
                    id: `client-promo-${promo.id}`,
                    type, title,
                    message: `${promo.salonName}: "${promo.serviceName}"${slotsLeft <= 5 ? ` — Faqat ${slotsLeft} ta joy qoldi!` : ''}`,
                    date: new Date(promo.startsAt),
                    read: false,
                    navigateTo: '/' // Home page where promotions are shown
                });
            });

            // 3. Client DEMO bookings (always visible for demo)
            const clientDemos: ActivityNotification[] = [
                {
                    id: 'client-demo-confirmed', type: 'client_booking_confirmed', title: 'Buyurtma tasdiqlandi ✅',
                    message: 'Oltin Qaychi — "Soch kesish" 2-fevral soat 11:00',
                    date: new Date(now.getTime() - 30 * 60000), read: false, navigateTo: '/bookings'
                },
                {
                    id: 'client-demo-pending', type: 'client_booking_pending', title: 'Buyurtma kutilmoqda',
                    message: "G'uncha Go'zallik — \"Makiyaj\" 5-fevral soat 14:00",
                    date: new Date(now.getTime() - 2 * 3600000), read: false, navigateTo: '/bookings'
                },
                {
                    id: 'client-demo-scheduled', type: 'client_booking_scheduled', title: 'Vaqt belgilandi 📅',
                    message: 'Lola Nails — "Manikyur" 3-fevral soat 10:30',
                    date: new Date(now.getTime() - 3 * 3600000), read: false, navigateTo: '/bookings'
                },
                {
                    id: 'client-demo-completed', type: 'client_booking_completed', title: 'Xizmat yakunlandi 🎉',
                    message: 'Oltin Qaychi — "Soch bo\'yash" muvaffaqiyatli yakunlandi. Sharh qoldiring!',
                    date: new Date(now.getTime() - 24 * 3600000), read: false, navigateTo: '/bookings'
                },
                {
                    id: 'client-demo-cancelled', type: 'client_booking_cancelled', title: 'Buyurtma bekor qilindi',
                    message: 'Glamour Hair — "Ayollar soch turmagi" bekor qilindi.',
                    date: new Date(now.getTime() - 48 * 3600000), read: false, navigateTo: '/bookings'
                }
            ];
            activities.push(...clientDemos);
        }

        // Sort all by date descending
        activities.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Apply read status from localStorage
        const readIds = JSON.parse(localStorage.getItem(`read_activity_${user.id}`) || '[]');
        const processed = activities.map(a => ({
            ...a,
            read: readIds.includes(a.id)
        }));

        setActivityNotifications(processed);
    }, [user, isBusiness, isOpen]);

    // Calculate total unread
    useEffect(() => {
        const unreadNews = news.filter(n => !n.read).length;
        const unreadActivity = activityNotifications.filter(a => !a.read).length;
        setUnreadCount(unreadNews + unreadActivity);
    }, [news, activityNotifications]);

    const markNewsAsRead = (id: string) => {
        const readNewsIds = JSON.parse(localStorage.getItem(`read_news_${user?.id || 'guest'}`) || '[]');
        if (!readNewsIds.includes(id)) {
            const newReadIds = [...readNewsIds, id];
            localStorage.setItem(`read_news_${user?.id || 'guest'}`, JSON.stringify(newReadIds));
            setNews(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }
    };

    const markActivityAsRead = (id: string) => {
        const readIds = JSON.parse(localStorage.getItem(`read_activity_${user?.id}`) || '[]');
        if (!readIds.includes(id)) {
            const newReadIds = [...readIds, id];
            localStorage.setItem(`read_activity_${user?.id}`, JSON.stringify(newReadIds));
            setActivityNotifications(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
        }
    };

    const markAllAsRead = () => {
        const allNewsIds = news.map(n => n.id);
        localStorage.setItem(`read_news_${user?.id || 'guest'}`, JSON.stringify(allNewsIds));
        setNews(prev => prev.map(n => ({ ...n, read: true })));

        if (user) {
            const allActivityIds = activityNotifications.map(a => a.id);
            localStorage.setItem(`read_activity_${user.id}`, JSON.stringify(allActivityIds));
            setActivityNotifications(prev => prev.map(a => ({ ...a, read: true })));
        }
        setUnreadCount(0);
    };

    // Handle notification click: mark as read, close sheet, navigate to URL
    const handleActivityClick = (item: ActivityNotification) => {
        markActivityAsRead(item.id);
        if (item.navigateTo) {
            setIsOpen(false);
            setTimeout(() => {
                navigate(item.navigateTo!);
            }, 200);
        }
    };

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            // Business icons
            case 'booking_new':
                return <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40"><Calendar className="w-5 h-5 text-blue-600" /></div>;
            case 'booking_cancelled':
                return <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40"><XCircle className="w-5 h-5 text-red-500" /></div>;
            case 'booking_completed':
                return <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>;
            case 'review_new':
                return <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/40"><Star className="w-5 h-5 text-yellow-600" /></div>;
            case 'promotion_approved':
                return <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40"><Megaphone className="w-5 h-5 text-emerald-600" /></div>;
            case 'promotion_rejected':
                return <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/40"><AlertTriangle className="w-5 h-5 text-orange-600" /></div>;
            case 'promotion_pending':
                return <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40"><Clock className="w-5 h-5 text-amber-600" /></div>;
            // Client booking icons
            case 'client_booking_confirmed':
                return <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>;
            case 'client_booking_scheduled':
                return <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40"><Calendar className="w-5 h-5 text-blue-600" /></div>;
            case 'client_booking_completed':
                return <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>;
            case 'client_booking_pending':
                return <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40"><Clock className="w-5 h-5 text-amber-600" /></div>;
            case 'client_booking_cancelled':
                return <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40"><XCircle className="w-5 h-5 text-red-500" /></div>;
            // Client promo icons
            case 'client_promo_lottery':
                return <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40"><Gift className="w-5 h-5 text-purple-600" /></div>;
            case 'client_promo_free':
                return <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/40"><Sparkles className="w-5 h-5 text-pink-600" /></div>;
            case 'client_promo_discount':
                return <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40"><Percent className="w-5 h-5 text-indigo-600" /></div>;
            case 'client_promo_new':
                return <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/40"><Tag className="w-5 h-5 text-orange-600" /></div>;
            default:
                return <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"><Info className="w-5 h-5 text-gray-500" /></div>;
        }
    };

    const getActivityBadge = (type: ActivityType) => {
        switch (type) {
            // Business badges
            case 'booking_new':
                return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-medium border-0">Buyurtma</Badge>;
            case 'booking_cancelled':
                return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-medium border-0">Bekor</Badge>;
            case 'booking_completed':
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-[10px] font-medium border-0">Yakunlandi</Badge>;
            case 'review_new':
                return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 text-[10px] font-medium border-0">Sharh</Badge>;
            case 'promotion_approved':
                return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-medium border-0">Tasdiqlandi</Badge>;
            case 'promotion_rejected':
                return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-[10px] font-medium border-0">Rad etildi</Badge>;
            case 'promotion_pending':
                return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-medium border-0">Kutilmoqda</Badge>;
            // Client booking badges
            case 'client_booking_confirmed':
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-[10px] font-medium border-0">Tasdiqlangan</Badge>;
            case 'client_booking_scheduled':
                return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-medium border-0">Rejalashtirilgan</Badge>;
            case 'client_booking_completed':
                return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-medium border-0">Yakunlangan</Badge>;
            case 'client_booking_pending':
                return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-medium border-0">Kutilmoqda</Badge>;
            case 'client_booking_cancelled':
                return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-medium border-0">Bekor</Badge>;
            // Client promo badges
            case 'client_promo_lottery':
                return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-medium border-0">Lotereya</Badge>;
            case 'client_promo_free':
                return <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 text-[10px] font-medium border-0">Bepul</Badge>;
            case 'client_promo_discount':
                return <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-[10px] font-medium border-0">Chegirma</Badge>;
            case 'client_promo_new':
                return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-[10px] font-medium border-0">1+1</Badge>;
            default:
                return null;
        }
    };

    const getNavigateLabel = (type: ActivityType) => {
        switch (type) {
            case 'booking_new': case 'booking_cancelled': case 'booking_completed':
                return "Buyurtmalarni ko'rish";
            case 'review_new':
                return "Sharhlarni ko'rish";
            case 'promotion_approved': case 'promotion_rejected': case 'promotion_pending':
                return "Aksiyalarni ko'rish";
            case 'client_booking_confirmed': case 'client_booking_scheduled':
            case 'client_booking_completed': case 'client_booking_pending': case 'client_booking_cancelled':
                return "Buyurtmalarim";
            case 'client_promo_lottery': case 'client_promo_free':
            case 'client_promo_discount': case 'client_promo_new':
                return "Aksiyani ko'rish";
            default:
                return "Batafsil";
        }
    };

    const getNewsIcon = (type: NewsItem['type']) => {
        switch (type) {
            case 'warning': return <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>;
            case 'success': return <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>;
            case 'feature': return <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40"><Sparkles className="w-5 h-5 text-purple-500" /></div>;
            default: return <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40"><Info className="w-5 h-5 text-blue-500" /></div>;
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHour = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Hozir';
        if (diffMin < 60) return `${diffMin} daqiqa oldin`;
        if (diffHour < 24) return `${diffHour} soat oldin`;
        if (diffDay < 7) return `${diffDay} kun oldin`;
        return format(date, 'd MMM', { locale: uz });
    };

    const unreadActivityCount = activityNotifications.filter(a => !a.read).length;
    const unreadNewsCount = news.filter(n => !n.read).length;

    // ─── Shared activity list renderer ───
    const renderActivityList = () => (
        <div className="p-2">
            {activityNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">Yangi faoliyat yo'q</p>
                </div>
            ) : (
                activityNotifications.map((item) => (
                    <div
                        key={item.id}
                        className={`flex gap-3 p-3 rounded-xl mb-1 cursor-pointer transition-all group ${!item.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                            }`}
                        onClick={() => handleActivityClick(item)}
                    >
                        <div className="shrink-0 mt-0.5">{getActivityIcon(item.type)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className={`text-sm font-semibold ${!item.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {item.title}
                                    </h4>
                                    {getActivityBadge(item.type)}
                                </div>
                                {!item.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />}
                            </div>
                            <p className={`text-xs mt-1 leading-relaxed ${!item.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                                {item.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-muted-foreground/50" />
                                    <span className="text-[10px] text-muted-foreground/60">{formatTimeAgo(item.date)}</span>
                                </div>
                                {item.navigateTo && (
                                    <div className="flex items-center gap-0.5 text-primary/70 group-hover:text-primary transition-colors">
                                        <span className="text-[10px] font-medium">{getNavigateLabel(item.type)}</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    // ─── Shared news list renderer ───
    const renderNewsList = () => (
        <div className="p-2">
            {news.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">Hozircha yangiliklar yo'q</p>
                </div>
            ) : (
                news.map((item) => (
                    <div
                        key={item.id}
                        className={`flex gap-3 p-3 rounded-xl mb-1 cursor-pointer transition-all ${!item.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                            }`}
                        onClick={() => markNewsAsRead(item.id)}
                    >
                        <div className="shrink-0 mt-0.5">{getNewsIcon(item.type)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-semibold ${!item.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {!item.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {format(new Date(item.date), 'd MMM', { locale: uz })}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                            <p className={`text-xs mt-1.5 leading-relaxed ${!item.read ? 'text-foreground/80' : 'text-muted-foreground/70'}`}>
                                {item.content}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 border-2 border-background rounded-full text-[10px] text-white font-bold flex items-center justify-center px-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background">
                {/* Header */}
                <SheetHeader className="p-4 pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg">Bildirishnomalar</SheetTitle>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7 text-primary">
                                <Check className="w-3 h-3 mr-1" />
                                Barchasini o'qish
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                {/* ===== TABBED VIEW (for both business and client when logged in) ===== */}
                {user ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Tab buttons */}
                        <div className="flex border-b bg-muted/30">
                            <button
                                onClick={() => setActiveSection('activity')}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${activeSection === 'activity' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>Faoliyat</span>
                                    {unreadActivityCount > 0 && (
                                        <span className="min-w-[20px] h-5 bg-red-500 rounded-full text-[11px] text-white font-bold flex items-center justify-center px-1.5">
                                            {unreadActivityCount}
                                        </span>
                                    )}
                                </div>
                                {activeSection === 'activity' && (
                                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveSection('system')}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${activeSection === 'system' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>Yangiliklar</span>
                                    {unreadNewsCount > 0 && (
                                        <span className="min-w-[20px] h-5 bg-blue-500 rounded-full text-[11px] text-white font-bold flex items-center justify-center px-1.5">
                                            {unreadNewsCount}
                                        </span>
                                    )}
                                </div>
                                {activeSection === 'system' && (
                                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <ScrollArea className="flex-1">
                            {activeSection === 'activity' ? renderActivityList() : renderNewsList()}
                        </ScrollArea>
                    </div>
                ) : (
                    /* ===== GUEST VIEW: System news only ===== */
                    <ScrollArea className="flex-1">
                        {renderNewsList()}
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default NotificationCenter;
