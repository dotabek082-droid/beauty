import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessServicePaymentHistory, { PaymentTransaction } from "@/components/business/BusinessServicePaymentHistory";
import BottomNav from "@/components/BottomNav";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fakeBusinessClients } from "@/data/fakeBusinessClients";
import { MOCK_SERVICES } from "@/data/mockServices";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialTransactions: PaymentTransaction[] = [
    {
        id: "tr-1",
        clientName: "Malika Karimova",
        serviceName: "Soch bo'yash (Ombre)",
        amount: 450000,
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        paymentMethod: 'card',
        status: 'paid',
        transactionId: "TRX-882910"
    },
    {
        id: "tr-2",
        clientName: "Aziza Rahimova",
        serviceName: "Manikyur + Gel-lak",
        amount: 150000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        paymentMethod: 'cash',
        status: 'paid',
        transactionId: "CASH-112"
    },
    {
        id: "tr-3",
        clientName: "Laylo Aliyeva",
        serviceName: "Yuz tozalash",
        amount: 300000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        paymentMethod: 'promo',
        status: 'paid',
        transactionId: "PROMO-772"
    },
    {
        id: "tr-4",
        clientName: "Nigora Tursunova",
        serviceName: "Kechki makiyaj",
        amount: 250000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        paymentMethod: 'card',
        status: 'paid',
        transactionId: "TRX-882855"
    },
    {
        id: "tr-5",
        clientName: "Dilnoza Saidova",
        serviceName: "Soch turmaklash",
        amount: 120000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        paymentMethod: 'cash',
        status: 'paid',
        transactionId: "CASH-109"
    },
    {
        id: "tr-6",
        clientName: "Shahnoza Qodirova",
        serviceName: "Pedikyur",
        amount: 180000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        paymentMethod: 'card',
        status: 'paid',
        transactionId: "TRX-882100"
    },
    {
        id: "tr-7",
        clientName: "Gulnoza Ahmedova",
        serviceName: "Qosh terish",
        amount: 50000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
        paymentMethod: 'cash',
        status: 'paid',
        transactionId: "CASH-105"
    },
    {
        id: "tr-8",
        clientName: "Zarina Usmonova",
        serviceName: "Kiprik ekish",
        amount: 200000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
        paymentMethod: 'promo',
        status: 'paid',
        transactionId: "PROMO-765"
    }
];

const BusinessServicePaymentsPage = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

    // Form states
    const [openClientCombo, setOpenClientCombo] = useState(false);
    const [selectedClient, setSelectedClient] = useState(""); // ID or name
    const [customClientName, setCustomClientName] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"paid" | "draft">("paid");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();

        const clientName = customClientName || (fakeBusinessClients.find(c => c.id === selectedClient)?.fullName) || selectedClient;

        if (!clientName || !selectedService || !amount) {
            toast.error("Barcha maydonlarni to'ldiring");
            return;
        }

        const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Noto'g'ri summa kiritildi");
            return;
        }

        const isPaid = status === 'paid';
        const transactionId = isPaid ? `CASH-${Math.floor(Math.random() * 1000)}` : undefined;

        if (editingId) {
            // Edit existing
            setTransactions(transactions.map(t => t.id === editingId ? {
                ...t,
                clientName,
                serviceName: MOCK_SERVICES.find(s => s.id === selectedService)?.name || selectedService,
                amount: parsedAmount,
                status,
                transactionId: isPaid ? (t.transactionId || transactionId) : undefined
            } : t));
            toast.success("To'lov o'zgartirildi");
        } else {
            // Create new
            const newTransaction: PaymentTransaction = {
                id: `manual-${Date.now()}`,
                clientName,
                serviceName: MOCK_SERVICES.find(s => s.id === selectedService)?.name || selectedService,
                amount: parsedAmount,
                date: new Date().toISOString(),
                paymentMethod: 'cash',
                status,
                transactionId
            };
            setTransactions([newTransaction, ...transactions]);
            toast.success(isPaid ? "To'lov qabul qilindi" : "Qoralama saqlandi");
        }

        resetForm();
    };

    const resetForm = () => {
        setCustomClientName("");
        setSelectedClient("");
        setSelectedService("");
        setAmount("");
        setStatus("paid");
        setEditingId(null);
        setIsAddPaymentOpen(false);
    };

    const handleEdit = (transaction: PaymentTransaction) => {
        setEditingId(transaction.id);

        // Find if client exists in mock data
        const knownClient = fakeBusinessClients.find(c => c.fullName === transaction.clientName);
        if (knownClient) {
            setSelectedClient(knownClient.id);
            setCustomClientName("");
        } else {
            setSelectedClient(transaction.clientName);
            setCustomClientName(transaction.clientName);
        }

        // Find service
        const knownService = MOCK_SERVICES.find(s => s.name === transaction.serviceName);
        if (knownService) {
            setSelectedService(knownService.id);
        } else {
            setSelectedService(transaction.serviceName); // Fallback if regular select doesn't match
        }

        setAmount(transaction.amount.toString());
        setStatus(transaction.status === 'paid' ? 'paid' : 'draft');
        setIsAddPaymentOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Haqiqatan ham bu to'lovni o'chirmoqchimisiz?")) {
            setTransactions(transactions.filter(t => t.id !== id));
            toast.success("To'lov o'chirildi");
        }
    };

    // Auto-fill amount when service selected
    const handleServiceSelect = (serviceId: string) => {
        setSelectedService(serviceId);
        const service = MOCK_SERVICES.find(s => s.id === serviceId);
        if (service) {
            setAmount(service.price.toString());
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="flex items-center justify-between p-4 safe-top">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Tushumlar Tarixi
                            </h1>
                        </div>
                    </div>
                    <Dialog open={isAddPaymentOpen} onOpenChange={(open) => {
                        if (!open) resetForm();
                        setIsAddPaymentOpen(open);
                    }}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="hidden sm:flex">
                                <Plus className="w-4 h-4 mr-2" />
                                To'lov qo'shish
                            </Button>
                        </DialogTrigger>
                        {/* Mobile Icon Button */}
                        <DialogTrigger asChild>
                            <Button size="icon" className="sm:hidden">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingId ? "To'lovni tahrirlash" : "Yangi to'lov qo'shish"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddPayment} className="space-y-4 mt-4">
                                {/* Client Selection */}
                                <div className="space-y-2">
                                    <Label>Mijoz</Label>
                                    <Popover open={openClientCombo} onOpenChange={setOpenClientCombo}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openClientCombo}
                                                className="w-full justify-between font-normal"
                                            >
                                                {selectedClient
                                                    ? (fakeBusinessClients.find((c) => c.id === selectedClient)?.fullName || selectedClient)
                                                    : (customClientName || "Mijozni tanlang...")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Mijoz qidirish..." onValueChange={(val) => {
                                                    setCustomClientName(val);
                                                    if (selectedClient) setSelectedClient(""); // Clear selection when typing
                                                }} />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        <div className="p-2 text-sm text-center">
                                                            {customClientName ? (
                                                                <button
                                                                    className="text-primary hover:underline w-full text-left"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setSelectedClient(customClientName);
                                                                        setOpenClientCombo(false);
                                                                    }}
                                                                >
                                                                    "{customClientName}" qo'shish
                                                                </button>
                                                            ) : (
                                                                "Mijoz topilmadi"
                                                            )}
                                                        </div>
                                                    </CommandEmpty>
                                                    <CommandGroup heading="Mijozlar">
                                                        {fakeBusinessClients.map((client) => (
                                                            <CommandItem
                                                                key={client.id}
                                                                value={client.fullName}
                                                                onSelect={() => {
                                                                    setSelectedClient(client.id);
                                                                    setCustomClientName("");
                                                                    setOpenClientCombo(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedClient === client.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {client.fullName}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Service Selection */}
                                <div className="space-y-2">
                                    <Label>Xizmat</Label>
                                    <Select value={selectedService} onValueChange={handleServiceSelect} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Xizmatni tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_SERVICES.map((service) => (
                                                <SelectItem key={service.id} value={service.id}>
                                                    {service.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Summa (so'm)</Label>
                                    <Input
                                        id="amount"
                                        placeholder="0"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Status Selection */}
                                <div className="space-y-3 pt-2">
                                    <Label>Status</Label>
                                    <RadioGroup value={status} onValueChange={(val) => setStatus(val as "paid" | "draft")} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="paid" id="paid" />
                                            <Label htmlFor="paid" className="cursor-pointer">Tasdiqlangan</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="draft" id="draft" />
                                            <Label htmlFor="draft" className="cursor-pointer">Qoralama</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <DialogFooter className="mt-6">
                                    <Button type="button" variant="outline" onClick={resetForm}>Bekor qilish</Button>
                                    <Button type="submit">Saqlash</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <BusinessServicePaymentHistory
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <BottomNav />
        </div>
    );
};

export default BusinessServicePaymentsPage;
