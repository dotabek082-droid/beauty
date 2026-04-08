import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Quote, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewCardProps {
    review: {
        id: string;
        business_id: string;
        business_name: string;
        user_name: string;
        overall_rating: number;
        comment: string;
        created_at: string;
        photos?: string[];
    };
    onClick: () => void;
    className?: string;
    compact?: boolean; // For horizontal slider
}

const ReviewCard = ({ review, onClick, className = "", compact = false }: ReviewCardProps) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [likes, setLikes] = useState<string[]>([]);
    const [dislikes, setDislikes] = useState<string[]>([]);

    useEffect(() => {
        const loadInteractions = () => {
            try {
                const storedInteractions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
                const interaction = storedInteractions[review.id] || { likes: [], dislikes: [] };
                setLikes(interaction.likes || []);
                setDislikes(interaction.dislikes || []);
            } catch (e) {
                console.error("Error loading interactions", e);
            }
        };
        loadInteractions();
        // Optional: Listen to storage events to sync across tabs, but simple load is enough for now
    }, [review.id]);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast({ title: "Tizimga kiring", description: "Like qo'yish uchun tizimga kiring", variant: "destructive" });
            return;
        }

        const storedInteractions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
        const currentInteractions = storedInteractions[review.id] || { likes: [], dislikes: [], replies: [] };

        let newLikes = [...(currentInteractions.likes || [])];
        let newDislikes = [...(currentInteractions.dislikes || [])];

        if (newLikes.includes(user.id)) {
            newLikes = newLikes.filter((id: string) => id !== user.id);
        } else {
            newLikes.push(user.id);
            newDislikes = newDislikes.filter((id: string) => id !== user.id);
        }

        currentInteractions.likes = newLikes;
        currentInteractions.dislikes = newDislikes;
        storedInteractions[review.id] = currentInteractions;

        localStorage.setItem('review_interactions', JSON.stringify(storedInteractions));
        setLikes(newLikes);
        setDislikes(newDislikes);
    };

    const handleDislike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast({ title: "Tizimga kiring", description: "Dislike qo'yish uchun tizimga kiring", variant: "destructive" });
            return;
        }

        const storedInteractions = JSON.parse(localStorage.getItem('review_interactions') || '{}');
        const currentInteractions = storedInteractions[review.id] || { likes: [], dislikes: [], replies: [] };

        let newLikes = [...(currentInteractions.likes || [])];
        let newDislikes = [...(currentInteractions.dislikes || [])];

        if (newDislikes.includes(user.id)) {
            newDislikes = newDislikes.filter((id: string) => id !== user.id);
        } else {
            newDislikes.push(user.id);
            newLikes = newLikes.filter((id: string) => id !== user.id);
        }

        currentInteractions.likes = newLikes;
        currentInteractions.dislikes = newDislikes;
        storedInteractions[review.id] = currentInteractions;

        localStorage.setItem('review_interactions', JSON.stringify(storedInteractions));
        setLikes(newLikes);
        setDislikes(newDislikes);
    };

    const hasLiked = user && likes.includes(user.id);
    const hasDisliked = user && dislikes.includes(user.id);

    return (
        <div
            onClick={onClick}
            className={`bg-card group cursor-pointer relative rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-all active:scale-95 flex flex-col ${className}`}
        >
            {/* Header: User & Rating */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        {review.photos && review.photos.length > 0 ? (
                            <img src={review.photos[0]} alt="Reviewer" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-xs font-bold text-accent">
                                {review.user_name?.[0]?.toUpperCase() || "U"}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {review.user_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-xs font-bold">{review.overall_rating}</span>
                </div>
            </div>

            {/* Comment */}
            <div className="relative mb-3 flex-grow">
                <Quote className="absolute -top-1 -left-1 w-4 h-4 text-accent/20 rotate-180" />
                <p className={`text-sm text-foreground/80 pl-4 italic ${compact ? "line-clamp-2" : ""}`}>
                    "{review.comment}"
                </p>
            </div>

            {/* Photo (if available) */}
            {review.photos && review.photos.length > 0 && (
                <div className="h-32 mb-3 rounded-xl overflow-hidden relative flex-shrink-0">
                    <img
                        src={review.photos[0]}
                        alt="Review attachment"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {review.photos.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                            +{review.photos.length - 1}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                {/* Footer: Business Name */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground line-clamp-1 max-w-[100px]">
                        {review.business_name || "Salon"}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 transition-colors ${hasLiked ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"}`}
                    >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-primary" : ""}`} />
                        <span className="text-xs font-medium">{likes.length > 0 ? likes.length : ""}</span>
                    </button>
                    <button
                        onClick={handleDislike}
                        className={`flex items-center gap-1 transition-colors ${hasDisliked ? "text-destructive scale-110" : "text-muted-foreground hover:text-destructive"}`}
                    >
                        <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? "fill-destructive" : ""}`} />
                        <span className="text-xs font-medium">{dislikes.length > 0 ? dislikes.length : ""}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
