import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Copy, Check, Ticket, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fakePromocodes, Promocode } from "@/data/promocodes";
import BottomNav from "@/components/BottomNav";

const CATEGORIES = [
    "Soch turmaklash", "Barbershop", "Manikyur", "Pedikyur",
    "Makiyaj", "Kosmetologiya", "SPA", "Massaj",
    "Epilyatsiya", "Tatuirovka", "Avto yuvish", "Deteiling"
];

const AdminPromocodes = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [promocodes, setPromocodes] = useState<Promocode[]>(fakePromocodes);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Form State
    const [newCode, setNewCode] = useState("");
    const [description, setDescription] = useState("");
    const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
    const [discountValue, setDiscountValue] = useState("");
    const [validDays, setValidDays] = useState("30");
    const [isSpecificCategory, setIsSpecificCategory] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast({ title: "Nusxalandi" });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id: string) => {
        setPromocodes(prev => prev.filter(p => p.id !== id));
        toast({ title: "O'chirildi" });
    };

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(prev => prev.filter(c => c !== cat));
        } else {
            setSelectedCategories(prev => [...prev, cat]);
        }
    };

    const handleCreate = () => {
        if (!newCode || !description || !discountValue) {
            toast({ title: "Xatolik", description: "Barcha maydonlarni to'ldiring", variant: "destructive" });
            return;
        }

        const newItem: Promocode = {
            id: `pc-new-${Date.now()}`,
            code: newCode.toUpperCase(),
            description,
            discountType,
            discountValue: Number(discountValue),
            validUntil: new Date(Date.now() + Number(validDays) * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            source: 'admin',
            applicableCategories: isSpecificCategory ? selectedCategories : undefined
        };

        setPromocodes(prev => [newItem, ...prev]);
        setIsCreateOpen(false);
        toast({ title: "Muvaffaqiyatli", description: "Yangi promokod yaratildi" });

        // Reset form
        setNewCode("");
        setDescription("");
        setDiscountValue("");
        setIsSpecificCategory(false);
        setSelectedCategories([]);
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="flex items-center justify-between p-3 safe-top">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">Promokodlar Boshqaruvi</h1>
                            <p className="text-xs text-muted-foreground">Admin paneli</p>
                        </div>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <Plus className="w-4 h-4" />
                                Yaratish
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Yangi Promokod</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Kod (Masalan: SUMMER2026)</Label>
                                    <Input
                                        placeholder="Kod kiriting"
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tavsif</Label>
                                    <Input
                                        placeholder="Qisqacha tavsif"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Chegirma turi</Label>
                                        <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percent">Foiz (%)</SelectItem>
                                                <SelectItem value="fixed">Summa (so'm)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Qiymati</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amal qilish muddati (kun)</Label>
                                    <Select value={validDays} onValueChange={setValidDays}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7">1 hafta</SelectItem>
                                            <SelectItem value="14">2 hafta</SelectItem>
                                            <SelectItem value="30">1 oy</SelectItem>
                                            <SelectItem value="90">3 oy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3 pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base">Kategoriyalar bo'yicha cheklash</Label>
                                        <Switch
                                            checked={isSpecificCategory}
                                            onCheckedChange={setIsSpecificCategory}
                                        />
                                    </div>

                                    {isSpecificCategory && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            className="grid grid-cols-2 gap-2 pt-2"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <div
                                                    key={cat}
                                                    onClick={() => toggleCategory(cat)}
                                                    className={`text-xs px-2 py-1.5 rounded-md border cursor-pointer transition-colors flex items-center justify-between ${selectedCategories.includes(cat)
                                                            ? "bg-primary/10 border-primary text-primary"
                                                            : "bg-card border-border text-muted-foreground hover:bg-muted"
                                                        }`}
                                                >
                                                    {cat}
                                                    {selectedCategories.includes(cat) && <Check className="w-3 h-3" />}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Saqlash</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-3">
                {promocodes.map((promo, index) => (
                    <motion.div
                        key={promo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-primary">{promo.code}</h3>
                                        {promo.source === 'admin' ? (
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Admin</Badge>
                                        ) : (
                                            <Badge variant="outline">Tizim</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-lg">
                                        {promo.discountType === 'percent' ? `-${promo.discountValue}%` : `-${promo.discountValue.toLocaleString()}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {promo.discountType === 'fixed' ? "so'm" : ""}
                                    </span>
                                </div>
                            </div>

                            {promo.applicableCategories && promo.applicableCategories.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {promo.applicableCategories.map((cat, i) => (
                                        <div key={i} className="flex items-center gap-1 text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                                            <Tag className="w-3 h-3" />
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Barcha kategoriyalar uchun
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t mt-1">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(promo.validUntil).toLocaleDateString()} gacha
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleCopy(promo.code, promo.id)}>
                                        {copiedId === promo.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(promo.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};

export default AdminPromocodes;
