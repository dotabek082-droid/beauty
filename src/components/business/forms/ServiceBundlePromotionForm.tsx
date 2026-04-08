import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreatePromotionData } from "@/types/promotion";
import { Service } from "@/types/service";
import { useMemo } from "react";

interface ServiceBundlePromotionFormProps {
    data: Partial<CreatePromotionData>;
    onUpdate: (data: Partial<CreatePromotionData>) => void;
    services?: Service[];
}

export const ServiceBundlePromotionForm = ({ data, onUpdate, services = [] }: ServiceBundlePromotionFormProps) => {
    const selectedServices = useMemo(() => {
        return services.filter(s => data.serviceIds?.includes(s.id));
    }, [services, data.serviceIds]);

    const totalOriginalPrice = useMemo(() => {
        return selectedServices.reduce((sum, service) => sum + service.price, 0);
    }, [selectedServices]);

    const savings = useMemo(() => {
        return totalOriginalPrice - (data.bundlePrice || 0);
    }, [totalOriginalPrice, data.bundlePrice]);

    const handleServiceToggle = (serviceId: string) => {
        const currentIds = data.serviceIds || [];
        const newIds = currentIds.includes(serviceId)
            ? currentIds.filter(id => id !== serviceId)
            : [...currentIds, serviceId];

        onUpdate({ serviceIds: newIds });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label>Paket uchun xizmatlarni tanlang (kamida 2 ta) *</Label>
                <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-3">
                    {services.map((service) => (
                        <label key={service.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={data.serviceIds?.includes(service.id) || false}
                                    onChange={() => handleServiceToggle(service.id)}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium">{service.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{service.price.toLocaleString()} so'm</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Tanlangan: {selectedServices.length} ta xizmat
                </p>
            </div>

            {selectedServices.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900 mb-2">Tanlangan xizmatlar:</p>
                    <div className="space-y-1">
                        {selectedServices.map(service => (
                            <div key={service.id} className="flex justify-between text-xs text-blue-800">
                                <span>{service.name}</span>
                                <span>{service.price.toLocaleString()} so'm</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 flex justify-between font-bold text-sm text-blue-900">
                        <span>Jami:</span>
                        <span>{totalOriginalPrice.toLocaleString()} so'm</span>
                    </div>
                </div>
            )}

            <div>
                <Label htmlFor="bundlePrice">Paket narxi (so'm) *</Label>
                <Input
                    id="bundlePrice"
                    type="number"
                    value={data.bundlePrice || ""}
                    onChange={(e) => onUpdate({ bundlePrice: Number(e.target.value), originalPrice: totalOriginalPrice })}
                    placeholder="80000"
                    min="0"
                    required
                />
                {savings > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                        Tejash: {savings.toLocaleString()} so'm ({Math.round((savings / totalOriginalPrice) * 100)}%)
                    </p>
                )}
                {savings < 0 && (
                    <p className="text-xs text-red-600 mt-1">
                        ⚠️ Paket narxi jami narxdan kam bo'lishi kerak
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="startDate">Boshlanish sanasi *</Label>
                <Input
                    id="startDate"
                    type="date"
                    value={data.startDate || ""}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="endDate">Tugash sanasi *</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={data.endDate || ""}
                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="terms">Tavsif</Label>
                <Textarea
                    id="terms"
                    value={data.termsAndConditions || ""}
                    onChange={(e) => onUpdate({ termsAndConditions: e.target.value })}
                    placeholder="Paket haqida ma'lumot..."
                    className="min-h-[80px]"
                />
            </div>

            {selectedServices.length >= 2 && savings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                        <strong>✓ Tayyor!</strong> Mijozlar {selectedServices.length} ta xizmatni {data.bundlePrice?.toLocaleString()} so'mga olishadi va {savings.toLocaleString()} so'm tejashadi!
                    </p>
                </div>
            )}
        </div>
    );
};
