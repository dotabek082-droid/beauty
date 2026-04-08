import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { LocationPicker } from "@/components/business/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
    Phone, Store, Upload, Loader2, MapPin, CheckSquare,
    Wifi, CreditCard, Car, Accessibility, ArrowRight,
    ArrowLeft, Clock, Camera, CheckCircle2, AlertCircle
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { TermsOfUseContent } from "@/components/legal/TermsOfUse";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicy";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { BUSINESS_CATEGORIES } from "@/data/businessCategories";
import { REGIONS, DISTRICTS } from "@/data/locations";

// --- Zod Schemas ---

const businessSchema = z.object({
    // Step 1: Basic Info
    full_name: z.string().min(3, "Biznes nomi kamida 3 ta harf bo'lishi kerak"),
    responsible_person: z.string().min(3, "Mas'ul shaxs ismi kamida 3 ta harf bo'lishi kerak"),
    responsible_person_phone: z.string().min(9, "Telefon raqam noto'g'ri"),
    org_type: z.enum(["individual", "llc", "jv"]),
    phone: z.string().min(9, "Telefon raqam noto'g'ri"), // Simple validation
    description: z.string().min(10, "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak"),
    website: z.string().url("Noto'g'ri URL formati").optional().or(z.literal("")),
    instagram: z.string().optional(),
    telegram: z.string().optional(),
    facebook: z.string().optional(),
    avatar_url: z.string().optional(),

    // Step 2: Category
    category: z.string().min(1, "Kategoriyani tanlang"),
    subcategory: z.string().optional(),
    services: z.array(z.object({
        name: z.string(),
        price: z.coerce.number().min(0, "Narx manfiy bo'lmasligi kerak"),
    })).min(1, "Kamida bitta xizmat va uning narxini belgilang"),

    // Step 3: Location
    location: z.object({
        lat: z.number(),
        lng: z.number(),
        region: z.string().min(1, "Viloyatni tanlang"),
        district: z.string().min(1, "Tumanni tanlang"),
        address_line1: z.string().min(5, "Manzilni kiriting"),
        address_line2: z.string().optional(),
        postal_code: z.string().min(3, "Pochta indeksini kiriting"),
    }),

    // Step 4: Hours
    hours: z.record(z.object({
        open: z.string(),
        close: z.string(),
        closed: z.boolean()
    })),

    // Step 5: Photos & Amenities
    amenities: z.array(z.string()),
    gallery: z.array(z.string()), // Salon photos
    portfolio: z.array(z.string()), // Work examples

    // Step 6: Confirmation
    termsAccepted: z.boolean().refine(val => val === true, "Shartlarni qabul qilishingiz kerak"),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export const defaultHours = {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
};

// --- Main Component ---

interface BusinessRegistrationFormProps {
    userId: string;
    onComplete: () => void;
    editMode?: boolean;
    initialData?: Partial<BusinessFormValues>;
}

const BusinessRegistrationForm = ({ userId, onComplete, editMode = false, initialData }: BusinessRegistrationFormProps) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    const [customServiceName, setCustomServiceName] = useState(""); // State for custom service input

    const form = useForm<BusinessFormValues>({
        resolver: zodResolver(businessSchema),
        defaultValues: editMode && initialData ? {
            full_name: initialData.full_name || "",
            responsible_person: initialData.responsible_person || "",
            responsible_person_phone: initialData.responsible_person_phone || "",
            org_type: initialData.org_type || "individual",
            phone: initialData.phone || "",
            description: initialData.description || "",
            website: initialData.website || "",
            instagram: initialData.instagram || "",
            telegram: initialData.telegram || "",
            facebook: initialData.facebook || "",
            avatar_url: initialData.avatar_url || "",
            category: initialData.category || "",
            subcategory: initialData.subcategory || "",
            services: initialData.services || [],
            location: initialData.location || {
                lat: 41.2995,
                lng: 69.2401,
                region: "",
                district: "",
                address_line1: "",
                address_line2: "",
                postal_code: ""
            },
            hours: initialData.hours || defaultHours,
            amenities: initialData.amenities || [],
            gallery: initialData.gallery || [],
            portfolio: initialData.portfolio || [],
            termsAccepted: editMode ? true : false,
        } : {
            full_name: "",
            responsible_person: "",
            responsible_person_phone: "",
            org_type: "individual",
            phone: "",
            description: "",
            website: "",
            instagram: "",
            telegram: "",
            facebook: "",
            avatar_url: "",
            category: "",
            subcategory: "",
            services: [],
            location: {
                lat: 41.2995,
                lng: 69.2401,
                region: "",
                district: "",
                address_line1: "",
                address_line2: "",
                postal_code: ""
            },
            hours: defaultHours,
            amenities: [],
            gallery: [],
            portfolio: [],
            termsAccepted: false,
        },
        mode: "onChange",
    });

    const { formState: { errors, isValid }, trigger, watch, setValue } = form;
    const formData = watch();

    // -- Handlers --

    const handleNext = async () => {
        let fieldsToValidate: (keyof BusinessFormValues)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ["full_name", "responsible_person", "responsible_person_phone", "org_type", "phone", "description"];
                break;
            case 2:
                fieldsToValidate = ["category", "subcategory"];
                break;
            case 3:
                fieldsToValidate = ["location"];
                break;
            case 4:
                fieldsToValidate = ["hours"];
                break;
            case 5:
                fieldsToValidate = ["amenities", "gallery"];
                break;
            case 6:
                fieldsToValidate = ["termsAccepted"];
                break;
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            if (step < 6) setStep(prev => prev + 1);
            else onSubmit();
        } else {
            toast({ title: "Diqqat", description: "Iltimos, maydonlarni to'g'ri to'ldiring", variant: "destructive" });
        }
    };

    const handlePrev = () => setStep(prev => prev - 1);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `avatar_${userId}_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
            setValue("avatar_url", publicUrl);
            toast({ title: "Rasm yuklandi" });
        } catch (error) {
            toast({ title: "Xatolik", description: "Rasm yuklashda xatolik", variant: "destructive" });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingGallery(true);
            const newUrls: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split(".").pop();
                const fileName = `gallery_${userId}_${Date.now()}_${i}.${fileExt}`;
                const filePath = `business_gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
                if (uploadError) continue;

                const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
                newUrls.push(publicUrl);
            }

            setValue("gallery", [...formData.gallery, ...newUrls]);
            toast({ title: `${newUrls.length} ta rasm yuklandi` });
        } catch (error) {
            toast({ title: "Xatolik", description: "Rasmlarni yuklashda xatolik", variant: "destructive" });
        } finally {
            setUploadingGallery(false);
        }
    };

    const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingPortfolio(true);
            const newUrls: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split(".").pop();
                const fileName = `portfolio_${userId}_${Date.now()}_${i}.${fileExt}`;
                const filePath = `business_portfolio/${fileName}`;

                const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
                if (uploadError) continue;

                const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
                newUrls.push(publicUrl);
            }

            setValue("portfolio", [...formData.portfolio, ...newUrls]);
            toast({ title: `${newUrls.length} ta ish namuansi yuklandi` });
        } catch (error) {
            toast({ title: "Xatolik", description: "Rasmlarni yuklashda xatolik", variant: "destructive" });
        } finally {
            setUploadingPortfolio(false);
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            // Map form data to DB columns
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    responsible_person: formData.responsible_person,
                    responsible_person_phone: formData.responsible_person_phone,
                    phone: formData.phone,
                    business_description: formData.description,
                    avatar_url: formData.avatar_url,
                    hours: formData.hours as any,
                    // amenities: formData.amenities, // Temporary: Column missing in DB
                    location: formData.location,
                    website: formData.website,
                    instagram: formData.instagram,
                    telegram: formData.telegram,
                    facebook: formData.facebook,
                    services: formData.services,
                    portfolio: formData.portfolio, // Column added in previous migration

                    category: (() => {
                        const main = BUSINESS_CATEGORIES.find(c => c.id === formData.category);
                        const sub = main?.subcategories.find(s => s.id === formData.subcategory);
                        return main && sub ? `${main.label} > ${sub.label}` : (main?.label || formData.category);
                    })(),
                })
                .eq("id", userId);

            if (error) throw error;

            toast({
                title: editMode ? "Saqlandi!" : "Tabriklaymiz!",
                description: editMode ? "Profil muvaffaqiyatli yangilandi." : "Biznesingiz muvaffaqiyatli ro'yxatdan o'tdi."
            });
            onComplete();
        } catch (error) {
            console.error(error);
            toast({
                title: "Xatolik",
                description: `Saqlashda xatolik yuz berdi: ${(error as any).message || error}`,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // -- Steps Content --

    const renderStep1 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-center mb-6">
                <div className="relative group cursor-pointer w-28 h-28">
                    <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/50 group-hover:border-primary transition-colors">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary">
                                <Upload className="w-8 h-8 mb-1" />
                                <span className="text-[10px]">Logo</span>
                            </div>
                        )}
                    </div>
                    <Input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {uploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            </div>

            <FormField control={form.control} name="full_name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Biznes Nomi *</FormLabel>
                    <FormControl><Input placeholder="Masalan: Elite Beauty Salon" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="responsible_person" render={({ field }) => (
                <FormItem>
                    <FormLabel>Mas'ul Shaxs (Admin/Direktor) *</FormLabel>
                    <FormControl><Input placeholder="Ism Familiya" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="responsible_person_phone" render={({ field }) => (
                <FormItem>
                    <FormLabel>Mas'ul Shaxs Telefoni *</FormLabel>
                    <FormControl><Input placeholder="+998 90 123 45 67" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="org_type" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Shakl</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="individual">YaTT</SelectItem>
                                <SelectItem value="llc">MChJ</SelectItem>
                                <SelectItem value="jv">Qo'shma K.</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefon *</FormLabel>
                        <FormControl><Input placeholder="+998 90 123 45 67" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Web-sayt (Ixtiyoriy)</FormLabel>
                        <FormControl><Input placeholder="http://www.example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="instagram" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instagram (Ixtiyoriy)</FormLabel>
                        <FormControl><Input placeholder="@username yoki link" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="telegram" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telegram (Ixtiyoriy)</FormLabel>
                        <FormControl><Input placeholder="@username yoki link" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="facebook" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Facebook (Ixtiyoriy)</FormLabel>
                        <FormControl><Input placeholder="Facebook sahifa linki" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Qisqacha Tavsif *</FormLabel>
                    <FormControl><Textarea placeholder="Biznesingiz haqida..." {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div >
    );

    const renderStep2 = () => {
        const selectedCategory = BUSINESS_CATEGORIES.find(c => c.id === formData.category);

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Asosiy Kategoriya *</FormLabel>
                        <Select
                            onValueChange={(val) => {
                                field.onChange(val);
                                setValue("subcategory", ""); // Reset subcategory when main changes
                            }}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategoriyani tanlang" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                                {BUSINESS_CATEGORIES.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                {selectedCategory && (
                    <FormField control={form.control} name="subcategory" render={({ field }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-2">
                            <FormLabel>Yo'nalish (Sub-kategoriya) *</FormLabel>
                            <Select
                                onValueChange={(val) => {
                                    field.onChange(val);
                                    setValue("services", []); // Reset services (was specializations)
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Yo'nalishni tanlang" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                    {selectedCategory.subcategories.map(sub => (
                                        <SelectItem key={sub.id} value={sub.id}>{sub.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                )}

                {/* Specializations Selection */}
                {selectedCategory && formData.subcategory && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-3">
                            <FormLabel>Xizmatlarni Tanlang</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    const sub = selectedCategory.subcategories.find(s => s.id === formData.subcategory);
                                    const availableSpecs = (sub as any)?.specializations || [];

                                    if (availableSpecs.length === 0) {
                                        return <p className="text-sm text-muted-foreground w-full">Bu yo'nalish uchun maxsus xizmatlar topilmadi. Quyida o'z xizmatlaringizni qo'shishingiz mumkin.</p>;
                                    }

                                    return availableSpecs.map((spec: string) => {
                                        const isSelected = formData.services?.some(s => s.name === spec);
                                        return (
                                            <div
                                                key={spec}
                                                onClick={() => {
                                                    const current = formData.services || [];
                                                    if (isSelected) {
                                                        setValue("services", current.filter(s => s.name !== spec));
                                                    } else {
                                                        setValue("services", [...current, { name: spec, price: 0 }]);
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all border ${isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background hover:bg-muted border-input"
                                                    }`}
                                            >
                                                {spec}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Price Inputs for Selected Services */}
                        {formData.services && formData.services.length > 0 && (
                            <div className="space-y-3 pt-2 border-t">
                                <FormLabel>Narxlarni Belgilang (so'm)</FormLabel>
                                <div className="grid gap-3">
                                    {formData.services.map((service, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm">
                                            <span className="flex-1 font-medium text-sm">{service.name}</span>
                                            <div className="flex items-center gap-2 w-[180px]">
                                                <Input
                                                    type="number"
                                                    placeholder="Narx"
                                                    className="h-9 text-right"
                                                    value={service.price || ''}
                                                    onChange={(e) => {
                                                        const newServices = [...formData.services];
                                                        newServices[index].price = Number(e.target.value);
                                                        setValue("services", newServices);
                                                    }}
                                                />
                                                <span className="text-xs text-muted-foreground">so'm</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage>{errors.services?.message}</FormMessage>
                            </div>
                        )}

                        {/* Custom Service Input */}
                        <div className="flex items-center gap-2 mt-2">
                            <Input
                                placeholder="Boshqa xizmat turi... (qo'shish uchun yozing)"
                                value={customServiceName}
                                onChange={(e) => setCustomServiceName(e.target.value)}
                                className="h-9 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (customServiceName.trim()) {
                                            const current = formData.services || [];
                                            if (!current.some(s => s.name.toLowerCase() === customServiceName.trim().toLowerCase())) {
                                                setValue("services", [...current, { name: customServiceName.trim(), price: 0 }]);
                                                setCustomServiceName("");
                                            } else {
                                                toast({ title: "Diqqat", description: "Bu xizmat allaqachon qo'shilgan" });
                                            }
                                        }
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (customServiceName.trim()) {
                                        const current = formData.services || [];
                                        if (!current.some(s => s.name.toLowerCase() === customServiceName.trim().toLowerCase())) {
                                            setValue("services", [...current, { name: customServiceName.trim(), price: 0 }]);
                                            setCustomServiceName("");
                                        } else {
                                            toast({ title: "Diqqat", description: "Bu xizmat allaqachon qo'shilgan" });
                                        }
                                    }
                                }}
                            >
                                Qo'shish
                            </Button>
                        </div>
                    </div>
                )}

                {/* Visual feedback for selected category */}
                {selectedCategory && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                        <Store className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-semibold text-primary">{selectedCategory.label}</p>
                            <p className="text-sm text-muted-foreground">
                                {formData.subcategory
                                    ? selectedCategory.subcategories.find(s => s.id === formData.subcategory)?.label
                                    : "Yo'nalishni tanlang..."}
                            </p>
                            {formData.services && formData.services.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.services.length} ta xizmat tanlangan
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderStep3 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
                <FormLabel className="text-base text-primary">Asosiy Manzil</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="location.region" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Viloyat *</FormLabel>
                            <Select onValueChange={(val) => {
                                field.onChange(val);
                                // Reset district when region changes
                                const currentLoc = form.getValues("location");
                                setValue("location", { ...currentLoc, region: val, district: "" });
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Viloyatni tanlang" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {REGIONS.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="location.district" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tuman/Shahar *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!formData.location.region}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Tumanni tanlang" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {formData.location.region && DISTRICTS[formData.location.region]?.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                    {!DISTRICTS[formData.location.region] && (
                                        <SelectItem value="markaz">Markaz</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="location.address_line1" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ko'cha va Uy *</FormLabel>
                            <FormControl><Input placeholder="Masalan: A.Temur ko'chasi, 12-uy" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="location.address_line2" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kvartira/Ofis (Ixtiyoriy)</FormLabel>
                            <FormControl><Input placeholder="Masalan: 2-qavat, 15-xonadon" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="location.postal_code" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pochta Kodu *</FormLabel>
                        <FormControl><Input placeholder="100000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="mt-6 pt-6 border-t">
                <div className="bg-primary/5 p-3 rounded-lg flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">Xaritada joylashuvingizni aniq belgilang. Bu mijozlarga sizni oson topishga yordam beradi.</p>
                </div>
                <FormItem>
                    <FormLabel>Xarita</FormLabel>
                    <div className="border rounded-xl overflow-hidden shadow-sm h-[300px]">
                        <LocationPicker
                            value={{ lat: formData.location.lat, lng: formData.location.lng }}
                            onChange={(loc) => {
                                const currentLoc = form.getValues("location");
                                setValue("location", { ...currentLoc, ...loc });
                            }}
                        />
                    </div>
                </FormItem>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-sm text-muted-foreground mb-4">Har bir kun uchun ish vaqtini belgilang. Dam olish kunlari uchun "Yopiq" ni tanlang.</p>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {Object.entries(defaultHours).map(([day, _]) => {
                    const dayKey = day as keyof typeof defaultHours;
                    const currentDay = formData.hours[dayKey];

                    return (
                        <div key={day} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                            <span className="w-24 font-medium capitalize text-sm">
                                {day === 'monday' ? 'Dushanba' :
                                    day === 'tuesday' ? 'Seshanba' :
                                        day === 'wednesday' ? 'Chorshanba' :
                                            day === 'thursday' ? 'Payshanba' :
                                                day === 'friday' ? 'Juma' :
                                                    day === 'saturday' ? 'Shanba' : 'Yakshanba'}
                            </span>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={!currentDay.closed}
                                        onCheckedChange={(checked) => {
                                            const newHours = { ...formData.hours };
                                            newHours[dayKey] = { ...currentDay, closed: !checked };
                                            setValue("hours", newHours);
                                        }}
                                    />
                                </div>

                                {!currentDay.closed ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            className="w-24 h-8 text-xs"
                                            value={currentDay.open}
                                            onChange={(e) => {
                                                const newHours = { ...formData.hours };
                                                newHours[dayKey] = { ...currentDay, open: e.target.value };
                                                setValue("hours", newHours);
                                            }}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="time"
                                            className="w-24 h-8 text-xs"
                                            value={currentDay.close}
                                            onChange={(e) => {
                                                const newHours = { ...formData.hours };
                                                newHours[dayKey] = { ...currentDay, close: e.target.value };
                                                setValue("hours", newHours);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground italic px-8">Yopiq</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Salon Photos */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <FormLabel className="text-base text-primary">Salon Rasmlari (Interyer/Eksteryer)</FormLabel>
                    <span className="text-xs text-muted-foreground">{formData.gallery.length} ta rasm</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {formData.gallery.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img src={url} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
                        {uploadingGallery ? (
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : (
                            <>
                                <Store className="w-6 h-6 text-muted-foreground mb-1" />
                                <span className="text-[10px] text-muted-foreground text-center px-1">Salon Yuklash</span>
                            </>
                        )}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                    </label>
                </div>
            </div>

            {/* Portfolio Photos */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <FormLabel className="text-base text-primary">Ishlarimizdan Namunalar (Portfolio)</FormLabel>
                    <span className="text-xs text-muted-foreground">{formData.portfolio.length} ta rasm</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {formData.portfolio.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img src={url} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
                        {uploadingPortfolio ? (
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : (
                            <>
                                <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                                <span className="text-[10px] text-muted-foreground text-center px-1">Ish Yuklash</span>
                            </>
                        )}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePortfolioUpload} disabled={uploadingPortfolio} />
                    </label>
                </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
                <FormLabel className="text-base">Mavjud Qulayliklar</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                        { id: 'card', label: 'Terminal', icon: CreditCard },
                        { id: 'parking', label: 'Avtoturargoh', icon: Car },
                        { id: 'accessibility', label: 'Pandes', icon: Accessibility },
                        { id: 'ac', label: 'Konditsioner', icon: CheckCircle2 },
                        { id: 'coffee', label: 'Kofe/Choy', icon: CheckCircle2 },
                        { id: 'waiting_area', label: 'Kutish zali', icon: Clock },
                        { id: 'kids', label: 'Bolalar hududi', icon: CheckCircle2 },
                        { id: 'prayer', label: 'Namozxona', icon: CheckCircle2 },
                    ].map((item) => {
                        const isSelected = formData.amenities.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    const newAmenities = isSelected
                                        ? formData.amenities.filter(a => a !== item.id)
                                        : [...formData.amenities, item.id];
                                    setValue("amenities", newAmenities);
                                }}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "hover:bg-accent border-border"
                                    }`}
                            >
                                <item.icon className="w-4 h-4 mr-2" />
                                <span className="text-xs font-medium">{item.label}</span>
                                {isSelected && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderStep6 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-muted/30 p-4 rounded-xl space-y-3 border">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Ma'lumotlarni tekshirish
                </h3>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Kompaniya:</span>
                    <span className="font-medium text-right">{formData.full_name}</span>

                    <span className="text-muted-foreground">Telefon:</span>
                    <span className="font-medium text-right">{formData.phone}</span>

                    <span className="text-muted-foreground">Kategoriya:</span>
                    <span className="font-medium text-right capitalize">
                        {(() => {
                            const main = BUSINESS_CATEGORIES.find(c => c.id === formData.category);
                            const sub = main?.subcategories.find(s => s.id === formData.subcategory);
                            return main && sub ? `${main.label} - ${sub.label}` : main?.label;
                        })()}
                    </span>

                    {/* Services and Prices Summary */}
                    {formData.services && formData.services.length > 0 && (
                        <>
                            <span className="text-muted-foreground col-span-2 mt-2 pt-2 border-t font-semibold">Tanlangan Xizmatlar:</span>
                            <div className="col-span-2 space-y-1">
                                {formData.services.map((service, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">{service.name}</span>
                                        <span className="font-medium">
                                            {service.price.toLocaleString('ru-RU')} so'm
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <span className="text-muted-foreground border-t mt-2 pt-2">Manzil:</span>
                    <span className="font-medium text-right flex flex-col items-end border-t mt-2 pt-2">
                        <span>{REGIONS.find(r => r.id === formData.location.region)?.name}</span>
                        <span className="text-xs text-muted-foreground">{formData.location.address_line1}</span>
                    </span>

                    {formData.website && (
                        <>
                            <span className="text-muted-foreground">Web-sayt:</span>
                            <span className="font-medium text-right text-xs truncate max-w-[150px]">{formData.website}</span>
                        </>
                    )}
                </div>
            </div>

            <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-xl border bg-card">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal cursor-pointer text-sm">
                            Men <Dialog>
                                <DialogTrigger asChild>
                                    <span className="text-primary font-medium hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>Foydalanish Shartlari</span>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl">
                                    <DialogHeader>
                                        <DialogTitle>Foydalanish Shartlari</DialogTitle>
                                    </DialogHeader>
                                    <TermsOfUseContent />
                                </DialogContent>
                            </Dialog>
                            {" "}va{" "}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <span className="text-primary font-medium hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>Maxfiylik Siyosati</span>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl">
                                    <DialogHeader>
                                        <DialogTitle>Maxfiylik Siyosati</DialogTitle>
                                    </DialogHeader>
                                    <PrivacyPolicyContent />
                                </DialogContent>
                            </Dialog>
                            {" "}bilan tanishib chiqdim va qabul qilaman.
                        </FormLabel>
                        <FormMessage />
                    </div>
                </FormItem>
            )} />
        </div>
    );

    return (
        <Card className="w-full max-w-2xl mx-auto p-4 md:p-6 shadow-xl border-none glass-card">
            <div className="mb-8">
                {/* Step Navigation - Only show in edit mode */}
                {editMode && (
                    <div className="mb-6">
                        <p className="text-xs text-muted-foreground mb-3">Qadamni tanlang:</p>
                        <div className="grid grid-cols-6 gap-2">
                            {[
                                { num: 1, label: "Asosiy" },
                                { num: 2, label: "Kategoriya" },
                                { num: 3, label: "Manzil" },
                                { num: 4, label: "Vaqt" },
                                { num: 5, label: "Rasmlar" },
                                { num: 6, label: "Tasdiqlash" },
                            ].map((s) => (
                                <button
                                    key={s.num}
                                    type="button"
                                    onClick={() => setStep(s.num)}
                                    className={`
                                        flex flex-col items-center justify-center p-2 rounded-lg transition-all
                                        ${step === s.num
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                                        }
                                    `}
                                >
                                    <span className="text-lg font-bold">{s.num}</span>
                                    <span className="text-[10px] mt-0.5 leading-tight text-center">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {step === 1 && "Asosiy Ma'lumotlar"}
                        {step === 2 && "Kategoriya"}
                        {step === 3 && "Manzil"}
                        {step === 4 && "Ish Vaqti"}
                        {step === 5 && "Fotosuratlar"}
                        {step === 6 && "Tasdiqlash"}
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {step} / 6
                    </span>
                </div>

                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 6) * 100}%` }}
                    />
                </div>
            </div>

            <Form {...form}>
                <div className="min-h-[400px]">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                    {step === 6 && renderStep6()}
                </div>

                <div className="flex gap-3 mt-8 pt-4 border-t">
                    {step > 1 && (
                        <Button variant="outline" onClick={handlePrev} disabled={loading} className="w-32">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Orqaga
                        </Button>
                    )}

                    <Button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Yuklanmoqda...
                            </>
                        ) : (
                            step === 6 ? (
                                "Tasdiqlash va Yuborish"
                            ) : (
                                <>
                                    Davom etish
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )
                        )}
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default BusinessRegistrationForm;

