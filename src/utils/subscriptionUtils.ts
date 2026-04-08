
import { BUSINESS_PLANS, CLIENT_PLANS, BusinessSubscriptionTier, ClientSubscriptionTier } from '@/data/subscriptionOptions';
import { Business } from '@/types/business';
import { differenceInDays, addMonths, parseISO, isAfter } from 'date-fns';

// --- Business Subscription Utilities ---

export const getBusinessSubscriptionStatus = (business: Business) => {
    if (!business.subscription) {
        return { tier: 'free' as BusinessSubscriptionTier, isValid: true, daysLeft: 0 };
    }

    const { tier, expiryDate } = business.subscription;

    if (!expiryDate) return { tier, isValid: true, daysLeft: 999 }; // Lifetime or undefined

    const now = new Date();
    const expiry = parseISO(expiryDate);
    const isValid = isAfter(expiry, now);
    const daysLeft = differenceInDays(expiry, now);

    return { tier, isValid, daysLeft };
};

export const checkBusinessLimit = (business: Business, limitType: 'activePromotions' | 'staffMembers' | 'locations', currentCount: number): boolean => {
    const { tier, isValid } = getBusinessSubscriptionStatus(business);

    // Fallback to 'free' if expired
    const activeTier = isValid ? tier : 'free';

    const plan = BUSINESS_PLANS.find(p => p.id === activeTier);
    if (!plan) return false;

    return currentCount < plan.limits[limitType];
};

export const getNextBillingDate = (dateString: string | null): string => {
    if (!dateString) return new Date().toISOString();
    return dateString; // For now just return the date
};

export const upgradeBusinessSubscription = (businessId: string, tier: BusinessSubscriptionTier, durationMonths: number = 1) => {
    // In a real app, this would be an API call
    // For now, we return the object to be verified/used by the caller or mock a backend update
    const expiryDate = addMonths(new Date(), durationMonths).toISOString();

    // Simulate updating local storage or state
    // Note: The actual state update happens in the component or context, 
    // but we can store it in localStorage to persist across reloads if needed for demo
    const subscription = { tier, expiryDate };
    localStorage.setItem(`business_sub_${businessId}`, JSON.stringify(subscription));

    return subscription;
};


// --- Client Subscription Utilities ---
// (Assuming we extend the user object later, for now we simulate with localStorage)

export const getClientSubscription = (userId: string) => {
    const stored = localStorage.getItem(`client_sub_${userId}`);
    if (stored) {
        return JSON.parse(stored) as { tier: ClientSubscriptionTier, expiryDate: string };
    }
    return { tier: 'standard' as ClientSubscriptionTier, expiryDate: null };
};

export const upgradeClientSubscription = (userId: string, tier: ClientSubscriptionTier, durationMonths: number = 1) => {
    const expiryDate = addMonths(new Date(), durationMonths).toISOString();
    const subscription = { tier, expiryDate };
    localStorage.setItem(`client_sub_${userId}`, JSON.stringify(subscription));
    return subscription;
};
