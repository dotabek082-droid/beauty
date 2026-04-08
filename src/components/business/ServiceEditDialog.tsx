import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
    description?: string;
}

interface ServiceEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service?: Service | null;
    businessId: string;
    onSuccess: () => void;
}

const ServiceEditDialog = ({ open, onOpenChange, service, businessId, onSuccess }: ServiceEditDialogProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Service>>({
        name: "",
        price: 0,
        duration: 30,
        description: "",
    });

    // Reset or populate form when dialog opens/changes
    useState(() => {
        if (service) {
            setFormData({
                name: service.name,
                price: service.price,
                duration: service.duration,
                description: service.description || "",
            });
        } else {
            setFormData({
                name: "",
                price: 0,
                duration: 30,
                description: "",
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.duration) {
            toast({
                title: "Xatolik",
                description: "Barcha maydonlarni to'ldiring",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            if (service?.id) {
                // Update existing
                const { error } = await supabase
                    .from('services')
                    .update({
                        name: formData.name,
                        price: formData.price,
                        duration: formData.duration,
                        description: formData.description
                    })
                    .eq('id', service.id);

                if (error) throw error;
                toast({ title: "Muvaffaqiyatli", description: "Xizmat yangilandi" });
            } else {
                // Create new
                const { error } = await supabase
                    .from('services')
                    .insert({
                        business_id: businessId,
                        name: formData.name,
                        price: formData.price,
                        duration: formData.duration,
                        description: formData.description
                    });

                if (error) throw error;
                toast({ title: "Muvaffaqiyatli", description: "Xizmat qo'shildi" });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Service save error:', error);
            toast({
                title: "Xatolik",
                description: "Xizmatni saqlashda xatolik yuz berdi",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!service?.id) return;
        if (!confirm("Haqiqatan ham bu xizmatni o'chirmoqchimisiz?")) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', service.id);

            if (error) throw error;
            toast({ title: "Muvaffaqiyatli", description: "Xizmat o'chirildi" });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Service delete error:', error);
            toast({
                title: "Xatolik",
                description: "Xizmatni o'chirishda xatolik yuz berdi",
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
                    <DialogTitle>{service ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Xizmat nomi</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Masalan: Soch turmaklash"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Narxi (so'm)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Davomiyligi (daq)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Tavsif (ixtiyoriy)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Xizmat haqida qisqacha ma'lumot"
                        />
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between gap-2">
                        {service && (
                            <Button type="button" variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <div className="flex gap-2 w-full justify-end">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                                Bekor qilish
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Saqlash
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ServiceEditDialog;
