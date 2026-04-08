import { PromotionType, PromotionTypeConfig } from "@/types/promotion";
import { Gift, Percent, Ticket, Tag } from "lucide-react";

export const usePromotionTypes = () => {
    const promotionTypes: PromotionTypeConfig[] = [
        {
            type: 'lottery',
            label: 'Lottery',
            labelUz: 'Lotereya',
            icon: 'Ticket',
            description: 'Random winner selection - perfect for beauty services',
            descriptionUz: 'Tasodifiy g\'olib tanlash - go\'zallik xizmatlari uchun',
            color: 'blue',
            availableFor: ['beauty', 'spa', 'salon', 'all'],
            coinCost: 150,
        },
        {
            type: 'buy_one_get_one',
            label: '1+1 Offer',
            labelUz: '1+1 Taklif',
            icon: 'Gift',
            description: 'Buy one get one free - great for restaurants and cafes',
            descriptionUz: 'Bittasini oling, ikkinchisi bepul - restoran va kafe uchun',
            color: 'green',
            availableFor: ['restaurant', 'cafe', 'food', 'all'],
            coinCost: 50,
        },
        {
            type: 'discount',
            label: 'Discount',
            labelUz: 'Chegirma',
            icon: 'Percent',
            description: 'Percentage or fixed amount discount',
            descriptionUz: 'Foiz yoki qat\'iy miqdorda chegirma',
            color: 'orange',
            availableFor: ['all'],
            coinCost: 50,
        },
        {
            type: 'free_service',
            label: 'Free Service',
            labelUz: 'Bepul Xizmat',
            icon: 'Gift',
            description: 'Offer free services for a limited time',
            descriptionUz: 'Mijozlar uchun vaqtincha bepul xizmatlar taklif qiling',
            color: 'purple',
            availableFor: ['all'],
            coinCost: 100,
        },
        {
            type: 'loyalty_card',
            label: 'Loyalty Card',
            labelUz: 'Sadoqat Kartasi',
            icon: 'Tag',
            description: 'Reward customers after certain visits',
            descriptionUz: 'Mijozlarni ma\'lum tashriflardan keyin mukofotlang',
            color: 'teal',
            availableFor: ['all'],
            coinCost: 75,
        },
        {
            type: 'service_bundle',
            label: 'Service Bundle',
            labelUz: 'Paket Taklif',
            icon: 'Gift',
            description: 'Combine multiple services at discounted price',
            descriptionUz: 'Bir nechta xizmatni chegirmali narxda birlashtiring',
            color: 'pink',
            availableFor: ['all'],
            coinCost: 60,
        },
    ];

    const getTypeConfig = (type: PromotionType): PromotionTypeConfig | undefined => {
        return promotionTypes.find(t => t.type === type);
    };

    const getAvailableTypes = (serviceCategory?: string): PromotionTypeConfig[] => {
        if (!serviceCategory) return promotionTypes;

        return promotionTypes.filter(type =>
            type.availableFor.includes(serviceCategory) ||
            type.availableFor.includes('all')
        );
    };

    const getTypeIcon = (type: PromotionType) => {
        const config = getTypeConfig(type);
        switch (config?.icon) {
            case 'Ticket': return Ticket;
            case 'Gift': return Gift;
            case 'Percent': return Percent;
            case 'Tag': return Tag;
            default: return Ticket;
        }
    };

    const getTypeColor = (type: PromotionType): string => {
        const config = getTypeConfig(type);
        switch (config?.color) {
            case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'green': return 'bg-green-100 text-green-700 border-green-200';
            case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'teal': return 'bg-teal-100 text-teal-700 border-teal-200';
            case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'pending_approval': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'ended': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'pending_approval': return 'Kutilmoqda';
            case 'approved': return 'Tasdiqlangan';
            case 'rejected': return 'Rad etilgan';
            case 'active': return 'Faol';
            case 'inactive': return 'Nofaol';
            case 'ended': return 'Tugagan';
            default: return status;
        }
    };

    return {
        promotionTypes,
        getTypeConfig,
        getAvailableTypes,
        getTypeIcon,
        getTypeColor,
        getStatusColor,
        getStatusLabel,
    };
};
