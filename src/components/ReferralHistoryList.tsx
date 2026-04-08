import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReferralHistoryItem {
    referredUserId: string;
    status: 'pending' | 'completed';
    createdAt: string;
    completedAt?: string;
}

export const ReferralHistoryList = ({ userId }: { userId: string }) => {
    const [history, setHistory] = useState<ReferralHistoryItem[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            const { getMyReferralHistory } = await import('@/utils/referralUtils');
            setHistory(getMyReferralHistory(userId));
        };
        loadHistory();

        // Listen for storage changes to auto-update (optional, for cross-tab or strict consistency)
        window.addEventListener('storage', loadHistory);
        return () => window.removeEventListener('storage', loadHistory);
    }, [userId]);

    if (history.length === 0) {
        return (
            <div className="text-center py-4 text-xs text-muted-foreground bg-muted/30 rounded-lg">
                Hali hech kimni taklif qilmadingiz
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {history.map((item, index) => (
                <Card key={index} className="p-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Foydalanuvchi #{item.referredUserId.slice(0, 5)}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        {item.status === 'completed' ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                                +500 tanga
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-amber-500 border-amber-500">
                                Kutilmoqda
                            </Badge>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
};
