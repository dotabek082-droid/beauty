import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Home, Briefcase, Plus, Edit2, Trash2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import AddressDialog from "@/components/client/AddressDialog";

interface Address {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  address: string;
  landmark?: string;
  isDefault: boolean;
  lat?: number;
  lng?: number;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Asosiy",
    type: "home",
    address: "Toshkent sh., Chilonzor tumani, 10-mavze, 25-uy, 42-xonadon",
    landmark: "Metro Chilonzor yaqinida",
    isDefault: true,
    lat: 41.2858,
    lng: 69.2040 // Mock Chilonzor coords
  },
];

const AddressesPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const getTypeIcon = (type: Address["type"]) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      default:
        return MapPin;
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Asosiy manzil o'zgartirildi");
  };

  const handleDeleteClick = (id: string) => {
    setSelectedAddressId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAddressId) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== selectedAddressId));
      toast.success("Manzil o'chirildi");
    }
    setDeleteDialogOpen(false);
    setSelectedAddressId(null);
  };

  const handleAddClick = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSaveAddress = (data: Partial<Address>) => {
    // If the new/updated address is set as default, we must unset others
    const shouldBeDefault = data.isDefault;

    if (editingAddress) {
      setAddresses(prev => prev.map(addr => {
        if (addr.id === editingAddress.id) {
          return { ...addr, ...data } as Address;
        }
        // If we are setting the current one as default, unset others.
        // If we are NOT setting the current one as default, leave others alone (unless they were already default).
        // Actually, if we set this one to default, all others become false.
        if (shouldBeDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }));
      toast.success("Manzil yangilandi");
    } else {
      // Create new
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        label: data.label || "Yangi manzil",
        type: data.type || "home",
        address: data.address || "",
        landmark: data.landmark,
        isDefault: shouldBeDefault || addresses.length === 0, // Default if requested OR if it's the first one
        lat: data.lat,
        lng: data.lng
      };

      setAddresses(prev => {
        let newRecs = [...prev];
        if (newAddress.isDefault) {
          newRecs = newRecs.map(a => ({ ...a, isDefault: false }));
        }
        return [...newRecs, newAddress];
      });
      toast.success("Yangi manzil qo'shildi");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4 safe-top">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Manzillar</h1>
              <p className="text-xs text-muted-foreground">
                {addresses.length} ta saqlangan manzil
              </p>
            </div>
          </div>
          <Button variant="coral" size="sm" onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-1" />
            Qo'shish
          </Button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="p-4 space-y-3">
        {addresses.map((address, index) => {
          const TypeIcon = getTypeIcon(address.type);
          return (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 ${address.isDefault ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${address.isDefault ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}
                  >
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{address.label}</h3>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                          Asosiy
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{address.address}</p>
                    {address.landmark && (
                      <p className="text-xs text-muted-foreground/70">📍 {address.landmark}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Asosiy qilish
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(address)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(address.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSave={handleSaveAddress}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Manzilni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu manzilni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default AddressesPage;
