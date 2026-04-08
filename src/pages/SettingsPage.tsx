import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Globe,
  Trash2,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

interface Settings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
}

import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isRole } = useAuth();
  const isAdmin = isRole("admin");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: "uz",
  });
  
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Sozlama saqlandi");
  };

  const handleDeleteAccount = () => {
    toast.error("Hisob o'chirildi");
    setDeleteDialogOpen(false);
    navigate("/auth");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Yangi parollar mos kelmadi");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Parol kamida 6 belgidan iborat bo'lishi kerak");
      return;
    }
    
    setPasswordLoading(true);
    // Mock API call
    setTimeout(() => {
      setPasswordLoading(false);
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      setPasswordDialogOpen(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - Hidden for Admin */}
      {!isAdmin && (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-3 p-4 safe-top">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Sozlamalar</h1>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-8">
        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-widest ml-2">
            <Bell className="w-4 h-4 text-violet-500" />
            Bildirishnomalar
          </h2>
          <Card className="p-5 md:p-6 space-y-6 shadow-sm border-border/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Push bildirishnomalar</Label>
                <p className="text-xs text-muted-foreground">Telefonga bildirishnoma olish</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(v) => updateSetting("pushNotifications", v)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Email bildirishnomalar</Label>
                <p className="text-xs text-muted-foreground">Emailga xabar olish</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(v) => updateSetting("emailNotifications", v)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">SMS bildirishnomalar</Label>
                <p className="text-xs text-muted-foreground">Telefon raqamingizga SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(v) => updateSetting("smsNotifications", v)}
              />
            </div>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-widest ml-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Tashqi Ko'rinish
            </h2>
            <Card className="p-5 md:p-6 space-y-6 shadow-sm border-border/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Qorong'i rejim
                  </Label>
                  <p className="text-xs text-muted-foreground">Tungi mavzu</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(v) => updateSetting("darkMode", v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Til
                  </Label>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(v) => updateSetting("language", v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbek</SelectItem>
                    <SelectItem value="kaa">Qaraqalpaq</SelectItem>
                    <SelectItem value="kk">Qazaqsha</SelectItem>
                    <SelectItem value="ky">Kyrgyzcha</SelectItem>
                    <SelectItem value="tg">Tojikcha</SelectItem>
                    <SelectItem value="tk">Turkmencha</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-widest ml-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Xavfsizlik
            </h2>
            <Card className="p-5 md:p-6 space-y-6 shadow-sm border-border/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" /> Parolni o'zgartirish
                  </Label>
                  <p className="text-xs text-muted-foreground">Hisobingiz xavfsizligini ta'minlang</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  O'zgartirish
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xs font-bold text-destructive mb-3 flex items-center gap-2 uppercase tracking-widest ml-2">
              <Trash2 className="w-4 h-4" />
              Xavfli Zona
            </h2>
            <Card className="p-5 md:p-6 border-destructive/20 bg-destructive/5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium text-destructive">Hisobni o'chirish</Label>
                  <p className="text-xs text-muted-foreground">
                    Barcha ma'lumotlar qaytarib bo'lmaydigan qilib o'chiriladi
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  O'chirish
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hisobni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham hisobingizni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi va barcha
              ma'lumotlaringiz yo'qoladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ha, o'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Parolni o'zgartirish</DialogTitle>
            <DialogDescription>
              Yangi parolingizni kiriting va tasdiqlang.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="old">Eski parol</Label>
              <div className="relative">
                <Input
                  id="old"
                  type={showPassword.old ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, oldPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => ({ ...p, old: !p.old }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">Yangi parol</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Parolni tasdiqlang</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={passwordLoading}>
              {passwordLoading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
