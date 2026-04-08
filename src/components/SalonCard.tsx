import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";
import { Salon } from "@/data/mockData";
import { Card } from "@/components/ui/card";

interface SalonCardProps {
  salon: Salon;
  variant?: "featured" | "compact";
  onClick?: () => void;
}

const SalonCard = ({ salon, variant = "featured", onClick }: SalonCardProps) => {
  if (variant === "compact") {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        <Card variant="elevated" className="flex overflow-hidden">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={salon.image}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
            {salon.isFeatured && (
              <div className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                ⭐
              </div>
            )}
          </div>
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm line-clamp-1">{salon.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="text-xs font-medium text-foreground">{salon.rating}</span>
                <span className="text-xs text-muted-foreground">({salon.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{salon.distance}</span>
              </div>
              <div className={`flex items-center gap-1 ${salon.isOpen ? 'text-success' : 'text-destructive'}`}>
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">{salon.isOpen ? 'Открыто' : 'Закрыто'}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer min-w-[200px] max-w-[200px]"
    >
      <Card variant="elevated" className="overflow-hidden">
        <div className="relative h-32">
          <img
            src={salon.image}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          {salon.isFeatured && (
            <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Топ
            </div>
          )}
          <div className={`absolute top-2 right-2 ${salon.isOpen ? 'bg-success' : 'bg-destructive'} text-primary-foreground text-xs font-medium px-2 py-1 rounded-full`}>
            {salon.isOpen ? 'Открыто' : 'Закрыто'}
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="font-semibold text-primary-foreground text-sm line-clamp-1">{salon.name}</h3>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-semibold text-foreground">{salon.rating}</span>
              <span className="text-xs text-muted-foreground">({salon.reviewCount})</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{salon.priceRange}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs line-clamp-1">{salon.location}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SalonCard;
