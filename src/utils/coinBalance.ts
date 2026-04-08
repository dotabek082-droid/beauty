// Coin earning constants
export const COIN_VALUES = {
    DAILY_LOGIN: 1,
    BOOKING: 2,
    PROMOTION_PARTICIPATION: 2,
    PROMOTION_WIN: 5,
    PAYMENT: 1,
    CANCELLATION_PENALTY: 5
};

export type CoinTransactionType =
    | 'daily_login'
    | 'booking'
    | 'participation'
    | 'win'
    | 'payment'
    | 'spend'
    | 'referral'
    | 'penalty';

export interface EnrichedCoinTransaction extends CoinTransaction {
    userId: string;
    userName?: string;
    userType?: 'client' | 'business';
}

export interface CoinTransaction {
    id: string;
    type: CoinTransactionType;
    amount: number;
    description: string;
    created_at: string;
}

export interface UserBalance {
    coins: number;
    currency: string;
    last_login_date: string;
    total_earned: number;
    total_spent: number;
}

// Initialize user coin balance
export const initializeCoinBalance = (userId: string) => {
    const balances = JSON.parse(localStorage.getItem('user_balances') || '{}');

    if (!balances[userId]) {
        balances[userId] = {
            coins: 1000,
            currency: 'UZS',
            last_login_date: new Date().toISOString().split('T')[0],
            total_earned: 1000,
            total_spent: 0
        };
        localStorage.setItem('user_balances', JSON.stringify(balances));
        console.log(`✅ Initialized ${userId} with 1,000 coins`);

        // Record transaction
        addCoinTransaction(userId, 'daily_login', 1000, 'Boshlang\'ich bonus');
    }
};

// Check and award daily login coin
export const checkDailyLogin = (userId: string): boolean => {
    const balances = JSON.parse(localStorage.getItem('user_balances') || '{}');
    const today = new Date().toISOString().split('T')[0];

    if (!balances[userId]) {
        initializeCoinBalance(userId);
        return true;
    }

    const lastLogin = balances[userId].last_login_date;

    if (lastLogin !== today) {
        // New day! Award coin
        balances[userId].last_login_date = today;
        balances[userId].coins += COIN_VALUES.DAILY_LOGIN;
        balances[userId].total_earned += COIN_VALUES.DAILY_LOGIN;

        localStorage.setItem('user_balances', JSON.stringify(balances));

        addCoinTransaction(userId, 'daily_login', COIN_VALUES.DAILY_LOGIN, 'Kunlik kirish mukofoti');

        console.log(`🪙 Daily login bonus: +${COIN_VALUES.DAILY_LOGIN} coin`);
        return true;
    }

    return false;
};

// Add coin transaction to history
export const addCoinTransaction = (
    userId: string,
    type: CoinTransactionType,
    amount: number,
    description: string
) => {
    const transactions = JSON.parse(localStorage.getItem('coin_transactions') || '{}');

    if (!transactions[userId]) {
        transactions[userId] = [];
    }

    const transaction: CoinTransaction = {
        id: crypto.randomUUID(),
        type,
        amount,
        description,
        created_at: new Date().toISOString()
    };

    transactions[userId].unshift(transaction); // Add to beginning

    // Keep only last 100 transactions
    if (transactions[userId].length > 100) {
        transactions[userId] = transactions[userId].slice(0, 100);
    }

    localStorage.setItem('coin_transactions', JSON.stringify(transactions));
};

// Add coins to user balance
export const addCoins = (userId: string, amount: number, type: CoinTransactionType, description: string) => {
    const balances = JSON.parse(localStorage.getItem('user_balances') || '{}');

    if (!balances[userId]) {
        initializeCoinBalance(userId);
    }

    balances[userId].coins += amount;
    balances[userId].total_earned += amount;
    localStorage.setItem('user_balances', JSON.stringify(balances));

    // Record transaction
    addCoinTransaction(userId, type, amount, description);

    return balances[userId].coins;
};

// Deduct coins from user balance
export const deductCoins = (userId: string, amount: number, description: string): boolean => {
    const balances = JSON.parse(localStorage.getItem('user_balances') || '{}');

    if (!balances[userId] || balances[userId].coins < amount) {
        return false; // Insufficient balance
    }

    balances[userId].coins -= amount;
    balances[userId].total_spent += amount;
    localStorage.setItem('user_balances', JSON.stringify(balances));

    // Record transaction (negative amount)
    addCoinTransaction(userId, 'spend', -amount, description);

    return true;
};

// Get user balance
export const getCoinBalance = (userId: string): number => {
    const balances = JSON.parse(localStorage.getItem('user_balances') || '{}');
    return balances[userId]?.coins || 0;
};

// Get user full balance data
export const getUserBalance = (userId: string): UserBalance | null => {
    const balances = JSON.parse(localStorage.getItem('user_balances') || '{}');
    return balances[userId] || null;
};

// Get coin transactions
export const getCoinTransactions = (userId: string, limit: number = 50): CoinTransaction[] => {
    const transactions = JSON.parse(localStorage.getItem('coin_transactions') || '{}');
    const userTransactions = transactions[userId] || [];
    return userTransactions.slice(0, limit);
};

// Get transactions summary
export const getTransactionsSummary = (userId: string) => {
    const transactions = getCoinTransactions(userId, 1000); // Get all
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayEarnings = transactions
        .filter(t => t.created_at.startsWith(today) && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const weekEarnings = transactions
        .filter(t => new Date(t.created_at) >= weekAgo && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = getUserBalance(userId);

    return {
        today: todayEarnings,
        week: weekEarnings,
        total: balance?.total_earned || 0,
        spent: balance?.total_spent || 0,
        current: balance?.coins || 0
    };
};

// Get ALL transactions (Admin)
export const getAllTransactions = (): EnrichedCoinTransaction[] => {
    const transactionsMap = JSON.parse(localStorage.getItem('coin_transactions') || '{}');
    let allTransactions: EnrichedCoinTransaction[] = [];

    Object.keys(transactionsMap).forEach(userId => {
        const userTrans = transactionsMap[userId] as CoinTransaction[];
        if (Array.isArray(userTrans)) {
            const enriched = userTrans.map(t => ({
                ...t,
                userId,
            }));
            allTransactions = [...allTransactions, ...enriched];
        }
    });

    return allTransactions.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
};

// Seed business transactions if they don't exist
import { mockBusinesses } from "@/data/businessData";

export const seedBusinessTransactions = () => {
    const transactions = JSON.parse(localStorage.getItem('coin_transactions') || '{}');
    let hasChanges = false;

    mockBusinesses.forEach(business => {
        const userId = business.ownerId;

        // Only seed if no transactions exist for this business owner
        if (!transactions[userId] || transactions[userId].length === 0) {
            console.log(`Seeding transactions for ${userId}...`);
            initializeCoinBalance(userId);

            // Add some fake transactions
            // 1. Initial Deposit
            addCoins(userId, 5000, 'payment', 'Tangalar xaridi');

            // 2. Promotion Creation (Expense)
            deductCoins(userId, 500, 'Aksiya yaratish: "Bahar chegirmsi"');

            // 3. Subscription (Expense)
            deductCoins(userId, 1000, 'Premium obuna (1 oy)');

            // 4. Booking Reward (Income)
            addCoins(userId, 10, 'booking', 'Muvaffaqiyatli buyurtma uchun bonus');

            hasChanges = true;
        }
    });

    return hasChanges;
};
