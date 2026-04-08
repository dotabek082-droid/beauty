import { Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TrustScoreBadge = ({
  score,
  showLabel = true,
  size = "md",
  className,
}: TrustScoreBadgeProps) => {
  const getScoreConfig = () => {
    if (score >= 80) {
      return {
        icon: ShieldCheck,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        label: "Ishonchli",
      };
    } else if (score >= 60) {
      return {
        icon: Shield,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        label: "O'rtacha",
      };
    } else if (score >= 40) {
      return {
        icon: ShieldAlert,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        label: "Past",
      };
    } else {
      return {
        icon: ShieldX,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        label: "Xavfli",
      };
    }
  };

  const config = getScoreConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border",
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(iconSizes[size], config.color)} />
      <span className={cn("font-medium", config.color)}>{score}</span>
      {showLabel && (
        <span className="text-muted-foreground">• {config.label}</span>
      )}
    </div>
  );
};

export default TrustScoreBadge;
