
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Business } from '@/types/business';
import { Icon } from 'leaflet';
import { Button } from './ui/button';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MapViewProps {
    businesses: Business[];
}

// Default center (Tashkent)
const DEFAULT_CENTER: [number, number] = [41.2995, 69.2401];

export const MapView = ({ businesses }: MapViewProps) => {
    const navigate = useNavigate();

    return (
        <div className="h-[calc(100vh-200px)] w-full rounded-3xl overflow-hidden shadow-soft border border-border/50">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={13}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {businesses.map((business) => (
                    <Marker
                        key={business.id}
                        position={[business.location.lat, business.location.lng]}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 min-w-[200px]">
                                <div className="relative h-24 w-full mb-2 rounded-lg overflow-hidden">
                                    <img
                                        src={business.photos[0]}
                                        alt={business.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-medium text-amber-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        {business.rating}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{business.name}</h3>
                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {business.address.neighborhood || business.address.city}
                                </p>
                                <Button
                                    size="sm"
                                    className="w-full h-8 text-xs"
                                    onClick={() => navigate(`/salon/${business.id}`)}
                                >
                                    Ko'rish
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
