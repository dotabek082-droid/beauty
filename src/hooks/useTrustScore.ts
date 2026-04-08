import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTrustScore = () => {
  const { user, refreshProfile } = useAuth();

  const updateTrustScore = async (change: number): Promise<number | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc("update_trust_score", {
        p_user_id: user.id,
        p_change: change,
      });

      if (error) {
        console.error("Error updating trust score:", error);
        return null;
      }

      // Refresh profile to get updated trust score
      await refreshProfile();

      return data;
    } catch (err) {
      console.error("Error:", err);
      return null;
    }
  };

  const decreaseForMissingFeedback = async () => {
    return updateTrustScore(-10);
  };

  const increaseForFeedback = async () => {
    return updateTrustScore(5);
  };

  const decreaseForNoShow = async () => {
    return updateTrustScore(-20);
  };

  return {
    updateTrustScore,
    decreaseForMissingFeedback,
    increaseForFeedback,
    decreaseForNoShow,
  };
};
