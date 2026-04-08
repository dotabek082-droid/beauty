import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Shield, MoreVertical, Ban, CheckCircle, ChevronLeft, Eye, User, Mail, Calendar, Phone, Coins, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockUsers = [
    { id: 1, name: "Aziz Karimov", email: "aziz@example.com", phone: "+998 90 123 45 67", role: "user", status: "active", joined: "2024-01-15", trustScore: 85, coins: 1250, lastActive: new Date(Date.now() - 1000 * 60 * 2).toISOString() }, // 2 mins ago (Online)
    { id: 2, name: "Malika Tursunova", email: "malika@example.com", phone: "+998 90 987 65 43", role: "user", status: "active", joined: "2024-01-16", trustScore: 92, coins: 3400, lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString() }, // 45 mins ago
    { id: 3, name: "Bekzod Aliyev", email: "bekzod@example.com", phone: "+998 93 111 22 33", role: "business_owner", status: "active", joined: "2024-01-17", trustScore: 100, coins: 5000, lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() }, // 5 hours ago
    { id: 4, name: "Dilnoza Rahimova", email: "dilnoza@example.com", phone: "+998 97 444 55 66", role: "user", status: "blocked", joined: "2024-01-18", trustScore: 45, coins: 100, lastActive: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() }, // 25 hours ago
    { id: 5, name: "Jamshid Toshmatov", email: "jamshid@example.com", phone: "+998 99 777 88 99", role: "user", status: "active", joined: "2024-01-19", trustScore: 70, coins: 850, lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() }, // 3 days ago
];

const AdminUsers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(mockUsers);
    const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
    const { toast } = useToast();

    // Helper to format last active time
    const formatLastActive = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Noma'lum"; // Handle invalid date

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Hozirgina";
        if (diffInSeconds < 300) return "Online"; // Less than 5 mins
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`;
        if (diffInSeconds < 172800) return "Kecha";

        return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
    };

    const isOnline = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false; // Handle invalid date

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        return diffInSeconds < 300; // 5 mins threshold for online
    };

    const handleStatusChange = (userId: number, newStatus: string) => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        toast({
            title: "Status o'zgartirildi",
            description: `Foydalanuvchi statusi ${newStatus} ga o'zgartirildi`,
        });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Foydalanuvchilar</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Ism yoki email orqali qidirish..."
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="p-4 space-y-3">
                {filteredUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    onClick={() => setSelectedUser(user)}
                                    className={`relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white cursor-pointer hover:opacity-80 transition-opacity
                  ${user.status === 'blocked' ? 'bg-gray-400' : 'bg-primary'}`}>
                                    {user.name.charAt(0)}
                                    {isOnline(user.lastActive) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{user.name}</p>
                                        {!isOnline(user.lastActive) && (
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatLastActive(user.lastActive)}
                                            </span>
                                        )}
                                        {isOnline(user.lastActive) && (
                                            <span className="text-[10px] text-green-600 font-medium">
                                                Online
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span className="truncate max-w-[120px]">{user.email}</span>
                                        <span className="flex items-center gap-0.5 text-amber-600 font-medium bg-amber-50 px-1.5 rounded">
                                            <Coins className="w-3 h-3" />
                                            {user.coins}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${user.role === 'business_owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role === 'business_owner' ? 'Biznes' : 'Mijoz'}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {user.status === 'active' ? (
                                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'blocked')} className="text-red-600">
                                                <Ban className="w-4 h-4 mr-2" />
                                                Bloklash
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')} className="text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Faollashtirish
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* User Detail Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Foydalanuvchi ma'lumotlari</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-xl relative overflow-hidden">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white
                        ${selectedUser.status === 'blocked' ? 'bg-gray-400' : 'bg-primary'}`}>
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div className="z-10">
                                    <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedUser.role === 'business_owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {selectedUser.role === 'business_owner' ? 'Biznes Egasi' : 'Mijoz'}
                                        </span>
                                        {isOnline(selectedUser.lastActive) && (
                                            <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                Online
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Oxirgi faollik</p>
                                        <p className={`font-medium ${isOnline(selectedUser.lastActive) ? 'text-green-600' : ''}`}>
                                            {formatLastActive(selectedUser.lastActive)}
                                            {isOnline(selectedUser.lastActive) ? '' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg bg-amber-50/50 border-amber-200">
                                    <Coins className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tanga balansi</p>
                                        <p className="font-bold text-amber-700">{selectedUser.coins} tanga</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="font-medium">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Telefon</p>
                                        <p className="font-medium">{selectedUser.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Ro'yxatdan o'tgan sana</p>
                                        <p className="font-medium">{selectedUser.joined}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Shield className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Ishonch reytingi</p>
                                        <p className="font-medium">{selectedUser.trustScore} ball</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button variant="outline" onClick={() => setSelectedUser(null)}>Yopish</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
