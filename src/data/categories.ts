export interface Category {
    id: string;
    nameUz: string;
    nameRu: string;
    icon: string;
    subcategories: Subcategory[];
    color?: string;
}

export interface Subcategory {
    id: string;
    nameUz: string;
    nameRu: string;
    categoryId: string;
}

export const categories: Category[] = [
    {
        id: "restaurants",
        nameUz: "Restoranlar",
        nameRu: "Рестораны",
        icon: "utensils",
        color: "#FF6B6B",
        subcategories: [
            { id: "takeout", nameUz: "Olib ketish", nameRu: "На вынос", categoryId: "restaurants" },
            { id: "delivery", nameUz: "Yetkazib berish", nameRu: "Доставка", categoryId: "restaurants" },
            { id: "hot-trendy", nameUz: "Trenddagi joylar", nameRu: "Популярные", categoryId: "restaurants" },
            { id: "new-restaurants", nameUz: "Yangi restoranlar", nameRu: "Новые рестораны", categoryId: "restaurants" },
            { id: "breakfast-brunch", nameUz: "Nonushta va Brunch", nameRu: "Завтрак и бранч", categoryId: "restaurants" },
            { id: "lunch", nameUz: "Tushlik", nameRu: "Обед", categoryId: "restaurants" },
            { id: "dinner", nameUz: "Kechki ovqat", nameRu: "Ужин", categoryId: "restaurants" },
            { id: "coffee-cafes", nameUz: "Qahva va Kafelar", nameRu: "Кофе и кафе", categoryId: "restaurants" },
            { id: "pizza", nameUz: "Pitsa", nameRu: "Пицца", categoryId: "restaurants" },
            { id: "chinese", nameUz: "Xitoy taomlari", nameRu: "Китайская кухня", categoryId: "restaurants" },
            { id: "mexican", nameUz: "Meksika taomlari", nameRu: "Мексиканская кухня", categoryId: "restaurants" },
            { id: "bakeries", nameUz: "Novvoyxonalar", nameRu: "Пекарни", categoryId: "restaurants" },
            { id: "italian", nameUz: "Italyan taomlari", nameRu: "Итальянская кухня", categoryId: "restaurants" },
            { id: "food-trucks", nameUz: "Food Truck", nameRu: "Фуд-траки", categoryId: "restaurants" },
            { id: "sports-bars", nameUz: "Sport barlar", nameRu: "Спорт-бары", categoryId: "restaurants" },
        ],
    },
    {
        id: "home-services",
        nameUz: "Uy va Bog'",
        nameRu: "Дом и сад",
        icon: "home",
        color: "#16A085",
        subcategories: [
            { id: "contractors", nameUz: "Pudratchilar", nameRu: "Подрядчики", categoryId: "home-services" },
            { id: "plumbers", nameUz: "Santexniklar", nameRu: "Сантехники", categoryId: "home-services" },
            { id: "electricians", nameUz: "Elektriklar", nameRu: "Электрики", categoryId: "home-services" },
            { id: "heating-air", nameUz: "Isitish va konditsioner", nameRu: "Отопление и кондиционирование", categoryId: "home-services" },
            { id: "appliances", nameUz: "Maishiy texnika ta'miri", nameRu: "Ремонт бытовой техники", categoryId: "home-services" },
            { id: "roofing", nameUz: "Tom yopish", nameRu: "Кровельные работы", categoryId: "home-services" },
            { id: "locksmiths", nameUz: "Qulf ustalari", nameRu: "Слесари", categoryId: "home-services" },
            { id: "painters", nameUz: "Bo'yoqchilar", nameRu: "Маляры", categoryId: "home-services" },
            { id: "landscaping", nameUz: "Landshaft dizayni", nameRu: "Ландшафтный дизайн", categoryId: "home-services" },
            { id: "nurseries", nameUz: "Ko'chatxonalar", nameRu: "Питомники", categoryId: "home-services" },
            { id: "florists", nameUz: "Floristlar", nameRu: "Флористы", categoryId: "home-services" },
            { id: "tree-services", nameUz: "Daraxt xizmatlari", nameRu: "Услуги по деревьям", categoryId: "home-services" },
            { id: "home-cleaning", nameUz: "Uy tozalash", nameRu: "Уборка дома", categoryId: "home-services" },
            { id: "furniture", nameUz: "Mebel do'konlari", nameRu: "Мебельные магазины", categoryId: "home-services" },
            { id: "movers", nameUz: "Yuk tashish", nameRu: "Перевозки", categoryId: "home-services" },
            { id: "real-estate", nameUz: "Ko'chmas mulk", nameRu: "Недвижимость", categoryId: "home-services" },
        ],
    },
    {
        id: "automotive",
        nameUz: "Avtomobil xizmatlari",
        nameRu: "Автосервис",
        icon: "car",
        color: "#3498DB",
        subcategories: [
            { id: "auto-repair", nameUz: "Avto ta'mirlash", nameRu: "Ремонт авто", categoryId: "automotive" },
            { id: "body-shops", nameUz: "Kuzov ishlari", nameRu: "Кузовные работы", categoryId: "automotive" },
            { id: "oil-change", nameUz: "Moy almashtirish", nameRu: "Замена масла", categoryId: "automotive" },
            { id: "tires", nameUz: "Shinalar", nameRu: "Шины", categoryId: "automotive" },
            { id: "towing", nameUz: "Evakuator", nameRu: "Эвакуатор", categoryId: "automotive" },
            { id: "car-wash", nameUz: "Avtomoyka", nameRu: "Автомойка", categoryId: "automotive" },
            { id: "auto-detailing", nameUz: "Deteyling", nameRu: "Детейлинг", categoryId: "automotive" },
            { id: "parking", nameUz: "Avtoturargohlar", nameRu: "Парковки", categoryId: "automotive" },
            { id: "car-dealers", nameUz: "Avtosalonlar", nameRu: "Автосалоны", categoryId: "automotive" },
            { id: "junkyards", nameUz: "Ehtiyot qismlar bozorlari", nameRu: "Авторазборки", categoryId: "automotive" },
        ],
    },
    {
        id: "health-beauty",
        nameUz: "Sog'liq va Go'zallik",
        nameRu: "Здоровье и красота",
        icon: "heart-pulse",
        color: "#E91E63",
        subcategories: [
            { id: "dentists", nameUz: "Stomatologlar", nameRu: "Стоматологи", categoryId: "health-beauty" },
            { id: "doctors", nameUz: "Shifokorlar", nameRu: "Врачи", categoryId: "health-beauty" },
            { id: "chiropractors", nameUz: "Chiropraktorlar", nameRu: "Хиропрактики", categoryId: "health-beauty" },
            { id: "optometrists", nameUz: "Okulistlar", nameRu: "Окулисты", categoryId: "health-beauty" },
            { id: "dermatologists", nameUz: "Dermatologlar", nameRu: "Дерматологи", categoryId: "health-beauty" },
            { id: "podiatrists", nameUz: "Podiatrs", nameRu: "Подиатры", categoryId: "health-beauty" },
            { id: "massage", nameUz: "Massaj", nameRu: "Массаж", categoryId: "health-beauty" },
            { id: "hair-salons", nameUz: "Sartaroshxonalar", nameRu: "Парикмахерские", categoryId: "health-beauty" },
            { id: "nail-salons", nameUz: "Manikyur", nameRu: "Маникюр", categoryId: "health-beauty" },
            { id: "barbers", nameUz: "Barbershoplar", nameRu: "Барбершопы", categoryId: "health-beauty" },
            { id: "spas", nameUz: "SPA", nameRu: "СПА", categoryId: "health-beauty" },
            { id: "physical-therapy", nameUz: "Fizioterapiya", nameRu: "Физиотерапия", categoryId: "health-beauty" },
            { id: "gyms", nameUz: "Sport zallari", nameRu: "Спортзалы", categoryId: "health-beauty" },
        ],
    },
    {
        id: "travel-activities",
        nameUz: "Sayohat va Faoliyat",
        nameRu: "Путешествия и развлечения",
        icon: "plane",
        color: "#9B59B6",
        subcategories: [
            { id: "things-to-do", nameUz: "Ko'ngilochar joylar", nameRu: "Развлечения", categoryId: "travel-activities" },
            { id: "kids-activities", nameUz: "Bolalar uchun", nameRu: "Для детей", categoryId: "travel-activities" },
            { id: "venues", nameUz: "Tadbirlar zallari", nameRu: "Площадки для мероприятий", categoryId: "travel-activities" },
            { id: "churches", nameUz: "Diniy joylar", nameRu: "Религиозные места", categoryId: "travel-activities" },
            { id: "shopping-malls", nameUz: "Savdo markazlari", nameRu: "Торговые центры", categoryId: "travel-activities" },
            { id: "bookstores", nameUz: "Kitob do'konlari", nameRu: "Книжные магазины", categoryId: "travel-activities" },
            { id: "mini-golf", nameUz: "Mini golf", nameRu: "Мини-гольф", categoryId: "travel-activities" },
            { id: "bowling", nameUz: "Bouling", nameRu: "Боулинг", categoryId: "travel-activities" },
            { id: "hotels", nameUz: "Mehmonxonalar", nameRu: "Отели", categoryId: "travel-activities" },
            { id: "taxis", nameUz: "Taksi", nameRu: "Такси", categoryId: "travel-activities" },
            { id: "bike-rentals", nameUz: "Velosiped ijarasi", nameRu: "Прокат велосипедов", categoryId: "travel-activities" },
            { id: "campgrounds", nameUz: "Kemping", nameRu: "Кемпинги", categoryId: "travel-activities" },
            { id: "beaches", nameUz: "Plyajlar", nameRu: "Пляжи", categoryId: "travel-activities" },
            { id: "pools", nameUz: "Basseynlar", nameRu: "Бассейны", categoryId: "travel-activities" },
            { id: "bars-nightlife", nameUz: "Bar va Tungi hayot", nameRu: "Бары и ночная жизнь", categoryId: "travel-activities" },
        ],
    },
    {
        id: "shopping",
        nameUz: "Xaridlar",
        nameRu: "Шоппинг",
        icon: "shopping-bag",
        color: "#4ECDC4",
        subcategories: [
            { id: "clothing", nameUz: "Kiyim-kechak", nameRu: "Одежда", categoryId: "shopping" },
            { id: "electronics", nameUz: "Elektronika", nameRu: "Электроника", categoryId: "shopping" },
            { id: "jewelry", nameUz: "Zargarlik buyumlari", nameRu: "Ювелирные изделия", categoryId: "shopping" },
        ],
    },
    {
        id: "more",
        nameUz: "Boshqalar",
        nameRu: "Другое",
        icon: "list",
        color: "#95A5A6",
        subcategories: [
            { id: "pets", nameUz: "Uy hayvonlari", nameRu: "Домашние животные", categoryId: "more" },
            { id: "public-services", nameUz: "Davlat xizmatlari", nameRu: "Госуслуги", categoryId: "more" },
            { id: "financial", nameUz: "Moliya", nameRu: "Финансы", categoryId: "more" },
            { id: "education", nameUz: "Ta'lim", nameRu: "Образование", categoryId: "more" },
            { id: "mass-media", nameUz: "OAV", nameRu: "СМИ", categoryId: "more" },
        ]
    }
];

export const getCategoryById = (id: string): Category | undefined => {
    return categories.find((cat) => cat.id === id);
};

export const getSubcategoriesByCategory = (categoryId: string): Subcategory[] => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.subcategories || [];
};

export const getAllSubcategories = (): Subcategory[] => {
    return categories.flatMap((cat) => cat.subcategories);
};
