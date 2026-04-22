import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Loader2, Navigation, Home, Briefcase, Info } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { REGIONS, DISTRICTS, STREETS, getDistrictsByRegion, getStreetsByDistrict } from "@/data/locations";

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
    regionId?: string;
    districtId?: string;
    streetId?: string;
    homeNumber?: string;
}

interface AddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    address?: Address | null;
    onSave: (address: Partial<Address>) => void;
}

const MapController = ({
    center,
    onLocationSelect
}: {
    center: [number, number],
    onLocationSelect: (lat: number, lng: number) => void
}) => {
    const map = useMap();

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
    const [regionId, setRegionId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [streetId, setStreetId] = useState("");
    const [homeNumber, setHomeNumber] = useState("");
    const [type, setType] = useState<"home" | "work" | "other">("home");
    const [isDefault, setIsDefault] = useState(false);
    const [lat, setLat] = useState(41.2995);
    const [lng, setLng] = useState(69.2401);
    const [loading, setLoading] = useState(false);

    const filteredDistricts = regionId ? getDistrictsByRegion(Number(regionId)) : [];
    const filteredStreets = districtId ? getStreetsByDistrict(Number(districtId)) : [];

    const buildAddressString = (rId: string, dId: string, sId: string, hNum: string) => {
        const parts: string[] = [];
        const region = REGIONS.find(r => r.id === Number(rId));
        const district = DISTRICTS.find(d => d.id === Number(dId));
        const street = STREETS.find(s => s.id === Number(sId));

        if (region) parts.push(region.name_uz);
        if (district) parts.push(district.name_uz);
        if (street) parts.push(street.name_uz);
        if (hNum.trim()) parts.push(`${hNum}-uy`);

        return parts.join(", ");
    };

    useEffect(() => {
        if (open) {
            if (address) {
                setRegionId(address.regionId || "");
                setDistrictId(address.districtId || "");
                setStreetId(address.streetId || "");
                setHomeNumber(address.homeNumber || "");
                setType(address.type || "home");
                setIsDefault(address.isDefault || false);
                setLat(address.lat || 41.2995);
                setLng(address.lng || 69.2401);
            } else {
                setRegionId("");
                setDistrictId("");
                setStreetId("");
                setHomeNumber("");
                setType("home");
                setIsDefault(false);
                setLat(41.2995);
                setLng(69.2401);
            }
        }
    }, [open, address]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const addressStr = buildAddressString(regionId, districtId, streetId, homeNumber);
        const district = DISTRICTS.find(d => d.id === Number(districtId));
        const label = district ? district.name_uz : "Manzil";

        setTimeout(() => {
            onSave({
                label,
                type,
                address: addressStr,
                regionId,
                districtId,
                streetId,
                homeNumber,
                isDefault,
                lat,
                lng,
            });
            setLoading(false);
            onOpenChange(false);
        }, 500);
    };

    const handleRegionChange = (val: string) => {
        setRegionId(val);
        setDistrictId("");
        setStreetId("");
    };

    const handleDistrictChange = (val: string) => {
        setDistrictId(val);
        setStreetId("");
    };

    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {address ? "Manzilni tahrirlash" : "Yangi manzil"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Region */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Viloyat *</Label>
                            <Select onValueChange={handleRegionChange} value={regionId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {REGIONS.map(r => (
                                        <SelectItem key={r.id} value={r.id.toString()}>{r.name_uz}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* District */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Tuman/Shahar *</Label>
                            <Select onValueChange={handleDistrictChange} value={districtId} disabled={!regionId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredDistricts.map(d => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name_uz}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Street */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Ko'cha</Label>
                            <Select onValueChange={setStreetId} value={streetId} disabled={!districtId}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredStreets.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name_uz}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Home Number */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Uy raqami</Label>
                            <Input
                                value={homeNumber}
                                onChange={(e) => setHomeNumber(e.target.value)}
                                placeholder="12"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         {/* Address Type */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Manzil turi</Label>
                            <Select value={type} onValueChange={(val: any) => setType(val)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="home">
                                        <div className="flex items-center gap-2">
                                            <Home className="w-4 h-4" />
                                            <span>Uy</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="work">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            <span>Ishxona</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="other">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>Boshqa</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                         {/* Default Toggle */}
                        <div className="flex flex-col justify-end space-y-2 pb-1">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is-default"
                                    checked={isDefault}
                                    onCheckedChange={setIsDefault}
                                />
                                <Label htmlFor="is-default" className="text-sm">Asosiy manzil</Label>
                            </div>
                        </div>
                    </div>

                    {/* Leaflet Map */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Xaritadan belgilang</Label>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs gap-1.5"
                                onClick={detectLocation}
                            >
                                <Navigation className="w-3 h-3" />
                                Joylashuvni aniqlash
                            </Button>
                        </div>
                        <div className="h-48 w-full rounded-xl overflow-hidden border relative z-0">
                            {open && (
                                <MapContainer
                                    center={[lat, lng]}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[lat, lng]} />
                                    <MapController
                                        center={[lat, lng]}
                                        onLocationSelect={(lt, ln) => {
                                            setLat(lt);
                                            setLng(ln);
                                        }}
                                    />
                                </MapContainer>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Bekor qilish
                        </Button>
                        <Button type="submit" disabled={loading || !regionId || !districtId}>
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
