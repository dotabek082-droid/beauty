// Promotion system types and interfaces

export type PromotionType = 'lottery' | 'buy_one_get_one' | 'discount' | 'free_service' | 'loyalty_card' | 'service_bundle';

export type ApprovalStatus =
    | 'pending_approval'
    | 'approved'
    | 'rejected'
    | 'active'
    | 'inactive'
    | 'ended';

export type DiscountType = 'percentage' | 'fixed';

export interface PromotionTypeConfig {
    type: PromotionType;
    label: string;
    labelUz: string;
    icon: string;
    description: string;
    descriptionUz: string;
    color: string;
    availableFor: string[]; // service categories
    coinCost: number;
}

export interface BasePromotion {
    id: string;
    business_id: string;
    service_name: string;
    service_category: string;
    salon_name: string;
    original_price: number;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;

    // New fields
    promotion_type: PromotionType;
    approval_status: ApprovalStatus;
    rejection_reason?: string;
    approved_by?: string;
    approved_at?: string;
    terms_and_conditions?: string;
    requires_booking: boolean;
    min_client_trust_score?: number;
    target_region?: string;
    target_districts?: string[];
}

export interface LotteryPromotion extends BasePromotion {
    promotion_type: 'lottery';
    winner_count: number;
    entry_price: number;
}

export interface BuyOneGetOnePromotion extends BasePromotion {
    promotion_type: 'buy_one_get_one';
    min_purchase_quantity: number;
    free_quantity: number;
    max_uses?: number;
}

export interface DiscountPromotion extends BasePromotion {
    promotion_type: 'discount';
    discount_type: DiscountType;
    discount_value: number;
    max_discount_amount?: number;
}

export interface FreeServicePromotion extends BasePromotion {
    promotion_type: 'free_service';
    max_uses?: number;
    current_uses?: number;
}

export interface LoyaltyCardPromotion extends BasePromotion {
    promotion_type: 'loyalty_card';
    required_visits: number;
    max_redemptions?: number;
    current_redemptions?: number;
}

export interface ServiceBundlePromotion extends BasePromotion {
    promotion_type: 'service_bundle';
    bundle_price: number;
    bundle_service_ids: string[];
}

export type Promotion =
    | LotteryPromotion
    | BuyOneGetOnePromotion
    | DiscountPromotion
    | FreeServicePromotion
    | LoyaltyCardPromotion
    | ServiceBundlePromotion;

export interface CreatePromotionData {
    serviceCategory: string;
    serviceName: string;
    serviceIds?: string[]; // Added for multiple service selection
    originalPrice: number;
    promotionType: PromotionType;
    startDate: string;
    endDate: string;
    termsAndConditions?: string;
    requiresBooking: boolean;

    // Type-specific fields
    winnerCount?: number;
    entryPrice?: number;
    minPurchaseQuantity?: number;
    freeQuantity?: number;
    maxUses?: number;
    minClientTrustScore?: number; // Added field for client trust score requirement
    targetRegion?: string; // Target region for promotion visibility
    targetDistricts?: string[]; // Target districts for promotion visibility
    requiredVisits?: number; // For loyalty card
    maxRedemptions?: number; // For loyalty card
    bundlePrice?: number; // For service bundle
    discountType?: DiscountType;
    discountValue?: number;
    maxDiscountAmount?: number;
}

export interface ApprovalAction {
    promotionId: string;
    action: 'approve' | 'reject';
    reason?: string;
}
