import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, MapPin, Loader2, MessageCircle, Plus, ThumbsUp, ThumbsDown, Verified, X, Trash2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import AddFeedbackDialog from "@/components/AddFeedbackDialog";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fakeClientReviews } from "@/data/fakeClientReviews";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface FeedbackItem {
  id: string;
  booking_id: string;
  overall_rating: number;
  additional_comments: string;
  created_at: string;
  photos?: string[];
  likes?: number;
  dislikes?: number;
  reply?: {
    comment: string;
    created_at: string;
  };
  promotion?: {
    service_name: string;
    salon_name: string;
    image_url: string | null;
  };
}

const MyReviewsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [interactions, setInteractions] = useState<Record<string, any>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Reduced to 5 as per request

  const deleteReview = async (reviewId: string) => {
    try {
      setLoading(true);

      // Find the review to calculate points to deduct
      const reviewToDelete = feedbacks.find(r => r.id === reviewId);
      if (!reviewToDelete) return;

      let pointsToDeduct = 0;
      let pointReason = "";

      let comment = "";
      let rating = reviewToDelete.overall_rating;
      let photos: string[] = [];

      try {
        const parsed = JSON.parse(reviewToDelete.additional_comments || '{}');
        comment = parsed.comment || "";
        photos = parsed.photos || [];
      } catch {
        comment = reviewToDelete.additional_comments;
      }

      if (photos.length > 0) {
        pointsToDeduct = 15;
        pointReason = "Sharh o'chirilishi (Suratli)";
      } else if (rating >= 4) {
        pointsToDeduct = 5;
        pointReason = "Sharh o'chirilishi";
      }

      // 1. Remove from localStorage (user_reviews)
      const storedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
      const updatedReviews = storedReviews.filter((r: any) => r.id !== reviewId);
      localStorage.setItem('user_reviews', JSON.stringify(updatedReviews));

      // 2. Add negative trust history entry
      if (pointsToDeduct > 0 && user) {
        const historyItem = {
          id: crypto.randomUUID(),
          action: pointReason,
          scoreChange: -pointsToDeduct,
          date: new Date().toISOString().split('T')[0],
          type: 'decrease'
        };
        const existingHistory = JSON.parse(localStorage.getItem('user_trust_history') || '[]');
        existingHistory.unshift(historyItem);
        localStorage.setItem('user_trust_history', JSON.stringify(existingHistory));

        // 3. Update trust score in Supabase
        const { data: currentProfile } = await import("@/integrations/supabase/client").then(m => m.supabase
            .from('profiles')
            .select('trust_score')
            .eq('user_id', user.id)
            .single()
        );

        if (currentProfile) {
            const newScore = Math.max(0, (currentProfile.trust_score || 0) - pointsToDeduct);
            await import("@/integrations/supabase/client").then(m => m.supabase
                .from('profiles')
                .update({ trust_score: newScore })
                .eq('user_id', user.id)
            );
        }
      }

      // Update UI state by removing the review
      setFeedbacks(prev => prev.filter(r => r.id !== reviewId));

      import("sonner").then(m => m.toast.success("Sharh muvaffaqiyatli o'chirildi va ballar qayta hisoblandi."));
    } catch (err) {
      console.error("Error deleting review:", err);
      import("sonner").then(m => m.toast.error("Sharhni o'chirishda xatolik yuz berdi."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeedbacks();
      fetchInteractions();
    }
  }, [user]);

  // Handle Page Change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchFeedbacks = () => {
    try {
      if (!user?.id) {
        setFeedbacks([]);
        setLoading(false);
        return;
      }

      // Load reviews from localStorage
      const storedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');

      // Filter for current user and format for display
      const userReviews = storedReviews
        .filter((review: any) => review.user_id === user.id)
        .map((review: any) => ({
          id: review.id,
          booking_id: review.id,
          overall_rating: review.overall_rating,
          additional_comments: JSON.stringify({
            business_id: review.business_id,
            business_name: review.business_name,
            comment: review.comment,
            service_quality: review.service_quality,
            cleanliness: review.cleanliness,
            value_for_money: review.value_for_money
          }),
          created_at: review.created_at,
          user_id: review.user_id,
          photos: review.photos || [],
          promotion: undefined
        }));

      // Transform fake reviews to match existing structure and assign to current user for demo
      const formattedFakeReviews = fakeClientReviews.map(review => ({
        id: review.id,
        booking_id: review.id,
        overall_rating: review.overall_rating,
        additional_comments: JSON.stringify({
          business_id: review.business_id,
          business_name: review.business_name,
          comment: review.comment,
          service_quality: review.service_quality,
          cleanliness: review.cleanliness,
          value_for_money: review.value_for_money
        }),
        created_at: review.created_at,
        user_id: user.id, // Assign to current user
        photos: review.photos || [],
        likes: (review as any).likes || 0,
        dislikes: (review as any).dislikes || 0,
        reply: (review as any).reply,
        promotion: undefined
      }));

      // Combine and sort by date (newest first)
      const allReviews = [...formattedFakeReviews, ...userReviews].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setFeedbacks(allReviews);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([]);
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

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between gap-3 p-3 safe-top">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground leading-5 truncate">Fikrlarim</h1>
              <p className="text-xs text-muted-foreground truncate">
                {loading ? "Yuklanmoqda..." : `${feedbacks.length} ta fikr`}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-full flex items-center gap-1.5 shadow-sm font-medium hover:scale-105 active:scale-95 transition-all shrink-0 bg-primary text-primary-foreground px-3 py-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-xs">Fikr qoldirish</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : feedbacks.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Hali fikr qoldirmadingiz</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Xizmatlardan foydalanganingizdan so'ng fikr bildiring
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border/40" />

              {feedbacks
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((feedback, index) => {
                  let parsedData: any = {};
                  try {
                    parsedData = JSON.parse(feedback.additional_comments || '{}');
                  } catch {
                    parsedData = { comment: feedback.additional_comments };
                  }

                  const reviewInteraction = interactions[feedback.id] || { likes: [], dislikes: [], replies: [] };
                  const displayPhotos = feedback.photos ? feedback.photos.slice(0, 3) : [];
                  const remainingPhotos = (feedback.photos?.length || 0) - 3;

                  // Use fake stats if available, otherwise fallback to local interactions
                  const likesCount = (feedback.likes || 0) + (reviewInteraction.likes?.length || 0);
                  const dislikesCount = (feedback.dislikes || 0) + (reviewInteraction.dislikes?.length || 0);

                  return (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-8 pb-4 last:pb-0 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[10px] top-3.5 w-2 h-2 rounded-full bg-primary/20 border-2 border-primary z-10" />

                      <div className="p-3 bg-card border border-border/40 rounded-xl shadow-sm hover:shadow transition-all space-y-2.5">
                        {/* Header: Service Info + Date */}
                        {(feedback.promotion || parsedData.business_name) && (
                          <div className="flex items-start justify-between gap-3 pb-2 border-b border-border/30">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Avatar className="w-8 h-8 rounded-lg shrink-0">
                                <img
                                  src={feedback.promotion?.image_url || "/placeholder.svg"}
                                  alt={feedback.promotion?.service_name || parsedData.business_name}
                                  className="object-cover"
                                />
                                <AvatarFallback className="rounded-lg text-[10px]">
                                  {(feedback.promotion?.service_name || parsedData.business_name)?.[0] || "S"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-xs leading-4 truncate">
                                  {feedback.promotion?.service_name || parsedData.business_name}
                                </h3>
                                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground mt-0.5">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span className="truncate max-w-[150px]">{feedback.promotion?.salon_name || "Tanlangan xizmat"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                                {formatDate(feedback.created_at)}
                              </span>
                              <button
                                onClick={() => setReviewToDeleteId(feedback.id)}
                                className="text-muted-foreground hover:text-destructive active:scale-90 transition-all p-1 hover:bg-secondary rounded-full"
                                title="Sharhni o'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Content: Rating & Comment */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {renderStars(feedback.overall_rating)}
                            </div>
                            <span className="text-xs font-bold text-foreground">{feedback.overall_rating}/5</span>
                          </div>

                          {parsedData.comment && (
                            <p className="text-xs leading-5 text-foreground/80">
                              {parsedData.comment}
                            </p>
                          )}
                        </div>

                        {/* Photos Grid - Compact */}
                        {feedback.photos && feedback.photos.length > 0 && (
                          <div className="flex gap-2 mt-2 overflow-hidden">
                            {displayPhotos.map((photo, i) => (
                              <div
                                key={i}
                                className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border/50 cursor-pointer hover:opacity-90"
                                onClick={() => setSelectedImage(photo)}
                              >
                                <img src={photo} className="w-full h-full object-cover" alt="Review" />
                              </div>
                            ))}
                            {remainingPhotos > 0 && (
                              <div
                                className="w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-secondary/70 border border-border/50"
                                onClick={() => setSelectedImage(feedback.photos![3])} // Open 4th image for now
                              >
                                +{remainingPhotos}
                              </div>
                            )}
                          </div>
                        )}


                        {/* Business Reply */}
                        {feedback.reply && (
                          <div className="mt-3 bg-muted/30 p-2.5 rounded-lg border-l-2 border-primary/50 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-semibold text-primary">Biznes javobi</span>
                              <span className="text-[9px] text-muted-foreground">{formatDate(feedback.reply.created_at)}</span>
                            </div>
                            <p className="text-[11px] text-foreground/80 leading-snug">
                              {feedback.reply.comment}
                            </p>
                          </div>
                        )}

                        {/* Footer: Interactions */}
                        <div className="flex items-center gap-4 pt-1.5">
                          <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{likesCount}</span>
                          </button>
                          <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                            <span>{dislikesCount}</span>
                          </button>
                          {reviewInteraction.replies?.length > 0 && !feedback.reply && (
                            <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded ml-auto">
                              <MessageCircle className="w-3 h-3" />
                              <span>Javob bor</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Pagination Controls */}
            {Math.ceil(feedbacks.length / itemsPerPage) > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 pb-20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 text-xs"
                >
                  Oldingi
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(feedbacks.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === page
                        ? "bg-primary text-primary-foreground"
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
                  onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(feedbacks.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(feedbacks.length / itemsPerPage)}
                  className="h-8 text-xs"
                >
                  Keyingi
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-10 right-0 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}


      <AddFeedbackDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          fetchFeedbacks();
          fetchInteractions();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!reviewToDeleteId} onOpenChange={(open) => !open && setReviewToDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Sharhni o'chirish
            </DialogTitle>
            <DialogDescription>
              Haqiqatan ham ushbu sharhni o'chirmoqchimisiz? Ushbu amal ortga qaytarilmaydi va sharh uchun berilgan trust-ballar chegirib tashlanadi.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewToDeleteId(null)}
              disabled={loading}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (reviewToDeleteId) {
                  deleteReview(reviewToDeleteId);
                  setReviewToDeleteId(null);
                }
              }}
              disabled={loading}
            >
              {loading ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default MyReviewsPage;
