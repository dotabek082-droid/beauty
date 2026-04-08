import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddOfflineClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddClient: (client: { fullName: string; phone: string }) => void;
}

export function AddOfflineClientDialog({
    open,
    onOpenChange,
    onAddClient
}: AddOfflineClientDialogProps) {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast({
                title: "Xatolik",
                description: "Iltimos, mijoz ismini kiritigan",
                variant: "destructive"
            });
            return;
        }

        onAddClient({
            fullName,
            phone: phone || "Telefon yo'q"
        });

        toast({
            title: "Mijoz qo'shildi ✅",
            description: `${fullName} muvaffaqiyatli qo'shildi`,
        });

        // Reset and close
        setFullName("");
        setPhone("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Yangi mijoz qo'shish
                    </DialogTitle>
                    <DialogDescription>
                        Ilovadan foydalana olmaydigan mijozlar uchun
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Ism va Familiya <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="name"
                                placeholder="Masalan: Karimova Zilola"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="pl-9"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefon raqam (ixtiyoriy)</Label>
                        <Input
                            id="phone"
                            placeholder="+998 90 123 45 67"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Bekor qilish
                        </Button>
                        <Button type="submit">
                            Qo'shish
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
