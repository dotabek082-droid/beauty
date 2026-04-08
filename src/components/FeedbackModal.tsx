import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Star, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { mockFeedbackQuestions, FEEDBACK_QUESTIONS_BY_CATEGORY } from "@/data/promotionData";

interface FeedbackQuestion {
  id: string;
  question_uz: string;
  question_ru: string;
  question_order: number;
}

interface FeedbackModalProps {
  bookingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isLottery?: boolean;
  category?: string;
}

const FeedbackModal = ({ bookingId, isOpen, onClose, isLottery = false, category = 'default' }: FeedbackModalProps) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("feedback_questions")
        .select("*")
        .eq("is_active", true)
        .order("question_order");

      if (error || !data || data.length === 0) {
        console.log("Using mock questions due to error or empty data");
        // Use category specific questions if available, otherwise default
        const categoryQuestions = FEEDBACK_QUESTIONS_BY_CATEGORY[category] || FEEDBACK_QUESTIONS_BY_CATEGORY['default'];

        const mappedMock = categoryQuestions.map(q => ({
          id: q.id,
          question_uz: q.questionUz,
          question_ru: q.questionRu,
          question_order: q.questionOrder
        }));
        setQuestions(mappedMock);
        return;
      }

      setQuestions(data);
    } catch (err) {
      console.error("Error:", err);
      const categoryQuestions = FEEDBACK_QUESTIONS_BY_CATEGORY[category] || FEEDBACK_QUESTIONS_BY_CATEGORY['default'];
      const mappedMock = categoryQuestions.map(q => ({
        id: q.id,
        question_uz: q.questionUz,
        question_ru: q.questionRu,
        question_order: q.questionOrder
      }));
      setQuestions(mappedMock);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotoFiles(prev => [...prev, ...newFiles]);

      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRatingChange = (questionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
  };

  const uploadPhoto = async (feedbackId: string, file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${feedbackId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("feedback-photos")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("feedback-photos")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!bookingId || !user) {
      toast.error("Xatolik yuz berdi");
      return;
    }

    if (photoFiles.length === 0) {
      toast.error("Iltimos, kamida bitta rasm yuklang");
      return;
    }

    const unansweredQuestions = questions.filter((q) => !ratings[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error("Iltimos, barcha savollarga javob bering");
      return;
    }

    if (overallRating === 0) {
      toast.error("Iltimos, umumiy bahoingizni bering");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create feedback response
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback_responses")
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          overall_rating: overallRating,
          additional_comments: comments || null,
        })
        .select()
        .single();

      if (feedbackError) {
        console.error("Feedback error:", feedbackError);
        toast.error("Xatolik yuz berdi");
        return;
      }

      // Upload photos and save URLs
      const uploadPromises = photoFiles.map(async (file) => {
        const photoUrl = await uploadPhoto(feedbackData.id, file);
        if (photoUrl) {
          return supabase
            .from("feedback_photos")
            .insert({
              feedback_id: feedbackData.id,
              photo_url: photoUrl,
            });
        }
      });

      await Promise.all(uploadPromises);

      // Save answers
      const answers = Object.entries(ratings).map(([questionId, rating]) => ({
        feedback_id: feedbackData.id,
        question_id: questionId,
        answer_rating: rating,
      }));

      const { error: answersError } = await supabase
        .from("feedback_answers")
        .insert(answers);

      if (answersError) {
        console.error("Answers error:", answersError);
      }

      toast.success("Fikr-mulohazangiz uchun rahmat!");
      handleClose();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRatings({});
    setOverallRating(0);
    setComments("");
    setPhotoFiles([]);
    setPhotoPreviews([]);
    onClose();
  };

  if (!bookingId) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {isLottery ? "Yutuq haqida fikringiz" : "Fikr-mulohaza"}
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" />
                      Natija rasmlari (majburiy)
                    </h4>

                    {photoPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {photoPreviews.map((preview, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removePhoto(idx);
                              }}
                              className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className="block">
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-secondary/20">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          Rasmlarni tanlash
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bir nechta rasm yuklashingiz mumkin
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      {isLottery ? "Yutuqli xizmatni baholang" : "Umumiy baho"}
                    </h4>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setOverallRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${star <= overallRating
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  {questions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Savollar</h4>
                      {questions.map((question, index) => (
                        <Card key={question.id} className="p-4">
                          <p className="text-sm text-foreground mb-3">
                            {index + 1}. {question.question_uz}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {question.question_ru}
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => handleRatingChange(question.id, rating)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${ratings[question.id] === rating
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                  }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Additional Comments */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Qo'shimcha fikrlar (ixtiyoriy)
                    </h4>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Fikrlaringizni yozing..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button
                className="w-full"
                variant="success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Yuborish
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
