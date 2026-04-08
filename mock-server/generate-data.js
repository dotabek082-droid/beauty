
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, 'db.json');
const BOOKING_COUNT = 100; // Generate 100 bookings

const services = [
    { service_name: "Soch Turmaklash", salon_name: "Oltin Qaychi", salon_id: "salon-1", original_price: 150000, image_url: null },
    { service_name: "Manikur", salon_name: "G'uncha Go'zallik", salon_id: "salon-2", original_price: 80000, image_url: null },
    { service_name: "Yuz Tozalash", salon_name: "Lola SPA", salon_id: "salon-3", original_price: 250000, image_url: null },
    { service_name: "Pedikur", salon_name: "Nafis Style", salon_id: "salon-4", original_price: 90000, image_url: null },
    { service_name: "Makiyaj", salon_name: "Yulduz Vizaj", salon_id: "salon-5", original_price: 300000, image_url: null },
    { service_name: "Massaj", salon_name: "Relax Center", salon_id: "salon-6", original_price: 400000, image_url: null },
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateData = () => {
    const bookings = [];
    const trust_history = [];
    const now = new Date();

    // Initial Score
    trust_history.push({
        id: 'hist-init',
        date: '2025-01-01',
        points: 50,
        description: "Dastlabki ball",
        type: 'initial'
    });

    for (let i = 0; i < BOOKING_COUNT; i++) {
        const isHistory = Math.random() > 0.4;

        let status;
        let scheduledDate;

        if (isHistory) {
            status = getRandomElement(["completed", "cancelled", "no_show"]);
            const pastDays = getRandomInt(1, 60);
            const date = new Date(now);
            date.setDate(date.getDate() - pastDays);
            scheduledDate = date;
        } else {
            status = getRandomElement(["pending", "confirmed", "scheduled"]);
            const futureDays = getRandomInt(1, 30);
            const date = new Date(now);
            date.setDate(date.getDate() + futureDays);
            scheduledDate = date;
        }

        const bookedAt = new Date(scheduledDate);
        bookedAt.setDate(bookedAt.getDate() - getRandomInt(1, 5));

        const service = getRandomElement(services);
        const bookingId = `booking-${i + 1}`;

        bookings.push({
            id: bookingId,
            user_id: "current-user-id", // Matches the mock user ID logic or should be generic
            promotion_id: `promo-${getRandomInt(100, 999)}`,
            status: status,
            booked_at: bookedAt.toISOString(),
            scheduled_date: scheduledDate.toISOString().split('T')[0],
            scheduled_time: `${getRandomInt(9, 18)}:00`,
            completed_at: status === 'completed' ? scheduledDate.toISOString() : null,
            is_winner: Math.random() > 0.9,
            promotion: {
                id: `promo-detail-${i}`,
                ...service
            },
            has_feedback: status === 'completed' && Math.random() > 0.5
        });

        // Generate bindings for bookings (if needed) but user provided specific history
        // so we skipping auto-generated history for now to match their request exactly.
    }

    const fixedHistory = [
        { type: 'no_show', date: '2026-01-26', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'usage', date: '2026-01-24', points: 10, description: 'Xizmatdan foydalanish (Massaj)' },
        { type: 'no_show', date: '2026-01-22', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'no_show', date: '2026-01-21', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'cancel', date: '2026-01-21', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'usage', date: '2026-01-20', points: 10, description: 'Xizmatdan foydalanish (Pedikur)' },
        { type: 'review', date: '2026-01-20', points: 5, description: 'Ijobiy sharh qoldirish' },
        { type: 'no_show', date: '2026-01-15', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'usage', date: '2026-01-14', points: 10, description: 'Xizmatdan foydalanish (Manikur)' },
        { type: 'review', date: '2026-01-14', points: 5, description: 'Ijobiy sharh qoldirish' },
        { type: 'usage', date: '2026-01-13', points: 10, description: 'Xizmatdan foydalanish (Massaj)' },
        { type: 'usage', date: '2026-01-12', points: 10, description: 'Xizmatdan foydalanish (Makiyaj)' },
        { type: 'review', date: '2026-01-12', points: 5, description: 'Ijobiy sharh qoldirish' },
        { type: 'no_show', date: '2026-01-12', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'usage', date: '2026-01-11', points: 10, description: 'Xizmatdan foydalanish (Pedikur)' },
        { type: 'usage', date: '2026-01-09', points: 10, description: 'Xizmatdan foydalanish (Soch Turmaklash)' },
        { type: 'review', date: '2026-01-09', points: 5, description: 'Ijobiy sharh qoldirish' },
        { type: 'no_show', date: '2026-01-07', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'usage', date: '2026-01-05', points: 10, description: 'Xizmatdan foydalanish (Manikur)' },
        { type: 'cancel', date: '2026-01-03', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'usage', date: '2026-01-03', points: 10, description: 'Xizmatdan foydalanish (Pedikur)' },
        { type: 'usage', date: '2026-01-03', points: 10, description: 'Xizmatdan foydalanish (Soch Turmaklash)' },
        { type: 'usage', date: '2026-01-03', points: 10, description: 'Xizmatdan foydalanish (Pedikur)' },
        { type: 'no_show', date: '2026-01-02', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'cancel', date: '2026-01-01', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'no_show', date: '2025-12-30', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'cancel', date: '2025-12-29', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'cancel', date: '2025-12-26', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'cancel', date: '2025-12-25', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'cancel', date: '2025-12-20', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'no_show', date: '2025-12-19', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'no_show', date: '2025-12-18', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'no_show', date: '2025-12-11', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'cancel', date: '2025-12-11', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'cancel', date: '2025-12-08', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'no_show', date: '2025-12-07', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'no_show', date: '2025-12-03', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'no_show', date: '2025-12-02', points: -20, description: 'Kelmaslik (No-show)' },
        { type: 'cancel', date: '2025-11-30', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'cancel', date: '2025-11-29', points: -5, description: 'Buyurtmani bekor qilish' },
        { type: 'initial', date: '2025-01-01', points: 50, description: 'Dastlabki ball' }
    ];

    fixedHistory.forEach((item, index) => {
        trust_history.push({
            id: `hist-fixed-${index}`,
            ...item
        });
    });

    // Add extra random history to ensure pagination is very obvious if needed (duplicates of fixed or new random)
    // The user list has 41 items, which is enough for 4 pages (limits 10).

    // Sort bookings by scheduled_date descending (Newest first)
    bookings.sort((a, b) => {
        const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
        const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
        return dateB - dateA;
    });

    // Sort history
    trust_history.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { bookings, trust_history };
};

const data = generateData();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

console.log(`Generated ${data.bookings.length} bookings and ${data.trust_history.length} history items in ${OUTPUT_FILE}`);
