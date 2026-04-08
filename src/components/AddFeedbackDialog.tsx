import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mockBusinesses } from "@/data/businessData";
import { categories } from "@/data/categories";

interface AddFeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    defaultBusinessId?: string;
}

const AddFeedbackDialog = ({ open, onOpenChange, onSuccess, defaultBusinessId }: AddFeedbackDialogProps) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedService, setSelectedService] = useState(defaultBusinessId || "");
    const [overallRating, setOverallRating] = useState(0);
    const [comment, setComment] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);

    // Initialize with default business if provided
    useEffect(() => {
        if (defaultBusinessId && open) {
            const business = mockBusinesses.find(b => b.id === defaultBusinessId);
            if (business) {
                setSelectedService(defaultBusinessId);
                setSelectedCategory(business.category);
            }
        }
    }, [defaultBusinessId, open]);

    // Get services based on selected category
    const availableServices = selectedCategory
        ? mockBusinesses.filter(b => b.category === selectedCategory)
        : [];

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (photos.length + files.length > 5) {
            toast({
                title: "Xato",
                description: "Maksimal 5 ta rasm yuklash mumkin",
                variant: "destructive"
            });
            return;
        }

        // Validate file sizes
        const invalidFiles = files.filter(f => f.size > 5 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            toast({
                title: "Xato",
                description: "Har bir rasm 5MB dan oshmasligi kerak",
                variant: "destructive"
            });
            return;
        }

        setPhotos(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreview(prev => prev.filter((_, i) => i !== index));
    };

    const renderStarRating = (rating: number, setRating: (val: number) => void, label: string) => {
        return (
            <div className="space-y-2">
                <Label>{label}</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-muted text-muted-foreground"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Xato",
                description: "Fikr qoldirish uchun tizimga kiring",
                variant: "destructive"
            });
            return;
        }

        if (!selectedCategory || !selectedService) {
            toast({
                title: "Xato",
                description: "Kategoriya va xizmatni tanlang",
                variant: "destructive"
            });
            return;
        }

        if (overallRating === 0) {
            toast({
                title: "Xato",
                description: "Umumiy baho berishni unutmang",
                variant: "destructive"
            });
            return;
        }

        // Validation: Minimum 20 characters
        if (comment.trim().length < 20) {
            toast({
                title: "Xato",
                description: "Sharh kamida 20 ta belgidan iborat bo'lishi kerak",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            // Get selected business details
            const selectedBusiness = mockBusinesses.find(b => b.id === selectedService);

            console.log("Submitting feedback for:", {
                business_id: selectedService,
                business_name: selectedBusiness?.name,
                rating: overallRating
            });

            // Calculate Trust Score Points
            let pointsEarned = 0;
            let pointReason = "";

            if (photos.length > 0) {
                pointsEarned += 15;
                pointReason = "Suratli sharh";
            } else if (overallRating >= 4) {
                pointsEarned += 5;
                pointReason = "Ijobiy sharh";
            }

            // TEMPORARY WORKAROUND: Save to localStorage instead of database
            // This works immediately without database migration
            const review = {
                id: crypto.randomUUID(),
                business_id: selectedService,
                business_name: selectedBusiness?.name || "Unknown",
                user_id: user.id,
                user_name: user.user_metadata?.full_name || user.email || "Anonymous",
                category: selectedCategory,
                overall_rating: overallRating,
                comment: comment.trim(),
                photos: photoPreview, // Save base64 images
                created_at: new Date().toISOString()
            };

            console.log("Saving review to localStorage:", review);

            // Get existing reviews from localStorage
            const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');

            // Add new review
            existingReviews.push(review);

            // Save back to localStorage
            localStorage.setItem('user_reviews', JSON.stringify(existingReviews));

            // Update Trust History (localStorage)
            if (pointsEarned > 0) {
                const historyItem = {
                    id: crypto.randomUUID(),
                    action: pointReason,
                    scoreChange: pointsEarned,
                    date: new Date().toISOString().split('T')[0],
                    type: 'increase'
                };
                const existingHistory = JSON.parse(localStorage.getItem('user_trust_history') || '[]');
                existingHistory.unshift(historyItem); // Add to top
                localStorage.setItem('user_trust_history', JSON.stringify(existingHistory));

                // Update Profile Trust Score (Supabase)
                // We fetch current score first to be safe, or just increment
                // Since we don't have an increment RPC easily available, we'll try to update directly
                // assuming we have the latest profile from context, but context might be stale.
                // Best to fetch fresh or just use what we have if we accept minor race conditions.
                // Let's use a direct RPC if possible, but for now we'll do a read-modify-write.

                // Ideally:
                // const { error: scoreError } = await supabase.rpc('increment_trust_score', { user_id: user.id, amount: pointsEarned });

                // Fallback:
                const { data: currentProfile } = await import("@/integrations/supabase/client").then(m => m.supabase
                    .from('profiles')
                    .select('trust_score')
                    .eq('user_id', user.id)
                    .single()
                );

                if (currentProfile) {
                    const newScore = (currentProfile.trust_score || 0) + pointsEarned;
                    await import("@/integrations/supabase/client").then(m => m.supabase
                        .from('profiles')
                        .update({ trust_score: newScore })
                        .eq('user_id', user.id)
                    );
                }
            }

            console.log("Review saved successfully!");

            toast({
                title: "Muvaffaqiyatli!",
                description: pointsEarned > 0
                    ? `Fikringiz saqlandi! Siz +${pointsEarned} ball oldingiz!`
                    : "Fikringiz saqlandi va ko'rsatiladi!",
            });

            // Reset form
            setSelectedCategory("");
            setSelectedService("");
            setOverallRating(0);
            setComment("");
            setPhotos([]);
            setPhotoPreview([]);

            // Close dialog
            onOpenChange(false);

            // Refresh the feedback list
            if (onSuccess) {
                console.log("Calling onSuccess to refresh");
                setTimeout(() => onSuccess(), 100);
            }

            // Force reload to update header badge if needed (or use context refresh)
            // window.location.reload(); // Too aggressive

        } catch (error: any) {
            console.error("Error submitting feedback:", error);

            toast({
                title: "Xato",
                description: error?.message || "Fikr saqlashda xatolik",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Fikr qoldiring</DialogTitle>
                    <DialogDescription>
                        Xizmat haqida o'z fikringizni bildiring
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Category & Service Selection - Only show if not pre-selected */}
                    {!defaultBusinessId && (
                        <>
                            <div className="space-y-2">
                                <Label>Kategoriya</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategoriyani tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.slice(0, 10).map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.nameUz}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Xizmat</Label>
                                <Select
                                    value={selectedService}
                                    onValueChange={setSelectedService}
                                    disabled={!selectedCategory}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Xizmatni tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableServices.map((service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* Overall Rating */}
                    {renderStarRating(overallRating, setOverallRating, "Umumiy baho *")}

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label>Sharhingiz</Label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Xizmat haqida batafsil yozing..."
                            rows={4}
                            className={comment.length > 0 && comment.length < 20 ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        <div className="flex justify-between items-center text-xs">
                            <span className={`${comment.length >= 20 ? "text-green-600" : "text-muted-foreground"}`}>
                                {comment.length >= 20
                                    ? "Reyting uchun yetarli"
                                    : `Reyting olish uchun yana ${20 - comment.length} ta belgi yozing`}
                            </span>
                            <span className="text-muted-foreground">
                                {comment.length} / 20
                            </span>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <Label>Rasmlar (ixtiyoriy, maksimal 5 ta)</Label>
                        <div className="space-y-3">
                            {photoPreview.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {photoPreview.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {photos.length < 5 && (
                                <label className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition">
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Rasm yuklash</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading || uploading}
                        >
                            Bekor qilish
                        </Button>
                        <Button type="submit" disabled={loading || uploading || comment.trim().length < 20}>
                            {loading || uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {uploading ? "Rasmlar yuklanmoqda..." : "Saqlanmoqda..."}
                                </>
                            ) : (
                                "Yuborish"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent >
        </Dialog >
    );
};

export default AddFeedbackDialog;
