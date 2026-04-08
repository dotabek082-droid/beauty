import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BlockedSlot {
    id: string;
    business_owner_id: string;
    salon_id: string | null;
    blocked_date: string;
    blocked_time: string;
    reason: string | null;
    created_at: string;
}

export const useBlockedSlots = () => {
    const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [useLocalStorage, setUseLocalStorage] = useState(false);
    const { toast } = useToast();

    const STORAGE_KEY = 'blocked_time_slots';

    const fetchBlockedSlots = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("blocked_time_slots")
                .select("*")
                .order("blocked_date", { ascending: true });

            if (error) {
                // Table doesn't exist, use localStorage
                console.warn("Using localStorage for blocked slots (database table not found)");
                setUseLocalStorage(true);
                const stored = localStorage.getItem(STORAGE_KEY);
                setBlockedSlots(stored ? JSON.parse(stored) : []);
                return;
            }

            setBlockedSlots(data || []);
            setUseLocalStorage(false);
        } catch (error) {
            console.error("Error:", error);
            setUseLocalStorage(true);
            const stored = localStorage.getItem(STORAGE_KEY);
            setBlockedSlots(stored ? JSON.parse(stored) : []);
        } finally {
            setLoading(false);
        }
    };

    const blockTimeSlot = async (date: string, time: string, reason?: string) => {
        try {
            console.log('blockTimeSlot called:', { date, time, reason });

            if (useLocalStorage) {
                // Use localStorage
                const newBlock: BlockedSlot = {
                    id: `local-${Date.now()}`,
                    business_owner_id: 'local',
                    salon_id: 'local',
                    blocked_date: date,
                    blocked_time: time,
                    reason: reason || null,
                    created_at: new Date().toISOString(),
                };

                const updated = [...blockedSlots, newBlock];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                setBlockedSlots(updated);

                toast({
                    title: "Muvaffaqiyatli ✅",
                    description: "Vaqt bloklandi (vaqtinchalik)",
                });
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error('No authenticated user');
                throw new Error("Not authenticated");
            }

            console.log('Inserting block for user:', user.id);

            const { data, error } = await supabase
                .from("blocked_time_slots")
                .insert({
                    business_owner_id: user.id,
                    salon_id: user.id,
                    blocked_date: date,
                    blocked_time: time,
                    reason: reason || null,
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

            await fetchBlockedSlots();
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
            console.log('Unblocking slot:', blockingId);

            if (useLocalStorage) {
                // Use localStorage
                const updated = blockedSlots.filter(slot => slot.id !== blockingId);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                setBlockedSlots(updated);

                toast({
                    title: "Muvaffaqiyatli",
                    description: "Blok olib tashlandi",
                });
                return;
            }

            const { error } = await supabase
                .from("blocked_time_slots")
                .delete()
                .eq("id", blockingId);

            if (error) {
                console.error('Error unblocking:', error);
                throw error;
            }

            toast({
                title: "Muvaffaqiyatli",
                description: "Blok olib tashlandi",
            });

            await fetchBlockedSlots();
        } catch (error) {
            console.error("Error unblocking time slot:", error);
            toast({
                title: "Xatolik",
                description: "Blokni olib tashlashda xatolik",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchBlockedSlots();

        // Set up real-time subscription (only if not using localStorage)
        if (!useLocalStorage) {
            const channel = supabase
                .channel("blocked-slots")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "blocked_time_slots",
                    },
                    (payload) => {
                        console.log("Real-time blocked slot update:", payload);
                        fetchBlockedSlots();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [useLocalStorage]);

    return {
        blockedSlots,
        loading,
        blockTimeSlot,
        unblockTimeSlot,
        refetch: fetchBlockedSlots,
    };
};
