import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Search, Download, Coins, ArrowUpRight, ArrowDownLeft, User, Briefcase, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllTransactions, EnrichedCoinTransaction, seedBusinessTransactions } from "@/utils/coinBalance";
import { mockBusinesses } from "@/data/businessData";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

const ITEMS_PER_PAGE = 10;

const AdminCoinHistory = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<EnrichedCoinTransaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<EnrichedCoinTransaction[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Helper to determine user type
    const getUserType = (userId: string): 'client' | 'business' => {
        // Check if userId matches any business ownerId
        const isOwner = mockBusinesses.some(b => b.ownerId === userId);
        return isOwner ? 'business' : 'client';
    };

    useEffect(() => {
        // Seed first if empty
        seedBusinessTransactions();

        const all = getAllTransactions();
        setTransactions(all);
        setFilteredTransactions(all);
    }, []);

    useEffect(() => {
        let result = transactions;

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.description.toLowerCase().includes(query) ||
                t.userId.toLowerCase().includes(query)
            );
        }

        // Filter by Type (Earned vs Spent)
        if (typeFilter !== "all") {
            if (typeFilter === "earned") {
                result = result.filter(t => t.amount > 0);
            } else if (typeFilter === "spent") {
                result = result.filter(t => t.amount < 0);
            }
        }

        // Filter by Role (Client vs Business)
        if (roleFilter !== "all") {
            result = result.filter(t => getUserType(t.userId) === roleFilter);
        }

        setFilteredTransactions(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [searchQuery, typeFilter, roleFilter, transactions]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalCoins = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalEarned = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Tangalar Tarixi</h1>
                        <p className="text-sm text-muted-foreground">
                            Barcha foydalanuvchilarning tanga aylanmasi
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 max-w-6xl mx-auto space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-blue-50 border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Coins className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Jami Tizimda</p>
                                <h3 className="text-2xl font-bold text-blue-900">{totalCoins.toLocaleString()}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4 bg-green-50 border-green-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <ArrowDownLeft className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-green-600 font-medium">Jami Berilgan</p>
                                <h3 className="text-2xl font-bold text-green-900">+{totalEarned.toLocaleString()}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4 bg-red-50 border-red-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-red-600 font-medium">Jami Ishlatilgan</p>
                                <h3 className="text-2xl font-bold text-red-900">-{totalSpent.toLocaleString()}</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Qidirish (ID yoki tavsif bo'yicha)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Rol bo'yicha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha Rollar</SelectItem>
                                <SelectItem value="client">Mijozlar</SelectItem>
                                <SelectItem value="business">Biznes Egalari</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Turi bo'yicha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha Turlar</SelectItem>
                                <SelectItem value="earned">Kirim (Berilgan)</SelectItem>
                                <SelectItem value="spent">Chiqim (Ishlatilgan)</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">Sana</TableHead>
                                    <TableHead>Foydalanuvchi</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Turi</TableHead>
                                    <TableHead>Tavsif</TableHead>
                                    <TableHead className="text-right">Miqdor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTransactions.length > 0 ? (
                                    paginatedTransactions.map((t) => {
                                        const userType = getUserType(t.userId);
                                        return (
                                            <TableRow
                                                key={t.id}
                                                className="hover:bg-muted/5 transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/admin/coins/${t.id}`)}
                                            >
                                                <TableCell className="whitespace-nowrap font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                                    {format(new Date(t.created_at), "d MMM yyyy, HH:mm", { locale: uz })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userType === 'business' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {userType === 'business' ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                        </div>
                                                        <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                            {t.userId.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${userType === 'business'
                                                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                                                        : "bg-blue-100 text-blue-700 border border-blue-200"
                                                        }`}>
                                                        {userType === 'business' ? "Biznes Egasi" : "Mijoz"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.amount > 0
                                                        ? "bg-green-50 text-green-700 border border-green-200"
                                                        : "bg-red-50 text-red-700 border border-red-200"
                                                        }`}>
                                                        {t.amount > 0 ? "Kirim" : "Chiqim"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="max-w-md truncate text-muted-foreground">
                                                    {t.description}
                                                </TableCell>
                                                <TableCell className={`text-right font-bold font-mono text-base ${t.amount > 0 ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {t.amount > 0 ? "+" : ""}{t.amount}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                                                <Search className="w-6 h-6 text-muted-foreground/50" />
                                            </div>
                                            <p>Ma'lumot topilmadi</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="bg-white border-t px-4 py-3 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Jami: <strong>{filteredTransactions.length}</strong> ta tranzaksiya
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Oldingi
                                </Button>
                                <div className="text-sm font-medium">
                                    Sahifa {currentPage} / {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Keyingi
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCoinHistory;
