import {
  Scissors,
  Sparkles,
  Hand,
  Droplets,
  Heart,
  Eye,
  Crown,
  Star,
  LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  icon: LucideIcon;
  color: string;
  count: number;
}

export const categories: Category[] = [
  {
    id: "hair",
    name: "Hair Salon",
    nameUz: "Sartaroshxona",
    nameRu: "Парикмахерская",
    icon: Scissors,
    color: "bg-primary/10 text-primary",
    count: 245,
  },
  {
    id: "makeup",
    name: "Makeup",
    nameUz: "Makiyaj",
    nameRu: "Макияж",
    icon: Sparkles,
    color: "bg-accent/10 text-accent",
    count: 128,
  },
  {
    id: "nails",
    name: "Nails",
    nameUz: "Tirnoq",
    nameRu: "Ногти",
    icon: Hand,
    color: "bg-slate-blue/10 text-slate-blue",
    count: 189,
  },
  {
    id: "skincare",
    name: "Skincare",
    nameUz: "Teri parvarishi",
    nameRu: "Уход за кожей",
    icon: Droplets,
    color: "bg-success/10 text-success",
    count: 96,
  },
  {
    id: "spa",
    name: "Spa & Massage",
    nameUz: "Spa & Massaj",
    nameRu: "Спа и Массаж",
    icon: Heart,
    color: "bg-primary/10 text-primary",
    count: 74,
  },
  {
    id: "brows",
    name: "Brows & Lashes",
    nameUz: "Qosh & Kiprik",
    nameRu: "Брови и Ресницы",
    icon: Eye,
    color: "bg-accent/10 text-accent",
    count: 156,
  },
  {
    id: "wedding",
    name: "Wedding",
    nameUz: "To'y",
    nameRu: "Свадьба",
    icon: Crown,
    color: "bg-slate-blue/10 text-slate-blue",
    count: 62,
  },
  {
    id: "premium",
    name: "Premium",
    nameUz: "Premium",
    nameRu: "Премиум",
    icon: Star,
    color: "bg-accent/10 text-accent",
    count: 34,
  },
];

export interface Salon {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  location: string;
  distance: string;
  priceRange: string;
  isOpen: boolean;
  isFeatured: boolean;
  services: string[];
}

export const featuredSalons: Salon[] = [
  {
    id: "fake-1",
    name: "Oltin Qaychi",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    category: "hair",
    location: "Chilonzor, Toshkent",
    distance: "1.5 km",
    priceRange: "$",
    isOpen: true,
    isFeatured: true,
    services: ["Soch kesish", "Soqol olish", "Kuyov stili"],
  },
  {
    id: "fake-2",
    name: "G'uncha Go'zallik Saloni",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    category: "makeup",
    location: "Yunusobod, Toshkent",
    distance: "3.2 km",
    priceRange: "$$",
    isOpen: true,
    isFeatured: true,
    services: ["Makiyaj", "Soch turmaklash", "Manikyur"],
  },
  {
    id: "fake-3",
    name: "Lola SPA",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    rating: 5.0,
    reviewCount: 45,
    category: "spa",
    location: "Mirzo Ulugbek, Toshkent",
    distance: "5.0 km",
    priceRange: "$$$",
    isOpen: true,
    isFeatured: true,
    services: ["Massaj", "Yuz parvarishi", "Aromaterapiya"],
  },
];

export const nearbySalons: Salon[] = [
  {
    id: "4",
    name: "Silk Beauty Center",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 98,
    category: "skincare",
    location: "Sergeli, Toshkent",
    distance: "0.8 km",
    priceRange: "$$",
    isOpen: true,
    isFeatured: false,
    services: ["Facial", "Cosmetology", "Skin Treatment"],
  },
  {
    id: "5",
    name: "Luxe Lashes",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 267,
    category: "brows",
    location: "Shayxontohur, Toshkent",
    distance: "1.5 km",
    priceRange: "$$",
    isOpen: true,
    isFeatured: false,
    services: ["Lash Extensions", "Brow Lamination", "Tinting"],
  },
  {
    id: "6",
    name: "Royal Wedding Beauty",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 145,
    category: "wedding",
    location: "Olmazor, Toshkent",
    distance: "4.2 km",
    priceRange: "$$$",
    isOpen: true,
    isFeatured: false,
    services: ["Bridal Makeup", "Hair Styling", "Henna"],
  },
];
