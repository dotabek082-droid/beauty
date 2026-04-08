export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      feedback_answers: {
        Row: {
          answer_rating: number
          created_at: string
          feedback_id: string
          id: string
          question_id: string
        }
        Insert: {
          answer_rating: number
          created_at?: string
          feedback_id: string
          id?: string
          question_id: string
        }
        Update: {
          answer_rating?: number
          created_at?: string
          feedback_id?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_answers_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "feedback_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_photos: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          photo_url: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          photo_url: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_photos_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_questions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          question_order: number
          question_ru: string
          question_uz: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          question_order: number
          question_ru: string
          question_uz: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          question_order?: number
          question_ru?: string
          question_uz?: string
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          additional_comments: string | null
          booking_id: string
          created_at: string
          id: string
          overall_rating: number
          user_id: string
        }
        Insert: {
          additional_comments?: string | null
          booking_id: string
          created_at?: string
          id?: string
          overall_rating: number
          user_id: string
        }
        Update: {
          additional_comments?: string | null
          booking_id?: string
          created_at?: string
          id?: string
          overall_rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "promotion_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          discount_amount: number | null
          final_amount: number
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_status: string
          promo_code: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          discount_amount?: number | null
          final_amount: number
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          promo_code?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          discount_amount?: number | null
          final_amount?: number
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          promo_code?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "promotion_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_verified: boolean
          phone: string | null
          salon_id: string | null
          total_feedbacks: number
          total_wins: number
          trust_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean
          phone?: string | null
          salon_id?: string | null
          total_feedbacks?: number
          total_wins?: number
          trust_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean
          phone?: string | null
          salon_id?: string | null
          total_feedbacks?: number
          total_wins?: number
          trust_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          discount_percentage: number
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          discount_percentage: number
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          discount_percentage?: number
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      promotion_bookings: {
        Row: {
          booked_at: string
          completed_at: string | null
          created_at: string
          id: string
          is_winner: boolean
          promotion_id: string
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          time_slot_id: string | null
          user_id: string
          winner_selected_at: string | null
        }
        Insert: {
          booked_at?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_winner?: boolean
          promotion_id: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          time_slot_id?: string | null
          user_id: string
          winner_selected_at?: string | null
        }
        Update: {
          booked_at?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_winner?: boolean
          promotion_id?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          time_slot_id?: string | null
          user_id?: string
          winner_selected_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_bookings_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean
          original_price: number
          salon_id: string
          salon_name: string
          service_description: string | null
          service_name: string
          slots_available: number
          slots_used: number
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          original_price: number
          salon_id: string
          salon_name: string
          service_description?: string | null
          service_name: string
          slots_available?: number
          slots_used?: number
          starts_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          original_price?: number
          salon_id?: string
          salon_name?: string
          service_description?: string | null
          service_name?: string
          slots_available?: number
          slots_used?: number
          starts_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          id: string
          is_available: boolean
          promotion_id: string
          salon_id: string
          slot_date: string
          slot_time: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean
          promotion_id: string
          salon_id: string
          slot_date: string
          slot_time: string
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean
          promotion_id?: string
          salon_id?: string
          slot_date?: string
          slot_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_trust_score: {
        Args: { p_change: number; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "business_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "business_owner"],
    },
  },
} as const
