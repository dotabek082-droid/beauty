// Lottery Entry Model
export interface PromotionEntry {
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
    promotionId: string;
    enteredAt: Date;
    status: 'pending' | 'winner' | 'loser' | 'approved' | 'booking_pending';
}

// Winner Model with Unique Promotion Code
export interface PromotionWinner {
    id: string;
    entryId: string;
    userId: string;
    userName: string;
    userPhone: string;
    promotionId: string;
    salonId: string;
    promotionCode: string; // Unique code like "PROMO-ABC123"
    selectedAt: Date;
    notifiedAt: Date | null;
    codeRedeemedAt: Date | null;
    appointmentDate: Date | null;
    appointmentTime: string | null;
    status: 'selected' | 'notified' | 'booked' | 'completed' | 'expired';
    qrCode?: string; // QR code for service owner to scan
}

// Review Answer for each question
export interface ReviewAnswer {
    questionId: string;
    questionText: string;
    rating: number; // 1-5 stars
}

// Review Submission Model
export interface PromotionReview {
    id: string;
    winnerId: string;
    userId: string;
    promotionId: string;
    salonId: string;
    answers: ReviewAnswer[]; // 10 questions
    photos: string[]; // Photo URLs
    overallRating: number; // 1-5 stars
    submittedAt: Date;
    deadline: Date;
    status: 'pending' | 'submitted' | 'overdue';
}

// User Restriction/Blocking Model
export interface UserRestriction {
    id: string;
    userId: string;
    reason: 'review_not_submitted' | 'no_show' | 'admin_block';
    blockedAt: Date;
    expiresAt: Date | null; // null = permanent until review submitted
    relatedWinnerId: string | null;
    isActive: boolean;
}

// Notification Model
export interface Notification {
    id: string;
    userId: string;
    type: 'winner' | 'loser' | 'appointment_reminder' | 'review_reminder' | 'blocked' | 'service_owner_appointment';
    title: string;
    message: string;
    data: any; // Additional data (code, appointment details, etc.)
    read: boolean;
    createdAt: Date;
}

// Appointment Model for Winners
export interface WinnerAppointment {
    id: string;
    winnerId: string;
    userId: string;
    userName: string;
    salonId: string;
    salonName: string;
    serviceName: string;
    promotionCode: string;
    date: Date;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    reviewSubmitted: boolean;
    createdAt: Date;
}
