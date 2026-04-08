import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowLeft, MapPin, Star, Map as MapIcon, List } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mockBusinesses } from "@/data/businessData";
import { categories, getCategoryById } from "@/data/categories";
import { Business } from "@/types/business";
import { MapView } from "@/components/MapView";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const subcategoryId = searchParams.get("subcategory");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(mockBusinesses);
  const ITEMS_PER_PAGE = 5;
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    let filtered = [...mockBusinesses];

    // 1. Hard Filter by Category
    if (categoryId) {
      filtered = filtered.filter((business) => business.category === categoryId);
    }

    // 1.1 Hard Filter by Subcategory
    if (subcategoryId) {
      filtered = filtered.filter((business) =>
        business.subcategories && business.subcategories.includes(subcategoryId)
      );
    }

    // 2. Complex Search & Ranking
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();

      const scoredBusinesses = filtered.map(business => {
        let score = 0;

        // Text Match Scoring
        const nameLower = business.name.toLowerCase();
        if (nameLower === query) score += 100; // Exact match
        else if (nameLower.startsWith(query)) score += 80;
        else if (nameLower.includes(query)) score += 50;

        // Category & Subcategory Match
        if (business.category.toLowerCase().includes(query)) score += 40;
        // Check subcategories array for inclusion
        if (business.subcategories && business.subcategories.some(sub => sub.toLowerCase().includes(query))) score += 40;

        // Service Match (High relevance)
        const matchedServices = business.services.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
        );
        if (matchedServices.length > 0) score += 30 + (matchedServices.length * 5);

        // Description & Location Match
        if (business.description.toLowerCase().includes(query)) score += 20;
        if (business.address.neighborhood?.toLowerCase().includes(query)) score += 25;
        if (business.address.city.toLowerCase().includes(query)) score += 15;

        // Quality Boosters (Only applied if there's some text relevance to avoid boosting irrelevant results)
        if (score > 0) {
          if (business.verifiedLicense) score += 15;
          if (business.verified) score += 10;
          score += (business.rating * 4); // Max 20 points
          score += Math.min(business.reviewCount, 100) / 5; // Max 20 points
        }

        return { business, score };
      });

      // Filter out zero scores and sort by score descending
      filtered = scoredBusinesses
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.business);
    } else {
      // Default Ranking (No search query)
      // Prioritize verified and high rated
      filtered.sort((a, b) => {
        const scoreA = (a.verifiedLicense ? 20 : 0) + (a.rating * 5);
        const scoreB = (b.verifiedLicense ? 20 : 0) + (b.rating * 5);
        return scoreB - scoreA;
      });
    }

    setFilteredBusinesses(filtered);
    setVisibleItems(ITEMS_PER_PAGE);
  }, [categoryId, subcategoryId, searchQuery]);

  // Handle Subcategory Click
  const handleSubcategorySelect = (subId: string) => {
    // Keep category, toggle subcategory
    const newParams = new URLSearchParams(searchParams);
    if (subId === subcategoryId) {
      newParams.delete("subcategory");
    } else {
      newParams.set("subcategory", subId);
    }
    setSearchParams(newParams);
  };

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
  };

  const selectedCategory = categoryId ? getCategoryById(categoryId) : null;

  const isOpenNow = (business: Business) => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const hours = business.hours[currentDay];

    if (!hours || hours.closed) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
  };

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
    };
    return iconMap[iconName] || LucideIcons.Store;
  };

  const handleCategorySelect = (catId: string) => {
    if (catId === categoryId) {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg z-50 border-b border-border/50 safe-top">
        <div className="px-4 py-3">
          {/* Title Bar & Toggle */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {selectedCategory ? selectedCategory.nameUz : "Qidiruv"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {filteredBusinesses.length} ta natija
                </p>
              </div>
            </div>

            {/* Map/List Toggle */}
            <div className="flex bg-secondary p-1 rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0 sm:w-auto sm:px-3 text-xs sm:text-sm shadow-none"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Ro'yxat</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0 sm:w-auto sm:px-3 text-xs sm:text-sm shadow-none"
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Xarita</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          {viewMode === 'list' && (
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qidirish..."
                className="w-full bg-muted/50 rounded-full pl-11 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-all"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-foreground/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Subcategories (If Main Category Selected) */}
        {selectedCategory && selectedCategory.subcategories.length > 0 && (
          <div className="overflow-x-auto scrollbar-hide border-b border-border/30 bg-muted/20">
            <div className="flex gap-2 px-4 py-2">
              {selectedCategory.subcategories.map((sub) => {
                const isActive = subcategoryId === sub.id;
                return (
                  <motion.button
                    key={sub.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubcategorySelect(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                  >
                    {sub.nameUz}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="overflow-x-auto scrollbar-hide border-t border-border/30 pt-2 bg-card/95 backdrop-blur-lg">
          <div className="flex gap-2 px-4 pb-3">
            {categories.map((category) => {
              const IconComponent = getIcon(category.icon);
              const isActive = categoryId === category.id;
              return (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all duration-200 ${isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border hover:border-primary/30"
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{category.nameUz}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="px-4 py-4 space-y-3">
        {viewMode === 'list' ? (
          <AnimatePresence mode="wait">
            {filteredBusinesses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Hech narsa topilmadi</h3>
                <p className="text-sm text-muted-foreground">Boshqa kategoriya yoki kalit so'z bilan qidiring</p>
              </motion.div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredBusinesses.slice(0, visibleItems).map((business, index) => {
                    const open = isOpenNow(business);
                    return (
                      <motion.div
                        key={business.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/salon/${business.id}`)}
                        className="bg-card rounded-3xl shadow-soft overflow-hidden cursor-pointer hover:shadow-md transition-all active:shadow-sm"
                      >
                        {/* Image with overlay gradient */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={business.photos[0]}
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                          {/* Verified Badge */}
                          {business.verifiedLicense && (
                            <div className="absolute top-3 right-3">
                              <div className="bg-success/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <span>✓</span>
                                <span>Tasdiqlangan</span>
                              </div>
                            </div>
                          )}

                          {/* Price Range & Status */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <span className="text-sm font-bold text-foreground">{business.priceRange}</span>
                            </div>
                            {open ? (
                              <div className="bg-success/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                                Ochiq
                              </div>
                            ) : (
                              <div className="bg-muted/90 backdrop-blur-sm text-muted-foreground px-3 py-1.5 rounded-full text-xs font-medium">
                                Yopiq
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1">
                            {business.name}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {business.description}
                          </p>

                          {/* Rating and Location */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Rating */}
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-warning fill-warning" />
                                <span className="text-sm font-semibold text-foreground">{business.rating}</span>
                                <span className="text-xs text-muted-foreground">({business.reviewCount})</span>
                              </div>
                            </div>

                            {/* Neighborhood */}
                            {business.address.neighborhood && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{business.address.neighborhood}</span>
                              </div>
                            )}
                          </div>

                          {/* Amenities */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                            {business.amenities.freeWifi && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Wi-Fi</span>
                            )}
                            {business.amenities.acceptsCreditCards && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Karta</span>
                            )}
                            {business.amenities.parking && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Parking</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {filteredBusinesses.length > visibleItems && (
                  <div className="pt-4 pb-8 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      className="group flex flex-col items-center gap-2 text-primary font-medium transition-all hover:scale-105"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <LucideIcons.ChevronDown className="w-6 h-6 animate-bounce" />
                      </div>
                      <span className="text-sm">Ko'proq ko'rsatish ({filteredBusinesses.length - visibleItems})</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <MapView businesses={filteredBusinesses} />
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
