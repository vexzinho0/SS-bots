import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Map of icon IDs to their SVG imports for the actual platform icons
const iconImports: Record<string, string> = {
  discord: "discord",
  whatsapp: "whatsapp",
  telegram: "telegram",
  instagram: "instagram",
  youtube: "youtube",
  twitch: "twitch",
  slack: "slack",
  facebook: "facebook",
  github: "github",
  openai: "openai",
  claude: "claude",
  groq: "groq",
  "google-ai": "google-ai",
  supabase: "supabase",
  firebase: "firebase",
  mongodb: "mongodb",
  vercel: "vercel",
  cloudflare: "cloudflare",
  stripe: "stripe",
  "microsoft-teams": "microsoft-teams",
  custom: "custom",
};

// Color overlays for each platform icon when hovered
const platformColors: Record<string, string> = {
  discord: "hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]",
  whatsapp: "hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]",
  telegram: "hover:shadow-[0_0_20px_rgba(0,136,204,0.4)]",
  instagram: "hover:shadow-[0_0_20px_rgba(228,64,95,0.4)]",
  youtube: "hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]",
  twitch: "hover:shadow-[0_0_20px_rgba(145,70,255,0.4)]",
  slack: "hover:shadow-[0_0_20px_rgba(224,30,90,0.4)]",
  facebook: "hover:shadow-[0_0_20px_rgba(24,119,242,0.4)]",
  github: "hover:shadow-[0_0_20px_rgba(51,51,51,0.4)]",
  openai: "hover:shadow-[0_0_20px_rgba(16,163,127,0.4)]",
  claude: "hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]",
  groq: "hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
  "google-ai": "hover:shadow-[0_0_20px_rgba(66,133,244,0.4)]",
  supabase: "hover:shadow-[0_0_20px_rgba(62,207,142,0.4)]",
  firebase: "hover:shadow-[0_0_20px_rgba(255,202,40,0.4)]",
  mongodb: "hover:shadow-[0_0_20px_rgba(71,162,72,0.4)]",
  vercel: "hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]",
  cloudflare: "hover:shadow-[0_0_20px_rgba(243,128,32,0.4)]",
  stripe: "hover:shadow-[0_0_20px_rgba(99,91,255,0.4)]",
  "microsoft-teams": "hover:shadow-[0_0_20px_rgba(98,100,167,0.4)]",
};

interface PlatformIconProps {
  name: string;
  className?: string;
  size?: number;
  animated?: boolean;
}

export function PlatformIcon({ name, className, size = 24, animated = true }: PlatformIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const iconKey = name.toLowerCase().replace(/\s+/g, "-");
  const iconFile = iconImports[iconKey];

  if (!iconFile) {
    return null;
  }

  if (!animated) {
    return (
      <img
        src={`/assets/icons/${iconFile}.svg`}
        alt={name}
        className={cn("shrink-0", className)}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg transition-all duration-300",
        platformColors[iconKey],
        className
      )}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.25, rotate: [0, -5, 5, -3, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={false}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px rgba(var(--platform-glow), 0.4)"
            : "0 0 0px rgba(var(--platform-glow), 0)",
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Pulse ring */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{
            border: "2px solid currentColor",
            color: "inherit",
          }}
        />
      )}

      <img
        src={`/assets/icons/${iconFile}.svg`}
        alt={name}
        className="relative z-10 shrink-0"
        style={{ width: size * 0.85, height: size * 0.85 }}
        loading="lazy"
      />
    </motion.div>
  );
}

// Animated wrapper for any icon with spring hover effect
export function AnimatedIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      whileHover={{ scale: 1.2, rotate: [0, -5, 5, -3, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}

// SS Bots Logo component - renders the full brand logo
interface SSBotsLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SSBotsLogo({ className, showTagline = false, size = "md" }: SSBotsLogoProps) {
  const dimensions = {
    sm: { icon: 24, text: 14, tagline: 7 },
    md: { icon: 32, text: 18, tagline: 8 },
    lg: { icon: 40, text: 22, tagline: 10 },
  };

  const dim = dimensions[size];

  return (
    <motion.span
      className={cn("inline-flex items-center gap-2.5", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.span
        className="flex items-center justify-center rounded-xl bg-primary shadow-sm"
        style={{ width: dim.icon, height: dim.icon }}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <svg viewBox="0 0 32 32" fill="none" style={{ width: dim.icon * 0.6, height: dim.icon * 0.6 }}>
          <rect x="4" y="9" width="24" height="18" rx="4" fill="white"/>
          <rect x="8" y="5" width="16" height="4" rx="2" fill="white" opacity="0.7"/>
          <rect x="14.5" y="4" width="3" height="3" rx="1.5" fill="white"/>
          <circle cx="11.5" cy="18" r="3.5" fill="#e11d48"/>
          <circle cx="20.5" cy="18" r="3.5" fill="#e11d48"/>
          <circle cx="11.5" cy="18" r="1.8" fill="white"/>
          <circle cx="20.5" cy="18" r="1.8" fill="white"/>
          <rect x="12" y="24" width="8" height="2" rx="1" fill="white" opacity="0.6"/>
          <rect x="2" y="14" width="2" height="6" rx="1" fill="white" opacity="0.5"/>
          <rect x="28" y="14" width="2" height="6" rx="1" fill="white" opacity="0.5"/>
        </svg>
      </motion.span>
      <span className="flex flex-col">
        <span className="font-bold tracking-tight leading-none" style={{ fontSize: dim.text }}>
          <span className="text-foreground">SS</span>
          <span className="text-primary"> Bots</span>
        </span>
        {showTagline && (
          <span className="font-medium tracking-wider text-muted-foreground leading-none mt-0.5" style={{ fontSize: dim.tagline }}>
            IA &amp; AUTOMAÇÃO
          </span>
        )}
      </span>
    </motion.span>
  );
}
