import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Send, User, Phone, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

export interface PromotionParticipant {
    id: string;
    promotion_id: string;
    user_id: string;
    user_name: string;
    user_phone: string;
    user_trust_score: number;
    registered_at: string;
    status: 'registered' | 'used' | 'cancelled' | 'no_show';
    booking_id?: string;
    booking_date?: string;
    notes?: string;
}

interface PromotionParticipantsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    promotionId: string;
    promotionName: string;
    participants: PromotionParticipant[];
}

export function PromotionParticipants({
    open,
    onOpenChange,
    promotionId,
    promotionName,
    participants
}: PromotionParticipantsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Filter participants based on search and tab
    const filteredParticipants = participants.filter(p => {
        const matchesSearch = p.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.user_phone.includes(searchQuery);
        const matchesTab = activeTab === 'all' || p.status === activeTab;
        return matchesSearch && matchesTab;
    });

    // Statistics
    const stats = {
        total: participants.length,
        used: participants.filter(p => p.status === 'used').length,
        registered: participants.filter(p => p.status === 'registered').length,
        cancelled: participants.filter(p => p.status === 'cancelled').length,
        noShow: participants.filter(p => p.status === 'no_show').length
    };

    const conversionRate = stats.total > 0 ? ((stats.used / stats.total) * 100).toFixed(1) : 0;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'used': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'registered': return <Clock className="w-4 h-4 text-blue-600" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
            case 'no_show': return <XCircle className="w-4 h-4 text-orange-600" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            used: 'bg-green-100 text-green-800 border-green-300',
            registered: 'bg-blue-100 text-blue-800 border-blue-300',
            cancelled: 'bg-red-100 text-red-800 border-red-300',
            no_show: 'bg-orange-100 text-orange-800 border-orange-300'
        };

        const labels: Record<string, string> = {
            used: 'Foydalanilgan',
            registered: 'Ro\'yxatdan o\'tgan',
            cancelled: 'Bekor qilingan',
            no_show: 'Kelmadi'
        };

        return (
            <Badge variant="outline" className={`${variants[status]} text-xs`}>
                {labels[status]}
            </Badge>
        );
    };

    const handleExport = () => {
        // Convert to CSV
        const headers = ['Ism', 'Telefon', 'Sana', 'Status', 'Reyting'];
        const rows = filteredParticipants.map(p => [
            p.user_name,
            p.user_phone,
            new Date(p.registered_at).toLocaleDateString('uz-UZ'),
            p.status,
            p.user_trust_score.toString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${promotionName}_participants.csv`;
        a.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        📊 Ro'yxatdan o'tganlar
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">{promotionName}</p>
                </DialogHeader>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
                    <div className="bg-slate-50 rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground">Jami</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-green-700">Foydalanilgan</p>
                        <p className="text-2xl font-bold text-green-800">{stats.used}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-blue-700">Kutmoqda</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.registered}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <p className="text-xs text-purple-700">Konversiya</p>
                        <p className="text-2xl font-bold text-purple-800">{conversionRate}%</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <p className="text-xs text-orange-700">Bekor/Kelmadi</p>
                        <p className="text-2xl font-bold text-orange-800">{stats.cancelled + stats.noShow}</p>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Ism yoki telefon raqami bo'yicha qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Xabar
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">Hammasi ({stats.total})</TabsTrigger>
                        <TabsTrigger value="registered">Ro'yxatda ({stats.registered})</TabsTrigger>
                        <TabsTrigger value="used">Foydalangan ({stats.used})</TabsTrigger>
                        <TabsTrigger value="cancelled">Bekor ({stats.cancelled})</TabsTrigger>
                        <TabsTrigger value="no_show">Kelmadi ({stats.noShow})</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-4">
                        {filteredParticipants.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Hech kim ro'yxatdan o'tmagan</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredParticipants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{participant.user_name}</p>
                                                    {getStatusIcon(participant.status)}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {participant.user_phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(participant.registered_at).toLocaleDateString('uz-UZ')}
                                                    </span>
                                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                                        ⭐ {participant.user_trust_score}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(participant.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredParticipants.length > 0 && (
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Ko'rsatilmoqda: {filteredParticipants.length} ta ishtirokchi
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
