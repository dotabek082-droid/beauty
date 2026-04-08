import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlot {
  id: string;
  promotion_id: string;
  salon_id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
}

export const useTimeSlots = (promotionId: string | null) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (promotionId) {
      fetchTimeSlots();
    }
  }, [promotionId]);

  const fetchTimeSlots = async () => {
    if (!promotionId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .eq("promotion_id", promotionId)
        .eq("is_available", true)
        .gte("slot_date", new Date().toISOString().split("T")[0])
        .order("slot_date", { ascending: true })
        .order("slot_time", { ascending: true });

      if (error) {
        console.error("Error fetching time slots:", error);
        return;
      }

      setTimeSlots(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const bookTimeSlot = async (
    slotId: string,
    bookingId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Mark slot as unavailable
      const { error: slotError } = await supabase
        .from("time_slots")
        .update({ is_available: false })
        .eq("id", slotId);

      if (slotError) {
        return { success: false, error: slotError.message };
      }

      // Get slot details
      const slot = timeSlots.find((s) => s.id === slotId);
      if (!slot) {
        return { success: false, error: "Slot topilmadi" };
      }

      // Update booking with time slot info
      const { error: bookingError } = await supabase
        .from("promotion_bookings")
        .update({
          time_slot_id: slotId,
          scheduled_date: slot.slot_date,
          scheduled_time: slot.slot_time,
          status: "scheduled",
        })
        .eq("id", bookingId);

      if (bookingError) {
        // Rollback slot availability
        await supabase
          .from("time_slots")
          .update({ is_available: true })
          .eq("id", slotId);

        return { success: false, error: bookingError.message };
      }

      // Refresh slots
      await fetchTimeSlots();

      return { success: true };
    } catch (err) {
      return { success: false, error: "Xatolik yuz berdi" };
    }
  };

  const getSlotsByDate = (): Record<string, TimeSlot[]> => {
    const grouped: Record<string, TimeSlot[]> = {};

    timeSlots.forEach((slot) => {
      if (!grouped[slot.slot_date]) {
        grouped[slot.slot_date] = [];
      }
      grouped[slot.slot_date].push(slot);
    });

    return grouped;
  };

  return {
    timeSlots,
    isLoading,
    bookTimeSlot,
    getSlotsByDate,
    refreshSlots: fetchTimeSlots,
  };
};
