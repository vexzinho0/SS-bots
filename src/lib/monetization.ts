// ============================================================
// SS Bots - Monetização: Configurações, Tipos e Helpers
// ============================================================

import { Crown, Sparkles, Zap, Shield, Gift, Star, Trophy, Heart, Medal } from "lucide-react";

// ============================================================
// CONFIGURAÇÕES PADRÃO
// ============================================================

export const MONETIZATION_CONFIG = {
  premiumPrice: 4.99,
  premiumCurrency: "BRL",
  premiumInterval: "month" as const,
  trialDays: 0,
  maxAdsPerPage: 3,
  creatorCodeMaxLength: 10,
  customLinkMinLength: 3,
  customLinkMaxLength: 30,
  referralRewardDays: 30,
};

// ============================================================
// TIPOS
// ============================================================

export type PlanType = "free" | "premium";
export type BadgeType = "premium" | "creator" | "partner" | "admin" | "team" | "beta";
export type AdPage = "landing" | "dashboard" | "marketplace" | "bots" | "integrations" | "templates";
export type AdPosition = "top" | "sidebar" | "inline" | "bottom" | "banner";
export type PaymentMethod = "stripe" | "mercadopago" | "paypal" | "pix";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "trialing";

// ============================================================
// BADGES
// ============================================================

export const BADGE_CONFIG: Record<BadgeType, { label: string; description: string; color: string; icon: any }> = {
  premium: {
    label: "Premium",
    description: "Usuário Premium SS Bots",
    color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
    icon: Crown,
  },
  creator: {
    label: "Criador",
    description: "Criador Verificado",
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    icon: Star,
  },
  partner: {
    label: "Parceiro",
    description: "Parceiro Oficial",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    icon: Handshake,
  },
  admin: {
    label: "Admin",
    description: "Administrador da Plataforma",
    color: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
    icon: Shield,
  },
  team: {
    label: "Equipe",
    description: "Membro da Equipe SS Bots",
    color: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    icon: Heart,
  },
  beta: {
    label: "Beta Tester",
    description: "Testador Beta",
    color: "bg-gradient-to-r from-violet-500 to-indigo-500 text-white",
    icon: Medal,
  },
};

// ============================================================
// PREMIUM BENEFITS
// ============================================================

export const PREMIUM_BENEFITS = [
  {
    icon: Zap,
    title: "Sem Anúncios",
    description: "Experiência limpa e sem interrupções",
    highlight: true,
  },
  {
    icon: Crown,
    title: "Badge Premium",
    description: "Reconhecimento exclusivo no perfil",
    highlight: true,
  },
  {
    icon: Gift,
    title: "Código de Criador",
    description: "Crie seu código promocional exclusivo",
  },
  {
    icon: Trophy,
    title: "Links Personalizados",
    description: "ssbots.com/seunome",
  },
  {
    icon: Sparkles,
    title: "IA Prioritária",
    description: "Maior prioridade e velocidade na IA",
  },
  {
    icon: Shield,
    title: "Suporte Prioritário",
    description: "Atendimento prioritário 24/7",
  },
  {
    icon: Star,
    title: "Mais Recursos",
    description: "Workspaces ampliados e recursos exclusivos",
  },
];

// ============================================================
// AD PLACEMENT MAP
// ============================================================

export const AD_PLACEMENTS: Record<AdPage, AdPosition[]> = {
  landing: ["top", "banner", "bottom"],
  dashboard: ["sidebar", "inline", "banner"],
  marketplace: ["top", "inline", "sidebar"],
  bots: ["sidebar", "inline"],
  integrations: ["sidebar", "inline"],
  templates: ["top", "inline"],
};

export const AD_RESTRICTED_PAGES = ["/editor", "/terminal", "/chat", "/settings", "/login", "/register"] as const;

export function isAdRestrictedPage(pathname: string): boolean {
  return AD_RESTRICTED_PAGES.some((p) => pathname.startsWith(p));
}

export function getAvailableAdPositions(page: AdPage): AdPosition[] {
  return AD_PLACEMENTS[page] || [];
}

// ============================================================
// HELPERS
// ============================================================

export function formatPremiumPrice(price: number = MONETIZATION_CONFIG.premiumPrice): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: MONETIZATION_CONFIG.premiumCurrency,
  }).format(price);
}

export function getPremiumStatusInfo(expiresAt?: number): {
  label: string;
  color: string;
  daysRemaining: number;
} {
  if (!expiresAt) {
    return { label: "Plano Gratuito", color: "text-muted-foreground", daysRemaining: 0 };
  }

  const now = Date.now();
  const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return { label: "Expirado", color: "text-destructive", daysRemaining: 0 };
  }

  if (daysRemaining <= 7) {
    return { label: `Expira em ${daysRemaining}d`, color: "text-amber-500", daysRemaining };
  }

  return { label: `Premium • ${daysRemaining}d restantes`, color: "text-amber-500", daysRemaining };
}

export function canUseFeature(
  plan: PlanType,
  requiredPlan: PlanType,
  isExpired: boolean = false
): boolean {
  if (requiredPlan === "free") return true;
  if (isExpired) return false;
  return plan === "premium";
}

// ============================================================
// DEFAULT ADS (for when no backend ads are configured)
// ============================================================

export const DEFAULT_ADS: Record<AdPage, Array<{
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
}>> = {
  landing: [
    {
      title: "SS Bots Premium",
      description: "Desbloqueie recursos exclusivos por apenas R$ 4,99/mês",
      linkUrl: "/pricing",
    },
  ],
  dashboard: [
    {
      title: "Acelere seu desenvolvimento",
      description: "IA prioritária, sem anúncios e links personalizados",
      linkUrl: "/pricing",
    },
  ],
  marketplace: [
    {
      title: "Templates Premium",
      description: "Acesse templates exclusivos com SS Bots Premium",
      linkUrl: "/pricing",
    },
  ],
  bots: [
    {
      title: "Bots mais rápidos",
      description: "Fila prioritária para usuários Premium",
      linkUrl: "/pricing",
    },
  ],
  integrations: [
    {
      title: "Integrações Ilimitadas",
      description: "Conecte quantas plataformas quiser com Premium",
      linkUrl: "/pricing",
    },
  ],
  templates: [
    {
      title: "Biblioteca Premium",
      description: "Centenas de templates exclusivos para assinantes",
      linkUrl: "/pricing",
    },
  ],
};

// Import for Handshake icon
import { Handshake } from "lucide-react";
