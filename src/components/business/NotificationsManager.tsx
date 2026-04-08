import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Send, Trash2, Users, Loader2, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationsManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    target_audience: string;
    sent_at: string;
    recipient_count: number;
}

const NotificationsManager = ({ open, onOpenChange }: NotificationsManagerProps) => {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        target_audience: "all"
    });

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("business_id", profile?.id)
                .order("sent_at", { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error("Fetch error:", error);
            toast({
                title: "Xato",
                description: "Bildirishnomalar yuklanmadi",
                variant: "destructive"
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast({
                title: "Xato",
                description: "Sarlavhani kiriting",
                variant: "destructive"
            });
            return;
        }

        if (!formData.message.trim()) {
            toast({
                title: "Xato",
                description: "Xabarni kiriting",
                variant: "destructive"
            });
            return;
        }

        try {
            setLoading(true);

            // Get recipient count (simplified - you can enhance this with actual client counting)
            const recipientCount = formData.target_audience === "all" ? 100 : 50;

            const { error } = await supabase
                .from("notifications")
                .insert({
                    business_id: profile?.id,
                    title: formData.title,
                    message: formData.message,
                    target_audience: formData.target_audience,
                    recipient_count: recipientCount,
                    sent_at: new Date().toISOString()
                });

            if (error) throw error;

            toast({
                title: "Muvaffaqiyatli",
                description: "Bildirishnoma yuborildi"
            });

            // Reset form
            setFormData({
                title: "",
                message: "",
                target_audience: "all"
            });
            setShowForm(false);
            fetchNotifications();
        } catch (error) {
            console.error("Send error:", error);
            toast({
                title: "Xato",
                description: "Bildirishnoma yuborilmadi. Qaytadan urinib ko'ring",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;

            toast({
                title: "Muvaffaqiyatli",
                description: "Bildirishnoma o'chirildi"
            });

            fetchNotifications();
        } catch (error) {
            console.error("Delete error:", error);
            toast({
                title: "Xato",
                description: "Bildirishnoma o'chirilmadi",
                variant: "destructive"
            });
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Bildirishnomalar
                            </DialogTitle>
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                size="sm"
                                className="gap-2"
                            >
                                {showForm ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        Yopish
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Yangi
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="px-6 pb-6 space-y-6">
                        {/* Notification Form */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="p-4 bg-muted/50 border-2 border-primary/20">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Sarlavha *</Label>
                                                <Input
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Masalan: Yangi aksiya boshlandi!"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Xabar *</Label>
                                                <Textarea
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                                    placeholder="Bildirishnoma matni..."
                                                    rows={4}
                                                    className="resize-none"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Kimga yuborish</Label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={formData.target_audience === "all" ? "default" : "outline"}
                                                        onClick={() => setFormData(prev => ({ ...prev, target_audience: "all" }))}
                                                        className="flex-1"
                                                    >
                                                        <Users className="w-4 h-4 mr-2" />
                                                        Barcha mijozlar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={formData.target_audience === "active" ? "default" : "outline"}
                                                        onClick={() => setFormData(prev => ({ ...prev, target_audience: "active" }))}
                                                        className="flex-1"
                                                    >
                                                        <Users className="w-4 h-4 mr-2" />
                                                        Faol mijozlar
                                                    </Button>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Yuborilmoqda...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Yuborish
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Notifications List */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                                Yuborilgan bildirishnomalar
                            </h3>

                            {notifications.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground">Hali bildirishnomalar yo'q</p>
                                    <p className="text-sm text-muted-foreground/70 mt-1">
                                        Mijozlaringizga birinchi xabar yuboring
                                    </p>
                                </Card>
                            ) : (
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {notifications.map((notification) => (
                                        <Card key={notification.id} className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {notification.target_audience === "all" ? "Hammaga" : "Faollarga"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {notification.recipient_count} kishi
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {format(new Date(notification.sent_at), "dd.MM.yyyy HH:mm")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(notification.id)}
                                                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bildirishnomani o'chirish</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu bildirishnoma butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-rose-600 hover:bg-rose-700"
                        >
                            O'chirish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default NotificationsManager;
