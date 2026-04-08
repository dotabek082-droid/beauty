import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getCoinBalance, getTransactionsSummary } from "@/utils/coinBalance";
import { useNavigate } from "react-router-dom";

const CoinBalanceCard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [summary, setSummary] = useState({ today: 0, week: 0, total: 0 });

    useEffect(() => {
        if (user?.id) {
            const bal = getCoinBalance(user.id);
            const summ = getTransactionsSummary(user.id);
            setBalance(bal);
            setSummary(summ);
        }
    }, [user?.id]);

    if (!user) return null;

    return (
        <Card
            className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 cursor-pointer hover:from-amber-500/15 hover:to-yellow-500/15 transition-all"
            onClick={() => navigate('/profile/coins')}
        >
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
    );
};

export default CoinBalanceCard;
