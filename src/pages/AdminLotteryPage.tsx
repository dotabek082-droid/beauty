import { useState } from "react";
import { Shuffle, Send, Trophy, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/card";
import { mockPromotions } from "@/data/promotionData";
import { getEntriesForPromotion, selectRandomWinners, mockWinners } from "@/data/lotteryData";

const AdminLotteryPage = () => {
    const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
    const [winners, setWinners] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    const lotteryPromotions = mockPromotions.filter((p) => p.lotteryEnabled && p.isActive);

    const handleSelectWinners = () => {
        if (!selectedPromotionId) {
            alert("Aksiyani tanlang!");
            return;
        }

        const promotion = mockPromotions.find((p) => p.id === selectedPromotionId);
        if (!promotion) return;

        const entries = getEntriesForPromotion(selectedPromotionId);

        if (entries.length === 0) {
            alert("Hech kim ishtirok etmagan!");
            return;
        }

        if (entries.length < promotion.totalWinners) {
            alert(`Faqat ${entries.length} kishi ishtirok etgan, ${promotion.totalWinners} ta g'olib tanlab bo'lmaydi!`);
            return;
        }

        // Select winners using random algorithm
        const selectedWinners = selectRandomWinners(selectedPromotionId, promotion.totalWinners);
        setWinners(selectedWinners);
        setShowResults(true);

        alert(`✅ ${selectedWinners.length} ta g'olib tasodifiy tanlandi!`);
    };

    const handleNotifyWinners = () => {
        if (winners.length === 0) {
            alert("Avval g'oliblarni tanlang!");
            return;
        }

        // In real app, send notifications here
        winners.forEach((winner) => {
            winner.notifiedAt = new Date();
            winner.status = "notified";
        });

        alert(`✅ Barcha g'oliblarga bildirishnoma yuborildi!\n\nHar bir g'olib o'z promo kodini oldi.`);
    };

    const selectedPromotion = mockPromotions.find((p) => p.id === selectedPromotionId);
    const entries = selectedPromotionId ? getEntriesForPromotion(selectedPromotionId) : [];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Lotereya boshqaruvi
                    </h1>
                    <p className="text-gray-600">G'oliblarni tasodifiy tanlash va bildirishnoma yuborish</p>
                </div>

                {/* Promotion Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Aksiyani tanlang</h2>
                    <div className="grid gap-4">
                        {lotteryPromotions.map((promo) => {
                            const promoEntries = getEntriesForPromotion(promo.id);
                            return (
                                <div
                                    key={promo.id}
                                    onClick={() => setSelectedPromotionId(promo.id)}
                                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedPromotionId === promo.id
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={promo.imageUrl}
                                            alt={promo.serviceName}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{promo.serviceName}</h3>
                                            <p className="text-sm text-gray-600">{promo.salonName}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-primary" />
                                                    <span>{promoEntries.length} ishtirokchi</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Trophy className="w-4 h-4 text-success" />
                                                    <span>{promo.totalWinners} g'olib</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-purple-500" />
                                                    <span>
                                                        {new Date(promo.winnerSelectionDate!).toLocaleDateString('uz-UZ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Entries List */}
                {selectedPromotion && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            Ishtirokchilar ro'yxati ({entries.length} kishi)
                        </h2>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">№</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Ism</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Telefon</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Sana</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Holat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {entries.map((entry, index) => (
                                        <tr key={entry.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{entry.userName}</td>
                                            <td className="px-4 py-3 text-sm">{entry.userPhone}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(entry.enteredAt).toLocaleString('uz-UZ')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${entry.status === "winner"
                                                            ? "bg-success/20 text-success"
                                                            : entry.status === "loser"
                                                                ? "bg-gray-200 text-gray-700"
                                                                : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {entry.status === "winner"
                                                        ? "G'olib"
                                                        : entry.status === "loser"
                                                            ? "Yutqazmadi"
                                                            : "Kutilmoqda"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                {selectedPromotion && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex gap-4">
                            <button
                                onClick={handleSelectWinners}
                                className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                <Shuffle className="w-5 h-5" />
                                G'oliblarni tasodifiy tanlash
                            </button>
                            <button
                                onClick={handleNotifyWinners}
                                disabled={winners.length === 0}
                                className="flex-1 bg-success text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-success/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                G'oliblarga bildirishnoma yuborish
                            </button>
                        </div>
                    </div>
                )}

                {/* Winners List */}
                {showResults && winners.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-success" />
                            G'oliblar ro'yxati ({winners.length} kishi)
                        </h2>
                        <div className="grid gap-4">
                            {winners.map((winner, index) => (
                                <div
                                    key={winner.id}
                                    className="p-4 border-2 border-success/30 bg-success/5 rounded-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-success">#{index + 1}</span>
                                                <div>
                                                    <p className="font-bold text-lg">{winner.userName}</p>
                                                    <p className="text-sm text-gray-600">{winner.userPhone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Promo kod:</p>
                                            <p className="text-xl font-mono font-bold text-primary bg-white px-4 py-2 rounded-lg border-2 border-primary">
                                                {winner.promotionCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Winners (from all promotions) */}
                {mockWinners.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                        <h2 className="text-xl font-bold mb-4">
                            Barcha g'oliblar ({mockWinners.length} kishi)
                        </h2>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Ism</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Promo kod</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Holat</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Tanlangan sana</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {mockWinners.map((winner) => (
                                        <tr key={winner.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium">{winner.userName}</td>
                                            <td className="px-4 py-3">
                                                <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                                    {winner.promotionCode}
                                                </code>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                                                    {winner.status === "notified" ? "Bildirildi" : "Tanlandi"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(winner.selectedAt).toLocaleString('uz-UZ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLotteryPage;
