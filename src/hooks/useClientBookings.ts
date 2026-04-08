import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ClientBooking {
  id: string;
  promotion_id: string;
  status: "pending" | "confirmed" | "scheduled" | "completed" | "cancelled" | "no_show";
  booked_at: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  completed_at: string | null;
  is_winner: boolean;
  payment_method?: "cash" | "card" | "coins" | null;
  promotion: {
    id: string;
    service_name: string;
    salon_name: string;
    salon_id: string;
    original_price: number;
    image_url: string | null;
  } | null;
  has_feedback: boolean;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export const useClientBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = useCallback(async (page = 1, limit = 10) => {
    // Mock Server Fetch
    try {
      const mockResponse = await fetch(`http://localhost:8081/bookings?page=${page}&limit=${limit}`);
      if (mockResponse.ok) {
        const responseData = await mockResponse.json();
        const mockData = responseData.data || [];
        const total = responseData.total || 0;

        const mappedMockBookings: ClientBooking[] = mockData.map((b: any) => ({
          ...b,
          promotion: b.promotion ? {
            ...b.promotion,
            image_url: b.promotion.image_url || null
          } : null,
          payment_method: b.payment_method || null // Assign payment method from mock
        }));

        // Sort by booked_at desc
        mappedMockBookings.sort((a, b) => new Date(b.booked_at).getTime() - new Date(a.booked_at).getTime());

        if (page === 1) {
          setBookings(mappedMockBookings);
        } else {
          setBookings(prev => [...prev, ...mappedMockBookings]);
        }

        setHasMore(bookings.length + mappedMockBookings.length < total);
        setCurrentPage(page);

        // Update stats from server
        if (responseData.stats) {
          setStats(responseData.stats);
        } else {
          // Fallback approximation if server doesn't return stats (won't happen with new server)
          setStats(prev => ({ ...prev, total: total }));
        }

        setIsLoading(false);
        return; // Exit if mock fetch successful
      }
    } catch (e) {
      console.warn("Mock server not available, falling back to Supabase");
    }

    if (!user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch bookings from database
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("promotion_bookings" as any)
        .select(`
          id,
          promotion_id,
          status,
          booked_at,
          scheduled_date,
          scheduled_time,
          completed_at,
          is_winner,
          payment_method
        `)
        .eq("user_id", user.id)
        .order("booked_at", { ascending: false });

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
      }

      // Fetch localStorage bookings
      const localBookings = JSON.parse(localStorage.getItem('user_bookings') || '{}');
      const userLocalBookings = localBookings[user.id] || [];

      // If no bookings at all
      if ((!bookingsData || bookingsData.length === 0) && userLocalBookings.length === 0) {
        setBookings([]);
        setStats({ total: 0, pending: 0, confirmed: 0, scheduled: 0, completed: 0, cancelled: 0 });
        setHasMore(false); // No bookings, so no more to load
        return;
      }

      let enrichedBookings: ClientBooking[] = [];

      // Process database bookings
      if (bookingsData && bookingsData.length > 0) {
        const promotionIds = [...new Set(bookingsData.map((b: any) => b.promotion_id))];
        const { data: promotionsData } = await supabase
          .from("promotions")
          .select("id, service_name, salon_name, salon_id, original_price, image_url")
          .in("id", promotionIds);

        const { data: feedbackData } = await supabase
          .from("feedback_responses")
          .select("booking_id")
          .in("booking_id", bookingsData.map((b: any) => b.id));

        const feedbackBookingIds = new Set(feedbackData?.map((f) => f.booking_id) || []);
        const promotionsMap = new Map(promotionsData?.map((p) => [p.id, p]) || []);

        enrichedBookings = bookingsData.map((booking: any) => ({
          ...booking,
          status: booking.status as ClientBooking["status"],
          payment_method: booking.payment_method as any,
          promotion: promotionsMap.get(booking.promotion_id) || null,
          has_feedback: feedbackBookingIds.has(booking.id),
        }));
      }

      // Process localStorage bookings and add them
      const localEnrichedBookings: ClientBooking[] = userLocalBookings.map((booking: any) => ({
        id: booking.id,
        promotion_id: 'local',
        status: booking.status as ClientBooking["status"],
        booked_at: booking.booked_at,
        scheduled_date: booking.scheduled_date,
        scheduled_time: booking.scheduled_time,
        completed_at: null,
        is_winner: false,
        payment_method: booking.payment_method || 'cash', // Default to cash for local
        promotion: {
          id: 'local',
          service_name: booking.service_name,
          salon_name: booking.salon_name,
          salon_id: booking.salon_id || '',
          original_price: booking.original_price,
          image_url: null,
        },
        has_feedback: false,
      }));

      // Merge and sort by date
      const FAKE_BOOKINGS: ClientBooking[] = [
        {
          id: "fake-booking-glamour",
          promotion_id: "fake-promo-glamour",
          status: "cancelled",
          booked_at: "2026-01-20T10:00:00.000Z",
          scheduled_date: "2026-01-22",
          scheduled_time: "09:00",
          completed_at: null,
          is_winner: false,
          promotion: {
            id: "fake-promo-glamour",
            service_name: "Ayollar soch turmagi",
            salon_name: "Glamour Hair",
            salon_id: "glamour-hair",
            original_price: 150000,
            image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-oltin",
          promotion_id: "fake-promo-oltin",
          status: "confirmed",
          booked_at: "2026-01-28T14:30:00.000Z",
          scheduled_date: "2026-02-02",
          scheduled_time: "11:00",
          completed_at: null,
          is_winner: false,
          promotion: {
            id: "fake-promo-oltin",
            service_name: "Soch kesish",
            salon_name: "Oltin Qaychi",
            salon_id: "fake-1",
            original_price: 80000,
            image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-guncha",
          promotion_id: "fake-promo-guncha",
          status: "pending",
          booked_at: "2026-01-29T09:00:00.000Z",
          scheduled_date: "2026-02-05",
          scheduled_time: "14:00",
          completed_at: null,
          is_winner: false,
          promotion: {
            id: "fake-promo-guncha",
            service_name: "Makiyaj",
            salon_name: "G'uncha Go'zallik Saloni",
            salon_id: "fake-2",
            original_price: 200000,
            image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-lola-nails",
          promotion_id: "fake-promo-lola-nails",
          status: "scheduled",
          booked_at: "2026-01-28T16:45:00.000Z",
          scheduled_date: "2026-02-03",
          scheduled_time: "10:30",
          completed_at: null,
          is_winner: true,
          promotion: {
            id: "fake-promo-nails",
            service_name: "Manikyur",
            salon_name: "Lola Nails",
            salon_id: "fake-nails-1",
            original_price: 120000,
            image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-hair-completed",
          promotion_id: "fake-promo-hair",
          status: "completed",
          booked_at: "2026-01-10T10:00:00.000Z",
          scheduled_date: "2026-01-12",
          scheduled_time: "14:00",
          completed_at: "2026-01-12T15:30:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-hair-svc",
            service_name: "Soch bo'yash",
            salon_name: "Oltin Qaychi",
            salon_id: "fake-1",
            original_price: 350000,
            image_url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-makeup-completed",
          promotion_id: "fake-promo-makeup",
          status: "completed",
          booked_at: "2026-01-11T09:00:00.000Z",
          scheduled_date: "2026-01-13",
          scheduled_time: "16:00",
          completed_at: "2026-01-13T17:30:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-makeup-svc",
            service_name: "Kechki makiyaj",
            salon_name: "G'uncha Go'zallik",
            salon_id: "fake-2",
            original_price: 200000,
            image_url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-nails-completed",
          promotion_id: "fake-promo-nails-completed",
          status: "completed",
          booked_at: "2026-01-12T11:00:00.000Z",
          scheduled_date: "2026-01-14",
          scheduled_time: "10:00",
          completed_at: "2026-01-14T11:30:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-nails-svc",
            service_name: "Pedikyur",
            salon_name: "Lola Nails",
            salon_id: "fake-nails-1",
            original_price: 150000,
            image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-skincare-completed",
          promotion_id: "fake-promo-skincare",
          status: "completed",
          booked_at: "2026-01-13T13:00:00.000Z",
          scheduled_date: "2026-01-16",
          scheduled_time: "13:00",
          completed_at: "2026-01-16T14:30:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-skincare-svc",
            service_name: "Facial Cleansing",
            salon_name: "Silk Beauty Center",
            salon_id: "fake-4",
            original_price: 300000,
            image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-spa-completed",
          promotion_id: "fake-promo-spa-svc",
          status: "completed",
          booked_at: "2026-01-14T15:00:00.000Z",
          scheduled_date: "2026-01-17",
          scheduled_time: "18:00",
          completed_at: "2026-01-17T19:30:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-spa-svc",
            service_name: "Aromaterapiya",
            salon_name: "Lola SPA",
            salon_id: "fake-3",
            original_price: 400000,
            image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-brows-completed",
          promotion_id: "fake-promo-brows",
          status: "completed",
          booked_at: "2026-01-15T09:30:00.000Z",
          scheduled_date: "2026-01-18",
          scheduled_time: "11:30",
          completed_at: "2026-01-18T12:00:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-brows-svc",
            service_name: "Qosh terish",
            salon_name: "Luxe Lashes",
            salon_id: "fake-5",
            original_price: 50000,
            image_url: "https://images.unsplash.com/photo-1588510066060-d5be80e0c156?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-wedding-completed",
          promotion_id: "fake-promo-wedding",
          status: "completed",
          booked_at: "2026-01-05T08:00:00.000Z",
          scheduled_date: "2026-01-08",
          scheduled_time: "07:00",
          completed_at: "2026-01-08T11:00:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-wedding-svc",
            service_name: "Kelin obrazi",
            salon_name: "Royal Wedding Beauty",
            salon_id: "fake-6",
            original_price: 1500000,
            image_url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-premium-completed",
          promotion_id: "fake-promo-premium",
          status: "completed",
          booked_at: "2026-01-18T10:00:00.000Z",
          scheduled_date: "2026-01-20",
          scheduled_time: "14:00",
          completed_at: "2026-01-20T16:00:00.000Z",
          is_winner: false,
          promotion: {
            id: "fake-promo-premium-svc",
            service_name: "VIP Xizmat",
            salon_name: "Premium Style",
            salon_id: "fake-premium",
            original_price: 800000,
            image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        },
        {
          id: "fake-booking-lottery-winner",
          promotion_id: "fake-promo-lottery",
          status: "completed",
          booked_at: "2026-01-25T12:00:00.000Z",
          scheduled_date: "2026-01-27",
          scheduled_time: "15:00",
          completed_at: "2026-01-27T16:00:00.000Z",
          is_winner: true,
          promotion: {
            id: "fake-promo-lottery-svc",
            service_name: "Yutuqli Soch Kesish",
            salon_name: "Oltin Qaychi",
            salon_id: "fake-1",
            original_price: 0,
            image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
          },
          has_feedback: false,
        }
      ];

      const allBookings = [...enrichedBookings, ...localEnrichedBookings, ...FAKE_BOOKINGS].sort(
        (a, b) => new Date(b.booked_at).getTime() - new Date(a.booked_at).getTime()
      );

      setBookings(allBookings);

      // Calculate stats
      const newStats: BookingStats = {
        total: allBookings.length,
        pending: allBookings.filter((b) => b.status === "pending").length,
        confirmed: allBookings.filter((b) => b.status === "confirmed").length,
        scheduled: allBookings.filter((b) => b.status === "scheduled").length,
        completed: allBookings.filter((b) => b.status === "completed").length,
        cancelled: allBookings.filter((b) => b.status === "cancelled" || b.status === "no_show").length,
      };
      setStats(newStats);
      setHasMore(false); // Supabase fallback fetches all, so no more to load
    } catch (err) {
      console.error("Error:", err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  }, [user, bookings.length]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchBookings();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`client_bookings_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "promotion_bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Booking update:", payload);
          // Refresh bookings on any change
          fetchBookings();

          // Show notification for status changes
          if (payload.eventType === "UPDATE") {
            const newRecord = payload.new as { status: string };
            const oldRecord = payload.old as { status: string };

            if (newRecord.status !== oldRecord.status) {
              const statusMessages: Record<string, string> = {
                confirmed: "Buyurtmangiz tasdiqlandi! ✅",
                scheduled: "Vaqt belgilandi! 📅",
                completed: "Xizmat bajarildi! 🎉",
                cancelled: "Buyurtma bekor qilindi",
                no_show: "Siz kelmadingiz 😢",
              };

              if (statusMessages[newRecord.status]) {
                toast.info(statusMessages[newRecord.status]);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchBookings]);

  const cancelBooking = async (bookingId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Tizimga kiring" };
    }

    // Handle local booking cancellation
    if (bookingId.startsWith('booking_')) {
      try {
        const localBookings = JSON.parse(localStorage.getItem('user_bookings') || '{}');
        const userLocalBookings = localBookings[user.id] || [];

        // Find and update the booking status to cancelled
        const updatedBookings = userLocalBookings.map((b: any) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        );

        localBookings[user.id] = updatedBookings;
        localStorage.setItem('user_bookings', JSON.stringify(localBookings));

        // Deduct coins penalty
        const { deductCoins, COIN_VALUES } = await import('@/utils/coinBalance');
        deductCoins(user.id, COIN_VALUES.CANCELLATION_PENALTY, 'Buyurtmani bekor qilish jarimasi');

        toast.success(`Buyurtma bekor qilindi. Reyting: -5 ball, Hamyon: -${COIN_VALUES.CANCELLATION_PENALTY} tanga`);
        await fetchBookings(); // Refresh list
        return { success: true };
      } catch (e) {
        console.error("Local cancel error:", e);
        return { success: false, error: "Bekor qilishda xatolik" };
      }
    }

    try {
      const { error } = await supabase
        .from("promotion_bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Deduct coins penalty
      const { deductCoins, COIN_VALUES } = await import('@/utils/coinBalance');
      deductCoins(user.id, COIN_VALUES.CANCELLATION_PENALTY, 'Buyurtmani bekor qilish jarimasi');

      toast.success(`Buyurtma bekor qilindi. Reyting: -5 ball, Hamyon: -${COIN_VALUES.CANCELLATION_PENALTY} tanga`);
      await fetchBookings();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Xatolik yuz berdi" };
    }
  };

  const getUpcomingBookings = (): ClientBooking[] => {
    return bookings.filter(
      (b) => b.status === "pending" || b.status === "confirmed" || b.status === "scheduled"
    );
  };

  const getPastBookings = (): ClientBooking[] => {
    return bookings.filter(
      (b) => b.status === "completed" || b.status === "cancelled" || b.status === "no_show"
    );
  };

  const getBookingsByStatus = (status: ClientBooking["status"]): ClientBooking[] => {
    return bookings.filter((b) => b.status === status);
  };

  return {
    bookings,
    isLoading,
    stats,
    cancelBooking,
    getUpcomingBookings,
    getPastBookings,
    getBookingsByStatus,
    refreshBookings: () => fetchBookings(1),
    loadMore: () => fetchBookings(currentPage + 1),
    hasMore,
  };
};
