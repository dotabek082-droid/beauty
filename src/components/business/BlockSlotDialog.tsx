import { useState } from "react";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Ban } from "lucide-react";

interface BlockSlotDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | null;
    selectedTime: string | null;
    onConfirm: (date: string, time: string, reason?: string) => void;
}

export const BlockSlotDialog = ({
    isOpen,
    onClose,
    selectedDate,
    selectedTime,
    onConfirm,
}: BlockSlotDialogProps) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime) return;

        setIsSubmitting(true);
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        await onConfirm(dateStr, selectedTime, reason || undefined);
        setIsSubmitting(false);
        setReason("");
        onClose();
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Ban className="w-5 h-5 text-orange-600" />
                        Vaqtni bloklash
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                                {selectedDate && format(selectedDate, "d MMMM, yyyy", { locale: uz })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">{selectedTime}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm">
                            Sabab (ixtiyoriy)
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Masalan: Walk-in mijoz, texnik tanaffus..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Eslatma:</strong> Bu vaqt bloki onlayn bron qilishda ko'rinmaydi. Walk-in mijozlar uchun band qilingan.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Yuklanmoqda..." : "Bloklash"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
