import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSenseAdProps {
  className?: string;
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
}

/**
 * Componente de anúncio Google AdSense.
 * Para funcionar, substitua "ca-pub-SEU_ID_AQUI" no index.html pelo seu Publisher ID
 * e configure o slot ID nas páginas.
 */
export function AdSenseAd({
  className,
  slot = "1234567890",
  format = "auto",
  style,
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Evita duplicar o anúncio em re-renders
    if (initializedRef.current || !adRef.current) return;

    try {
      // @ts-ignore - AdSense global
      if (typeof window.adsbygoogle !== "undefined") {
        // @ts-ignore
        window.adsbygoogle = window.adsbygoogle || [];
        // @ts-ignore
        window.adsbygoogle.push({});
        initializedRef.current = true;
      }
    } catch (e) {
      console.warn("[SS Bots] AdSense não disponível:", e);
    }
  }, []);

  const defaultStyles: React.CSSProperties = {
    display: "block",
    textAlign: "center",
    minHeight: format === "rectangle" ? 250 : format === "vertical" ? 600 : 90,
    ...style,
  };

  return (
    <div
      ref={adRef}
      className={cn("adsense-wrapper overflow-hidden", className)}
    >
      <ins
        className="adsbygoogle"
        style={defaultStyles}
        data-ad-client="ca-pub-SEU_ID_AQUI"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * Componente que exibe anúncio apenas para usuários não-Premium
 */
interface AdSenseSlotProps {
  slot?: string;
  format?: AdSenseAdProps["format"];
  className?: string;
  isPremium?: boolean;
}

export function AdSenseSlot({ slot, format, className, isPremium }: AdSenseSlotProps) {
  // Não mostra anúncio para usuários Premium
  if (isPremium) return null;

  return (
    <div className={cn("my-4", className)}>
      <div className="flex items-center justify-center rounded-lg border border-border/50 bg-muted/10 p-2">
        <AdSenseAd slot={slot} format={format} />
      </div>
    </div>
  );
}
