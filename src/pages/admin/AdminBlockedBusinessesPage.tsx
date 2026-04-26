import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Ban, Search, Eye, Download, XCircle, AlertTriangle, Clock, User, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BLOCK_REASONS = [
  { value: "spam", label: "Spam / Yolg'on reklama", icon: "🚫" },
  { value: "fraud", label: "Firibgarlik", icon: "⚠️" },
  { value: "abuse", label: "Mijozlarga yomon munosabat", icon: "😠" },
  { value: "fake", label: "Soxta profil", icon: "🎭" },
  { value: "policy", label: "Qoidalar buzilishi", icon: "📋" },
  { value: "other", label: "Boshqa sabab", icon: "❓" },
];

const admins = ["Sardor Karimov", "Malika Tursunova", "Aziz Rahimov", "Nodira Usmonova"];
const bizNames = ["Lola Beauty", "Diamond Salon", "Gold SPA", "Star Barbershop", "Nur Kosmetologiya", "Elite Style", "Orzu Salon", "Anor Beauty", "Rayhon SPA", "City Barbershop", "Smile Dental", "Fashion Studio", "Luxury Nails", "Grand Beauty", "Art Salon"];
const owners = ["Malika K.", "Aziz T.", "Barno A.", "Jamshid R.", "Dilnoza U.", "Sardor M.", "Nargiza O.", "Otabek F.", "Shahnoza B.", "Farhod S."];

function generateMockBlocked(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const reason = BLOCK_REASONS[i % BLOCK_REASONS.length];
    const blockedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const durationDays = [7, 14, 30, 0][i % 4];
    const daysSince = Math.floor((Date.now() - blockedAt.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: `block-${i + 1}`,
      name: bizNames[i % bizNames.length],
      owner: owners[i % owners.length],
      reason: reason.value,
      reasonLabel: reason.label,
      reasonIcon: reason.icon,
      note: "Bir nechta mijoz shikoyati asosida bloklandi.",
      blockedAt,
      daysSince,
      admin: admins[i % admins.length],
      durationDays,
      remainingDays: durationDays > 0 ? Math.max(0, durationDays - daysSince) : null,
      prevStatus: i % 3 === 0 ? "verified" : "approved",
      complaints: Math.floor(Math.random() * 5) + 1,
      history: i % 4 === 0 ? [
        { date: new Date(blockedAt.getTime() - 60 * 24 * 60 * 60 * 1000), reason: "Birinchi ogohlantirish", admin: admins[(i + 1) % admins.length] }
      ] : [],
    };
  });
}

const ALL_BLOCKED = generateMockBlocked(47);
const PAGE_SIZE = 20;

export default function AdminBlockedBusinessesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterReason, setFilterReason] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<any | null>(null);
  const [unblocking, setUnblocking] = useState(false);
  const [list, setList] = useState(ALL_BLOCKED);

  const filtered = useMemo(() => {
    return list.filter(b => {
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.owner.toLowerCase().includes(search.toLowerCase());
      const matchReason = filterReason === "all" || b.reason === filterReason;
      const matchFrom = !filterFrom || b.blockedAt >= new Date(filterFrom);
      const matchTo = !filterTo || b.blockedAt <= new Date(filterTo + "T23:59:59");
      return matchSearch && matchReason && matchFrom && matchTo;
    });
  }, [list, search, filterReason, filterFrom, filterTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleUnblock = () => {
    setUnblocking(true);
    setTimeout(() => {
      setList(prev => prev.filter(b => b.id !== detail.id));
      toast({ title: "Blokdan chiqarildi", description: `${detail.name} muvaffaqiyatli blokdan chiqarildi.` });
      setUnblocking(false);
      setDetail(null);
    }, 600);
  };

  const exportCSV = () => {
    const rows = [
      ["Biznes nomi", "Egasi", "Sabab", "Bloklangan vaqt", "Admin", "Kunlar"],
      ...filtered.map(b => [b.name, b.owner, b.reasonLabel, b.blockedAt.toLocaleDateString("uz-UZ"), b.admin, b.daysSince]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bloklangan_bizneslar.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV yuklandi" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center">
                <Ban className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Bloklangan Bizneslar</h1>
                <p className="text-sm text-muted-foreground">Barcha bloklangan bizneslarning to'liq ro'yxati</p>
              </div>
            </div>
            <Button onClick={exportCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> CSV yuklab olish
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Jami bloklangan", value: list.length, color: "bg-red-50 text-red-700" },
              { label: "Doimiy bloklangan", value: list.filter(b => b.durationDays === 0).length, color: "bg-rose-50 text-rose-700" },
              { label: "Vaqtinchalik", value: list.filter(b => b.durationDays > 0).length, color: "bg-orange-50 text-orange-700" },
              { label: "Filtrlangan", value: filtered.length, color: "bg-gray-100 text-gray-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`${s.color} rounded-xl p-3 text-center`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Biznes nomi yoki egasi..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 h-10 bg-white dark:bg-gray-900 rounded-xl" />
          </div>
          <Select value={filterReason} onValueChange={v => { setFilterReason(v); setPage(1); }}>
            <SelectTrigger className="w-52 h-10 rounded-xl bg-white dark:bg-gray-900">
              <SelectValue placeholder="Sabab bo'yicha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha sabablar</SelectItem>
              {BLOCK_REASONS.map(r => <SelectItem key={r.value} value={r.value}>{r.icon} {r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" value={filterFrom} onChange={e => { setFilterFrom(e.target.value); setPage(1); }}
            className="w-44 h-10 rounded-xl bg-white dark:bg-gray-900" title="Dan" />
          <Input type="date" value={filterTo} onChange={e => { setFilterTo(e.target.value); setPage(1); }}
            className="w-44 h-10 rounded-xl bg-white dark:bg-gray-900" title="Gacha" />
          {(search || filterReason !== "all" || filterFrom || filterTo) && (
            <Button variant="ghost" size="sm" className="h-10 text-muted-foreground"
              onClick={() => { setSearch(""); setFilterReason("all"); setFilterFrom(""); setFilterTo(""); setPage(1); }}>
              <XCircle className="w-4 h-4 mr-1" /> Tozalash
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60">
                {["Biznes", "Egasi", "Sabab", "Bloklangan vaqt", "Admin", "Kunlar", "Muddat", ""].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">Hech narsa topilmadi</td></tr>
              )}
              {pageItems.map((b, idx) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-red-50/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <Ban className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm font-semibold">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-muted-foreground">{b.owner}</span></td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full">
                      {b.reasonIcon} {b.reasonLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{b.blockedAt.toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{b.blockedAt.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{b.admin}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[11px] bg-orange-50 text-orange-700 border-orange-200">
                      {b.daysSince} kun
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {b.durationDays === 0
                      ? <Badge variant="outline" className="text-[11px] bg-red-50 text-red-700 border-red-200">Doimiy</Badge>
                      : b.remainingDays !== null && b.remainingDays > 0
                        ? <Badge variant="outline" className="text-[11px] bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />{b.remainingDays} kun qoldi</Badge>
                        : <Badge variant="outline" className="text-[11px] bg-gray-100 text-gray-600 border-gray-200">Muddat tugagan</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setDetail(b)}>
                      <Eye className="w-3 h-3" /> Tafsilotlar
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} ta
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Oldingi</Button>
              <span className="text-sm text-muted-foreground flex items-center px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Keyingi</Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detail} onOpenChange={open => !open && setDetail(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Bloklash tafsilotlari
            </DialogTitle>
            <DialogDescription>{detail?.name} — bloklash tarixi va ma'lumotlari</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-red-100 text-red-700 border-red-200 border">{detail.reasonIcon} {detail.reasonLabel}</Badge>
                <Badge variant="outline" className="bg-gray-50">{detail.prevStatus === "verified" ? "✅ Oldingi: Verifikatsiyalangan" : "✅ Oldingi: Tasdiqlangan"}</Badge>
                {detail.durationDays === 0
                  ? <Badge className="bg-red-600 text-white">Doimiy blok</Badge>
                  : <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">{detail.durationDays} kunlik blok</Badge>
                }
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: Calendar, label: "Bloklangan sana", val: detail.blockedAt.toLocaleString("uz-UZ") },
                  { icon: User, label: "Bloklagan admin", val: detail.admin },
                  { icon: Clock, label: "Bloklangan kunlar", val: `${detail.daysSince} kun` },
                  { icon: AlertTriangle, label: "Shikoyatlar soni", val: `${detail.complaints} ta` },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wide">{label}</p>
                    </div>
                    <p className="font-semibold">{val}</p>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs font-semibold text-orange-700 mb-1">Izoh:</p>
                <p className="text-sm text-orange-900">{detail.note}</p>
              </div>

              {/* Remaining time */}
              {detail.durationDays > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-yellow-800">Qolgan muddat:</span>
                  <span className="font-bold text-yellow-900">
                    {detail.remainingDays > 0 ? `${detail.remainingDays} kun` : "Muddat tugagan"}
                  </span>
                </div>
              )}

              {/* Block history */}
              {detail.history.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Bloklash tarixi:</p>
                  {detail.history.map((h: any, i: number) => (
                    <div key={i} className="text-xs p-2 bg-gray-50 rounded border mb-1">
                      <span className="font-medium">{h.date.toLocaleDateString("uz-UZ")}</span>
                      <span className="text-muted-foreground mx-1">—</span>
                      <span>{h.reason}</span>
                      <span className="text-muted-foreground ml-1">({h.admin})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDetail(null)}>Yopish</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={unblocking}
              onClick={handleUnblock}>
              {unblocking ? "Chiqarilmoqda..." : "Blokdan chiqarish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
