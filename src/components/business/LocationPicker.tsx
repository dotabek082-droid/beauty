import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
    value?: { lat: number; lng: number };
    onChange: (value: { lat: number; lng: number }) => void;
}

export const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
    // Fake interactive map state
    // We visualize position as percentages for the mock map
    // In real app, we would map lat/lng to pixels
    const [clickCoords, setClickCoords] = useState({ x: 50, y: 50 });

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setClickCoords({ x, y });

        // Mock update of lat/lng based on click
        // Just to satisfy the interface, we update with small variations
        const newLat = 41.2995 + (Math.random() - 0.5) * 0.01;
        const newLng = 69.2401 + (Math.random() - 0.5) * 0.01;

        onChange({ lat: newLat, lng: newLng });
    };

    const handleDetectLocation = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    onChange({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    // visually center the pin roughly
                    setClickCoords({ x: 50, y: 50 });
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        }
    };

    return (
        <div className="relative h-[300px] w-full rounded-xl overflow-hidden border shadow-inner">
            {/* Detect Location Button */}
            <div className="absolute bottom-4 right-4 z-20">
                <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="p-2.5 bg-white text-primary rounded-full shadow-lg hover:bg-gray-50 border transition-all flex flex-col items-center group"
                    title="Mening joylashuvimni aniqlash"
                >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m0 8v4m-8-8h4m8 0h4m-4-4a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </button>
            </div>
            
            <div
                className="absolute inset-0 bg-slate-100 cursor-crosshair group"
                onClick={handleMapClick}
            >
            {/* Fake Map Elements - Abstract geometric representation of a map */}
            <div className="absolute inset-0 bg-[#f0f0f0]">
                {/* Grid pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
                </div>

                {/* Mock Roads */}
                <div className="absolute top-[40%] left-0 w-full h-6 bg-white border-y border-gray-200" />
                <div className="absolute top-0 left-[30%] w-6 h-full bg-white border-x border-gray-200" />
                <div className="absolute top-[20%] left-0 w-full h-3 bg-white/50 border-y border-gray-200 rotate-12 transform origin-left" />

                {/* Mock Parks */}
                <div className="absolute top-[10%] left-[60%] w-24 h-24 bg-green-100/50 rounded-full border border-green-200/30" />
                <div className="absolute bottom-[20%] right-[10%] w-32 h-20 bg-green-100/50 rounded-xl rotate-[-10deg]" />

                {/* Mock Water */}
                <div className="absolute bottom-0 left-[10%] w-32 h-32 bg-blue-100/50 rounded-full blur-xl" />
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tashkent City</span>
                <span className="text-[8px] text-gray-300">Map Mode: Mock</span>
            </div>

            {/* Pin Marker */}
            <div
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out z-10"
                style={{ left: `${clickCoords.x}%`, top: `${clickCoords.y}%` }}
            >
                <div className="relative group/pin">
                    <MapPin className="w-10 h-10 text-primary fill-primary/20 drop-shadow-lg animate-bounce" />
                    <div className="w-3 h-1.5 bg-black/20 rounded-full blur-[2px] mx-auto mt-[-4px]" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
                        Joylashuvni tanlash
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors pointer-events-none" />
            </div>
        </div>
    );
};
