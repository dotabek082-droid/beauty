import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation, Plus, Edit2, Search, Filter } from "lucide-react";
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

interface Street {
    id: number;
    name_uz: string;
    name_ru: string;
    districtName: string;
    regionName: string;
    districtId: number;
    isActive: boolean;
}

const DISTRICTS_LIST = [
    { id: 1, name: "Chilonzor tumani", region: "Toshkent shahri" },
    { id: 2, name: "Yakkasaroy tumani", region: "Toshkent shahri" },
    { id: 3, name: "Mirzo Ulug'bek tumani", region: "Toshkent shahri" },
    { id: 5, name: "Yunusobod tumani", region: "Toshkent shahri" },
    { id: 8, name: "Samarqand shahri", region: "Samarqand viloyati" },
];

const AdminStreetsPage = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStreet, setEditingStreet] = useState<Street | null>(null);
    const [formData, setFormData] = useState({ name_uz: "", name_ru: "", districtId: "" });

    const [streets, setStreets] = useState<Street[]>([
        { id: 1, name_uz: "Bunyodkor ko'chasi", name_ru: "улица Буньодкор", districtName: "Chilonzor tumani", regionName: "Toshkent shahri", districtId: 1, isActive: true },
        { id: 2, name_uz: "Mustaqillik shoh ko'chasi", name_ru: "проспект Мустакиллик", districtName: "Yakkasaroy tumani", regionName: "Toshkent shahri", districtId: 2, isActive: true },
        { id: 3, name_uz: "Amir Temur shoh ko'chasi", name_ru: "проспект Амира Темура", districtName: "Yakkasaroy tumani", regionName: "Toshkent shahri", districtId: 2, isActive: true },
        { id: 4, name_uz: "Navoiy ko'chasi", name_ru: "улица Навои", districtName: "Chilonzor tumani", regionName: "Toshkent shahri", districtId: 1, isActive: true },
        { id: 5, name_uz: "Shota Rustaveli ko'chasi", name_ru: "улица Шота Руставели", districtName: "Mirzo Ulug'bek tumani", regionName: "Toshkent shahri", districtId: 3, isActive: true },
        { id: 6, name_uz: "Minor ko'chasi", name_ru: "улица Минор", districtName: "Yunusobod tumani", regionName: "Toshkent shahri", districtId: 5, isActive: true },
        { id: 7, name_uz: "Registon maydoni", name_ru: "площадь Регистан", districtName: "Samarqand shahri", regionName: "Samarqand viloyati", districtId: 8, isActive: true },
        { id: 8, name_uz: "Bodomzor yo'li", name_ru: "проспект Бадамзар", districtName: "Yunusobod tumani", regionName: "Toshkent shahri", districtId: 5, isActive: true },
    ]);

    const openAddDialog = () => {
        setEditingStreet(null);
        setFormData({ name_uz: "", name_ru: "", districtId: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (street: Street) => {
        setEditingStreet(street);
        setFormData({ name_uz: street.name_uz, name_ru: street.name_ru, districtId: street.districtId.toString() });
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name_uz.trim() || !formData.districtId) {
            toast({ title: "Xatolik", description: "Barcha majburiy maydonlarni to'ldiring", variant: "destructive" });
            return;
        }
        const district = DISTRICTS_LIST.find(d => d.id === parseInt(formData.districtId));
        if (editingStreet) {
            setStreets(streets.map(s => s.id === editingStreet.id ? { ...s, name_uz: formData.name_uz, name_ru: formData.name_ru, districtId: parseInt(formData.districtId), districtName: district?.name || "", regionName: district?.region || "" } : s));
            toast({ title: "Yangilandi", description: "Ko'cha ma'lumotlari yangilandi", className: "bg-green-600 text-white border-green-700" });
        } else {
            setStreets([...streets, {
                id: Date.now(), name_uz: formData.name_uz, name_ru: formData.name_ru,
                districtId: parseInt(formData.districtId), districtName: district?.name || "", regionName: district?.region || "",
                isActive: true,
            }]);
            toast({ title: "Qo'shildi", description: "Yangi ko'cha qo'shildi", className: "bg-green-600 text-white border-green-700" });
        }
        setDialogOpen(false);
    };

    const toggleActive = (id: number) => {
        setStreets(streets.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    };

    const filtered = streets
        .filter(s => filterDistrict === "all" || s.districtId === parseInt(filterDistrict))
        .filter(s => s.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) || s.name_ru.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <Navigation className="w-5 h-5 text-white" />
                                </div>
                                Ko'chalar
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 ml-[52px]">{streets.length} ta ko'cha</p>
                        </div>
                        <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" /> Qo'shish
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="flex gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Ko'cha nomi bo'yicha qidirish..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-11 bg-white dark:bg-gray-900 rounded-xl" />
                    </div>
                    <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                        <SelectTrigger className="w-[240px] h-11 rounded-xl bg-white dark:bg-gray-900">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Tuman bo'yicha" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            {DISTRICTS_LIST.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nomi (UZ)</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nomi (RU)</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tuman</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Viloyat</th>
                                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Holati</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((street, idx) => (
                                <motion.tr key={street.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3 font-medium text-sm">{street.name_uz}</td>
                                    <td className="px-5 py-3 text-sm text-muted-foreground">{street.name_ru}</td>
                                    <td className="px-5 py-3"><Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-700 border-orange-200">{street.districtName}</Badge></td>
                                    <td className="px-5 py-3 text-sm text-muted-foreground">{street.regionName}</td>
                                    <td className="px-5 py-3 text-center">
                                        <button onClick={() => toggleActive(street.id)}>
                                            <Badge variant="outline" className={`text-[10px] cursor-pointer ${street.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {street.isActive ? "Faol" : "Faolsiz"}
                                            </Badge>
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(street)}>
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
                        <DialogTitle>{editingStreet ? "Ko'chani tahrirlash" : "Yangi ko'cha qo'shish"}</DialogTitle>
                        <DialogDescription>Ko'cha ma'lumotlarini kiriting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Tuman *</Label>
                            <Select value={formData.districtId} onValueChange={(val) => setFormData({...formData, districtId: val})}>
                                <SelectTrigger><SelectValue placeholder="Tumanni tanlang" /></SelectTrigger>
                                <SelectContent>
                                    {DISTRICTS_LIST.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.region})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (UZ) *</Label>
                            <Input value={formData.name_uz} onChange={(e) => setFormData({...formData, name_uz: e.target.value})} placeholder="Bunyodkor ko'chasi" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (RU)</Label>
                            <Input value={formData.name_ru} onChange={(e) => setFormData({...formData, name_ru: e.target.value})} placeholder="улица Буньодкор" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">{editingStreet ? "Saqlash" : "Qo'shish"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminStreetsPage;
