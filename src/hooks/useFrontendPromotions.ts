import { useState, useEffect } from 'react';
import { CreatePromotionData, Promotion } from '@/types/promotion';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'frontend_promotions_v7';

const generateSeedData = (businessId: string) => {
    return [
        // 1. LOTTERY - Active
        {
            id: 'promo-lottery-1',
            business_id: businessId,
            service_name: 'iPhone 15 Pro Max Yutib Oling!',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 15000000,
            start_date: '2026-01-15',
            end_date: '2026-03-01',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'lottery' as const,
            approval_status: 'active' as const,
            winner_count: 1,
            entry_price: 500,
            ticket_price: 500,
            requires_booking: true,
            terms_and_conditions: 'O\'zbekiston bo\'ylab eng katta yutuqli o\'yin!',
            image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop"
        },
        // 2. LOTTERY - Pending Approval
        {
            id: 'promo-lottery-2',
            business_id: businessId,
            service_name: 'Samsung Galaxy S24 Ultra',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 12000000,
            start_date: '2026-02-15',
            end_date: '2026-04-01',
            status: 'pending',
            created_at: new Date().toISOString(),
            promotion_type: 'lottery' as const,
            approval_status: 'pending_approval' as const,
            winner_count: 2,
            entry_price: 300,
            ticket_price: 300,
            requires_booking: true,
            terms_and_conditions: 'Bahorgi aksiya - 2 ta yutug\'chi tanlanadi!',
            image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop"
        },
        // 3. BUY ONE GET ONE - Active
        {
            id: 'promo-bogo-1',
            business_id: businessId,
            service_name: '1+1: Ota va O\'g\'il Soch Olish',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 100000,
            start_date: '2026-02-10',
            end_date: '2026-03-10',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'buy_one_get_one' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            min_purchase_quantity: 1,
            free_quantity: 1,
            max_customers: 20,
            terms_and_conditions: 'Ota va o\'g\'il birga kelsa, ikkinchisi bepul!',
            image_url: "https://images.unsplash.com/photo-1503951914875-452162b7f30d?w=400&h=300&fit=crop"
        },
        // 4. BUY ONE GET ONE - Rejected
        {
            id: 'promo-bogo-2',
            business_id: businessId,
            service_name: '2+1: Manikyur Aksiyasi',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 150000,
            start_date: '2026-02-01',
            end_date: '2026-02-28',
            status: 'rejected',
            created_at: new Date().toISOString(),
            promotion_type: 'buy_one_get_one' as const,
            approval_status: 'rejected' as const,
            requires_booking: true,
            min_purchase_quantity: 2,
            free_quantity: 1,
            terms_and_conditions: '3 ta uchun 2 tasining puli',
            image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
        },
        // 5. DISCOUNT - Active (Percentage)
        {
            id: 'promo-discount-1',
            business_id: businessId,
            service_name: 'Soch Bo\'yash -30%',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 450000,
            start_date: '2026-01-27',
            end_date: '2026-02-28',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'discount' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            discount_type: 'percentage',
            discount_value: 30,
            terms_and_conditions: 'L\'Oreal bo\'yoqlari bilan 30% chegirma!',
            image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop"
        },
        // 6. DISCOUNT - Active (Fixed Amount)
        {
            id: 'promo-discount-2',
            business_id: businessId,
            service_name: 'Massaj -50,000 so\'m',
            service_category: 'spa',
            salon_name: 'Mening biznesim',
            original_price: 250000,
            start_date: '2026-02-01',
            end_date: '2026-03-01',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'discount' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            discount_type: 'fixed',
            discount_value: 50000,
            terms_and_conditions: 'Tanlov: klassik massaj 50,000 so\'m arzon!',
            image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
        },
        // 7. FREE SERVICE - Active
        {
            id: 'promo-free-1',
            business_id: businessId,
            service_name: 'Manikyur + Gel Lak (BEPUL)',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 120000,
            start_date: '2026-02-12',
            end_date: '2026-02-20',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'free_service' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            terms_and_conditions: 'Yangi usta uchun model kerak. Xizmat mutlaqo bepul!',
            image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
        },
        // 8. FREE SERVICE - Expired
        {
            id: 'promo-free-2',
            business_id: businessId,
            service_name: 'Yuz Tozalash (Bepul)',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 180000,
            start_date: '2026-01-10',
            end_date: '2026-01-20',
            status: 'expired',
            created_at: new Date().toISOString(),
            promotion_type: 'free_service' as const,
            approval_status: 'expired' as const,
            requires_booking: true,
            terms_and_conditions: 'Yangi kosmetolog trening uchun',
            image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"
        },
        // 9. LOYALTY CARD - Active
        {
            id: 'promo-loyalty-1',
            business_id: businessId,
            service_name: 'Soch Olish Sadoqat Kartasi',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 50000,
            start_date: '2026-02-01',
            end_date: '2026-12-31',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'loyalty_card' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            required_visits: 10,
            max_redemptions: 50,
            current_redemptions: 0,
            terms_and_conditions: '10 ta tashrif - 1 ta bepul soch olish!',
            image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
        },
        // 10. LOYALTY CARD - Pending
        {
            id: 'promo-loyalty-2',
            business_id: businessId,
            service_name: 'Manikyur Sadoqat Kartasi',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 80000,
            start_date: '2026-02-15',
            end_date: '2026-12-31',
            status: 'pending',
            created_at: new Date().toISOString(),
            promotion_type: 'loyalty_card' as const,
            approval_status: 'pending_approval' as const,
            requires_booking: true,
            required_visits: 5,
            max_redemptions: 30,
            current_redemptions: 0,
            terms_and_conditions: '5 ta manikyur - 6-chisi bepul!',
            image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
        },
        // 11. SERVICE BUNDLE - Active
        {
            id: 'promo-bundle-1',
            business_id: businessId,
            service_name: 'Erkaklar Grooming Paketi',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 250000, // Combined price of all services
            start_date: '2026-02-10',
            end_date: '2026-03-31',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'service_bundle' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            bundle_price: 180000,
            bundle_service_ids: ['service-1', 'service-2', 'service-3'],
            terms_and_conditions: 'Soch olish + Soqol + Yuz parvarishi paket narxda!',
            image_url: "https://images.unsplash.com/photo-1503951914875-452162b7f30d?w=400&h=300&fit=crop"
        },
        // 12. SERVICE BUNDLE - Active (Different)
        {
            id: 'promo-bundle-2',
            business_id: businessId,
            service_name: 'Ayollar SPA Paketi',
            service_category: 'spa',
            salon_name: 'Mening biznesim',
            original_price: 850000,
            start_date: '2026-02-05',
            end_date: '2026-04-30',
            status: 'active',
            created_at: new Date().toISOString(),
            promotion_type: 'service_bundle' as const,
            approval_status: 'active' as const,
            requires_booking: true,
            bundle_price: 650000,
            bundle_service_ids: ['service-4', 'service-5', 'service-6', 'service-7'],
            terms_and_conditions: 'Massaj + Hamm + Yuz parvarishi + Manikyur = 200,000 so\'m tejash!',
            image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop"
        },
        // 13. LOTTERY - Rejected
        {
            id: 'promo-lottery-3',
            business_id: businessId,
            service_name: 'MacBook Pro Yutuq',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 18000000,
            start_date: '2026-02-01',
            end_date: '2026-03-15',
            status: 'rejected',
            created_at: new Date().toISOString(),
            promotion_type: 'lottery' as const,
            approval_status: 'rejected' as const,
            rejection_reason: 'Yutuq qiymati juda yuqori. Iltimos, past qiymatli yutuq tanlang.',
            winner_count: 1,
            entry_price: 800,
            ticket_price: 800,
            requires_booking: true,
            terms_and_conditions: 'Mega aksiya!',
            image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"
        },
        // 14. DISCOUNT - Rejected
        {
            id: 'promo-discount-3',
            business_id: businessId,
            service_name: 'Barcha xizmatlar -50%',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 500000,
            start_date: '2026-02-05',
            end_date: '2026-02-28',
            status: 'rejected',
            created_at: new Date().toISOString(),
            promotion_type: 'discount' as const,
            approval_status: 'rejected' as const,
            rejection_reason: 'Chegirma foizi juda katta. Maksimal 40% bo\'lishi mumkin.',
            requires_booking: true,
            discount_type: 'percentage',
            discount_value: 50,
            terms_and_conditions: 'Barcha xizmatlar yarim narxda!',
            image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        },
        // 15. FREE SERVICE - Rejected
        {
            id: 'promo-free-3',
            business_id: businessId,
            service_name: 'Premium Massage (Bepul)',
            service_category: 'spa',
            salon_name: 'Mening biznesim',
            original_price: 350000,
            start_date: '2026-02-08',
            end_date: '2026-02-25',
            status: 'rejected',
            created_at: new Date().toISOString(),
            promotion_type: 'free_service' as const,
            approval_status: 'rejected' as const,
            rejection_reason: 'Bepul xizmat narxi juda yuqori. Maksimal 150,000 so\'m bo\'lishi kerak.',
            requires_booking: true,
            terms_and_conditions: 'Premium massaj mutlaqo bepul',
            image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
        },
        // 16. LOYALTY CARD - Rejected  
        {
            id: 'promo-loyalty-3',
            business_id: businessId,
            service_name: 'VIP Sadoqat Kartasi',
            service_category: 'beauty',
            salon_name: 'Mening biznesim',
            original_price: 200000,
            start_date: '2026-02-10',
            end_date: '2026-12-31',
            status: 'rejected',
            created_at: new Date().toISOString(),
            promotion_type: 'loyalty_card' as const,
            approval_status: 'rejected' as const,
            rejection_reason: 'Kerakli tashriflar soni juda kam. Minimum 5 ta bo\'lishi kerak.',
            requires_booking: true,
            required_visits: 2,
            max_redemptions: 100,
            current_redemptions: 0,
            terms_and_conditions: '2 ta tashrif - 3-chisi bepul!',
            image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"
        },
        // 17. SERVICE BUNDLE - Rejected
        {
            id: 'promo-bundle-3',
            business_id: businessId,
            service_name: 'Mega Premium Paket',
            service_category: 'spa',
            salon_name: 'Mening biznesim',
            original_price: 1500000,
            start_date: '2026-02-12',
            end_date: '2026-03-31',
            status: 'rejected',
            created_at: new Date().toISOString(),
            promotion_type: 'service_bundle' as const,
            approval_status: 'rejected' as const,
            rejection_reason: 'Paket narxi juda yuqori. Iltimos, arzonroq paket taklif qiling.',
            requires_booking: true,
            bundle_price: 1200000,
            bundle_service_ids: ['service-8', 'service-9', 'service-10'],
            terms_and_conditions: 'Premium spa tajribasi!',
            image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        },
    ];
};

export const useFrontendPromotions = (businessId: string) => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadPromotions();
    }, [businessId]);

    const loadPromotions = () => {
        try {
            console.log('Loading promotions for businessId:', businessId);
            const stored = localStorage.getItem(STORAGE_KEY);
            console.log('Stored data:', stored);

            if (stored) {
                const allPromos = JSON.parse(stored);
                const filtered = allPromos.filter((p: any) => p.business_id === businessId);
                console.log('Filtered promotions:', filtered);

                // If no promotions for this business, generate seed data
                if (filtered.length === 0 && businessId) {
                    console.log('No promotions for this business, generating seed data...');
                    const seedData = generateSeedData(businessId);
                    const newAllPromos = [...allPromos, ...seedData];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAllPromos));
                    setPromotions(seedData);
                    console.log('Seed data added:', seedData.length, 'promotions');
                } else {
                    setPromotions(filtered);
                }
            } else if (businessId) {
                // First time - generate seed data
                console.log('Generating seed data...');
                const seedData = generateSeedData(businessId);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
                setPromotions(seedData);
                console.log('Seed data created:', seedData.length, 'promotions');
            }
        } catch (error) {
            console.error('Error loading promotions:', error);
            setPromotions([]);
        }
    };

    const createPromotion = async (data: CreatePromotionData) => {
        try {
            const newPromo: any = {
                id: `promo-${Date.now()}`,
                business_id: businessId,
                service_name: data.serviceName,
                service_category: data.serviceCategory || 'general',
                salon_name: 'Mening biznesim',
                original_price: data.originalPrice,
                start_date: data.startDate,
                end_date: data.endDate,
                status: 'active',
                created_at: new Date().toISOString(),

                // New fields
                promotion_type: data.promotionType,
                approval_status: 'pending_approval',
                terms_and_conditions: data.termsAndConditions,
                requires_booking: data.requiresBooking,
                min_client_trust_score: data.minClientTrustScore,
                target_region: data.targetRegion,
                target_districts: data.targetDistricts,
                service_ids: data.serviceIds, // Store selected service IDs

                // Type-specific fields
                ...(data.promotionType === 'lottery' && {
                    winner_count: data.winnerCount,
                    entry_price: data.entryPrice,
                }),
                ...(data.promotionType === 'buy_one_get_one' && {
                    min_purchase_quantity: data.minPurchaseQuantity,
                    free_quantity: data.freeQuantity,
                    max_uses: data.maxUses,
                }),
                ...(data.promotionType === 'discount' && {
                    discount_type: data.discountType,
                    discount_value: data.discountValue,
                    max_discount_amount: data.maxDiscountAmount,
                }),
                ...(data.promotionType === 'loyalty_card' && {
                    required_visits: data.requiredVisits,
                    max_redemptions: data.maxRedemptions,
                    current_redemptions: 0,
                }),
                ...(data.promotionType === 'service_bundle' && {
                    bundle_price: data.bundlePrice,
                    bundle_service_ids: data.serviceIds,
                }),
            };

            const stored = localStorage.getItem(STORAGE_KEY);
            const allPromos = stored ? JSON.parse(stored) : [];
            allPromos.push(newPromo);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allPromos));

            setPromotions([...promotions, newPromo]);

            toast({
                title: 'Aksiya yaratildi! ✅',
                description: 'Admin tasdiqidan keyin faol bo\'ladi',
            });
        } catch (error) {
            console.error('Error creating promotion:', error);
            toast({
                title: 'Xatolik',
                description: 'Aksiyani yaratishda xatolik',
                variant: 'destructive',
            });
        }
    };

    const deletePromotion = async (promoId: string) => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const allPromos = JSON.parse(stored);
                const filtered = allPromos.filter((p: any) => p.id !== promoId);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                setPromotions(promotions.filter(p => p.id !== promoId));

                toast({
                    title: 'O\'chirildi',
                    description: 'Aksiya o\'chirildi',
                });
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
        }
    };

    return {
        promotions,
        loading,
        createPromotion,
        deletePromotion,
        refetch: loadPromotions,
    };
};
