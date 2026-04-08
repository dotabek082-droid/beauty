import { PromotionEntry, PromotionWinner, UserRestriction, Notification, WinnerAppointment, PromotionReview } from "@/types/lottery";

// Mock Lottery Entries
export const mockLotteryEntries: PromotionEntry[] = [
    {
        id: "entry-1",
        userId: "user-1",
        userName: "Aziz Karimov",
        userPhone: "+998901234567",
        promotionId: "promo-4",
        enteredAt: new Date("2025-01-16T10:30:00"),
        status: "pending",
    },
    {
        id: "entry-2",
        userId: "user-2",
        userName: "Malika Toshmatova",
        userPhone: "+998901234568",
        promotionId: "promo-4",
        enteredAt: new Date("2025-01-16T11:15:00"),
        status: "pending",
    },
    {
        id: "entry-3",
        userId: "user-3",
        userName: "Sardor Alimov",
        userPhone: "+998901234569",
        promotionId: "promo-4",
        enteredAt: new Date("2025-01-16T14:20:00"),
        status: "pending",
    },
];

// Mock Winners (will be populated after admin selects winners)
export const mockWinners: PromotionWinner[] = [];

// Mock User Restrictions (blocked users)
export const mockUserRestrictions: UserRestriction[] = [];

// Mock Notifications
export const mockNotifications: Notification[] = [];

// Mock Winner Appointments
export const mockWinnerAppointments: WinnerAppointment[] = [];

// Mock Reviews
export const mockPromotionReviews: PromotionReview[] = [];

// Helper Functions

// Generate unique promotion code
export function generatePromotionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'PROMO-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Generate unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Check if user is blocked
export function isUserBlocked(userId: string): boolean {
    return mockUserRestrictions.some(
        (restriction) => restriction.userId === userId && restriction.isActive
    );
}

// Check if user already entered a promotion
export function hasUserEntered(userId: string, promotionId: string): boolean {
    return mockLotteryEntries.some(
        (entry) => entry.userId === userId && entry.promotionId === promotionId
    );
}

// Add lottery entry
export function addLotteryEntry(entry: PromotionEntry): void {
    mockLotteryEntries.push(entry);

    // Persist to localStorage for My Registrations page
    try {
        const allRegistrations = JSON.parse(localStorage.getItem('user_promotion_registrations') || '{}');
        const userRegistrations = allRegistrations[entry.userId] || [];

        if (!userRegistrations.includes(entry.promotionId)) {
            userRegistrations.push(entry.promotionId);
            allRegistrations[entry.userId] = userRegistrations;
            localStorage.setItem('user_promotion_registrations', JSON.stringify(allRegistrations));
            console.log(`Saved registration locally: ${entry.userId} -> ${entry.promotionId}`);
        }
    } catch (e) {
        console.error("Failed to save registration locally", e);
    }
}

// Get entries for a promotion
export function getEntriesForPromotion(promotionId: string): PromotionEntry[] {
    return mockLotteryEntries.filter((entry) => entry.promotionId === promotionId);
}

// Select random winners
export function selectRandomWinners(
    promotionId: string,
    totalWinners: number
): PromotionWinner[] {
    const entries = getEntriesForPromotion(promotionId);

    // Filter out blocked users
    const eligibleEntries = entries.filter(
        (entry) => !isUserBlocked(entry.userId)
    );

    // Shuffle array (Fisher-Yates algorithm)
    const shuffled = [...eligibleEntries];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select first N entries
    const selectedEntries = shuffled.slice(0, Math.min(totalWinners, shuffled.length));

    // Create winner objects with unique codes
    const winners: PromotionWinner[] = selectedEntries.map((entry) => {
        const promotion = mockPromotions.find((p) => p.id === promotionId);
        return {
            id: generateId(),
            entryId: entry.id,
            userId: entry.userId,
            userName: entry.userName,
            userPhone: entry.userPhone,
            promotionId: entry.promotionId,
            salonId: promotion?.salonId || "",
            promotionCode: generatePromotionCode(),
            selectedAt: new Date(),
            notifiedAt: null,
            codeRedeemedAt: null,
            appointmentDate: null,
            appointmentTime: null,
            status: "selected",
        };
    });

    // Update entry statuses
    selectedEntries.forEach((entry) => {
        entry.status = "winner";
    });

    // Mark non-winners as losers
    eligibleEntries
        .filter((entry) => !selectedEntries.includes(entry))
        .forEach((entry) => {
            entry.status = "loser";
        });

    // Add winners to mock data
    mockWinners.push(...winners);

    return winners;
}

// Validate promotion code
export function validatePromotionCode(code: string): {
    valid: boolean;
    winner?: PromotionWinner;
    error?: string;
} {
    const winner = mockWinners.find((w) => w.promotionCode === code);

    if (!winner) {
        return { valid: false, error: "Kod topilmadi" };
    }

    if (winner.codeRedeemedAt) {
        return { valid: false, error: "Kod allaqachon ishlatilgan" };
    }

    // Check if code is expired (7 days from selection)
    const expiryDate = new Date(winner.selectedAt);
    expiryDate.setDate(expiryDate.getDate() + 7);

    if (new Date() > expiryDate) {
        return { valid: false, error: "Kod muddati tugagan" };
    }

    return { valid: true, winner };
}

import { mockPromotions } from "./promotionData";
