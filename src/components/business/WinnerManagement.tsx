import { useState } from "react";
import { CheckCircle2, Clock, Trophy, MapPin, Calendar, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { mockWinners, mockPromotions, Winner } from "@/data/promotionData";
import { format } from "date-fns";

interface WinnerManagementProps {
    businessId: string;
}

const WinnerManagement = ({ businessId }: WinnerManagementProps) => {
    // In a real app, we'd fetch this from ID
    const [winners, setWinners] = useState<Winner[]>(mockWinners);
    const [searchTerm, setSearchTerm] = useState("");

    const handleMarkServed = (winnerId: string) => {
        setWinners(prev => prev.map(w => {
            if (w.id === winnerId) {
                toast.success("Mijozga xizmat ko'rsatildi deb belgilandi");
                return { ...w, status: 'served' };
            }
            return w;
        }));
    };

    const getPromotionDetails = (promoId: string) => {
        return mockPromotions.find(p => p.id === promoId);
    };

    const filteredWinners = winners.filter(w =>
        w.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        G'oliblarni Boshqarish
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Lotereya g'oliblari ro'yxati va ularning statusi
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Ism yoki ID bo'yicha izlash..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredWinners.map((winner) => {
                    const promo = getPromotionDetails(winner.promotionId);
                    return (
                        <Card key={winner.id} className="p-4 overflow-hidden border-l-4 border-l-yellow-500">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-yellow-200">
                                        <Trophy className="w-8 h-8 text-yellow-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg">{winner.userName}</h3>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                ID: {winner.userId}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium text-foreground/80 mb-1">
                                            Yutgan: {promo?.serviceName || "Noma'lum aksiya"}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(winner.wonAt), "dd.MM.yyyy HH:mm")}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {winner.userPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-center gap-2 min-w-[200px]">
                                    {winner.status === 'pending' ? (
                                        <>
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 px-3 py-1">
                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                Kutilmoqda
                                            </Badge>
                                            <Button
                                                size="sm"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => handleMarkServed(winner.id)}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Xizmat ko'rsatildi
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 px-3 py-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                Xizmat ko'rsatildi
                                            </Badge>
                                            {winner.feedbackGiven ? (
                                                <span className="text-xs text-emerald-600 font-medium flex items-center">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Mijoz fikr qoldirdi
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">
                                                    Mijoz fikri kutilmoqda
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {filteredWinners.length === 0 && (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Topilmadi</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WinnerManagement;
