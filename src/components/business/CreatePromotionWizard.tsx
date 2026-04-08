
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PromotionTypeSelector } from "./PromotionTypeSelector";
import { LotteryPromotionForm } from "./forms/LotteryPromotionForm";
import { BuyOneGetOneForm } from "./forms/BuyOneGetOneForm";
import { DiscountPromotionForm } from "./forms/DiscountPromotionForm";
import { FreeServicePromotionForm } from "./forms/FreeServicePromotionForm";
import { LoyaltyCardPromotionForm } from "./forms/LoyaltyCardPromotionForm";
import { ServiceBundlePromotionForm } from "./forms/ServiceBundlePromotionForm";
import { CreatePromotionData } from "@/types/promotion";
import { ChevronLeft, ChevronRight, Send, Coins } from "lucide-react";
import { usePromotionTypes } from "@/hooks/usePromotionTypes";
import { useAuth } from "@/contexts/AuthContext";
import { getCoinBalance, deductCoins } from "@/utils/coinBalance";
import { toast } from "sonner";
import { BUSINESS_PLANS } from "@/data/subscriptionOptions";
import { Link } from "react-router-dom";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import { REGIONS, DISTRICTS } from "@/data/locations";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CreatePromotionWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePromotionData) => Promise<void>;
    currentPromotionCount: number;
}

export const CreatePromotionWizard = ({
    isOpen,
    onClose,
    onSubmit,
    currentPromotionCount
}: CreatePromotionWizardProps) => {
    const [step, setStep] = useState(1);
    const [promotionType, setPromotionType] = useState<string>("");
    const [formData, setFormData] = useState<Partial<CreatePromotionData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getTypeConfig } = usePromotionTypes();
    const { user, profile } = useAuth();
    const userCoins = user ? getCoinBalance(user.id) : 0;
    const { services } = useBusinessServices(profile?.id);

    // Get limits
    const currentTier = profile?.subscription?.tier || 'free';
    const plan = BUSINESS_PLANS.find(p => p.id === currentTier);
    const maxPromotions = plan?.limits.activePromotions || 3;
    const isLimitReached = currentPromotionCount >= maxPromotions;

    const handleTypeSelect = (type: string) => {
        setPromotionType(type);
        setFormData({ ...formData, promotionType: type as any });
    };

    const handleNext = () => {
        if (step === 1 && !promotionType) return;
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleFormUpdate = (data: Partial<CreatePromotionData>) => {
        setFormData({ ...formData, ...data });
    };

    const handleSubmit = async () => {
        if (!formData.promotionType || !user) return;

        if (isLimitReached) {
            toast.error("Tarif limiti tugadi! Yangi aksiya yaratish uchun tarifingizni yangilang.");
            return;
        }

        const typeConfig = getTypeConfig(formData.promotionType);
        if (!typeConfig) return;

        const cost = typeConfig.coinCost;
        if (userCoins < cost) {
            toast.error("Mablag' yetarli emas! Iltimos, hisobingizni to'ldiring.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Deduct coins first
            const deducted = deductCoins(user.id, cost, `Aksiya yaratish: ${typeConfig.labelUz}`);

            if (!deducted) {
                throw new Error("Coin deduction failed");
            }

            await onSubmit(formData as CreatePromotionData);
            toast.success(`Aksiya yaratildi! ${cost} coin yechib olindi.`);
            handleClose();
        } catch (error) {
            console.error("Error creating promotion:", error);
            toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setPromotionType("");
        setFormData({});
        onClose();
    };

    const typeConfig = getTypeConfig(promotionType as any);
    const stepTitles = [
        "Aksiya turini tanlang",
        "Aksiya ma'lumotlari",
        "Tekshirish va yuborish"
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Yangi Aksiya Yaratish
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex-1 flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s === step
                                        ? "bg-primary text-primary-foreground"
                                        : s < step
                                            ? "bg-green-500 text-white"
                                            : "bg-secondary text-secondary-foreground"
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-1 rounded ${s < step ? "bg-green-500" : "bg-secondary"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-2">
                        {isLimitReached ? (
                            <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm border border-red-200">
                                <p className="font-bold">Limitga yetib keldingiz! ({currentPromotionCount}/{maxPromotions})</p>
                                <p>Yangi aksiya yaratish uchun <Link to="/business/pricing" className="underline font-bold" onClick={onClose}>Tarifni yangilang</Link></p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {stepTitles[step - 1]}
                            </p>
                        )}
                    </div>
                </DialogHeader>

                <div className="py-6">
                    {step === 1 && (
                        <PromotionTypeSelector
                            selectedType={promotionType}
                            onSelectType={handleTypeSelect}
                        />
                    )}

                    {step === 2 && (
                        <div>
                            {promotionType === 'lottery' && (
                                <LotteryPromotionForm
                                    data={formData}
                                    onUpdate={handleFormUpdate}
                                    services={services}
                                />
                            )}
                            {promotionType === 'buy_one_get_one' && (
                                <BuyOneGetOneForm
                                    data={formData}
                                    onUpdate={handleFormUpdate}
                                    services={services}
                                />
                            )}
                            {promotionType === 'discount' && (
                                <DiscountPromotionForm
                                    data={formData}
                                    onUpdate={handleFormUpdate}
                                    services={services}
                                />
                            )}
                            {promotionType === 'free_service' && (
                                <FreeServicePromotionForm
                                    data={formData}
                                    onUpdate={handleFormUpdate}
                                    services={services}
                                />
                            )}
                            {promotionType === 'loyalty_card' && (
                                <LoyaltyCardPromotionForm
                                    data={formData}
                                    onUpdate={handleFormUpdate}
                                    services={services}
                                />
                            )}
                            {promotionType === 'service_bundle' && (
                                <ServiceBundlePromotionForm
                                    data={formData}
                                    onUpdate={handleFormUpdate}
                                    services={services}
                                />
                            )}

                            <div className="pt-4 border-t">
                                <Label htmlFor="minClientTrustScore">Mijoz Ishonch Reytingi (min)</Label>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Input
                                        id="minClientTrustScore"
                                        type="number"
                                        value={formData.minClientTrustScore || ""}
                                        onChange={(e) => handleFormUpdate({ minClientTrustScore: Number(e.target.value) })}
                                        placeholder="50"
                                        min="0"
                                        max="100"
                                        className="max-w-[100px]"
                                    />
                                    <span className="text-sm text-muted-foreground">va undan yuqori (ixtiyoriy)</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Faqat ishonchli mijozlar uchun (0-100)
                                </p>
                            </div>

                            <div className="pt-4 border-t">
                                <Label htmlFor="targetRegion">Hudud tanlash (ixtiyoriy)</Label>
                                <Select
                                    value={formData.targetRegion || ""}
                                    onValueChange={(value) => handleFormUpdate({ targetRegion: value, targetDistricts: [] })}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Barcha hududlar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Barcha hududlar</SelectItem>
                                        {REGIONS.map((region) => (
                                            <SelectItem key={region.id} value={region.id}>
                                                {region.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {formData.targetRegion && formData.targetRegion !== "all" && DISTRICTS[formData.targetRegion] && (
                                    <div className="mt-3">
                                        <Label>Tumanlar (ixtiyoriy)</Label>
                                        <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3">
                                            {DISTRICTS[formData.targetRegion].map((district) => (
                                                <label key={district.id} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.targetDistricts?.includes(district.id) || false}
                                                        onChange={(e) => {
                                                            const currentDistricts = formData.targetDistricts || [];
                                                            const newDistricts = e.target.checked
                                                                ? [...currentDistricts, district.id]
                                                                : currentDistricts.filter(d => d !== district.id);
                                                            handleFormUpdate({ targetDistricts: newDistricts });
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">{district.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Aksiya qaysi hududlarda ko'rinishi
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <h3 className="font-bold mb-3">Aksiya ma'lumotlari</h3>
                                <div className="space-y-4 text-sm">
                                    {formData.serviceName && (
                                        <div className="flex justify-between border-b border-gray-100 pb-2 mb-2">
                                            <span className="text-muted-foreground">Nomi:</span>
                                            <span className="font-medium">{formData.serviceName}</span>
                                        </div>
                                    )}
                                    {formData.termsAndConditions && (
                                        <div className="border-b border-gray-100 pb-2 mb-2">
                                            <span className="text-muted-foreground block mb-1">Tavsif:</span>
                                            <p className="font-medium text-gray-900 break-words">{formData.termsAndConditions}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tur:</span>
                                        <span className="font-medium">{typeConfig?.labelUz}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Yaratish narxi:</span>
                                        <div className="flex items-center gap-1 font-bold text-amber-600">
                                            <Coins className="w-4 h-4 fill-amber-600" />
                                            {typeConfig?.coinCost} tanga
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                                        <span className="text-muted-foreground">Boshlanish sanasi:</span>
                                        <span className="font-medium">{formData.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tugash sanasi:</span>
                                        <span className="font-medium">{formData.endDate}</span>
                                    </div>

                                    {/* Multiple Services Breakdown */}
                                    {formData.serviceIds && formData.serviceIds.length > 0 && services.length > 0 ? (
                                        <div className="border rounded-md p-3 bg-white space-y-3">
                                            <p className="font-semibold text-gray-700 mb-2">Tanlangan xizmatlar:</p>
                                            {services.filter(s => formData.serviceIds?.includes(s.id)).map(service => {
                                                if (formData.promotionType === 'lottery') {
                                                    return (
                                                        <div key={service.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                                <div className="flex gap-2 text-xs items-center">
                                                                    <span className="text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">Asl narxi: {service.price.toLocaleString()}</span>
                                                                    <span className="font-bold text-green-600">0 so'm</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (formData.promotionType === 'free_service') {
                                                    return (
                                                        <div key={service.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                                <div className="flex gap-2 text-xs items-center">
                                                                    <span className="line-through text-gray-400">{service.price.toLocaleString()}</span>
                                                                    <span className="font-bold text-emerald-600">BEPUL</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (formData.promotionType === 'buy_one_get_one') {
                                                    const buyQty = formData.minPurchaseQuantity || 1;
                                                    const freeQty = formData.freeQuantity || 0;
                                                    const totalQty = buyQty + freeQty;
                                                    const totalPrice = service.price * totalQty;
                                                    const payPrice = service.price * buyQty;

                                                    return (
                                                        <div key={service.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                                <div className="flex gap-2 text-xs items-center">
                                                                    <span className="line-through text-gray-400">{totalPrice.toLocaleString()}</span>
                                                                    <span className="font-bold text-green-600">{payPrice.toLocaleString()} so'm</span>
                                                                </div>
                                                                <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                                                                    ({buyQty} ta puliga {totalQty} ta)
                                                                </p>
                                                            </div>
                                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                                -{(totalPrice - payPrice).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                if (formData.promotionType === 'loyalty_card') {
                                                    return (
                                                        <div key={service.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                                <div className="flex gap-2 text-xs items-center mt-1">
                                                                    <span className="text-gray-600">Xizmat narxi: {service.price.toLocaleString()} so'm</span>
                                                                </div>
                                                                <div className="mt-2 bg-teal-50 border border-teal-200 rounded px-2 py-1.5">
                                                                    <p className="text-xs text-teal-700 font-medium">
                                                                        🎫 {formData.requiredVisits || 'X'} ta tashrifdan keyin bu xizmat BEPUL
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (formData.promotionType === 'service_bundle') {
                                                    return (
                                                        <div key={service.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                                <div className="flex gap-2 text-xs items-center mt-1">
                                                                    <span className="text-gray-600">{service.price.toLocaleString()} so'm</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                const actualServiceDiscount = formData.discountType === 'percentage'
                                                    ? (service.price * (formData.discountValue || 0)) / 100
                                                    : (formData.discountValue || 0);

                                                const serviceFinalPrice = service.price - actualServiceDiscount;

                                                return (
                                                    <div key={service.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{service.name}</p>
                                                            <div className="flex gap-2 text-xs">
                                                                <span className="line-through text-gray-400">{service.price.toLocaleString()}</span>
                                                                <span className="font-bold text-green-600">{serviceFinalPrice.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                                            -{actualServiceDiscount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                );
                                            })}

                                            <div className="pt-2 border-t border-gray-200 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-gray-800">
                                                        {formData.promotionType === 'lottery' ? 'Jami qiymat:' : 'Jami:'}
                                                    </span>
                                                    <div className="text-right">
                                                        {formData.promotionType === 'lottery' ? (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through mr-2">
                                                                    {((formData.originalPrice || 0) * (formData.winnerCount || 1)).toLocaleString()}
                                                                </span>
                                                                <span className="text-lg font-bold text-green-700">
                                                                    0 so'm
                                                                </span>
                                                            </>
                                                        ) : formData.promotionType === 'free_service' ? (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through mr-2">
                                                                    {formData.originalPrice?.toLocaleString()}
                                                                </span>
                                                                <span className="text-lg font-bold text-emerald-600">
                                                                    BEPUL
                                                                </span>
                                                            </>
                                                        ) : formData.promotionType === 'buy_one_get_one' ? (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through mr-2">
                                                                    {((formData.originalPrice || 0) * ((formData.minPurchaseQuantity || 1) + (formData.freeQuantity || 0))).toLocaleString()}
                                                                </span>
                                                                <span className="text-lg font-bold text-green-700">
                                                                    {((formData.originalPrice || 0) * (formData.minPurchaseQuantity || 1)).toLocaleString()} so'm
                                                                </span>
                                                            </>
                                                        ) : formData.promotionType === 'loyalty_card' ? (
                                                            <>
                                                                <span className="text-lg font-bold text-teal-700">
                                                                    {formData.originalPrice?.toLocaleString()} so'm
                                                                </span>
                                                            </>
                                                        ) : formData.promotionType === 'service_bundle' ? (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through mr-2">
                                                                    {formData.originalPrice?.toLocaleString()}
                                                                </span>
                                                                <span className="text-lg font-bold text-pink-700">
                                                                    {formData.bundlePrice?.toLocaleString()} so'm
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through mr-2">
                                                                    {formData.originalPrice?.toLocaleString()}
                                                                </span>
                                                                <span className="text-lg font-bold text-green-700">
                                                                    {((formData.originalPrice || 0) - (
                                                                        formData.discountType === 'percentage'
                                                                            ? ((formData.originalPrice || 0) * (formData.discountValue || 0)) / 100
                                                                            : ((formData.discountValue || 0) * (formData.serviceIds?.length || 0))
                                                                    )).toLocaleString()} so'm
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Limit display */}
                                                {(formData.maxUses || 0) > 0 && (
                                                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                                                        <span className="text-muted-foreground">Limit:</span>
                                                        <span className="font-bold text-amber-600">{formData.maxUses} ta mijoz</span>
                                                    </div>
                                                )}

                                                {formData.promotionType === 'buy_one_get_one' && (
                                                    <div className="text-right text-xs text-blue-600 font-medium mt-1">
                                                        Taklif: {formData.minPurchaseQuantity} sotib oling + {formData.freeQuantity} bepul
                                                    </div>
                                                )}
                                                {formData.promotionType === 'service_bundle' && (
                                                    <div className="text-right text-xs text-pink-600 font-medium mt-1">
                                                        Paket tejamkori: {((formData.originalPrice || 0) - (formData.bundlePrice || 0)).toLocaleString()} so'm
                                                    </div>
                                                )}
                                                {formData.promotionType !== 'lottery' && formData.promotionType !== 'buy_one_get_one' && formData.promotionType !== 'loyalty_card' && formData.promotionType !== 'service_bundle' && (
                                                    <p className="text-right text-xs text-green-600 font-medium mt-1">
                                                        Jami arzonlashtirildi: {(
                                                            formData.discountType === 'percentage'
                                                                ? ((formData.originalPrice || 0) * (formData.discountValue || 0)) / 100
                                                                : ((formData.discountValue || 0) * (formData.serviceIds?.length || 0))
                                                        ).toLocaleString()} so'm
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // Legacy / Single Service View
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Xizmat:</span>
                                                <span className="font-medium">{formData.serviceName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Narx:</span>
                                                <span className="font-medium">{formData.originalPrice?.toLocaleString()} so'm</span>
                                            </div>
                                        </>
                                    )}

                                    {formData.promotionType === 'lottery' && (
                                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                            <span className="text-muted-foreground">G'oliblar soni:</span>
                                            <span className="font-medium">{formData.winnerCount} ta</span>
                                        </div>
                                    )}

                                    {formData.promotionType === 'loyalty_card' && (
                                        <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Kerakli tashriflar:</span>
                                                <span className="font-medium">{formData.requiredVisits} ta</span>
                                            </div>
                                            {formData.maxRedemptions && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Maksimal foydalanish:</span>
                                                    <span className="font-medium">{formData.maxRedemptions} ta</span>
                                                </div>
                                            )}
                                            <div className="text-sm text-teal-600 font-medium">
                                                {formData.requiredVisits} ta tashrifdan keyin bepul
                                            </div>
                                        </div>
                                    )}

                                    {/* Trust Score Display */}
                                    {(formData.minClientTrustScore || 0) > 0 && (
                                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                            <span className="text-muted-foreground">Mijoz ishonch reytingi:</span>
                                            <span className="font-medium text-amber-600">{formData.minClientTrustScore}+</span>
                                        </div>
                                    )}

                                    {/* Location Display */}
                                    {formData.targetRegion && formData.targetRegion !== "all" && (
                                        <div className="border-t border-gray-200 pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Ko'rinish hududi:</span>
                                                <span className="font-medium text-blue-600">
                                                    {REGIONS.find(r => r.id === formData.targetRegion)?.name || formData.targetRegion}
                                                </span>
                                            </div>
                                            {formData.targetDistricts && formData.targetDistricts.length > 0 && (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    Tumanlar: {formData.targetDistricts.map(dId =>
                                                        DISTRICTS[formData.targetRegion!]?.find(d => d.id === dId)?.name || dId
                                                    ).join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Eslatma:</strong> Aksiya administratorga yuboriladi. Tasdiqlangandan keyin faol bo'ladi.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between gap-3">
                    <Button
                        variant="outline"
                        onClick={step === 1 ? handleClose : handleBack}
                        disabled={isSubmitting}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {step === 1 ? "Bekor qilish" : "Orqaga"}
                    </Button>

                    {step < 3 ? (
                        <Button
                            onClick={handleNext}
                            disabled={step === 1 && !promotionType}
                        >
                            Keyingisi
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || userCoins < (typeConfig?.coinCost || 0)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Yuklanmoqda..." : "Yuborish"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
};
