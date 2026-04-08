
export type BusinessSubscriptionTier = 'free' | 'pro' | 'elite';
export type ClientSubscriptionTier = 'standard' | 'gold' | 'platinum';

export interface BusinessPlan {
    id: BusinessSubscriptionTier;
    name: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly';
    features: string[];
    limits: {
        activePromotions: number;
        staffMembers: number;
        locations: number;
    };
    recommended?: boolean;
}

export interface ClientPlan {
    id: ClientSubscriptionTier;
    name: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly';
    features: string[];
    rewards: {
        monthlyCoins: number;
        bookingDiscount?: number;
    };
    recommended?: boolean;
}

export const BUSINESS_PLANS: BusinessPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'UZS',
        period: 'monthly',
        features: [
            "3 ta faol aksiya",
            "Cheklangan statistika",
            "1 ta filial/lokatsiya",
            "Standart profil ko'rinishi"
        ],
        limits: {
            activePromotions: 3,
            staffMembers: 1,
            locations: 1
        }
    },
    {
        id: 'pro',
        name: 'Pro Business',
        price: 150000,
        currency: 'UZS',
        period: 'monthly',
        features: [
            "10 ta faol aksiya",
            "Kengaytirilgan statistika (30 kun)",
            "3 ta filialgacha",
            "Barcha xodimlarni boshqarish",
            "SMS xabarnomalar (cheklangan)"
        ],
        limits: {
            activePromotions: 10,
            staffMembers: 5,
            locations: 3
        },
        recommended: true
    },
    {
        id: 'elite',
        name: 'Elite Salon',
        price: 400000,
        currency: 'UZS',
        period: 'monthly',
        features: [
            "30 ta faol aksiya",
            "Cheksiz statistika va tahlillar",
            "Cheksiz filiallar",
            "Verified (Tasdiqlangan) beji",
            "Premium yordam (24/7)",
            "Top ro'yxatlarda ko'tarish",
            "Mijozlar bazasi (CRM)"
        ],
        limits: {
            activePromotions: 30,
            staffMembers: 999,
            locations: 999
        }
    }
];

export const CLIENT_PLANS: ClientPlan[] = [
    {
        id: 'standard',
        name: 'Standard',
        price: 0,
        currency: 'UZS',
        period: 'monthly',
        features: [
            "Bepul e'lonlarni ko'rish",
            "Oson band qilish",
            "Sharhlar qoldirish"
        ],
        rewards: {
            monthlyCoins: 0
        }
    },
    {
        id: 'gold',
        name: 'Gold Client',
        price: 50000,
        currency: 'UZS',
        period: 'monthly',
        features: [
            "Reklamasiz interfeys",
            "Oyiga 1000 tanga bepul",
            "5% Keshbek (tangalarda)",
            "Aksiyalarga 1 soat oldin kirish"
        ],
        rewards: {
            monthlyCoins: 1000,
            bookingDiscount: 5
        },
        recommended: true
    },
    {
        id: 'platinum',
        name: 'Platinum VIP',
        price: 120000,
        currency: 'UZS',
        period: 'monthly',
        features: [
            "Barcha Gold imkoniyatlari",
            "Oyiga 3000 tanga bepul",
            "10% Keshbek (tangalarda)",
            "Maxsus VIP belgisi",
            "Premium xizmat ko'rsatish"
        ],
        rewards: {
            monthlyCoins: 3000,
            bookingDiscount: 10
        }
    }
];
