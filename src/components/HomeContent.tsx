import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import FilterModal from "@/components/FilterModal";
import CategoryGrid from "@/components/CategoryGrid";
import SectionHeader from "@/components/SectionHeader";
import SalonCard from "@/components/SalonCard";
import DiscountBanner from "@/components/DiscountBanner";
import { Scissors, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockBusinesses } from "@/data/businessData";
import RecentReviews from "@/components/RecentReviews";
import { mockPromotions, Promotion } from "@/data/promotionData";
import PromotionCard from "@/components/PromotionCard";
import PromotionBookingModal from "@/components/PromotionBookingModal";
import LotteryEntryModal from "@/components/LotteryEntryModal";
import NotificationCenter from "@/components/NotificationCenter";
import SystemNews from "@/components/SystemNews";

interface HomeContentProps {
    onProfileClick?: () => void;
}

const HomeContent = ({ onProfileClick }: HomeContentProps) => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const promoScrollRef = useRef<HTMLDivElement>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activePromoFilter, setActivePromoFilter] = useState<'all' | 'lottery' | 'free' | 'discount' | '1+1'>('all');

    // Modal states
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
    const [isLotteryModalOpen, setIsLotteryModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Location-based filtering
    const userDistrict = profile?.district || "";

    const [filteredBusinesses, setFilteredBusinesses] = useState(mockBusinesses);

    // Filter promotions
    const filteredPromotions = mockPromotions.filter(p => {
        if (activePromoFilter === 'all') return true;
        if (activePromoFilter === 'lottery') return p.lotteryEnabled;
        if (activePromoFilter === 'free') return !p.lotteryEnabled && p.originalPrice === 0;
        if (activePromoFilter === 'discount') return !p.lotteryEnabled && p.originalPrice > 0 && p.promotionType !== "1+1";
        if (activePromoFilter === '1+1') return p.promotionType === "1+1";
        return true;
    });

    useEffect(() => {
        // Initial load - if user has district, we could prioritize nearby.
        // For now, we keep default.
    }, [profile]);

    // Get featured businesses (top rated ones)
    const featuredBusinesses = filteredBusinesses
        .filter(b => b.rating && b.rating >= 4.5)
        .sort((a, b) => {
            if (a.isTop && !b.isTop) return -1;
            if (!a.isTop && b.isTop) return 1;
            return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, 8);

    // Get nearby businesses (random selection for demo OR filtered by district)
    const nearbyBusinesses = filteredBusinesses
        .filter(b => {
            // Mock logic: if user has district 'chilanzar', match businesses with 'Chilanzar' in address.
            if (userDistrict && userDistrict.toLowerCase() === 'chilanzar') {
                return b.address.neighborhood.toLowerCase().includes('chilanzar');
            }
            return true; // Default show all if no match or no location
        })
        .slice(0, 5);

    const handleFilterApply = (filters: any) => {
        console.log("Filters applied:", filters);

        // Mock client-side filtering
        let results = [...mockBusinesses];

        // Location Filter
        if (filters.locationFilter === 'nearby' && userDistrict) {
            results = results.filter(b => b.address.neighborhood.toLowerCase().includes(userDistrict.toLowerCase()));
        }

        // Price Filter
        if (filters.priceRange) {
            // Mock price check (assuming businesses have price)
        }

        setFilteredBusinesses(results);
    };

    // Auto-scroll effect for featured businesses
    useEffect(() => {
        if (featuredBusinesses.length === 0) return;

        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollInterval: NodeJS.Timeout;
        let isScrollingRight = true;

        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!container) return;

                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;

                if (isScrollingRight) {
                    if (currentScroll >= maxScroll - 10) {
                        isScrollingRight = false;
                    } else {
                        container.scrollLeft += 1;
                    }
                } else {
                    if (currentScroll <= 10) {
                        isScrollingRight = true;
                    } else {
                        container.scrollLeft -= 1;
                    }
                }
            }, 30);
        };

        const timer = setTimeout(startAutoScroll, 2000);

        // Pause on hover
        const handleMouseEnter = () => clearInterval(scrollInterval);
        const handleMouseLeave = () => startAutoScroll();

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearTimeout(timer);
            clearInterval(scrollInterval);
            if (container) {
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [featuredBusinesses.length]);

    // Auto-scroll effect for promotions
    useEffect(() => {
        if (filteredPromotions.length === 0) return;

        const container = promoScrollRef.current;
        if (!container) return;

        let scrollInterval: NodeJS.Timeout;
        let isScrollingRight = true;

        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!container) return;

                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;

                if (isScrollingRight) {
                    if (currentScroll >= maxScroll - 10) {
                        isScrollingRight = false;
                    } else {
                        container.scrollLeft += 1;
                    }
                } else {
                    if (currentScroll <= 10) {
                        isScrollingRight = true;
                    } else {
                        container.scrollLeft -= 1;
                    }
                }
            }, 30);
        };

        const timer = setTimeout(startAutoScroll, 2000);

        // Pause on hover
        const handleMouseEnter = () => clearInterval(scrollInterval);
        const handleMouseLeave = () => startAutoScroll();

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearTimeout(timer);
            clearInterval(scrollInterval);
            if (container) {
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [filteredPromotions.length]);

    return (
        <div className="pb-24">
            <SystemNews />
            {/* Header */}
            <header className="px-4 pt-4 pb-2 safe-top">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
                            <Scissors className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Yaqin
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Barcha xizmatlar
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <NotificationCenter />
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            onClick={onProfileClick || (() => navigate(user ? "/profile" : "/auth"))}
                            className="w-10 h-10 bg-card shadow-soft rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                            {user ? (
                                <span className="font-semibold text-sm text-primary">
                                    {profile?.full_name?.split(" ").map(n => n[0]).join("") || user.email?.[0]?.toUpperCase()}
                                </span>
                            ) : (
                                <User className="w-5 h-5 text-muted-foreground" />
                            )}
                        </motion.div>
                    </div>
                </motion.div>

                <SearchHeader
                    onSearchClick={() => navigate("/search")}
                    onFilterClick={() => setIsFilterOpen(true)}
                />

                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={handleFilterApply}
                />
            </header>

            {/* Main Content */}
            <main className="px-4 space-y-6 mt-6">
                {/* Promo Banner */}
                <DiscountBanner />

                {/* Promotions Section */}
                <section>
                    <SectionHeader
                        title="Aksiyalar va Lotereyalar"
                        subtitle="Yutuqli o'yinlar va bepul xizmatlar"
                    />

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mb-2">
                        {['all', '1+1', 'lottery', 'free', 'discount'].map(type => (
                            <button
                                key={type}
                                onClick={() => setActivePromoFilter(type as any)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activePromoFilter === type
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {type === 'all' && 'Barchasi'}
                                {type === '1+1' && '1+1 Aksiya'}
                                {type === 'lottery' && 'Lotereya'}
                                {type === 'free' && 'Bepul'}
                                {type === 'discount' && 'Chegirma'}
                            </button>
                        ))}
                    </div>

                    <div className="mt-2 -mx-4 px-4">
                        <div
                            ref={promoScrollRef}
                            className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                        >
                            {filteredPromotions.length > 0 ? (
                                filteredPromotions.map((promotion, index) => (
                                    <motion.div
                                        key={promotion.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="min-w-[280px] max-w-[280px]"
                                    >
                                        <PromotionCard
                                            promotion={promotion}
                                            onBook={() => {
                                                setSelectedPromotion(promotion);
                                                setIsBookingModalOpen(true);
                                            }}
                                            onEnterLottery={() => {
                                                setSelectedPromotion(promotion);
                                                setIsLotteryModalOpen(true);
                                            }}
                                            variant="default"
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="w-full text-center py-8 text-muted-foreground text-sm">
                                    Bu turdagi aksiyalar hozircha mavjud emas
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Recent Reviews - MOVED TO TOP */}
                <section>
                    <SectionHeader
                        title="So'nggi sharhlar"
                        subtitle="Mijozlarimiz fikrlari"
                        onViewAll={() => navigate("/reviews")}
                    />
                    <div className="mt-4">
                        <RecentReviews />
                    </div>
                </section>

                {/* Categories - MOVED AFTER REVIEWS */}
                <section>
                    <SectionHeader
                        title="Kategoriyalar"
                        subtitle="Barcha xizmatlarni toping"
                        onViewAll={() => navigate("/search")}
                    />
                    <div className="mt-4">
                        <CategoryGrid limit={8} />
                    </div>
                </section>

                {/* Featured Businesses - MOVED AFTER CATEGORIES */}
                {featuredBusinesses.length > 0 && (
                    <section>
                        <SectionHeader
                            title="Mashhur"
                            subtitle="Eng yaxshi salonlar"
                            onViewAll={() => navigate("/search")}
                        />
                        <div className="mt-4 -mx-4 px-4">
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                            >
                                {featuredBusinesses.map((business, index) => (
                                    <motion.div
                                        key={business.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <SalonCard
                                            salon={{
                                                id: business.id,
                                                name: business.name,
                                                rating: business.rating || 4.5,
                                                reviewCount: business.reviewCount || 0,
                                                priceRange: business.priceRange,
                                                location: business.address.neighborhood + ", " + business.address.city,
                                                image: business.photos?.[0] || "/placeholder.svg",
                                                isOpen: true,
                                                isFeatured: true,
                                                category: business.category,
                                                distance: "1.2 km",
                                                services: business.services?.slice(0, 3).map(s => s.name) || []
                                            }}
                                            variant="featured"
                                            onClick={() => navigate(`/salon/${business.id}`)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Nearby */}
                {nearbyBusinesses.length > 0 && (
                    <section>
                        <SectionHeader
                            title="Yaqin atrofda"
                            subtitle="Eng yaqin salonlar"
                            onViewAll={() => navigate("/search")}
                        />
                        <div className="mt-4 space-y-3">
                            {nearbyBusinesses.map((business, index) => (
                                <motion.div
                                    key={business.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <SalonCard
                                        salon={{
                                            id: business.id,
                                            name: business.name,
                                            rating: business.rating || 4.5,
                                            reviewCount: business.reviewCount || 0,
                                            priceRange: business.priceRange,
                                            location: business.address.neighborhood + ", " + business.address.city,
                                            image: business.photos?.[0] || "/placeholder.svg",
                                            isOpen: true,
                                            isFeatured: false,
                                            category: business.category,
                                            distance: "0.8 km",
                                            services: business.services?.slice(0, 3).map(s => s.name) || []
                                        }}
                                        variant="compact"
                                        onClick={() => navigate(`/salon/${business.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Modals */}
            <PromotionBookingModal
                promotion={selectedPromotion}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />

            {selectedPromotion && (
                <LotteryEntryModal
                    promotion={selectedPromotion}
                    isOpen={isLotteryModalOpen}
                    onClose={() => setIsLotteryModalOpen(false)}
                />
            )}
        </div>
    );
};

export default HomeContent;
