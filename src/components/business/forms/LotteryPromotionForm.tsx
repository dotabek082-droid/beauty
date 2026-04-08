import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreatePromotionData } from "@/types/promotion";
import { Service } from "@/types/service";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface LotteryPromotionFormProps {
    data: Partial<CreatePromotionData>;
    onUpdate: (data: Partial<CreatePromotionData>) => void;
    services?: Service[];
}

export const LotteryPromotionForm = ({ data, onUpdate, services = [] }: LotteryPromotionFormProps) => {

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

    return (
        <div className="space-y-4">
            <div>
                <Label className="mb-2 block">Xizmat nomi (Yutuqlar) *</Label>
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
                        placeholder="Masalan: Soch turmagi"
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

            {services.length === 0 && (
                <div>
                    <Label htmlFor="originalPrice">Asl narx (so'm) *</Label>
                    <Input
                        id="originalPrice"
                        type="number"
                        value={data.originalPrice || ""}
                        onChange={(e) => onUpdate({ originalPrice: Number(e.target.value) })}
                        placeholder="100000"
                    />
                </div>
            )}

            <div>
                <Label htmlFor="winnerCount">G'oliblar soni *</Label>
                <Input
                    id="winnerCount"
                    type="number"
                    value={data.winnerCount || ""}
                    onChange={(e) => onUpdate({ winnerCount: Number(e.target.value) })}
                    placeholder="3"
                />
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
