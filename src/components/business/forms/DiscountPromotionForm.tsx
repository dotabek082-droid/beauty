import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreatePromotionData } from "@/types/promotion";
import { Service } from "@/types/service";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface DiscountPromotionFormProps {
    data: Partial<CreatePromotionData>;
    onUpdate: (data: Partial<CreatePromotionData>) => void;
    services?: Service[];
}

export const DiscountPromotionForm = ({ data, onUpdate, services = [] }: DiscountPromotionFormProps) => {
    const calculateTotalDiscount = () => {
        if (!data.originalPrice || !data.discountValue) return 0;

        // If specific services are selected
        if (data.serviceIds && data.serviceIds.length > 0) {
            if (data.discountType === 'percentage') {
                const discount = (data.originalPrice * data.discountValue) / 100;
                return data.maxDiscountAmount
                    ? Math.min(discount, data.maxDiscountAmount)
                    : discount;
            } else {
                // Fixed amount applies to EACH service
                return data.discountValue * data.serviceIds.length;
            }
        }

        // Fallback for manual entry (single service)
        if (data.discountType === 'percentage') {
            const discount = (data.originalPrice * data.discountValue) / 100;
            return data.maxDiscountAmount
                ? Math.min(discount, data.maxDiscountAmount)
                : discount;
        }

        return data.discountValue;
    };

    const handleServiceToggle = (serviceId: string) => {
        const currentServiceIds = data.serviceIds || [];
        let newServiceIds: string[];

        if (currentServiceIds.includes(serviceId)) {
            newServiceIds = currentServiceIds.filter(id => id !== serviceId);
        } else {
            newServiceIds = [...currentServiceIds, serviceId];
        }

        // Calculate total price and update service names
        const selectedServices = services.filter(s => newServiceIds.includes(s.id));
        const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
        const serviceNames = selectedServices.map(s => s.name).join(", ");

        onUpdate({
            serviceIds: newServiceIds,
            serviceName: serviceNames,
            originalPrice: totalPrice
        });
    };

    const finalPrice = (data.originalPrice || 0) - calculateTotalDiscount();

    return (
        <div className="space-y-4">
            <div>
                <Label className="mb-2 block">Xizmatlarni tanlang *</Label>
                {services.length > 0 ? (
                    <div className="border rounded-md p-3">
                        <ScrollArea className="h-[150px]">
                            <div className="space-y-2">
                                {services.map((service) => (
                                    <div key={service.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`service-${service.id}`}
                                            checked={data.serviceIds?.includes(service.id)}
                                            onCheckedChange={() => handleServiceToggle(service.id)}
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor={`service-${service.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {service.name}
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                {service.price.toLocaleString()} so'm
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <Input
                        value={data.serviceName || ""}
                        onChange={(e) => onUpdate({ serviceName: e.target.value })}
                        placeholder="Xizmat nomini kiriting"
                    />
                )}
                {data.serviceIds && data.serviceIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {services.filter(s => data.serviceIds?.includes(s.id)).map(s => (
                            <Badge key={s.id} variant="secondary" className="text-xs">
                                {s.name}
                                <button
                                    className="ml-1 hover:text-destructive"
                                    onClick={() => handleServiceToggle(s.id)}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="serviceNameDisplay">Aksiya nomi (Tahrirlash mumkin)</Label>
                <Input
                    id="serviceNameDisplay"
                    value={data.serviceName || ""}
                    onChange={(e) => onUpdate({ serviceName: e.target.value })}
                    placeholder="Masalan: Manikur va Pedikur"
                />
            </div>

            <div>
                <Label htmlFor="originalPrice">Jami asl narx (so'm)</Label>
                <Input
                    id="originalPrice"
                    type="number"
                    value={data.originalPrice || ""}
                    onChange={(e) => onUpdate({ originalPrice: Number(e.target.value) })}
                    placeholder="0"
                    disabled={data.serviceIds && data.serviceIds.length > 0}
                    className={data.serviceIds && data.serviceIds.length > 0 ? "bg-muted" : ""}
                />
            </div>

            <div>
                <Label htmlFor="discountType">Chegirma turi *</Label>
                <Select
                    value={data.discountType || ""}
                    onValueChange={(value) => onUpdate({ discountType: value as any })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="percentage">Foiz (%)</SelectItem>
                        <SelectItem value="fixed">Qat'iy summa (so'm)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="discountValue">
                        Chegirma {data.discountType === 'percentage' ? '(%)' : '(so\'m)'} *
                    </Label>
                    <Input
                        id="discountValue"
                        type="number"
                        value={data.discountValue || ""}
                        onChange={(e) => onUpdate({ discountValue: Number(e.target.value) })}
                        placeholder={data.discountType === 'percentage' ? "20" : "50000"}
                        max={data.discountType === 'percentage' ? 100 : undefined}
                    />
                </div>

                {data.discountType === 'percentage' && (
                    <div>
                        <Label htmlFor="maxDiscount">Maksimal chegirma (so'm)</Label>
                        <Input
                            id="maxDiscount"
                            type="number"
                            value={data.maxDiscountAmount || ""}
                            onChange={(e) => onUpdate({ maxDiscountAmount: Number(e.target.value) })}
                            placeholder="100000"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Ixtiyoriy
                        </p>
                    </div>
                )}
            </div>

            {data.originalPrice && data.discountValue && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
                    {/* Per Service Breakdown */}
                    {data.serviceIds && data.serviceIds.length > 0 && services.filter(s => data.serviceIds?.includes(s.id)).map(service => {
                        const actualServiceDiscount = data.discountType === 'percentage'
                            ? (service.price * (data.discountValue || 0)) / 100
                            : (data.discountValue || 0); // Fixed amount per service

                        const serviceFinalPrice = service.price - actualServiceDiscount;

                        return (
                            <div key={service.id} className="flex justify-between items-center border-b border-orange-200/50 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-medium text-orange-900">{service.name}</p>
                                    <div className="flex gap-2 text-xs">
                                        <span className="line-through text-orange-400">{service.price.toLocaleString()}</span>
                                        <span className="font-bold text-orange-700">{serviceFinalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white text-orange-600 border-orange-200">
                                    -{actualServiceDiscount.toLocaleString()}
                                </Badge>
                            </div>
                        );
                    })}

                    {/* Total Summary */}
                    <div className="pt-2 border-t border-orange-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-orange-800">Jami:</span>
                            <div className="text-right">
                                <span className="text-xs text-orange-500 line-through mr-2">
                                    {data.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-lg font-bold text-orange-700">
                                    {finalPrice.toLocaleString()} so'm
                                </span>
                            </div>
                        </div>
                        <p className="text-right text-xs text-orange-600 font-medium mt-1">
                            Jami arzonlashtirildi: {calculateTotalDiscount().toLocaleString()} so'm
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startDate">Boshlanish sanasi *</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={data.startDate || ""}
                        onChange={(e) => onUpdate({ startDate: e.target.value })}
                    />
                </div>

                <div>
                    <Label htmlFor="endDate">Tugash sanasi *</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={data.endDate || ""}
                        onChange={(e) => onUpdate({ endDate: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="terms">Tavsif</Label>
                <Textarea
                    id="terms"
                    value={data.termsAndConditions || ""}
                    onChange={(e) => onUpdate({ termsAndConditions: e.target.value })}
                    placeholder="Aksiya haqida to'liq ma'lumot..."
                    className="min-h-[80px]"
                />
            </div>
        </div>
    );
};
