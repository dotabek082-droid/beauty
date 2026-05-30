import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Star,
  Megaphone,
  ChevronRight,
  Sparkles,
  Info,
  AlertTriangle,
  UserPlus,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BusinessBottomNav from "@/components/BusinessBottomNav";

// ─── Types ───
type ActivityType =
  | "booking_new"
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_completed"
  | "review_new"
  | "promotion_approved"
  | "promotion_rejected"
  | "promotion_pending"
  | "new_client";

type NewsType = "info" | "warning" | "feature" | "success";

interface ActivityNotification {
  id: string;
  type: ActivityType;
  title: string;
  statusLabel: string;
  message: string;
  time: string;
  navigateLabel: string;
  navigateTo: string;
  isRead: boolean;
}

interface NewsNotification {
  id: string;
  type: NewsType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

// ─── Mock Business Activity Data ───
const initialActivities: ActivityNotification[] = [
  {
    id: "ba1",
    type: "booking_new",
    title: "Yangi buyurtma 📋",
    statusLabel: "Yangi",
    message: 'Aziza Karimova "Soch turmagi" xizmatiga bugun soat 14:00 ga yozildi.',
    time: "15 daqiqa oldin",
    navigateLabel: "Buyurtmalarni ko'rish",
    navigateTo: "/business/bookings",
    isRead: false,
  },
  {
    id: "ba2",
    type: "booking_new",
    title: "Yangi buyurtma 📋",
    statusLabel: "Yangi",
    message: 'Dilnoza Rahimova "Manikur" xizmatiga ertaga soat 10:00 ga yozildi.',
    time: "45 daqiqa oldin",
    navigateLabel: "Buyurtmalarni ko'rish",
    navigateTo: "/business/bookings",
    isRead: false,
  },
  {
    id: "ba3",
    type: "review_new",
    title: "Yangi sharh ⭐",
    statusLabel: "Sharh",
    message: 'Malika Karimova: "Xizmat a\'lo darajada! Juda mamnunman." ⭐⭐⭐⭐⭐',
    time: "1 soat oldin",
    navigateLabel: "Sharhlarni ko'rish",
    navigateTo: "/business/reviews",
    isRead: false,
  },
  {
    id: "ba4",
    type: "promotion_approved",
    title: "Aksiya tasdiqlandi ✅",
    statusLabel: "Tasdiqlangan",
    message: '"Bahorgi Chegirma — Soch kesish 30% OFF" admin tomonidan tasdiqlandi va mijozlarga ko\'rinadi.',
    time: "2 soat oldin",
    navigateLabel: "Aksiyalarni ko'rish",
    navigateTo: "/business/promotions",
    isRead: false,
  },
  {
    id: "ba5",
    type: "promotion_pending",
    title: "Aksiya kutilmoqda ⏳",
    statusLabel: "Kutilmoqda",
    message: '"Yoz chegirmasi — Manikur 50% OFF" admin ko\'rib chiqishi kutilmoqda.',
    time: "3 soat oldin",
    navigateLabel: "Aksiyalarni ko'rish",
    navigateTo: "/business/promotions",
    isRead: false,
  },
  {
    id: "ba6",
    type: "booking_cancelled",
    title: "Buyurtma bekor qilindi ❌",
    statusLabel: "Bekor",
    message: 'Jasur Toshmatov "Soqol olish" xizmatidan voz kechdi (bugun 16:00).',
    time: "4 soat oldin",
    navigateLabel: "Buyurtmalarni ko'rish",
    navigateTo: "/business/bookings",
    isRead: true,
  },
  {
    id: "ba7",
    type: "booking_completed",
    title: "Xizmat yakunlandi 🎉",
    statusLabel: "Yakunlangan",
    message: 'Sardor Aliyev uchun "Soch kesish" muvaffaqiyatli yakunlandi.',
    time: "6 soat oldin",
    navigateLabel: "Buyurtmalarni ko'rish",
    navigateTo: "/business/bookings",
    isRead: true,
  },
  {
    id: "ba8",
    type: "new_client",
    title: "Yangi mijoz qo'shildi 👋",
    statusLabel: "Yangi mijoz",
    message: 'Nodira Usmanova ilk bor sizning salonga yozildi!',
    time: "1 kun oldin",
    navigateLabel: "Mijozlar",
    navigateTo: "/business/clients",
    isRead: true,
  },
];

// ─── Mock News Data ───
const initialNews: NewsNotification[] = [
  {
    id: "bn1",
    type: "feature",
    title: "Yangi funksiya: QR skanerlash 📱",
    message: "Endi mijozlar QR kod orqali ro'yxatdan o'tishi mumkin. Ilovada yangi QR skaner!",
    date: "1 May",
    isRead: false,
  },
  {
    id: "bn2",
    type: "info",
    title: "Statistika yangilandi 📊",
    message: "Biznes panelingizda yangi statistika grafiklari qo'shildi. Daromadingizni kuzating!",
    date: "28 Apr",
    isRead: false,
  },
  {
    id: "bn3",
    type: "success",
    title: "Premium obuna imkoniyati 👑",
    message: "Yangi Premium tarif rejalari chiqdi. Ko'proq aksiya va mijozlarga ega bo'ling!",
    date: "25 Apr",
    isRead: false,
  },
  {
    id: "bn4",
    type: "warning",
    title: "Texnik profilaktika ⚠️",
    message: "3-may kuni soat 02:00-04:00 orasida tizim vaqtincha to'xtatiladi.",
    date: "23 Apr",
    isRead: true,
  },
  {
    id: "bn5",
    type: "info",
    title: "Aksiya qoidalari yangilandi",
    message: "Aksiya yaratish uchun yangi qoidalar kuchga kirdi. Batafsil o'qing.",
    date: "20 Apr",
    isRead: true,
  },
];

// ─── Helper: icon per activity type ───
const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "booking_new":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-50 dark:from-blue-900/40 dark:to-sky-900/20 shadow-sm">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      );
    case "booking_confirmed":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
      );
    case "booking_cancelled":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-100 to-rose-50 dark:from-red-900/40 dark:to-rose-900/20 shadow-sm">
          <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
        </div>
      );
    case "booking_completed":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      );
    case "review_new":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/20 shadow-sm">
          <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
      );
    case "promotion_approved":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 shadow-sm">
          <Megaphone className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
      );
    case "promotion_rejected":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/20 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
      );
    case "promotion_pending":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/20 shadow-sm">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
      );
    case "new_client":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-50 dark:from-indigo-900/40 dark:to-violet-900/20 shadow-sm">
          <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      );
  }
};

// ─── Helper: badge per activity type ───
const getActivityBadge = (type: ActivityType, label: string) => {
  const colorMap: Record<ActivityType, string> = {
    booking_new: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    booking_confirmed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    booking_cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    booking_completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    review_new: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    promotion_approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    promotion_rejected: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    promotion_pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    new_client: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  };
  return (
    <Badge className={`${colorMap[type]} text-[10px] font-semibold border-0 px-2 py-0.5`}>
      {label}
    </Badge>
  );
};

// ─── Helper: news icon ───
const getNewsIcon = (type: NewsType) => {
  switch (type) {
    case "feature":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-50 dark:from-purple-900/40 dark:to-violet-900/20 shadow-sm">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      );
    case "warning":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/20 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
      );
    case "success":
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
      );
    default:
      return (
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-50 dark:from-blue-900/40 dark:to-sky-900/20 shadow-sm">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      );
  }
};

// ═══════════════════ MAIN COMPONENT ═══════════════════
const BusinessNotificationsPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityNotification[]>(initialActivities);
  const [news, setNews] = useState<NewsNotification[]>(initialNews);
  const [activeTab, setActiveTab] = useState<"activity" | "news">("activity");
  const [bottomNavTab] = useState("home");

  const unreadActivityCount = activities.filter((a) => !a.isRead).length;
  const unreadNewsCount = news.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    if (activeTab === "activity") {
      setActivities((prev) => prev.map((a) => ({ ...a, isRead: true })));
    } else {
      setNews((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleActivityClick = (item: ActivityNotification) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, isRead: true } : a))
    );
    if (item.navigateTo) {
      navigate(item.navigateTo);
    }
  };

  const handleNewsClick = (item: NewsNotification) => {
    setNews((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-4 safe-top">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/business")}
              className="rounded-xl hover:bg-muted/80"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Bildirishnomalar
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs text-primary hover:text-primary/80 hover:bg-primary/5 rounded-xl h-8 gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Barchasini o'qish
          </Button>
        </div>
      </div>

      {/* ─── Tab Buttons ─── */}
      <div className="sticky top-[65px] z-30 bg-background/95 backdrop-blur-xl border-b border-border/30">
        <div className="flex px-4 gap-1 py-2">
          {/* Faoliyat Tab */}
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 ${
              activeTab === "activity"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>Faoliyat</span>
            {unreadActivityCount > 0 && (
              <span
                className={`min-w-[20px] h-5 rounded-full text-[11px] font-bold flex items-center justify-center px-1.5 ${
                  activeTab === "activity"
                    ? "bg-white/25 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {unreadActivityCount}
              </span>
            )}
          </button>

          {/* Yangiliklar Tab */}
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 relative flex items-center justify-center gap-2 ${
              activeTab === "news"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>Yangiliklar</span>
            {unreadNewsCount > 0 && (
              <span
                className={`min-w-[20px] h-5 rounded-full text-[11px] font-bold flex items-center justify-center px-1.5 ${
                  activeTab === "news"
                    ? "bg-white/25 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {unreadNewsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="px-4 pt-3">
        <AnimatePresence mode="wait">
          {activeTab === "activity" ? (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Bell className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Yangi faoliyat yo'q
                  </p>
                </div>
              ) : (
                activities.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                  >
                    <div
                      onClick={() => handleActivityClick(item)}
                      className={`flex gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 group border ${
                        !item.isRead
                          ? "bg-primary/[0.03] border-primary/10 hover:bg-primary/[0.06] shadow-sm"
                          : "bg-card border-transparent hover:bg-muted/50"
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0 mt-0.5">
                        {getActivityIcon(item.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-[13px] font-bold leading-tight ${
                                !item.isRead
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {item.title}
                            </h4>
                            {getActivityBadge(item.type, item.statusLabel)}
                          </div>
                          {!item.isRead && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1 ring-2 ring-primary/20" />
                          )}
                        </div>

                        {/* Message */}
                        <p
                          className={`text-xs mt-1.5 leading-relaxed ${
                            !item.isRead
                              ? "text-foreground/75"
                              : "text-muted-foreground/80"
                          }`}
                        >
                          {item.message}
                        </p>

                        {/* Footer: time + navigate */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground/40" />
                            <span className="text-[10px] text-muted-foreground/60 font-medium">
                              {item.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 text-primary/60 group-hover:text-primary transition-colors">
                            <span className="text-[10px] font-semibold">
                              {item.navigateLabel}
                            </span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {news.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Hozircha yangiliklar yo'q
                  </p>
                </div>
              ) : (
                news.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                  >
                    <div
                      onClick={() => handleNewsClick(item)}
                      className={`flex gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        !item.isRead
                          ? "bg-primary/[0.03] border-primary/10 hover:bg-primary/[0.06] shadow-sm"
                          : "bg-card border-transparent hover:bg-muted/50"
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0 mt-0.5">
                        {getNewsIcon(item.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-[13px] font-bold leading-tight ${
                              !item.isRead
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!item.isRead && (
                              <div className="w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-primary/20" />
                            )}
                            <span className="text-[10px] text-muted-foreground/60 font-medium whitespace-nowrap">
                              {item.date}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`text-xs mt-1.5 leading-relaxed ${
                            !item.isRead
                              ? "text-foreground/75"
                              : "text-muted-foreground/80"
                          }`}
                        >
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BusinessBottomNav activeTab={bottomNavTab} onTabChange={() => navigate("/business")} />
    </div>
  );
};

export default BusinessNotificationsPage;
