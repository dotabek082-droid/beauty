import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AddCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

// Luhn algorithm for card validation
const luhnCheck = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\s/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Detect card type
const getCardType = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^8600/.test(cleaned)) return 'uzcard';
    if (/^9860/.test(cleaned)) return 'humo';

    return 'unknown';
};

const AddCardDialog = ({ open, onOpenChange, onSuccess }: AddCardDialogProps) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.slice(0, 19); // 16 digits + 3 spaces
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({ title: "Xato", description: "Tizimga kiring", variant: "destructive" });
            return;
        }

        const cleaned = cardNumber.replace(/\s/g, '');

        // Validation
        if (cleaned.length !== 16) {
            toast({ title: "Xato", description: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak", variant: "destructive" });
            return;
        }

        // Luhn validation disabled for testing - accept any card
        // if (!luhnCheck(cleaned)) {
        //     toast({ title: "Xato", description: "Karta raqami noto'g'ri", variant: "destructive" });
        //     return;
        // }

        if (!cardHolder.trim()) {
            toast({ title: "Xato", description: "Karta egasining ismini kiriting", variant: "destructive" });
            return;
        }

        if (!expiryMonth || !expiryYear) {
            toast({ title: "Xato", description: "Amal qilish muddatini kiriting", variant: "destructive" });
            return;
        }

        const month = parseInt(expiryMonth);
        const year = parseInt(expiryYear);

        if (month < 1 || month > 12) {
            toast({ title: "Xato", description: "Oy 1-12 oralig'ida bo'lishi kerak", variant: "destructive" });
            return;
        }

        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            toast({ title: "Xato", description: "Karta muddati o'tgan", variant: "destructive" });
            return;
        }

        if (cvv.length !== 3) {
            toast({ title: "Xato", description: "CVV 3 ta raqamdan iborat bo'lishi kerak", variant: "destructive" });
            return;
        }

        setLoading(true);

        try {
            // Get existing cards
            const existingCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');

            if (!existingCards[user.id]) {
                existingCards[user.id] = { cards: [] };
            }

            const cardType = getCardType(cleaned);
            const maskedNumber = `**** **** **** ${cleaned.slice(-4)}`;

            const newCard = {
                id: crypto.randomUUID(),
                card_number: maskedNumber,
                card_holder: cardHolder.trim().toUpperCase(),
                expiry_month: expiryMonth.padStart(2, '0'),
                expiry_year: expiryYear,
                card_type: cardType,
                is_default: existingCards[user.id].cards.length === 0, // First card is default
                added_at: new Date().toISOString()
            };

            existingCards[user.id].cards.push(newCard);
            localStorage.setItem('user_payment_cards', JSON.stringify(existingCards));

            toast({ title: "Muvaffaqiyatli!", description: "Karta qo'shildi" });

            // Reset form
            setCardNumber("");
            setCardHolder("");
            setExpiryMonth("");
            setExpiryYear("");
            setCvv("");

            onOpenChange(false);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error adding card:", error);
            toast({ title: "Xato", description: "Karta qo'shishda xatolik", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Karta qo'shish</DialogTitle>
                    <DialogDescription>
                        To'lov kartangiz ma'lumotlarini kiriting
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Card Number */}
                    <div className="space-y-2">
                        <Label>Karta raqami *</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    {/* Card Holder */}
                    <div className="space-y-2">
                        <Label>Karta egasi *</Label>
                        <Input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="NAME SURNAME"
                            className="uppercase"
                            required
                        />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Amal qilish muddati *</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={expiryMonth}
                                    onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="MM"
                                    maxLength={2}
                                    required
                                />
                                <Input
                                    type="text"
                                    value={expiryYear}
                                    onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="YY"
                                    maxLength={2}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>CVV *</Label>
                            <Input
                                type="password"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="123"
                                maxLength={3}
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Bekor qilish
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Yuklanmoqda...
                                </>
                            ) : (
                                "Qo'shish"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCardDialog;
