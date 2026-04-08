import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllTransactions, EnrichedCoinTransaction, getCoinBalance } from "@/utils/coinBalance";
import { mockBusinesses } from "@/data/businessData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, User, Briefcase, Calendar, FileText, CreditCard, Coins } from "lucide-react";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

const AdminTransactionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<EnrichedCoinTransaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const all = getAllTransactions();
            const found = all.find(t => t.id === id);
            setTransaction(found || null);
            setLoading(false);
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

    if (!transaction) return (
        <div className="p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">Tranzaksiya topilmadi</h2>
            <Button onClick={() => navigate(-1)}>Ortga qaytish</Button>
        </div>
    );

    const isBusiness = mockBusinesses.some(b => b.ownerId === transaction.userId);
    const userType = isBusiness ? "Tadbirkor" : "Mijoz";
    const balance = getCoinBalance(transaction.userId);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Tranzaksiya Tafsilotlari</h1>
                        <p className="text-sm text-muted-foreground">ID: {id}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 max-w-2xl mx-auto space-y-6">
                {/* Main Status Card */}
                <Card className={`border-t-4 ${transaction.amount > 0 ? "border-t-green-500" : "border-t-red-500"}`}>
                    <CardContent className="pt-6 text-center space-y-2">
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${transaction.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}>
                            <Coins className="w-8 h-8" />
                        </div>
                        <h2 className={`text-3xl font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}{transaction.amount} Tanga
                        </h2>
                        <p className="text-muted-foreground font-medium">{transaction.description}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm mt-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(transaction.created_at), "d MMMM yyyy, HH:mm", { locale: uz })}
                        </div>
                    </CardContent>
                </Card>

                {/* User Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Foydalanuvchi Ma'lumotlari
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isBusiness ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {isBusiness ? <Briefcase className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="font-medium text-lg">{userType}</p>
                                <p className="text-sm text-muted-foreground font-mono">ID: {transaction.userId}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-muted/30 rounded-lg">
                            <div>
                                <p className="text-muted-foreground">Joriy Balans</p>
                                <p className="font-bold text-lg">{balance} coins</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Kategoriyasi</p>
                                <p className="font-medium capitalize">{isBusiness ? "Business Owner" : "Regular Client"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Qo'shimcha Ma'lumot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Tranzaksiya Turi</span>
                            <span className="font-mono">{transaction.type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Tizim ID</span>
                            <span className="font-mono text-xs">{transaction.id}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Status</span>
                            <span className="text-green-600 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Muvaffaqiyatli
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminTransactionDetail;
