import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { redeemGiftCertificate } from "@/utils/giftCertificates";
import { useToast } from "@/hooks/use-toast";

interface GiftCertificateRedemptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GiftCertificateRedemptionDialog({ open, onOpenChange }: GiftCertificateRedemptionDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [redeemedAmount, setRedeemedAmount] = useState(0);
    const [redeemedMessage, setRedeemedMessage] = useState('');

    const handleClose = () => {
        setCode('');
        setLoading(false);
        setSuccess(false);
        setRedeemedAmount(0);
        setRedeemedMessage('');
        onOpenChange(false);
    };

    const handleRedeem = async () => {
        if (!user) return;

        const trimmedCode = code.trim().toUpperCase();

        if (!trimmedCode) {
            toast({
                title: "Xatolik",
                description: "Iltimos, kodni kiriting",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            const result = redeemGiftCertificate(trimmedCode, user.id, user.email || 'User');

            if (result.success) {
                // Add coins to balance
                const transactions = JSON.parse(localStorage.getItem('coinTransactions') || '[]');
                transactions.push({
                    id: `txn_${Date.now()}`,
                    userId: user.id,
                    type: 'gift_redeemed',
                    amount: result.amount,
                    description: `Sovg'a sertifikati qabul qilindi`,
                    created_at: new Date().toISOString()
                });
                localStorage.setItem('coinTransactions', JSON.stringify(transactions));

                setRedeemedAmount(result.amount || 0);
                setRedeemedMessage(result.message || '');
                setSuccess(true);

                toast({
                    title: "Tabriklaymiz!",
                    description: `+${(result.amount || 0).toLocaleString()} tanga qo'shildi`,
                });
            } else {
                toast({
                    title: "Xatolik",
                    description: result.error || "Kod yaroqsiz",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Xatolik",
                description: "Sovg'ani qabul qilishda xatolik yuz berdi",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                {!success ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-primary" />
                                Sovg'ani qabul qilish
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="giftCode">Sovg'a kodi</Label>
                                <Input
                                    id="giftCode"
                                    placeholder="BEAUTYXXXXXXXX"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="mt-1 font-mono text-lg tracking-wider"
                                    maxLength={14}
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Sizga yuborilgan 14 belgili kodni kiriting
                                </p>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground">
                                        Kod bir marta ishlatiladi va 90 kun davomida amal qiladi.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleClose} className="flex-1">
                                    Bekor qilish
                                </Button>
                                <Button
                                    onClick={handleRedeem}
                                    className="flex-1"
                                    disabled={loading || !code.trim()}
                                >
                                    {loading ? "Tekshirilmoqda..." : "Qabul qilish"}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-success">
                                <Check className="w-5 h-5" />
                                Tabriklaymiz!
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Gift className="w-10 h-10 text-success" />
                                </div>

                                <div className="mb-4">
                                    <p className="text-3xl font-bold text-success mb-1">
                                        +{redeemedAmount.toLocaleString()} tanga
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        hisobingizga qo'shildi!
                                    </p>
                                </div>

                                {redeemedMessage && (
                                    <div className="bg-secondary/30 p-4 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Xabar:</p>
                                        <p className="text-sm italic font-medium">"{redeemedMessage}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground text-center">
                                    Endi bu tangalardan xizmatlar uchun to'lovda foydalanishingiz mumkin!
                                </p>
                            </div>

                            <Button onClick={handleClose} className="w-full">
                                Yopish
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default GiftCertificateRedemptionDialog;
