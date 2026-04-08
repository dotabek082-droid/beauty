import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CreatePromotionData } from "@/types/promotion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Service } from "@/types/service";

interface FreeServicePromotionFormProps {
    data: Partial<CreatePromotionData>;
    onUpdate: (data: Partial<CreatePromotionData>) => void;
    services?: Service[];
}

export const FreeServicePromotionForm = ({ data, onUpdate, services = [] }: FreeServicePromotionFormProps) => {

    const handleServiceToggle = (serviceId: string) => {
        const currentIds = data.serviceIds || [];
        const newIds = currentIds.includes(serviceId)
            ? currentIds.filter(id => id !== serviceId)
            : [...currentIds, serviceId];

        const selectedServices = services.filter(s => newIds.includes(s.id));
        const totalOriginalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

        onUpdate({
            serviceIds: newIds,
            originalPrice: totalOriginalPrice
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="mb-2 block">Xizmat nomi *</Label>
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
                        placeholder="Masalan: Bepul Soch Turmagi"
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

            {(services.length === 0) && (
                <div>
                    <Label htmlFor="originalPrice">Xizmatning asl narxi (so'm) *</Label>
                    <Input
                        id="originalPrice"
                        type="number"
                        value={data.originalPrice || ""}
                        onChange={(e) => onUpdate({ originalPrice: Number(e.target.value) })}
                        placeholder="50000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Bu xizmatning odatdagi narxi
                    </p>
                </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-purple-600">Xizmat narxi:</p>
                        <p className="text-2xl font-bold text-purple-600 line-through decoration-red-500 decoration-2">
                            {(data.originalPrice || 0).toLocaleString()} so'm
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-purple-600">Mijoz to'laydi:</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            BEPUL
                        </p>
                    </div>
                </div>
                <p className="text-center mt-2 text-sm font-medium text-purple-700">
                    Ushbu xizmat aksiya davrida mijozlar uchun mutlaqo bepul bo'ladi!
                </p>
            </div>

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

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="requiresBooking"
                    checked={data.requiresBooking || false}
                    onCheckedChange={(checked) => onUpdate({ requiresBooking: checked as boolean })}
                />
                <Label
                    htmlFor="requiresBooking"
                    className="text-sm font-normal cursor-pointer"
                >
                    Oldindan band qilish talab qilinadi
                </Label>
            </div>

            <div>
                <Label htmlFor="terms">Tavsif</Label>
                <Textarea
                    id="terms"
                    value={data.termsAndConditions || ""}
                    onChange={(e) => onUpdate({ termsAndConditions: e.target.value })}
                    placeholder="Aksiya haqida batafsil ma'lumot..."
                    className="min-h-[80px]"
                />
            </div>
        </div>
    );
};
