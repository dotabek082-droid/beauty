import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Plus, Trash2, Check, History, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import AddCardDialog from "@/components/AddCardDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PaymentCard {
    id: string;
    card_number: string;
    card_holder: string;
    expiry_month: string;
    expiry_year: string;
    card_type: string;
    is_default: boolean;
    added_at: string;
    balance: number; // Added balance
}

interface PaymentTransaction {
    id: string;
    amount: number;
    type: 'payment' | 'refund' | 'topup';
    description: string;
    date: string;
    status: 'success' | 'pending' | 'failed';
}

const PaymentCardsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            loadCards();
            loadTransactions();
        }
    }, [user]);

    const loadCards = () => {
        if (!user) return;

        const storedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
        let userCards = storedCards[user.id]?.cards || [];

        // Inject specific demo card if not present
        const demoCardExists = userCards.some((c: PaymentCard) => c.card_number.includes('1234') && c.card_holder === 'BIZNES EGASI');

        if (!demoCardExists) {
            const demoCard: PaymentCard = {
                id: 'demo-card-123',
                card_number: '8600 **** **** 1234',
                card_holder: 'BIZNES EGASI',
                expiry_month: '12',
                expiry_year: '28',
                card_type: 'uzcard',
                is_default: true,
                added_at: new Date().toISOString(),
                balance: 5000000 // 5 mln sum initial balance
            };

            // Add to beginning
            userCards = [demoCard, ...userCards];

            // Save back to storage
            if (!storedCards[user.id]) storedCards[user.id] = {};
            storedCards[user.id].cards = userCards;
            localStorage.setItem('user_payment_cards', JSON.stringify(storedCards));
        }

        // Ensure all cards have balance
        userCards = userCards.map((card: PaymentCard) => ({
            ...card,
            balance: card.balance !== undefined ? card.balance : Math.floor(Math.random() * 1000000)
        }));

        setCards(userCards);
    };

    const loadTransactions = () => {
        if (!user) return;

        // Load from local storage or generate fake ones
        const storedTransactions = JSON.parse(localStorage.getItem('user_transactions') || '{}');
        let userTransactions = storedTransactions[user.id] || [];

        if (userTransactions.length === 0) {
            // Generate fake history
            userTransactions = [
                {
                    id: 'tr-1',
                    amount: -150000,
                    type: 'payment',
                    description: "Go'zallik saloni xizmati",
                    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    status: 'success'
                },
                {
                    id: 'tr-2',
                    amount: -45000,
                    type: 'payment',
                    description: "Manikyur xizmati",
                    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    status: 'success'
                },
                {
                    id: 'tr-3',
                    amount: 1000000,
                    type: 'topup',
                    description: "Karta to'ldirish",
                    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                    status: 'success'
                }
            ];

            // Save fake transactions
            storedTransactions[user.id] = userTransactions;
            localStorage.setItem('user_transactions', JSON.stringify(storedTransactions));
        }

        setTransactions(userTransactions.sort((a: PaymentTransaction, b: PaymentTransaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
    };

    const handleSetDefault = (cardId: string) => {
        if (!user) return;

        const storedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
        const userCards = storedCards[user.id]?.cards || [];

        const updatedCards = userCards.map((card: PaymentCard) => ({
            ...card,
            is_default: card.id === cardId
        }));

        storedCards[user.id] = { cards: updatedCards };
        localStorage.setItem('user_payment_cards', JSON.stringify(storedCards));
        setCards(updatedCards);

        toast({ title: "Muvaffaqiyatli!", description: "Asosiy karta o'rnatildi" });
    };

    const handleDeleteCard = (cardId: string) => {
        if (!user) return;

        const storedCards = JSON.parse(localStorage.getItem('user_payment_cards') || '{}');
        const userCards = storedCards[user.id]?.cards || [];

        const updatedCards = userCards.filter((card: PaymentCard) => card.id !== cardId);

        // If deleted card was default and there are other cards, make first one default
        if (updatedCards.length > 0) {
            const hasDefault = updatedCards.some((card: PaymentCard) => card.is_default);
            if (!hasDefault) {
                updatedCards[0].is_default = true;
            }
        }

        storedCards[user.id] = { cards: updatedCards };
        localStorage.setItem('user_payment_cards', JSON.stringify(storedCards));
        setCards(updatedCards);

        toast({ title: "O'chirildi", description: "Karta o'chirildi" });
    };

    const getCardIcon = (type: string) => {
        return <CreditCard className="w-6 h-6" />;
    };

    const getCardColor = (type: string) => {
        switch (type) {
            case 'visa': return 'from-blue-600 to-blue-800';
            case 'mastercard': return 'from-red-500 to-orange-600';
            case 'uzcard': return 'from-blue-500 to-cyan-600';
            case 'humo': return 'from-orange-400 to-orange-600';
            default: return 'from-gray-600 to-gray-800';
        }
    };

    if (!user) {
        navigate("/auth");
        return null;
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="flex items-center gap-3 p-4 safe-top">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-foreground">To'lov usullari</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                {/* My Cards Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-foreground">Mening Kartalarim</h2>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsAddDialogOpen(true)}
                            className="text-primary hover:text-primary/80"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Qo'shish
                        </Button>
                    </div>

                    {cards.length === 0 ? (
                        <Card className="p-8 text-center border-dashed">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">Kartalar yo'q</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                To'lov qilish uchun karta qo'shing
                            </p>
                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                Karta qo'shish
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {cards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={`relative overflow-hidden rounded-2xl text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]`}>
                                        {/* Card Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${getCardColor(card.card_type)}`} />
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                                        <div className="relative p-6 z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-2">
                                                    {getCardIcon(card.card_type)}
                                                    <span className="font-medium opacity-90 capitalize">{card.card_type}</span>
                                                </div>
                                                {card.is_default && (
                                                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                                                        Asosiy
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="mb-8">
                                                <p className="font-mono text-2xl tracking-wider drop-shadow-md">
                                                    {card.card_number}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs opacity-70 mb-1 uppercase tracking-wider">Karta egasi</p>
                                                    <p className="font-medium tracking-wide">{card.card_holder}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs opacity-70 mb-1 uppercase tracking-wider">Amal qilish</p>
                                                    <p className="font-medium tracking-wide">
                                                        {card.expiry_month}/{card.expiry_year}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs opacity-70 mb-1">Balans</p>
                                                    <p className="text-lg font-bold">
                                                        {card.balance.toLocaleString()} so'm
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!card.is_default && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-white hover:bg-white/20 hover:text-white rounded-full"
                                                            onClick={() => handleSetDefault(card.id)}
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-white hover:bg-white/20 hover:text-white rounded-full"
                                                        onClick={() => handleDeleteCard(card.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Transaction History Section */}
                <div>
                    <h2 className="text-lg font-bold text-foreground mb-4">To'lovlar Tarixi</h2>

                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p>Tarix bo'sh</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction, index) => (
                                <motion.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.05) }}
                                >
                                    <Card className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'topup'
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {transaction.type === 'topup' ? (
                                                    <ArrowDownLeft className="w-5 h-5" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{transaction.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${transaction.type === 'topup'
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-foreground'
                                                }`}>
                                                {transaction.type === 'topup' ? '+' : ''}{transaction.amount.toLocaleString()} so'm
                                            </p>
                                            <Badge variant="outline" className="text-[10px] h-5">
                                                {transaction.status === 'success' ? 'Muvaffaqiyatli' : 'Jarayonda'}
                                            </Badge>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddCardDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={loadCards}
            />

            <BottomNav />
        </div>
    );
};

export default PaymentCardsPage;
