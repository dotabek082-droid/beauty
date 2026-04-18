import { useState } from "react";
import { motion } from "framer-motion";
import { History, Search, Filter, Monitor, Smartphone, Globe, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface LoginEntry {
    id: string;
    userName: string;
    userRole: string;
    phone: string;
    ipAddress: string;
    device: string;
    browser: string;
    status: 'success' | 'failed' | 'blocked';
    timestamp: Date;
    location: string;
}

const AdminLoginHistoryPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterRole, setFilterRole] = useState("all");

    const entries: LoginEntry[] = [
        { id: "1", userName: "Admin Adminov", userRole: "admin", phone: "+998900000001", ipAddress: "192.168.1.100", device: "Desktop", browser: "Chrome 120", status: "success", timestamp: new Date("2024-01-21T10:30:00"), location: "Toshkent" },
        { id: "2", userName: "Baraka Beauty", userRole: "owner", phone: "+998900000002", ipAddress: "10.0.0.55", device: "Mobile", browser: "Safari 17", status: "success", timestamp: new Date("2024-01-21T10:15:00"), location: "Toshkent" },
        { id: "3", userName: "Noma'lum", userRole: "-", phone: "+998901234567", ipAddress: "203.45.67.89", device: "Desktop", browser: "Firefox 121", status: "failed", timestamp: new Date("2024-01-21T09:45:00"), location: "Samarqand" },
        { id: "4", userName: "Aziza Karimova", userRole: "client", phone: "+998900000003", ipAddress: "172.16.0.12", device: "Mobile", browser: "Chrome Mobile 120", status: "success", timestamp: new Date("2024-01-21T09:30:00"), location: "Buxoro" },
        { id: "5", userName: "Noma'lum", userRole: "-", phone: "+998909999999", ipAddress: "45.67.89.123", device: "Desktop", browser: "Chrome 119", status: "blocked", timestamp: new Date("2024-01-21T09:00:00"), location: "Nomalum" },
        { id: "6", userName: "Moderator Aliyev", userRole: "moderator", phone: "+998901112233", ipAddress: "192.168.1.105", device: "Desktop", browser: "Edge 120", status: "success", timestamp: new Date("2024-01-21T08:45:00"), location: "Toshkent" },
        { id: "7", userName: "Nilufar Salon", userRole: "owner", phone: "+998907778899", ipAddress: "10.0.1.200", device: "Mobile", browser: "Chrome Mobile 119", status: "success", timestamp: new Date("2024-01-20T22:15:00"), location: "Farg'ona" },
        { id: "8", userName: "Noma'lum", userRole: "-", phone: "+998900000001", ipAddress: "185.12.34.56", device: "Desktop", browser: "Chrome 120", status: "failed", timestamp: new Date("2024-01-20T20:30:00"), location: "Rossiya" },
        { id: "9", userName: "Admin Adminov", userRole: "admin", phone: "+998900000001", ipAddress: "192.168.1.100", device: "Desktop", browser: "Chrome 120", status: "success", timestamp: new Date("2024-01-20T18:00:00"), location: "Toshkent" },
        { id: "10", userName: "Noma'lum", userRole: "-", phone: "+998900000002", ipAddress: "91.22.33.44", device: "Mobile", browser: "Unknown", status: "blocked", timestamp: new Date("2024-01-20T15:20:00"), location: "Xitoy" },
    ];

    const statusConfig = {
        success: { label: "Muvaffaqiyatli", icon: CheckCircle, class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        failed: { label: "Xatolik", icon: AlertTriangle, class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        blocked: { label: "Bloklangan", icon: Shield, class: "bg-red-50 text-red-700 border-red-200" },
    };

    const roleConfig: Record<string, string> = {
        admin: "bg-red-50 text-red-700 border-red-200",
        moderator: "bg-blue-50 text-blue-700 border-blue-200",
        owner: "bg-amber-50 text-amber-700 border-amber-200",
        client: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "-": "bg-gray-100 text-gray-500 border-gray-200",
    };

    const filtered = entries
        .filter(e => filterStatus === "all" || e.status === filterStatus)
        .filter(e => filterRole === "all" || e.userRole === filterRole)
        .filter(e =>
            e.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.phone.includes(searchQuery) ||
            e.ipAddress.includes(searchQuery)
        );

    const stats = {
        total: entries.length,
        success: entries.filter(e => e.status === "success").length,
        failed: entries.filter(e => e.status === "failed").length,
        blocked: entries.filter(e => e.status === "blocked").length,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-gray-800 flex items-center justify-center">
                            <History className="w-5 h-5 text-white" />
                        </div>
                        Kirish Tarixi
                    </h1>
                    <p className="text-sm text-muted-foreground ml-[52px]">Tizimga kirish urinishlarining to'liq tarixi</p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mt-5">
                        {[
                            { label: "Jami", value: stats.total, color: "bg-gray-100 text-gray-700" },
                            { label: "Muvaffaqiyatli", value: stats.success, color: "bg-emerald-50 text-emerald-700" },
                            { label: "Xatolik", value: stats.failed, color: "bg-yellow-50 text-yellow-700" },
                            { label: "Bloklangan", value: stats.blocked, color: "bg-red-50 text-red-700" },
                        ].map((stat, i) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className={`${stat.color} rounded-xl p-3 text-center`}>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs font-medium opacity-70">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Ism, telefon yoki IP bo'yicha qidirish..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-11 bg-white dark:bg-gray-900 rounded-xl" />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px] h-11 rounded-xl bg-white dark:bg-gray-900">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            <SelectItem value="success">Muvaffaqiyatli</SelectItem>
                            <SelectItem value="failed">Xatolik</SelectItem>
                            <SelectItem value="blocked">Bloklangan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-[160px] h-11 rounded-xl bg-white dark:bg-gray-900">
                            <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="owner">Biznes egasi</SelectItem>
                            <SelectItem value="client">Mijoz</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50">
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Foydalanuvchi</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Rol</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">IP Manzil</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Qurilma</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Joylashuv</th>
                                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((entry, idx) => {
                                const sCfg = statusConfig[entry.status];
                                return (
                                    <motion.tr key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                                        className={`border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 transition-colors ${entry.status === 'blocked' ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-5 py-3">
                                            <p className="text-sm font-medium">{entry.userName}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{entry.phone}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={`text-[10px] ${roleConfig[entry.userRole]}`}>
                                                {entry.userRole === '-' ? 'Noma\'lum' : entry.userRole}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-mono text-muted-foreground">{entry.ipAddress}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {entry.device === 'Mobile' ? <Smartphone className="w-3 h-3 text-muted-foreground" /> : <Monitor className="w-3 h-3 text-muted-foreground" />}
                                                <span className="text-xs text-muted-foreground">{entry.browser}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Globe className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">{entry.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant="outline" className={`text-[10px] ${sCfg.class}`}>
                                                {sCfg.label}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <p className="text-xs text-muted-foreground">{entry.timestamp.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}</p>
                                            <p className="text-xs font-mono text-muted-foreground">{entry.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginHistoryPage;
