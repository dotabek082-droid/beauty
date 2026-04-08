import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Tag, Calendar, Ticket } from 'lucide-react';
import { BusinessPromotion } from '@/types/business';
import { useToast } from '@/hooks/use-toast';

interface ManualPromotionRegistrationProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientName: string;
    clientId: string;
    businessId: string;
    promotions: BusinessPromotion[];
    onRegister?: (promotionId: string, clientId: string) => void;
}

export function ManualPromotionRegistration({
    open,
    onOpenChange,
    clientName,
    clientId,
    businessId,
    promotions,
    onRegister
}: ManualPromotionRegistrationProps) {
    const [selectedPromotion, setSelectedPromotion] = useState<BusinessPromotion | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const { toast } = useToast();

    // Filter only active promotions
    const activePromotions = (promotions || []).filter(
        p => p?.approvalStatus?.status === 'active' || p?.isActive === true
    );

    const getPromotionIcon = (type: string) => {
        const icons: Record<string, string> = {
            lottery: '🎟️',
            buy_one_get_one: '🎁',
            discount: '💰',
            free_service: '✨',
            loyalty_card: '🎫',
            service_bundle: '📦'
        };
        return icons[type] || '🎉';
    };

    const getPromotionTypeName = (type: string) => {
        const names: Record<string, string> = {
            lottery: 'Lotereya',
            buy_one_get_one: '1+1',
            discount: 'Chegirma',
            free_service: 'Bepul',
            loyalty_card: 'Sadoqat',
            service_bundle: 'Paket'
        };
        return names[type] || type;
    };

    const handleConfirm = () => {
        if (!selectedPromotion) return;

        // Call the onRegister callback
        onRegister?.(selectedPromotion.id, clientId);

        // Show success toast
        toast({
            title: "Muvaffaqiyatli ro'yxatga olindi! ✅",
            description: `${clientName} - ${selectedPromotion.serviceName} aksiyasidan foydalandi`,
            duration: 3000,
        });

        // Reset and close
        setSelectedPromotion(null);
        setIsConfirming(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedPromotion(null);
                setIsConfirming(false);
            }
            onOpenChange(isOpen);
        }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Xizmatdan foydalanishni ro'yxatga olish
                    </DialogTitle>
                    <DialogDescription>
                        {clientName} uchun aksiya tanlang
                    </DialogDescription>
                </DialogHeader>

                {!isConfirming ? (
                    <div className="space-y-4 mt-4">
                        {activePromotions.length === 0 ? (
                            <Card className="p-8 text-center">
                                <Ticket className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                                <p className="text-muted-foreground">
                                    Faol aksiyalar mavjud emas
                                </p>
                            </Card>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    Jami {activePromotions.length} ta faol aksiya
                                </p>

                                <div className="space-y-2">
                                    {activePromotions.map((promo) => (
                                        <Card
                                            key={promo.id}
                                            className={`p-4 cursor-pointer transition-all ${selectedPromotion?.id === promo.id
                                                ? 'border-primary border-2 bg-primary/5'
                                                : 'hover:border-primary/50 hover:bg-muted/50'
                                                }`}
                                            onClick={() => setSelectedPromotion(promo)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="text-3xl">{getPromotionIcon(promo.promotionType)}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-semibold text-base">
                                                                {promo.serviceName}
                                                            </h4>
                                                            {promo.serviceDescription && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {promo.serviceDescription}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge variant="secondary">
                                                            {getPromotionTypeName(promo.promotionType)}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(promo.startsAt).toLocaleDateString('uz-UZ')} -
                                                            {promo.endsAt ? new Date(promo.endsAt).toLocaleDateString('uz-UZ') : 'Muddatsiz'}
                                                        </div>
                                                        {promo.originalPrice && (
                                                            <div className="flex items-center gap-1">
                                                                <Tag className="w-3 h-3" />
                                                                {promo.originalPrice.toLocaleString()} so'm
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedPromotion?.id === promo.id && (
                                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {selectedPromotion && (
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setSelectedPromotion(null)}
                                        >
                                            Bekor qilish
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() => setIsConfirming(true)}
                                        >
                                            Davom etish
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">{getPromotionIcon(selectedPromotion!.promotionType)}</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{selectedPromotion!.serviceName}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedPromotion!.serviceDescription || 'Tavsif yo\'q'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Mijoz:</span>
                                <span className="font-medium">{clientName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Aksiya:</span>
                                <span className="font-medium">{selectedPromotion!.serviceName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Turi:</span>
                                <Badge variant="secondary" className="text-xs">
                                    {getPromotionTypeName(selectedPromotion!.promotionType)}
                                </Badge>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Tasdiqlashdan so'ng, bu aksiya mijoz tomonidan foydalanilgan deb belgilanadi.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsConfirming(false)}
                            >
                                Orqaga
                            </Button>
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={handleConfirm}
                            >
                                ✓ Tasdiqlash
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
