import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import * as LucideIcons from "lucide-react";

interface CategoryGridProps {
  onCategoryClick?: (categoryId: string) => void;
  limit?: number; // Limit number of categories to display
}

// Map icon names to Lucide components
const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    "utensils": LucideIcons.Utensils,
    "shopping-bag": LucideIcons.ShoppingBag,
    "moon": LucideIcons.Moon,
    "dumbbell": LucideIcons.Dumbbell,
    "sparkles": LucideIcons.Sparkles,
    "car": LucideIcons.Car,
    "home": LucideIcons.Home,
    "coffee": LucideIcons.Coffee,
    "apple": LucideIcons.Apple,
    "palette": LucideIcons.Palette,
    "heart-pulse": LucideIcons.HeartPulse,
    "briefcase": LucideIcons.Briefcase,
    "dog": LucideIcons.Dog,
    "building": LucideIcons.Building,
    "plane": LucideIcons.Plane,
    "map-pin": LucideIcons.MapPin,
    "calendar": LucideIcons.Calendar,
    "landmark": LucideIcons.Landmark,
    "banknote": LucideIcons.Banknote,
    "graduation-cap": LucideIcons.GraduationCap,
    "church": LucideIcons.Church,
    "radio": LucideIcons.Radio,
    "list": LucideIcons.List,
  };
  return iconMap[iconName] || LucideIcons.Store;
};

const CategoryGrid = ({ onCategoryClick, limit }: CategoryGridProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    } else {
      navigate(`/search?category=${categoryId}`);
    }
  };

  // Apply limit if specified
  const displayedCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="grid grid-cols-4 gap-3">
      {displayedCategories.map((category, index) => {
        const IconComponent = getIcon(category.icon);
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-200"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: category.color || '#6366f1' }}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {category.nameUz}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
