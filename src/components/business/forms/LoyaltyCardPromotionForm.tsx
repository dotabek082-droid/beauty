import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreatePromotionData } from "@/types/promotion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Service } from "@/types/service";

interface LoyaltyCardPromotionFormProps {
    data: Partial<CreatePromotionData>;
    onUpdate: (data: Partial<CreatePromotionData>) => void;
    services?: Service[];
}

export const LoyaltyCardPromotionForm = ({ data, onUpdate, services = [] }: LoyaltyCardPromotionFormProps) => {
    const handleServiceSelect = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId);
        if (service) {
            onUpdate({
                serviceName: service.name,
                originalPrice: service.price,
                serviceCategory: service.category,
                serviceIds: [service.id]
            });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="serviceSelect">Xizmatni tanlang *</Label>
                <Select
                    value={data.serviceIds?.[0] || ""}
                    onValueChange={handleServiceSelect}
                >
                    <SelectTrigger id="serviceSelect">
                        <SelectValue placeholder="Xizmatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                                {service.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="originalPrice">Narx (so'm)</Label>
                <Input
                    id="originalPrice"
                    type="number"
                    value={data.originalPrice || ""}
                    disabled
                    className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Xizmat narxi avtomatik tarzda belgilanadi
                </p>
            </div>

            <div>
                <Label htmlFor="requiredVisits">Kerakli tashriflar soni *</Label>
                <Input
                    id="requiredVisits"
                    type="number"
                    value={data.requiredVisits || ""}
                    onChange={(e) => onUpdate({ requiredVisits: Number(e.target.value) })}
                    placeholder="10"
                    min="1"
                    required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Nechta tashrifdan keyin bepul xizmat beriladi (masalan: 10)
                </p>
            </div>

            <div>
                <Label htmlFor="maxRedemptions">Maksimal foydalanish (ixtiyoriy)</Label>
                <Input
                    id="maxRedemptions"
                    type="number"
                    value={data.maxRedemptions || ""}
                    onChange={(e) => onUpdate({ maxRedemptions: Number(e.target.value) })}
                    placeholder="100"
                    min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Jami nechta mijoz foydalanishi mumkin (bo'sh qoldiring cheksiz uchun)
                </p>
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
                    placeholder="Sadoqat kartasi haqida..."
                    className="min-h-[80px]"
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    <strong>Maslahat:</strong> {data.requiredVisits || "X"} ta tashrifdan keyin mijoz bepul xizmat oladi
                </p>
            </div>
        </div>
    );
};
