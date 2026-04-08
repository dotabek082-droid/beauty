export const BUSINESS_TABS = {
    HOME: 'home',
    SEARCH: 'search',
    SERVICES: 'services',
    PROMOTIONS: 'promotions',
    BOOKINGS: 'bookings',
    INBOX: 'inbox',
    WALLET: 'wallet',
    SETTINGS: 'settings',
    PAYMENTS: 'payments',
    TRUST: 'trust',
    REVIEWS: 'reviews',
    PROFILE: 'profile'
} as const;

export type BusinessTabType = typeof BUSINESS_TABS[keyof typeof BUSINESS_TABS];
