import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Edit2, Search, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SubCategory {
    id: string;
    label: string;
    isActive: boolean;
}

interface Category {
    id: string;
    label: string;
    icon: string;
    isActive: boolean;
    subcategories: SubCategory[];
}

const AdminCategoriesPage = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [subDialogOpen, setSubDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [parentForSub, setParentForSub] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: "", icon: "" });
    const [subFormData, setSubFormData] = useState({ label: "" });

    const [categories, setCategories] = useState<Category[]>([
        {
            id: "beauty", label: "Go'zallik saloni", icon: "💇", isActive: true,
            subcategories: [
                { id: "hair", label: "Soch turmagi", isActive: true },
                { id: "nails", label: "Tirnoq xizmati", isActive: true },
                { id: "skincare", label: "Yuz parvarishi", isActive: true },
                { id: "makeup", label: "Makiyaj", isActive: true },
            ]
        },
        {
            id: "barber", label: "Sartaroshxona", icon: "💈", isActive: true,
            subcategories: [
                { id: "haircut", label: "Soch kesish", isActive: true },
                { id: "beard", label: "Soqol olish", isActive: true },
                { id: "shaving", label: "Ustara bilan olish", isActive: true },
            ]
        },
        {
            id: "spa", label: "SPA va massaj", icon: "🧖", isActive: true,
            subcategories: [
                { id: "massage", label: "Massaj", isActive: true },
                { id: "sauna", label: "Sauna/Hammom", isActive: true },
            ]
        },
        {
            id: "fitness", label: "Sport va fitness", icon: "🏋️", isActive: true,
            subcategories: [
                { id: "gym", label: "Trenajor zali", isActive: true },
                { id: "yoga", label: "Yoga", isActive: true },
                { id: "swimming", label: "Suzish", isActive: true },
            ]
        },
        {
            id: "medical", label: "Tibbiy kosmetologiya", icon: "🏥", isActive: true,
            subcategories: [
                { id: "laser", label: "Lazer epilyatsiya", isActive: true },
                { id: "injection", label: "In'ektsion kosmetologiya", isActive: true },
            ]
        },
    ]);

    const openAddCategory = () => {
        setEditingCategory(null);
        setFormData({ label: "", icon: "" });
        setDialogOpen(true);
    };

    const openEditCategory = (cat: Category) => {
        setEditingCategory(cat);
        setFormData({ label: cat.label, icon: cat.icon });
        setDialogOpen(true);
    };

    const handleSaveCategory = () => {
        if (!formData.label.trim()) {
            toast({ title: "Xatolik", description: "Kategoriya nomini kiriting", variant: "destructive" });
            return;
        }
        if (editingCategory) {
            setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, label: formData.label, icon: formData.icon } : c));
            toast({ title: "Yangilandi", description: "Kategoriya yangilandi", className: "bg-green-600 text-white border-green-700" });
        } else {
            const id = formData.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '') + '_' + Date.now();
            setCategories([...categories, { id, label: formData.label, icon: formData.icon || "📁", isActive: true, subcategories: [] }]);
            toast({ title: "Qo'shildi", description: "Yangi kategoriya qo'shildi", className: "bg-green-600 text-white border-green-700" });
        }
        setDialogOpen(false);
    };

    const openAddSubcategory = (categoryId: string) => {
        setParentForSub(categoryId);
        setSubFormData({ label: "" });
        setSubDialogOpen(true);
    };

    const handleSaveSubcategory = () => {
        if (!subFormData.label.trim() || !parentForSub) {
            toast({ title: "Xatolik", description: "Subkategoriya nomini kiriting", variant: "destructive" });
            return;
        }
        const subId = subFormData.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '') + '_' + Date.now();
        setCategories(categories.map(c =>
            c.id === parentForSub
                ? { ...c, subcategories: [...c.subcategories, { id: subId, label: subFormData.label, isActive: true }] }
                : c
        ));
        setSubDialogOpen(false);
        toast({ title: "Qo'shildi", description: "Yangi subkategoriya qo'shildi", className: "bg-green-600 text-white border-green-700" });
    };

    const toggleCategoryActive = (id: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    const toggleSubActive = (catId: string, subId: string) => {
        setCategories(categories.map(c =>
            c.id === catId
                ? { ...c, subcategories: c.subcategories.map(s => s.id === subId ? { ...s, isActive: !s.isActive } : s) }
                : c
        ));
    };

    const filtered = categories.filter(c =>
        c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subcategories.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                Kategoriyalar
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
                                {categories.length} ta kategoriya, {categories.reduce((a, c) => a + c.subcategories.length, 0)} ta subkategoriya
                            </p>
                        </div>
                        <Button onClick={openAddCategory} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-2" /> Kategoriya qo'shish
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="relative mb-5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Kategoriya nomi bo'yicha qidirish..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 bg-white dark:bg-gray-900 rounded-xl" />
                </div>

                <div className="space-y-3">
                    {filtered.map((cat, idx) => (
                        <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}>
                                    <span className="text-2xl">{cat.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-foreground">{cat.label}</h3>
                                        <p className="text-xs text-muted-foreground">{cat.subcategories.length} ta subkategoriya</p>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); toggleCategoryActive(cat.id); }}>
                                        <Badge variant="outline" className={`text-[10px] cursor-pointer ${cat.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {cat.isActive ? "Faol" : "Faolsiz"}
                                        </Badge>
                                    </button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); openEditCategory(cat); }}>
                                        <Edit2 className="w-3.5 h-3.5 text-primary" />
                                    </Button>
                                    {expandedId === cat.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                                </div>

                                {expandedId === cat.id && (
                                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 px-5 py-3">
                                        <div className="space-y-1.5">
                                            {cat.subcategories.map(sub => (
                                                <div key={sub.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-800/30 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                                    <span className="text-sm flex-1">{sub.label}</span>
                                                    <button onClick={() => toggleSubActive(cat.id, sub.id)}>
                                                        <Badge variant="outline" className={`text-[9px] cursor-pointer ${sub.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                            {sub.isActive ? "Faol" : "Faolsiz"}
                                                        </Badge>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" size="sm" className="mt-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                            onClick={() => openAddSubcategory(cat.id)}>
                                            <Plus className="w-3 h-3 mr-1" /> Subkategoriya qo'shish
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Category Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
                        <DialogDescription>Kategoriya ma'lumotlarini kiriting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nomi *</Label>
                            <Input value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} placeholder="Go'zallik saloni" />
                        </div>
                        <div className="space-y-2">
                            <Label>Emoji icon</Label>
                            <Input value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="💇" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSaveCategory} className="bg-purple-600 hover:bg-purple-700">{editingCategory ? "Saqlash" : "Qo'shish"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Subcategory Dialog */}
            <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Yangi subkategoriya</DialogTitle>
                        <DialogDescription>Subkategoriya nomini kiriting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nomi *</Label>
                            <Input value={subFormData.label} onChange={(e) => setSubFormData({ label: e.target.value })} placeholder="Soch turmagi" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSubDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSaveSubcategory} className="bg-purple-600 hover:bg-purple-700">Qo'shish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCategoriesPage;
