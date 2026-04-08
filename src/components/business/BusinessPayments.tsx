import { useState } from "react";
import { CreditCard, Plus, Trash2, Calendar, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentCard {
    id: string;
    number: string;
    type: "uzcard" | "humo" | "visa" | "mastercard";
    expiry: string;
    holder: string;
}

interface Transaction {
    id: string;
    amount: number;
    date: string;
    type: "topup" | "payment";
    description: string;
    status: "success" | "pending" | "failed";
}

const BusinessPayments = () => {
    const [cards, setCards] = useState<PaymentCard[]>([
        {
            id: "1",
            number: "8600 •••• •••• 1234",
            type: "uzcard",
            expiry: "12/28",
            holder: "BIZNES EGASI",
        },
    ]);

    const [transactions] = useState<Transaction[]>([
        {
            id: "t1",
            amount: 500000,
            date: "2024-01-20T10:30:00",
            type: "topup",
            description: "Hisobni to'ldirish",
            status: "success",
        },
        {
            id: "t2",
            amount: -150000,
            date: "2024-01-18T14:20:00",
            type: "payment",
            description: "Premium obuna (1 oy)",
            status: "success",
        },
        {
            id: "t3",
            amount: -50000,
            date: "2024-01-15T09:15:00",
            type: "payment",
            description: "Reklama xizmati",
            status: "success",
        },
    ]);

    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [newCard, setNewCard] = useState({ number: "", expiry: "", holder: "" });

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCard.number.length < 16) {
            toast.error("Karta raqami noto'g'ri");
            return;
        }

        const cardType = newCard.number.startsWith("8600")
            ? "uzcard"
            : newCard.number.startsWith("9860")
                ? "humo"
                : "visa";

        const card: PaymentCard = {
            id: Math.random().toString(),
            number: `${newCard.number.slice(0, 4)} •••• •••• ${newCard.number.slice(-4)}`,
            type: cardType as any,
            expiry: newCard.expiry,
            holder: newCard.holder.toUpperCase(),
        };

        setCards([...cards, card]);
        setNewCard({ number: "", expiry: "", holder: "" });
        setIsAddCardOpen(false);
        toast.success("Karta muvaffaqiyatli qo'shildi");
    };

    const handleDeleteCard = (id: string) => {
        setCards(cards.filter((c) => c.id !== id));
        toast.success("Karta o'chirildi");
    };

    const formatAmount = (amount: number) => {
        return Math.abs(amount).toLocaleString('ru-RU') + " so'm";
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="cards" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cards" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Mening Kartalarim
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        To'lovlar Tarixi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="cards" className="mt-6 space-y-4">
                    <div className="grid gap-4">
                        {cards.map((card) => (
                            <Card
                                key={card.id}
                                className={`p-6 relative overflow-hidden ${card.type === "uzcard"
                                    ? "bg-gradient-to-br from-blue-600 to-blue-800"
                                    : card.type === "humo"
                                        ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                        : "bg-gradient-to-br from-slate-700 to-slate-900"
                                    } text-white border-0 shadow-lg`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <CreditCard className="w-8 h-8 opacity-80" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white/70 hover:text-white hover:bg-white/20"
                                            onClick={() => handleDeleteCard(card.id)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-2xl font-mono tracking-wider">{card.number}</p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-white/70 uppercase mb-1">Karta egasi</p>
                                                <p className="font-medium tracking-wide">{card.holder}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white/70 uppercase mb-1">Amal qilish</p>
                                                <p className="font-medium tracking-wide">{card.expiry}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-32 border-dashed border-2 flex flex-col gap-2 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <Plus className="w-8 h-8" />
                                    <span>Yangi karta qo'shish</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yangi karta qo'shish</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddCard} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="number">Karta raqami</Label>
                                        <Input
                                            id="number"
                                            placeholder="8600 0000 0000 0000"
                                            maxLength={16}
                                            value={newCard.number}
                                            onChange={(e) =>
                                                setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, "") })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Amal qilish muddati</Label>
                                            <Input
                                                id="expiry"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                value={newCard.expiry}
                                                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="holder">Karta egasi</Label>
                                            <Input
                                                id="holder"
                                                placeholder="ISM FAMILIYA"
                                                value={newCard.holder}
                                                onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="w-full">
                                            Qo'shish
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <Card key={transaction.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-full ${transaction.type === "topup"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-orange-100 text-orange-600"
                                            }`}
                                    >
                                        {transaction.type === "topup" ? (
                                            <ArrowDownLeft className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{transaction.description}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(transaction.date).toLocaleDateString("uz-UZ", {
                                                day: "numeric",
                                                month: "long",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`font-bold ${transaction.type === "topup" ? "text-green-600" : "text-foreground"
                                            }`}
                                    >
                                        {transaction.type === "topup" ? "+" : ""}
                                        {formatAmount(transaction.amount)}
                                    </p>
                                    <Badge
                                        className="text-[10px]"
                                        variant={transaction.status === "success" ? "secondary" : "outline"}
                                    >
                                        {transaction.status === "success"
                                            ? "Muvaffaqiyatli"
                                            : transaction.status === "pending"
                                                ? "Jarayonda"
                                                : "Bekor qilindi"}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BusinessPayments;
