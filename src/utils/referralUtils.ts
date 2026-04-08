import { addCoins, COIN_VALUES } from "./coinBalance";

// Referral Constants
const REFERRAL_COOKIE_NAME = "yaqin_referral_source";
const REFERRAL_COOKIE_DAYS = 30;
export const REFERRAL_REWARD_AMOUNT = 500;
export const REFEREE_WELCOME_BONUS = 200;

export interface ReferralData {
    referrerId: string;
    referredUserId?: string;
    status: 'pending' | 'completed';
    createdAt: string;
    completedAt?: string;
}

// Save referral source to storage (simulating cookie)
export const saveReferralCookie = (referrerId: string) => {
    // Basic validation: don't save if it calls itself or is empty
    if (!referrerId) return;

    // In a real app, we'd use actual cookies: document.cookie = ...
    // For this demo/SPA, localStorage with expiration is sufficient
    const data = {
        referrerId,
        expiry: new Date().getTime() + (REFERRAL_COOKIE_DAYS * 24 * 60 * 60 * 1000)
    };

    // Do not overwrite if one exists (first touch attribution)
    // Or do overwrite (last touch)? Let's go with Last Touch for simplicity in this demo,
    // or First Touch to protect original referrer. Let's do Last Touch as it's easier to test.
    localStorage.setItem(REFERRAL_COOKIE_NAME, JSON.stringify(data));
};

// Get the pending referrer ID
export const getPendingReferral = (): string | null => {
    const stored = localStorage.getItem(REFERRAL_COOKIE_NAME);
    if (!stored) return null;

    try {
        const data = JSON.parse(stored);
        if (new Date().getTime() > data.expiry) {
            localStorage.removeItem(REFERRAL_COOKIE_NAME);
            return null;
        }
        return data.referrerId;
    } catch (e) {
        return null;
    }
};

// Clear the referral source (after successful registration)
export const clearReferralSource = () => {
    localStorage.removeItem(REFERRAL_COOKIE_NAME);
};

// Link a new user to a referrer PERMANENTLY
export const confirmReferral = (newUserId: string, referrerId: string) => {
    // 1. Prevent self-referral
    if (newUserId === referrerId) return;

    // 2. Check if this user was already referred (prevent double attribution)
    const referralMap = JSON.parse(localStorage.getItem('user_referrals') || '{}');
    if (referralMap[newUserId]) return; // Already has a referrer

    // 3. Save the link
    referralMap[newUserId] = {
        referrerId,
        status: 'pending', // Pending until first booking
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('user_referrals', JSON.stringify(referralMap));

    // 4. Track for the referrer (to show in their history)
    const referrerHistory = JSON.parse(localStorage.getItem('referrer_history') || '{}');
    if (!referrerHistory[referrerId]) referrerHistory[referrerId] = [];

    referrerHistory[referrerId].push({
        referredUserId: newUserId,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('referrer_history', JSON.stringify(referrerHistory));

    // 5. Award "Welcome via Referral" bonus to the NEW USER immediately (optional)
    // We'll trust this function is called after successful signup
    addCoins(newUserId, REFEREE_WELCOME_BONUS, 'participation', 'Taklif orqali ro\'yxatdan o\'tish bonusi');
};

// Get the referrer of a specific user
export const getReferrer = (userId: string): string | null => {
    const referralMap = JSON.parse(localStorage.getItem('user_referrals') || '{}');
    return referralMap[userId]?.referrerId || null;
};

// Check if a referral reward should be processed (First Booking)
export const processReferralReward = (userId: string) => {
    const referralMap = JSON.parse(localStorage.getItem('user_referrals') || '{}');
    const referralData = referralMap[userId];

    if (!referralData) return; // No referrer for this user
    if (referralData.status === 'completed') return; // Already rewarded

    // Mark as completed
    referralData.status = 'completed';
    referralData.completedAt = new Date().toISOString();
    referralMap[userId] = referralData;
    localStorage.setItem('user_referrals', JSON.stringify(referralMap));

    // Award the Referrer
    const referrerId = referralData.referrerId;
    addCoins(referrerId, REFERRAL_REWARD_AMOUNT, 'referral', 'Do\'stingizni taklif qilganingiz uchun bonus!');

    // Update Referrer's history status
    const referrerHistory = JSON.parse(localStorage.getItem('referrer_history') || '{}');
    if (referrerHistory[referrerId]) {
        const entry = referrerHistory[referrerId].find((r: any) => r.referredUserId === userId);
        if (entry) {
            entry.status = 'completed';
            entry.completedAt = new Date().toISOString();
            localStorage.setItem('referrer_history', JSON.stringify(referrerHistory));
        }
    }
};

// Helper: Get My Referral History
export const getMyReferralHistory = (myUserId: string) => {
    const referrerHistory = JSON.parse(localStorage.getItem('referrer_history') || '{}');
    return referrerHistory[myUserId] || [];
};

// Helper: Check if it's the user's first booking
// We can check if they have any previous *completed* bookings, or just simplistic check
export const isFirstBooking = (userId: string): boolean => {
    const bookings = JSON.parse(localStorage.getItem('user_bookings') || '{}');
    const userBookings = bookings[userId] || [];
    // If length is 0 (before this current booking is pushed), it's first.
    // Or if we call this AFTER pushing, length is 1.
    // Let's assume we call this BEFORE pushing the new booking to storage.
    return userBookings.length === 0;
};
