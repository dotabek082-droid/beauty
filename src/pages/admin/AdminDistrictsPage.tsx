import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Edit2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface District {
    id: number;
    name_uz: string;
    name_ru: string;
    regionName: string;
    regionId: number;
    isActive: boolean;
    streetsCount: number;
}

const REGIONS_LIST = [
    { id: 1, name: "Toshkent shahri" }, { id: 2, name: "Toshkent viloyati" },
    { id: 3, name: "Samarqand viloyati" }, { id: 4, name: "Buxoro viloyati" },
    { id: 5, name: "Farg'ona viloyati" }, { id: 6, name: "Andijon viloyati" },
];

const AdminDistrictsPage = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRegion, setFilterRegion] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
    const [formData, setFormData] = useState({ name_uz: "", name_ru: "", regionId: "" });

    const [districts, setDistricts] = useState<District[]>([
        { id: 1, name_uz: "Chilonzor tumani", name_ru: "Чиланзарский район", regionName: "Toshkent shahri", regionId: 1, isActive: true, streetsCount: 45 },
        { id: 2, name_uz: "Yakkasaroy tumani", name_ru: "Яккасарайский район", regionName: "Toshkent shahri", regionId: 1, isActive: true, streetsCount: 32 },
        { id: 3, name_uz: "Mirzo Ulug'bek tumani", name_ru: "Мирзо-Улугбекский район", regionName: "Toshkent shahri", regionId: 1, isActive: true, streetsCount: 38 },
        { id: 4, name_uz: "Shayxontoxur tumani", name_ru: "Шайхантахурский район", regionName: "Toshkent shahri", regionId: 1, isActive: true, streetsCount: 29 },
        { id: 5, name_uz: "Yunusobod tumani", name_ru: "Юнусабадский район", regionName: "Toshkent shahri", regionId: 1, isActive: true, streetsCount: 41 },
        { id: 6, name_uz: "Olmaliq shahri", name_ru: "город Алмалык", regionName: "Toshkent viloyati", regionId: 2, isActive: true, streetsCount: 22 },
        { id: 7, name_uz: "Chirchiq shahri", name_ru: "город Чирчик", regionName: "Toshkent viloyati", regionId: 2, isActive: true, streetsCount: 28 },
        { id: 8, name_uz: "Samarqand shahri", name_ru: "город Самарканд", regionName: "Samarqand viloyati", regionId: 3, isActive: true, streetsCount: 55 },
        { id: 9, name_uz: "Urgut tumani", name_ru: "Ургутский район", regionName: "Samarqand viloyati", regionId: 3, isActive: true, streetsCount: 18 },
        { id: 10, name_uz: "Buxoro shahri", name_ru: "город Бухара", regionName: "Buxoro viloyati", regionId: 4, isActive: true, streetsCount: 35 },
    ]);

    const openAddDialog = () => {
        setEditingDistrict(null);
        setFormData({ name_uz: "", name_ru: "", regionId: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (district: District) => {
        setEditingDistrict(district);
        setFormData({ name_uz: district.name_uz, name_ru: district.name_ru, regionId: district.regionId.toString() });
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name_uz.trim() || !formData.regionId) {
            toast({ title: "Xatolik", description: "Barcha majburiy maydonlarni to'ldiring", variant: "destructive" });
            return;
        }
        const region = REGIONS_LIST.find(r => r.id === parseInt(formData.regionId));
        if (editingDistrict) {
            setDistricts(districts.map(d => d.id === editingDistrict.id ? { ...d, name_uz: formData.name_uz, name_ru: formData.name_ru, regionId: parseInt(formData.regionId), regionName: region?.name || "" } : d));
            toast({ title: "Yangilandi", description: "Tuman ma'lumotlari yangilandi", className: "bg-green-600 text-white border-green-700" });
        } else {
            setDistricts([...districts, {
                id: Date.now(), name_uz: formData.name_uz, name_ru: formData.name_ru,
                regionId: parseInt(formData.regionId), regionName: region?.name || "",
                isActive: true, streetsCount: 0,
            }]);
            toast({ title: "Qo'shildi", description: "Yangi tuman qo'shildi", className: "bg-green-600 text-white border-green-700" });
        }
        setDialogOpen(false);
    };

    const toggleActive = (id: number) => {
        setDistricts(districts.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
    };

    const filtered = districts
        .filter(d => filterRegion === "all" || d.regionId === parseInt(filterRegion))
        .filter(d =>
            d.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.name_ru.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                Tumanlar
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 ml-[52px]">{districts.length} ta tuman</p>
                        </div>
                        <Button onClick={openAddDialog} className="bg-orange-600 hover:bg-orange-700">
                            <Plus className="w-4 h-4 mr-2" /> Qo'shish
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="flex gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Tuman nomi bo'yicha qidirish..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-11 bg-white dark:bg-gray-900 rounded-xl" />
                    </div>
                    <Select value={filterRegion} onValueChange={setFilterRegion}>
                        <SelectTrigger className="w-[220px] h-11 rounded-xl bg-white dark:bg-gray-900">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Viloyat bo'yicha" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            {REGIONS_LIST.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nomi (UZ)</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nomi (RU)</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Viloyat</th>
                                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ko'chalar</th>
                                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Holati</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((district, idx) => (
                                <motion.tr key={district.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3 font-medium text-sm">{district.name_uz}</td>
                                    <td className="px-5 py-3 text-sm text-muted-foreground">{district.name_ru}</td>
                                    <td className="px-5 py-3"><Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">{district.regionName}</Badge></td>
                                    <td className="px-5 py-3 text-center text-sm font-semibold">{district.streetsCount}</td>
                                    <td className="px-5 py-3 text-center">
                                        <button onClick={() => toggleActive(district.id)}>
                                            <Badge variant="outline" className={`text-[10px] cursor-pointer ${district.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {district.isActive ? "Faol" : "Faolsiz"}
                                            </Badge>
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(district)}>
                                            <Edit2 className="w-3.5 h-3.5 text-primary" />
                                        </Button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingDistrict ? "Tumanni tahrirlash" : "Yangi tuman qo'shish"}</DialogTitle>
                        <DialogDescription>Tuman ma'lumotlarini kiriting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Viloyat *</Label>
                            <Select value={formData.regionId} onValueChange={(val) => setFormData({...formData, regionId: val})}>
                                <SelectTrigger><SelectValue placeholder="Viloyatni tanlang" /></SelectTrigger>
                                <SelectContent>
                                    {REGIONS_LIST.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (UZ) *</Label>
                            <Input value={formData.name_uz} onChange={(e) => setFormData({...formData, name_uz: e.target.value})} placeholder="Chilonzor tumani" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (RU)</Label>
                            <Input value={formData.name_ru} onChange={(e) => setFormData({...formData, name_ru: e.target.value})} placeholder="Чиланзарский район" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">{editingDistrict ? "Saqlash" : "Qo'shish"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDistrictsPage;
