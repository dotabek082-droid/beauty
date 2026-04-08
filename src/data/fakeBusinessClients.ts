export interface ClientBooking {
  id: string;
  date: string;
  service: string;
  price: number;
  status: "completed" | "upcoming" | "cancelled" | "draft";
  paymentMethod: "cash" | "card" | "coin";
  rating?: number; // 1-5 stars (optional, only for completed)
  review?: string; // Client's feedback (optional)
}

export interface BusinessClient {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  totalVisits: number;
  lastVisit: string | null;
  upcomingAppointments: ClientBooking[];
  pastBookings: ClientBooking[];
  servicesUsed: string[];
  totalSpent: number;
  joinedDate: string;
  isManual?: boolean;
}

export const fakeBusinessClients: BusinessClient[] = [
  {
    id: "1",
    userId: "user-1",
    fullName: "Malika Karimova",
    phone: "+998 90 123 45 67",
    avatarUrl: null,
    totalVisits: 8,
    lastVisit: "2026-01-28",
    upcomingAppointments: [
      { id: "bk-1", date: "2026-02-05T10:00:00", service: "Soch turmaklash", price: 150000, status: "upcoming", paymentMethod: "card" }
    ],
    pastBookings: [
      { id: "bk-2", date: "2026-01-28T14:30:00", service: "Soch boyash", price: 200000, status: "completed", paymentMethod: "card", rating: 5, review: "Juda yaxshi xizmat! Rangga juda mamnunman, rahmat!" },
      { id: "bk-3", date: "2026-01-15T11:00:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "cash", rating: 5, review: "Soch stilisti professional, natijaga mamnun." },
      { id: "bk-4", date: "2026-01-02T15:45:00", service: "Manikur", price: 80000, status: "completed", paymentMethod: "coin", rating: 4, review: "Yaxshi xizmat, toza va professional." },
      { id: "bk-5", date: "2025-12-20T09:30:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "cash", rating: 5, review: "Har doim bu yerga boraman, zo'r usta!" },
      { id: "bk-6", date: "2025-12-10T16:00:00", service: "Pedikur", price: 100000, status: "completed", paymentMethod: "card" }
    ],
    servicesUsed: ["Soch turmaklash", "Soch boyash", "Manikur", "Pedikur"],
    totalSpent: 830000,
    joinedDate: "2025-10-15"
  },
  {
    id: "2",
    userId: "user-2",
    fullName: "Nodira Alimova",
    phone: "+998 91 234 56 78",
    avatarUrl: null,
    totalVisits: 5,
    lastVisit: "2026-02-01",
    upcomingAppointments: [
      { id: "bk-7", date: "2026-02-08T13:00:00", service: "Manikur", price: 80000, status: "upcoming", paymentMethod: "cash" },
      { id: "bk-8", date: "2026-02-08T13:00:00", service: "Pedikur", price: 100000, status: "upcoming", paymentMethod: "cash" }
    ],
    pastBookings: [
      { id: "bk-9", date: "2026-02-01T10:15:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "coin", rating: 4, review: "Coin bilan to'lov qulaydi, xizmat yoqdi." },
      { id: "bk-10", date: "2026-01-18T12:30:00", service: "Manikur", price: 80000, status: "completed", paymentMethod: "cash", rating: 5, review: "A'lo darajada!" },
      { id: "bk-11", date: "2026-01-05T14:00:00", service: "Soch boyash", price: 200000, status: "completed", paymentMethod: "card", rating: 5, review: "Juda yoqdi, rang ajoyib chiqdi!" }
    ],
    servicesUsed: ["Soch turmaklash", "Soch boyash", "Manikur", "Pedikur"],
    totalSpent: 610000,
    joinedDate: "2025-11-20"
  },
  {
    id: "3",
    userId: "user-3",
    fullName: "Dilnoza Toshmatova",
    phone: "+998 93 345 67 89",
    avatarUrl: null,
    totalVisits: 12,
    lastVisit: "2026-01-30",
    upcomingAppointments: [],
    pastBookings: [
      { id: "bk-12", date: "2026-01-30T11:30:00", service: "Faciyal", price: 120000, status: "completed", paymentMethod: "coin", rating: 5, review: "Yuzim yangilangandek bo'ldi, rahmat!" },
      { id: "bk-13", date: "2026-01-23T15:00:00", service: "Manikur", price: 80000, status: "completed", paymentMethod: "card", rating: 4, review: "Yaxshi, lekin biroz kutib qoldim." },
      { id: "bk-14", date: "2026-01-16T10:45:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "cash", rating: 5, review: "Zo'r!" },
      { id: "bk-15", date: "2026-01-09T13:15:00", service: "Faciyal", price: 120000, status: "completed", paymentMethod: "coin", rating: 5, review: "Har doimgidek a'lo darajada." }
    ],
    servicesUsed: ["Soch turmaklash", "Manikur", "Faciyal"],
    totalSpent: 1440000,
    joinedDate: "2025-08-10"
  },
  {
    id: "4",
    userId: "user-4",
    fullName: "Shahlo Nabiyeva",
    phone: "+998 94 456 78 90",
    avatarUrl: null,
    totalVisits: 3,
    lastVisit: "2026-01-25",
    upcomingAppointments: [
      { id: "bk-16", date: "2026-02-10T11:00:00", service: "Soch boyash", price: 200000, status: "upcoming", paymentMethod: "card" }
    ],
    pastBookings: [
      { id: "bk-17", date: "2026-01-25T14:30:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "cash", rating: 5, review: "Birinchi marta keldim, juda yoqdi." },
      { id: "bk-18", date: "2026-01-12T09:00:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "card", rating: 4, review: "Yomon emas." }
    ],
    servicesUsed: ["Soch turmaklash", "Soch boyash"],
    totalSpent: 500000,
    joinedDate: "2025-12-28"
  },
  {
    id: "5",
    userId: "user-5",
    fullName: "Gulnora Rahimova",
    phone: "+998 95 567 89 01",
    avatarUrl: null,
    totalVisits: 6,
    lastVisit: "2026-02-02",
    upcomingAppointments: [
      { id: "bk-19", date: "2026-02-15T12:00:00", service: "Manikur", price: 80000, status: "upcoming", paymentMethod: "coin" }
    ],
    pastBookings: [
      { id: "bk-20", date: "2026-02-02T16:30:00", service: "Pedikur", price: 100000, status: "completed", paymentMethod: "card", rating: 5, review: "Rahmat, oyoqlarim yengil bo'lib qoldi." },
      { id: "bk-21", date: "2026-01-22T10:00:00", service: "Manikur", price: 80000, status: "completed", paymentMethod: "coin", rating: 5, review: "Dizayn juda chiroyli chiqdi!" },
      { id: "bk-22", date: "2026-01-10T13:45:00", service: "Soch turmaklash", price: 150000, status: "completed", paymentMethod: "cash", rating: 4, review: "Yaxshi." },
      { id: "bk-23", date: "2025-12-28T11:15:00", service: "Manikur", price: 80000, status: "completed", paymentMethod: "cash" },
      { id: "bk-24", date: "2025-12-15T14:45:00", service: "Pedikur", price: 100000, status: "completed", paymentMethod: "card", rating: 5, review: "Eng yaxshi salon!" }
    ],
    servicesUsed: ["Soch turmaklash", "Manikur", "Pedikur"],
    totalSpent: 590000,
    joinedDate: "2025-11-01"
  }
];

