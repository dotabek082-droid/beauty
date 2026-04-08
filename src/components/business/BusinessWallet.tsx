import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Calendar, Award, ChevronRight, ShoppingBag, Gift, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getCoinBalance, getCoinTransactions, getTransactionsSummary, CoinTransaction } from "@/utils/coinBalance";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { CoinPurchaseDialog } from "@/components/CoinPurchaseDialog";
import { GiftCertificatePurchaseDialog } from "@/components/GiftCertificatePurchaseDialog";
import { GiftCertificateRedemptionDialog } from "@/components/GiftCertificateRedemptionDialog";

const BusinessWallet = () => {
    const { user, loading } = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
    const [summary, setSummary] = useState({ today: 0, week: 0, total: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
    const [giftDialogOpen, setGiftDialogOpen] = useState(false);
    const [redemptionDialogOpen, setRedemptionDialogOpen] = useState(false);
    const itemsPerPage = 6;

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [user?.id]);

    const loadData = () => {
        if (!user?.id) return;

        try {
            const bal = getCoinBalance(user.id);
            const allTxns = getCoinTransactions(user.id, 1000); // Get all transactions
            const summ = getTransactionsSummary(user.id);

            setBalance(bal);
            setTransactions(allTxns);
            setSummary(summ);
        } catch (error) {
            console.error("Error loading coin data:", error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Yuklanmoqda...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground">Iltimos, tizimga kiring.</div>;
    }

    // Pagination logic
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = transactions.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'welcome_bonus': return '🎉';
            case 'first_booking': return '💇';
            case 'daily_login': return '📅';
            case 'birthday': return '🎂';
            case 'booking': return '📝';
            case 'service_completion': return '✅';
            case 'review': return '⭐';
            case 'referral': return '👥';
            case 'participation': return '🎫';
            case 'win': return '🏆';
            case 'payment': return '💳';
            case 'spend': return '💸';
            default: return '🪙';
        }
    };

    const getTransactionColor = (amount: number) => {
        return amount > 0 ? 'text-emerald-500' : 'text-rose-500';
    };

    return (
        <div className="space-y-4">
            {/* Coin Balance Card */}
            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <Coins className="w-7 h-7 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Biznes hisob balansi</p>
                            <p className="text-3xl font-bold text-foreground">{balance.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">tanga</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Qiymati</p>
                        <p className="text-lg font-bold text-amber-600">{balance.toLocaleString()} so'm</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Bugun</p>
                        <p className="font-semibold text-emerald-500">+{summary.today}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Bu hafta</p>
                        <p className="font-semibold text-emerald-500">+{summary.week}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Jami</p>
                        <p className="font-semibold text-primary">{summary.total}</p>
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setPurchaseDialogOpen(true)}>
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Tanga olish
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setGiftDialogOpen(true)}>
                    <Gift className="w-4 h-4 mr-2" />
                    Sertifikat
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setRedemptionDialogOpen(true)}>
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Vaucher
                </Button>
            </div>

            {/* Tabs for Earn & Spend */}
            <Tabs defaultValue="earn" className="w-full">
                <Card className="p-4">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="earn" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Topish</span>
                        </TabsTrigger>
                        <TabsTrigger value="spend" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Sarflash</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Tarix</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Earn Tab Content */}
                    <TabsContent value="earn" className="mt-0">
                        <div className="space-y-4">
                            {/* One-time Bonuses */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Bir martalik bonuslar</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                        <span className="text-2xl">🎉</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Ro'yxatdan o'tish</p>
                                                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">+1,000 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Xush kelibsiz! Biznes sifatida ro'yxatdan o'tganingizda</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                        <span className="text-2xl">💇</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Ilk xizmat ko'rsatish</p>
                                                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">+500 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Birinchi mijozga xizmat ko'rsatganingizda bonus</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Rewards */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">📅 Kundalik</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <span className="text-2xl">☀️</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Kunlik kirish</p>
                                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/30 text-xs">+10 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Har kuni ilovaga kirib tanga to'plang</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                        <span className="text-2xl">🎂</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Biznes yilligi</p>
                                                <Badge variant="outline" className="text-xs">+100 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Biznesingiz ochilgan kunda maxsus sovg'a!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Rewards */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">💼 Xizmatlar</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <span className="text-2xl">✅</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Xizmatni yakunlash</p>
                                                <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">+50 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Mijozga xizmat ko'rsatib bo'lgach</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coins Value Info */}
                            <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🎁</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <span>Tangalar bilan nima qilish mumkin?</span>
                                            <span className="text-amber-600">✨</span>
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                            Har bir to'plagan tangangiz - bu sizning biznesingiz rivoji uchun sarmoya!
                                            Tangalarni reklamaga sarflang, mijozlarni jalb qiling yoki premium imkoniyatlarni oling.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                <span><strong className="text-foreground">Reklama uchun to'lov:</strong> 1 tanga = 1 so'm qiymatida</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                <span><strong className="text-foreground">Lotereyalar:</strong> Mijozlar uchun yutuqli o'yinlar</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                <span><strong className="text-foreground">Premium:</strong> TOP o'rinlar va maxsus belgilar</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-amber-500/20">
                                            <p className="text-xs text-center text-muted-foreground italic">
                                                💫 Har kuni tanga to'plang va biznesingizni rivojlantiring!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Spend Tab Content */}
                    <TabsContent value="spend" className="mt-0">
                        <div className="space-y-4">
                            {/* Service Payments */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">📢 Reklama va TOP</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                        <span className="text-2xl">🚀</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">TOP ga chiqish</p>
                                                <Badge variant="outline" className="text-xs">1 kun = 2,000</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Saloningizni qidiruv natijalarida yuqoriga ko'taring</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                        <span className="text-2xl">🎯</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Mijozlarga tavsiya</p>
                                                <Badge variant="outline" className="text-xs">5,000 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Yaqin atrofdagi mijozlarga saloningizni tavsiya qilish (7 kun)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promotions & Special Offers */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Aksiyalar va Lotereya</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                        <span className="text-2xl">🏆</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-foreground">Lotereya tashkil etish</p>
                                                <Badge variant="outline" className="text-xs">1,000 tanga</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Mijozlar uchun yutuqli o'yin o'tkazish</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* History Tab Content */}
                    <TabsContent value="history" className="mt-0">
                        {/* Transaction History */}
                        <div className="space-y-4">
                            <Card className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <h3 className="font-semibold text-foreground">Tarix</h3>
                                    </div>
                                    {transactions.length > itemsPerPage && (
                                        <span className="text-xs text-muted-foreground">
                                            {currentPage} / {totalPages}
                                        </span>
                                    )}
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        Hali tranzaksiyalar yo'q
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            {currentTransactions.map((txn, index) => (
                                                <motion.div
                                                    key={txn.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <span className="text-2xl">{getTransactionIcon(txn.type)}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate">
                                                                {txn.description}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(new Date(txn.created_at), "d MMM, HH:mm", { locale: uz })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold ${getTransactionColor(txn.amount)}`}>
                                                            {txn.amount > 0 ? '+' : ''}{txn.amount}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">tanga</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {transactions.length > itemsPerPage && (
                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={goToPreviousPage}
                                                    disabled={currentPage === 1}
                                                    className="text-xs"
                                                >
                                                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                                                    Oldingi
                                                </Button>
                                                <div className="text-xs text-muted-foreground">
                                                    <span className="font-semibold text-foreground">{currentPage}</span> / {totalPages} sahifa
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={goToNextPage}
                                                    disabled={currentPage === totalPages}
                                                    className="text-xs"
                                                >
                                                    Keyingi
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Card>
                        </div>
                    </TabsContent>
                </Card>
            </Tabs>

            {/* Info Note */}
            <Card className="p-3 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">1 tanga = 1 so'm.</strong> Tangalarni xizmat to'lashda ishlatish mumkin.
                    </p>
                </div>
            </Card>

            {/* Gift Certificate Dialogs */}
            <CoinPurchaseDialog
                open={purchaseDialogOpen}
                onOpenChange={setPurchaseDialogOpen}
            />
            <GiftCertificatePurchaseDialog
                open={giftDialogOpen}
                onOpenChange={setGiftDialogOpen}
            />
            <GiftCertificateRedemptionDialog
                open={redemptionDialogOpen}
                onOpenChange={setRedemptionDialogOpen}
            />
        </div>
    );
};

export default BusinessWallet;
