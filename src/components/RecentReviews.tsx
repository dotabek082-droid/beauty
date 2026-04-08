import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockBusinesses } from "@/data/businessData";
import ReviewCard from "./ReviewCard";

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
}

const RecentReviews = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const loadReviews = () => {
            try {
                const storedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');

                // Sort by date (newest first) and take top 10
                const sortedReviews = storedReviews
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 10);

                // Enhance with business details if missing name
                const enhancedReviews = sortedReviews.map((review: any) => {
                    // Try to find business name if missing or match ID to mock data
                    let businessName = review.business_name;
                    const business = mockBusinesses.find(b => b.id === review.business_id);
                    if (business) {
                        businessName = business.name;
                    }

                    // Handle additional_comments if legacy format
                    let comment = review.comment;
                    let photos = review.photos || [];

                    // If comment is missing but additional_comments exists
                    if (!comment && review.additional_comments) {
                        try {
                            const parsed = JSON.parse(review.additional_comments);
                            comment = parsed.comment;
                            if (parsed.photos) photos = parsed.photos;
                        } catch (e) {
                            comment = review.additional_comments;
                        }
                    }

                    return {
                        ...review,
                        business_name: businessName,
                        comment: comment,
                        photos: photos
                    };
                });

                setReviews(enhancedReviews);
            } catch (error) {
                console.error("Error loading recent reviews:", error);
            }
        };

        loadReviews();
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (reviews.length === 0) return;

        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollInterval: NodeJS.Timeout;
        let isScrollingRight = true;

        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!container) return;
                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;

                if (isScrollingRight) {
                    if (currentScroll >= maxScroll - 5) {
                        isScrollingRight = false;
                        // Optional: Pause at the end
                    } else {
                        container.scrollLeft += 1;
                    }
                } else {
                    if (currentScroll <= 5) {
                        isScrollingRight = true;
                    } else {
                        container.scrollLeft -= 1;
                    }
                }
            }, 50); // Speed
        };

        const timer = setTimeout(startAutoScroll, 2000);

        const handleMouseEnter = () => clearInterval(scrollInterval);
        const handleMouseLeave = () => startAutoScroll();

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearTimeout(timer);
            clearInterval(scrollInterval);
            if (container) {
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [reviews.length]);

    if (reviews.length === 0) return null;

    return (
        <div className="-mx-4 px-4 overflow-hidden py-2">
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1"
            >
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[300px] max-w-[300px]"
                    >
                        <ReviewCard
                            review={review}
                            onClick={() => navigate(`/salon/${review.business_id}`)}
                            compact={true}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentReviews;
