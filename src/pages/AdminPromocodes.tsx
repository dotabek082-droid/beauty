import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, Copy, Check, Tag, Power, PowerOff,
  Search, Filter, Calendar, Percent, Banknote, Clock, CheckCircle2,
  FileEdit, Zap, Archive, Eye, EyeOff, ToggleLeft, ToggleRight,
  Sparkles, AlertTriangle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fakePromocodes, Promocode } from "@/data/promocodes";
import BottomNav from "@/components/BottomNav";

const CATEGORIES = [
  "Soch turmaklash", "Barbershop", "Manikyur", "Pedikyur",
  "Makiyaj", "Kosmetologiya", "SPA", "Massaj",
  "Epilyatsiya", "Tatuirovka", "Avto yuvish", "Deteiling"
];

type StatusFilter = "all" | "active" | "draft" | "used" | "expired";

const AdminPromocodes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [promocodes, setPromocodes] = useState<Promocode[]>(fakePromocodes);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [newCode, setNewCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Default YYYY-MM-DD
  });
  const [endDate, setEndDate] = useState(() => {
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 30); // Default to 30 days
    return defaultEnd.toISOString().split('T')[0];
  });
  const [isSpecificCategory, setIsSpecificCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // ─── Counts ───
  const counts = useMemo(() => ({
    all: promocodes.length,
    active: promocodes.filter(p => p.status === 'active').length,
    draft: promocodes.filter(p => p.status === 'draft').length,
    used: promocodes.filter(p => p.status === 'used').length,
    expired: promocodes.filter(p => p.status === 'expired').length,
  }), [promocodes]);

  // ─── Filtered list ───
  const filteredPromocodes = useMemo(() => {
    let list = promocodes;
    if (statusFilter !== "all") {
      list = list.filter(p => p.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [promocodes, statusFilter, searchQuery]);

  // ─── Handlers ───
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({ title: "Nusxalandi", description: `"${code}" nusxalandi` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setPromocodes(prev => prev.filter(p => p.id !== id));
    toast({ title: "O'chirildi", description: "Promokod muvaffaqiyatli o'chirildi" });
  };

  const handleActivate = (id: string) => {
    setPromocodes(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'active' as const } : p)
    );
    const promo = promocodes.find(p => p.id === id);
    toast({
      title: "Faollashtirildi ✅",
      description: `"${promo?.code}" endi faol va foydalanuvchilarga ko'rinadi`,
      className: "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800"
    });
  };

  const handleDeactivate = (id: string) => {
    setPromocodes(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'draft' as const } : p)
    );
    const promo = promocodes.find(p => p.id === id);
    toast({
      title: "O'chirildi (Draft) 📝",
      description: `"${promo?.code}" qoralama holatiga qaytarildi`,
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const resetForm = () => {
    setNewCode("");
    setDescription("");
    setDiscountValue("");
    setDiscountType("percent");
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 30);
    setEndDate(defaultEnd.toISOString().split('T')[0]);
    setIsSpecificCategory(false);
    setSelectedCategories([]);
  };

  const handleCreate = () => {
    if (!newCode || !description || !discountValue || !startDate || !endDate) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive"
      });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast({
        title: "Xatolik",
        description: "Tugash sanasi boshlanish sanasidan oldin bo'lishi mumkin emas",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate code
    if (promocodes.some(p => p.code === newCode.toUpperCase())) {
      toast({
        title: "Xatolik",
        description: `"${newCode.toUpperCase()}" kodi allaqachon mavjud`,
        variant: "destructive"
      });
      return;
    }

    const newItem: Promocode = {
      id: `pc-new-${Date.now()}`,
      code: newCode.toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date(startDate).toISOString(),
      validUntil: new Date(endDate + "T23:59:59").toISOString(),
      status: 'draft', // ← Always starts as draft
      source: 'admin',
      applicableCategories: isSpecificCategory && selectedCategories.length > 0
        ? selectedCategories
        : undefined
    };

    setPromocodes(prev => [newItem, ...prev]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Qoralama yaratildi 📝",
      description: `"${newItem.code}" qoralama sifatida yaratildi. Faollashtirish uchun "Faollashtirish" tugmasini bosing.`,
      className: "bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800"
    });
  };

  // ─── Status badge helper ───
  const getStatusBadge = (status: Promocode['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-[10px] font-bold gap-1 px-2">
            <CheckCircle2 className="w-3 h-3" />
            Faol
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0 text-[10px] font-bold gap-1 px-2">
            <FileEdit className="w-3 h-3" />
            Qoralama
          </Badge>
        );
      case 'used':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-[10px] font-bold gap-1 px-2">
            <Check className="w-3 h-3" />
            Ishlatilgan
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-0 text-[10px] font-bold gap-1 px-2">
            <Clock className="w-3 h-3" />
            Muddati tugagan
          </Badge>
        );
    }
  };

  // ─── Status indicator color for card left border ───
  const getCardBorderColor = (status: Promocode['status']) => {
    switch (status) {
      case 'active': return 'border-l-emerald-500';
      case 'draft': return 'border-l-amber-400';
      case 'used': return 'border-l-blue-400';
      case 'expired': return 'border-l-gray-300 dark:border-l-gray-600';
    }
  };

  // ─── Filter tab config ───
  const filterTabs: { key: StatusFilter; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Barchasi", icon: null },
    { key: "active", label: "Faol", icon: <Zap className="w-3 h-3" /> },
    { key: "draft", label: "Qoralama", icon: <FileEdit className="w-3 h-3" /> },
    { key: "expired", label: "Eskirgan", icon: <Archive className="w-3 h-3" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-3 safe-top">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Promokodlar</h1>
              <p className="text-[10px] text-muted-foreground font-medium">
                {counts.active} faol · {counts.draft} qoralama · {counts.all} jami
              </p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5 rounded-xl shadow-md shadow-primary/20">
                <Plus className="w-4 h-4" />
                Yaratish
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  Yangi Promokod
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Yangi promokod <span className="font-bold text-amber-600">qoralama</span> sifatida yaratiladi. 
                  Uni faollashtirguningizcha foydalanuvchilarga ko'rinmaydi.
                </DialogDescription>
              </DialogHeader>

              {/* Draft notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                  Promokod yaratilgandan so'ng <span className="font-bold">qoralama</span> holatida bo'ladi. 
                  Foydalanuvchilar faqat <span className="font-bold">faollashtirilgan</span> promokodlardan foydalanishi mumkin.
                </p>
              </div>

              <div className="space-y-4 py-1">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Kod <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Masalan: SUMMER2026"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    className="font-mono font-bold tracking-wider uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Tavsif <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Qisqacha tavsif"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Chegirma turi</Label>
                    <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">
                          <div className="flex items-center gap-1.5">
                            <Percent className="w-3 h-3" /> Foiz (%)
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center gap-1.5">
                            <Banknote className="w-3 h-3" /> Summa (so'm)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Qiymati <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      placeholder={discountType === 'percent' ? "15" : "50000"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Boshlanish sanasi *</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Tugash sanasi *</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-semibold">Kategoriyalar bo'yicha cheklash</Label>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Faqat tanlangan kategoriyalarga tatbiq etiladi</p>
                    </div>
                    <Switch
                      checked={isSpecificCategory}
                      onCheckedChange={setIsSpecificCategory}
                    />
                  </div>

                  <AnimatePresence>
                    {isSpecificCategory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {CATEGORIES.map(cat => (
                            <div
                              key={cat}
                              onClick={() => toggleCategory(cat)}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                selectedCategories.includes(cat)
                                  ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                                  : "bg-card border-border text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {cat}
                              {selectedCategories.includes(cat) && <Check className="w-3 h-3" />}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }} className="flex-1">
                  Bekor qilish
                </Button>
                <Button onClick={handleCreate} className="flex-1 gap-1.5 shadow-md">
                  <FileEdit className="w-4 h-4" />
                  Qoralama yaratish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ─── Search ─── */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Promokod qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                statusFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${
                statusFilter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Promocode List ─── */}
      <div className="p-4 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredPromocodes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Tag className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {searchQuery ? "Hech narsa topilmadi" : "Bu statusda promokodlar yo'q"}
              </p>
            </motion.div>
          ) : (
            filteredPromocodes.map((promo, index) => (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
              >
                <Card className={`overflow-hidden border-l-[3px] ${getCardBorderColor(promo.status)} transition-all duration-200 hover:shadow-md ${
                  promo.status === 'draft' ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                }`}>
                  <div className="p-3.5">
                    {/* Top Row: Code + Status + Discount */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-black text-base tracking-wider text-foreground font-mono">
                            {promo.code}
                          </h3>
                          {getStatusBadge(promo.status)}
                          {promo.source === 'admin' && (
                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-primary/20 text-primary/70">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                          {promo.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className={`block font-black text-lg leading-none ${
                          promo.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' :
                          promo.status === 'draft' ? 'text-amber-600 dark:text-amber-400' :
                          'text-muted-foreground'
                        }`}>
                          {promo.discountType === 'percent' ? `-${promo.discountValue}%` : `-${promo.discountValue.toLocaleString()}`}
                        </span>
                        {promo.discountType === 'fixed' && (
                          <span className="text-[10px] text-muted-foreground">so'm</span>
                        )}
                      </div>
                    </div>

                    {/* Categories */}
                    {promo.applicableCategories && promo.applicableCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {promo.applicableCategories.map((cat, i) => (
                          <div key={i} className="flex items-center gap-0.5 text-[9px] bg-secondary/80 px-1.5 py-0.5 rounded-md text-secondary-foreground font-medium">
                            <Tag className="w-2.5 h-2.5" />
                            {cat}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted-foreground/60 italic flex items-center gap-1 mb-2.5">
                        <Tag className="w-2.5 h-2.5" /> Barcha kategoriyalar uchun
                      </div>
                    )}

                    {/* Bottom Row: Date + Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {promo.startDate 
                            ? `${new Date(promo.startDate).toLocaleDateString('uz-UZ')} - ${new Date(promo.validUntil).toLocaleDateString('uz-UZ')}`
                            : `${new Date(promo.validUntil).toLocaleDateString('uz-UZ')} gacha`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Copy */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-lg"
                          onClick={() => handleCopy(promo.code, promo.id)}
                        >
                          {copiedId === promo.id
                            ? <Check className="w-3.5 h-3.5 text-green-500" />
                            : <Copy className="w-3.5 h-3.5" />}
                        </Button>

                        {/* Activate / Deactivate */}
                        {promo.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 rounded-lg text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                            onClick={() => handleActivate(promo.id)}
                          >
                            <Zap className="w-3 h-3" />
                            Faollashtirish
                          </Button>
                        )}
                        {promo.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 rounded-lg text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 gap-1"
                            onClick={() => handleDeactivate(promo.id)}
                          >
                            <PowerOff className="w-3 h-3" />
                            O'chirish
                          </Button>
                        )}

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Promokodni o'chirish
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <span className="font-mono font-bold text-foreground">{promo.code}</span> promokodini
                                o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Bekor qilish</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(promo.id)}
                                className="bg-destructive hover:bg-destructive/90 rounded-xl"
                              >
                                O'chirish
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>

                  {/* Draft visual indicator banner */}
                  {promo.status === 'draft' && (
                    <div className="px-3.5 py-1.5 bg-amber-100/50 dark:bg-amber-900/20 border-t border-amber-200/30 dark:border-amber-800/20 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <EyeOff className="w-3 h-3 text-amber-600/70 dark:text-amber-400/70" />
                        <span className="text-[10px] text-amber-700/80 dark:text-amber-300/80 font-medium">
                          Foydalanuvchilarga ko'rinmaydi
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="h-5 px-2 text-[9px] rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm"
                        onClick={() => handleActivate(promo.id)}
                      >
                        Faollashtirish
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
};

export default AdminPromocodes;
