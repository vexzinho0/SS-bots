import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BADGE_CONFIG, type BadgeType } from "@/lib/monetization";

interface PremiumBadgeProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const textSizeMap = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

export function PremiumBadge({ type, size = "md", showLabel, className }: PremiumBadgeProps) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  const Icon = config.icon;

  const badge = (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-1.5 py-0.5" : "px-2 py-0.5",
        config.color,
        className
      )}
    >
      <Icon className={cn(sizeMap[size])} />
      {showLabel && <span className={cn(textSizeMap[size])}>{config.label}</span>}
    </motion.span>
  );

  if (showLabel) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{config.label}</p>
        <p className="text-[10px] text-muted-foreground">{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface BadgeListProps {
  badges: BadgeType[];
  size?: "sm" | "md" | "lg";
  max?: number;
  className?: string;
}

export function BadgeList({ badges, size = "sm", max = 5, className }: BadgeListProps) {
  if (!badges?.length) return null;

  const visible = badges.slice(0, max);
  const remaining = badges.length - max;

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {visible.map((type) => (
        <PremiumBadge key={type} type={type} size={size} />
      ))}
      {remaining > 0 && (
        <span className="text-[10px] text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
