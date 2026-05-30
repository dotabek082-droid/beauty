import { motion } from "framer-motion";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewCard from "@/components/ReviewCard";
import { mockBusinesses } from "@/data/businessData";

interface Review {
    id: string;
    business_id: string;
    business_name: string;
    user_id: string;
    user_name: string;
    overall_rating: number;
    comment: string;
    created_at: string;
    photos?: string[];
    reply?: {
        comment: string;
        created_at: string;
    };
}

const ReviewsPage = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for better UX
        const timer = setTimeout(() => {
            try {
                const storedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');

                // Sort by date (newest first)
                const sortedReviews = storedReviews
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                // Enhance with business details
                const storedInteractions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
                const enhancedReviews = sortedReviews.map((review: any) => {
                    let businessName = review.business_name;
                    const business = mockBusinesses.find(b => b.id === review.business_id);
                    if (business) {
                        businessName = business.name;
                    }

                    let comment = review.comment;
                    let photos = review.photos || [];

                    if (!comment && review.additional_comments) {
                        try {
                            const parsed = JSON.parse(review.additional_comments);
                            comment = parsed.comment;
                            if (parsed.photos) photos = parsed.photos;
                        } catch (e) {
                            comment = review.additional_comments;
                        }
                    }

                    const interaction = storedInteractions[review.id] || {};
                    const interactionReply = interaction.replies?.[0];
                    const reply = review.reply || (interactionReply ? {
                        comment: interactionReply.comment,
                        created_at: interactionReply.created_at
                    } : undefined);

                    return {
                        ...review,
                        business_name: businessName,
                        comment: comment,
                        photos: photos,
                        reply: reply
                    };
                });

                setReviews(enhancedReviews);
            } catch (error) {
                console.error("Error loading reviews:", error);
            } finally {
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-foreground"
                >
                    Barcha sharhlar
                </motion.h1>
            </div>

            {/* Reviews List */}
            <div className="px-4 space-y-3">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-secondary/30 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ReviewCard
                                    review={review}
                                    onClick={() => navigate(`/salon/${review.business_id}`)}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Sharhlar yo'q</h2>
                        <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                            Hozircha hech qanday sharh qoldirilmagan.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
