/**
 * SS Bots Platform Assistants
 * Assistentes especializados para cada plataforma de bot
 */

export interface PlatformInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  botType: string;
  setupGuide: string[];
  requirements: string[];
  apis: string[];
}

export const platforms: PlatformInfo[] = [
  {
    id: "discord",
    name: "Discord",
    description: "Crie bots para Discord com sistema de tickets, moderação, jogos e mais",
    icon: "message-circle",
    color: "bg-indigo-500",
    botType: "discord.js",
    setupGuide: [
      "1. Acesse https://discord.com/developers/applications",
      "2. Crie uma nova aplicação",
      "3. Vá em Bot e crie um token",
      "4. Ative as intenções necessárias (Message Content, Server Members)",
      "5. Convide o bot para seu servidor usando OAuth2 URL Generator",
      "6. Copie o token para o arquivo .env",
    ],
    requirements: [
      "Token do bot Discord",
      "ID do servidor (Guild ID)",
      "Node.js 18+",
    ],
    apis: [
      "Discord.js v14",
      "Discord REST API",
      "Gateway Intents",
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Automatize mensagens, crie chatbots e sistemas de atendimento",
    icon: "phone",
    color: "bg-emerald-500",
    botType: "whatsapp-web.js",
    setupGuide: [
      "1. Instale as dependências necessárias",
      "2. Configure o puppeteer para seu ambiente",
      "3. Inicie o bot e escaneie o QR Code",
      "4. O bot estará pronto para uso!",
      "5. Mantenha o terminal aberto (a sessão expira se fechar)",
    ],
    requirements: [
      "WhatsApp ativo no celular",
      "Node.js 18+",
      "Conexão estável com internet",
    ],
    apis: [
      "whatsapp-web.js",
      "WhatsApp Business API (opcional)",
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Bots para Telegram com comandos, teclados inline e moderação",
    icon: "send",
    color: "bg-blue-500",
    botType: "python-telegram-bot",
    setupGuide: [
      "1. Abra o Telegram e busque por @BotFather",
      "2. Envie /newbot e siga as instruções",
      "3. Copie o token gerado",
      "4. Configure o arquivo .env com o token",
      "5. Execute o bot e ele estará online!",
    ],
    requirements: [
      "Token do BotFather",
      "Python 3.8+",
      "pip (gerenciador de pacotes)",
    ],
    apis: [
      "python-telegram-bot",
      "Telegram Bot API",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Automação de DM, respostas automáticas e moderação",
    icon: "camera",
    color: "bg-pink-500",
    botType: "instagram-private-api",
    setupGuide: [
      "1. Use uma conta secundária do Instagram",
      "2. Configure as credenciais no .env",
      "3. Evite ações em massa para não ser bloqueado",
      "4. Respeite os limites da plataforma",
    ],
    requirements: [
      "Conta do Instagram",
      "Node.js 18+",
    ],
    apis: [
      "Instagram Private API",
      "Instagram Graph API (para criadores)",
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Moderação de comentários, respostas automáticas e análise",
    icon: "youtube",
    color: "bg-red-500",
    botType: "youtube-api",
    setupGuide: [
      "1. Crie um projeto no Google Cloud Console",
      "2. Ative a YouTube Data API v3",
      "3. Crie credenciais OAuth 2.0",
      "4. Configure as credenciais no .env",
    ],
    requirements: [
      "Google Cloud Project",
      "YouTube API Key",
      "OAuth 2.0 Credentials",
    ],
    apis: [
      "YouTube Data API v3",
    ],
  },
  {
    id: "twitch",
    name: "Twitch",
    description: "Chat bots, alerts, overlays e integração com stream",
    icon: "twitch",
    color: "bg-purple-500",
    botType: "tmi.js",
    setupGuide: [
      "1. Crie uma conta Twitch para o bot",
      "2. Obtenha o OAuth token em https://twitchapps.com/tmi/",
      "3. Registre o bot em https://dev.twitch.tv/console/apps",
      "4. Configure as credenciais no .env",
    ],
    requirements: [
      "Conta Twitch",
      "OAuth Token",
      "Client ID",
    ],
    apis: [
      "Twitch API",
      "Twitch IRC (TMI)",
      "EventSub",
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Bots para Slack com comandos, notificações e integrações",
    icon: "slack",
    color: "bg-orange-500",
    botType: "slack-api",
    setupGuide: [
      "1. Crie um app em https://api.slack.com/apps",
      "2. Ative Socket Mode",
      "3. Configure os scopes necessários",
      "4. Instale o app no workspace",
      "5. Copie o token para o .env",
    ],
    requirements: [
      "Workspace Slack",
      "Token do Slack App",
      "Node.js 18+",
    ],
    apis: [
      "Slack API",
      "Slack Bolt Framework",
    ],
  },
  {
    id: "custom",
    name: "Personalizado",
    description: "Crie seu próprio conector para qualquer plataforma",
    icon: "globe",
    color: "bg-primary",
    botType: "custom",
    setupGuide: [
      "1. Defina a plataforma alvo",
      "2. Documente a API disponível",
      "3. Implemente o conector usando nossa SDK",
      "4. Teste a integração",
      "5. Publique no marketplace",
    ],
    requirements: [
      "Documentação da API",
      "Credenciais de acesso",
    ],
    apis: [
      "Personalizado",
    ],
  },
];

export function getPlatformById(id: string): PlatformInfo | undefined {
  return platforms.find((p) => p.id === id);
}

export function getPlatformForBotType(type: string): PlatformInfo | undefined {
  return platforms.find((p) => p.botType === type);
}

export function generateQuickStartGuide(platformId: string): string {
  const platform = getPlatformById(platformId);
  if (!platform) return "Plataforma não encontrada.";

  return `# ${platform.name} Quick Start

## 📋 Requisitos
${platform.requirements.map((r) => `- ${r}`).join("\n")}

## 🚀 Configuração
${platform.setupGuide.map((s) => `- ${s}`).join("\n")}

## 🔌 APIs
${platform.apis.map((a) => `- ${a}`).join("\n")}

## 🛠️ Comandos úteis

### Instalação:
\`\`\`bash
npm install
\`\`\`

### Desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

### Build:
\`\`\`bash
npm run build
\`\`\`

## ℹ️ Dicas
- Mantenha o token sempre seguro (use .env)
- Teste localmente antes de publicar
- Respeite os rate limits da plataforma
- Use logs para debugging`;
}

export function validatePlatformCredentials(platformId: string, credentials: Record<string, string>): { valid: boolean; errors: string[] } {
  const platform = getPlatformById(platformId);
  if (!platform) {
    return { valid: false, errors: ["Plataforma não encontrada"] };
  }

  const errors: string[] = [];
  
  switch (platformId) {
    case "discord":
      if (!credentials.token) errors.push("Token do Discord é obrigatório");
      break;
    case "whatsapp":
      if (!credentials.session) errors.push("Sessão do WhatsApp necessária");
      break;
    case "telegram":
      if (!credentials.token) errors.push("Token do Telegram é obrigatório");
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
