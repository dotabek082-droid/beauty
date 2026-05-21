import { Business, BusinessService, ServiceBooking, BusinessPromotion, PromotionApproval } from "@/types/business";

// Mock Businesses
export const mockBusinesses: Business[] = [
    // BEAUTY & SPAS
    {
        id: "biz-1",
        ownerId: "owner-1",
        name: "Belleza Studio",
        description: "Professional barber va go'zallik saloni. Yuqori malakali mutaxassislar bilan ishlang!",
        category: "health-beauty",
        subcategories: ["barbers", "hair-salons"],
        priceRange: "$$",
        address: {
            street: "Amir Temur ko'chasi 15",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100000",
            neighborhood: "Shayxontohur",
        },
        location: {
            lat: 41.311081,
            lng: 69.240562,
        },
        contact: {
            phone: "+998901234567",
            email: "info@belleza.uz",
            website: "https://belleza.uz",
        },
        hours: {
            monday: { open: "09:00", close: "20:00", closed: false },
            tuesday: { open: "09:00", close: "20:00", closed: false },
            wednesday: { open: "09:00", close: "20:00", closed: false },
            thursday: { open: "09:00", close: "20:00", closed: false },
            friday: { open: "09:00", close: "20:00", closed: false },
            saturday: { open: "10:00", close: "18:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: true },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: false,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: false,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800",
            "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800",
        ],
        services: [
            {
                id: "svc-1",
                businessId: "biz-1",
                name: "Erkaklar soch turmagi",
                description: "Professional barber xizmati",
                category: "Haircut",
                duration: 30,
                price: 50000,
                imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
                isActive: true,
            },
            {
                id: "svc-2",
                businessId: "biz-1",
                name: "Soqol turmagi",
                description: "Professional soqol parvarishi",
                category: "Beard",
                duration: 20,
                price: 30000,
                isActive: true,
            },
            {
                id: "svc-hair-color",
                businessId: "biz-1",
                name: "Soch Bo'yash",
                description: "L'Oreal professional bo'yoqlari bilan soch bo'yash xizmati",
                category: "HairColor",
                duration: 90,
                price: 450000,
                isActive: true,
            },
            {
                id: "svc-manicure",
                businessId: "biz-1",
                name: "Manikyur + Gel Lak",
                description: "Manikyur va gel lak qoplash xizmati",
                category: "Nails",
                duration: 60,
                price: 120000,
                isActive: true,
            },
        ],
        staff: [
            {
                id: "staff-1",
                businessId: "biz-1",
                name: "Aziz Karimov",
                role: "Bosh barber",
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                specialties: ["Haircut", "Beard"],
                rating: 4.8,
                isActive: true,
            },
        ],
        rating: 4.7,
        reviewCount: 234,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2023-01-15"),
        isTop: true,
    },
    {
        id: "biz-2",
        ownerId: "owner-2",
        name: "Glamour Hair",
        description: "Ayollar soch turmagi va stilistika xizmatlari",
        category: "health-beauty",
        subcategories: ["hair-salons", "nail-salons"],
        priceRange: "$$$",
        address: {
            street: "Mustaqillik ko'chasi 45",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100000",
            neighborhood: "Chilonzor",
        },
        location: {
            lat: 41.275568,
            lng: 69.203142,
        },
        contact: {
            phone: "+998901234568",
            email: "info@glamour.uz",
        },
        hours: {
            monday: { open: "08:00", close: "19:00", closed: false },
            tuesday: { open: "08:00", close: "19:00", closed: false },
            wednesday: { open: "08:00", close: "19:00", closed: false },
            thursday: { open: "08:00", close: "19:00", closed: false },
            friday: { open: "08:00", close: "19:00", closed: false },
            saturday: { open: "09:00", close: "17:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: true },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: false,
            byAppointmentOnly: true,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: false,
            outdoorSeating: false,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        ],
        services: [
            {
                id: "svc-3",
                businessId: "biz-2",
                name: "Ayollar soch turmagi",
                description: "Professional women's haircut",
                category: "Haircut",
                duration: 60,
                price: 80000,
                imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.9,
        reviewCount: 456,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2023-03-20"),
    },

    // RESTAURANTS
    {
        id: "biz-3",
        ownerId: "owner-3",
        name: "Сhef's Table",
        description: "Zamonaviy Yevropa va O'zbek oshxonasi. Eng mazali taomlar va ajoyib atmosfera!",
        category: "restaurants",
        subcategories: ["uzbek", "italian"],
        priceRange: "$$$",
        address: {
            street: "Mirzo Ulug'bek ko'chasi 88",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100047",
            neighborhood: "Mirzo Ulug'bek",
        },
        location: {
            lat: 41.324419,
            lng: 69.288773,
        },
        contact: {
            phone: "+998901111111",
            email: "info@chefstable.uz",
            website: "https://chefstable.uz",
        },
        hours: {
            monday: { open: "10:00", close: "23:00", closed: false },
            tuesday: { open: "10:00", close: "23:00", closed: false },
            wednesday: { open: "10:00", close: "23:00", closed: false },
            thursday: { open: "10:00", close: "23:00", closed: false },
            friday: { open: "10:00", close: "00:00", closed: false },
            saturday: { open: "10:00", close: "00:00", closed: false },
            sunday: { open: "10:00", close: "23:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: true,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: true,
            takeout: true,
        },
        photos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        ],
        services: [
            {
                id: "svc-rest-4",
                businessId: "biz-3",
                name: "Stol (2 kishilik)",
                description: "Romantik kechki ovqat uchun stol",
                category: "Table",
                duration: 120,
                price: 100000,
                isActive: true,
            },
            {
                id: "svc-rest-5",
                businessId: "biz-3",
                name: "Chef's Special",
                description: "Bosh oshpazdan maxsus taomlar seti",
                category: "Set",
                duration: 120,
                price: 500000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.8,
        reviewCount: 523,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2022-06-10"),
        isTop: true,
    },
    {
        id: "biz-4",
        ownerId: "owner-4",
        name: "Samarkand Osh Markazi",
        description: "An'anaviy O'zbek taomlari, eng mazali osh va somsa!",
        category: "restaurants",
        subcategories: ["uzbek"],
        priceRange: "$",
        address: {
            street: "Bunyodkor ko'chasi 12",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100093",
            neighborhood: "Yunusabad",
        },
        location: {
            lat: 41.350427,
            lng: 69.289482,
        },
        contact: {
            phone: "+998902222222",
            email: "info@samarkandosh.uz",
        },
        hours: {
            monday: { open: "07:00", close: "22:00", closed: false },
            tuesday: { open: "07:00", close: "22:00", closed: false },
            wednesday: { open: "07:00", close: "22:00", closed: false },
            thursday: { open: "07:00", close: "22:00", closed: false },
            friday: { open: "07:00", close: "23:00", closed: false },
            saturday: { open: "07:00", close: "23:00", closed: false },
            sunday: { open: "07:00", close: "22:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: false,
            freeWifi: false,
            wheelchairAccessible: false,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: false,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: true,
            genderNeutralRestrooms: false,
            reservations: false,
            delivery: true,
            takeout: true,
        },
        photos: [
            "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800",
        ],
        services: [
            {
                id: "svc-rest-1",
                businessId: "biz-4",
                name: "Stol (2 kishilik)",
                description: "2 kishilik shinam stol band qilish",
                category: "Table",
                duration: 120, // 2 hours
                price: 50000, // Deposit
                isActive: true,
            },
            {
                id: "svc-rest-2",
                businessId: "biz-4",
                name: "Stol (4 kishilik)",
                description: "Oila yoki do'stlar uchun 4 kishilik stol",
                category: "Table",
                duration: 120, // 2 hours
                price: 100000, // Deposit
                isActive: true,
            },
            {
                id: "svc-rest-3",
                businessId: "biz-4",
                name: "VIP Kabina",
                description: "6-8 kishilik alohida xona, TV va karaoke bilan",
                category: "VIP",
                duration: 180, // 3 hours
                price: 250000, // Room fee
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.6,
        reviewCount: 892,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2021-03-15"),
    },

    // COFFEE & TEA
    {
        id: "biz-5",
        ownerId: "owner-5",
        name: "Barista Coffee Lab",
        description: "Premium qahva va shirinliklar. Ideal ish va uchrashuv joyi!",
        category: "restaurants",
        subcategories: ["coffee-cafes", "bakeries"],
        priceRange: "$$",
        address: {
            street: "Afrosiyob ko'chasi 4",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100015",
            neighborhood: "Yakkasaroy",
        },
        location: {
            lat: 41.315394,
            lng: 69.256590,
        },
        contact: {
            phone: "+998903333333",
            email: "hello@barista.uz",
            website: "https://barista.uz",
        },
        hours: {
            monday: { open: "07:30", close: "22:00", closed: false },
            tuesday: { open: "07:30", close: "22:00", closed: false },
            wednesday: { open: "07:30", close: "22:00", closed: false },
            thursday: { open: "07:30", close: "22:00", closed: false },
            friday: { open: "07:30", close: "23:00", closed: false },
            saturday: { open: "08:00", close: "23:00", closed: false },
            sunday: { open: "08:00", close: "22:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: false,
            outdoorSeating: true,
            genderNeutralRestrooms: true,
            reservations: false,
            delivery: true,
            takeout: true,
        },
        photos: [
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        ],
        services: [
            {
                id: "svc-coffee-1",
                businessId: "biz-5",
                name: "Espresso",
                description: "100% Arabica",
                category: "Coffee",
                duration: 15,
                price: 15000,
                isActive: true,
            },
            {
                id: "svc-coffee-2",
                businessId: "biz-5",
                name: "Cappuccino",
                description: "Yumshoq sutli qahva",
                category: "Coffee",
                duration: 20,
                price: 22000,
                isActive: true,
            },
            {
                id: "svc-coffee-3",
                businessId: "biz-5",
                name: "Cheesecake",
                description: "Klassik New York cheesecake",
                category: "Dessert",
                duration: 0,
                price: 35000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.9,
        reviewCount: 678,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2022-09-01"),
    },

    // SHOPPING
    {
        id: "biz-6",
        ownerId: "owner-6",
        name: "Fashion Boutique",
        description: "Zamonaviy va trend kiyim-kechaklar. Brendli mahsulotlar va sifatli xizmat.",
        category: "shopping",
        subcategories: ["clothing"],
        priceRange: "$$$",
        address: {
            street: "Abdulla Qodiriy ko'chasi 22",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100011",
            neighborhood: "Mirobod",
        },
        location: {
            lat: 41.303712,
            lng: 69.257405,
        },
        contact: {
            phone: "+998904444444",
            email: "info@fashionboutique.uz",
        },
        hours: {
            monday: { open: "09:00", close: "20:00", closed: false },
            tuesday: { open: "09:00", close: "20:00", closed: false },
            wednesday: { open: "09:00", close: "20:00", closed: false },
            thursday: { open: "09:00", close: "20:00", closed: false },
            friday: { open: "09:00", close: "21:00", closed: false },
            saturday: { open: "09:00", close: "21:00", closed: false },
            sunday: { open: "10:00", close: "20:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: false,
            wheelchairAccessible: true,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: true,
            reservations: false,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
        ],
        services: [
            {
                id: "svc-shop-1",
                businessId: "biz-6",
                name: "Stilist maslahati",
                description: "Professional stilist bilan 1 soatlik sessiya",
                category: "Consultation",
                duration: 60,
                price: 150000,
                isActive: true,
            },
            {
                id: "svc-shop-2",
                businessId: "biz-6",
                name: "Libosni to'g'irlash",
                description: "Libosni qomatga moslashtirish xizmati",
                category: "Service",
                duration: 30,
                price: 50000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.4,
        reviewCount: 189,
        verified: true,
        verifiedLicense: false,
        createdAt: new Date("2023-01-20"),
    },

    // AUTOMOTIVE
    {
        id: "biz-7",
        ownerId: "owner-7",
        name: "Premium Car Wash",
        description: "Professional avtomoyka va deteyling xizmatlari. Mashinangizga ajoyib g'amxo'rlik!",
        category: "automotive",
        subcategories: ["car-wash", "detailing"],
        priceRange: "$$",
        address: {
            street: "Bobur ko'chasi 3",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100084",
            neighborhood: "Sergeli",
        },
        location: {
            lat: 41.227548,
            lng: 69.217474,
        },
        contact: {
            phone: "+998905555555",
            email: "info@premiumcarwash.uz",
        },
        hours: {
            monday: { open: "08:00", close: "20:00", closed: false },
            tuesday: { open: "08:00", close: "20:00", closed: false },
            wednesday: { open: "08:00", close: "20:00", closed: false },
            thursday: { open: "08:00", close: "20:00", closed: false },
            friday: { open: "08:00", close: "20:00", closed: false },
            saturday: { open: "08:00", close: "20:00", closed: false },
            sunday: { open: "09:00", close: "18:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: false,
            goodForKids: false,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: true,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: false,
            reservations: false,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800",
        ],
        services: [
            {
                id: "svc-auto-1",
                businessId: "biz-7",
                name: "Standart yuvish",
                description: "Kuzov va salonni tozalash",
                category: "Wash",
                duration: 45,
                price: 60000,
                isActive: true,
            },
            {
                id: "svc-auto-2",
                businessId: "biz-7",
                name: "Kompleks tozalash",
                description: "To'liq tozalash, polirovka va himoya qatlami",
                category: "Complex",
                duration: 90,
                price: 150000,
                isActive: true,
            },
            {
                id: "svc-auto-3",
                businessId: "biz-7",
                name: "Kimyoviy tozalash",
                description: "Salonni kimyoviy vositalar bilan chuqur tozalash",
                category: "Detailing",
                duration: 240,
                price: 800000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.7,
        reviewCount: 312,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2022-11-05"),
    },

    // ACTIVE LIFE (Gym)
    {
        id: "biz-8",
        ownerId: "owner-8",
        name: "BeFit Gym",
        description: "Zamonaviy trenajyorlar, professional murabbiylar va qulay muhit.",
        category: "health-beauty",
        subcategories: ["gyms"],
        priceRange: "$$$",
        address: {
            street: "Oybek ko'chasi 24",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100015",
            neighborhood: "Mirobod",
        },
        location: {
            lat: 41.295831,
            lng: 69.273842,
        },
        contact: {
            phone: "+998908888888",
            email: "info@befit.uz",
        },
        hours: {
            monday: { open: "06:00", close: "23:00", closed: false },
            tuesday: { open: "06:00", close: "23:00", closed: false },
            wednesday: { open: "06:00", close: "23:00", closed: false },
            thursday: { open: "06:00", close: "23:00", closed: false },
            friday: { open: "06:00", close: "23:00", closed: false },
            saturday: { open: "08:00", close: "22:00", closed: false },
            sunday: { open: "08:00", close: "21:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: false,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: true,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: true,
            reservations: false,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
            "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800",
        ],
        services: [
            {
                id: "svc-active-1",
                businessId: "biz-8",
                name: "1 oylik abonement",
                description: "Limitsiz mashg'ulotlar",
                category: "Membership",
                duration: 0,
                price: 800000,
                isActive: true,
            },
            {
                id: "svc-active-2",
                businessId: "biz-8",
                name: "Shaxsiy murabbiy (12 mashg'ulot)",
                description: "Individual yondashuv va dastur",
                category: "Training",
                duration: 60,
                price: 1500000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.9,
        reviewCount: 412,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2023-05-10"),
    },

    // HOTELS & TRAVEL
    {
        id: "biz-9",
        ownerId: "owner-9",
        name: "Tashkent City Hotel",
        description: "Shahar markazida, barcha qulayliklarga ega zamonaviy mehmonxona.",
        category: "travel-activities",
        subcategories: ["hotels"],
        priceRange: "$$$",
        address: {
            street: "Islam Karimov ko'chasi 1",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100027",
            neighborhood: "Olmazor",
        },
        location: {
            lat: 41.313421,
            lng: 69.245812,
        },
        contact: {
            phone: "+998712000000",
            email: "reservations@tashkentcityhotel.uz",
        },
        hours: {
            monday: { open: "00:00", close: "00:00", closed: false }, // 24/7
            tuesday: { open: "00:00", close: "00:00", closed: false },
            wednesday: { open: "00:00", close: "00:00", closed: false },
            thursday: { open: "00:00", close: "00:00", closed: false },
            friday: { open: "00:00", close: "00:00", closed: false },
            saturday: { open: "00:00", close: "00:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: true,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: true,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        ],
        services: [
            {
                id: "svc-hotel-1",
                businessId: "biz-9",
                name: "Standart Xona",
                description: "2 kishilik qulay xona, nonushta ichida",
                category: "Room",
                duration: 1440, // 24 hours
                price: 1200000,
                isActive: true,
            },
            {
                id: "svc-hotel-2",
                businessId: "biz-9",
                name: "Lyuks Xona",
                description: "Keng apartamentlar, shahar manzarasi",
                category: "Room",
                duration: 1440,
                price: 2500000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.8,
        reviewCount: 890,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2021-08-15"),
    },

    // REAL ESTATE
    {
        id: "biz-10",
        ownerId: "owner-10",
        name: "Golden Key Agency",
        description: "Ko'chmas mulk oldi-sotdisi va ijarasi bo'yicha ishonchli hamkor.",
        category: "home-services",
        subcategories: ["real-estate"],
        priceRange: "$$",
        address: {
            street: "Navoiy ko'chasi 7",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100011",
            neighborhood: "Shayxontohur",
        },
        location: {
            lat: 41.318921,
            lng: 69.263842,
        },
        contact: {
            phone: "+998909999999",
            email: "info@goldenkey.uz",
        },
        hours: {
            monday: { open: "09:00", close: "18:00", closed: false },
            tuesday: { open: "09:00", close: "18:00", closed: false },
            wednesday: { open: "09:00", close: "18:00", closed: false },
            thursday: { open: "09:00", close: "18:00", closed: false },
            friday: { open: "09:00", close: "18:00", closed: false },
            saturday: { open: "10:00", close: "16:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: true },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: false,
            byAppointmentOnly: true,
            acceptsApplePay: false,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: false,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
        ],
        services: [
            {
                id: "svc-real-1",
                businessId: "biz-10",
                name: "Mulkni baholash",
                description: "Professional baholash xizmati",
                category: "Appraisal",
                duration: 60,
                price: 500000,
                isActive: true,
            },
            {
                id: "svc-real-2",
                businessId: "biz-10",
                name: "Ijaraga uy topish",
                description: "Sizning talabingiz bo'yicha variantlar izlash",
                category: "Search",
                duration: 0,
                price: 1500000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.5,
        reviewCount: 120,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2023-06-01"),
    },

    // HEALTH & MEDICAL
    {
        id: "biz-11",
        ownerId: "owner-11",
        name: "Shifo Med Clinic",
        description: "Zamonaviy diagnostika va davolash markazi. Yuqori malakali shifokorlar.",
        category: "health-medical",
        subcategories: ["doctors", "hospitals"],
        priceRange: "$$",
        address: {
            street: "Farobiy ko'chasi 2",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100174",
            neighborhood: "Olmazor",
        },
        location: {
            lat: 41.341482,
            lng: 69.208472,
        },
        contact: {
            phone: "+998712468888",
            email: "info@shifomed.uz",
        },
        hours: {
            monday: { open: "08:00", close: "20:00", closed: false },
            tuesday: { open: "08:00", close: "20:00", closed: false },
            wednesday: { open: "08:00", close: "20:00", closed: false },
            thursday: { open: "08:00", close: "20:00", closed: false },
            friday: { open: "08:00", close: "20:00", closed: false },
            saturday: { open: "08:00", close: "18:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: true },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: true,
            byAppointmentOnly: true,
            acceptsApplePay: true,
            militaryDiscount: true,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        ],
        services: [
            {
                id: "svc-med-1",
                businessId: "biz-11",
                name: "Terapevt ko'rigi",
                description: "Umumiy tekshiruv va maslahat",
                category: "Consultation",
                duration: 30,
                price: 150000,
                isActive: true,
            },
            {
                id: "svc-med-2",
                businessId: "biz-11",
                name: "Qon tahlili (Umumiy)",
                description: "Laboratoriya tekshiruvi",
                category: "Lab",
                duration: 15,
                price: 80000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.7,
        reviewCount: 345,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2020-11-20"),
    },

    // EDUCATION
    {
        id: "biz-12",
        ownerId: "owner-12",
        name: "Cambridge Learning Center",
        description: "Ingliz tili va IELTS kurslari. Professional o'qituvchilar va kafolatlangan natija.",
        category: "education",
        subcategories: ["language", "tutoring"],
        priceRange: "$$",
        address: {
            street: "Mustaqillik shoh ko'chasi 10",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100000",
            neighborhood: "Markaz-1",
        },
        location: {
            lat: 41.311151,
            lng: 69.279737,
        },
        contact: {
            phone: "+998712001111",
            email: "info@cambridge.uz",
        },
        hours: {
            monday: { open: "09:00", close: "21:00", closed: false },
            tuesday: { open: "09:00", close: "21:00", closed: false },
            wednesday: { open: "09:00", close: "21:00", closed: false },
            thursday: { open: "09:00", close: "21:00", closed: false },
            friday: { open: "09:00", close: "21:00", closed: false },
            saturday: { open: "09:00", close: "18:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: true },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: true,
            byAppointmentOnly: true,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        ],
        services: [
            {
                id: "svc-edu-1",
                businessId: "biz-12",
                name: "General English (1 oy)",
                description: "Haftada 3 kun, 1.5 soatdan",
                category: "Course",
                duration: 0,
                price: 800000,
                isActive: true,
            },
            {
                id: "svc-edu-2",
                businessId: "biz-12",
                name: "IELTS Mock Exam",
                description: "Haqiqiy imtihon muhitida sinov",
                category: "Exam",
                duration: 180,
                price: 100000,
                isActive: true,
            },
        ],
        staff: [],
        rating: 4.8,
        reviewCount: 950,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2019-09-01"),
    },
    // FAKE DATA FOR FAVORITES DEMO
    {
        id: "fake-1",
        ownerId: "fake-owner-1",
        name: "Oltin Qaychi",
        description: "Professional sartaroshxona. Zamonaviy soch turmaklari va soqol olish xizmatlari.",
        category: "beauty-spas",
        subcategories: ["barbershops"],
        priceRange: "$",
        address: {
            street: "Chilonzor ko'chasi 5",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100100",
            neighborhood: "Chilonzor",
        },
        location: {
            lat: 41.285831,
            lng: 69.203842,
        },
        contact: {
            phone: "+998901112233",
            email: "info@oltinqaychi.uz",
        },
        hours: {
            monday: { open: "09:00", close: "20:00", closed: false },
            tuesday: { open: "09:00", close: "20:00", closed: false },
            wednesday: { open: "09:00", close: "20:00", closed: false },
            thursday: { open: "09:00", close: "20:00", closed: false },
            friday: { open: "09:00", close: "20:00", closed: false },
            saturday: { open: "09:00", close: "18:00", closed: false },
            sunday: { open: "10:00", close: "16:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: false,
            goodForKids: true,
            byAppointmentOnly: false,
            acceptsApplePay: false,
            militaryDiscount: true,
            parking: true,
            outdoorSeating: false,
            genderNeutralRestrooms: false,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800",
            "https://images.unsplash.com/photo-1503951914875-452162b7f304?w=800"
        ],
        services: [
            { id: "svc-fake-1-1", businessId: "fake-1", name: "Soch kesish", description: "Erkaklar uchun soch kesish", category: "Haircut", duration: 30, price: 50000, isActive: true },
            { id: "svc-fake-1-2", businessId: "fake-1", name: "Soqol olish", description: "Xavfli ustra bilan soqol olish", category: "Beard", duration: 20, price: 30000, isActive: true },
            { id: "svc-fake-1-3", businessId: "fake-1", name: "Kuyov stili", description: "To'y uchun maxsus xizmat", category: "Package", duration: 60, price: 150000, isActive: true },
        ],
        staff: [],
        rating: 4.8,
        reviewCount: 124,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2024-01-01"),
    },
    {
        id: "fake-2",
        ownerId: "fake-owner-2",
        name: "G'uncha Go'zallik Saloni",
        description: "Ayollar uchun barcha turdagi go'zallik xizmatlari.",
        category: "beauty-spas",
        subcategories: ["makeup", "hair-salons"],
        priceRange: "$$",
        address: {
            street: "Amir Temur 45",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100000",
            neighborhood: "Yunusobod",
        },
        location: {
            lat: 41.355831,
            lng: 69.283842,
        },
        contact: {
            phone: "+998903334455",
            email: "info@guncha.uz",
        },
        hours: {
            monday: { open: "09:00", close: "19:00", closed: false },
            tuesday: { open: "09:00", close: "19:00", closed: false },
            wednesday: { open: "09:00", close: "19:00", closed: false },
            thursday: { open: "09:00", close: "19:00", closed: false },
            friday: { open: "09:00", close: "19:00", closed: false },
            saturday: { open: "09:00", close: "18:00", closed: false },
            sunday: { open: "00:00", close: "00:00", closed: true },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: false,
            byAppointmentOnly: true,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: false,
            outdoorSeating: false,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800"
        ],
        services: [
            { id: "svc-fake-2-1", businessId: "fake-2", name: "Makiyaj", description: "Kundalik va kechki makiyaj", category: "Makeup", duration: 45, price: 200000, isActive: true },
            { id: "svc-fake-2-2", businessId: "fake-2", name: "Soch turmaklash", description: "Bayramona soch turmaklari", category: "Hair", duration: 60, price: 150000, isActive: true },
            { id: "svc-fake-2-3", businessId: "fake-2", name: "Manikyur", description: "Gel-lak bilan manikyur", category: "Nails", duration: 90, price: 120000, isActive: true },
        ],
        staff: [],
        rating: 4.9,
        reviewCount: 89,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2024-02-01"),
    },
    {
        id: "fake-3",
        ownerId: "fake-owner-3",
        name: "Lola SPA",
        description: "Dam olish va yosharish markazi. Massaj va parvarish.",
        category: "beauty-spas",
        subcategories: ["spa"],
        priceRange: "$$$",
        address: {
            street: "Oqqo'rg'on 12",
            city: "Toshkent",
            region: "Toshkent",
            postalCode: "100000",
            neighborhood: "Mirzo Ulugbek",
        },
        location: {
            lat: 41.325831,
            lng: 69.293842,
        },
        contact: {
            phone: "+998905556677",
            email: "info@lolaspa.uz",
        },
        hours: {
            monday: { open: "10:00", close: "22:00", closed: false },
            tuesday: { open: "10:00", close: "22:00", closed: false },
            wednesday: { open: "10:00", close: "22:00", closed: false },
            thursday: { open: "10:00", close: "22:00", closed: false },
            friday: { open: "10:00", close: "23:00", closed: false },
            saturday: { open: "10:00", close: "23:00", closed: false },
            sunday: { open: "10:00", close: "22:00", closed: false },
        },
        amenities: {
            acceptsCreditCards: true,
            freeWifi: true,
            wheelchairAccessible: true,
            goodForKids: false,
            byAppointmentOnly: true,
            acceptsApplePay: true,
            militaryDiscount: false,
            parking: true,
            outdoorSeating: true,
            genderNeutralRestrooms: true,
            reservations: true,
            delivery: false,
            takeout: false,
        },
        photos: [
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
            "https://images.unsplash.com/photo-1519823551278-64ac927ac4fb?w=800"
        ],
        services: [
            { id: "svc-fake-3-1", businessId: "fake-3", name: "Massaj", description: "Klassik va davolovchi massaj", category: "Massage", duration: 60, price: 250000, isActive: true },
            { id: "svc-fake-3-2", businessId: "fake-3", name: "Yuz parvarishi", description: "Tozalash va oziqlantirish", category: "Facial", duration: 60, price: 300000, isActive: true },
            { id: "svc-fake-3-3", businessId: "fake-3", name: "Aromaterapiya", description: "Xushbo'y moylar bilan muolaja", category: "Spa", duration: 45, price: 200000, isActive: true },
        ],
        staff: [],
        rating: 5.0,
        reviewCount: 45,
        verified: true,
        verifiedLicense: true,
        createdAt: new Date("2024-03-01"),
    },
];

// Mock Service Bookings
export const mockBookings: ServiceBooking[] = [
    {
        id: "booking-1",
        businessId: "biz-2",
        businessName: "Glamour Hair",
        serviceId: "svc-3",
        serviceName: "Ayollar soch turmagi",
        customerId: "owner-1",
        customerName: "Belleza Studio",
        customerPhone: "+998901234567",
        date: new Date("2025-01-25"),
        time: "14:00",
        status: "confirmed",
        price: 80000,
        notes: "Qisqa soch turmagi",
        createdAt: new Date("2025-01-18"),
    },
];

// Mock Business Promotions
export const mockBusinessPromotions: BusinessPromotion[] = [
    {
        id: "biz-promo-1",
        businessId: "biz-1",
        businessName: "Belleza Studio",
        salonId: "1",
        salonName: "Belleza Studio",
        serviceName: "Erkaklar soch turmagi",
        serviceDescription: "Professional barber xizmati - bepul sinab ko'ring!",
        originalPrice: 50000,
        imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop",
        startsAt: "2024-12-01",
        endsAt: "2025-01-15",
        isActive: false,
        lotteryEnabled: false,
        entryDeadline: null,
        winnerSelectionDate: null,
        totalWinners: 0,
        currentEntries: 0,
        reviewDeadlineHours: 48,
        slotsAvailable: 10,
        slotsUsed: 847,
        approvalStatus: {
            status: "approved",
            submittedAt: new Date("2024-11-25"),
            reviewedAt: new Date("2024-11-26"),
            reviewedBy: "admin-1",
        },
        createdBy: "owner-1",
        createdAt: new Date("2024-11-25"),
    },
    {
        id: "biz-promo-2",
        businessId: "biz-1",
        businessName: "Belleza Studio",
        salonId: "1",
        salonName: "Belleza Studio",
        serviceName: "Bepul xizmatlar",
        serviceDescription: "Sinab ko'ring va fikr qoldiring - professional xizmatlarni bepul tajriba qiling!",
        originalPrice: 0,
        imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
        startsAt: "2025-01-20",
        endsAt: "2025-03-20",
        isActive: true,
        lotteryEnabled: false,
        entryDeadline: null,
        winnerSelectionDate: null,
        totalWinners: 0,
        currentEntries: 0,
        reviewDeadlineHours: 48,
        slotsAvailable: 50,
        slotsUsed: 0,
        approvalStatus: {
            status: "approved",
            submittedAt: new Date("2025-01-19"),
            reviewedAt: new Date("2025-01-20"),
            reviewedBy: "admin-1",
        },
        createdBy: "owner-1",
        createdAt: new Date("2025-01-19"),
    },
];

// Mock Promotion Approvals
export const mockPromotionApprovals: PromotionApproval[] = [];

// Helper Functions

export function getBusinessById(id: string): Business | undefined {
    return mockBusinesses.find((b) => b.id === id);
}

export function getBusinessByOwnerId(ownerId: string): Business | undefined {
    return mockBusinesses.find((b) => b.ownerId === ownerId);
}

export function getBookingsByCustomerId(customerId: string): ServiceBooking[] {
    return mockBookings.filter((b) => b.customerId === customerId);
}

export function getPromotionsByBusinessId(businessId: string): BusinessPromotion[] {
    return mockBusinessPromotions.filter((p) => p.businessId === businessId);
}

export function createBooking(booking: ServiceBooking): void {
    mockBookings.push(booking);
}

export function cancelBooking(bookingId: string, reason: string): void {
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) {
        booking.status = "cancelled";
        booking.cancelledAt = new Date();
        booking.cancellationReason = reason;
    }
}

export function createPromotion(promotion: BusinessPromotion): void {
    mockBusinessPromotions.push(promotion);
}

export function submitPromotionForApproval(promotionId: string): void {
    const promotion = mockBusinessPromotions.find((p) => p.id === promotionId);
    if (promotion) {
        promotion.approvalStatus.status = "pending_approval";
        promotion.approvalStatus.submittedAt = new Date();

        // Create approval record
        const approval: PromotionApproval = {
            id: `approval-${Date.now()}`,
            promotionId: promotion.id,
            businessId: promotion.businessId,
            submittedAt: new Date(),
            status: "pending",
        };
        mockPromotionApprovals.push(approval);
    }
}

export function approvePromotion(promotionId: string, adminId: string): void {
    const promotion = mockBusinessPromotions.find((p) => p.id === promotionId);
    const approval = mockPromotionApprovals.find((a) => a.promotionId === promotionId);

    if (promotion && approval) {
        promotion.approvalStatus.status = "approved";
        promotion.approvalStatus.reviewedAt = new Date();
        promotion.approvalStatus.reviewedBy = adminId;

        approval.status = "approved";
        approval.reviewedAt = new Date();
        approval.reviewedBy = adminId;
    }
}

export function rejectPromotion(promotionId: string, adminId: string, reason: string): void {
    const promotion = mockBusinessPromotions.find((p) => p.id === promotionId);
    const approval = mockPromotionApprovals.find((a) => a.promotionId === promotionId);

    if (promotion && approval) {
        promotion.approvalStatus.status = "rejected";
        promotion.approvalStatus.reviewedAt = new Date();
        promotion.approvalStatus.reviewedBy = adminId;
        promotion.approvalStatus.rejectionReason = reason;

        approval.status = "rejected";
        approval.reviewedAt = new Date();
        approval.reviewedBy = adminId;
        approval.rejectionReason = reason;
    }
}
