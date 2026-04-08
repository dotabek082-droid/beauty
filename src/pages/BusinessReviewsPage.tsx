import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MessageCircle, MapPin, User, Reply, ThumbsUp, ThumbsDown, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fakeClientReviews } from "@/data/fakeClientReviews";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BusinessReview {
    id: string;
    clientName: string;
    clientAvatar?: string;
    overall_rating: number;
    comment: string;
    created_at: string;
    photos?: string[];
    likes: number;
    dislikes: number;
    reply?: {
        comment: string;
        created_at: string;
    };
    serviceName?: string;
}

const BusinessReviewsPage = () => {
    const navigate = useNavigate();
    const { user, isRole } = useAuth();
    const [reviews, setReviews] = useState<BusinessReview[]>([]);
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [filter, setFilter] = useState<'all' | 'replied' | 'unreplied'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'rating_high' | 'rating_low'>('newest');

    // Simulate fetching reviews for THIS business
    useEffect(() => {
        if (!user) return;

        const myReviews = fakeClientReviews.slice(0, 15).map((r, i) => ({
            id: r.id,
            clientName: i % 2 === 0 ? "Aziza Karimova" : "Jamshid Oripov",
            clientAvatar: i % 2 === 0 ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
            overall_rating: r.overall_rating,
            comment: r.comment,
            created_at: r.created_at,
            photos: r.photos,
            // @ts-ignore
            likes: r.likes || 0,
            // @ts-ignore
            dislikes: r.dislikes || 0,
            reply: r.reply,
            serviceName: r.business_name
        }));

        setReviews(myReviews);
    }, [user]);

    // Protect route
    useEffect(() => {
        if (user && !isRole("business_owner")) {
            navigate("/profile/reviews");
        }
    }, [user, isRole, navigate]);

    const handleReplyClick = (reviewId: string) => {
        setSelectedReviewId(reviewId);
        setReplyText("");
        setReplyDialogOpen(true);
    };

    const submitReply = () => {
        if (!replyText.trim()) return;

        setReviews(prev => prev.map(r => {
            if (r.id === selectedReviewId) {
                return {
                    ...r,
                    reply: {
                        comment: replyText,
                        created_at: new Date().toISOString()
                    }
                };
            }
            return r;
        }));

        toast.success("Javobingiz yuborildi");
        setReplyDialogOpen(false);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"}`}
            />
        ));
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM, HH:mm");
        } catch {
            return dateStr;
        }
    };

    const filteredReviews = reviews
        .filter(r => {
            if (filter === 'replied') return !!r.reply;
            if (filter === 'unreplied') return !r.reply;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'rating_high') return b.overall_rating - a.overall_rating;
            if (sortBy === 'rating_low') return a.overall_rating - b.overall_rating;
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="flex items-center gap-3 p-3 safe-top">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="h-8 w-8">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Mijozlar Sharhlari</h1>
                        <p className="text-xs text-muted-foreground">Xizmatlaringizga bildirilgan fikrlar</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 h-8">
                                <Filter className="w-3.5 h-3.5" />
                                {filter === 'all' ? 'Barchasi' : filter === 'replied' ? 'Javob berilgan' : 'Javob berilmagan'}
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setFilter('all')}>
                                Barchasi
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('replied')}>
                                Javob berilgan
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('unreplied')}>
                                Javob berilmagan
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 h-8">
                                <Star className="w-3.5 h-3.5" />
                                {sortBy === 'newest' ? 'Eng yangi' : sortBy === 'rating_high' ? 'Yuqori baho' : 'Past baho'}
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setSortBy('newest')}>
                                Eng yangi
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('rating_high')}>
                                Yuqori baho
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('rating_low')}>
                                Past baho
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <AnimatePresence mode="popLayout">
                    {filteredReviews.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageCircle className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-sm font-medium">Sharhlar topilmadi</h3>
                        </motion.div>
                    ) : (
                        filteredReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="p-4 space-y-3">
                                        {/* Client Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border ring-2 ring-background">
                                                    <AvatarImage src={review.clientAvatar} />
                                                    <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-sm leading-none mb-1">{review.clientName}</h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex gap-0.5">
                                                            {renderStars(review.overall_rating)}
                                                        </div>
                                                        <span className="text-xs font-medium text-foreground">{review.overall_rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-secondary/50 px-2 py-1 rounded-full">
                                                {formatDate(review.created_at)}
                                            </span>
                                        </div>

                                        {/* Comment */}
                                        <div className="bg-muted/10 p-3 rounded-lg">
                                            <p className="text-sm text-foreground/90 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>

                                        {/* Photos */}
                                        {review.photos && review.photos.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide">
                                                {review.photos.map((photo, i) => (
                                                    <img
                                                        key={i}
                                                        src={photo}
                                                        alt="Review"
                                                        className="w-20 h-20 object-cover rounded-lg border shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions & Stats */}
                                        <div className="flex items-center justify-between pt-2 border-t border-dashed">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                    <span className="font-medium">{review.likes}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
                                                    <ThumbsDown className="w-3.5 h-3.5" />
                                                    <span className="font-medium">{review.dislikes}</span>
                                                </div>
                                            </div>

                                            {!review.reply && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10 ml-auto"
                                                    onClick={() => handleReplyClick(review.id)}
                                                >
                                                    <Reply className="w-4 h-4" />
                                                    Javob yozish
                                                </Button>
                                            )}
                                        </div>

                                        {/* Reply Section */}
                                        {review.reply && (
                                            <div className="mt-3 ml-4 bg-primary/5 p-3 rounded-lg border-l-2 border-primary relative">
                                                <div className="absolute -left-[22px] top-4 w-4 h-4 border-l-2 border-b-2 border-border rounded-bl-lg" />
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                        Sizning javobingiz
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {formatDate(review.reply.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground/80 italic">
                                                    "{review.reply.comment}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Reply Dialog */}
            <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Javob yozish</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <p className="text-sm text-muted-foreground">
                            Mijoz fikriga muloyimlik bilan javob qaytaring.
                        </p>
                        <Textarea
                            placeholder="Rahmat, sizni yana kutib qolamiz..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={submitReply}>Yuborish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BusinessReviewsPage;
