import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Trash2, CheckCircle, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { format } from "date-fns";
import { uz } from "date-fns/locale";

interface AdminReviewItem {
    id: string;
    user: string;
    business: string;
    business_id?: string;
    rating: number;
    comment: string;
    date: string;
    status: 'published' | 'flagged';
    photos?: string[];
    reply?: {
        comment: string;
        created_at: string;
    };
}

// 12 expanded mock reviews with diverse ratings and replies to verify pagination and display
const mockReviews: AdminReviewItem[] = [
    { 
        id: "1", 
        user: "Aziz Karimov", 
        business: "Belleza Studio", 
        rating: 5, 
        comment: "Zo'r xizmat, juda yoqdi! Atmosfera ham yoqimli, ustalar o'z ishining mutaxassisi. Tavsiya qilaman.", 
        date: "2024-01-20T14:30:00", 
        status: "published", 
        reply: { 
            comment: "Rahmat, Azizbek! Sizni yana kutib qolamiz. Hurmat bilan, Belleza Studio ma'muriyati.", 
            created_at: "2024-01-20T15:00:00" 
        } 
    },
    { 
        id: "2", 
        user: "Malika Tursunova", 
        business: "Guzallik Salon", 
        rating: 2, 
        comment: "Xizmat sifati past, kutish vaqti ko'p. Oldindan yozilgan bo'lsam ham navbat kutdim.", 
        date: "2024-01-19T10:15:00", 
        status: "flagged" 
    },
    { 
        id: "3", 
        user: "Bekzod Aliyev", 
        business: "Spa Center", 
        rating: 5, 
        comment: "Ajoyib hordiq chiqardim. Massajchilar o'z ishining ustasi, charchoq yozildi.", 
        date: "2024-01-18T16:45:00", 
        status: "published" 
    },
    { 
        id: "4", 
        user: "Dilnoza Rahimova", 
        business: "Nail Art", 
        rating: 1, 
        comment: "Umuman yoqmadi, tirnoqlarimni yomon qilib qo'yishdi. Tavsiya qilmayman.", 
        date: "2024-01-17T09:00:00", 
        status: "published", 
        reply: { 
            comment: "Uzr so'raymiz, Dilnoza! Iltimos, salonga keling, barchasini tekin to'g'rilab beramiz.", 
            created_at: "2024-01-17T11:20:00" 
        } 
    },
    { 
        id: "5", 
        user: "Jasur Nematov", 
        business: "Master Barber", 
        rating: 5, 
        comment: "Usta qo'li yengil ekan. Soqol va soch olish bo'yicha haqiqiy ustalar joyi.", 
        date: "2024-01-16T11:00:00", 
        status: "published" 
    },
    { 
        id: "6", 
        user: "Zilola Sodikova", 
        business: "Lola SPA", 
        rating: 4, 
        comment: "Massaj ajoyib bo'ldi, charchoq yozildi. Narxi biroz qimmatroq ekan lekin arziydi.", 
        date: "2024-01-15T15:30:00", 
        status: "published", 
        reply: { 
            comment: "Salomat bo'ling, Zilola! Salonga yana tashrif buyurishingizni kutib qolamiz.", 
            created_at: "2024-01-15T16:00:00" 
        } 
    },
    { 
        id: "7", 
        user: "Sherzod Umarov", 
        business: "Belleza Studio", 
        rating: 3, 
        comment: "Soch turmagi yaxshi, lekin ofitsiantlar yoki reception biroz qo'polroq munosabatda bo'ldi.", 
        date: "2024-01-14T18:00:00", 
        status: "published" 
    },
    { 
        id: "8", 
        user: "Shahnoza Hakimova", 
        business: "Denta Lux", 
        rating: 5, 
        comment: "Tish davolatdim, og'riq umuman sezilmadi. Toza klinika, xushmuomala xodimlar.", 
        date: "2024-01-13T10:00:00", 
        status: "published", 
        reply: { 
            comment: "Sog' bo'ling! Tishlaringizni doimo asrang, biz har doim xizmatingizdamiz.", 
            created_at: "2024-01-13T10:30:00" 
        } 
    },
    { 
        id: "9", 
        user: "Farrux Zokirov", 
        business: "Fitness Pro", 
        rating: 4, 
        comment: "Trenajyorlar hammasi yangi va toza. Kechki payt odam judayam ko'p bo'lib ketadi.", 
        date: "2024-01-12T19:00:00", 
        status: "published" 
    },
    { 
        id: "10", 
        user: "Madina Aliyeva", 
        business: "MedEstetik", 
        rating: 5, 
        comment: "Yuz tozalash muolajasi a'lo darajada o'tdi. Kosmetolog judayam bilimli ekan.", 
        date: "2024-01-11T12:00:00", 
        status: "published" 
    },
    { 
        id: "11", 
        user: "Otabek Kadirov", 
        business: "Oltin Qaychi", 
        rating: 5, 
        comment: "Ajoyib sochlarni kesish, ustaga gap bo'lishi mumkin emas. Narxlari ham hamyonbop.", 
        date: "2024-01-10T14:00:00", 
        status: "published", 
        reply: { 
            comment: "Rahmat, Otabek! Fikringiz biz uchun muhim. Sizni yana kutamiz.", 
            created_at: "2024-01-10T14:45:00" 
        } 
    },
    { 
        id: "12", 
        user: "Gulnoza Pulatova", 
        business: "Bella Vista Nails", 
        rating: 2, 
        comment: "Manikyur sifati yomon chiqdi, atigi 3 kunda ko'chib ketdi. Tavsiya etmayman.", 
        date: "2024-01-09T16:00:00", 
        status: "flagged" 
    }
];

const AdminReviews = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
    const { toast } = useToast();
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // At least 10 reviews per page

    // Sync reviews from localStorage & mocks on mount
    const loadReviews = () => {
        try {
            const storedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
            const storedInteractions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
            
            // Format stored reviews to match AdminReviewItem
            const formattedStored = storedReviews.map((r: any) => {
                const interaction = storedInteractions[r.id] || {};
                const interactionReply = interaction.replies?.[0];
                
                return {
                    id: r.id,
                    user: r.user_name || "Mijoz",
                    business: r.business_name || "Beauty Salon",
                    business_id: r.business_id,
                    rating: r.overall_rating || 5,
                    comment: r.comment || "",
                    date: r.created_at,
                    status: r.status || 'published',
                    photos: r.photos || [],
                    reply: r.reply || (interactionReply ? {
                        comment: interactionReply.comment,
                        created_at: interactionReply.created_at
                    } : undefined)
                };
            });

            // Format mock reviews
            const formattedMocks = mockReviews.map((r: any) => ({
                id: r.id,
                user: r.user,
                business: r.business,
                rating: r.rating,
                comment: r.comment,
                date: r.date,
                status: r.status,
                photos: r.photos || [],
                reply: r.reply // Properly preserve reply!
            }));

            // Merge: stored reviews first, then mocks
            setReviews([...formattedStored, ...formattedMocks]);
        } catch (e) {
            console.error("Error loading reviews:", e);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleDelete = (id: string) => {
        setReviews(reviews.filter(r => r.id !== id));
        
        try {
            const stored = JSON.parse(localStorage.getItem('user_reviews') || '[]');
            const updated = stored.filter((r: any) => r.id !== id);
            localStorage.setItem('user_reviews', JSON.stringify(updated));
        } catch (e) {
            console.error(e);
        }

        toast({
            title: "Sharh o'chirildi",
            description: "Sharh muvaffaqiyatli o'chirildi",
            variant: "destructive",
        });
    };

    const handleApprove = (id: string) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: "published" } : r));
        
        try {
            const stored = JSON.parse(localStorage.getItem('user_reviews') || '[]');
            const updated = stored.map((r: any) => r.id === id ? { ...r, status: "published" } : r);
            localStorage.setItem('user_reviews', JSON.stringify(updated));
        } catch (e) {
            console.error(e);
        }

        toast({
            title: "Sharh tasdiqlandi",
            description: "Sharh statusi muvaffaqiyatli tasdiqlandi",
        });
    };

    const filteredReviews = reviews.filter(r =>
        r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Slice reviews for pagination
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold">Moderatsiya paneli</h1>
                        <p className="text-[11px] text-primary-foreground/80 -mt-0.5">
                            {filteredReviews.length} ta sharh
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Qidirish..."
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Reviews List */}
            <div className="p-3 space-y-2">
                {paginatedReviews.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        Qidiruv bo'yicha sharhlar topilmadi.
                    </div>
                ) : (
                    paginatedReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                             <Card className="p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                {/* Header: Compact information block */}
                                <div className="flex justify-between items-center mb-1 gap-2">
                                    <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                                        <p className="font-bold text-[11px] text-foreground truncate">{review.user}</p>
                                        <span className="text-[9px] text-muted-foreground">→</span>
                                        <p className="text-[10px] text-muted-foreground truncate font-medium bg-gray-100/80 px-1 py-0.2 rounded">
                                            {review.business}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <div className="flex items-center gap-0.5 bg-amber-50 px-1 py-0.2 rounded text-amber-700 font-bold text-[9px] border border-amber-100">
                                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                            <span>{review.rating}</span>
                                        </div>
                                        <span className="text-[8px] text-muted-foreground">
                                            {format(new Date(review.date), "dd-MMM, HH:mm", { locale: uz })}
                                        </span>
                                    </div>
                                </div>

                                {/* Compact comment box */}
                                <p className="text-[11px] text-foreground/80 bg-gray-50/50 p-1.5 rounded-md leading-normal mb-1 italic">
                                    "{review.comment}"
                                </p>

                                {/* Render User Photos in small strip */}
                                {review.photos && review.photos.length > 0 && (
                                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                                        {review.photos.map((photo, i) => (
                                            <img
                                                key={i}
                                                src={photo}
                                                alt="media"
                                                className="w-8 h-8 object-cover rounded border border-gray-100 shadow-sm"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Render Business Reply in highly compact style */}
                                {review.reply && (
                                    <div className="mb-1 bg-violet-50/45 dark:bg-violet-950/10 p-1.5 rounded-md border-l-2 border-violet-500/50 relative text-[10px] leading-normal text-foreground/85">
                                        <span className="font-bold text-violet-700 dark:text-violet-400 block mb-0.5 text-[8px] uppercase tracking-wider">
                                            Tadbirkor javobi:
                                        </span>
                                        "{review.reply.comment}"
                                    </div>
                                )}

                                {/* Small footer with Actions */}
                                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                                    {review.status === 'flagged' ? (
                                        <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded-full bg-red-50 text-red-700">
                                            Shikoyat qilingan
                                        </span>
                                    ) : (
                                        <div />
                                    )}
                                    <div className="flex gap-1">
                                        {review.status !== 'published' && (
                                            <Button variant="ghost" size="sm" onClick={() => handleApprove(review.id)} className="h-5 gap-0.5 px-1.5 text-[9px] text-green-600 hover:text-green-700 hover:bg-green-50">
                                                <CheckCircle className="w-2.5 h-2.5 animate-pulse" />
                                                <span>Tasdiqlash</span>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)} className="h-5 gap-0.5 px-1.5 text-[9px] text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="w-2.5 h-2.5" />
                                            <span>O'chirish</span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {Math.ceil(filteredReviews.length / itemsPerPage) > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 pb-10">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-8 text-xs px-3"
                    >
                        Oldingi
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(filteredReviews.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === page
                                    ? "bg-primary text-primary-foreground font-bold"
                                    : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredReviews.length / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredReviews.length / itemsPerPage)}
                        className="h-8 text-xs px-3"
                    >
                        Keyingi
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
