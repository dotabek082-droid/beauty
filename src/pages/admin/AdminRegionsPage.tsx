import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Plus, Edit2, Trash2, Search, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Region {
    id: number;
    name_uz: string;
    name_ru: string;
    code: string;
    isActive: boolean;
    districtsCount: number;
}

const AdminRegionsPage = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [formData, setFormData] = useState({ name_uz: "", name_ru: "", code: "" });

    const [regions, setRegions] = useState<Region[]>([
        { id: 1, name_uz: "Toshkent shahri", name_ru: "город Ташкент", code: "TAS", isActive: true, districtsCount: 11 },
        { id: 2, name_uz: "Toshkent viloyati", name_ru: "Ташкентская область", code: "TOV", isActive: true, districtsCount: 15 },
        { id: 3, name_uz: "Samarqand viloyati", name_ru: "Самаркандская область", code: "SAM", isActive: true, districtsCount: 14 },
        { id: 4, name_uz: "Buxoro viloyati", name_ru: "Бухарская область", code: "BUX", isActive: true, districtsCount: 11 },
        { id: 5, name_uz: "Farg'ona viloyati", name_ru: "Ферганская область", code: "FAR", isActive: true, districtsCount: 15 },
        { id: 6, name_uz: "Andijon viloyati", name_ru: "Андижанская область", code: "AND", isActive: true, districtsCount: 14 },
        { id: 7, name_uz: "Namangan viloyati", name_ru: "Наманганская область", code: "NAM", isActive: true, districtsCount: 11 },
        { id: 8, name_uz: "Xorazm viloyati", name_ru: "Хорезмская область", code: "XOR", isActive: true, districtsCount: 10 },
        { id: 9, name_uz: "Navoiy viloyati", name_ru: "Навоийская область", code: "NAV", isActive: true, districtsCount: 8 },
        { id: 10, name_uz: "Qashqadaryo viloyati", name_ru: "Кашкадарьинская область", code: "QAS", isActive: true, districtsCount: 13 },
        { id: 11, name_uz: "Surxondaryo viloyati", name_ru: "Сурхандарьинская область", code: "SUR", isActive: true, districtsCount: 13 },
        { id: 12, name_uz: "Jizzax viloyati", name_ru: "Джизакская область", code: "JIZ", isActive: true, districtsCount: 12 },
        { id: 13, name_uz: "Sirdaryo viloyati", name_ru: "Сырдарьинская область", code: "SIR", isActive: true, districtsCount: 8 },
        { id: 14, name_uz: "Qoraqalpog'iston Respublikasi", name_ru: "Республика Каракалпакстан", code: "QAR", isActive: true, districtsCount: 14 },
    ]);

    const openAddDialog = () => {
        setEditingRegion(null);
        setFormData({ name_uz: "", name_ru: "", code: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (region: Region) => {
        setEditingRegion(region);
        setFormData({ name_uz: region.name_uz, name_ru: region.name_ru, code: region.code });
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name_uz.trim() || !formData.code.trim()) {
            toast({ title: "Xatolik", description: "Barcha majburiy maydonlarni to'ldiring", variant: "destructive" });
            return;
        }
        if (editingRegion) {
            setRegions(regions.map(r => r.id === editingRegion.id ? { ...r, ...formData } : r));
            toast({ title: "Yangilandi", description: "Viloyat ma'lumotlari yangilandi", className: "bg-green-600 text-white border-green-700" });
        } else {
            const newRegion: Region = {
                id: Date.now(), name_uz: formData.name_uz, name_ru: formData.name_ru,
                code: formData.code, isActive: true, districtsCount: 0,
            };
            setRegions([...regions, newRegion]);
            toast({ title: "Qo'shildi", description: "Yangi viloyat qo'shildi", className: "bg-green-600 text-white border-green-700" });
        }
        setDialogOpen(false);
    };

    const toggleActive = (id: number) => {
        setRegions(regions.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    };

    const filtered = regions.filter(r =>
        r.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <Map className="w-5 h-5 text-white" />
                                </div>
                                Viloyatlar
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
                                {regions.length} ta viloyat ro'yxati
                            </p>
                        </div>
                        <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" /> Qo'shish
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="relative mb-5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Viloyat nomi bo'yicha qidirish..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 bg-white dark:bg-gray-900 rounded-xl" />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Kod</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nomi (UZ)</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nomi (RU)</th>
                                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tumanlar</th>
                                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Holati</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((region, idx) => (
                                <motion.tr
                                    key={region.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                                >
                                    <td className="px-5 py-3">
                                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                            {region.code}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-medium text-sm text-foreground">{region.name_uz}</td>
                                    <td className="px-5 py-3 text-sm text-muted-foreground">{region.name_ru}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className="text-sm font-semibold text-foreground">{region.districtsCount}</span>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button onClick={() => toggleActive(region.id)}>
                                            <Badge variant="outline" className={`text-[10px] cursor-pointer ${region.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {region.isActive ? "Faol" : "Faolsiz"}
                                            </Badge>
                                        </button>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(region)}>
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
                        <DialogTitle>{editingRegion ? "Viloyatni tahrirlash" : "Yangi viloyat qo'shish"}</DialogTitle>
                        <DialogDescription>Viloyat ma'lumotlarini kiriting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nomi (UZ) *</Label>
                            <Input value={formData.name_uz} onChange={(e) => setFormData({...formData, name_uz: e.target.value})} placeholder="Toshkent shahri" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nomi (RU)</Label>
                            <Input value={formData.name_ru} onChange={(e) => setFormData({...formData, name_ru: e.target.value})} placeholder="город Ташкент" />
                        </div>
                        <div className="space-y-2">
                            <Label>Kod *</Label>
                            <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="TAS" maxLength={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">{editingRegion ? "Saqlash" : "Qo'shish"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminRegionsPage;
