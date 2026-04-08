import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Users, Settings, Bell, HelpCircle, LogOut, ChevronRight, Star, Calendar, MapPin, Gift, Edit2, CreditCard, Coins, PlusCircle, Shield, Store, LayoutDashboard, Briefcase, Plus, Building2, MessageSquare, Percent, Ticket, Headphones, TrendingUp, QrCode, Crown, Clock } from "lucide-react";
import EditClientProfileDialog from "@/components/client/EditClientProfileDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import CoinBalanceCard from "@/components/CoinBalanceCard";
import ClientDashboardStats from "@/components/client/ClientDashboardStats";
import ServiceEditDialog from "@/components/business/ServiceEditDialog";
import { fakePromocodes } from "@/data/promocodes";
import { getCoinBalance } from "@/utils/coinBalance";

const activePromocodesCount = fakePromocodes.filter(p => p.status === 'active').length.toString();

interface MenuItem {
  icon: any;
  label: string;
  badge: string | null;
  path: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const ProfilePage = () => {
  const { user, profile, loading, signOut, isRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);

  // Business specific states
  const [isServiceAddOpen, setIsServiceAddOpen] = useState(false);

  const isAdmin = isRole("admin");
  const isBusinessOwner = isRole("business_owner");

  const getRoleLabel = () => {
    if (isRole("admin")) return "Admin";
    if (isRole("moderator")) return "Moderator";
    if (isRole("business_owner")) return "Tadbirkor";
    return "Foydalanuvchi";
  };

  const menuSections = (() => {
    if (isAdmin) {
      return [
        {
          items: [
            { icon: LayoutDashboard, label: "Admin Dashboard", badge: null, path: "/admin" },
            { icon: Users, label: "Foydalanuvchilar", badge: null, path: "/admin/users" },
            { icon: Building2, label: "Bizneslar", badge: "2", path: "/admin/businesses" },
            { icon: Percent, label: "Aksiyalar", badge: "5", path: "/admin/promotions" },
            { icon: Ticket, label: "Promokodlar", badge: activePromocodesCount, path: "/admin/promocodes" },
            { icon: Coins, label: "Tangalar Tarixi", badge: null, path: "/admin/coins" },
            { icon: MessageSquare, label: "Sharhlar", badge: null, path: "/admin/reviews" },
            { icon: Settings, label: "Sozlamalar", badge: null, path: "/profile/settings" },
            { icon: Headphones, label: "Qo'llab-quvvatlash", badge: null, path: "/profile/support" },
            { icon: HelpCircle, label: "Yordam", badge: null, path: "/profile/help" },
          ]
        }
      ];
    } else if (isBusinessOwner) {
      return [
        {
          title: "Biznes",
          items: [
            { icon: Users, label: "Foydalanuvchilar", badge: "5", path: "/business/clients" },
            { icon: QrCode, label: "QR Skaner", badge: null, path: "/business/scan-qr" },
            { icon: Briefcase, label: "Xizmatlar", badge: null, path: "/business/services" },
          ]
        },
        {
          title: "Faoliyatim",
          items: [
            { icon: Calendar, label: "Yozuvlarim", badge: "2", path: "/business/bookings" },
            { icon: Gift, label: "Aksiyalarim", badge: "1", path: "/business/promotions" },
            { icon: TrendingUp, label: "Reklama va TOP", badge: null, path: "/business/promote" },
            { icon: Ticket, label: "Promokodlarim", badge: activePromocodesCount, path: "/profile/promocodes" },
            { icon: Star, label: "Sharhlarim", badge: "3", path: "/business/reviews" },
            { icon: Shield, label: "Ishonch tarixi", badge: null, path: "/profile/trust-history" },
          ]
        },
        {
          title: "Moliya",
          items: [
            { icon: TrendingUp, label: "Tushumlar tarixi", badge: null, path: "/business/service-payments" },
            { icon: CreditCard, label: "To'lov usullari", badge: null, path: "/profile/payments" },
            { icon: Coins, label: "Tangalar", badge: null, path: "/profile/coins" },
            { icon: Crown, label: "Biznes Obunasi", badge: "Pro", path: "/business/dashboard?tab=subscription" },
          ]
        },
        {
          title: "Tizim",
          items: [
            { icon: MapPin, label: "Manzillar", badge: "3", path: "/profile/addresses" },
            { icon: Bell, label: "Bildirishnomalar", badge: "3", path: "/profile/notifications" },
            { icon: Settings, label: "Sozlamalar", badge: null, path: "/profile/settings" },
            { icon: Headphones, label: "Qo'llab-quvvatlash", badge: null, path: "/profile/support" },
            { icon: HelpCircle, label: "Yordam", badge: null, path: "/profile/help" },
          ]
        }
      ];
    } else {
      // Client Sections
      return [
        {
          title: "Faoliyatim",
          items: [
            { icon: Calendar, label: "Yozuvlarim", badge: "2", path: "/bookings" },
            { icon: Gift, label: "Aksiyalarim", badge: "1", path: "/my-registrations" },
            { icon: Ticket, label: "Promokodlarim", badge: activePromocodesCount, path: "/profile/promocodes" },
            { icon: Star, label: "Sharhlarim", badge: "3", path: "/profile/reviews" },
            { icon: Shield, label: "Ishonch tarixi", badge: null, path: "/profile/trust-history" },
          ]
        },
        {
          title: "Moliya",
          items: [
            { icon: CreditCard, label: "To'lov usullari", badge: null, path: "/profile/payments" },
            { icon: Coins, label: "Tangalar", badge: null, path: "/profile/coins" },
            { icon: Crown, label: "Mening Obunam", badge: "Standard", path: "/client/premium" },
          ]
        },
        {
          title: "Hamkorlik",
          items: [
            { icon: Store, label: "Xizmat ko'rsatish", badge: "Biznes", path: "/register-business" },
          ]
        },
        {
          title: "Tizim",
          items: [
            { icon: MapPin, label: "Manzillar", badge: "3", path: "/profile/addresses" },
            { icon: Bell, label: "Bildirishnomalar", badge: "3", path: "/profile/notifications" },
            { icon: Settings, label: "Sozlamalar", badge: null, path: "/profile/settings" },
            { icon: Headphones, label: "Qo'llab-quvvatlash", badge: null, path: "/profile/support" },
            { icon: HelpCircle, label: "Yordam", badge: null, path: "/profile/help" },
          ]
        }
      ];
    }
  })();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Chiqish",
      description: "Tizimdan chiqdingiz",
    });
    navigate("/auth");
  };

  const handleMenuClick = (path: string | null, label?: string) => {
    if (path) {
      if (path.includes('business') && !isBusinessOwner && !isAdmin) {
        // Safety redirect: If a client tries to go to a business page, redirect to client equivalent
        if (path.includes('subscription')) {
          navigate('/client/premium');
          return;
        }
      }
      navigate(path);
    } else {
      toast({
        title: "Tez orada",
        description: "Bu funksiya tez orada ishga tushadi",
      });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 safe-top">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {isAdmin ? "Admin Kabinet" : (isBusinessOwner ? "Kabinet" : "Profil")}
        </motion.h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            variant="elevated"
            className={`p-5 ${isBusinessOwner ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
            onClick={() => isBusinessOwner && navigate('/salon/biz-2')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground">
                      {profile?.full_name || user.email}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {profile?.phone && (
                      <p className="text-xs text-muted-foreground mt-0.5">{profile.phone}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {getRoleLabel()}
                      </span>
                      {profile && !isAdmin && (
                        <div onClick={(e) => {
                          e.stopPropagation();
                          setIsScoreDialogOpen(true);
                        }} className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
                          <TrustScoreBadge score={profile.trust_score} size="sm" showLabel={true} />
                        </div>
                      )}
                      
                      {isBusinessOwner && profile?.is_verified === false && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium border border-amber-200 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          Kutilmoqda
                        </span>
                      )}
                    </div>
                    {isBusinessOwner && profile?.is_verified === false && (
                        <p className="text-[11px] text-amber-600/90 mt-2 font-medium flex items-start gap-1 bg-amber-50 p-1.5 rounded-md border border-amber-100/50">
                          <span className="text-amber-500 mt-0.5 relative top-[1px]">*</span>
                          Profilingiz administrator tomonidan tasdiqlanishi kutilmoqda.
                        </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit button clicked! isBusinessOwner:', isBusinessOwner);
                      if (isBusinessOwner) {
                        console.log('Navigating to /business/edit-profile');
                        navigate('/business/edit-profile');
                      } else {
                        console.log('Opening edit dialog');
                        setIsEditDialogOpen(true);
                      }
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Business Dashboard Statistics - Only for Business Owners */}
      {
        isBusinessOwner && (
          <div className="px-4 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dashboard</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Bookings Card */}
                <Card
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800"
                  onClick={() => navigate('/business/bookings')}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600/50 dark:text-blue-400/50" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">12</p>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Buyurtmalar</p>
                    </div>
                  </div>
                </Card>

                {/* Promotions Card */}
                <Card
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800"
                  onClick={() => navigate('/business/promotions')}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <ChevronRight className="w-3.5 h-3.5 text-purple-600/50 dark:text-purple-400/50" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">5</p>
                      <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Aksiyalar</p>
                    </div>
                  </div>
                </Card>

                {/* Reviews Card */}
                <Card
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800"
                  onClick={() => navigate('/business/reviews')}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600/50 dark:text-amber-400/50" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <p className="text-xl font-bold text-amber-900 dark:text-amber-100">4.8</p>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </div>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Sharhlar</p>
                    </div>
                  </div>
                </Card>

                {/* Coins Card */}
                <Card
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800"
                  onClick={() => navigate('/profile/coins')}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <Coins className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <ChevronRight className="w-3.5 h-3.5 text-orange-600/50 dark:text-orange-400/50" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xl font-bold text-orange-900 dark:text-orange-100">{user ? getCoinBalance(user.id) : 0}</p>
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Tangalar</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        )
      }

      {/* Coin Balance Card - For Clients Only */}
      {
        !isAdmin && !isBusinessOwner && (
          <div className="px-4 mb-6">
            <ClientDashboardStats />

            {/* Test Button for Demo */}
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 border-amber-500 text-amber-600 bg-amber-50 hover:bg-amber-100"
                onClick={async () => {
                  if (!user) return;
                  const { addCoins } = await import("@/utils/coinBalance");
                  addCoins(user.id, 10000, 'daily_login', 'Test: Bonus Coins');
                  toast({
                    title: "Muvaffaqiyatli!",
                    description: "Hisobingizga 10,000 tanga qo'shildi (Test)",
                    className: "bg-green-500 text-white border-green-600"
                  });
                  location.reload();
                }}
              >
                <PlusCircle className="w-3 h-3 mr-1" />
                Test: +10,000 Tanga
              </Button>
            </div>
          </div>
        )
      }

      {/* Menu Items */}
      <div className={`px-4 space-y-6 ${isAdmin ? "md:grid md:grid-cols-2 md:gap-6 md:space-y-0" : ""}`}>
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {section.title && (
              <h3 className="text-sm font-semibold text-muted-foreground ml-1 mb-2 uppercase tracking-wide">
                {section.title}
              </h3>
            )}
            <div className="space-y-2">
              {section.items.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (index * 0.05) }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                  onClick={() => handleMenuClick(item.path, item.label)}
                >
                  <Card className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors border-transparent shadow-sm hover:shadow-md hover:border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${['Faoliyatim'].includes(section.title || '') ? 'bg-blue-50 text-blue-600' :
                        ['Moliya', 'Moliya va Ma\'lumotlar'].includes(section.title || '') ? 'bg-amber-50 text-amber-600' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm shadow-primary/20">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </Card>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      {
        user && (
          <div className="px-4 mt-8">
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleSignOut()}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Chiqish
            </Button>
          </div>
        )
      }

      <EditClientProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ServiceEditDialog
        open={isServiceAddOpen}
        onOpenChange={setIsServiceAddOpen}
        businessId="biz-2" // Defaulting to demo business ID
        onSuccess={() => toast({ title: "Xizmat qo'shildi" })}
      />

      <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Ishonch Reytingi
            </DialogTitle>
            <DialogDescription>
              Bu ko'rsatkich sizning ishonchliligingizni belgilaydi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2 text-green-600">
                Qanday oshirish mumkin?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Xizmatlardan foydalanish (+10 ball)</li>
                <li>Ijobiy sharh qoldirish (+5 ball)</li>
                <li>O'z vaqtida kelish</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2 text-red-600">
                Nima tushiradi?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Buyurtmani bekor qilish (-5 ball)</li>
                <li>Kelmaslik (No-show) (-20 ball)</li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => setIsScoreDialogOpen(false)}>
              Tushunarli
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div >
  );
};

export default ProfilePage;
