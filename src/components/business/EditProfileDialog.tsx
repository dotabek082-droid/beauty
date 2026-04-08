import { useState, useEffect } from "react";
import { LocationPicker } from "@/components/business/LocationPicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Clock, Store, Upload, Loader2, MapPin, Image as ImageIcon, CheckSquare, Wifi, CreditCard, Car, Accessibility } from "lucide-react";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        business_description: "",
        working_hours_start: "09:00",
        working_hours_end: "20:00",
        avatar_url: "",
        hours: {} as Record<string, { open: string; close: string; closed: boolean }>,
        location: { lat: 41.2995, lng: 69.2401 },
        amenities: [] as string[],
        gallery: [] as string[],
        interior: [] as string[]
    });

    useEffect(() => {
        if (profile && open) {
            // Default hours structure if none exists
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
                working_hours_start: profile.working_hours_start || "09:00",
                working_hours_end: profile.working_hours_end || "20:00",
                avatar_url: profile.avatar_url || "",
                hours: (profile.hours as any) || defaultHours,
                location: (profile as any).location || { lat: 41.2995, lng: 69.2401 },
                amenities: (profile as any).amenities || [],
                gallery: (profile as any).gallery || [],
                interior: (profile as any).interior || []
            });
        }
    }, [profile, open]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Xato",
                    description: "Iltimos, rasm yuklang",
                    variant: "destructive"
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Xato",
                    description: "Rasm hajmi 5MB dan oshmasligi kerak",
                    variant: "destructive"
                });
                return;
            }

            setUploading(true);

            // Upload to Supabase storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

            toast({
                title: "Muvaffaqiyatli",
                description: "Rasm yuklandi"
            });
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Xato",
                description: "Rasm yuklanmadi. Qaytadan urinib ko'ring",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.full_name.trim()) {
            toast({
                title: "Xato",
                description: "Biznes nomini kiriting",
                variant: "destructive"
            });
            return;
        }

        if (!formData.phone.trim()) {
            toast({
                title: "Xato",
                description: "Telefon raqamni kiriting",
                variant: "destructive"
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
                    working_hours_start: formData.working_hours_start,
                    working_hours_end: formData.working_hours_end,
                    avatar_url: formData.avatar_url,
                    hours: formData.hours as any, // Cast to any if db types are strict
                    updated_at: new Date().toISOString()
                })
                .eq("id", profile?.id);

            if (error) throw error;

            toast({
                title: "Muvaffaqiyatli",
                description: "Profil ma'lumotlari yangilandi"
            });

            onOpenChange(false);

            // Refresh the page to show updated data
            window.location.reload();
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Xato",
                description: "Ma'lumotlar saqlanmadi. Qaytadan urinib ko'ring",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Profilni tahrirlash</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {/* Avatar Upload */}
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
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <Label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
                        <Label htmlFor="business-name" className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-muted-foreground" />
                            Biznes nomi *
                        </Label>
                        <Input
                            id="business-name"
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Masalan: Elite Beauty Salon"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            Telefon raqam *
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+998 90 123 45 67"
                            required
                        />
                    </div>

                    {/* Business Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Biznes haqida</Label>
                        <Textarea
                            id="description"
                            value={formData.business_description}
                            onChange={(e) => setFormData(prev => ({ ...prev, business_description: e.target.value }))}
                            placeholder="Biznesingiz haqida qisqacha ma'lumot..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    {/* Detailed Working Hours */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                Ish vaqti
                            </Label>
                        </div>

                        <div className="space-y-3 bg-secondary/20 p-4 rounded-xl">
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                const dayKey = day as keyof typeof formData.hours;
                                const schedule = formData.hours[dayKey] || { open: "09:00", close: "18:00", closed: false };

                                const dayLabels: Record<string, string> = {
                                    monday: "Dushanba",
                                    tuesday: "Seshanba",
                                    wednesday: "Chorshanba",
                                    thursday: "Payshanba",
                                    friday: "Juma",
                                    saturday: "Shanba",
                                    sunday: "Yakshanba"
                                };

                                return (
                                    <div key={day} className="flex items-center gap-2 text-sm">
                                        <div className="w-24 font-medium text-muted-foreground">
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
                                                    setFormData(prev => ({ ...prev, hours: newHours }));
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
                                                            setFormData(prev => ({ ...prev, hours: newHours }));
                                                        }}
                                                        className="h-8 w-24 text-xs"
                                                    />
                                                    <span className="text-muted-foreground">-</span>
                                                    <Input
                                                        type="time"
                                                        value={schedule.close}
                                                        onChange={(e) => {
                                                            const newHours = { ...formData.hours };
                                                            newHours[dayKey] = { ...schedule, close: e.target.value };
                                                            setFormData(prev => ({ ...prev, hours: newHours }));
                                                        }}
                                                        className="h-8 w-24 text-xs"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>



                    {/* Location Map */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            Manzilni belgilash
                        </Label>
                        <LocationPicker
                            value={formData.location}
                            onChange={(loc) => setFormData(prev => ({ ...prev, location: loc }))}
                        />
                        <p className="text-xs text-muted-foreground">Xaritada joylashuvni o'zgartirish uchun belgilang yoki suring.</p>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-muted-foreground" />
                            Xususiyatlar
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { id: 'wifi', label: 'Bepul Wi-Fi', icon: Wifi },
                                { id: 'card', label: 'Bank kartalari', icon: CreditCard },
                                { id: 'parking', label: 'Parking mavjud', icon: Car },
                                { id: 'disability', label: 'Nogironlar uchun', icon: Accessibility },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center space-x-2 border p-2 rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => {
                                    setFormData(prev => {
                                        const amenities = prev.amenities.includes(item.id)
                                            ? prev.amenities.filter(a => a !== item.id)
                                            : [...prev.amenities, item.id];
                                        return { ...prev, amenities };
                                    });
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(item.id)}
                                        onChange={() => { }} // Handled by div click
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary pointer-events-none"
                                    />
                                    <item.icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery - Mock Upload */}
                    <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            Galereya va Ko'rinish
                        </Label>

                        <div className="space-y-2">
                            <span className="text-sm font-medium">Ishlar galereyasi</span>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary/80 border border-dashed border-muted-foreground/30">
                                    <div className="text-center">
                                        <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground">Rasm qo'shish</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-sm font-medium">Salon ko'rinishi</span>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary/80 border border-dashed border-muted-foreground/30">
                                    <div className="text-center">
                                        <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground">Rasm qo'shish</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={loading}
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading || uploading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saqlanmoqda...
                                </>
                            ) : (
                                "Saqlash"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;
