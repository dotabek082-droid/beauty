import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Star, Users, TrendingUp, ChevronRight, MessageSquare, Activity, QrCode, Clock, CheckCircle2, User, Phone, Wallet, Banknote, CreditCard, XCircle, Shield, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBusinessBookings } from "@/hooks/useBusinessBookings";
import { fakeClientReviews } from "@/data/fakeClientReviews";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

interface BusinessAnalyticsHomeProps {
  onProfileClick: () => void;
  onTabChange: (tab: string) => void;
}

export const BusinessAnalyticsHome = ({ onProfileClick, onTabChange }: BusinessAnalyticsHomeProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { bookings, confirmBooking, cancelBooking, loading: bookingsLoading } = useBusinessBookings();
  
  // Get trust status text
  const getTrustStatus = (score: number) => {
    if (score >= 90) return "A'lo";
    if (score >= 70) return "Ishonchli";
    if (score >= 50) return "O'rtacha";
    return "Past";
  };

  // Fallback mock data for demo if real data is empty
  const MOCK_FALLBACK_BOOKINGS = [
    {
      id: "mock-b1",
      status: "pending",
      scheduled_date: "2026-01-26",
      scheduled_time: "12:00",
      profile: { full_name: "Lola", phone: "+998 90 999 99 99" },
      promotion: { service_name: "Soch Turmaklash (Yutuq)", original_price: 0 },
      is_lottery_winner: true,
      is_free: true,
      payment_method: "Aksiya"
    },
    {
      id: "mock-b2",
      status: "confirmed",
      scheduled_date: "2026-01-25",
      scheduled_time: "16:00",
      profile: { full_name: "Sevara Aliyeva", phone: "+998 99 111 22 33" },
      promotion: { service_name: "Kechki makiyaj", original_price: 250000 },
      payment_method: "tanga",
      payment_status: "paid"
    },
    {
      id: "mock-b3",
      status: "pending",
      scheduled_date: "2026-01-24",
      scheduled_time: "10:00",
      profile: { full_name: "Malika Karimova", phone: "+998 93 987 65 43" },
      promotion: { service_name: "Yuz tozalash (Premium)", original_price: 300000 },
      payment_method: "naqd",
      payment_status: "unpaid"
    },
    {
      id: "mock-b4",
      status: "pending",
      scheduled_date: "2026-01-23",
      scheduled_time: "14:30",
      profile: { full_name: "Aziza Rahimova", phone: "+998 90 123 45 67" },
      promotion: { service_name: "Soch bo'yash va turmaklash", original_price: 450000 },
      payment_method: "karta",
      payment_status: "unpaid"
    },
    {
      id: "mock-b5",
      status: "completed",
      scheduled_date: "2026-01-22",
      scheduled_time: "10:30",
      profile: { full_name: "Test Foydalanuvchi", phone: "+998 90 000 00 00" },
      promotion: { service_name: "Manikur + Pedikur", original_price: 180000 },
      payment_method: "karta",
      payment_status: "paid"
    }
  ];

  const MOCK_FALLBACK_REVIEWS = [
    {
      id: "mock-r1",
      overall_rating: 5,
      comment: "Xizmat juda yoqdi, usta o'z ishining mutaxassisi ekan. Tavsiya qilaman!",
      created_at: new Date().toISOString()
    },
    {
      id: "mock-r2",
      overall_rating: 4,
      comment: "Yaxshi joy, lekin biroz kutib qoldim. Shunga qaramay sifat a'lo darajada.",
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Get recent 5 bookings (excluding blocked slots)
  const realBookings = bookings.filter(b => b.status !== "blocked").slice(0, 5);
  const displayBookings = realBookings.length > 0 ? realBookings : MOCK_FALLBACK_BOOKINGS;

  // Get recent 5 reviews for this business
  const realReviews = fakeClientReviews
    .filter(r => r.business_id === (profile?.id || "biz-2"))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const displayReviews = realReviews.length > 0 ? realReviews : MOCK_FALLBACK_REVIEWS;

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge className="bg-amber-100/80 text-amber-700 hover:bg-amber-100 border-none px-2 py-0.5 text-[9px] font-bold">Kutilmoqda</Badge>;
      case "confirmed": return <Badge className="bg-blue-100/80 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 text-[9px] font-bold">Tasdiqlangan</Badge>;
      case "completed": return <Badge className="bg-emerald-100/80 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 text-[9px] font-bold">Bajarildi</Badge>;
      case "cancelled": return <Badge className="bg-rose-100/80 text-rose-700 hover:bg-rose-100 border-none px-2 py-0.5 text-[9px] font-bold">Bekor qilingan</Badge>;
      default: return null;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case "naqd": return <Banknote className="w-2.5 h-2.5" />;
      case "karta": return <CreditCard className="w-2.5 h-2.5" />;
      case "tanga": return <Wallet className="w-2.5 h-2.5" />;
      case "aksiya": return <Gift className="w-2.5 h-2.5" />;
      default: return <Wallet className="w-2.5 h-2.5" />;
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      {/* Premium Header - Super Compact & Slim Design */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-5 pt-8 pb-14 rounded-b-[2.5rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50" />
         <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-50" />
         
         <div className="relative space-y-6">
            {/* Header Top: Business Identity & Avatar */}
                         <div className="flex justify-between items-start">
                <div className="text-white space-y-1.5 flex-1 min-w-0">
                   <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-bold tracking-tight text-white leading-tight truncate max-w-[200px]">
                         {profile?.business_name || "Bunyodkor ko'chasi Beauty"}
                      </h1>
                      <Badge className="bg-amber-400 text-amber-950 border-none text-[8px] font-black px-1.5 h-3.5 shadow-lg shadow-amber-500/20 uppercase">
                        PREMIUM
                      </Badge>
                   </div>
                   
                   <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
                      <div className="flex items-center gap-1.5">
                         <Shield className="w-2.5 h-2.5 text-emerald-300" />
                         <span className="text-white/80 font-bold text-[10px] leading-none">{profile?.trust_score || 80}</span>
                         <span className="text-white/50 text-[9px] font-medium leading-none uppercase tracking-wider">{getTrustStatus(profile?.trust_score || 80)}</span>
                      </div>
                      <div className="w-px h-2 bg-white/10" />
                      <div className="flex items-center gap-1.5">
                         <Phone className="w-2.5 h-2.5 text-white/40" />
                         <span className="text-white/70 text-[10px] font-medium leading-none">{profile?.phone || "+998 90 000 00 02"}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                   <button
                      onClick={() => navigate("/business/notifications")}
                      className="relative w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/25 transition-all duration-200 group"
                   >
                      <Bell className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 border-2 border-indigo-600 rounded-full text-[9px] text-white font-black flex items-center justify-center px-1 shadow-lg shadow-red-500/30 animate-pulse">
                         5
                      </span>
                   </button>
                   <button 
                      onClick={onProfileClick}
                      className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-base font-bold backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-colors"
                   >
                       {profile?.full_name?.charAt(0) || "S"}
                   </button>
                </div>
             </div>
         </div>
         
         {/* Monthly stats integrated directly - Visible & Compact */}
         <div className="mt-6 px-1 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
               <span className="text-white font-black text-2xl tracking-tighter">4,285</span>
               <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Oylik ko'rishlar</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-400/20 px-2 py-0.5 rounded-full border border-emerald-400/10">
               <TrendingUp className="w-3 h-3 text-emerald-300" />
               <span className="text-emerald-300 text-[10px] font-black">+15%</span>
            </div>
         </div>
      </div>


      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="px-5 -mt-6 relative z-10 space-y-6"
      >
        {/* Analytics Grid - More Compact */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div variants={itemVars}>
            <Card className="p-3 border-none shadow-md shadow-indigo-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.2rem] hover:ring-2 ring-indigo-500/20 transition-all cursor-pointer" onClick={() => onTabChange("bookings")}>
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                 <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Buyurtmalar</p>
              <div className="flex items-end justify-between mt-0.5">
                 <h4 className="text-xl font-bold text-gray-900 dark:text-white">{bookings ? bookings.filter(b => b.status !== "blocked").length : 12}</h4>
                 <span className="text-[9px] font-black text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    +15%
                 </span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVars}>
            <Card className="p-3 border-none shadow-md shadow-pink-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.2rem] hover:ring-2 ring-pink-500/20 transition-all cursor-pointer" onClick={() => onTabChange("promotions")}>
              <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-2">
                 <Gift className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Aksiyalar</p>
              <div className="flex items-end justify-between mt-0.5">
                 <h4 className="text-xl font-bold text-gray-900 dark:text-white">5</h4>
                 <span className="text-[9px] font-black text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    +2 ta
                 </span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVars}>
            <Card className="p-3 border-none shadow-md shadow-amber-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.2rem] hover:ring-2 ring-amber-500/20 transition-all cursor-pointer" onClick={() => onTabChange("reviews")}>
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-2">
                 <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Sharhlar</p>
              <div className="flex items-end justify-between mt-0.5">
                 <h4 className="text-xl font-bold text-gray-900 dark:text-white">4.8<span className="text-[10px] text-gray-400 font-medium ml-1">/ 5</span></h4>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVars}>
            <Card className="p-3 border-none shadow-md shadow-emerald-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.2rem] hover:ring-2 ring-emerald-500/20 transition-all cursor-pointer" onClick={() => onTabChange("clients")}>
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-2">
                 <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Mijozlar</p>
              <div className="flex items-end justify-between mt-0.5">
                 <h4 className="text-xl font-bold text-gray-900 dark:text-white">850</h4>
                 <span className="text-[9px] font-black text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    +15 ta
                 </span>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* QR Scanner Compact Banner */}
        <motion.div variants={itemVars}>
           <Card className="relative overflow-hidden border-none shadow-xl shadow-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] p-4 group cursor-pointer" onClick={() => onTabChange("scan-qr")}>
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1">
                     <h3 className="text-white text-lg font-bold leading-tight mb-1">QR Skaner</h3>
                     <p className="text-white/80 text-[11px] mb-3 leading-relaxed max-w-[200px]">Mijoz kodlarini skanerlash va buyurtmalarni tasdiqlash.</p>
                     <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg text-[11px] font-black px-4 h-8 shadow-md">
                        BOSHLASH
                     </Button>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                     <QrCode className="w-7 h-7 text-white" />
                  </div>
               </div>
               <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
                  <QrCode className="w-32 h-32 text-white" />
               </div>
           </Card>
        </motion.div>

        {/* Oxirgi Buyurtmalar Section */}
        <motion.div variants={itemVars}>
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Oxirgi buyurtmalar</h3>
             <Button variant="link" onClick={() => onTabChange("bookings")} className="text-primary text-sm p-0 h-auto font-semibold">Barchasi</Button>
           </div>
           <div className="space-y-4">
                {displayBookings.length > 0 ? (
                  displayBookings.map((booking: any) => (
                    <Card 
                      key={booking.id} 
                      className="p-2.5 border-none shadow-sm shadow-gray-100 bg-white dark:bg-gray-900 rounded-xl relative overflow-hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={(e) => {
                        // Prevent click from triggering if buttons are clicked
                        if ((e.target as HTMLElement).closest('button')) return;
                        onTabChange("bookings");
                      }}
                    >
                      <div className="flex flex-col space-y-1.5">
                         {/* Header: Name, Service & Status */}
                         <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-bold text-[13px] text-gray-900 dark:text-white truncate max-w-[140px] leading-tight">{booking.profile?.full_name}</h4>
                                  {booking.is_lottery_winner && (
                                     <span className="bg-amber-100 text-amber-700 text-[7px] px-1 py-0.5 rounded font-black uppercase whitespace-nowrap leading-none">Aksiya</span>
                                  )}
                               </div>
                               <p className="text-[10px] text-muted-foreground font-medium truncate leading-none mt-0.5">{booking.promotion?.service_name}</p>
                            </div>
                            <div className="shrink-0">{getStatusBadge(booking.status)}</div>
                         </div>

                         {/* Details Row: Price, Date, Time (Compact) */}
                         <div className="flex items-center justify-between text-[10px] text-gray-500 bg-gray-50/80 dark:bg-gray-800/80 p-1.5 rounded-lg">
                             <div className="flex items-center gap-3">
                                <span className={`font-bold ${booking.is_free ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                                   {booking.is_free ? 'Bepul' : `${(booking.promotion?.original_price || 0).toLocaleString()} so'm`}
                                </span>
                                <div className="flex items-center gap-1">
                                   <Calendar className="w-2.5 h-2.5" />
                                   <span>{booking.scheduled_date ? format(new Date(booking.scheduled_date), "d MMM", { locale: uz }) : "--"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                   <Clock className="w-2.5 h-2.5" />
                                   <span>{booking.scheduled_time || "--"}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-1 opacity-70">
                               <Phone className="w-2.5 h-2.5" />
                               <span>{booking.profile?.phone?.slice(-9)}</span>
                             </div>
                         </div>

                         {/* Mini Payment Info & Actions */}
                         <div className="flex items-center justify-between px-0.5">
                            <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400">
                                <div className="flex items-center gap-1">
                                   <div className="w-3.5 h-3.5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center scale-90">
                                      {getPaymentIcon(booking.payment_method)}
                                   </div>
                                   <span className="capitalize">{booking.payment_method || 'Naqd'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className={`w-1 h-1 rounded-full ${booking.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <span>{booking.payment_status === 'paid' ? "To'landi" : "To'lanmagan"}</span>
                                </div>
                            </div>
                            
                            {booking.status === "pending" && (
                               <div className="flex gap-2">
                                  <Button 
                                     variant="ghost" 
                                     size="sm" 
                                     className="h-7 px-2 rounded-md text-[10px] font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                     onClick={(e) => {
                                        e.stopPropagation();
                                        cancelBooking(booking.id);
                                     }}
                                  >
                                     Bekor qilish
                                  </Button>
                                  <Button 
                                     size="sm" 
                                     className="h-7 px-3 rounded-md text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/10"
                                     onClick={(e) => {
                                        e.stopPropagation();
                                        confirmBooking(booking.id);
                                     }}
                                  >
                                     Tasdiqlash
                                  </Button>
                               </div>
                            )}
                         </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-400 font-medium">Hozircha buyurtmalar yo'q</p>
                  </div>
                )}
           </div>
        </motion.div>

        {/* Oxirgi Sharhlar Section */}
        <motion.div variants={itemVars}>
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Oxirgi sharhlar</h3>
             <Button variant="link" onClick={() => onTabChange("reviews")} className="text-primary text-sm p-0 h-auto font-semibold">Barchasi</Button>
           </div>
           <Card className="overflow-hidden border-none shadow-md shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl p-1.5">
              <div className="space-y-1">
                {displayReviews.length > 0 ? (
                  displayReviews.map((review) => (
                    <div key={review.id} className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.overall_rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                              ))}
                           </div>
                           <span className="text-[11px] font-bold text-gray-900 dark:text-white">Foydalanuvchi</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{format(new Date(review.created_at), "d MMM", { locale: uz })}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-400 font-medium">Hozircha sharhlar yo'q</p>
                  </div>
                )}
              </div>
           </Card>
        </motion.div>
        
        <motion.div variants={itemVars}>
           <Card className="relative overflow-hidden border-none shadow-lg shadow-indigo-500/20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.2rem] p-4">
               <div className="relative z-10 w-3/4">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-2 backdrop-blur-md text-[9px] uppercase font-black">
                     Biznesingizni o'stiring
                  </Badge>
                  <h3 className="text-white text-base font-bold leading-tight mb-1">O'z sohangizda birinchi bo'ling</h3>
                  <p className="text-white/80 text-[10px] mb-4 leading-relaxed line-clamp-2">Platformada birinchi qatorlarda turish uchun "Top" obunasini oling.</p>
                  <Button onClick={() => onTabChange("subscription")} className="bg-white text-indigo-600 hover:bg-gray-50 rounded-lg text-[11px] font-black px-4 h-9 shadow-md">
                     OBUNA BO'LISH
                  </Button>
               </div>
               <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full flex items-center justify-center translate-x-6 translate-y-6">
                  <Star className="w-16 h-16 text-white/20 fill-white/10 rotate-12" />
               </div>
           </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
