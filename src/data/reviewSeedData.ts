// Mock review seed data with interactions
// IMPORTANT: Clear localStorage and refresh to reload fake data

export const clearAndReseedReviews = () => {
    // Clear existing data
    localStorage.removeItem('user_reviews');
    localStorage.removeItem('review_interactions');

    // Reseed
    seedReviews();
};

export const seedReviews = () => {
    const mockReviews = [
        // Belleza Studio (biz-1) Reviews
        {
            id: 'review-1',
            business_id: 'biz-1',
            business_name: 'Belleza Studio',
            user_id: 'user-mock-1',
            user_name: 'Dilnoza Karimova',
            category: 'beauty-spas',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 5,
            value_for_money: 4,
            comment: 'Juda yaxshi xizmat! Ustalar professional, natija zo\'r. Albatta qaytib kelaman!',
            photos: [
                "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&w=600&q=80"
            ],
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-2',
            business_id: 'biz-1',
            business_name: 'Belleza Studio',
            user_id: 'user-mock-2',
            user_name: 'Aziza Rahimova',
            category: 'beauty-spas',
            overall_rating: 4,
            service_quality: 4,
            cleanliness: 5,
            value_for_money: 4,
            comment: 'Yaxshi salon, faqat biroz narxi qimmat. Lekin sifat yaxshi.',
            photos: [], // Text only
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-3',
            business_id: 'biz-1',
            business_name: 'Belleza Studio',
            user_id: 'user-mock-6',
            user_name: 'Malika Tosheva',
            category: 'beauty-spas',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 5,
            value_for_money: 5,
            comment: 'Eng zo\'r salon! Har doim shu yerga boraman. Ustalar professional!',
            photos: ["https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&w=600&q=80"],
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-4',
            business_id: 'biz-1',
            business_name: 'Belleza Studio',
            user_id: 'user-mock-7',
            user_name: 'Sevara Alimova',
            category: 'beauty-spas',
            overall_rating: 3,
            service_quality: 3,
            cleanliness: 4,
            value_for_money: 3,
            comment: 'Yaxshi, lekin ko\'p kutish kerak bo\'ldi. Band qilish tizimi bo\'lsa yaxshi.',
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },

        // Glamour Hair (biz-2) Reviews
        {
            id: 'review-5',
            business_id: 'biz-2',
            business_name: 'Glamour Hair',
            user_id: 'user-mock-3',
            user_name: 'Nigora Sultanova',
            category: 'beauty-spas',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 5,
            value_for_money: 5,
            comment: 'Eng yaxshi salon! Usta juda diqqatli ishlaydi. Tavsiya qilaman!',
            photos: [
                "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1632345031635-7b8006e83893?ixlib=rb-4.0.3&w=600&q=80"
            ],
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-6',
            business_id: 'biz-2',
            business_name: 'Glamour Hair',
            user_id: 'user-mock-8',
            user_name: 'Kamola Rahmatova',
            category: 'beauty-spas',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 5,
            value_for_money: 4,
            comment: 'Dizaynlar juda chiroyli! Ustalar professional. Juda mamnunman!',
            photos: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&w=600&q=80"],
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-7',
            business_id: 'biz-2',
            business_name: 'Glamour Hair',
            user_id: 'user-mock-9',
            user_name: 'Zilola Karimova',
            category: 'beauty-spas',
            overall_rating: 4,
            service_quality: 4,
            cleanliness: 5,
            value_for_money: 4,
            comment: 'Juda yoqdi! Faqat narxi biroz baland. Lekin natija zo\'r!',
            photos: [], // Text only
            created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },

        // Chef's Table (biz-3) Reviews
        {
            id: 'review-8',
            business_id: 'biz-3',
            business_name: 'Chef\'s Table',
            user_id: 'user-mock-4',
            user_name: 'Jahongir Toshmatov',
            category: 'restaurants',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 4,
            value_for_money: 5,
            comment: 'Juda mazali taomlar! Xizmat ham professional.',
            photos: [
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?ixlib=rb-4.0.3&w=600&q=80"
            ],
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-9',
            business_id: 'biz-3',
            business_name: 'Chef\'s Table',
            user_id: 'user-mock-10',
            user_name: 'Sardor Hakimov',
            category: 'restaurants',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 5,
            value_for_money: 5,
            comment: 'Eng zo\'r restoran! Har safar shu yerga kelaman. Taomlar ajoyib!',
            photos: ["https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&w=600&q=80"],
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-10',
            business_id: 'biz-3',
            business_name: 'Chef\'s Table',
            user_id: 'user-mock-11',
            user_name: 'Bobur Sharipov',
            category: 'restaurants',
            overall_rating: 4,
            service_quality: 5,
            cleanliness: 4,
            value_for_money: 4,
            comment: 'Yaxshi restoran. Narxi o\'rtacha. Taomlar mazali.',
            photos: [], // Ensure explicit empty array
            created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },

        // More reviews for other businesses
        {
            id: 'review-11',
            business_id: 'biz-4',
            business_name: 'Samarkand Osh Markazi',
            user_id: 'user-mock-5',
            user_name: 'Madina Yusupova',
            category: 'other',
            overall_rating: 4,
            service_quality: 4,
            cleanliness: 5,
            value_for_money: 3,
            comment: 'Yaxshi xizmat, professional yondashuv.',
            photos: [
                "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&w=600&q=80"
            ],
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'review-12',
            business_id: 'biz-5',
            business_name: 'Barista Coffee Lab',
            user_id: 'user-mock-12',
            user_name: 'Gulnora Abdullayeva',
            category: 'other',
            overall_rating: 5,
            service_quality: 5,
            cleanliness: 5,
            value_for_money: 4,
            comment: 'Eng yaxshi! Qayta kelaman albatta.',
            photos: [
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&w=600&q=80",
                "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&w=600&q=80"
            ],
            created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    localStorage.setItem('user_reviews', JSON.stringify(mockReviews));

    // Seed review interactions (likes/dislikes and replies)
    const mockInteractions: Record<string, any> = {
        'review-1': {
            likes: ['user-mock-2', 'user-mock-3', 'user-mock-5', 'user-mock-8', 'user-mock-10'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-1',
                    business_id: 'biz-1',
                    business_name: 'Belleza Studio',
                    user_id: 'owner-1',
                    user_name: 'Salon Administrator',
                    comment: 'Rahmat! Sizni qayta kutib qolamiz! 💝',
                    created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-2': {
            likes: ['user-mock-1', 'user-mock-6'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-2',
                    business_id: 'biz-1',
                    business_name: 'Belleza Studio',
                    user_id: 'owner-1',
                    user_name: 'Salon Administrator',
                    comment: 'Fikringiz uchun rahmat! Maxsus chegirmalarimiz bor 😊',
                    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-3': {
            likes: ['user-mock-1', 'user-mock-2', 'user-mock-4', 'user-mock-5', 'user-mock-7', 'user-mock-9'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-3',
                    business_id: 'biz-1',
                    business_name: 'Belleza Studio',
                    user_id: 'owner-1',
                    user_name: 'Salon Administrator',
                    comment: 'Ustalarimiz sizning so\'zlaringizdan juda xursand! Rahmat! 🌟',
                    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-4': {
            likes: ['user-mock-2'],
            dislikes: ['user-mock-3', 'user-mock-8'],
            replies: [
                {
                    id: 'reply-4',
                    business_id: 'biz-1',
                    business_name: 'Belleza Studio',
                    user_id: 'owner-1',
                    user_name: 'Salon Administrator',
                    comment: 'Uzr so\'raymiz! Endi online band qilish tizimi bor. Tel: +998901234567',
                    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-5': {
            likes: ['user-mock-1', 'user-mock-2', 'user-mock-4', 'user-mock-5', 'user-mock-6', 'user-mock-7'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-5',
                    business_id: 'biz-2',
                    business_name: 'Glamour Hair',
                    user_id: 'owner-2',
                    user_name: 'Salon Director',
                    comment: 'Juda xursandmiz! Sizni doim mamnun qilishga harakat qilamiz! ✨',
                    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-6': {
            likes: ['user-mock-3', 'user-mock-5', 'user-mock-9', 'user-mock-11'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-6',
                    business_id: 'biz-2',
                    business_name: 'Glamour Hair',
                    user_id: 'owner-2',
                    user_name: 'Salon Director',
                    comment: 'Ustalarimiz sizga rahmat aytadi! Kelasi safar 10% chegirma! 💅',
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-7': {
            likes: ['user-mock-2', 'user-mock-4'],
            dislikes: ['user-mock-10'],
            replies: []
        },
        'review-8': {
            likes: ['user-mock-2', 'user-mock-5', 'user-mock-10', 'user-mock-11'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-8',
                    business_id: 'biz-3',
                    business_name: 'Chef\'s Table',
                    user_id: 'owner-3',
                    user_name: 'Restaurant Manager',
                    comment: 'Rahmat! Sizni kutib qolamiz! 🍽️',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-9': {
            likes: ['user-mock-1', 'user-mock-4', 'user-mock-8', 'user-mock-12'],
            dislikes: [],
            replies: [
                {
                    id: 'reply-9',
                    business_id: 'biz-3',
                    business_name: 'Chef\'s Table',
                    user_id: 'owner-3',
                    user_name: 'Restaurant Manager',
                    comment: 'Sizga ham rahmat! Doimiy mijozlar uchun bonuslar bor! 🎁',
                    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        },
        'review-10': {
            likes: ['user-mock-3', 'user-mock-9'],
            dislikes: [],
            replies: []
        },
        'review-11': {
            likes: ['user-mock-3', 'user-mock-12'],
            dislikes: ['user-mock-4'],
            replies: []
        },
        'review-12': {
            likes: ['user-mock-1', 'user-mock-5', 'user-mock-7'],
            dislikes: [],
            replies: []
        }
    };

    localStorage.setItem('review_interactions', JSON.stringify(mockInteractions));

    console.log('✅ Mock reviews seeded successfully!');
    console.log(`📊 Created ${mockReviews.length} reviews with likes, dislikes, and business replies!`);
    console.log('📍 Business IDs:', [...new Set(mockReviews.map(r => r.business_id))].join(', '));
};

// Call this function when the app loads to seed data
export const initializeReviewData = () => {
    const existingReviews = localStorage.getItem('user_reviews');

    // Always seed if no reviews exist
    if (!existingReviews || JSON.parse(existingReviews).length === 0) {
        console.log('No reviews found, seeding initial data...');
        seedReviews();
    } else {
        console.log('Reviews already exist. To reseed, call clearAndReseedReviews()');
    }
};

// Helper function to debug - call in console
(window as any).clearAndReseedReviews = clearAndReseedReviews;
(window as any).checkReviews = () => {
    const reviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
    const interactions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
    console.log('📝 Total reviews:', reviews.length);
    console.log('Reviews by business:', reviews.reduce((acc: any, r: any) => {
        acc[r.business_id] = (acc[r.business_id] || 0) + 1;
        return acc;
    }, {}));
    console.log('Full data:', { reviews, interactions });
};
