import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
import PromotionCard from "@/components/PromotionCard";
import PromotionBookingModal from "@/components/PromotionBookingModal";
import LotteryEntryModal from "@/components/LotteryEntryModal";
import { mockPromotions, Promotion } from "@/data/promotionData";

const PromotionSection = () => {
  const navigate = useNavigate();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLotteryModalOpen, setIsLotteryModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Embla carousel with autoplay configuration
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: true,
    }
  );

  const activePromotions = mockPromotions.filter((p) => p.isActive);

  // Track selected slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return;

    let intervalId: NodeJS.Timeout;

    // Start auto-scroll after a brief delay to ensure carousel is ready
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 3000); // Auto-scroll every 3 seconds
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [emblaApi]);

  const handleBook = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleEnterLottery = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsLotteryModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsLotteryModalOpen(false);
    setSelectedPromotion(null);
  };

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (activePromotions.length === 0) return null;

  return (
    <>
      <section>
        <SectionHeader
          title="Bepul xizmatlar"
          subtitle="Sinab ko'ring va fikr qoldiring"
          icon={<Gift className="w-5 h-5 text-success" />}
          onViewAll={() => navigate("/my-registrations", { state: { defaultTab: "all-promotions" } })}
        />
        <div className="mt-4 -mx-4 px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 touch-pan-y">
              {activePromotions.map((promotion, index) => (
                <motion.div
                  key={promotion.id}
                  className="flex-[0_0_85%] min-w-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PromotionCard
                    promotion={promotion}
                    onBook={handleBook}
                    onEnterLottery={handleEnterLottery}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {activePromotions.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex % activePromotions.length
                  ? "w-6 bg-primary"
                  : "w-2 bg-gray-300"
                  }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <PromotionBookingModal
        promotion={selectedPromotion}
        isOpen={isModalOpen}
        onClose={handleClose}
      />

      {selectedPromotion && (
        <LotteryEntryModal
          promotion={selectedPromotion}
          isOpen={isLotteryModalOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default PromotionSection;
