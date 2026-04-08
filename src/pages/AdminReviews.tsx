import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Trash2, CheckCircle, MessageSquare, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { format } from "date-fns";
import { uz } from "date-fns/locale";

// Mock data
const mockReviews = [
    { id: 1, user: "Aziz Karimov", business: "Belleza Studio", rating: 5, comment: "Zo'r xizmat, juda yoqdi!", date: "2024-01-20T14:30:00", status: "published" },
    { id: 2, user: "Malika Tursunova", business: "Guzallik Salon", rating: 2, comment: "Xizmat sifati past, kutish vaqti ko'p.", date: "2024-01-19T10:15:00", status: "flagged" },
    { id: 3, user: "Bekzod Aliyev", business: "Spa Center", rating: 5, comment: "Ajoyib hordiq chiqardim.", date: "2024-01-18T16:45:00", status: "published" },
    { id: 4, user: "Dilnoza Rahimova", business: "Nail Art", rating: 1, comment: "Umuman yoqmadi, tavsiya qilmayman.", date: "2024-01-17T09:00:00", status: "published" },
];

const AdminReviews = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState(mockReviews);
    const { toast } = useToast();

    const handleDelete = (id: number) => {
        setReviews(reviews.filter(r => r.id !== id));
        toast({
            title: "Sharh o'chirildi",
            description: "Sharh muvaffaqiyatli o'chirildi",
            variant: "destructive",
        });
    };

    const handleApprove = (id: number) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: "published" } : r));
        toast({
            title: "Sharh tasdiqlandi",
            description: "Sharh statusi yangilandi",
        });
    };

    const filteredReviews = reviews.filter(r =>
        r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Sharhlar</h1>
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
            <div className="p-4 space-y-3">
                {filteredReviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-medium text-sm">{review.user}</p>
                                    <p className="text-xs text-muted-foreground">to {review.business}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold">{review.rating}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">
                                        {format(new Date(review.date), "d-MMMM, HH:mm", { locale: uz })}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded-lg">
                                "{review.comment}"
                            </p>

                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${review.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {review.status === 'published' ? 'Tasdiqlangan' : 'Shikoyat qilingan'}
                                </span>

                                <div className="flex gap-2">
                                    {review.status !== 'published' && (
                                        <Button variant="ghost" size="sm" onClick={() => handleApprove(review.id)} className="h-8 w-8 p-0 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)} className="h-8 w-8 p-0 text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminReviews;
