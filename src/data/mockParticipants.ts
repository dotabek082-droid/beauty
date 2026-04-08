// Mock participant data for promotions
export const generateMockParticipants = (promotionId: string, count: number = 15) => {
    const names = [
        'Alisher Normatov', 'Nodira Karimova', 'Rustam Tursunov', 'Dilnoza Rahimova',
        'Jasur Abdullayev', 'Malika Ismoilova', 'Bekzod Qodirov', 'Nilufar Usmonova',
        'Otabek Yusupov', 'Gulnora Azimova', 'Sardor Mahmudov', 'Zarina Sharipova',
        'Davron Karimov', 'Feruza Nazarova', 'Timur Rashidov', 'Madina Fayzullayeva',
        'Aziz Ummatov', 'Kamola Saidova', 'Farrux Ergashev', 'Sitora Aminova'
    ];

    const statuses: Array<'registered' | 'used' | 'cancelled' | 'no_show'> = [
        'registered', 'used', 'cancelled', 'no_show'
    ];

    const participants = [];
    for (let i = 0; i < count; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const registeredDate = new Date();
        registeredDate.setDate(registeredDate.getDate() - randomDaysAgo);

        // More likely to be "registered" or "used" for active promotions
        let status: typeof statuses[number];
        const rand = Math.random();
        if (rand < 0.4) status = 'used';
        else if (rand < 0.75) status = 'registered';
        else if (rand < 0.9) status = 'cancelled';
        else status = 'no_show';

        participants.push({
            id: `participant-${promotionId}-${i}`,
            promotion_id: promotionId,
            user_id: `user-${Math.floor(Math.random() * 1000)}`,
            user_name: names[i % names.length],
            user_phone: `+998 ${90 + Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
            user_trust_score: Math.floor(Math.random() * 50) + 50, // 50-100
            registered_at: registeredDate.toISOString(),
            status: status,
            booking_id: status === 'used' || status === 'registered' ? `booking-${i}` : undefined,
            booking_date: status === 'used' || status === 'registered' ? new Date(registeredDate.getTime() + 86400000 * Math.floor(Math.random() * 7)).toISOString() : undefined,
            notes: status === 'cancelled' ? 'Mijoz vaqti yo\'q dedi' : undefined
        });
    }

    return participants;
};
