import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Ticket, Check, Copy, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDiscount } from "@/contexts/DiscountContext";
import { fakePromocodes, Promocode } from "@/data/promocodes";
import { toast } from "sonner";

// Compact gradient presets
const CARD_THEMES = [
  "from-violet-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-cyan-500 to-sky-600",
  "from-lime-500 to-green-600",
  "from-fuchsia-500 to-purple-600",
];

const formatDiscount = (promo: Promocode) => {
  if (promo.discountType === 'percent') return `-${promo.discountValue}%`;
  return `-${(promo.discountValue / 1000).toFixed(0)}K`;
};

const getDaysLeft = (validUntil: string) => {
  const now = new Date();
  const end = new Date(validUntil);
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return null;
  if (diff === 1) return "Bugun!";
  if (diff <= 3) return `${diff} kun`;
  if (diff <= 7) return `${diff} kun`;
  return null; // Don't show for long-lived promos
};

const DiscountBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasActiveDiscount, claimDiscount } = useDiscount();
  const [claimedCodes, setClaimedCodes] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`claimed_promos_${user?.id || 'guest'}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  // Drag-to-scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) hasMoved.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.removeProperty('user-select');
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) hasMoved.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  // Auto-scroll: pause on interaction
  const isPaused = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const CARD_WIDTH = 272; // 260px card + 12px gap
    const INTERVAL = 3000;

    const interval = setInterval(() => {
      if (isPaused.current || isDragging.current) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const nextScroll = el.scrollLeft + CARD_WIDTH;

      if (nextScroll >= maxScroll) {
        // Loop back to start smoothly
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: nextScroll, behavior: 'smooth' });
      }
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Pause auto-scroll on hover
  const handleMouseEnter = useCallback(() => { isPaused.current = true; }, []);
  const handleMouseLeave2 = useCallback(() => {
    isPaused.current = false;
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.removeProperty('user-select');
    }
  }, []);

  const activePromos = fakePromocodes.filter(p => p.status === 'active');

  const handleClaim = (promo: Promocode) => {
    if (hasMoved.current) return; // Ignore if it was a drag
    if (!user) { navigate("/auth"); return; }
    if (promo.code === 'SARTAROSH20' && !hasActiveDiscount) claimDiscount();
    const newClaimed = new Set(claimedCodes);
    newClaimed.add(promo.code);
    setClaimedCodes(newClaimed);
    localStorage.setItem(`claimed_promos_${user?.id || 'guest'}`, JSON.stringify([...newClaimed]));
    toast.success(`${promo.code} aktivlashtirildi!`, {
      description: "Promokodlarim bo'limida saqlandi",
      action: { label: "Ko'rish", onClick: () => navigate('/profile/promocodes') },
    });
  };

  const handleCopy = (code: string, e: React.MouseEvent) => {
    if (hasMoved.current) return;
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success(`${code} nusxalandi!`);
  };

  if (activePromos.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">🏷️ Maxsus takliflar</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {activePromos.length}
          </span>
        </div>
        <button
          onClick={() => navigate('/profile/promocodes')}
          className="flex items-center gap-0.5 text-[11px] font-medium text-primary"
        >
          Barchasi <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Draggable scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide select-none"
        style={{ cursor: 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave2}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {activePromos.map((promo, idx) => {
          const theme = CARD_THEMES[idx % CARD_THEMES.length];
          const isClaimed = claimedCodes.has(promo.code) || (promo.code === 'SARTAROSH20' && hasActiveDiscount);
          const daysLeft = getDaysLeft(promo.validUntil);

          return (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`shrink-0 w-[260px] rounded-2xl bg-gradient-to-r ${theme} relative overflow-hidden`}
            >
              {/* Decorative */}
              <div className="absolute -right-4 -top-4 w-14 h-14 bg-white/10 rounded-full" />
              <div className="absolute -right-1 -bottom-5 w-10 h-10 bg-white/10 rounded-full" />

              <div className="relative z-10 p-3 flex flex-col gap-1.5">
                {/* Row 1: Discount + Urgency */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white leading-none">
                    {formatDiscount(promo)}
                  </span>
                  {daysLeft && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-white/90 bg-white/20 px-1.5 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" />{daysLeft}
                    </span>
                  )}
                </div>

                {/* Row 2: Description */}
                <p className="text-[11px] text-white/80 leading-tight line-clamp-1">
                  {promo.description}
                </p>

                {/* Row 3: Categories + Code + Action */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  {/* Category chips */}
                  {promo.applicableCategories && promo.applicableCategories.length > 0 && (
                    <div className="flex gap-1 shrink-0">
                      {promo.applicableCategories.slice(0, 1).map(cat => (
                        <span key={cat} className="text-[9px] text-white/80 bg-white/15 px-1.5 py-0.5 rounded-full font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Code pill (tap to copy) */}
                  <div
                    className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg cursor-pointer hover:bg-white/25 transition-colors"
                    onClick={(e) => handleCopy(promo.code, e)}
                  >
                    <span className="text-[10px] font-mono font-bold text-white tracking-wider">
                      {promo.code}
                    </span>
                    <Copy className="w-2.5 h-2.5 text-white/60" />
                  </div>

                  {/* Action button */}
                  <div className="ml-auto shrink-0">
                    {isClaimed ? (
                      <div
                        className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg cursor-pointer"
                        onClick={(e) => { if (!hasMoved.current) { e.stopPropagation(); navigate('/profile/promocodes'); } }}
                      >
                        <Check className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-semibold text-white">✓</span>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); handleClaim(promo); }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white text-gray-900 rounded-lg font-bold text-[10px] shadow-sm"
                      >
                        <Ticket className="w-3 h-3" />
                        Olish
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Min order hint */}
                {promo.minOrderAmount && (
                  <p className="text-[8px] text-white/40 leading-none">
                    min. {(promo.minOrderAmount / 1000).toFixed(0)}K so'm
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountBanner;
