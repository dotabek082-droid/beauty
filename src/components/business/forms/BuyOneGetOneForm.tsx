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

interface BuyOneGetOneFormProps {
    data: Partial<CreatePromotionData>;
    onUpdate: (data: Partial<CreatePromotionData>) => void;
    services?: Service[];
}

export const BuyOneGetOneForm = ({ data, onUpdate, services = [] }: BuyOneGetOneFormProps) => {
    const handleServiceSelect = (serviceId: string) => {
        const service = services.find((s) => s.id === serviceId);
        if (service) {
            onUpdate({
                serviceName: service.name,
                originalPrice: service.price,
                serviceCategory: service.category,
                serviceIds: [service.id] // Track selected service ID
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="minPurchase">Sotib olish soni *</Label>
                    <Input
                        id="minPurchase"
                        type="number"
                        value={data.minPurchaseQuantity || 1}
                        onChange={(e) => onUpdate({ minPurchaseQuantity: Number(e.target.value) })}
                        placeholder="1"
                        min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Nechta sotib olish kerak
                    </p>
                </div>

                <div>
                    <Label htmlFor="freeQuantity">Bepul miqdor *</Label>
                    <Input
                        id="freeQuantity"
                        type="number"
                        value={data.freeQuantity || 1}
                        onChange={(e) => onUpdate({ freeQuantity: Number(e.target.value) })}
                        placeholder="1"
                        min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Nechta bepul beriladi
                    </p>
                </div>

                <div className="col-span-2">
                    <Label htmlFor="maxUses">Limit (nechta kishi uchun)</Label>
                    <Input
                        id="maxUses"
                        type="number"
                        value={data.maxUses || ""}
                        onChange={(e) => onUpdate({ maxUses: Number(e.target.value) })}
                        placeholder="Cheklovsiz"
                        min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Masalan: Faqat birinchi 20 ta mijozga (ixtiyoriy)
                    </p>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                    <strong>Taklif:</strong> {data.minPurchaseQuantity || 1} ta sotib oling, {data.freeQuantity || 1} ta bepul oling
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

            <div>
                <Label htmlFor="terms">Tavsif</Label>
                <Textarea
                    id="terms"
                    value={data.termsAndConditions || ""}
                    onChange={(e) => onUpdate({ termsAndConditions: e.target.value })}
                    placeholder="Aksiya haqida..."
                    className="min-h-[80px]"
                />
            </div>
        </div>
    );
};
