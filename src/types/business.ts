// Business Profile
export interface Business {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    category: string; // Main category ID
    subcategories: string[]; // Array of subcategory IDs
    priceRange: '$' | '$$' | '$$$' | '$$$$';
    address: {
        street: string;
        city: string;
        region: string;
        postalCode: string;
        neighborhood?: string; // e.g., "Chilonzor", "Yunusabad"
    };
    location: {
        lat: number;
        lng: number;
    };
    contact: {
        phone: string;
        email: string;
        website?: string;
    };
    hours: {
        [day: string]: { open: string; close: string; closed: boolean };
    };
    amenities: {
        acceptsCreditCards: boolean;
        freeWifi: boolean;
        wheelchairAccessible: boolean;
        goodForKids: boolean;
        byAppointmentOnly: boolean;
        acceptsApplePay: boolean;
        militaryDiscount: boolean;
        parking: boolean;
        outdoorSeating: boolean;
        genderNeutralRestrooms: boolean;
        reservations: boolean;
        delivery: boolean;
        takeout: boolean;
    };
    photos: string[];
    services: BusinessService[];
    staff: StaffMember[];
    rating: number;
    reviewCount: number;
    verified: boolean;
    verifiedLicense: boolean;
    createdAt: Date;
    subscription?: {
        tier: 'free' | 'pro' | 'elite';
        expiryDate: string | null;
        isAutoRenew: boolean;
    };
    isTop?: boolean;
}

// Business Service
export interface BusinessService {
    id: string;
    businessId: string;
    name: string;
    description: string;
    category: string;
    duration: number; // in minutes
    price: number;
    imageUrl?: string;
    isActive: boolean;
}

// Staff Member
export interface StaffMember {
    id: string;
    businessId: string;
    name: string;
    role: string;
    photo?: string;
    specialties: string[];
    rating: number;
    isActive: boolean;
}

// Service Booking
export interface ServiceBooking {
    id: string;
    businessId: string;
    businessName: string;
    serviceId: string;
    serviceName: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    date: Date;
    time: string;
    staffId?: string;
    staffName?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    price: number;
    notes?: string;
    createdAt: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
}

// Promotion Status
export interface PromotionStatus {
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'active' | 'expired';
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string; // Admin ID
    rejectionReason?: string;
}

// Business Promotion (extends base Promotion)
export interface BusinessPromotion {
    id: string;
    businessId: string;
    businessName: string;
    salonId: string;
    salonName: string;
    serviceName: string;
    serviceDescription: string;
    originalPrice: number;
    imageUrl: string;
    startsAt: string;
    endsAt: string | null;
    isActive: boolean;

    // Lottery fields
    lotteryEnabled: boolean;
    entryDeadline: string | null;
    winnerSelectionDate: string | null;
    totalWinners: number;
    currentEntries: number;
    reviewDeadlineHours: number;
    ticketPrice?: number;

    // Direct booking fields
    slotsAvailable: number;
    slotsUsed: number;
    discountedPrice?: number;

    // Approval workflow
    approvalStatus: PromotionStatus;
    createdBy: string; // Business owner ID
    createdAt: Date;
    promotionType?: 'lottery' | 'buy_one_get_one' | 'discount' | 'free_service' | 'loyalty_card' | 'service_bundle' | 'regular' | '1+1';
}

// Promotion Approval
export interface PromotionApproval {
    id: string;
    promotionId: string;
    businessId: string;
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    adminNotes?: string;
}
