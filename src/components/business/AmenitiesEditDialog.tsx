import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wifi, CreditCard, Car, Accessibility, Baby, CalendarClock, Utensils, Truck, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define all possible amenities with their metadata
const AMENITY_CONFIG: Record<string, { label: string; icon: any }> = {
    // Common
    freeWifi: { label: "Bepul Wi-Fi", icon: Wifi },
    acceptsCreditCards: { label: "Karta orqali to'lov", icon: CreditCard },
    parking: { label: "Avtoturargoh", icon: Car },
    wheelchairAccessible: { label: "Nogironlar uchun qulay", icon: Accessibility },

    // Restaurants / Food
    goodForKids: { label: "Bolalar uchun qulay", icon: Baby },
    outdoorSeating: { label: "Teras / Ochiq joy", icon: Utensils },
    delivery: { label: "Yetkazib berish", icon: Truck },
    takeout: { label: "Olib ketish", icon: ShoppingBag },
    reservations: { label: "Band qilish", icon: CalendarClock },

    // Beauty / Service
    byAppointmentOnly: { label: "Faqat yozuv bo'yicha", icon: CalendarClock },
};

// Define default amenities available for all categories
const COMMON_AMENITIES = ['freeWifi', 'acceptsCreditCards', 'parking', 'wheelchairAccessible'];

// Define category-specific amenities
const CATEGORY_AMENITIES: Record<string, string[]> = {
    restaurants: ['goodForKids', 'outdoorSeating', 'delivery', 'takeout', 'reservations'],
    'coffee-tea': ['goodForKids', 'outdoorSeating', 'takeout', 'freeWifi'],
    'beauty-spas': ['byAppointmentOnly', 'goodForKids'],
    automotive: ['byAppointmentOnly'],
    'active-life': ['goodForKids', 'byAppointmentOnly']
};

interface AmenitiesEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amenities: Record<string, boolean>;
    businessId: string;
    categoryId?: string;
    onSuccess: () => void;
}

const AmenitiesEditDialog = ({ open, onOpenChange, amenities, businessId, categoryId, onSuccess }: AmenitiesEditDialogProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [localAmenities, setLocalAmenities] = useState<Record<string, boolean>>(amenities || {});

    useEffect(() => {
        setLocalAmenities(amenities || {});
    }, [amenities, open]);

    const handleToggle = (key: string) => {
        setLocalAmenities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getRelevantAmenities = () => {
        const categorySpecific = categoryId && CATEGORY_AMENITIES[categoryId] ? CATEGORY_AMENITIES[categoryId] : [];
        // Combined unique list
        return Array.from(new Set([...COMMON_AMENITIES, ...categorySpecific]));
    };

    const displayAmenities = getRelevantAmenities();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    amenities: localAmenities
                })
                .eq('id', businessId);

            if (error) throw error;

            toast({ title: "Muvaffaqiyatli", description: "Qulayliklar yangilandi" });
            onSuccess();
            onOpenChange(false);
            window.location.reload(); // Reload to reflect changes if state management isn't global
        } catch (error) {
            console.error('Amenities save error:', error);
            toast({
                title: "Xatolik",
                description: "Saqlashda xatolik yuz berdi",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xususiyatlarni tahrirlash</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                    {displayAmenities.map((key) => {
                        const config = AMENITY_CONFIG[key];
                        if (!config) return null; // Skip if config missing
                        const Icon = config.icon;

                        return (
                            <div
                                key={key}
                                className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                                onClick={() => handleToggle(key)}
                            >
                                <Checkbox
                                    id={key}
                                    checked={!!localAmenities[key]}
                                    onCheckedChange={() => handleToggle(key)}
                                />
                                <Label htmlFor={key} className="flex-1 flex items-center gap-2 cursor-pointer font-medium">
                                    <Icon className="h-4 w-4 text-primary" />
                                    {config.label}
                                </Label>
                            </div>
                        );
                    })}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Bekor qilish</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Saqlash
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AmenitiesEditDialog;
