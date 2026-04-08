import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft, User, Phone, Clock, Store, Upload, Loader2,
    Check, X, Wifi, CreditCard, ParkingCircle, Accessibility,
    Image as ImageIcon, Trash2, Plus, MapPin
} from "lucide-react";
import { LocationPicker } from "@/components/business/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EditBusinessInfo = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        business_description: "",
        avatar_url: "",
        hours: {} as Record<string, { open: string; close: string; closed: boolean }>,
        location: { lat: 41.2995, lng: 69.2401 },
    });

    const [amenities, setAmenities] = useState({
        freeWifi: false,
        acceptsCreditCards: false,
        parking: false,
        wheelchairAccessible: false,
    });

    const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
    const [salonPhotos, setSalonPhotos] = useState<string[]>([]);

    useEffect(() => {
        if (profile) {
            const defaultHours = {
                monday: { open: "09:00", close: "18:00", closed: false },
                tuesday: { open: "09:00", close: "18:00", closed: false },
                wednesday: { open: "09:00", close: "18:00", closed: false },
                thursday: { open: "09:00", close: "18:00", closed: false },
                friday: { open: "09:00", close: "18:00", closed: false },
                saturday: { open: "10:00", close: "16:00", closed: false },
                sunday: { open: "00:00", close: "00:00", closed: true },
            };

            setFormData({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                business_description: profile.business_description || "",
                avatar_url: profile.avatar_url || "",
                hours: (profile.hours as any) || defaultHours,
                location: (profile as any).location || { lat: 41.2995, lng: 69.2401 },
            });

            // Load amenities if available
            // For now using mock data, in real app this would come from profile
            setAmenities({
                freeWifi: true,
                acceptsCreditCards: true,
                parking: false,
                wheelchairAccessible: false,
            });

            // Load photos from localStorage for demo
            const storedPortfolio = localStorage.getItem("portfolio_photos");
            const storedSalon = localStorage.getItem("salon_photos");

            setPortfolioPhotos(storedPortfolio ? JSON.parse(storedPortfolio) : [
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=60"
            ]);

            setSalonPhotos(storedSalon ? JSON.parse(storedSalon) : [
                "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&auto=format&fit=crop&q=60"
            ]);
        }
    }, [profile]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Xato",
                    description: "Iltimos, rasm yuklang",
                    variant: "destructive",
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Xato",
                    description: "Rasm hajmi 5MB dan oshmasligi kerak",
                    variant: "destructive",
                });
                return;
            }

            setUploading(true);

            const fileExt = file.name.split(".").pop();
            const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));

            toast({
                title: "Muvaffaqiyatli",
                description: "Rasm yuklandi",
            });
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Xato",
                description: "Rasm yuklanmadi. Qaytadan urinib ko'ring",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create temporary URL for demo
        const reader = new FileReader();
        reader.onload = () => {
            const newPhoto = reader.result as string;
            setPortfolioPhotos((prev) => [...prev, newPhoto]);
            toast({
                title: "Muvaffaqiyatli",
                description: "Rasm qo'shildi",
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSalonPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const newPhoto = reader.result as string;
            setSalonPhotos((prev) => [...prev, newPhoto]);
            toast({
                title: "Muvaffaqiyatli",
                description: "Rasm qo'shildi",
            });
        };
        reader.readAsDataURL(file);
    };

    const deletePortfolioPhoto = (index: number) => {
        setPortfolioPhotos((prev) => prev.filter((_, i) => i !== index));
        toast({
            title: "O'chirildi",
            description: "Rasm o'chirildi",
        });
    };

    const deleteSalonPhoto = (index: number) => {
        setSalonPhotos((prev) => prev.filter((_, i) => i !== index));
        toast({
            title: "O'chirildi",
            description: "Rasm o'chirildi",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name.trim()) {
            toast({
                title: "Xato",
                description: "Biznes nomini kiriting",
                variant: "destructive",
            });
            return;
        }

        if (!formData.phone.trim()) {
            toast({
                title: "Xato",
                description: "Telefon raqamni kiriting",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    business_description: formData.business_description,
                    avatar_url: formData.avatar_url,
                    hours: formData.hours as any,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", profile?.id);

            if (error) throw error;

            // Save photos to localStorage for demo
            localStorage.setItem("portfolio_photos", JSON.stringify(portfolioPhotos));
            localStorage.setItem("salon_photos", JSON.stringify(salonPhotos));

            toast({
                title: "Muvaffaqiyatli",
                description: "Ma'lumotlar saqlandi",
            });

            navigate("/business?tab=profile");
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Xato",
                description: "Ma'lumotlar saqlanmadi. Qaytadan urinib ko'ring",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const dayLabels: Record<string, string> = {
        monday: "Dushanba",
        tuesday: "Seshanba",
        wednesday: "Chorshanba",
        thursday: "Payshanba",
        friday: "Juma",
        saturday: "Shanba",
        sunday: "Yakshanba",
    };

    return (
        <div className="min-h-screen bg-gradient-warm pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="px-4 py-4 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/business?tab=profile")}
                        className="shrink-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-bold">Biznes ma'lumotlarini tahrirlash</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-4 pt-6 space-y-6">
                {/* Basic Information */}
                <Card className="p-5 space-y-5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Store className="w-5 h-5 text-primary" />
                        Asosiy ma'lumotlar
                    </h2>

                    {/* Avatar */}
                    <div className="space-y-2">
                        <Label>Profil rasmi</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center overflow-hidden border-2 border-border">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <Label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Business Name */}
                    <div className="space-y-2">
                        <Label htmlFor="business-name">Biznes nomi *</Label>
                        <Input
                            id="business-name"
                            value={formData.full_name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Masalan: Elite Beauty Salon"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefon raqam *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="+998 90 123 45 67"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Biznes haqida</Label>
                        <Textarea
                            id="description"
                            value={formData.business_description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, business_description: e.target.value }))}
                            placeholder="Biznesingiz haqida qisqacha ma'lumot..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </Card>

                {/* Working Hours */}
                <Card className="p-5 space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Ish vaqti
                    </h2>

                    <div className="space-y-3">
                        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                            const dayKey = day as keyof typeof formData.hours;
                            const schedule = formData.hours[dayKey] || { open: "09:00", close: "18:00", closed: false };

                            return (
                                <div key={day} className="flex items-center gap-3 text-sm">
                                    <div className="w-28 font-medium text-muted-foreground">
                                        {dayLabels[day]}
                                    </div>

                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`closed-${day}`}
                                            checked={!schedule.closed}
                                            onChange={(e) => {
                                                const newHours = { ...formData.hours };
                                                if (!newHours[dayKey]) newHours[dayKey] = { open: "09:00", close: "18:00", closed: false };
                                                newHours[dayKey].closed = !e.target.checked;
                                                setFormData((prev) => ({ ...prev, hours: newHours }));
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        {schedule.closed ? (
                                            <span className="text-muted-foreground italic text-xs">Yopiq</span>
                                        ) : (
                                            <>
                                                <Input
                                                    type="time"
                                                    value={schedule.open}
                                                    onChange={(e) => {
                                                        const newHours = { ...formData.hours };
                                                        newHours[dayKey] = { ...schedule, open: e.target.value };
                                                        setFormData((prev) => ({ ...prev, hours: newHours }));
                                                    }}
                                                    className="h-9 w-28 text-sm"
                                                />
                                                <span className="text-muted-foreground">-</span>
                                                <Input
                                                    type="time"
                                                    value={schedule.close}
                                                    onChange={(e) => {
                                                        const newHours = { ...formData.hours };
                                                        newHours[dayKey] = { ...schedule, close: e.target.value };
                                                        setFormData((prev) => ({ ...prev, hours: newHours }));
                                                    }}
                                                    className="h-9 w-28 text-sm"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Location Map */}
                <Card className="p-5 space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Manzilni belgilash
                    </h2>
                    <div className="space-y-2">
                        <LocationPicker
                            value={formData.location}
                            onChange={(loc) => setFormData(prev => ({ ...prev, location: loc }))}
                        />
                        <p className="text-xs text-muted-foreground">Xaritada joylashuvni o'zgartirish uchun belgilang.</p>
                    </div>
                </Card>

                {/* Amenities */}
                <Card className="p-5 space-y-4">
                    <h2 className="text-lg font-bold">Xususiyatlar</h2>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={amenities.freeWifi}
                                onChange={(e) => setAmenities((prev) => ({ ...prev, freeWifi: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Wifi className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium">Bepul Wi-Fi</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={amenities.acceptsCreditCards}
                                onChange={(e) => setAmenities((prev) => ({ ...prev, acceptsCreditCards: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <CreditCard className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium">Bank kartalari qabul qilinadi</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={amenities.parking}
                                onChange={(e) => setAmenities((prev) => ({ ...prev, parking: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <ParkingCircle className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium">Parking mavjud</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={amenities.wheelchairAccessible}
                                onChange={(e) => setAmenities((prev) => ({ ...prev, wheelchairAccessible: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Accessibility className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-medium">Nogironlar uchun qulay</span>
                        </label>
                    </div>
                </Card>

                {/* Portfolio Photos */}
                <Card className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Ishlar galereyasi
                        </h2>
                        <span className="text-sm text-muted-foreground">{portfolioPhotos.length} ta rasm</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {portfolioPhotos.map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-xl overflow-hidden">
                                    <img src={photo} alt="" className="w-full h-full object-cover" />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deletePortfolioPhoto(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}

                        {/* Add Photo Button */}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePortfolioUpload}
                                className="hidden"
                            />
                            <Plus className="w-8 h-8 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">Rasm qo'shish</span>
                        </label>
                    </div>
                </Card>

                {/* Salon Photos */}
                <Card className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Salon ko'rinishi</h2>
                        <span className="text-sm text-muted-foreground">{salonPhotos.length} ta rasm</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {salonPhotos.map((photo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-xl overflow-hidden">
                                    <img src={photo} alt="" className="w-full h-full object-cover" />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteSalonPhoto(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}

                        {/* Add Photo Button */}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleSalonPhotoUpload}
                                className="hidden"
                            />
                            <Plus className="w-8 h-8 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">Rasm qo'shish</span>
                        </label>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 sticky bottom-4 bg-background/95 backdrop-blur-sm p-4 -mx-4 border-t border-border">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/business?tab=profile")}
                        className="flex-1"
                        disabled={loading}
                    >
                        Bekor qilish
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading || uploading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saqlanmoqda...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Saqlash
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditBusinessInfo;
