/**
 * SS Bots Integration Registry
 * Hub central de integrações com serviços externos
 */

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: "platform" | "ai" | "database" | "hosting" | "payment" | "tools";
  icon: string;
  color: string;
  status: "available" | "coming_soon" | "beta";
  authType: "api_key" | "oauth" | "basic" | "none";
  docsUrl: string;
  envVars: string[];
  configSchema: Record<string, any>;
}

export const integrationRegistry: Integration[] = [
  // Plataformas de Mensagens
  {
    id: "discord", name: "Discord", description: "API oficial do Discord para bots", category: "platform",
    icon: "message-circle", color: "bg-indigo-500", status: "available",
    authType: "api_key", docsUrl: "https://discord.com/developers/docs",
    envVars: ["DISCORD_TOKEN", "GUILD_ID"],
    configSchema: { token: "string", guildId: "string", intents: "string[]" },
  },
  {
    id: "whatsapp", name: "WhatsApp", description: "WhatsApp Business API / whatsapp-web.js", category: "platform",
    icon: "phone", color: "bg-emerald-500", status: "available",
    authType: "oauth", docsUrl: "https://developers.facebook.com/docs/whatsapp",
    envVars: ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_ID"],
    configSchema: { token: "string", phoneId: "string" },
  },
  {
    id: "telegram", name: "Telegram", description: "Bot API do Telegram", category: "platform",
    icon: "send", color: "bg-blue-500", status: "available",
    authType: "api_key", docsUrl: "https://core.telegram.org/bots/api",
    envVars: ["TELEGRAM_TOKEN"],
    configSchema: { token: "string", webhook: "string?" },
  },
  {
    id: "instagram", name: "Instagram", description: "Instagram Graph API e automação", category: "platform",
    icon: "camera", color: "bg-pink-500", status: "beta",
    authType: "oauth", docsUrl: "https://developers.facebook.com/docs/instagram",
    envVars: ["INSTAGRAM_TOKEN", "INSTAGRAM_USER_ID"],
    configSchema: { token: "string", userId: "string" },
  },
  {
    id: "youtube", name: "YouTube", description: "YouTube Data API v3", category: "platform",
    icon: "youtube", color: "bg-red-500", status: "available",
    authType: "api_key", docsUrl: "https://developers.google.com/youtube/v3",
    envVars: ["YOUTUBE_API_KEY"],
    configSchema: { apiKey: "string" },
  },
  {
    id: "twitch", name: "Twitch", description: "Twitch API e IRC para bots de chat", category: "platform",
    icon: "twitch", color: "bg-purple-500", status: "available",
    authType: "oauth", docsUrl: "https://dev.twitch.tv/docs",
    envVars: ["TWITCH_TOKEN", "TWITCH_CLIENT_ID"],
    configSchema: { token: "string", clientId: "string" },
  },
  {
    id: "slack", name: "Slack", description: "Slack API para bots e notificações", category: "platform",
    icon: "slack", color: "bg-orange-500", status: "available",
    authType: "oauth", docsUrl: "https://api.slack.com",
    envVars: ["SLACK_TOKEN", "SLACK_SIGNING_SECRET"],
    configSchema: { token: "string", signingSecret: "string" },
  },
  {
    id: "facebook", name: "Facebook", description: "Facebook Messenger API", category: "platform",
    icon: "facebook", color: "bg-blue-600", status: "beta",
    authType: "oauth", docsUrl: "https://developers.facebook.com/docs/messenger-platform",
    envVars: ["FACEBOOK_TOKEN", "FACEBOOK_PAGE_ID"],
    configSchema: { token: "string", pageId: "string" },
  },

  // IA / LLMs
  {
    id: "openai", name: "OpenAI", description: "GPT-4, GPT-3.5, DALL-E, Whisper", category: "ai",
    icon: "sparkles", color: "bg-emerald-600", status: "available",
    authType: "api_key", docsUrl: "https://platform.openai.com/docs",
    envVars: ["OPENAI_API_KEY"],
    configSchema: { apiKey: "string", model: "string?" },
  },
  {
    id: "claude", name: "Claude (Anthropic)", description: "Claude Sonnet, Opus para tarefas complexas", category: "ai",
    icon: "bot", color: "bg-orange-600", status: "available",
    authType: "api_key", docsUrl: "https://docs.anthropic.com/claude/docs",
    envVars: ["ANTHROPIC_API_KEY"],
    configSchema: { apiKey: "string", model: "string?" },
  },
  {
    id: "groq", name: "Groq", description: "Inferência ultra-rápida com LPUs", category: "ai",
    icon: "zap", color: "bg-blue-500", status: "available",
    authType: "api_key", docsUrl: "https://console.groq.com/docs",
    envVars: ["GROQ_API_KEY"],
    configSchema: { apiKey: "string", model: "string?" },
  },
  {
    id: "google-ai", name: "Google AI", description: "Gemini Pro, Vertex AI", category: "ai",
    icon: "globe", color: "bg-blue-600", status: "available",
    authType: "api_key", docsUrl: "https://ai.google.dev/docs",
    envVars: ["GOOGLE_AI_API_KEY"],
    configSchema: { apiKey: "string" },
  },

  // Banco de Dados
  {
    id: "supabase", name: "Supabase", description: "PostgreSQL, Auth, Realtime, Storage", category: "database",
    icon: "database", color: "bg-emerald-600", status: "available",
    authType: "api_key", docsUrl: "https://supabase.com/docs",
    envVars: ["SUPABASE_URL", "SUPABASE_ANON_KEY"],
    configSchema: { url: "string", anonKey: "string" },
  },
  {
    id: "firebase", name: "Firebase", description: "Firestore, Auth, Functions, Hosting", category: "database",
    icon: "flame", color: "bg-amber-500", status: "available",
    authType: "api_key", docsUrl: "https://firebase.google.com/docs",
    envVars: ["FIREBASE_API_KEY", "FIREBASE_PROJECT_ID"],
    configSchema: { apiKey: "string", projectId: "string" },
  },
  {
    id: "mongodb", name: "MongoDB", description: "MongoDB Atlas - Banco NoSQL", category: "database",
    icon: "database", color: "bg-green-600", status: "available",
    authType: "api_key", docsUrl: "https://www.mongodb.com/docs",
    envVars: ["MONGODB_URI"],
    configSchema: { uri: "string" },
  },

  // Hospedagem / Deploy
  {
    id: "vercel", name: "Vercel", description: "Plataforma de deploy frontend/serverless", category: "hosting",
    icon: "triangle", color: "bg-black dark:bg-white", status: "available",
    authType: "oauth", docsUrl: "https://vercel.com/docs",
    envVars: ["VERCEL_TOKEN", "VERCEL_PROJECT_ID"],
    configSchema: { token: "string", projectId: "string" },
  },
  {
    id: "cloudflare", name: "Cloudflare", description: "Workers, Pages, R2, D1", category: "hosting",
    icon: "cloud", color: "bg-orange-500", status: "available",
    authType: "api_key", docsUrl: "https://developers.cloudflare.com",
    envVars: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"],
    configSchema: { apiToken: "string", accountId: "string" },
  },
  {
    id: "railway", name: "Railway", description: "Plataforma de deploy full-stack", category: "hosting",
    icon: "train", color: "bg-purple-600", status: "available",
    authType: "oauth", docsUrl: "https://railway.com/docs",
    envVars: ["RAILWAY_TOKEN"],
    configSchema: { token: "string" },
  },

  // Pagamentos
  {
    id: "stripe", name: "Stripe", description: "Pagamentos, assinaturas, faturamento", category: "payment",
    icon: "credit-card", color: "bg-purple-600", status: "available",
    authType: "api_key", docsUrl: "https://stripe.com/docs",
    envVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    configSchema: { secretKey: "string", webhookSecret: "string" },
  },

  // Ferramentas
  {
    id: "github", name: "GitHub", description: "Repositórios, Actions, API", category: "tools",
    icon: "git-branch", color: "bg-gray-800 dark:bg-gray-200", status: "available",
    authType: "oauth", docsUrl: "https://docs.github.com",
    envVars: ["GITHUB_TOKEN"],
    configSchema: { token: "string", repo: "string?" },
  },
];

/**
 * Busca uma integração pelo ID
 */
export function getIntegrationById(id: string): Integration | undefined {
  return integrationRegistry.find((i) => i.id === id);
}

/**
 * Busca integrações por categoria
 */
export function getIntegrationsByCategory(category: Integration["category"]): Integration[] {
  return integrationRegistry.filter((i) => i.category === category);
}

/**
 * Busca integrações disponíveis (não "coming_soon")
 */
export function getAvailableIntegrations(): Integration[] {
  return integrationRegistry.filter((i) => i.status !== "coming_soon");
}

/**
 * Gera o template de .env com todas as variáveis necessárias
 */
export function generateEnvTemplate(integrationIds: string[]): string {
  const vars = new Set<string>();
  integrationIds.forEach((id) => {
    const integration = getIntegrationById(id);
    if (integration) {
      integration.envVars.forEach((v) => vars.add(v));
    }
  });

  return Array.from(vars)
    .map((v) => `${v}=`)
    .join("\n");
}

export function getIntegrationEnvVars(): string[] {
  return integrationRegistry.flatMap((i) => i.envVars);
}
