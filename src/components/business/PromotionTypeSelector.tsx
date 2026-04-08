import { PromotionTypeConfig } from "@/types/promotion";
import { Card } from "@/components/ui/card";
import { usePromotionTypes } from "@/hooks/usePromotionTypes";
import { cn } from "@/lib/utils";
import { Check, Coins } from "lucide-react";

interface PromotionTypeSelectorProps {
    selectedType?: string;
    onSelectType: (type: string) => void;
    serviceCategory?: string;
}

export const PromotionTypeSelector = ({
    selectedType,
    onSelectType,
    serviceCategory,
}: PromotionTypeSelectorProps) => {
    const { getAvailableTypes, getTypeIcon } = usePromotionTypes();
    const availableTypes = getAvailableTypes(serviceCategory);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTypes.map((typeConfig) => {
                const Icon = getTypeIcon(typeConfig.type);
                const isSelected = selectedType === typeConfig.type;

                return (
                    <Card
                        key={typeConfig.type}
                        className={cn(
                            "p-6 cursor-pointer transition-all hover:shadow-lg relative",
                            isSelected
                                ? `ring-2 ring-${typeConfig.color}-500 bg-${typeConfig.color}-50`
                                : "hover:border-primary"
                        )}
                        onClick={() => onSelectType(typeConfig.type)}
                    >
                        {isSelected && (
                            <div className="absolute top-4 right-4">
                                <div className={`w-6 h-6 rounded-full bg-${typeConfig.color}-500 flex items-center justify-center`}>
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "p-3 rounded-lg",
                                `bg-${typeConfig.color}-100`
                            )}>
                                <Icon className={cn("w-6 h-6", `text-${typeConfig.color}-600`)} />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{typeConfig.labelUz}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {typeConfig.descriptionUz}
                                </p>

                                <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-amber-600 bg-amber-50 w-fit px-2 py-1 rounded-full border border-amber-200">
                                    <Coins className="w-3.5 h-3.5" />
                                    <span>{typeConfig.coinCost} coins</span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {typeConfig.availableFor.map((category) => (
                                        <span
                                            key={category}
                                            className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                                        >
                                            {category === 'all' ? 'Hammasi' : category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
