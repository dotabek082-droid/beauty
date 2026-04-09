import { useState } from "react";
import { CreditCard, Plus, Calendar, Search, ArrowDownLeft, Banknote, Gift, ChevronDown, Filter, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
    id: string;
    clientName: string;
    serviceName: string;
    amount: number;
    date: string;
    method: "naqd" | "karta" | "promo";
    status: "success" | "pending";
}

const BusinessPayments = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "naqd" | "karta" | "promo">("all");

    // Realistic Mock Data for Client Income
    const [transactions] = useState<Transaction[]>([
        {
            id: "t1",
            clientName: "Sevara Aliyeva",
            serviceName: "Kechki makiyaj",
            amount: 250000,
            date: new Date(Date.now() - 3600000 * 2).toISOString(),
            method: "karta",
            status: "success",
        },
        {
            id: "t2",
            clientName: "Lola Karimova",
            serviceName: "Soch turmaklash",
            amount: 150000,
            date: new Date(Date.now() - 3600000 * 5).toISOString(),
            method: "naqd",
            status: "success",
        },
        {
            id: "t3",
            clientName: "Madina",
            serviceName: "Manikur (Aksiya)",
            amount: 0,
            date: new Date(Date.now() - 86400000).toISOString(),
            method: "promo",
            status: "success",
        },
        {
            id: "t4",
            clientName: "Aziza Rahimova",
            serviceName: "Yuz tozalash",
            amount: 300000,
            date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
            method: "karta",
            status: "success",
        },
        {
            id: "t5",
            clientName: "Malika K.",
            serviceName: "Soch bo'yash",
            amount: 450000,
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            method: "naqd",
            status: "pending",
        },
    ]);

    // Calculate Stats
    const totalIncome = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const cashIncome = transactions.filter(t => t.method === "naqd").reduce((acc, curr) => acc + curr.amount, 0);
    const cardIncome = transactions.filter(t => t.method === "karta").reduce((acc, curr) => acc + curr.amount, 0);
    const promoCount = transactions.filter(t => t.method === "promo").length;

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "all" || t.method === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('ru-RU') + " so'm";
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case "naqd": return <Banknote className="w-3 h-3 text-emerald-500" />;
            case "karta": return <CreditCard className="w-3 h-3 text-blue-500" />;
            case "promo": return <Gift className="w-3 h-3 text-purple-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 border-none shadow-sm bg-indigo-600 text-white col-span-2">
                    <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Jami Tushum</p>
                    <h2 className="text-2xl font-black tracking-tight">{formatAmount(totalIncome)}</h2>
                </Card>
                <Card className="p-3 border-none shadow-sm bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Banknote className="w-3 h-3 text-emerald-500" />
                        <p className="text-[10px] font-bold uppercase text-gray-500">Naqd</p>
                    </div>
                    <h3 className="text-sm font-black">{formatAmount(cashIncome)}</h3>
                </Card>
                <Card className="p-3 border-none shadow-sm bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-1.5 mb-1">
                        <CreditCard className="w-3 h-3 text-blue-500" />
                        <p className="text-[10px] font-bold uppercase text-gray-500">Karta</p>
                    </div>
                    <h3 className="text-sm font-black">{formatAmount(cardIncome)}</h3>
                </Card>
                <Card className="p-3 border-none shadow-sm bg-white dark:bg-gray-900 col-span-2">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Gift className="w-3 h-3 text-purple-500" />
                        <p className="text-[10px] font-bold uppercase text-gray-500">Promo / Bonus</p>
                    </div>
                    <h3 className="text-sm font-black">{promoCount} ta xizmat</h3>
                </Card>
            </div>

            {/* Actions Row */}
            <div className="space-y-3">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4 mr-2" />
                    To'lov qo'shish
                </Button>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                            placeholder="Qidirish..." 
                            className="pl-9 h-11 bg-white border-none shadow-sm rounded-xl text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-11 px-3 bg-white border-none shadow-sm rounded-xl">
                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                <span className="text-sm font-medium">Bu oy</span>
                                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Bugun</DropdownMenuItem>
                            <DropdownMenuItem>Shu hafta</DropdownMenuItem>
                            <DropdownMenuItem>Bu oy</DropdownMenuItem>
                            <DropdownMenuItem>Barchasi</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                    { id: "all", label: "Barchasi" },
                    { id: "naqd", label: "Naqd" },
                    { id: "karta", label: "Karta" },
                    { id: "promo", label: "Promo" }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveFilter(item.id as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                            activeFilter === item.id 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                            : "bg-white text-gray-500 hover:bg-gray-50 shadow-sm"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 px-1">Tushumlar Tarixi</h3>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                        <Card key={t.id} className="p-3 border-none shadow-sm bg-white dark:bg-gray-900 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-indigo-600">
                                        <User className="w-5 h-5 opacity-40" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{t.clientName}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">{t.serviceName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{t.amount === 0 ? "Bonus" : formatAmount(t.amount)}</p>
                                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                        <div className="flex items-center gap-1">
                                            {getMethodIcon(t.method)}
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">{t.method}</span>
                                        </div>
                                        <div className={`w-1 h-1 rounded-full ${t.status === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="py-12 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
                        <ArrowDownLeft className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-gray-400 font-medium">Afsuski, hech narsa topilmadi</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessPayments;
