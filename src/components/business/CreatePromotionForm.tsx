import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, Calendar, Gift, AlertCircle,
    Check, X, ChevronRight, ChevronLeft,
    Image as ImageIcon, Info, Sparkles,
    MousePointer2, Clock, Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BusinessPromotion } from "@/types/business";
import { createPromotion, submitPromotionForApproval } from "@/data/businessData";

interface CreatePromotionFormProps {
    businessId: string;
    services: Array<{ id: string; name: string; price: number }>;
    onSuccess?: () => void;
}

const CreatePromotionForm = ({ businessId, services, onSuccess }: CreatePromotionFormProps) => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        serviceId: "",
        serviceName: "",
        originalPrice: 0,
        description: "",
        imageUrl: "",
        startsAt: "",
        endsAt: "",
        lotteryEnabled: false,
        entryDeadline: "",
        winnerSelectionDate: "",
        totalWinners: 10,
        slotsAvailable: 10,
        reviewDeadlineHours: 48,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const handleServiceChange = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId);
        if (service) {
            setFormData({
                ...formData,
                serviceId: service.id,
                serviceName: service.name,
                originalPrice: service.price,
            });
            // Clear error when service is selected
            if (errors.serviceId) {
                const newErrors = { ...errors };
                delete newErrors.serviceId;
                setErrors(newErrors);
            }
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (currentStep === 1) {
            if (!formData.serviceId) newErrors.serviceId = "Xizmatni tanlang";
            if (!formData.description || formData.description.length < 50) {
                newErrors.description = `Tavsif kamida 50 ta belgi bo'lishi kerak (hozir: ${formData.description.length})`;
            }
        }

        if (currentStep === 2) {
            if (!selectedImage && !formData.imageUrl) newErrors.imageUrl = "Rasm yuklang";
        }

        if (currentStep === 3) {
            if (!formData.startsAt) newErrors.startsAt = "Boshlanish sanasini kiriting";
            if (!formData.endsAt) newErrors.endsAt = "Tugash sanasini kiriting";

            if (formData.startsAt && formData.endsAt) {
                if (new Date(formData.endsAt) <= new Date(formData.startsAt)) {
                    newErrors.endsAt = "Tugash sanasi boshlanishdan keyin bo'lishi kerak";
                }
            }

            if (formData.lotteryEnabled) {
                if (!formData.entryDeadline) newErrors.entryDeadline = "Muddatni kiriting";
                if (!formData.winnerSelectionDate) newErrors.winnerSelectionDate = "Sana tanlang";
                if (formData.totalWinners <= 0) newErrors.totalWinners = "G'oliblar soni xato";
            } else {
                if (formData.slotsAvailable <= 0) newErrors.slotsAvailable = "Joylar soni xato";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(s => Math.min(s + 1, totalSteps));
        }
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        setIsSubmitting(true);
        try {
            const promotion: BusinessPromotion = {
                id: `promo-${Date.now()}`,
                businessId,
                businessName: "Sizning Business",
                salonId: businessId,
                salonName: "Sizning Salon",
                serviceName: formData.serviceName,
                serviceDescription: formData.description,
                originalPrice: formData.originalPrice,
                imageUrl: formData.imageUrl,
                startsAt: formData.startsAt,
                endsAt: formData.endsAt,
                isActive: false,
                lotteryEnabled: formData.lotteryEnabled,
                entryDeadline: formData.lotteryEnabled ? formData.entryDeadline : null,
                winnerSelectionDate: formData.lotteryEnabled ? formData.winnerSelectionDate : null,
                totalWinners: formData.lotteryEnabled ? formData.totalWinners : 0,
                currentEntries: 0,
                reviewDeadlineHours: formData.reviewDeadlineHours,
                slotsAvailable: formData.lotteryEnabled ? 0 : formData.slotsAvailable,
                slotsUsed: 0,
                approvalStatus: { status: "pending_approval", submittedAt: new Date() },
                createdBy: "user-id",
                createdAt: new Date(),
            };

            createPromotion(promotion);
            submitPromotionForApproval(promotion.id);

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8 px-4">
                <div className="flex justify-between mb-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-500 ${step >= s ? "bg-primary text-white shadow-glow" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {step > s ? <Check className="w-4 h-4" /> : s}
                        </div>
                    ))}
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "33.33%" }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-0 border-0 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold">Xizmatni tanlang</h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    onClick={() => handleServiceChange(service.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer group ${formData.serviceId === service.id
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border hover:border-primary/30"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold">{service.name}</p>
                                                            <p className="text-sm text-muted-foreground">{service.price.toLocaleString()} so'm</p>
                                                        </div>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.serviceId === service.id ? "border-primary bg-primary" : "border-muted"
                                                            }`}>
                                                            {formData.serviceId === service.id && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.serviceId && <p className="text-xs text-rose-500 font-medium">{errors.serviceId}</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold flex items-center gap-2">
                                            Batafsil tavsif
                                            <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                        </Label>
                                        <div className="relative">
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Aksiya haqida foydalanuvchilarga qiziqarli ma'lumot bering..."
                                                className="min-h-[120px] rounded-xl border-border bg-background/50 focus:ring-primary/20 resize-none transition-all"
                                            />
                                            <div className="absolute bottom-3 right-3">
                                                <Badge
                                                    variant="secondary"
                                                    className={`text-[10px] ${formData.description.length < 50 ? "text-rose-500" : "text-emerald-500"}`}
                                                >
                                                    {formData.description.length}/50
                                                </Badge>
                                            </div>
                                        </div>
                                        {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-purple-100/50 rounded-lg text-purple-600">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold">Rasm va Aksiya turi</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold">Rasm yuklash</Label>
                                            <div
                                                className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                {!imagePreview ? (
                                                    <div>
                                                        <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                                                        <p className="text-sm font-medium">Rasm yuklash uchun bosing</p>
                                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG yoki WEBP (max 5MB)</p>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="max-h-48 mx-auto rounded-lg"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="mt-3"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedImage(null);
                                                                setImagePreview("");
                                                                setFormData(prev => ({ ...prev, imageUrl: "" }));
                                                            }}
                                                        >
                                                            O'chirish
                                                        </Button>
                                                    </div>
                                                )}
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (file.size > 5 * 1024 * 1024) {
                                                                setErrors({ ...errors, imageUrl: "Rasm hajmi 5MB dan kichik bo'lishi kerak" });
                                                                return;
                                                            }
                                                            setSelectedImage(file);
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setImagePreview(reader.result as string);
                                                                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
                                                            };
                                                            reader.readAsDataURL(file);
                                                            // Clear error
                                                            if (errors.imageUrl) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.imageUrl;
                                                                setErrors(newErrors);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {errors.imageUrl && <p className="text-xs text-rose-500 font-medium">{errors.imageUrl}</p>}
                                        </div>

                                        <div className="space-y-3 pt-4 border-t">
                                            <Label className="text-sm font-bold">Ishtirok etish usuli</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div
                                                    onClick={() => setFormData(p => ({ ...p, lotteryEnabled: false }))}
                                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${!formData.lotteryEnabled ? "border-primary bg-primary/5" : "border-border"
                                                        }`}
                                                >
                                                    <Users className={`w-5 h-5 mb-2 ${!formData.lotteryEnabled ? "text-primary" : "text-muted-foreground"}`} />
                                                    <p className="font-bold text-sm">To'g'ridan-to'g'ri</p>
                                                    <p className="text-[10px] text-muted-foreground line-clamp-1 italic">Birinchi kelganlar uchun</p>
                                                </div>
                                                <div
                                                    onClick={() => setFormData(p => ({ ...p, lotteryEnabled: true }))}
                                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.lotteryEnabled ? "border-purple-600 bg-purple-50" : "border-border"
                                                        }`}
                                                >
                                                    <Gift className={`w-5 h-5 mb-2 ${formData.lotteryEnabled ? "text-purple-600" : "text-muted-foreground"}`} />
                                                    <p className="font-bold text-sm">Lotereya</p>
                                                    <p className="text-[10px] text-muted-foreground line-clamp-1 italic">Tasodifiy g'oliblar</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold">Muddatlar va Miqdor</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Boshlanish</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.startsAt}
                                                    onChange={(e) => setFormData(p => ({ ...p, startsAt: e.target.value }))}
                                                    className="rounded-xl"
                                                />
                                                {errors.startsAt && <p className="text-[10px] text-rose-500 font-medium">{errors.startsAt}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tugash</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.endsAt}
                                                    onChange={(e) => setFormData(p => ({ ...p, endsAt: e.target.value }))}
                                                    className="rounded-xl"
                                                />
                                                {errors.endsAt && <p className="text-[10px] text-rose-500 font-medium">{errors.endsAt}</p>}
                                            </div>
                                        </div>

                                        {formData.lotteryEnabled ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="space-y-4 pt-4 border-t"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ro'yxatdan o'tish oxiri</Label>
                                                        <Input
                                                            type="date"
                                                            value={formData.entryDeadline}
                                                            onChange={(e) => setFormData(p => ({ ...p, entryDeadline: e.target.value }))}
                                                            className="rounded-xl"
                                                        />
                                                        {errors.entryDeadline && <p className="text-[10px] text-rose-500 font-medium">{errors.entryDeadline}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">G'olibni aniqlash</Label>
                                                        <Input
                                                            type="date"
                                                            value={formData.winnerSelectionDate}
                                                            onChange={(e) => setFormData(p => ({ ...p, winnerSelectionDate: e.target.value }))}
                                                            className="rounded-xl"
                                                        />
                                                        {errors.winnerSelectionDate && <p className="text-[10px] text-rose-500 font-medium">{errors.winnerSelectionDate}</p>}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">G'oliblar soni</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.totalWinners}
                                                        onChange={(e) => setFormData(p => ({ ...p, totalWinners: parseInt(e.target.value) }))}
                                                        className="rounded-xl"
                                                    />
                                                    {errors.totalWinners && <p className="text-[10px] text-rose-500 font-medium">{errors.totalWinners}</p>}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="space-y-2 pt-4 border-t">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mavjud joylar soni</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.slotsAvailable}
                                                    onChange={(e) => setFormData(p => ({ ...p, slotsAvailable: parseInt(e.target.value) }))}
                                                    className="rounded-xl"
                                                />
                                                {errors.slotsAvailable && <p className="text-[10px] text-rose-500 font-medium">{errors.slotsAvailable}</p>}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold flex items-center gap-2">
                                                Sharh berish muddati
                                                <Clock className="w-3.5 h-3.5" />
                                            </Label>
                                            <select
                                                value={formData.reviewDeadlineHours}
                                                onChange={(e) => setFormData(p => ({ ...p, reviewDeadlineHours: parseInt(e.target.value) }))}
                                                className="w-full h-10 px-4 rounded-xl border border-border bg-background"
                                            >
                                                <option value={24}>24 soat</option>
                                                <option value={48}>48 soat (Standart)</option>
                                                <option value={72}>72 soat</option>
                                                <option value={168}>1 hafta</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 bg-muted/30 border-t flex justify-between gap-4">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl flex-1 max-w-[140px]">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        {step < totalSteps ? (
                            <Button type="button" onClick={nextStep} className="rounded-xl flex-1 bg-primary shadow-glow max-w-[200px]">
                                Keyingisi <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl flex-1 bg-emerald-500 hover:bg-emerald-600 shadow-glow max-w-[240px]"
                            >
                                {isSubmitting ? (
                                    <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> Tasdiqlashga yuborish
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default CreatePromotionForm;
