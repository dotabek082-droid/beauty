import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PhotoGalleryEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    photos: string[];
    businessId: string;
    onSuccess: () => void;
    onSave?: (photos: string[]) => Promise<void>;
}

const PhotoGalleryEditDialog = ({ open, onOpenChange, photos, businessId, onSuccess, onSave }: PhotoGalleryEditDialogProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [localPhotos, setLocalPhotos] = useState<string[]>(photos || []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (!file.type.startsWith('image/')) {
            toast({ title: "Xatolik", description: "Faqat rasmlarni yuklash mumkin", variant: "destructive" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Xatolik", description: "Rasm hajmi 5MB dan oshmasligi kerak", variant: "destructive" });
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${businessId}/${Date.now()}.${fileExt}`;
            const filePath = `business_photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery') // Assuming 'gallery' bucket exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            // Add to array
            const newPhotos = [...localPhotos, publicUrl];
            setLocalPhotos(newPhotos);

            // Update database
            await updatePhotosInDb(newPhotos);

            toast({ title: "Muvaffaqiyatli", description: "Rasm yuklandi" });
        } catch (error) {
            console.error('Upload error:', error);
            toast({ title: "Xatolik", description: "Rasm yuklashda xatolik", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (indexToDelete: number) => {
        // confirm
        if (!confirm("Bu rasmni o'chirmoqchimisiz?")) return;

        const newPhotos = localPhotos.filter((_, index) => index !== indexToDelete);
        setLocalPhotos(newPhotos);

        setLoading(true);
        try {
            await updatePhotosInDb(newPhotos);
            toast({ title: "Muvaffaqiyatli", description: "Rasm o'chirildi" });
        } catch (error) {
            console.error('Delete error:', error);
            toast({ title: "Xatolik", description: "Rasmni o'chirishda xatolik", variant: "destructive" });
            // revert local
            setLocalPhotos(photos);
        } finally {
            setLoading(false);
        }
    };

    const updatePhotosInDb = async (newPhotos: string[]) => {
        if (onSave) {
            await onSave(newPhotos);
            onSuccess();
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ photos: newPhotos })
            .eq('id', businessId);

        if (error) throw error;
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Galereyani tahrirlash</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
                    {localPhotos.map((photo, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleDeletePhoto(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg aspect-square cursor-pointer hover:bg-secondary/50 transition-colors">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                        {uploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground">Rasm qo'shish</span>
                            </>
                        )}
                    </label>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Yopish</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default PhotoGalleryEditDialog;
