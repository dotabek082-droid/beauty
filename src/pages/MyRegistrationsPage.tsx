import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, MapPin, Calendar, CheckCircle2, Clock, MessageSquare, Loader2, Trophy, Users, XCircle, Percent, Ticket, MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import FeedbackModal from "@/components/FeedbackModal";
import { format } from "date-fns";
import LotteryEntryModal from "@/components/LotteryEntryModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDateLocale } from "@/utils/dateLocale";

interface PromotionBooking {
  id: string;
  promotion_id: string;
  status: string;
  booked_at: string;
  completed_at: string | null;
  promotion: {
    id: string;
    service_name: string;
    salon_name: string;
    original_price: number;
    image_url: string | null;
    promotion_type?: string;
    discounted_price?: number;
  } | null;
  has_feedback: boolean;
  booking_details?: {
    date: string;
    time: string;
  };
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "Kutilmoqda", variant: "secondary", icon: <Clock className="w-3 h-3" /> },
  confirmed: { label: "Tasdiqlangan", variant: "default", icon: <CheckCircle2 className="w-3 h-3" /> },
  completed: { label: "Bajarilgan", variant: "outline", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Bekor qilingan", variant: "destructive", icon: null },
  won: { label: "G'olib bo'ldingiz!", variant: "default", icon: <Trophy className="w-3 h-3 text-yellow-500" /> },
  lost: { label: "Afsuski, yutmadingiz", variant: "secondary", icon: <XCircle className="w-3 h-3" /> },
  approved: { label: "Tasdiqlandi", variant: "default", icon: <CheckCircle2 className="w-3 h-3 text-green-500" /> },
  booking_pending: { label: "So'rov yuborildi", variant: "secondary", icon: <Clock className="w-3 h-3 text-blue-500" /> },
};

const PAGE_SIZE = 8;

// Mock Bookings for "Mening Ishtirokim"
const mockUserBookings: PromotionBooking[] = [
  // --- LOTTERY SCENARIOS ---
  {
    id: "mock-lottery-pending",
    promotion_id: "promo-lottery-pending",
    status: "pending",
    booked_at: new Date().toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-lottery-pending",
      service_name: "iPhone 16 Pro Max Yutib Oling!",
      salon_name: "Tech Beauty",
      original_price: 18000000,
      image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      discounted_price: 0
    },
    has_feedback: false
  },
  {
    id: "mock-lottery-lost",
    promotion_id: "promo-lottery-lost",
    status: "lost",
    booked_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-lottery-lost",
      service_name: "Dyson Airwrap Yutug'i",
      salon_name: "Luxury Hair",
      original_price: 6000000,
      image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      discounted_price: 0
    },
    has_feedback: false
  },
  {
    id: "mock-lottery-won",
    promotion_id: "promo-lottery-won",
    status: "won",
    booked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-lottery-won",
      service_name: "Dubayga Sayohat",
      salon_name: "Travel Beauty",
      original_price: 25000000,
      image_url: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      discounted_price: 0
    },
    has_feedback: false
  },
  {
    id: "mock-lottery-feedback",
    promotion_id: "promo-lottery-feedback",
    status: "completed",
    booked_at: new Date(Date.now() - 604800000).toISOString(),
    completed_at: new Date(Date.now() - 3600000).toISOString(),
    promotion: {
      id: "promo-lottery-feedback",
      service_name: "Yutuqli Spa Paketi (Fikr bildiring)",
      salon_name: "Lotus Wellness Spa",
      original_price: 1200000,
      image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      discounted_price: 0
    },
    has_feedback: false
  },

  // --- DISCOUNT SCENARIOS ---
  {
    id: "mock-discount-approved",
    promotion_id: "promo-discount-approved",
    status: "approved",
    booked_at: new Date().toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-discount-approved",
      service_name: "Soch Kesish va Turmaklash -50%",
      salon_name: "Style Studio",
      original_price: 200000,
      image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
      promotion_type: "discount",
      discounted_price: 100000
    },
    has_feedback: false
  },
  {
    id: "mock-discount-completed",
    promotion_id: "promo-discount-completed",
    status: "completed",
    booked_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    promotion: {
      id: "promo-discount-completed",
      service_name: "Kechki Makiyaj -20%",
      salon_name: "Glamour Zone",
      original_price: 300000,
      image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
      promotion_type: "discount",
      discounted_price: 240000
    },
    has_feedback: true
  },

  // --- 1+1 SCENARIOS ---
  {
    id: "mock-1plus1-approved",
    promotion_id: "promo-1plus1-approved",
    status: "approved",
    booked_at: new Date().toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-1plus1-approved",
      service_name: "1+1: Do'stingiz bilan keling",
      salon_name: "Barber King",
      original_price: 150000,
      image_url: "https://images.unsplash.com/photo-1503951914875-452162b7f30d?w=400&h=300&fit=crop",
      promotion_type: "1+1",
      discounted_price: 75000
    },
    has_feedback: false
  },

  // --- REGULAR / FREE SCENARIOS ---
  {
    id: "mock-regular-booking-pending",
    promotion_id: "promo-regular-pending",
    status: "booking_pending",
    booked_at: new Date().toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-regular-pending",
      service_name: "Yuz Tozalash (Booking)",
      salon_name: "Skin Care Pro",
      original_price: 400000,
      image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      promotion_type: "regular",
      discounted_price: 0
    },
    has_feedback: false
  },
  {
    id: "mock-regular-confirmed",
    promotion_id: "promo-regular-confirmed",
    status: "confirmed",
    booked_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-regular-confirmed",
      service_name: "Klassik Massaj",
      salon_name: "Relax Center",
      original_price: 350000,
      image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      promotion_type: "regular",
      discounted_price: 0
    },
    has_feedback: false,
    booking_details: {
      date: "2026-02-01",
      time: "14:00"
    }
  },
  {
    id: "mock-regular-cancelled",
    promotion_id: "promo-regular-cancelled",
    status: "cancelled",
    booked_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    completed_at: null,
    promotion: {
      id: "promo-regular-cancelled",
      service_name: "Pedikyur",
      salon_name: "Nails & Go",
      original_price: 180000,
      image_url: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=400&h=300&fit=crop",
      promotion_type: "regular",
      discounted_price: 0
    },
    has_feedback: false
  }
];

const MyRegistrationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<PromotionBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allPromotions, setAllPromotions] = useState<any[]>([]);
  const [winnersPromotions, setWinnersPromotions] = useState<any[]>([]);
  const [defaultTab, setDefaultTab] = useState("my-registrations");

  // Modals state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [selectedWinnerPromotion, setSelectedWinnerPromotion] = useState<any>(null);

  // Pagination for all promotions
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const promises = [
        fetchPromotions(0),
        fetchWinners()
      ];

      if (user) {
        promises.push(fetchBookings());
      }

      await Promise.all(promises);
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('promotion_bookings')
        .select(`
          *,
          promotion:promotions(
            id, service_name, salon_name, original_price, image_url
          )
        `)
        .eq('user_id', user.id)
        .order('booked_at', { ascending: false });

      if (error) throw error;

      // Merge real data with mock bookings for demo
      const realBookings = (data as any || []).map((b: any) => ({
        ...b,
        promotion: {
          ...b.promotion,
          promotion_type: 'regular' // Default for real DB if column missing
        }
      }));

      setBookings([...mockUserBookings, ...realBookings]);

    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    }
  };

  // Mock Data for "Barcha Aksiyalar"
  const mockAllPromotionsArray = [
    // --- PAGE 1 DATA (Active & Hot) ---
    {
      id: "mock-all-1",
      service_name: "Tilla Qosh va Kiprik",
      salon_name: "Gold Beauty",
      original_price: 200000,
      image_url: "https://images.unsplash.com/photo-1587776531980-2a5a0440cb62?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      winner_selection_date: new Date(Date.now() + 86400000 * 6).toISOString(),
      current_entries: 154,
      total_winners: 3
    },
    {
      id: "mock-all-2",
      service_name: "Soch Turmaklash -40%",
      salon_name: "Star Style",
      original_price: 150000,
      image_url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=300&fit=crop",
      promotion_type: "discount",
      discounted_price: 90000,
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
      current_entries: 45
    },
    {
      id: "mock-all-3",
      service_name: "Yuzni tozalash (Mechanical)",
      salon_name: "Clear Skin",
      original_price: 300000,
      image_url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop",
      promotion_type: "free", // Changed from 'regular' to 'free' so "Bepul olish" button shows
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      current_entries: 89,
      total_winners: 5
    },
    {
      id: "mock-all-4",
      service_name: "1+1: Gel Lak Manikyur",
      salon_name: "Nail Artistry",
      original_price: 120000,
      image_url: "https://images.unsplash.com/photo-1632345031433-d99c381c630f?w=400&h=300&fit=crop",
      promotion_type: "1+1",
      discounted_price: 60000,
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
      current_entries: 210
    },
    {
      id: "mock-all-5",
      service_name: "Spa Relax Day",
      salon_name: "Lotus Spa",
      original_price: 800000,
      image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      winner_selection_date: new Date(Date.now() + 86400000 * 4).toISOString(),
      current_entries: 342,
      total_winners: 1
    },
    {
      id: "mock-all-6",
      service_name: "Vizaj (Makiyaj)",
      salon_name: "Beauty Queen",
      original_price: 250000,
      image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
      promotion_type: "discount",
      discounted_price: 180000, // -~30%
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 20).toISOString(),
      current_entries: 12
    },
    {
      id: "mock-all-7",
      service_name: "Lazer Epilyatsiya (Butun tana)",
      salon_name: "Laser Pro",
      original_price: 1200000,
      image_url: "https://images.unsplash.com/photo-1598450162013-43a67733230c?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
      winner_selection_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      current_entries: 890,
      total_winners: 2
    },
    {
      id: "mock-all-8",
      service_name: "Soqol olish + Yuz massaji",
      salon_name: "Barber Shop Elite",
      original_price: 80000,
      image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
      promotion_type: "free", // Changed from 'regular' to 'free' so "Bepul olish" button shows
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      current_entries: 41
    },

    // --- PAGE 2 DATA (Mixed & Old) ---
    {
      id: "mock-all-9",
      service_name: "Keratin bilan to'g'rilash",
      salon_name: "Long Hair",
      original_price: 600000,
      image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop",
      promotion_type: "discount",
      discounted_price: 400000,
      is_active: false, // Old/Ended
      entry_deadline: new Date(Date.now() - 86400000 * 10).toISOString(),
      current_entries: 67
    },
    {
      id: "mock-all-10",
      service_name: "Manikyur + Pedikyur Set",
      salon_name: "Nails & Co",
      original_price: 200000,
      image_url: "https://images.unsplash.com/photo-1549488497-6cb56eb0d3be?w=400&h=300&fit=crop",
      promotion_type: "1+1",
      discounted_price: 100000,
      is_active: false,
      entry_deadline: new Date(Date.now() - 86400000 * 5).toISOString(),
      current_entries: 120
    },
    {
      id: "mock-all-11",
      service_name: "Iphone 15 Pro",
      salon_name: "Techno Prize",
      original_price: 14000000,
      image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: false,
      entry_deadline: new Date(Date.now() - 86400000 * 30).toISOString(),
      winner_selection_date: new Date(Date.now() - 86400000 * 29).toISOString(),
      current_entries: 5000,
      total_winners: 1
    },
    {
      id: "mock-all-12",
      service_name: "Massaj (1 soat)",
      salon_name: "Relax Point",
      original_price: 150000,
      image_url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      promotion_type: "regular",
      is_active: false,
      entry_deadline: new Date(Date.now() - 86400000 * 2).toISOString(),
      current_entries: 30
    },
    {
      id: "mock-all-13",
      service_name: "Yuz Maskasi",
      salon_name: "Natural Beauty",
      original_price: 50000,
      image_url: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400&h=300&fit=crop",
      promotion_type: "free",
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
      current_entries: 200
    },
    {
      id: "mock-all-14",
      service_name: "Soch kesish (Erkaklar)",
      salon_name: "Old School",
      original_price: 70000,
      image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
      promotion_type: "discount",
      discounted_price: 50000,
      is_active: true,
      entry_deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
      current_entries: 15
    }
  ];

  // Mock Data for "G'oliblar"
  const mockWinnersPromotionsArray = [
    {
      id: "mock-winner-1",
      service_name: "Iphone 15 Pro Max",
      salon_name: "Techno Prize",
      original_price: 18000000,
      image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: false,
      winner_selection_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      salon_address: "Toshkent, Chilonzor",
      winners: [
        { name: "Aziza Karimova", phone: "+998 90 *** *4 56", ticket: "A-1023", rank: 1 },
        { name: "Jamshid Oripov", phone: "+998 97 *** *1 22", ticket: "B-4921", rank: 2 },
        { name: "Malika T.", phone: "+998 99 *** *9 99", ticket: "C-8832", rank: 3 }
      ]
    },
    {
      id: "mock-winner-2",
      service_name: "Dubayga Sayohat (2 kishi)",
      salon_name: "Travel Dream",
      original_price: 25000000,
      image_url: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: false,
      winner_selection_date: new Date(Date.now() - 86400000 * 15).toISOString(),
      salon_address: "Toshkent, Yunusobod",
      winners: [
        { name: "Bekzod Alimov", phone: "+998 93 *** *7 77", ticket: "TR-5512", rank: 1 }
      ]
    },
    {
      id: "mock-winner-3",
      service_name: "Dyson Airwrap Complete",
      salon_name: "Beauty Tech",
      original_price: 6500000,
      image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: false,
      winner_selection_date: new Date(Date.now() - 86400000 * 25).toISOString(),
      salon_address: "Samarkand, Center",
      winners: [
        { name: "Laylo Sharipova", phone: "+998 91 *** *2 10", ticket: "DY-1293", rank: 1 },
        { name: "Nigora K.", phone: "+998 33 *** *0 00", ticket: "DY-9482", rank: 2 }
      ]
    },
    {
      id: "mock-winner-4",
      service_name: "Yillik Abonement (SPA)",
      salon_name: "Lotus Wellness",
      original_price: 12000000,
      image_url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
      promotion_type: "lottery",
      lottery_enabled: true,
      is_active: false,
      winner_selection_date: new Date(Date.now() - 86400000 * 40).toISOString(),
      salon_address: "Bukhara City",
      winners: [
        { name: "Olimjon Tuychiev", phone: "+998 88 *** *8 88", ticket: "SP-9911", rank: 1 }
      ]
    }
  ];

  const fetchPromotions = async (pageIndex: number, append = false) => {
    try {
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE;

      // Simulate Pagination with Mock Data
      const slicedMockData = mockAllPromotionsArray.slice(from, to);
      const totalMockCount = mockAllPromotionsArray.length;

      // NOTE: In a real app, you would fetch from Supabase here.
      // For demo, we are prioritizing mock data but could merge if needed.
      // const { data, error, count } = await supabase... 

      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 600));

      if (append) {
        setAllPromotions(prev => [...prev, ...slicedMockData]);
      } else {
        setAllPromotions(slicedMockData);
      }

      setHasMore(to < totalMockCount);

    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const fetchWinners = async () => {
    try {
      // Simulate fetch from server
      await new Promise(resolve => setTimeout(resolve, 800));

      // Use mock data
      setWinnersPromotions(mockWinnersPromotionsArray as any);

      /* 
      // Real implementation would look like this:
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', false)
        .not('winner_selection_date', 'is', null)
        .order('winner_selection_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWinnersPromotions(data || []);
      */
    } catch (error) {
      console.error("Error fetching winners:", error);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPromotions(nextPage, true);
    setIsLoadingMore(false);
  };

  const handleViewDetails = (booking: PromotionBooking) => {
    setSelectedPromotion(booking.promotion);
    setSelectedBooking(booking);
    setIsReadOnly(true);
    setIsJoinModalOpen(true);
  };

  const handleJoinClick = (promo: any) => {
    setSelectedPromotion(promo);
    setSelectedBooking(null);
    setIsReadOnly(false);
    setIsJoinModalOpen(true);
  };

  const handleBook = async () => {
    await fetchBookings();
    setIsJoinModalOpen(false);
    const trigger = document.querySelector('[value="my-registrations"]') as HTMLElement;
    if (trigger) trigger.click();
  };

  const handleOpenFeedback = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
    setSelectedBookingId(null);
    fetchBookings();
  };

  const handleOpenWinnerModal = (promo: any) => {
    setSelectedWinnerPromotion(promo);
    setIsWinnerModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd.MM.yyyy HH:mm", { locale: getDateLocale(language) });
    } catch {
      return dateStr;
    }
  };

  // Removed early return for !user to allow guest access


  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4 safe-top">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Aksiyalar Markazi</h1>
            <p className="text-xs text-muted-foreground">Yutuqli o'yinlar va ishtirok</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-xl mb-6">
            <TabsTrigger
              value="my-registrations"
              className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              Mening Ishtirokim
            </TabsTrigger>
            <TabsTrigger
              value="all-promotions"
              id="all-promotions-trigger"
              className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              Barcha Aksiyalar
            </TabsTrigger>
            <TabsTrigger
              value="winners"
              className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              G'oliblar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-registrations" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !user ? (
              <Card className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Tizimga kiring</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  Aksiyalarda ishtirok etish va yutuqlaringizni ko'rish uchun avval tizimga kiring.
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full max-w-[200px]">
                  Kirish
                </Button>
              </Card>
            ) : bookings.length === 0 ? (
              <Card className="p-8 text-center">
                <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Hali ro'yxatdan o'tmadingiz</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bepul xizmatlar aksiyalariga ro'yxatdan o'ting va imtiyozlardan foydalaning!
                </p>
              </Card>
            ) : (
              bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleViewDetails(booking)}
                  className="cursor-pointer group"
                >
                  <Card className="overflow-hidden group-hover:border-primary/50 transition-colors">
                    <div className="flex">
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <img
                          src={booking.promotion?.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200"}
                          alt={booking.promotion?.service_name || "Xizmat"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[90%]">
                          {(() => {
                            const type = booking.promotion?.promotion_type || 'regular';
                            if (type === 'lottery') {
                              return (
                                <Badge className="bg-purple-600 text-white border-none text-[10px]">
                                  <Trophy className="w-2.5 h-2.5 mr-0.5" />
                                  LOTEREYA
                                </Badge>
                              );
                            } else if (type === 'discount') {
                              const original = booking.promotion?.original_price || 0;
                              const discounted = booking.promotion?.discounted_price || 0;
                              const percent = original > 0 && discounted < original ? Math.round(((original - discounted) / original) * 100) : 0;
                              return (
                                <Badge className="bg-orange-500 text-white border-none text-[10px] whitespace-nowrap">
                                  <Percent className="w-2.5 h-2.5 mr-0.5" />
                                  {percent > 0 ? `-${percent}% CHEGIRMA` : "CHEGIRMA"}
                                </Badge>
                              );
                            } else if (type === '1+1') {
                              return (
                                <Badge className="bg-blue-500 text-white border-none text-[10px]">
                                  <Users className="w-2.5 h-2.5 mr-0.5" />
                                  1+1 AKSIYA
                                </Badge>
                              );
                            } else {
                              return (
                                <Badge className="bg-success text-success-foreground text-[10px]">
                                  <Gift className="w-2.5 h-2.5 mr-0.5" />
                                  BEPUL
                                </Badge>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {booking.promotion?.service_name || "Xizmat nomi"}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{booking.promotion?.salon_name || "Salon"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(booking.booked_at)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {booking.status === 'pending' ? (
                            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Natija kutilmoqda
                            </Badge>
                          ) : (
                            <Badge variant={statusConfig[booking.status]?.variant || "secondary"} className="text-[10px]">
                              {statusConfig[booking.status]?.icon}
                              <span className="ml-1">{statusConfig[booking.status]?.label || booking.status}</span>
                            </Badge>
                          )}

                          {booking.status === 'completed' && (
                            booking.has_feedback ? (
                              <Badge variant="outline" className="text-[10px] text-success border-success ml-auto" onClick={(e) => e.stopPropagation()}>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Fikr qoldirilgan
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2 ml-auto border-primary text-primary hover:bg-primary hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenFeedback(booking.id);
                                }}
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Fikr qoldirish
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="all-promotions" className="space-y-6 animate-in fade-in-50 duration-500">
            {allPromotions.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                <Gift className="w-12 h-12 mb-3 opacity-20" />
                <p>Hozirda faol aksiyalar yo'q</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {allPromotions.map((promo, i) => (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="flex flex-row overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group bg-card h-36 sm:h-40">
                        {/* Image Section - Ultra Compact Horizontal */}
                        <div className="relative w-28 sm:w-48 h-full shrink-0 overflow-hidden bg-muted">
                          <img
                            src={promo.image_url || "/placeholder.svg"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={promo.service_name}
                          />

                          {/* Top Badges */}
                          <div className="absolute top-1 left-1 flex flex-wrap gap-1 items-start z-10">
                            {promo.lottery_enabled && (
                              <Badge className="bg-purple-600/90 text-white border-none shadow-sm text-[8px] sm:text-[10px] px-1.5 py-0.5">
                                <Trophy className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" /> LOTEREYA
                              </Badge>
                            )}
                            {promo.promotion_type === '1+1' && (
                              <Badge className="bg-blue-600/90 text-white border-none shadow-sm text-[8px] sm:text-[10px] px-1.5 py-0.5">
                                1+1
                              </Badge>
                            )}
                            {promo.promotion_type === 'free' && (
                              <Badge className="bg-green-600/90 text-white border-none shadow-sm text-[8px] sm:text-[10px] px-1.5 py-0.5">
                                BEPUL
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Content Section - Compact with smaller fonts */}
                        <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1 text-[9px] sm:text-xs text-muted-foreground w-full">
                                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-primary" />
                                <span className="truncate">{promo.salon_name}</span>
                              </div>
                            </div>

                            <h3 className="font-bold text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
                              {promo.service_name}
                            </h3>

                            <div className="flex items-center gap-1.5 mb-1.5">
                              {promo.original_price > 0 && (
                                <span className="text-[9px] sm:text-xs text-muted-foreground line-through decoration-red-400/50">
                                  {promo.original_price?.toLocaleString()}
                                </span>
                              )}
                              <span className={`text-xs sm:text-sm font-bold ${promo.discounted_price === 0 && !promo.lottery_enabled ? 'text-green-600' : 'text-primary'
                                }`}>
                                {promo.discounted_price > 0 ? promo.discounted_price.toLocaleString() : (promo.promotion_type === 'free' ? 'BEPUL' : '0')}
                                {promo.discounted_price > 0 && <span className="text-[9px] sm:text-[10px] font-normal ml-0.5">so'm</span>}
                              </span>
                            </div>

                            {/* Mobile: Participation Count */}
                            <div className="flex sm:hidden items-center gap-1 text-[9px] text-muted-foreground mb-1">
                              <Users className="w-2.5 h-2.5 text-primary" />
                              <span>{promo.current_entries || 0} qatnashchi</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-1.5 mt-auto">
                            <div className="hidden sm:flex flex-col gap-0.5 text-[9px] sm:text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/50 min-w-[100px]">
                              <div className="flex justify-between">
                                <span>Tugash:</span>
                                <span className="font-medium text-foreground">{promo.entry_deadline ? formatDate(promo.entry_deadline).split(' ')[0] : "28.02"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{promo.lottery_enabled ? "Sovrin:" : "Holat:"}</span>
                                <span className={`font-medium ${promo.lottery_enabled ? "text-purple-600" : "text-green-600"}`}>{promo.lottery_enabled ? `${promo.total_winners} ta` : "Faol"}</span>
                              </div>
                            </div>

                            <Button
                              className={`w-full sm:w-auto font-bold shadow-sm h-7 sm:h-8 text-[10px] sm:text-xs transition-all ${!promo.is_active
                                ? ""
                                : promo.lottery_enabled
                                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                                  : promo.promotion_type === 'free'
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : promo.promotion_type === '1+1'
                                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                                      : "bg-primary hover:bg-primary/90"
                                }`}
                              variant={promo.is_active ? "default" : "secondary"}
                              onClick={() => handleJoinClick(promo)}
                              disabled={!promo.is_active}
                            >
                              {promo.is_active ? (
                                <span className="flex items-center gap-1">
                                  {promo.lottery_enabled ? (
                                    <>
                                      <Ticket className="w-3 h-3" />
                                      Ishtirok
                                    </>
                                  ) : promo.promotion_type === 'discount' ? (
                                    <>
                                      <Percent className="w-3 h-3" />
                                      Chegirma
                                    </>
                                  ) : promo.promotion_type === '1+1' ? (
                                    <>
                                      <Users className="w-3 h-3" />
                                      Aksiya
                                    </>
                                  ) : promo.promotion_type === 'free' ? (
                                    <>
                                      <Gift className="w-3 h-3" />
                                      Bepul
                                    </>
                                  ) : (
                                    <>
                                      <MousePointerClick className="w-3 h-3" />
                                      Tanlash
                                    </>
                                  )}
                                </span>
                              ) : (
                                "Yakunlangan"
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-8 pb-4">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="rounded-full px-8 border-dashed border-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {isLoadingMore ? "Yuklanmoqda..." : "Yana ko'rsatish"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="winners" className="space-y-6">
            <Card className="relative overflow-hidden p-6 border-none shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 opacity-95" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
              <div className="relative flex items-center gap-6 z-10 text-white">
                <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20 shadow-inner">
                  <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-md" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">G'oliblar Doskasi</h3>
                  <p className="text-purple-100 opacity-90 leading-relaxed max-w-lg">
                    Bizning baxtli g'oliblarimiz bilan tanishing! Barcha o'tkazilgan yutuqli o'yinlar tarixi va natijalari (History).
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {winnersPromotions.length === 0 ? (
                <div className="col-span-full text-center p-12 bg-muted/30 rounded-2xl border-2 border-dashed border-muted text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Hozircha yakunlangan aksiyalar yo'q</p>
                </div>
              ) : (
                winnersPromotions.map((promo, i) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleOpenWinnerModal(promo)}
                    className="cursor-pointer group"
                  >
                    <Card className="h-full overflow-hidden border-border/60 hover:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                      <div className="flex flex-col h-full">
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={promo.image_url || "/placeholder.svg"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Promo"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                          <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-white/20 shadow-lg px-3 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> YAKUNLANGAN
                            </Badge>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h4 className="font-bold text-xl leading-tight mb-2 drop-shadow-lg line-clamp-2">
                              {promo.service_name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-200">
                              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                <MapPin className="w-3.5 h-3.5 text-white/80" />
                                <span className="truncate max-w-[150px]">{promo.salon_name}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 bg-card flex-1 flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">O'ynalgan sana:</span>
                              <span className="font-medium flex items-center gap-1.5 text-foreground">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                {promo.winner_selection_date ? formatDate(promo.winner_selection_date) : "01.03.2026"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">Ishtirokchilar:</span>
                              <span className="font-medium flex items-center gap-1.5 text-foreground">
                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                {1200 + i * 534} kishi
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto pt-2">
                            <Button className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors" variant="outline">
                              <Trophy className="w-4 h-4 mr-2 text-yellow-500 group-hover:text-yellow-300" />
                              G'oliblarni ko'rish
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FeedbackModal
        bookingId={selectedBookingId}
        isOpen={isFeedbackOpen}
        onClose={handleFeedbackClose}
      />

      <LotteryEntryModal
        promotion={selectedPromotion}
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        readOnly={isReadOnly}
        booking={selectedBooking}
        onBook={handleBook}
      />

      <Dialog open={isWinnerModalOpen} onOpenChange={setIsWinnerModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>G'oliblar Ro'yxati</DialogTitle>
            <DialogDescription>
              Ushbu aksiya bo'yicha g'olib bo'lgan ishtirokchilar.
            </DialogDescription>
          </DialogHeader>

          {selectedWinnerPromotion && (
            <div className="space-y-6 mt-2">
              <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img src={selectedWinnerPromotion.image_url || "/placeholder.svg"} className="w-full h-full object-cover" alt="Promo" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{selectedWinnerPromotion.service_name}</h4>
                  <p className="text-xs text-muted-foreground">{selectedWinnerPromotion.salon_name}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  G'oliblar (5 kishi)
                </h5>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5].map((winnerMsg, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-secondary text-foreground'}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Foydalanuvchi {99 + idx}7**</p>
                          <p className="text-[10px] text-muted-foreground">ID: {10000 + idx * 23}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] bg-background">
                        #{Math.floor(Math.random() * 10000)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300">Shaffoflik Kafolati</h5>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Barcha g'oliblar random.org orqali tasodifiy raqamlar generatori yordamida aniqlangan va natijalar o'zgartirilmasdir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default MyRegistrationsPage;
