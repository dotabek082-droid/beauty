export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'feature';
    target: 'all' | 'client' | 'business' | 'admin'; // Added 'admin'
    date: string;
    read?: boolean;
    image_url?: string;
}

// Initial Mock Data
export const mockNews: NewsItem[] = [
    {
        id: 'news-1',
        title: 'Yangi: Tangalar sovg\'a qiling! 🎁',
        summary: 'Endi do\'stlaringizga tangalar yuborishingiz mumkin.',
        content: 'Biz yangi funksiyani ishga tushirdik! Endi siz to\'plagan tangalaringizni do\'stlaringizga sovg\'a qilishingiz mumkin. "Hamyon" bo\'limiga o\'ting va "Sovg\'a qilish" tugmasini bosing.',
        type: 'feature',
        target: 'client', // Changed to client based on content ("do'stlaringizga")
        date: '2026-02-10',
        image_url: 'https://images.unsplash.com/photo-1512909481869-0eaa1e9817ba?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'news-2',
        title: 'Texnik ishlar 🛠️',
        summary: '15-Fevral kuni tizimda profilaktika ishlari olib boriladi.',
        content: 'Hurmatli foydalanuvchilar, 15-Fevral kuni soat 03:00 dan 05:00 gacha tizimda texnik ishlar olib borilishi sababli uzilishlar kuzatilishi mumkin. Keltirilgan noqulayliklar uchun uzr so\'raymiz.',
        type: 'warning',
        target: 'all',
        date: '2026-02-09'
    },
    {
        id: 'news-3',
        title: 'Biznesingizni rivojlantiring 📈',
        summary: 'Yangi statistika vositalari qo\'shildi.',
        content: 'Biznes egalari uchun yangi "Statistika" bo\'limi ishga tushdi. Endi siz mijozlaringiz faolligini va daromadlaringizni batafsil tahlil qilishingiz mumkin.',
        type: 'feature',
        target: 'business',
        date: '2026-02-05'
    },
    {
        id: 'news-4',
        title: 'Admin Paneli Yangilanishi 🛡️',
        summary: 'Yangi foydalanuvchilarni boshqarish vositalari.',
        content: 'Adminlar uchun yangi foydalanuvchilarni bloklash va tekshirish vositalari qo\'shildi. Iltimos, yangi qoidalarni ko\'rib chiqing.',
        type: 'info',
        target: 'admin',
        date: '2026-02-11'
    },
    // FAKE DATA FOR TESTING
    {
        id: 'fake-business-1',
        title: 'Obuna Chegirmasi! 🏷️',
        summary: 'Business Pro obunasiga 20% chegirma.',
        content: 'Faqat shu hafta oxirigacha Business Pro yillik obunasini 20% chegirma bilan xarid qiling. Biznesingizni keyingi bosqichga olib chiqing!',
        type: 'success',
        target: 'business',
        date: '2026-02-12'
    },
    {
        id: 'fake-business-2',
        title: 'Top Xizmatlar Reytingi 📊',
        summary: 'Sizning "Soch kesish" xizmatiingiz top 10 talikka kirdi!',
        content: 'Tabriklaymiz! O\'tgan oy yakunlariga ko\'ra sizning xizmatlaringiz mijozlar tomonidan eng ko\'p tanlangan xizmatlar qatoridan joy oldi.',
        type: 'feature',
        target: 'business',
        date: '2026-02-11'
    },
    {
        id: 'fake-client-1',
        title: 'Yozgi Tuhfalar! ☀️',
        summary: 'Barcha salonlarda yozgi chegirmalar mavsumi.',
        content: 'Yozni go\'zal kutib oling! Hamkor salonlarimizda 30% gacha chegirmalar amal qilmoqda.',
        type: 'success',
        target: 'client',
        date: '2026-02-12'
    },
    {
        id: 'fake-client-2',
        title: 'Yangi Salon: "G\'uncha" 🌸',
        summary: 'Sizning hududingizda yangi go\'zallik saloni ochildi.',
        content: 'Chilonzor tumanida yangi "G\'uncha" go\'zallik saloni o\'z faoliyatini boshladi. Birinchi tashrif uchun 50% chegirma!',
        type: 'info',
        target: 'client',
        date: '2026-02-10'
    },
    {
        id: 'fake-all-1',
        title: 'Navro\'z Muborak! 🌱',
        summary: 'Yangi kun, yangi imkoniyatlar.',
        content: 'Barcha yurtdoshlarimizni Navro\'z ayyomi bilan muborakbod etamiz! Bayram munosabati bilan tizimda bayramona chegirmalar e\'lon qilinadi.',
        type: 'feature',
        target: 'all',
        date: '2026-03-21'
    }
];
export const getNews = (): NewsItem[] => {
    const stored = localStorage.getItem('system_news');
    if (stored) {
        const storedNews = JSON.parse(stored) as NewsItem[];
        // Merge mockNews with storedNews:
        // 1. Keep all items from mockNews (server truth)
        // 2. Keep "read" status from storedNews if available
        // 3. Keep any user-created items from storedNews (if any)

        const mergedNews = mockNews.map(mockItem => {
            const existing = storedNews.find(s => s.id === mockItem.id);
            return existing ? { ...mockItem, read: existing.read } : mockItem;
        });

        // If we allowed user-created system news locally, we would append them here.
        // For now, we assume mockNews is the single source of truth for "System News".

        // Update storage to sync
        localStorage.setItem('system_news', JSON.stringify(mergedNews));
        return mergedNews;
    }
    // Initialize if empty
    localStorage.setItem('system_news', JSON.stringify(mockNews));
    return mockNews;
};

// Add News
export const addNewsItem = (item: Omit<NewsItem, 'id' | 'date'>) => {
    const news = getNews();
    const newItem: NewsItem = {
        ...item,
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...news];
    localStorage.setItem('system_news', JSON.stringify(updated));
    return newItem;
};

// Update News
export const updateNewsItem = (id: string, updates: Partial<NewsItem>) => {
    const news = getNews();
    const updated = news.map(item => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem('system_news', JSON.stringify(updated));
};

// Delete News
export const deleteNewsItem = (id: string) => {
    const news = getNews();
    const updated = news.filter(item => item.id !== id);
    localStorage.setItem('system_news', JSON.stringify(updated));
};

// Get Single News
export const getNewsById = (id: string) => {
    const news = getNews();
    return news.find(item => item.id === id);
};
