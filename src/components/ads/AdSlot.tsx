import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Zap, ChevronRight } from "lucide-react";
import type { AdPage, AdPosition } from "@/lib/monetization";
import { MONETIZATION_CONFIG, formatPremiumPrice, DEFAULT_ADS } from "@/lib/monetization";

interface AdSlotProps {
  page: AdPage;
  position: AdPosition;
  className?: string;
  variant?: "banner" | "card" | "minimal";
}

export function AdSlot({ page, position, className, variant = "card" }: AdSlotProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = React.useState(false);

  // Check if user is premium
  let isPremium = false;
  let plan = "free";
  try {
    const status = useQuery(api.monetization.checkSubscriptionStatus);
    isPremium = status?.isPremium ?? false;
  } catch {
    // Convex not available
  }

  // Get admin setting for premium price
  let premiumPrice = MONETIZATION_CONFIG.premiumPrice;
  try {
    const priceSetting = useQuery(api.monetization.getSetting, { key: "premium_price" });
    if (priceSetting) {
      premiumPrice = parseFloat(priceSetting) || MONETIZATION_CONFIG.premiumPrice;
    }
  } catch {
    // Use default
  }

  // Don't show ads for premium users
  if (isPremium || dismissed) return null;

  const defaultAd = DEFAULT_ADS[page]?.[0];

  if (!defaultAd) return null;

  const handleClick = () => {
    navigate("/pricing");
  };

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4",
          className
        )}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{defaultAd.title}</p>
            <p className="text-xs text-muted-foreground truncate">{defaultAd.description}</p>
          </div>
          <Button size="sm" onClick={handleClick} className="shrink-0 shadow-sm">
            <Zap className="mr-1 h-3.5 w-3.5" />
            {formatPremiumPrice(premiumPrice)}/mês
          </Button>
        </div>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleClick}
        className={cn(
          "group flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs transition-all hover:border-primary/40 hover:bg-primary/10",
          className
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate">
          {defaultAd.title}
        </span>
        <Badge variant="outline" className="ml-auto text-[10px] shrink-0 text-primary border-primary/30">
          Premium
        </Badge>
      </motion.button>
    );
  }

  // Default: card variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 transition-all duration-200 hover:shadow-md hover:border-primary/40",
          className
        )}
        onClick={handleClick}
      >
        <div className="relative p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className="absolute right-2 top-2 rounded-full p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">{defaultAd.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{defaultAd.description}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
              {formatPremiumPrice(premiumPrice)}
              <span className="text-xs font-normal text-muted-foreground">/mês</span>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-1 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
              Ver Planos
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
