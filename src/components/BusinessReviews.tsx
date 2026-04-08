import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, Verified, MessageCircle, Send, X, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AddFeedbackDialog from "./AddFeedbackDialog";

interface BusinessReviewsProps {
    businessId: string;
    businessRating: number;
    reviewCount: number;
    isOwner?: boolean;
}

interface Review {
    id: string;
    user_id: string;
    overall_rating: number;
    additional_comments: string;
    created_at: string;
    user_name?: string;
}

interface ReviewInteractions {
    likes: string[];
    dislikes: string[];
    replies: ReviewReply[];
}

interface ReviewReply {
    id: string;
    business_id: string;
    business_name: string;
    user_id: string;
    user_name: string;
    comment: string;
    created_at: string;
}

const BusinessReviews = ({ businessId, businessRating, reviewCount, isOwner = false }: BusinessReviewsProps) => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [interactions, setInteractions] = useState<Record<string, ReviewInteractions>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

    // Use prop if provided, otherwise fall back to profile check key
    const isBusinessOwner = isOwner || (profile?.role === 'business' && profile?.business_id === businessId);

    useEffect(() => {
        fetchReviews();
        fetchInteractions();
    }, [businessId]);

    const fetchReviews = () => {
        try {
            let storedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');

            const hasReviewsForBusiness = storedReviews.some((r: any) => r.business_id === businessId);

            if (!hasReviewsForBusiness) {
                const fakeReviews = [
                    {
                        id: `fake-${Date.now()}-1`,
                        business_id: businessId,
                        user_id: "fake-user-1",
                        user_name: "Aziza",
                        overall_rating: 5,
                        comment: "Juda ajoyib xizmat! Menga yoqdi, yana kelaman. Rasmlarni qarang!",
                        photos: ["https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
                        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
                    },
                    {
                        id: `fake-${Date.now()}-2`,
                        business_id: businessId,
                        user_id: "fake-user-2",
                        user_name: "Malika",
                        overall_rating: 4,
                        comment: "Yaxshi salon, lekin navbat ko'p ekan.",
                        photos: ["https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
                        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
                    }
                ];

                storedReviews = [...storedReviews, ...fakeReviews];
                localStorage.setItem('user_reviews', JSON.stringify(storedReviews));
            }

            const businessReviews = storedReviews
                .filter((review: any) => review.business_id === businessId)
                .map((review: any) => ({
                    id: review.id,
                    user_id: review.user_id,
                    overall_rating: review.overall_rating,
                    additional_comments: JSON.stringify({
                        comment: review.comment,
                        photos: review.photos || []
                    }),
                    created_at: review.created_at,
                    user_name: review.user_name || "Anonim"
                }));

            setReviews(businessReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInteractions = () => {
        try {
            const storedInteractions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
            setInteractions(storedInteractions);
        } catch (error) {
            console.error("Error fetching interactions:", error);
        }
    };

    const handleLike = (reviewId: string) => {
        if (!user) {
            toast({ title: "Tizimga kiring", description: "Like qo'yish uchun tizimga kiring", variant: "destructive" });
            return;
        }

        const currentInteractions = { ...interactions };
        if (!currentInteractions[reviewId]) {
            currentInteractions[reviewId] = { likes: [], dislikes: [], replies: [] };
        }

        const hasLiked = currentInteractions[reviewId].likes.includes(user.id);
        const hasDisliked = currentInteractions[reviewId].dislikes.includes(user.id);

        if (hasLiked) {
            currentInteractions[reviewId].likes = currentInteractions[reviewId].likes.filter(id => id !== user.id);
        } else {
            currentInteractions[reviewId].likes.push(user.id);
            if (hasDisliked) {
                currentInteractions[reviewId].dislikes = currentInteractions[reviewId].dislikes.filter(id => id !== user.id);
            }
        }

        setInteractions(currentInteractions);
        localStorage.setItem('review_interactions', JSON.stringify(currentInteractions));
    };

    const handleDislike = (reviewId: string) => {
        if (!user) {
            toast({ title: "Tizimga kiring", description: "Dislike qo'yish uchun tizimga kiring", variant: "destructive" });
            return;
        }

        const currentInteractions = { ...interactions };
        if (!currentInteractions[reviewId]) {
            currentInteractions[reviewId] = { likes: [], dislikes: [], replies: [] };
        }

        const hasLiked = currentInteractions[reviewId].likes.includes(user.id);
        const hasDisliked = currentInteractions[reviewId].dislikes.includes(user.id);

        if (hasDisliked) {
            currentInteractions[reviewId].dislikes = currentInteractions[reviewId].dislikes.filter(id => id !== user.id);
        } else {
            currentInteractions[reviewId].dislikes.push(user.id);
            if (hasLiked) {
                currentInteractions[reviewId].likes = currentInteractions[reviewId].likes.filter(id => id !== user.id);
            }
        }

        setInteractions(currentInteractions);
        localStorage.setItem('review_interactions', JSON.stringify(currentInteractions));
    };

    const handleSubmitReply = (reviewId: string) => {
        if (!user || !isBusinessOwner || !replyText.trim()) {
            return;
        }

        const currentInteractions = { ...interactions };
        if (!currentInteractions[reviewId]) {
            currentInteractions[reviewId] = { likes: [], dislikes: [], replies: [] };
        }

        const newReply: ReviewReply = {
            id: crypto.randomUUID(),
            business_id: businessId,
            business_name: profile?.business_name || "Business",
            user_id: user.id,
            user_name: profile?.full_name || "Business Owner",
            comment: replyText.trim(),
            created_at: new Date().toISOString()
        };

        currentInteractions[reviewId].replies.push(newReply);
        setInteractions(currentInteractions);
        localStorage.setItem('review_interactions', JSON.stringify(currentInteractions));

        toast({ title: "Javob yuborildi!", description: "Sizning javobingiz qo'shildi" });
        setReplyText("");
        setReplyingTo(null);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? 'fill-accent text-accent' : 'text-muted'}`}
            />
        ));
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "Bugun";
            if (diffDays === 1) return "Kecha";
            if (diffDays < 7) return `${diffDays} kun oldin`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`;
            return format(date, "dd MMM yyyy");
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            {/* Rating Summary */}
            <Card className="p-5">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{businessRating}</p>
                        <div className="flex items-center gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(businessRating) ? 'fill-accent text-accent' : 'text-muted'}`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {reviews.length > 0 ? reviews.length : reviewCount} ta sharh
                        </p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviews.filter(r => r.overall_rating === rating).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : 3;
                            return (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-3">{rating}</span>
                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Reviews List */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-semibold text-lg">Sharhlar</h3>
                    {!isBusinessOwner && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => {
                                if (!user) {
                                    toast({ title: "Tizimga kiring", description: "Sharh qoldirish uchun tizimga kiring", variant: "destructive" });
                                    return;
                                }
                                setIsAddReviewOpen(true);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Sharh qoldirish
                        </Button>
                    )}
                </div>

                <AddFeedbackDialog
                    open={isAddReviewOpen}
                    onOpenChange={setIsAddReviewOpen}
                    defaultBusinessId={businessId}
                    onSuccess={() => {
                        fetchReviews();
                        setIsAddReviewOpen(false);
                    }}
                />

                {loading ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">Sharhlar yuklanmoqda...</p>
                    </Card>
                ) : reviews.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted-foreground">Hali sharhlar yo'q</p>
                        <p className="text-xs text-muted-foreground mt-2">Birinchi sharh qoldirishingiz mumkin!</p>
                    </Card>
                ) : (
                    reviews.map((review, index) => {
                        let parsedComments: any = {};
                        try {
                            parsedComments = JSON.parse(review.additional_comments || '{}');
                        } catch {
                            parsedComments = { comment: review.additional_comments };
                        }

                        const reviewInteraction = interactions[review.id] || { likes: [], dislikes: [], replies: [] };
                        const hasLiked = user && reviewInteraction.likes.includes(user.id);
                        const hasDisliked = user && reviewInteraction.dislikes.includes(user.id);

                        return (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-semibold text-lg">
                                                {review.user_name?.[0]?.toUpperCase() || "A"}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-foreground">{review.user_name}</h4>
                                                {review.user_id === user?.id && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Verified className="w-3 h-3 mr-1" />
                                                        Siz
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-0.5">
                                                    {renderStars(review.overall_rating)}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(review.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    {parsedComments.comment && (
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {parsedComments.comment}
                                        </p>
                                    )}

                                    {/* Review Photos */}
                                    {parsedComments.photos && parsedComments.photos.length > 0 && (
                                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                                            {parsedComments.photos.map((photo: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border border-border"
                                                    onClick={() => setSelectedImage(photo)}
                                                >
                                                    <img
                                                        src={photo}
                                                        alt="Review"
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Like/Dislike Actions */}
                                    <div className="flex items-center gap-4 pb-3 border-b border-border">
                                        <button
                                            onClick={() => handleLike(review.id)}
                                            className={`flex items-center gap-1.5 text-xs transition-colors ${hasLiked
                                                ? 'text-primary font-semibold'
                                                : 'text-muted-foreground hover:text-primary'
                                                }`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-primary' : ''}`} />
                                            Foydali ({reviewInteraction.likes.length})
                                        </button>
                                        <button
                                            onClick={() => handleDislike(review.id)}
                                            className={`flex items-center gap-1.5 text-xs transition-colors ${hasDisliked
                                                ? 'text-destructive font-semibold'
                                                : 'text-muted-foreground hover:text-destructive'
                                                }`}
                                        >
                                            <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-destructive' : ''}`} />
                                            ({reviewInteraction.dislikes.length})
                                        </button>
                                        {isBusinessOwner && (
                                            <button
                                                onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Javob berish
                                            </button>
                                        )}
                                    </div>

                                    {/* Reply Form (Business Owner Only) */}
                                    <AnimatePresence>
                                        {replyingTo === review.id && isBusinessOwner && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mt-3"
                                            >
                                                <div className="space-y-2 p-3 bg-secondary/20 rounded-lg">
                                                    <Textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Javobingizni yozing..."
                                                        rows={3}
                                                        className="resize-none"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setReplyingTo(null);
                                                                setReplyText("");
                                                            }}
                                                        >
                                                            <X className="w-4 h-4 mr-1" />
                                                            Bekor qilish
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSubmitReply(review.id)}
                                                            disabled={!replyText.trim()}
                                                        >
                                                            <Send className="w-4 h-4 mr-1" />
                                                            Yuborish
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Replies */}
                                    {reviewInteraction.replies.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {reviewInteraction.replies.map((reply) => (
                                                <motion.div
                                                    key={reply.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="ml-4 p-3 bg-primary/5 border-l-2 border-primary rounded-r-lg"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="default" className="text-xs">
                                                            <Verified className="w-3 h-3 mr-1" />
                                                            {reply.business_name}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(reply.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground">{reply.comment}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {reviews.length >= 5 && (
                <Button variant="outline" className="w-full">
                    Barcha sharhlar ({reviews.length})
                </Button>
            )}

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.button
                            className="absolute top-4 right-4 w-10 h-10 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="w-6 h-6 text-foreground" />
                        </motion.button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-full rounded-2xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BusinessReviews;
