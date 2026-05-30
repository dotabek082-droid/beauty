import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Store, Plus, Scissors, Clock, LogOut, Edit, Trash2,
  Check, X, AlertCircle, Calendar, User, Phone, CheckCircle, XCircle,
  RefreshCw, Bell, Gift, Settings, Star, Briefcase, ChevronRight, Coins, Eye, ThumbsUp, ThumbsDown, ChevronLeft,
  CreditCard, ShieldCheck, Moon, Globe, HelpCircle, Mail, MessageSquare, AlertTriangle, Crown, TrendingUp, Sparkles
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useBusinessBookings } from "@/hooks/useBusinessBookings";
import { format } from "date-fns";
import CreatePromotionForm from "@/components/business/CreatePromotionForm";
import { CreatePromotionWizard } from "@/components/business/CreatePromotionWizard";
import { useFrontendPromotions } from "@/hooks/useFrontendPromotions";
import MyPromotions from "@/components/business/MyPromotions";
import HomeContent from "@/components/HomeContent";
import BusinessBottomNav from "@/components/BusinessBottomNav";
import EditProfileDialog from "@/components/business/EditProfileDialog";
import NotificationsManager from "@/components/business/NotificationsManager";
import NotificationCenter from "@/components/NotificationCenter";
import BusinessNotificationCenter from "@/components/business/BusinessNotificationCenter";
import SystemNews from "@/components/SystemNews";

import BusinessWallet from "@/components/business/BusinessWallet";
import BusinessPayments from "@/components/business/BusinessPayments";
import BusinessTrust from "@/components/business/BusinessTrust";
import BusinessBookings from "@/components/business/BusinessBookings";
import BusinessInbox from "@/components/business/BusinessInbox";
import { BusinessAnalyticsHome } from "@/components/business/BusinessAnalyticsHome";
import { MOCK_SERVICES } from "@/data/mockServices";
import { Service } from "@/types/service";

const initialServices: Service[] = MOCK_SERVICES;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Kutilmoqda</Badge>;
    case "confirmed":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Tasdiqlangan</Badge>;
    case "completed":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Bajarilgan</Badge>;
    case "cancelled":
      return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Bekor qilingan</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

import { getBusinessSubscriptionStatus, upgradeBusinessSubscription } from "@/utils/subscriptionUtils";
import { BusinessSubscriptionTier } from "@/data/subscriptionOptions";
import { useBusinessServices } from "@/hooks/useBusinessServices";

const BusinessDashboard = () => {
  const { user, profile, signOut, isRole, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookings, loading: bookingsLoading, confirmBooking, cancelBooking, completeBooking, refetch } = useBusinessBookings();
  const { services: fetchedServices, loading: servicesLoading } = useBusinessServices(profile?.id);
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (fetchedServices.length > 0) {
      setServices(fetchedServices);
    }
  }, [fetchedServices]);

  // Read tab from URL query parameter
  /* import removed from here */
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "home");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "6months" | "yearly">("monthly");

  const [promoMobileTab, setPromoMobileTab] = useState<"list" | "create">("list");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPromotionWizard, setShowPromotionWizard] = useState(false);

  // Frontend promotions (no database needed)
  const { createPromotion } = useFrontendPromotions(profile?.id || "");

  // Review management states
  const [replyingToReview, setReplyingToReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [hiddenReviews, setHiddenReviews] = useState<Set<number>>(new Set());
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());

  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    category: "Soch turmagi",
  });

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Chiqish",
      description: "Tizimdan chiqdingiz",
    });
    navigate("/auth");
  };
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const hasBusinessAccess = isRole("business_owner") || isRole("admin");

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const completedBookings = bookings.filter(b => b.status === "completed");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Handle navigation for specific tabs
  useEffect(() => {
    if (activeTab === "clients") {
      navigate("/business/clients");
    } else if (activeTab === "reviews") {
      navigate("/business/reviews");
    } else if (activeTab === "wallet") {
      navigate("/profile/coins");
    } else if (activeTab === "scan-qr") {
      navigate("/business/scan-qr");
    } else if (activeTab === "inbox") {
      navigate("/business/notifications");
    }
  }, [activeTab, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
  }

  if (!user) {
    return null;
  }

  // Note: Previously redirected to /register-business if !profile?.category
  // This check has been removed to allow access to the dashboard

  if (!hasBusinessAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card variant="elevated" className="p-6 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Ruxsat yo'q</h2>
          <p className="text-muted-foreground mb-4">
            Bu sahifaga kirish uchun biznes egasi sifatida ro'yxatdan o'tishingiz kerak.
          </p>
          <Button variant="coral" onClick={() => navigate("/")}>
            Bosh sahifaga qaytish
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      toast({
        title: "Xatolik",
        description: "Nom va narxni kiriting",
        variant: "destructive",
      });
      return;
    }

    if (editingServiceId) {
      // Edit existing service
      setServices(services.map(s =>
        s.id === editingServiceId
          ? { ...s, ...newService, id: s.id } as Service
          : s
      ));
      toast({
        title: "Xizmat yangilandi",
        description: `"${newService.name}" muvaffaqiyatli yangilandi`,
      });
      setEditingServiceId(null);
    } else {
      // Add new service
      const service: Service = {
        id: `s-${Date.now()}`,
        name: newService.name || "",
        description: newService.description || "",
        price: newService.price || 0,
        duration: newService.duration || 30,
        category: newService.category || "Soch turmagi",
      };
      setServices([...services, service]);
      toast({
        title: "Xizmat qo'shildi",
        description: `"${service.name}" muvaffaqiyatli qo'shildi`,
      });
    }

    setNewService({ name: "", description: "", price: 0, duration: 30, category: "Soch turmagi" });
    setIsAdding(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast({
      title: "Xizmat o'chirildi",
      description: "Xizmat muvaffaqiyatli o'chirildi",
    });
  };

  const handleBusinessSubscribe = async (tier: BusinessSubscriptionTier) => {
    if (!profile?.id) return;

    let durationMonths = 1;
    if (billingCycle === '6months') durationMonths = 6;
    if (billingCycle === 'yearly') durationMonths = 12;

    upgradeBusinessSubscription(profile.id, tier, durationMonths);

    // Simulate API delay
    toast({
      title: "Obuna yangilandi",
      description: `Sizning tarifingiz: ${tier.toUpperCase()} (${billingCycle})`,
      className: "bg-green-500 text-white"
    });

    // In real app, we would await refreshProfile()
    if (refreshProfile) await refreshProfile();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + " so'm";
  };

  // Review management handlers
  const handleReplyToReview = (reviewId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Xato",
        description: "Javob matnini kiriting",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Javob yuborildi",
      description: "Sizning javobingiz muvaffaqiyatli qo'shildi",
    });

    setReplyingToReview(null);
    setReplyText("");
  };

  const handleToggleReviewVisibility = (reviewId: number) => {
    const newHiddenReviews = new Set(hiddenReviews);
    if (newHiddenReviews.has(reviewId)) {
      newHiddenReviews.delete(reviewId);
      toast({
        title: "Sharh ko'rsatildi",
        description: "Sharh endi ko'rinadi",
      });
    } else {
      newHiddenReviews.add(reviewId);
      toast({
        title: "Sharh yashirildi",
        description: "Sharh endi ko'rinmaydi",
      });
    }
    setHiddenReviews(newHiddenReviews);
  };

  const handleToggleReviewLike = (reviewId: number) => {
    const newLikedReviews = new Set(likedReviews);
    if (newLikedReviews.has(reviewId)) {
      newLikedReviews.delete(reviewId);
      toast({
        title: "Yoqtirish bekor qilindi",
        description: "Sharh yoqtirish bekor qilindi",
      });
    } else {
      newLikedReviews.add(reviewId);
      toast({
        title: "Sharh yoqtirildi",
        description: "Sharh yoqtirildi deb belgilandi",
      });
    }
    setLikedReviews(newLikedReviews);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <SystemNews />

      {activeTab === "home" && (
        <BusinessAnalyticsHome 
           onProfileClick={() => setActiveTab("profile")} 
           onTabChange={setActiveTab} 
        />
      )}

      {activeTab === "services" && (
        <div className="px-4 pt-6 space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mening xizmatlarim</h2>
              <Button
                variant="coral"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Qo'shish
              </Button>
            </div>
          </div>

          {/* Add Service Form */}
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <Card variant="elevated" className="p-4 space-y-4">
                <h3 className="font-semibold">{editingServiceId ? "Xizmatni tahrirlash" : "Yangi xizmat"}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nomi</Label>
                    <Input
                      placeholder="Xizmat nomi"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tavsifi</Label>
                    <Textarea
                      placeholder="Xizmat tavsifi"
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Narx (so'm)</Label>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={newService.price || ""}
                        onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vaqt (daqiqa)</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={newService.duration || ""}
                        onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="coral" className="flex-1" onClick={handleAddService}>
                      <Check className="w-4 h-4 mr-1" />
                      Saqlash
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingServiceId(null);
                        setNewService({
                          name: "",
                          description: "",
                          price: 0,
                          duration: 30,
                          category: "Soch turmagi",
                        });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Services List */}
          <div className="space-y-3">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 shadow-soft hover:shadow-glow transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-primary" />
                        <h3 className="font-bold">{service.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(service.price)}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration} daqiqa
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => {
                          setEditingServiceId(service.id);
                          setNewService(service);
                          setIsAdding(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {services.length === 0 && (
              <div className="py-12 text-center bg-card rounded-2xl border border-dashed border-border mt-4">
                <Scissors className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Hozircha xizmatlar yo'q</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsAdding(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Xizmat qo'shish
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "promotions" && (
        <div className="px-4 pt-6 pb-12 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Imtiyozlar</h2>
                <p className="text-xs text-muted-foreground">Mijozlarni jalb qilish uchun qulay imkoniyatlar</p>
              </div>
              <div className="p-1 bg-muted/50 rounded-xl flex">
                <button
                  onClick={() => setPromoMobileTab("list")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${promoMobileTab === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                >
                  Ro'yxat
                </button>
                <button
                  onClick={() => setPromoMobileTab("create")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${promoMobileTab === "create" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                >
                  Yaratish
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {promoMobileTab === "list" ? (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <MyPromotions businessId={profile?.id || ""} />
                </motion.div>
              ) : (
                <motion.div
                  key="create-view"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-card rounded-lg p-6 text-center">
                    <h3 className="text-lg font-bold mb-2">Yangi aksiya yaratish</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Wizard demo coming soon. Check "Ro'yxat" to see fake data!
                    </p>
                    <Button onClick={() => setPromoMobileTab("list")}>
                      Ro'yxatni ko'rish
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="px-4 pt-6 pb-12 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Buyurtmalar</h2>
            <p className="text-xs text-muted-foreground">Sizning barcha buyurtmalaringiz</p>
          </div>
          <BusinessBookings />
        </div>
      )}

      {activeTab === "inbox" && (
        <div className="px-4 pt-6 pb-12 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold">Bildirishnomalar</h2>
            <div className="ml-auto">
              <BusinessNotificationCenter />
            </div>
          </div>
          <BusinessInbox />
        </div>
      )}

      {activeTab === "wallet" && (
        <div className="px-4 pt-6 pb-12 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold">Mening hamyonim</h2>
          </div>
          <BusinessWallet />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="px-4 pt-6 pb-12 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold">Sozlamalar</h2>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">BILDIRISHNOMALAR</h3>
              <Card className="p-4 space-y-4 shadow-sm border-0 bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <Label className="text-base">Push bildirishnomalar</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Telefonga bildirishnoma olish</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      <Label className="text-base">Email bildirishnomalar</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Emailga xabar olish</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <Label className="text-base">SMS bildirishnomalar</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Telefon raqamingizga SMS</p>
                  </div>
                  <Switch />
                </div>
              </Card>
            </section>

            {/* Appearance */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">TASHQI KO'RINISH</h3>
              <Card className="p-4 space-y-4 shadow-sm border-0 bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-500" />
                      <Label className="text-base">Qorong'i rejim</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Tungi mavzu</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-500" />
                      <Label className="text-base">Til</Label>
                    </div>
                  </div>
                  <Select defaultValue="uz">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Tilni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uz">O'zbek</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-rose-500">XAVFLI ZONA</h3>
              <Card className="p-4 shadow-sm border-rose-100 bg-rose-50/50 dark:bg-rose-950/10">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-rose-700 dark:text-rose-400">Hisobni o'chirish</h4>
                    <p className="text-xs text-muted-foreground">Barcha ma'lumotlar o'chiriladi va qaytarib bo'lmaydi</p>
                  </div>
                  <Button variant="destructive" className="w-full bg-rose-600 hover:bg-rose-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    O'chirish
                  </Button>
                </div>
              </Card>
            </section>

            {/* Help */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Yordam</h3>
              <Button variant="outline" className="w-full justify-between h-14 bg-card border-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <span className="font-medium">Yordam</span>
                    <span className="text-xs text-muted-foreground block">Savollar va qo'llab-quvvatlash</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </section>
          </div>
        </div>
      )
      }

      {
        activeTab === "payments" && (
          <div className="px-4 pt-6 pb-12 space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('profile')}
                className="shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold">To'lov usullari</h2>
            </div>
            <BusinessPayments />
          </div>
        )
      }

      {
        activeTab === "trust" && (
          <div className="px-4 pt-6 pb-12 space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('profile')}
                className="shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold">Ishonch va Reyting</h2>
            </div>
            <BusinessTrust />
          </div>
        )}

      {activeTab === "subscription" && (
        <div className="min-h-screen bg-slate-100 pb-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 pt-6 pb-8">
            <button
              onClick={() => setActiveTab('profile')}
              className="mb-4 flex items-center gap-1 text-white/80 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Crown className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">Biznes Obunasi</h1>
            </div>
            <p className="text-white/90 text-sm">
              Ko'proq aksiyalar va imkoniyatlarga ega bo'ling.
            </p>
          </div>

          <div className="px-4 -mt-2 space-y-4">

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {[
                { id: 'monthly', label: '1 Oy', discount: null },
                { id: '6months', label: '6 Oy', discount: '-15%' },
                { id: 'yearly', label: '1 Yil', discount: '-25%' }
              ].map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setBillingCycle(cycle.id as any)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${billingCycle === cycle.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600 ring-offset-2'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  {cycle.label}
                  {billingCycle === cycle.id && cycle.discount && (
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                      {cycle.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Available Plans */}
            <div className="pt-2">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Mavjud tariflar</h3>

              {/* Free Plan */}
              <div className="rounded-2xl p-5 shadow-lg border-2 border-transparent bg-white mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-slate-100">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Bepul</h4>
                    <p className="text-xs text-slate-500">Boshlang'ich tarif</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-3">Bepul</p>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-400" />
                    3 ta faol aksiya
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-400" />
                    Cheklangan statistika
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-400" />
                    1 ta filial/lokatsiya
                  </li>
                </ul>
                <Button className="w-full py-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl">
                  Joriy Tarif
                </Button>
              </div>

              {/* Dynamic Plans */}
              {[
                {
                  id: 'pro',
                  name: 'Business PRO',
                  basePrice: 150000,
                  description: "O'sish uchun",
                  icon: Star,
                  bg: "bg-gradient-to-br from-amber-50 to-orange-50",
                  border: "border-amber-400",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  badge: "TAVSIYA",
                  badgeColor: "bg-amber-500",
                  features: ["10 ta faol aksiya", "Kengaytirilgan statistika", "3 ta filialgacha", "Xodimlarni boshqarish", "SMS xabarnomalar"]
                },
                {
                  id: 'elite',
                  name: 'Elite Salon',
                  basePrice: 400000,
                  description: "Maksimal imkoniyatlar",
                  icon: Crown,
                  bg: "bg-gradient-to-br from-slate-800 to-slate-900",
                  border: "border-transparent",
                  iconBg: "bg-white/10",
                  iconColor: "text-purple-300",
                  text: "text-white",
                  badge: "PREMIUM",
                  badgeColor: "bg-purple-500",
                  features: ["30 ta faol aksiya", "Cheksiz statistika", "Cheksiz filiallar", "Verified beji", "Premium yordam (24/7)"],
                  isDark: true
                }
              ].map(plan => {
                let originalPrice = plan.basePrice;
                let periodLabel = "/oy";
                let discountRate = 0; // 0% default for monthly

                if (billingCycle === '6months') {
                  originalPrice = plan.basePrice * 6;
                  periodLabel = "/6 oy";
                  discountRate = 0.15;
                } else if (billingCycle === 'yearly') {
                  originalPrice = plan.basePrice * 12;
                  periodLabel = "/yil";
                  discountRate = 0.25;
                }

                const discountedPrice = originalPrice * (1 - discountRate);

                return (
                  <div key={plan.id} className={`rounded-2xl p-5 shadow-lg border-2 ${plan.border} ${plan.bg} ${plan.isDark ? 'text-white' : ''} mb-4`}>
                    <Badge className={`${plan.badgeColor} text-white border-0 text-xs mb-3`}>{plan.badge}</Badge>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-xl ${plan.iconBg}`}>
                        <plan.icon className={`w-5 h-5 ${plan.iconColor}`} />
                      </div>
                      <div>
                        <h4 className={`font-bold ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
                        <p className={`text-xs ${plan.isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      {discountRate > 0 && (
                        <div className={`text-xs line-through ${plan.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {originalPrice.toLocaleString()} so'm
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${plan.isDark ? 'text-white' : 'text-slate-900'}`}>
                          {discountedPrice.toLocaleString()}
                        </span>
                        <span className={`text-sm ${plan.isDark ? 'text-slate-400' : 'text-slate-500'}`}>so'm{periodLabel}</span>
                      </div>
                      {discountRate > 0 && (
                        <Badge variant="outline" className={`${plan.isDark ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-700 border-green-200'} text-[10px] mt-1`}>
                          -{discountRate * 100}% Chegirma
                        </Badge>
                      )}
                    </div>

                    <ul className={`space-y-2 text-sm ${plan.isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className={`w-4 h-4 ${plan.isDark ? 'text-purple-400' : 'text-amber-500'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full py-4 rounded-xl shadow-lg ${plan.isDark
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'}`}
                      onClick={() => handleBusinessSubscribe(plan.id as any)}
                    >
                      Obuna bo'lish
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <HelpCircle className="w-3.5 h-3.5 inline mr-1.5 text-blue-500 -mt-0.5" />
              Obuna shartlari: {billingCycle === 'monthly' ? "Oylik to'lov, istalgan vaqtda bekor qilish mumkin." : `Birinchi to'lov uchun ${billingCycle === '6months' ? '15%' : '25%'} chegirma amal qiladi.`} Keyingi to'lovlar to'liq miqdorda yechiladi. Istalgan vaqtda bekor qilish mumkin.
            </div>

            {/* Subscription History Stats */}
            <div className="pt-4">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Obuna tarixi</h3>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-700">Jami to'lovlar</p>
                      <p className="text-lg font-bold text-purple-800">950,000 UZS</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Tranzaksiyalar</p>
                      <p className="text-lg font-bold text-blue-800">5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="space-y-3">
                {/* Upgrade Entry */}
                <div className="rounded-xl p-4 bg-purple-50 border border-purple-100 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-700">Tarif oshirildi</p>
                        <p className="text-xs text-slate-500">01.02.2026 • 14:30</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">-400,000</p>
                      <p className="text-xs text-slate-500">UZS</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200/50">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500 text-white">PRO</Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <Badge className="bg-purple-600 text-white">ELITE</Badge>
                    </div>
                    <Badge variant="outline" className="bg-white text-xs">
                      <CreditCard className="w-3 h-3 mr-1" />Payme
                    </Badge>
                  </div>
                </div>

                {/* Renew Entry */}
                <div className="rounded-xl p-4 bg-blue-50 border border-blue-100 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700">Obuna yangilandi</p>
                        <p className="text-xs text-slate-500">01.01.2026 • 10:00</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">-150,000</p>
                      <p className="text-xs text-slate-500">UZS</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200/50">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500 text-white">PRO</Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <Badge className="bg-amber-500 text-white">PRO</Badge>
                    </div>
                    <Badge variant="outline" className="bg-white text-xs">
                      <CreditCard className="w-3 h-3 mr-1" />Click
                    </Badge>
                  </div>
                </div>

                {/* Subscribe Entry */}
                <div className="rounded-xl p-4 bg-green-50 border border-green-100 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">Yangi obuna</p>
                        <p className="text-xs text-slate-500">01.12.2025 • 09:15</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">-150,000</p>
                      <p className="text-xs text-slate-500">UZS</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-200/50">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-300 text-slate-700">Bepul</Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <Badge className="bg-amber-500 text-white">PRO</Badge>
                    </div>
                    <Badge variant="outline" className="bg-white text-xs">
                      <CreditCard className="w-3 h-3 mr-1" />Uzcard
                    </Badge>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}


      {activeTab === "reviews" && (
        <div className="px-4 pt-6 pb-12 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Sharhlar</h2>
              <p className="text-xs text-muted-foreground">Mijozlar sharhlarini boshqaring</p>
            </div>
          </div>

          {/* Reviews Stats */}
          < div className="grid grid-cols-3 gap-3" >
            <Card className="p-3 text-center shadow-soft bg-card border-0">
              <p className="text-2xl font-bold text-amber-600">156</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Jami</p>
            </Card>
            <Card className="p-3 text-center shadow-soft bg-card border-0">
              <p className="text-2xl font-bold text-green-600">4.8</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Reyting</p>
            </Card>
            <Card className="p-3 text-center shadow-soft bg-card border-0">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Yangi</p>
            </Card>
          </div >

          {/* Reviews List */}
          < div className="space-y-3" >
            {
              [
                {
                  id: 1,
                  name: "Aziza Karimova",
                  rating: 5,
                  date: "2 kun oldin",
                  comment: "Juda ajoyib xizmat! Professional ustalar. Albatta qayta kelaman.",
                  replied: false,
                  likes: 15,
                  photos: [
                    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=60"
                  ]
                },
                {
                  id: 2,
                  name: "Dilshod Alimov",
                  rating: 4,
                  date: "5 kun oldin",
                  comment: "Yaxshi narx va sifat. Biroz kutish vaqti uzun edi.",
                  replied: true,
                  reply: "Rahmat! Navbatni yaxshilaymiz.",
                  likes: 8,
                  photos: []
                },
                {
                  id: 3,
                  name: "Madina Rahimova",
                  rating: 5,
                  date: "1 hafta oldin",
                  comment: "Zo'r salon! Toza va tartibli. Mutaxassislar juda mehribon.",
                  replied: false,
                  likes: 23,
                  photos: [
                    "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&auto=format&fit=crop&q=60"
                  ]
                },
              ].map((review) => (
                <Card key={review.id} className="p-4 shadow-soft border-0">
                  <div className="space-y-3">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-sm text-muted-foreground">{review.comment}</p>

                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {review.photos.slice(0, 5).map((photo, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={photo}
                              alt={`Review ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Like/Dislike */}
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        onClick={() => handleToggleReviewLike(review.id)}
                        className={`flex items-center gap-1.5 transition-colors ${likedReviews.has(review.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                          }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${likedReviews.has(review.id) ? 'fill-primary' : ''}`} />
                        <span className="text-sm font-medium">
                          {review.likes + (likedReviews.has(review.id) ? 1 : 0)}
                        </span>
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Business Reply */}
                    {review.replied && review.reply && (
                      <div className="pl-4 border-l-2 border-primary/30 bg-primary/5 p-3 rounded-r-lg">
                        <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          Sizning javobingiz:
                        </p>
                        <p className="text-sm">{review.reply}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t">
                      {!review.replied && (
                        replyingToReview === review.id ? (
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Javob yozing..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[60px] resize-none"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 h-8 text-xs"
                                onClick={() => handleReplyToReview(review.id)}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Yuborish
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                  setReplyingToReview(null);
                                  setReplyText("");
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => setReplyingToReview(review.id)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Javob berish
                          </Button>
                        )
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground"
                        onClick={() => handleToggleReviewVisibility(review.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {hiddenReviews.has(review.id) ? "Ko'rsatish" : "Yashirish"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div >
        </div >
      )
      }

      {
        activeTab === "profile" && (
          <div className="space-y-6">
            <div className="px-4 pt-8 pb-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-b-[2.5rem] shadow-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="flex items-center gap-4 relative">
                <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{profile?.full_name || "Biznes Egasi"}</h1>
                  <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
                    <Store className="w-3.5 h-3.5" />
                    Biznes paneli
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Tasdiqlangan
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/salon/biz-2')}
                    className="text-white hover:bg-white/10"
                    title="Sahifani ko'rish"
                  >
                    <Eye className="w-5 h-5" />
                  </Button>

                </div>
              </div>
            </div>

            <div className="px-4 -mt-6 space-y-6">

              {/* Business Stats */}
              <div className="grid grid-cols-4 gap-2 pb-4">
                <Card className="p-3 text-center shadow-soft bg-card border-0">
                  <p className="text-2xl font-bold text-primary">{services.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Xizmatlar</p>
                </Card>
                <Card className="p-3 text-center shadow-soft bg-card border-0">
                  <p className="text-2xl font-bold text-emerald-600">{bookings.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Buyurtmalar</p>
                </Card>
                <Card className="p-3 text-center shadow-soft bg-card border-0">
                  <p className="text-2xl font-bold text-amber-600">4.8</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Reyting</p>
                </Card>
                <Card className="p-3 text-center shadow-soft bg-card border-0">
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Sharhlar</p>
                </Card>
              </div>

              {/* Business Information */}
              <section className="space-y-3">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Biznes haqida</h3>
                <Card className="p-4 shadow-soft border-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Store className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Biznes nomi</p>
                      <p className="font-semibold">Elite Beauty Salon</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Telefon raqam</p>
                      <p className="font-semibold">+998 90 123 45 67</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Ish vaqti</p>
                      <p className="font-semibold text-sm">Du-Sha: 09:00 - 20:00</p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Quick Access Cards */}
              <section className="space-y-2 pt-2">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider px-1">Biznes Boshqaruvi</h3>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('subscription')}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <div className="text-left">
                      <span className="font-medium block">Obuna va Tariflar</span>
                      <span className="text-xs text-muted-foreground">Tarif rejasini boshqarish</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('services')}
                >
                  <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <span className="font-medium block">Xizmatlarni tahrirlash</span>
                      <span className="text-xs text-muted-foreground">Xizmatlarni boshqarish va tahrirlash</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => navigate('/business/edit-info')}
                >
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <span className="font-medium block">Umumiy ma'lumot</span>
                      <span className="text-xs text-muted-foreground">Salon haqida ma'lumot va sozlamalar</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('wallet')}
                >
                  <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5 text-amber-600" />
                    <div className="text-left">
                      <span className="font-medium block">Hamyon va Tangalar</span>
                      <span className="text-xs text-muted-foreground">Balans, tarix va qo'llanma</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => navigate('/business/create-promotion')}
                >
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-rose-600" />
                    <div className="text-left">
                      <span className="font-medium block">Imtiyozlar va Lotereya</span>
                      <span className="text-xs text-muted-foreground">Aksiyalar yaratish va boshqarish</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('reviews')}
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-600" />
                    <div className="text-left">
                      <span className="font-medium block">Sharhlar</span>
                      <span className="text-xs text-muted-foreground">Sharhlarni ko'rish va javob berish</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('payments')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <div className="text-left">
                      <span className="font-medium block">To'lov usullari</span>
                      <span className="text-xs text-muted-foreground">Kartalarni boshqarish</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('trust')}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <span className="font-medium block">Ishonch Tarixi</span>
                      <span className="text-xs text-muted-foreground">Reyting va ishonchlilik</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft hover:bg-secondary/50"
                  onClick={() => setActiveTab('inbox')}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    <div className="text-left">
                      <span className="font-medium block">Bildirishnomalar</span>
                      <span className="text-xs text-muted-foreground">Xabarlar va yangiliklar</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Button>


              </section>

              <section className="pt-8 pb-4 border-t">
                <h2 className="text-lg font-bold mb-4">Sozlamalar</h2>
                <div className="space-y-2">

                  <Button
                    variant="ghost"
                    className="w-full justify-between items-center h-14 px-4 bg-card rounded-2xl border-0 shadow-soft"
                    onClick={() => setActiveTab('settings')}
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Sozlamalar</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </Button>
                </div>
              </section>

              <div className="pt-4 pb-8">
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Chiqish
                </Button>
              </div>
            </div>
          </div>
        )
      }

      <BusinessBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "bookings") navigate("/business/bookings");
          else if (tab === "promotions") navigate("/business/promotions");
          else setActiveTab(tab);
        }}
      />

      {/* Dialogs */}
      <EditProfileDialog open={showEditProfile} onOpenChange={setShowEditProfile} />
      <NotificationsManager open={showNotifications} onOpenChange={setShowNotifications} />
      <CreatePromotionWizard
        isOpen={showPromotionWizard}
        onClose={() => setShowPromotionWizard(false)}
        onSubmit={async (data) => {
          await createPromotion(data);
          setPromoMobileTab("list");
        }}
        currentPromotionCount={useFrontendPromotions(profile?.id || "").promotions.filter(p => p.status === 'active').length}
      />
    </div >
  );
};

export default BusinessDashboard;
