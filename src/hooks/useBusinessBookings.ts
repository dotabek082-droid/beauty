import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  promotion_id: string;
  user_id: string;
  status: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  is_winner: boolean;
  booked_at: string;
  created_at: string;
  completed_at: string | null;
  promotion?: {
    service_name: string;
    salon_name: string;
    original_price: number;
  };
  profile?: {
    full_name: string | null;
    phone: string | null;
  };
}

export const useBusinessBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Fetch bookings with related promotion and profile data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("promotion_bookings")
        .select(`
          *,
          promotions:promotion_id (
            service_name,
            salon_name,
            original_price
          )
        `)
        .order("created_at", { ascending: false });

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        throw bookingsError;
      }

      // Fetch profiles separately for each booking
      const bookingsWithProfiles = await Promise.all(
        (bookingsData || []).map(async (booking) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("user_id", booking.user_id)
            .maybeSingle();

          return {
            ...booking,
            promotion: booking.promotions,
            profile: profileData,
          };
        })
      );

      setBookings(bookingsWithProfiles);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Xatolik",
        description: "Buyurtmalarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const updateData: Record<string, unknown> = { status };

      if (status === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("promotion_bookings")
        .update(updateData)
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Muvaffaqiyatli",
        description: `Buyurtma holati yangilandi`,
      });

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status, ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}) } : b
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Xatolik",
        description: "Buyurtma holatini yangilashda xatolik",
        variant: "destructive",
      });
    }
  };

  const confirmBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "confirmed");
  };

  const cancelBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "cancelled");
  };

  const completeBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "completed");
  };

  const blockTimeSlot = async (date: string, time: string, reason?: string) => {
    try {
      console.log('blockTimeSlot called:', { date, time, reason });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        throw new Error("Not authenticated");
      }

      console.log('Inserting block for user:', user.id);

      const { data, error } = await supabase
        .from("promotion_bookings")
        .insert({
          user_id: user.id,
          promotion_id: null,
          status: "blocked",
          scheduled_date: date,
          scheduled_time: time,
          is_winner: false,
          booked_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Block created successfully:', data);

      toast({
        title: "Muvaffaqiyatli",
        description: "Vaqt bloklandi",
      });

      await fetchBookings();
    } catch (error) {
      console.error("Error blocking time slot:", error);
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Vaqtni bloklashda xatolik",
        variant: "destructive",
      });
    }
  };

  const unblockTimeSlot = async (blockingId: string) => {
    try {
      const { error } = await supabase
        .from("promotion_bookings")
        .delete()
        .eq("id", blockingId)
        .eq("status", "blocked");

      if (error) throw error;

      toast({
        title: "Muvaffaqiyatli",
        description: "Vaqt bloki olib tashlandi",
      });

      await fetchBookings();
    } catch (error) {
      console.error("Error unblocking time slot:", error);
      toast({
        title: "Xatolik",
        description: "Blokni olib tashflashda xatolik",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookings();

    // Set up real-time subscription
    const channel = supabase
      .channel("business-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "promotion_bookings",
        },
        (payload) => {
          console.log("Real-time booking update:", payload);

          if (payload.eventType === "INSERT") {
            // Fetch the new booking with profile data
            fetchBookings();
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? { ...b, ...payload.new } : b
              )
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    bookings,
    loading,
    confirmBooking,
    cancelBooking,
    completeBooking,
    blockTimeSlot,
    unblockTimeSlot,
    refetch: fetchBookings,
  };
};