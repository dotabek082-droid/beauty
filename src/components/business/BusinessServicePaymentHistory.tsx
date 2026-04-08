import { useState } from "react";
import {
    Calendar,
    ArrowUpRight,
    Filter,
    CreditCard,
    Wallet,
    Ticket,
    Search,
    Download,
    Plus,
    X,
    Pencil,
    Trash2,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, isSameDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from "date-fns";
import { uz } from "date-fns/locale";
import { toast } from "sonner";

export interface PaymentTransaction {
    id: string;
    clientName: string;
    serviceName: string;
    amount: number;
    date: string;
    paymentMethod: 'cash' | 'card' | 'promo';
    status: 'paid' | 'pending' | 'failed' | 'draft';
    transactionId?: string;
}

interface BusinessServicePaymentHistoryProps {
    transactions: PaymentTransaction[];
    onEdit?: (transaction: PaymentTransaction) => void;
    onDelete?: (id: string) => void;
}

const BusinessServicePaymentHistory = ({ transactions, onEdit, onDelete }: BusinessServicePaymentHistoryProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [dateRange, setDateRange] = useState<string>("this_month");

    const filteredTransactions = transactions.filter(tr => {
        const matchesSearch =
            tr.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tr.transactionId && tr.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === "all" || tr.paymentMethod === filterType;

        let matchesDate = true;
        const date = parseISO(tr.date);
        const now = new Date();

        switch (dateRange) {
            case 'today':
                matchesDate = isSameDay(date, now);
                break;
            case 'yesterday':
                matchesDate = isSameDay(date, subDays(now, 1));
                break;
            case 'this_week':
                matchesDate = isWithinInterval(date, {
                    start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
                    end: endOfWeek(now, { weekStartsOn: 1 })
                });
                break;
            case 'this_month':
                matchesDate = isWithinInterval(date, {
                    start: startOfMonth(now),
                    end: endOfMonth(now)
                });
                break;
            case 'last_month':
                const lastMonth = subMonths(now, 1);
                matchesDate = isWithinInterval(date, {
                    start: startOfMonth(lastMonth),
                    end: endOfMonth(lastMonth)
                });
                break;
            default:
                matchesDate = true;
        }

        return matchesSearch && matchesType && matchesDate;
    });

    const totalStats = filteredTransactions.reduce((acc, curr) => {
        // Only count paid transactions for revenue stats
        if (curr.status !== 'paid') return acc;

        acc.total += curr.amount;
        if (curr.paymentMethod === 'cash') acc.cash += curr.amount;
        if (curr.paymentMethod === 'card') acc.card += curr.amount;
        if (curr.paymentMethod === 'promo') acc.promo += curr.amount;
        return acc;
    }, { total: 0, cash: 0, card: 0, promo: 0 });

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('ru-RU').replace(/,/g, ' ');
    };

    const getPaymentIcon = (type: string) => {
        switch (type) {
            case 'card': return <CreditCard className="w-4 h-4 text-blue-500" />;
            case 'cash': return <Wallet className="w-4 h-4 text-green-500" />;
            case 'promo': return <Ticket className="w-4 h-4 text-purple-500" />;
            default: return <CreditCard className="w-4 h-4" />;
        }
    };

    const getPaymentLabel = (type: string) => {
        switch (type) {
            case 'card': return "Karta";
            case 'cash': return "Naqd";
            case 'promo': return "Promo";
            default: return type;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        To'landi
                    </Badge>
                );
            case 'draft':
                return (
                    <Badge variant="outline" className="text-muted-foreground gap-1">
                        <Pencil className="w-3 h-3" />
                        Qoralama
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-900/10 gap-1">
                        <Clock className="w-3 h-3" />
                        Kutilmoqda
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 dark:bg-red-900/10 gap-1">
                        <X className="w-3 h-3" />
                        Rad etildi
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <Card className="p-2 md:p-3 bg-white dark:bg-card border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 bg-blue-500/10 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3">
                        <div className="hidden md:flex w-6 h-6 md:w-9 md:h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center text-blue-600 dark:text-blue-400">
                            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                        <div className="w-full text-center md:text-left">
                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider opacity-80">Jami</p>
                            <p className="text-xs md:text-base font-bold text-foreground leading-tight whitespace-nowrap">{formatAmount(totalStats.total)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-2 md:p-3 bg-white dark:bg-card border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 bg-green-500/10 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3">
                        <div className="hidden md:flex w-6 h-6 md:w-9 md:h-9 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center text-green-600 dark:text-green-400">
                            <Wallet className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                        <div className="w-full text-center md:text-left">
                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider opacity-80">Naqd</p>
                            <p className="text-xs md:text-base font-bold text-foreground leading-tight whitespace-nowrap">{formatAmount(totalStats.cash)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-2 md:p-3 bg-white dark:bg-card border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 bg-indigo-500/10 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3">
                        <div className="hidden md:flex w-6 h-6 md:w-9 md:h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                        <div className="w-full text-center md:text-left">
                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider opacity-80">Karta</p>
                            <p className="text-xs md:text-base font-bold text-foreground leading-tight whitespace-nowrap">{formatAmount(totalStats.card)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-2 md:p-3 bg-white dark:bg-card border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 bg-purple-500/10 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3">
                        <div className="hidden md:flex w-6 h-6 md:w-9 md:h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center text-purple-600 dark:text-purple-400">
                            <Ticket className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                        <div className="w-full text-center md:text-left">
                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider opacity-80">Promo</p>
                            <p className="text-xs md:text-base font-bold text-foreground leading-tight whitespace-nowrap">{formatAmount(totalStats.promo)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card className="border-none shadow-md bg-white dark:bg-card overflow-hidden">
                <div className="p-4 border-b space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 flex-1">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Qidirish..."
                                    className="pl-9 h-10 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-full sm:w-[160px] h-10">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Davr" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Bugun</SelectItem>
                                    <SelectItem value="yesterday">Kecha</SelectItem>
                                    <SelectItem value="this_week">Bu hafta</SelectItem>
                                    <SelectItem value="this_month">Bu oy</SelectItem>
                                    <SelectItem value="last_month">O'tgan oy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" size="icon" className="hidden sm:flex">
                                <Filter className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="hidden sm:flex">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
                        <TabsList className="w-full grid grid-cols-4 bg-muted/50 p-1">
                            <TabsTrigger value="all" className="text-xs sm:text-sm">Barchasi</TabsTrigger>
                            <TabsTrigger value="cash" className="gap-2 text-xs sm:text-sm">
                                <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Naqd</span>
                                <span className="sm:hidden">Naqd</span>
                            </TabsTrigger>
                            <TabsTrigger value="card" className="gap-2 text-xs sm:text-sm">
                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Karta</span>
                                <span className="sm:hidden">Karta</span>
                            </TabsTrigger>
                            <TabsTrigger value="promo" className="gap-2 text-xs sm:text-sm">
                                <Ticket className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Promo</span>
                                <span className="sm:hidden">Promo</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Transactions List */}
                <div className="divide-y text-sm">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Afsuski, hech narsa topilmadi</p>
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 hover:bg-muted/30 transition-colors group">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${transaction.paymentMethod === 'cash' ? 'bg-green-100 dark:bg-green-900/30' :
                                            transaction.paymentMethod === 'card' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                                            }`}>
                                            {getPaymentIcon(transaction.paymentMethod)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-semibold truncate text-foreground">{transaction.clientName}</h4>
                                                {transaction.transactionId && (
                                                    <Badge variant="outline" className="text-[10px] h-5 font-normal flex-shrink-0 bg-background/50">
                                                        {transaction.transactionId}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{transaction.serviceName}</p>
                                            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground flex-wrap">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{format(new Date(transaction.date), "d MMM, HH:mm", { locale: uz })}</span>
                                                </div>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="capitalize">{getPaymentLabel(transaction.paymentMethod)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                                        <p className="font-bold whitespace-nowrap text-foreground">{formatAmount(transaction.amount)}</p>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(transaction.status)}
                                            {transaction.status === 'draft' && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onEdit && (
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(transaction)}>
                                                            <Pencil className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                    {onDelete && (
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(transaction.id)}>
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};

export default BusinessServicePaymentHistory;
