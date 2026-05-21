export interface Promotion {
  id: string;
  salonId: string;
  salonName: string;
  serviceName: string;
  serviceDescription: string;
  originalPrice: number;
  imageUrl: string;
  slotsAvailable: number;
  slotsUsed: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;

  // Coin Economy
  ticketPrice: number; // Cost in coins to enter/register

  // Lottery System Fields
  lotteryEnabled: boolean; // true = lottery, false = direct booking
  entryDeadline: string | null; // When entries close
  winnerSelectionDate: string | null; // When winners will be selected
  totalWinners: number; // How many winners to select
  currentEntries: number; // How many people entered
  reviewDeadlineHours: number; // Hours after service to submit review (default: 48)
  qrRequired?: boolean;
  isCharity?: boolean;
  discountedPrice?: number;
  promotionType?: "regular" | "discount" | "lottery" | "charity" | "1+1";
}

export interface FeedbackQuestion {
  id: string;
  questionUz: string;
  questionRu: string;
  questionOrder: number;
}

// Mock data
// Mock data
export const mockPromotions: Promotion[] = [
  // 0. ACTIVE Lottery Promotion (Samsung Galaxy S25 Ultra) — currently open for registration
  {
    id: "promo-lottery-active",
    salonId: "biz-1",
    salonName: "Belleza Studio",
    serviceName: "Samsung Galaxy S25 Ultra Yutib Oling!",
    serviceDescription: "Katta sovg'a o'yini! Har bir ishtirokchi Samsung Galaxy S25 Ultra yutib olish imkoniyatiga ega. Hoziroq ro'yxatdan o'ting!",
    originalPrice: 18000000, // Value of the prize
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    slotsAvailable: 2000,
    slotsUsed: 312,
    startsAt: "2026-05-01",
    endsAt: "2026-06-15",
    isActive: true,
    ticketPrice: 300, // Entry fee in coins
    lotteryEnabled: true,
    entryDeadline: "2026-06-15",
    winnerSelectionDate: "2026-06-20",
    totalWinners: 2,
    currentEntries: 312,
    reviewDeadlineHours: 48,
    promotionType: "lottery"
  },

  // 1. Lottery Promotion (Win an iPhone) — EXPIRED
  // Logic: User pays ticketPrice (500 coins) to enter. Winner gets item for free.
  {
    id: "promo-lottery-1",
    salonId: "biz-1",
    salonName: "Belleza Studio",
    serviceName: "iPhone 15 Pro Max Yutib Oling!",
    serviceDescription: "O'zbekiston bo'ylab eng katta yutuqli o'yin! Barcha xizmatlarimiz mijozlari uchun.",
    originalPrice: 15000000, // Value of the prize
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    slotsAvailable: 1000,
    slotsUsed: 450,
    startsAt: "2026-01-15",
    endsAt: "2026-03-01",
    isActive: true,
    ticketPrice: 500, // Entry fee
    lotteryEnabled: true,
    entryDeadline: "2026-02-28",
    winnerSelectionDate: "2026-03-02",
    totalWinners: 1,
    currentEntries: 450,
    reviewDeadlineHours: 48,
    promotionType: "lottery"
  },

  // 2. Discount Promotion (Chegirma)
  // Logic: Direct booking at a discounted price.
  {
    id: "promo-discount-1",
    salonId: "biz-1",
    salonName: "Belleza Studio",
    serviceName: "Soch Bo'yash -30%",
    serviceDescription: "Faqat shu hafta! L'Oreal bo'yoqlari bilan soch bo'yash xizmatiga maxsus chegirma.",
    originalPrice: 450000,
    discountedPrice: 315000,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
    slotsAvailable: 20,
    slotsUsed: 8,
    startsAt: "2026-01-27",
    endsAt: "2026-02-05",
    isActive: true,
    ticketPrice: 0,
    lotteryEnabled: false,
    entryDeadline: null,
    winnerSelectionDate: null,
    totalWinners: 0,
    currentEntries: 0,
    reviewDeadlineHours: 24,
    promotionType: "discount"
  },

  // 3. Free Service (Bepul)
  // Logic: Limited slots for a free service (e.g., model for training or promo).
  {
    id: "promo-free-1",
    salonId: "biz-1",
    salonName: "Belleza Studio",
    serviceName: "Manikyur + Gel Lak",
    serviceDescription: "Yangi usta uchun model kerak. Xizmat mutlaqo bepul!",
    originalPrice: 120000,
    discountedPrice: 0, // Explicitly 0 for free
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    slotsAvailable: 5,
    slotsUsed: 4,
    startsAt: "2026-01-28",
    endsAt: "2026-01-30",
    isActive: true,
    ticketPrice: 0,
    lotteryEnabled: false,
    entryDeadline: null,
    winnerSelectionDate: null,
    totalWinners: 0,
    currentEntries: 0,
    reviewDeadlineHours: 24,
    promotionType: "regular" // Treated as 'free' due to price 0
  },

  // 4. Finished Lottery (For Winner History)
  {
    id: "promo-lottery-finished",
    salonId: "biz-1",
    salonName: "Belleza Studio",
    serviceName: "Dyson Airwrap",
    serviceDescription: "Yangi Yil sovg'asi! Dyson fenini yutib olish imkoniyati.",
    originalPrice: 6500000,
    imageUrl: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=300&fit=crop",
    slotsAvailable: 500,
    slotsUsed: 500,
    startsAt: "2025-12-01",
    endsAt: "2026-01-01",
    isActive: false,
    ticketPrice: 200,
    lotteryEnabled: true,
    entryDeadline: "2026-01-01",
    winnerSelectionDate: "2026-01-05",
    totalWinners: 3,
    currentEntries: 500,
    reviewDeadlineHours: 48,
    promotionType: "lottery"
  },

  // 5. 1+1 Promotion
  {
    id: "promo-1plus1",
    salonId: "biz-1",
    salonName: "Belleza Studio",
    serviceName: "1+1: Ota va O'g'il",
    serviceDescription: "Ota va o'g'il birga kelsa, o'g'il uchun xizmat bepul!",
    originalPrice: 100000,
    discountedPrice: 50000,
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b7f30d?w=400&h=300&fit=crop",
    slotsAvailable: 15,
    slotsUsed: 3,
    startsAt: "2026-02-10",
    endsAt: "2026-03-10",
    isActive: true,
    ticketPrice: 0,
    lotteryEnabled: false,
    entryDeadline: null,
    winnerSelectionDate: null,
    totalWinners: 0,
    currentEntries: 0,
    reviewDeadlineHours: 24,
    promotionType: "1+1" // Mapped to buy_one_get_one in backend usually, but here string literal is allowed by type
  }
];

export interface Winner {
  id: string;
  promotionId: string;
  userId: string;
  userName: string;
  userPhone: string;
  wonAt: string;
  status: 'pending' | 'served'; // pending = won but not served, served = business confirmed service
  feedbackGiven: boolean;
}

export const mockWinners: Winner[] = [
  {
    id: "win-1",
    promotionId: "promo-lottery-finished",
    userId: "user-101",
    userName: "Jamshid Aliyev",
    userPhone: "+998 90 123 45 67",
    wonAt: "2026-01-02T10:00:00",
    status: 'pending',
    feedbackGiven: false
  },
  {
    id: "win-2",
    promotionId: "promo-lottery-finished",
    userId: "user-102",
    userName: "Sardor Rahimov",
    userPhone: "+998 93 987 65 43",
    wonAt: "2026-01-02T10:05:00",
    status: 'served',
    feedbackGiven: true
  },
  {
    id: "win-3",
    promotionId: "promo-lottery-finished",
    userId: "user-103",
    userName: "Madina Karimova",
    userPhone: "+998 97 111 22 33",
    wonAt: "2026-01-02T10:10:00",
    status: 'pending',
    feedbackGiven: false
  }
];

export const FEEDBACK_QUESTIONS_BY_CATEGORY: Record<string, FeedbackQuestion[]> = {
  driver: [], // Placeholder
  hair: [
    { id: "q1", questionUz: "Sartaroshning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма парикмахера?", questionOrder: 1 },
    { id: "q2", questionUz: "Xizmat sifati sizni qoniqtirdimi?", questionRu: "Удовлетворило ли вас качество услуги?", questionOrder: 2 },
    { id: "q3", questionUz: "Salon tozaligi qanday edi?", questionRu: "Как была чистота салона?", questionOrder: 3 },
    { id: "q4", questionUz: "Xodimlar xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли персонал вежлив в общении?", questionOrder: 4 },
    { id: "q5", questionUz: "Kutish vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время ожидания приемлемым?", questionOrder: 5 },
    { id: "q6", questionUz: "Ishlatiladigan mahsulotlar sifati qanday edi?", questionRu: "Каково было качество используемых продуктов?", questionOrder: 6 },
    { id: "q7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "q8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "q9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "q10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  makeup: [
    { id: "m1", questionUz: "Vizajistning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма визажиста?", questionOrder: 1 },
    { id: "m2", questionUz: "Makiyaj sifati sizni qoniqtirdimi?", questionRu: "Удовлетворило ли вас качество макияжа?", questionOrder: 2 },
    { id: "m3", questionUz: "Ish joyi tozaligi qanday edi?", questionRu: "Как была чистота рабочего места?", questionOrder: 3 },
    { id: "m4", questionUz: "Xodimlar xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли персонал вежлив в общении?", questionOrder: 4 },
    { id: "m5", questionUz: "Jarayon vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время процедуры приемлемым?", questionOrder: 5 },
    { id: "m6", questionUz: "Ishlatiladigan kosmetika sifati qanday edi?", questionRu: "Каково было качество используемой косметики?", questionOrder: 6 },
    { id: "m7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "m8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "m9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "m10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  nails: [
    { id: "n1", questionUz: "Neyl-ustaning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма нейл-мастера?", questionOrder: 1 },
    { id: "n2", questionUz: "Manikyur/Pedikyur sifati sizni qoniqtirdimi?", questionRu: "Удовлетворило ли вас качество маникюра/педикюра?", questionOrder: 2 },
    { id: "n3", questionUz: "Asboblar sterilizatsiyasi va tozalik qanday edi?", questionRu: "Как была стерилизация инструментов и чистота?", questionOrder: 3 },
    { id: "n4", questionUz: "Usta xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли мастер вежлив в общении?", questionOrder: 4 },
    { id: "n5", questionUz: "Kutish vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время ожидания приемлемым?", questionOrder: 5 },
    { id: "n6", questionUz: "Ishlatiladigan laklar va materiallar sifati qanday edi?", questionRu: "Каково было качество используемых лаков и материалов?", questionOrder: 6 },
    { id: "n7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "n8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "n9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "n10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  spa: [
    { id: "s1", questionUz: "Massajchi/Mutaxassisning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма массажиста/специалиста?", questionOrder: 1 },
    { id: "s2", questionUz: "SPA muolajasi sifati sizni qoniqtirdimi?", questionRu: "Удовлетворило ли вас качество SPA-процедуры?", questionOrder: 2 },
    { id: "s3", questionUz: "Xona tozaligi va muhit (atmosfera) qanday edi?", questionRu: "Как была чистота комнаты и атмосфера?", questionOrder: 3 },
    { id: "s4", questionUz: "Xodimlar xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли персонал вежлив в общении?", questionOrder: 4 },
    { id: "s5", questionUz: "Kutish vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время ожидания приемлемым?", questionOrder: 5 },
    { id: "s6", questionUz: "Ishlatiladigan moylar va vositalar sifati qanday edi?", questionRu: "Каково было качество используемых масел и средств?", questionOrder: 6 },
    { id: "s7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "s8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "s9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "s10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  skincare: [
    { id: "sk1", questionUz: "Kosmetologning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма косметолога?", questionOrder: 1 },
    { id: "sk2", questionUz: "Yuz parvarishi natijasi sizni qoniqtirdimi?", questionRu: "Удовлетворил ли вас результат ухода за лицом?", questionOrder: 2 },
    { id: "sk3", questionUz: "Xona tozaligi va gigiyena qanday edi?", questionRu: "Как была чистота комнаты и гигиена?", questionOrder: 3 },
    { id: "sk4", questionUz: "Mutaxassis xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли специалист вежлив в общении?", questionOrder: 4 },
    { id: "sk5", questionUz: "Kutish vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время ожидания приемлемым?", questionOrder: 5 },
    { id: "sk6", questionUz: "Ishlatiladigan preparatlar sifati qanday edi?", questionRu: "Каково было качество используемых препаратов?", questionOrder: 6 },
    { id: "sk7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "sk8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "sk9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "sk10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  brows: [
    { id: "b1", questionUz: "Lash/Brow ustasining professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма мастера по ресницам/бровям?", questionOrder: 1 },
    { id: "b2", questionUz: "Qosh/Kiprik xizmati sifati sizni qoniqtirdimi?", questionRu: "Удовлетворило ли вас качество услуги для бровей/ресниц?", questionOrder: 2 },
    { id: "b3", questionUz: "Ish joyi tozaligi qanday edi?", questionRu: "Как была чистота рабочего места?", questionOrder: 3 },
    { id: "b4", questionUz: "Usta xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли мастер вежлив в общении?", questionOrder: 4 },
    { id: "b5", questionUz: "Jarayon vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время процедуры приемлемым?", questionOrder: 5 },
    { id: "b6", questionUz: "Ishlatiladigan materiallar sifati qanday edi?", questionRu: "Каково было качество используемых материалов?", questionOrder: 6 },
    { id: "b7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "b8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "b9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "b10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  wedding: [
    { id: "w1", questionUz: "Stilistlarning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма стилистов?", questionOrder: 1 },
    { id: "w2", questionUz: "Kelin obrazi sizni qoniqtirdimi?", questionRu: "Удовлетворил ли вас образ невесты?", questionOrder: 2 },
    { id: "w3", questionUz: "Salon tozaligi va qulayligi qanday edi?", questionRu: "Как была чистота и удобство салона?", questionOrder: 3 },
    { id: "w4", questionUz: "Jamoa xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли коллектив вежлив в общении?", questionOrder: 4 },
    { id: "w5", questionUz: "Tayyorgarlik vaqti rejadagidek bo'ldimi?", questionRu: "Прошло ли время подготовки по плану?", questionOrder: 5 },
    { id: "w6", questionUz: "Ishlatiladigan kosmetika va aksessuarlar sifati?", questionRu: "Качество используемой косметики и аксессуаров?", questionOrder: 6 },
    { id: "w7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "w8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "w9", questionUz: "Maxsus kun uchun bizni yana tanlagan bo'larmidingiz?", questionRu: "Выбрали бы вы нас снова для особого дня?", questionOrder: 9 },
    { id: "w10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
  default: [
    { id: "q1", questionUz: "Mutaxassisning professionallik darajasi qanday edi?", questionRu: "Каков был уровень профессионализма специалиста?", questionOrder: 1 },
    { id: "q2", questionUz: "Xizmat sifati sizni qoniqtirdimi?", questionRu: "Удовлетворило ли вас качество услуги?", questionOrder: 2 },
    { id: "q3", questionUz: "Salon tozaligi qanday edi?", questionRu: "Как была чистота салона?", questionOrder: 3 },
    { id: "q4", questionUz: "Xodimlar xushmuomalalik bilan munosabatda bo'ldimi?", questionRu: "Был ли персонал вежлив в общении?", questionOrder: 4 },
    { id: "q5", questionUz: "Kutish vaqti qabul qilinadigan darajada edimi?", questionRu: "Было ли время ожидания приемлемым?", questionOrder: 5 },
    { id: "q6", questionUz: "Ishlatiladigan mahsulotlar sifati qanday edi?", questionRu: "Каково было качество используемых продуктов?", questionOrder: 6 },
    { id: "q7", questionUz: "Narx-navo mos keladimi?", questionRu: "Соответствовала ли цена качеству?", questionOrder: 7 },
    { id: "q8", questionUz: "Salonning joylashuvi qulaymi?", questionRu: "Удобно ли расположен салон?", questionOrder: 8 },
    { id: "q9", questionUz: "Bu salonga yana kelasizmi?", questionRu: "Вернетесь ли вы в этот салон снова?", questionOrder: 9 },
    { id: "q10", questionUz: "Do'stlaringizga tavsiya qilasizmi?", questionRu: "Порекомендуете ли вы друзьям?", questionOrder: 10 },
  ],
};

export const mockFeedbackQuestions = FEEDBACK_QUESTIONS_BY_CATEGORY['default'];
