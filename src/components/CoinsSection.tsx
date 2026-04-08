import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Calendar, Award, ChevronRight, ShoppingBag, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ReferralHistoryList } from "./ReferralHistoryList";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getCoinBalance, getCoinTransactions, getTransactionsSummary, CoinTransaction } from "@/utils/coinBalance";
import { GiftCertificatePurchaseDialog } from "./GiftCertificatePurchaseDialog";
import { CoinPurchaseDialog } from "./CoinPurchaseDialog";
import { GiftCertificateRedemptionDialog } from "./GiftCertificateRedemptionDialog";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

const CoinsSection = () => {
    const { user, loading, isRole } = useAuth();
    const isBusiness = isRole("business_owner");
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
        return amount > 0 ? 'text-success' : 'text-destructive';
    };

    if (!user) return null;

    return (
        <div className="space-y-3">
            {/* Coin Balance Card */}
            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <Coins className="w-7 h-7 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tangalar balansi</p>
                            <p className="text-3xl font-bold text-foreground">{balance.toLocaleString()}</p>
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
                        <p className="font-semibold text-success">+{summary.today}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Bu hafta</p>
                        <p className="font-semibold text-success">+{summary.week}</p>
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
                            {/* REFERRAL CARD SECTION */}
                            {!isBusiness && (
                                <Card className="p-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-2xl">🤝</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-foreground text-lg mb-1 truncate">Do'stingizni taklif qiling</h3>
                                            <p className="text-sm text-muted-foreground mb-3 break-words">
                                                Har bir taklif qilingan do'stingiz uchun <span className="font-bold text-primary">500 tanga</span> oling!
                                                Do'stingiz ham ro'yxatdan o'tganda <span className="font-bold text-primary">200 tanga</span> bonus oladi.
                                            </p>

                                            <div className="bg-background/80 p-3 rounded-lg border border-border/60 flex items-center justify-between gap-2 mb-3">
                                                <code className="text-xs font-mono text-muted-foreground truncate flex-1">
                                                    {window.location.origin}/auth?ref={user.id}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    onClick={() => {
                                                        const link = `${window.location.origin}/auth?ref=${user.id}`;
                                                        navigator.clipboard.writeText(link);
                                                        // Assuming toast is available via context or we can add local state for "Copied!" feedback
                                                        // For now, simple alert or relying on user perception. 
                                                        // Ideally use toast()
                                                    }}
                                                >
                                                    Nusxalash
                                                </Button>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                                                    onClick={() => {
                                                        const text = `Yaqin ilovasida ro'yxatdan o'ting va 200 tanga bonus oling! Havola: ${window.location.origin}/auth?ref=${user.id}`;
                                                        window.open(`https://t.me/share/url?url=${window.location.origin}/auth?ref=${user.id}&text=${encodeURIComponent(text)}`, '_blank');
                                                    }}
                                                >
                                                    Telegram
                                                </Button>
                                                <Button size="sm" variant="outline" className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                                    onClick={() => {
                                                        if (navigator.share) {
                                                            navigator.share({
                                                                title: 'Yaqin - Barcha xizmatlar',
                                                                text: `Yaqin ilovasida ro'yxatdan o'ting va 200 tanga bonus oling!`,
                                                                url: `${window.location.origin}/auth?ref=${user.id}`,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Ulashish
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* REFERRAL HISTORY (Client) */}
                            {!isBusiness && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm">Takliflar tarixi</h3>
                                    <ReferralHistoryList userId={user.id} />
                                </div>
                            )}

                            {isBusiness ? (
                                <>
                                    {/* Business Earning Options */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Bir martalik bonuslar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <span className="text-2xl">✅</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Biznes verifikatsiyasi</p>
                                                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">+5,000 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Biznesingizni tasdiqlatganingizda</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <span className="text-2xl">🎉</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Ilk aksiya yaratish</p>
                                                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">+1,000 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Birinchi aksiyangizni e'lon qilganingizda</p>
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
                                                    <p className="text-xs text-muted-foreground">Har kuni tizimga kirib tanga to'plang</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Transaction Rewards */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">💼 Biznes faoliyati</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <span className="text-2xl">✅</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Buyurtmani yakunlash</p>
                                                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">+20 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Har bir muvaffaqiyatli xizmat uchun</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">⭐</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Ijobiy sharhlarga javob</p>
                                                        <Badge variant="outline" className="text-xs">+5 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Mijozlar sharhlariga javob berganingizda</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">📸</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Ish namunalari qo'shish</p>
                                                        <Badge variant="outline" className="text-xs">+15 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Sifatli rasmlar yuklash</p>
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
                                                    Tangalar biznesingizni rivojlantirish va mijozlarni jalb qilish uchun ishlatiladi!
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                        <span><strong className="text-foreground">Aksiyalar:</strong> Lotereya va chegirmalarni e'lon qilish</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                        <span><strong className="text-foreground">Reklama:</strong> Qidiruv natijalarida yuqori o'rinlar</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                        <span><strong className="text-foreground">Premium:</strong> VIP va maxsus xususiyatlar</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-amber-500/20">
                                                    <p className="text-xs text-center text-muted-foreground italic">
                                                        💫 Tangalarni biznesni kengaytirish uchun sarmoya qiling!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Client Earning Options (Original) */}
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
                                                    <p className="text-xs text-muted-foreground">Xush kelibsiz! Birinchi marta ro'yxatdan o'tganingizda</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <span className="text-2xl">💇</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Ilk xizmat bandi</p>
                                                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">+500 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Birinchi xizmatingizni band qilganingizda bonus</p>
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
                                                    <p className="text-xs text-muted-foreground">Har kuni ilovaga kirib tanga to'plang. Yilda 3,650!</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🎂</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Tug'ilgan kun oyi</p>
                                                        <Badge variant="outline" className="text-xs">+100 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Tug'ilgan kuningizda maxsus sovg'a!</p>
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
                                                        <p className="font-medium text-foreground">Xizmatni tugatish</p>
                                                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">+50 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Xizmatdan foydalanganingizdan keyin</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>



                                    {/* Promotion Rewards */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Aksiyalar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🏆</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Aksiyada g'olib</p>
                                                        <Badge variant="outline" className="text-xs">+150 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Lotereya va tanlovlarda g'olib bo'lganingizda</p>
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
                                                    Har bir to'plagan tangangiz - bu sizning kerakli xizmatlarga tejamkor sarmoya!
                                                    Tangalarni xizmatlarga sarflang, do'stlaringizga sovg'a qiling yoki chegirmalar sotib oling.
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                        <span><strong className="text-foreground">Xizmatlar uchun to'lov:</strong> 1 tanga = 1 so'm qiymatida</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                        <span><strong className="text-foreground">Sovg'alar:</strong> Do'stlaringizga maxsus sertifikatlar yuboring</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                        <span><strong className="text-foreground">Chegirmalar:</strong> VIP xizmatlar va maxsus imtiyozlar</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-amber-500/20">
                                                    <p className="text-xs text-center text-muted-foreground italic">
                                                        💫 Har kuni tanga to'plang va sevimli xizmatlaringizdan tejamkorlik bilan foydalaning!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Spend Tab Content */}
                    <TabsContent value="spend" className="mt-0">
                        <div className="space-y-4">
                            {isBusiness ? (
                                <>
                                    {/* Business Spending Options */}
                                    {/* Promotions & Marketing */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Aksiyalar va Marketing</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <span className="text-2xl">🎟️</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Lotereya yaratish</p>
                                                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">500 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Mijozlarni jalb qilish uchun lotereya e'lon qiling</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <span className="text-2xl">💰</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Chegirma aksiyasi</p>
                                                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">300 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Maxsus chegirma takliflarini e'lon qiling</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🆓</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Bepul xizmat aksiyasi</p>
                                                        <Badge variant="outline" className="text-xs">400 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Yangi mijozlarni jalb qilish uchun</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advertising & Visibility */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">📢 Reklama va Ko'rinish</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                <span className="text-2xl">⭐</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Premium joy (7 kun)</p>
                                                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/30 text-xs">2,000 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Qidiruv natijalarida yuqori o'rinlarda ko'rsatilish</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                <span className="text-2xl">🔝</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">TOP reytingda (30 kun)</p>
                                                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 border-purple-500/30 text-xs">5,000 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Bir oy davomida kategoriyada birinchi o'rinda</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">📍</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Bosh sahifada ko'rsatish</p>
                                                        <Badge variant="outline" className="text-xs">1,500 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">3 kun davomida tavsiya etilganlar ro'yxatida</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analytics & Tools */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">📊 Tahlil va Vositalar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">📈</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Batafsil statistika</p>
                                                        <Badge variant="outline" className="text-xs">800 tanga/oy</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Mijozlar faoliyati va daromad tahlili</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">📧</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">SMS xabarnomalar</p>
                                                        <Badge variant="outline" className="text-xs">600 tanga/oy</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Mijozlarga avtomatik eslatmalar</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Client Spending Options (Original) */}
                                    {/* Service Payments */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">💰 To'lov</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">💳</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Xizmat to'lovi</p>
                                                        <Badge variant="outline" className="text-xs">1 tanga = 1 so'm</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Istalgan xizmat uchun to'lovda tangalardan foydalaning. Minimum 100 tanga.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🎁</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Sovg'a sertifikati</p>
                                                        <Badge variant="outline" className="text-xs">Min. 1,000</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">Do'stlaringiz uchun sovg'a sertifikati xarid qiling</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Promotions & Special Offers */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Aksiyalar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🏆</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Lotereya ishtiroki</p>
                                                        <Badge variant="outline" className="text-xs">100 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Turli mukofotlar uchun lotereyalarda qatnashing</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VIP Services & Benefits */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">⭐ VIP Xizmatlar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <span className="text-2xl">⚡</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Tezkor navbat</p>
                                                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">200 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Navbatsiz xizmat olish imkoniyati. Vaqtingizni tejang!</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">💎</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Premium xizmatlar</p>
                                                        <Badge variant="outline" className="text-xs">300 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Eng yaxshi ustalar va premium xizmatlarga kirish</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🎯</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">VIP paket</p>
                                                        <Badge variant="outline" className="text-xs">800 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">3 ta xizmatni birga band qilish. Tejamkorlik!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Discounts */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">💰 Chegirmalar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <span className="text-2xl">🎫</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">20% chegirma</p>
                                                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">500 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">50,000+ so'mlik xizmatlarga. Bir martalik</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                <span className="text-2xl">🎟️</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">30% chegirma</p>
                                                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">1,000 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">100,000+ so'mlik xizmatlarga. Bir martalik</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">🔥</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Haftalik chegirma</p>
                                                        <Badge variant="outline" className="text-xs">150 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Keyingi 7 kun ichida 10% chegirma</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Perks */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">🎁 Maxsus Imtiyozlar</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">📅</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Tug'ilgan kun bonusi</p>
                                                        <Badge variant="outline" className="text-xs">Bepul</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Tug'ilgan kuningizda 2x tanga + 15% chegirma</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                                <span className="text-2xl">⏰</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Erta band qilish</p>
                                                        <Badge variant="outline" className="text-xs">100 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">3 kun oldin band qiling va +50 tanga oling</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                <span className="text-2xl">👑</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-foreground">Sadoqat dasturi</p>
                                                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 border-purple-500/30 text-xs">2,000 tanga</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">3 oy davomida har bir xizmatdan 15% chegirma</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bonus Tip */}
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-lg">💡</span>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-foreground mb-1">Maslahat</p>
                                                <p className="text-xs text-muted-foreground">1,000+ tanga ishlatganingizda 10% bonus oling!</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
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
            </Tabs >


            {/* Transaction History removed from here */}

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
        </div >
    );
};

export default CoinsSection;
