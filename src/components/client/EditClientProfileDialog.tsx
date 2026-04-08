import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
    User, Phone, Loader2, Mail, Calendar, Camera, Upload, MapPin, 
    ChevronDown, ChevronUp, Star, ExternalLink, ShieldCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LocationDisplay {
    id: number | null;
    is_primary: boolean;
    region_name: string;
    district_name: string;
    street_name: string;
    home: string;
}

interface EditClientProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditClientProfileDialog = ({ open, onOpenChange }: EditClientProfileDialogProps) => {
    const { user, profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showAddresses, setShowAddresses] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        birth_date: "",
        gender: "",
        avatar_url: "",
    });

    const [locations, setLocations] = useState<LocationDisplay[]>([]);

    // Load data from profile/localStorage on open
    useEffect(() => {
        if (profile && open) {
            const names = (profile.full_name || "").split(" ");
            const firstName = profile.first_name || names[0] || "";
            const lastName = profile.last_name || names.slice(1).join(" ") || "";

            setFormData({
                first_name: firstName,
                last_name: lastName,
                phone: profile.phone || "",
                email: profile.email || user?.email || "",
                birth_date: profile.birth_date || "",
                gender: profile.gender || "",
                avatar_url: profile.avatar_url || "",
            });
            setPreviewImage(profile.avatar_url || null);

            // Parse locations from stored user data
            const userData = localStorage.getItem("user_data");
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    const locs = parsed.locations;
                    if (locs && locs.length > 0) {
                        const mapped: LocationDisplay[] = locs.map((l: any) => ({
                            id: l.id || null,
                            is_primary: l.is_primary || false,
                            region_name: l.region?.name_uz || "",
                            district_name: l.district?.name_uz || "",
                            street_name: l.street?.name_uz || "",
                            home: l.home || "",
                        }));
                        setLocations(mapped);
                    } else {
                        setLocations([]);
                    }
                } catch {
                    setLocations([]);
                }
            }
        }
    }, [profile, user, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Build updated user data into localStorage (mock)
            const storedUser = localStorage.getItem("user_data");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                parsed.first_name = formData.first_name;
                parsed.last_name = formData.last_name;
                parsed.phone = formData.phone;
                parsed.email = formData.email || null;
                parsed.birth_date = formData.birth_date;
                parsed.avatar = previewImage;
                
                // Note: we don't update locations here anymore.

                localStorage.setItem("user_data", JSON.stringify(parsed));
            }

            // TODO: Replace with real API call → PUT /api/auth/profile

            toast({
                title: "Muvaffaqiyatli ✓",
                description: "Profil ma'lumotlari yangilandi"
            });

            if (refreshProfile) await refreshProfile();
            onOpenChange(false);
            setTimeout(() => window.location.reload(), 300);
        } catch (error) {
            console.error("Profile update error:", error);
            toast({ title: "Xato", description: "Saqlashda xatolik yuz berdi", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 pt-6 pb-12 rounded-t-lg">
                    <DialogHeader>
                        <DialogTitle className="text-white text-lg">Profilni tahrirlash</DialogTitle>
                        <DialogDescription className="text-violet-200 text-sm">
                            Shaxsiy ma'lumotlaringizni yangilang
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Avatar overlapping header */}
                <div className="flex flex-col items-center -mt-10 mb-2">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                            <AvatarImage src={previewImage || ""} className="object-cover" />
                            <AvatarFallback className="text-xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-bold">
                                {formData.first_name?.[0]}{formData.last_name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-violet-500 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                            <Upload className="w-3 h-3" />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    <p className="text-[11px] text-gray-400 mt-1.5">Rasm yuklash uchun bosing</p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                    {/* === Personal Info === */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500">Ism *</Label>
                            <div className="relative">
                                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400" />
                                <Input
                                    value={formData.first_name}
                                    onChange={(e) => setFormData(p => ({ ...p, first_name: e.target.value }))}
                                    placeholder="Ismingiz"
                                    required
                                    className="pl-8 h-10 rounded-lg border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500">Familiya *</Label>
                            <div className="relative">
                                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400" />
                                <Input
                                    value={formData.last_name}
                                    onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))}
                                    placeholder="Familiyangiz"
                                    required
                                    className="pl-8 h-10 rounded-lg border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phone (read-only) */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500">Telefon raqam</Label>
                        <div className="relative">
                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400" />
                            <Input className="pl-8 h-10 rounded-lg bg-gray-50 border-gray-200 text-sm text-gray-500 font-medium" value={formData.phone} readOnly />
                            <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-[10px] text-gray-400 leading-tight">Maxfiylik va xavfsizlik maqsadida telefon raqamni o'zgartirish faqat qo'llab-quvvatlash xizmati orqali amalga oshiriladi.</p>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500">Email <span className="text-gray-300">(ixtiyoriy)</span></Label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400" />
                            <Input
                                className="pl-8 h-10 rounded-lg border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 text-sm"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                placeholder="example@mail.uz"
                            />
                        </div>
                    </div>

                    {/* Birth date + Gender */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500">Tug'ilgan sana *</Label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400" />
                                <Input
                                    className="pl-8 h-10 rounded-lg border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 text-sm"
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData(p => ({ ...p, birth_date: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500">Jinsi</Label>
                            <Select value={formData.gender} onValueChange={(val) => setFormData(p => ({ ...p, gender: val }))}>
                                <SelectTrigger className="h-10 rounded-lg border-gray-200 text-sm">
                                    <SelectValue placeholder="Tanlang" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg text-sm">
                                    <SelectItem value="male">Erkak</SelectItem>
                                    <SelectItem value="female">Ayol</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ========== READ-ONLY LOCATIONS SECTION ========== */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
                        <button
                            type="button"
                            onClick={() => setShowAddresses(!showAddresses)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-violet-500" />
                                <span className="text-sm font-medium text-gray-700">Manzillar</span>
                                <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-semibold">
                                    {locations.length}
                                </span>
                            </div>
                            {showAddresses
                                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                : <ChevronDown className="w-4 h-4 text-gray-400" />
                            }
                        </button>

                        {showAddresses && (
                            <div className="p-3 space-y-2 border-t border-gray-100 bg-gray-50/30">
                                {locations.length === 0 ? (
                                     <p className="text-xs text-gray-500 text-center py-2">Hozircha manzillar yo'q</p>
                                ) : (
                                    locations.map((loc, index) => (
                                        <div key={index} className="flex items-start gap-2 p-2.5 rounded-lg border border-gray-100 bg-white shadow-sm">
                                            <div className="mt-0.5">
                                                {loc.is_primary ? (
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                ) : (
                                                    <MapPin className="w-4 h-4 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-700">
                                                    {loc.region_name}, {loc.district_name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {loc.street_name}, {loc.home}-uy
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        onOpenChange(false);
                                        navigate("/profile/addresses");
                                    }}
                                    className="w-full text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100 hover:border-violet-300 h-9 text-xs font-medium"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 mr-2" />
                                    Manzillarni tahrirlash sahifasi
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="flex-1 h-11 rounded-xl border-gray-200 text-gray-600"
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/20"
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

export default EditClientProfileDialog;
