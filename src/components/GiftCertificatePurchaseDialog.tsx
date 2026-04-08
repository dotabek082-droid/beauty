import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Copy, Check, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCoinBalance } from "@/utils/coinBalance";
import { purchaseGiftCertificate } from "@/utils/giftCertificates";
import { useToast } from "@/hooks/use-toast";
import AddCardDialog from "./AddCardDialog";
import { CreditCard, Plus, Wallet } from "lucide-react";

interface PaymentCard {
    id: string;
    number: string;
    holderName: string;
    expiryDate: string;
    type: 'uzcard' | 'humo' | 'visa' | 'mastercard';
    balance: number;
}

interface GiftCertificatePurchaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000];

export function GiftCertificatePurchaseDialog({ open, onOpenChange }: GiftCertificatePurchaseDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState('');
    const [message, setMessage] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Payment states
    const [paymentMethod, setPaymentMethod] = useState<'balance' | 'click' | 'payme' | 'card'>('balance');
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string>("");
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load cards
    useEffect(() => {
        if (open) {
            loadCards();
        }
    }, [open]);

    const loadCards = () => {
        if (!user) return;
        const savedCards = localStorage.getItem('user_payment_cards');
        let userCards: PaymentCard[] = [];

        if (savedCards) {
            try {
                const parsedData = JSON.parse(savedCards);
                // Check if it's the new structure (keyed by user ID)
                if (parsedData[user.id] && Array.isArray(parsedData[user.id].cards)) {
                    userCards = parsedData[user.id].cards;
                }
                // Fallback for old structure (direct array) - though we should probably migrate
                else if (Array.isArray(parsedData)) {
                    userCards = parsedData;
                }
            } catch (e) {
                console.error("Error parsing cards:", e);
            }
        }

        if (userCards.length === 0) {
            // Default demo card
            const demoCard: PaymentCard = {
                id: 'card-1',
                number: '8600 **** **** 1234',
                holderName: 'BIZNES EGASI',
                expiryDate: '12/28',
                type: 'uzcard',
                balance: 5000000
            };
            // Save in new structure
            const newStorageData = savedCards ? JSON.parse(savedCards) : {};
            newStorageData[user.id] = { cards: [demoCard] };
            localStorage.setItem('user_payment_cards', JSON.stringify(newStorageData));
            userCards = [demoCard];
        }

        setCards(userCards);
        if (userCards.length > 0 && !selectedCardId) {
            setSelectedCardId(userCards[0].id);
        }
    };

    const balance = user ? getCoinBalance(user.id) : 0;
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    const newBalance = balance - amount;

    const handleClose = () => {
        setStep('select');
        setSelectedAmount(0);
        setCustomAmount('');
        setMessage('');
        setGeneratedCode('');
        setCopied(false);
        onOpenChange(false);
    };

    const handleNext = () => {
        if (amount < 1000) {
            toast({
                title: "Xatolik",
                description: "Minimal miqdor 1,000 tanga",
                variant: "destructive"
            });
            return;
        }

        if (paymentMethod === 'balance' && amount > balance) {
            toast({
                title: "Yetarli emas",
                description: "Balansingizda yetarli tanga yo'q",
                variant: "destructive"
            });
            return;
        }

        if (paymentMethod === 'card' && !selectedCardId) {
            toast({
                title: "Karta tanlanmadi",
                description: "Iltimos, to'lov uchun karta tanlang",
                variant: "destructive"
            });
            return;
        }

        setStep('confirm');
    };

    const handlePurchase = async () => {
        if (!user) return;

        setIsLoading(true);

        try {
            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (paymentMethod === 'balance') {
                const currentBalance = getCoinBalance(user.id);
                if (currentBalance < amount) {
                    throw new Error("Balans yetarli emas");
                }
            } else if (paymentMethod === 'card') {
                const selectedCard = cards.find(c => c.id === selectedCardId);
                if (selectedCard) {
                    if (selectedCard.balance < amount) {
                        throw new Error("Kartada mablag' yetarli emas");
                    }

                    // Deduct from card
                    const savedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
                    if (savedCards[user.id] && savedCards[user.id].cards) {
                        savedCards[user.id].cards = savedCards[user.id].cards.map((c: any) =>
                            c.id === selectedCardId ? { ...c, balance: c.balance - amount } : c
                        );
                        localStorage.setItem('user_payment_cards', JSON.stringify(savedCards));

                        // Update local state
                        setCards(savedCards[user.id].cards);
                    }
                }
            }

            // Purchase certificate logic (simplified)
            // In a real app, we would add coins to balance OR generate a certificate
            // For this flow "Tanga sotib olish", we should probably ADD coins to balance
            // But the dialog is named "GiftCertificatePurchase", so let's stick to generating a code
            // AND deducting from source.

            // If paying with external method (card/click), we are effectively BUYING the certificate with money
            // If paying with balance, we are CONVERTING balance to certificate

            const certificate = purchaseGiftCertificate(
                user.id,
                user.email || 'User',
                amount,
                message || undefined
            );

            // Record transaction
            const transactions = JSON.parse(localStorage.getItem('coinTransactions') || '[]');

            // If paid by card, we record an "income" transaction first (buying coins) then "spend" (buying cert)?
            // Or just record the purchase.

            if (paymentMethod !== 'balance') {
                // External payment
                transactions.push({
                    id: `txn_${Date.now()}_in`,
                    userId: user.id,
                    type: 'payment',
                    amount: amount,
                    description: `To'lov tizimi orqali (${paymentMethod})`,
                    created_at: new Date().toISOString()
                });
            }

            transactions.push({
                id: `txn_${Date.now()}_out`,
                userId: user.id,
                type: 'gift_purchase',
                amount: -amount,
                description: `Sovg'a sertifikati xarid qilindi`,
                created_at: new Date().toISOString()
            });

            localStorage.setItem('coinTransactions', JSON.stringify(transactions));

            setGeneratedCode(certificate.code);
            setStep('success');

            toast({
                title: "Muvaffaqiyatli!",
                description: `${amount.toLocaleString()} tangalik sovg'a sertifikati yaratildi`,
            });
        } catch (error: any) {
            toast({
                title: "Xatolik",
                description: error.message || "Xatolik yuz berdi",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Nusxalandi",
            description: "Sovg'a kodi nusxalandi"
        });
    };

    const handleShare = (platform: 'whatsapp' | 'telegram') => {
        const text = `Sizga sovg'a! ${amount.toLocaleString()} so'mlik xizmat sertifikati.\n\nSovg'a kodi: ${generatedCode}\n\n${message ? `Xabar: "${message}"\n\n` : ''}Bu kodni ilovada ishlatib, xizmatlardan foydalaning!`;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else {
            window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                    {step === 'select' && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-primary" />
                                    Sovg'a sertifikati
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <Label>Miqdorni tanlang</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {PRESET_AMOUNTS.map((preset) => (
                                            <Button
                                                key={preset}
                                                variant={selectedAmount === preset ? "default" : "outline"}
                                                onClick={() => {
                                                    setSelectedAmount(preset);
                                                    setCustomAmount('');
                                                }}
                                                className="h-auto py-3"
                                            >
                                                <div className="text-center">
                                                    <div className="font-bold">{preset.toLocaleString()}</div>
                                                    <div className="text-xs opacity-70">tanga</div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="custom">Boshqa miqdor (min. 1,000)</Label>
                                    <Input
                                        id="custom"
                                        type="number"
                                        min="1000"
                                        placeholder="Miqdorni kiriting"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setSelectedAmount(0);
                                        }}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message">Xabar (ixtiyoriy)</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Masalan: Tug'ilgan kuning muborak!"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="mt-1 h-20"
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {message.length}/200
                                    </p>
                                </div>

                            </div>

                            {/* Payment Method Selection */}
                            <div className="space-y-3">
                                <Label>To'lov usuli</Label>
                                <div className="space-y-2">
                                    {/* Balance */}
                                    <div
                                        className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'balance'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => setPaymentMethod('balance')}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">Hisobdan</p>
                                            <p className="text-xs text-muted-foreground truncate">{balance.toLocaleString()} tanga</p>
                                        </div>
                                        {paymentMethod === 'balance' && <Check className="w-5 h-5 text-primary" />}
                                    </div>

                                    {/* Card */}
                                    <div
                                        className={`flex flex-col gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">Karta orqali</p>
                                                <p className="text-xs text-muted-foreground">Uzcard/Humo</p>
                                            </div>
                                            {paymentMethod === 'card' && <Check className="w-5 h-5 text-primary" />}
                                        </div>

                                        {/* Card Selection List */}
                                        {paymentMethod === 'card' && (
                                            <div className="w-full pl-12 pr-2 pb-2 space-y-2 animate-in slide-in-from-top-2">
                                                {cards.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {cards.map((card) => (
                                                            <div
                                                                key={card.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCardId(card.id);
                                                                }}
                                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCardId === card.id
                                                                    ? "bg-background border-primary shadow-sm ring-1 ring-primary/20"
                                                                    : "bg-background/50 border-transparent hover:bg-background"
                                                                    }`}
                                                            >
                                                                <div className={`w-10 h-6 rounded ${card.type === 'uzcard' ? 'bg-blue-600' : 'bg-green-600'} flex items-center justify-center text-[8px] text-white font-bold`}>
                                                                    {card.type.toUpperCase()}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{card.number}</p>
                                                                    <p className="text-xs text-muted-foreground">{card.balance.toLocaleString()} so'm</p>
                                                                </div>
                                                                {selectedCardId === card.id && (
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">Saqlangan kartalar yo'q</p>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full h-9 text-xs gap-2 border-dashed"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsAddCardOpen(true);
                                                    }}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Yangi karta qo'shish
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Click / Payme */}
                                    <div
                                        className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'click'
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => setPaymentMethod('click')}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">Click / Payme</p>
                                            <p className="text-xs text-muted-foreground">Tezkor to'lov</p>
                                        </div>
                                        {paymentMethod === 'click' && <Check className="w-5 h-5 text-primary" />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleClose} className="flex-1">
                                    Bekor qilish
                                </Button>
                                <Button onClick={handleNext} className="flex-1">
                                    Davom etish →
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 'confirm' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Tasdiqlash</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-muted-foreground">Miqdor</span>
                                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30">
                                            {amount.toLocaleString()} tanga
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Qiymati</span>
                                        <span className="font-bold text-amber-600">{amount.toLocaleString()} so'm</span>
                                    </div>
                                </div>

                                {message && (
                                    <div className="bg-secondary/30 p-3 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Xabar:</p>
                                        <p className="text-sm italic">"{message}"</p>
                                    </div>
                                )}

                                <div className="bg-secondary/30 p-3 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">To'lov usuli:</span>
                                        <span className="font-semibold">
                                            {paymentMethod === 'balance' ? 'Hisobdan' : (paymentMethod === 'card' ? 'Karta orqali' : 'Click / Payme')}
                                        </span>
                                    </div>
                                    {paymentMethod === 'balance' && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Joriy balans:</span>
                                                <span className="font-semibold">{balance.toLocaleString()} tanga</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Yangi balans:</span>
                                                <span className="font-semibold text-primary">{newBalance.toLocaleString()} tanga</span>
                                            </div>
                                        </>
                                    )}
                                    {paymentMethod !== 'balance' && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Yechib olinadi:</span>
                                            <span className="font-semibold text-primary">{amount.toLocaleString()} so'm</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setStep('select')} className="flex-1" disabled={isLoading}>
                                        ← Orqaga
                                    </Button>
                                    <Button onClick={handlePurchase} className="flex-1" disabled={isLoading}>
                                        {isLoading ? "Bajarilmoqda..." : "Tasdiqlash"}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                </DialogContent>
            </Dialog>

            <AddCardDialog
                open={isAddCardOpen}
                onOpenChange={setIsAddCardOpen}
                onSuccess={loadCards}
            />

            {
                step === 'success' && (
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-success">
                                    <Check className="w-5 h-5" />
                                    Muvaffaqiyatli!
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="w-8 h-8 text-success" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Sovg'a sertifikati yaratildi
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm mb-2 block">Sovg'a kodi:</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 p-4 rounded-lg">
                                            <p className="text-2xl font-bold text-center tracking-wider text-amber-600">
                                                {generatedCode}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleCopy}
                                            className={copied ? "bg-success/20 border-success" : ""}
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-success" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm mb-2 block flex items-center gap-2">
                                        <Share2 className="w-4 h-4" />
                                        Ulashish:
                                    </Label>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleShare('whatsapp')}
                                            className="flex-1"
                                        >
                                            <span className="text-lg mr-2">💬</span>
                                            WhatsApp
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleShare('telegram')}
                                            className="flex-1"
                                        >
                                            <span className="text-lg mr-2">✈️</span>
                                            Telegram
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">
                                        <strong className="text-foreground">Eslatma:</strong> Bu kod 90 kun ichida ishlatilishi kerak. Koddan faqat bir marta foydalanish mumkin.
                                    </p>
                                </div>

                                <Button onClick={handleClose} className="w-full">
                                    Tayyor
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }
        </>
    );
}

export default GiftCertificatePurchaseDialog;
