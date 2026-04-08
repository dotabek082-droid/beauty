import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

interface AddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    address?: Address | null;
    onSave: (address: Partial<Address>) => void;
}

// Component to handle map clicks and updates
const MapController = ({
    center,
    onLocationSelect
}: {
    center: [number, number],
    onLocationSelect: (lat: number, lng: number) => void
}) => {
    const map = useMap();

    // Update map center when props change
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
};

const AddressDialog = ({ open, onOpenChange, address, onSave }: AddressDialogProps) => {
    const [formData, setFormData] = useState<Partial<Address>>({
        label: "",
        type: "home",
        address: "",
        landmark: "",
        lat: 41.2995, // Default Tashkent
        lng: 69.2401,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (address) {
                setFormData({ ...address });
            } else {
                setFormData({
                    label: "Yangi manzil",
                    type: "home",
                    address: "",
                    landmark: "",
                    lat: 41.2995,
                    lng: 69.2401,
                    isDefault: false
                });
            }
        }
    }, [open, address]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            onSave(formData);
            setLoading(false);
            onOpenChange(false);
        }, 500);
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, lat, lng }));
        // Mock reverse geocoding update for demonstration
        // In a real app, calls OpenStreetMap Nominatim or Google Maps API here
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{address ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}</DialogTitle>
                    <DialogDescription>
                        Manzilingizni xaritadan belgilang
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="h-64 w-full rounded-md overflow-hidden border relative z-0">
                        {open && (
                            <MapContainer
                                center={[formData.lat || 41.2995, formData.lng || 69.2401]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[formData.lat || 41.2995, formData.lng || 69.2401]} />
                                <MapController
                                    center={[formData.lat || 41.2995, formData.lng || 69.2401]}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </MapContainer>
                        )}
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-[10px] font-mono z-[1000] border shadow-sm">
                            {formData.lat?.toFixed(6)}, {formData.lng?.toFixed(6)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nomi</Label>
                            <Input
                                value={formData.label}
                                onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))}
                                placeholder="Masalan: Uyim, Ishxona"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Turi</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: any) => setFormData(p => ({ ...p, type: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="home">Uy</SelectItem>
                                    <SelectItem value="work">Ishxona</SelectItem>
                                    <SelectItem value="other">Boshqa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Manzil</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                value={formData.address}
                                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                                placeholder="Ko'cha, uy, xonadon"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Mo'ljal (ixtiyoriy)</Label>
                        <Input
                            value={formData.landmark}
                            onChange={(e) => setFormData(p => ({ ...p, landmark: e.target.value }))}
                            placeholder="Masalan: Makro supermarket ro'parasida"
                        />
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <Switch
                            id="is-default"
                            checked={formData.isDefault || false}
                            onCheckedChange={(checked) => setFormData(p => ({ ...p, isDefault: checked }))}
                        />
                        <Label htmlFor="is-default">Asosiy manzil sifatida belgilash</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Bekor qilish
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Saqlash
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddressDialog;
