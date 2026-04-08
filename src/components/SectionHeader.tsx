import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onViewAll?: () => void;
}

const SectionHeader = ({ title, subtitle, icon, onViewAll }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {onViewAll && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          Все
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SectionHeader;
