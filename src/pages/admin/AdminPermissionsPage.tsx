import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Edit2, Plus, Check, X, Users, Building2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Permission {
    key: string;
    label: string;
    description: string;
}

interface Role {
    id: string;
    name: string;
    nameUz: string;
    color: string;
    icon: any;
    usersCount: number;
    permissions: string[];
}

const ALL_PERMISSIONS: Permission[] = [
    { key: "users.view", label: "Foydalanuvchilarni ko'rish", description: "Foydalanuvchilar ro'yxatini ko'rish" },
    { key: "users.edit", label: "Foydalanuvchilarni tahrirlash", description: "Foydalanuvchi ma'lumotlarini o'zgartirish" },
    { key: "users.delete", label: "Foydalanuvchilarni o'chirish", description: "Foydalanuvchilarni tizimdan o'chirish" },
    { key: "businesses.view", label: "Bizneslarni ko'rish", description: "Bizneslar ro'yxatini ko'rish" },
    { key: "businesses.approve", label: "Bizneslarni tasdiqlash", description: "Yangi bizneslarni tasdiqlash/rad etish" },
    { key: "businesses.edit", label: "Bizneslarni tahrirlash", description: "Biznes ma'lumotlarini o'zgartirish" },
    { key: "services.view", label: "Xizmatlarni ko'rish", description: "Xizmat turlarini ko'rish" },
    { key: "services.approve", label: "Xizmatlarni tasdiqlash", description: "Xizmat turlarini tasdiqlash/rad etish" },
    { key: "promotions.manage", label: "Aksiyalarni boshqarish", description: "Aksiyalarni yaratish, tahrirlash, o'chirish" },
    { key: "payments.view", label: "To'lovlarni ko'rish", description: "To'lovlar tarixini ko'rish" },
    { key: "reviews.moderate", label: "Sharhlarni moderatsiya", description: "Sharhlarni o'chirish va boshqarish" },
    { key: "settings.manage", label: "Sozlamalarni boshqarish", description: "Tizim sozlamalarini o'zgartirish" },
    { key: "handbook.manage", label: "Spravochniklarni boshqarish", description: "Viloyat, tuman, ko'cha ma'lumotlarini boshqarish" },
    { key: "admin.manage", label: "Administratsiya", description: "Rollar va huquqlarni boshqarish" },
];

const AdminPermissionsPage = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editPermissions, setEditPermissions] = useState<string[]>([]);

    const [roles, setRoles] = useState<Role[]>([
        {
            id: "admin", name: "admin", nameUz: "Administrator",
            color: "from-red-500 to-rose-600", icon: Crown, usersCount: 2,
            permissions: ALL_PERMISSIONS.map(p => p.key),
        },
        {
            id: "moderator", name: "moderator", nameUz: "Moderator",
            color: "from-blue-500 to-indigo-600", icon: ShieldCheck, usersCount: 5,
            permissions: ["users.view", "businesses.view", "businesses.approve", "services.view", "services.approve", "reviews.moderate", "handbook.manage"],
        },
        {
            id: "business_owner", name: "business_owner", nameUz: "Biznes egasi",
            color: "from-amber-500 to-orange-600", icon: Building2, usersCount: 56,
            permissions: ["services.view"],
        },
        {
            id: "client", name: "client", nameUz: "Mijoz",
            color: "from-emerald-500 to-green-600", icon: Users, usersCount: 1234,
            permissions: [],
        },
    ]);

    const openEditDialog = (role: Role) => {
        setSelectedRole(role);
        setEditPermissions([...role.permissions]);
        setEditDialogOpen(true);
    };

    const togglePermission = (key: string) => {
        setEditPermissions(prev =>
            prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
        );
    };

    const handleSavePermissions = () => {
        if (!selectedRole) return;
        setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: editPermissions } : r));
        setEditDialogOpen(false);
        toast({ title: "Saqlandi", description: `${selectedRole.nameUz} huquqlari yangilandi`, className: "bg-green-600 text-white border-green-700" });
    };

    const permissionGroups: { title: string; keys: string[] }[] = [
        { title: "Foydalanuvchilar", keys: ["users.view", "users.edit", "users.delete"] },
        { title: "Bizneslar", keys: ["businesses.view", "businesses.approve", "businesses.edit"] },
        { title: "Xizmatlar", keys: ["services.view", "services.approve"] },
        { title: "Marketing", keys: ["promotions.manage"] },
        { title: "Moliya", keys: ["payments.view"] },
        { title: "Kontent", keys: ["reviews.moderate"] },
        { title: "Tizim", keys: ["settings.manage", "handbook.manage", "admin.manage"] },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        Rollar va Huquqlar
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
                        Tizim rollari va ularning huquqlarini boshqarish
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-6">
                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {roles.map((role, idx) => (
                        <motion.div key={role.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}>
                                            <role.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">{role.nameUz}</h3>
                                            <p className="text-xs text-muted-foreground font-mono">{role.name}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" onClick={() => openEditDialog(role)}>
                                        <Edit2 className="w-3 h-3 mr-1.5" /> Huquqlar
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{role.usersCount} foydalanuvchi</span>
                                    <span className="text-muted-foreground">{role.permissions.length}/{ALL_PERMISSIONS.length} huquq</span>
                                </div>

                                {/* Permission bar */}
                                <div className="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(role.permissions.length / ALL_PERMISSIONS.length) * 100}%` }}
                                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                                        className={`h-full bg-gradient-to-r ${role.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Permission Matrix Table */}
                <h2 className="text-lg font-bold text-foreground mb-4">Huquqlar matritsasi</h2>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50">
                                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 min-w-[200px]">Huquq</th>
                                {roles.map(r => (
                                    <th key={r.id} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{r.nameUz}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ALL_PERMISSIONS.map((perm) => (
                                <tr key={perm.key} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/30">
                                    <td className="px-5 py-2.5">
                                        <p className="text-sm font-medium">{perm.label}</p>
                                        <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                                    </td>
                                    {roles.map(r => (
                                        <td key={r.id} className="text-center px-4 py-2.5">
                                            {r.permissions.includes(perm.key)
                                                ? <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                                                : <X className="w-4 h-4 text-gray-300 mx-auto" />
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Permissions Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-violet-600" />
                            {selectedRole?.nameUz} huquqlari
                        </DialogTitle>
                        <DialogDescription>Huquqlarni yoqish yoki o'chirish uchun tugmalarni bosing</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-2">
                        {permissionGroups.map(group => (
                            <div key={group.title}>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{group.title}</p>
                                <div className="space-y-2">
                                    {group.keys.map(key => {
                                        const perm = ALL_PERMISSIONS.find(p => p.key === key);
                                        if (!perm) return null;
                                        return (
                                            <div key={key} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                                                <div>
                                                    <p className="text-sm font-medium">{perm.label}</p>
                                                    <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                                                </div>
                                                <Switch
                                                    checked={editPermissions.includes(key)}
                                                    onCheckedChange={() => togglePermission(key)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSavePermissions} className="bg-violet-600 hover:bg-violet-700">Saqlash</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPermissionsPage;
