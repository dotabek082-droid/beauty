import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Globe, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoinBalance } from "@/utils/coinBalance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchHeaderProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

const CoinBalanceDisplay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (user) {
      setCoins(getCoinBalance(user.id));

      // Optional: Listen for storage events to update real-time across tabs/components
      const handleStorageChange = () => {
        setCoins(getCoinBalance(user.id));
      };
      window.addEventListener('storage', handleStorageChange);
      // Also custom event for same-tab updates if we implemented that, but polling or context refresh is easier. 
      // For now simpler is better.
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [user]);

  if (!user) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/profile/coins')}
      className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800 shadow-sm mr-2"
    >
      <div className="bg-amber-500 rounded-full p-0.5 text-white">
        <Coins className="w-3 h-3" />
      </div>
      <span className="text-xs font-bold">{coins.toLocaleString()}</span>
    </motion.button>
  );
};

const SearchHeader = ({ onSearchClick, onFilterClick }: SearchHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  const getFlag = (lang: string) => {
    switch (lang) {
      case 'uz': return '🇺🇿';
      case 'kaa': return '🇺🇿'; // Karakalpak uses UZ flag usually or specific one, using UZ for now
      case 'kk': return '🇰🇿';
      case 'ky': return '🇰🇬';
      case 'tg': return '🇹🇯';
      case 'tk': return '🇹🇲';
      case 'ru': return '🇷🇺';
      case 'en': return '🇬🇧';
      default: return '🇺🇿';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Location */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Toshkent, Chilanzar</span>
          <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          {/* Coin Balance Display */}
          {/* We can pass user explicitly or use useAuth inside if not passed props. SearchHeader currently doesn't use useAuth. 
              Let's import useAuth. 
           */}
          <CoinBalanceDisplay />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <span className="text-xl">{getFlag(language)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('uz')}>🇺🇿 O'zbek</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('kaa')}>🇺🇿 Qaraqalpaq</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('kk')}>🇰🇿 Qazaqsha</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ky')}>🇰🇬 Kyrgyzcha</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('tg')}>🇹🇯 Tojikcha</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('tk')}>🇹🇲 Turkmencha</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ru')}>🇷🇺 Русский</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>🇬🇧 English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onSearchClick}
          className="flex-1 flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3.5 transition-all duration-200 hover:bg-muted"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground line-clamp-1">{t('common.searchPlaceholder')}</span>
        </motion.button>
        <button
          onClick={onFilterClick}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] bg-primary-soft text-primary hover:bg-primary/20 rounded-2xl w-12 h-12"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default SearchHeader;
