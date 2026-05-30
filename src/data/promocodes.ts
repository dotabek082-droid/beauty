
export interface Promocode {
    id: string;
    code: string;
    description: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    minOrderAmount?: number;
    startDate?: string;
    validUntil: string;
    status: 'active' | 'draft' | 'used' | 'expired';
    source: 'system' | 'admin';
    applicableCategories?: string[]; // e.g., ['Soch turmaklash', 'Avto']
}

export const fakePromocodes: Promocode[] = [
    {
        id: 'pc-cat-hair',
        code: 'HAIRSTYLE25',
        description: "Barcha soch turmaklash va bo'yash xizmatlari uchun",
        discountType: 'percent',
        discountValue: 15,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'system',
        applicableCategories: ['Soch turmaklash', 'Barbershop']
    },
    {
        id: 'pc-cat-auto',
        code: 'AVTOMOYKA',
        description: "Avtomobilingizni yuvish uchun maxsus chegirma",
        discountType: 'fixed',
        discountValue: 15000,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'system',
        applicableCategories: ['Avto yuvish', 'Deteiling']
    },
    {
        id: 'pc-cat-spa',
        code: 'SPA-RELAX',
        description: "Spa va massaj xizmatlari uchun",
        discountType: 'percent',
        discountValue: 20,
        minOrderAmount: 300000,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'admin',
        applicableCategories: ['SPA', 'Massaj']
    },
    {
        id: 'pc-0',
        code: 'SARTAROSH20',
        description: "Birinchi tashrifga 20% chegirma (Maxsus taklif)",
        discountType: 'percent',
        discountValue: 20,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'system'
    },
    {
        id: 'pc-1',
        code: 'SALOM2026',
        description: "Yangi foydalanuvchilar uchun maxsus chegirma",
        discountType: 'percent',
        discountValue: 15,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'system'
    },
    {
        id: 'pc-2',
        code: 'VIPCLIENT',
        description: "Premium xizmatlar uchun shaxsiy chegirma",
        discountType: 'fixed',
        discountValue: 50000,
        minOrderAmount: 200000,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'admin'
    },
    {
        id: 'pc-3',
        code: 'BAHOR25',
        description: "Bahorgi bayram munosabati bilan",
        discountType: 'percent',
        discountValue: 25,
        validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'system'
    },
    {
        id: 'pc-4',
        code: 'WELCOME',
        description: "Ro'yxatdan o'tganingiz uchun bonus",
        discountType: 'fixed',
        discountValue: 20000,
        validUntil: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expired',
        source: 'system'
    },
    {
        id: 'pc-5',
        code: 'JUMA-SALE',
        description: "Juma kungi chegirma kodi",
        discountType: 'percent',
        discountValue: 10,
        validUntil: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'used',
        source: 'system'
    },
    {
        id: 'pc-6',
        code: 'ADMIN-GIFT',
        description: "Sadoqatli mijozimizga admin tomonidan sovg'a",
        discountType: 'fixed',
        discountValue: 100000,
        minOrderAmount: 300000,
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        source: 'admin'
    },
    {
        id: 'pc-us-1',
        code: 'YANGIYIL2026',
        description: "Yangi yil bayrami uchun maxsus",
        discountType: 'percent',
        discountValue: 30,
        validUntil: new Date('2026-01-05').toISOString(),
        status: 'used',
        source: 'system',
        applicableCategories: ['Go\'zallik', 'SPA']
    },
    {
        id: 'pc-us-2',
        code: 'BIRINCHI-XARID',
        description: "Ilk tashrif uchun bonus",
        discountType: 'fixed',
        discountValue: 25000,
        validUntil: new Date('2026-01-20').toISOString(),
        status: 'used',
        source: 'system'
    },
    {
        id: 'pc-us-3',
        code: 'DOSTLIK',
        description: "Do'stingizni taklif qilganingiz uchun",
        discountType: 'percent',
        discountValue: 10,
        validUntil: new Date('2026-02-01').toISOString(),
        status: 'used',
        source: 'system'
    },
    {
        id: 'pc-us-4',
        code: 'FLASH-SALE-FEB',
        description: "Fevral oyining tezkor chegirmasi",
        discountType: 'fixed',
        discountValue: 40000,
        validUntil: new Date('2026-02-02').toISOString(),
        status: 'used',
        source: 'admin',
        minOrderAmount: 150000
    }
];
