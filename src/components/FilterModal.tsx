
import { useState } from "react";
import { X, MapPin, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const FilterModal = ({ isOpen, onClose, onApply }: FilterModalProps) => {
    const [priceRange, setPriceRange] = useState([50000]);
    const [sortBy, setSortBy] = useState("recommended");
    const [locationFilter, setLocationFilter] = useState("all");

    const handleApply = () => {
        onApply({ priceRange, sortBy, locationFilter });
        onClose();
    };

    const sortOptions = [
        { id: "recommended", label: "Tavsiya etilgan" },
        { id: "rating", label: "Reyting bo'yicha" },
        { id: "price_low", label: "Arzonroq" },
        { id: "price_high", label: "Qimmatroq" }
    ];

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="rounded-t-[20px] max-h-[90vh]">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4" />

                <DrawerHeader className="text-center sm:text-left px-6">
                    <DrawerTitle className="text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        Filtrlash
                    </DrawerTitle>
                </DrawerHeader>

                <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold text-foreground">Narx oralig'i</Label>
                            <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                                0 - {priceRange[0].toLocaleString()} so'm
                            </span>
                        </div>
                        <div className="pt-2 px-1">
                            <Slider
                                defaultValue={[50000]}
                                max={500000}
                                step={5000}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                                <span>0</span>
                                <span>500k+</span>
                            </div>
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Manzil
                        </Label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/50 rounded-xl">
                            <button
                                onClick={() => setLocationFilter("all")}
                                className={cn(
                                    "py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                    locationFilter === "all"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Barchasi
                            </button>
                            <button
                                onClick={() => setLocationFilter("nearby")}
                                className={cn(
                                    "py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                    locationFilter === "nearby"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Yaqin atrofda
                            </button>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4" />
                            Saralash
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSortBy(option.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                        sortBy === option.id
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-secondary/50"
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DrawerFooter className="px-6 pb-8 pt-2">
                    <Button
                        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl"
                        onClick={handleApply}
                    >
                        Natijalarni ko'rsatish
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default FilterModal;
