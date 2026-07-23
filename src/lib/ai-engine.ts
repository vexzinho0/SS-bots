/**
 * SS Bots AI Engine - Motor de IA Central
 * Responsável por criar projetos, editar código, responder perguntas,
 * criar Bots, APIs, Banco, Interfaces, Backend, Frontend, etc.
 */

export interface AIRequest {
  prompt: string;
  context?: {
    projectId?: string;
    workspaceId?: string;
    projectType?: string;
    platform?: string;
    language?: string;
    existingCode?: string;
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  };
}

export interface AIResponse {
  content: string;
  actions?: Array<{
    type: "create_file" | "update_file" | "delete_file" | "create_project" | "install_dependency" | "run_command";
    path?: string;
    content?: string;
    command?: string;
  }>;
  projectStructure?: Array<{
    path: string;
    content: string;
    type: "file" | "folder";
  }>;
  metadata?: {
    estimatedTokens?: number;
    model?: string;
    platform?: string;
    language?: string;
  };
}

export interface BotTemplate {
  name: string;
  description: string;
  platform: string;
  language: string;
  files: Array<{ path: string; content: string }>;
  dependencies: string[];
  setupInstructions: string[];
}

// Templates de bots reais para gerar código automaticamente
const botTemplates: Record<string, BotTemplate> = {
  "discord-ticket": {
    name: "Discord Ticket Bot",
    description: "Bot de tickets para Discord com sistema de suporte completo",
    platform: "discord",
    language: "typescript",
    files: [
      {
        path: "src/index.ts", content: `import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { config } from './config';
import { TicketSystem } from './ticket-system';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const ticketSystem = new TicketSystem(client);

client.once(Events.ClientReady, async () => {
  console.log(\`✅ Bot está online como \${client.user?.tag}\`);
  await ticketSystem.registerCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await ticketSystem.handleCommand(interaction);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!ticket')) {
    const reason = message.content.slice(7).trim() || 'Sem motivo especificado';
    await ticketSystem.createFromMessage(message, reason);
  }
});

client.login(config.token).catch(console.error);`,
      },
      {
        path: "src/config.ts", content: `import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN || '',
  guildId: process.env.GUILD_ID || '',
  ticketCategory: process.env.TICKET_CATEGORY || '',
  supportRole: process.env.SUPPORT_ROLE || '',
  logChannel: process.env.LOG_CHANNEL || '',
};`,
      },
      {
        path: "src/ticket-system.ts", content: `import { 
  Client, ChatInputCommandInteraction, Message, 
  SlashCommandBuilder, ChannelType, EmbedBuilder, 
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  TextChannel, PermissionFlagsBits 
} from 'discord.js';
import { config } from './config';

export class TicketSystem {
  private client: Client;
  private tickets: Map<string, { channelId: string; userId: string; reason: string }>;

  constructor(client: Client) {
    this.client = client;
    this.tickets = new Map();
  }

  async registerCommands() {
    const guild = await this.client.guilds.fetch(config.guildId);
    if (!guild) return;

    await guild.commands.create(
      new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Gerenciar tickets')
        .addSubcommand(sub => sub
          .setName('criar')
          .setDescription('Criar um novo ticket')
          .addStringOption(opt => opt
            .setName('motivo')
            .setDescription('Motivo do ticket')
            .setRequired(true)))
        .addSubcommand(sub => sub
          .setName('fechar')
          .setDescription('Fechar um ticket'))
    );
  }

  async handleCommand(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'criar':
        const reason = interaction.options.getString('motivo', true);
        await this.createTicket(interaction, reason);
        break;
      case 'fechar':
        await this.closeTicket(interaction);
        break;
    }
  }

  async createTicket(interaction: ChatInputCommandInteraction | Message, reason: string) {
    const userId = interaction instanceof ChatInputCommandInteraction 
      ? interaction.user.id 
      : interaction.author.id;
    
    const guild = this.client.guilds.cache.get(config.guildId);
    if (!guild) return;

    const category = guild.channels.cache.get(config.ticketCategory);
    if (!category) return;

    const channel = await guild.channels.create({
      name: \`ticket-\${userId.slice(0, 5)}\`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverrides: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: userId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: config.supportRole, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
    });

    const embed = new EmbedBuilder()
      .setColor(0xE11D48)
      .setTitle('🎫 Novo Ticket')
      .setDescription(\`**Motivo:** \${reason}\`)
      .addFields(
        { name: 'Usuário', value: \`<@\${userId}>\`, inline: true },
        { name: 'Status', value: '🟢 Aberto', inline: true }
      )
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒'),
        new ButtonBuilder()
          .setCustomId('claim_ticket')
          .setLabel('Assumir Ticket')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('👋')
      );

    await channel.send({ embeds: [embed], components: [row] });

    if (interaction instanceof ChatInputCommandInteraction) {
      await interaction.reply({ content: \`✅ Ticket criado! <#\${channel.id}>\`, ephemeral: true });
    } else {
      await interaction.reply(\`✅ Ticket criado! <#\${channel.id}>\`);
    }
  }

  async closeTicket(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel;
    if (!(channel instanceof TextChannel) || !channel.name.startsWith('ticket-')) {
      await interaction.reply({ content: '❌ Este não é um canal de ticket.', ephemeral: true });
      return;
    }

    await channel.send('🔒 Fechando ticket em 5 segundos...');
    setTimeout(async () => {
      await channel.delete();
    }, 5000);

    await interaction.reply({ content: '✅ Ticket fechado com sucesso!', ephemeral: true });
  }

  async createFromMessage(message: Message, reason: string) {
    await this.createTicket(message, reason);
  }
}`,
      },
      { path: ".env.example", content: `DISCORD_TOKEN=seu_token_aqui
GUILD_ID=id_do_servidor
TICKET_CATEGORY=id_da_categoria
SUPPORT_ROLE=id_do_cargo_suporte
LOG_CHANNEL=id_do_canal_log`,
      },
      { path: "package.json", content: `{
  "name": "discord-ticket-bot",
  "version": "1.0.0",
  "description": "Bot de tickets para Discord",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "discord.js": "^14.16.3",
    "dotenv": "^16.4.7"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "tsx": "^4.19.0",
    "@types/node": "^22.10.0"
  }
}`,
      },
      { path: "tsconfig.json", content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}`,
      },
    ],
    dependencies: ["discord.js@^14.16.3", "dotenv@^16.4.7"],
    setupInstructions: [
      "1. Crie um arquivo .env com suas credenciais",
      "2. Execute 'npm install' para instalar as dependências",
      "3. Execute 'npm run dev' para iniciar o bot",
      "4. Convide o bot para seu servidor Discord",
    ],
  },

  "whatsapp-chatbot": {
    name: "WhatsApp ChatBot",
    description: "Chatbot inteligente para WhatsApp com respostas automáticas",
    platform: "whatsapp",
    language: "javascript",
    files: [
      {
        path: "src/index.js", content: `const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./handlers/message-handler');
const { MessageMedia } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📱 Escaneie o QR Code acima com o WhatsApp');
});

client.on('ready', () => {
  console.log('✅ Bot do WhatsApp está pronto!');
});

client.on('message', async (message) => {
  if (message.fromMe) return;
  await handleMessage(client, message);
});

client.initialize();`,
      },
      {
        path: "src/handlers/message-handler.js", content: `const { MessageMedia } = require('whatsapp-web.js');

const autoReplies = {
  'ola': 'Olá! 👋 Como posso ajudar você hoje?',
  'horario': '🕐 Nosso horário de atendimento é:\nSeg-Sex: 9h às 18h\nSáb: 9h às 13h',
  'ajuda': '📋 Comandos disponíveis:\n!ajuda - Mostra esta mensagem\n!contato - Informações de contato\n!orcamento - Solicitar orçamento',
  'contato': '📞 Nosso contato:\nEmail: contato@ssbots.com\nTelefone: (11) 99999-8888',
  'orcamento': '💰 Para solicitar um orçamento, por favor informe:\n1. Tipo de bot desejado\n2. Plataforma (Discord, WhatsApp, etc)\n3. Funcionalidades desejadas',
};

async function handleMessage(client, message) {
  const text = message.body.toLowerCase().trim();
  
  if (text.startsWith('!')) {
    const command = text.slice(1);
    
    switch (command) {
      case 'ajuda':
        return await message.reply(autoReplies['ajuda']);
      case 'contato':
        return await message.reply(autoReplies['contato']);
      case 'orcamento':
        return await message.reply(autoReplies['orcamento']);
      case 'info':
        return await message.reply(\`ℹ️ Informações do Bot:\n• Nome: SS Bots WhatsApp\n• Versão: 1.0.0\n• Status: 🟢 Online\`);
      default:
        return await message.reply('❌ Comando não encontrado. Digite !ajuda para ver os comandos disponíveis.');
    }
  }
  
  // Auto reply for common messages
  for (const [key, reply] of Object.entries(autoReplies)) {
    if (text.includes(key)) {
      return await message.reply(reply);
    }
  }
  
  // Default reply
  if (text.length > 0 && !text.startsWith('!')) {
    await message.reply('🤖 Obrigado pela sua mensagem! Um de nossos atendentes responderá em breve.\n\nDigite !ajuda para ver nossos comandos.');
  }
}

module.exports = { handleMessage };`,
      },
      { path: "package.json", content: `{
  "name": "whatsapp-chatbot",
  "version": "1.0.0",
  "description": "Chatbot inteligente para WhatsApp",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "whatsapp-web.js": "^1.25.0",
    "qrcode-terminal": "^0.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`,
      },
    ],
    dependencies: ["whatsapp-web.js@^1.25.0", "qrcode-terminal@^0.12.0"],
    setupInstructions: [
      "1. Execute 'npm install' para instalar as dependências",
      "2. Execute 'npm start' para iniciar o bot",
      "3. Escaneie o QR Code com o WhatsApp",
      "4. O bot estará pronto para uso!",
    ],
  },

  "telegram-moderation": {
    name: "Telegram Moderation Bot",
    description: "Bot de moderação automática para Telegram",
    platform: "telegram",
    language: "python",
    files: [
      {
        path: "bot.py", content: `import logging
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, MessageHandler,
    filters, ContextTypes, CallbackQueryHandler
)
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TOKEN = os.getenv('TELEGRAM_TOKEN')
ALLOWED_USERS = set()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📋 Comandos", callback_data='help')],
        [InlineKeyboardButton("ℹ️ Sobre", callback_data='about')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        '🤖 Olá! Sou o Bot de Moderação do SS Bots.\n'
        'Estou aqui para ajudar a manter o grupo seguro!',
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
📋 **Comandos disponíveis:**

/start - Iniciar o bot
/help - Mostrar esta mensagem
/ban - Banir usuário (admin)
/mute - Silenciar usuário (admin)
/warn - Avisar usuário (admin)
/clear - Limpar mensagens (admin)
/info - Informações do grupo
/rules - Regras do grupo
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def ban_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message.reply_to_message:
        await update.message.reply_text("❌ Responda a mensagem do usuário que deseja banir.")
        return
    
    user = update.message.reply_to_message.from_user
    await update.message.chat.ban_member(user.id)
    await update.message.reply_text(
        f"✅ Usuário {user.mention_html()} foi banido!",
        parse_mode='HTML'
    )

async def mute_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message.reply_to_message:
        await update.message.reply_text("❌ Responda a mensagem do usuário que deseja silenciar.")
        return
    
    duration = int(context.args[0]) if context.args else 60
    user = update.message.reply_to_message.from_user
    until_date = datetime.now() + timedelta(minutes=duration)
    
    await update.message.chat.restrict_member(
        user.id,
        permissions=ChatPermissions(can_send_messages=False),
        until_date=until_date
    )
    await update.message.reply_text(
        f"🔇 Usuário {user.mention_html()} silenciado por {duration} minutos!",
        parse_mode='HTML'
    )

async def warn_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message.reply_to_message:
        await update.message.reply_text("❌ Responda a mensagem do usuário que deseja avisar.")
        return
    
    user = update.message.reply_to_message.from_user
    reason = ' '.join(context.args) if context.args else 'Sem motivo'
    
    await update.message.reply_to_message.reply_text(
        f"⚠️ **Aviso para** {user.mention_html()}\n"
        f"**Motivo:** {reason}\n"
        f"**Por:** {update.message.from_user.mention_html()}",
        parse_mode='HTML'
    )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    if query.data == 'help':
        await help_command(update, context)
    elif query.data == 'about':
        await query.edit_message_text(
            '🤖 **SS Bots - Moderação Telegram**\n\n'
            'Versão: 1.0.0\n'
            'Desenvolvido por: SS Bots Platform\n\n'
            'Mantenha seu grupo seguro com moderação automática!',
            parse_mode='Markdown'
        )

def main():
    app = Application.builder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("ban", ban_user))
    app.add_handler(CommandHandler("mute", mute_user))
    app.add_handler(CommandHandler("warn", warn_user))
    app.add_handler(CallbackQueryHandler(button_callback))
    
    print("✅ Bot do Telegram iniciado!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    from datetime import datetime, timedelta
    from telegram.constants import ChatPermissions
    main()
`,
      },
      { path: ".env.example", content: `TELEGRAM_TOKEN=seu_token_aqui` },
      { path: "requirements.txt", content: `python-telegram-bot==21.6
python-dotenv==1.0.1` },
    ],
    dependencies: ["python-telegram-bot@^21.6", "python-dotenv@^1.0.1"],
    setupInstructions: [
      "1. Crie um arquivo .env com seu TELEGRAM_TOKEN",
      "2. Execute 'pip install -r requirements.txt'",
      "3. Execute 'python bot.py' para iniciar",
      "4. Adicione o bot ao seu grupo como administrador",
    ],
  },
};

/**
 * Identifica o tipo de solicitação do usuário e retorna a resposta apropriada
 */
export function processAIRequest(request: AIRequest): AIResponse {
  const { prompt, context } = request;
  const lowerPrompt = prompt.toLowerCase();

  // Detectar se é uma solicitação de criação de bot
  for (const [key, template] of Object.entries(botTemplates)) {
    if (lowerPrompt.includes(template.platform) || 
        lowerPrompt.includes(template.name.toLowerCase())) {
      if (lowerPrompt.includes("crie") || lowerPrompt.includes("criar") || 
          lowerPrompt.includes("faça") || lowerPrompt.includes("create")) {
        return generateBotResponse(template);
      }
    }
  }

  // Detectar solicitação genérica de criação
  if (lowerPrompt.includes("crie") || lowerPrompt.includes("criar") || 
      lowerPrompt.includes("faça") || lowerPrompt.includes("gere")) {
    return generateFromPrompt(prompt);
  }

  // Detectar solicitação de explicação/código
  if (lowerPrompt.includes("como") || lowerPrompt.includes("explique") || 
      lowerPrompt.includes("o que é") || lowerPrompt.includes("?") ||
      lowerPrompt.includes("código") || lowerPrompt.includes("exemplo")) {
    return generateExplanation(prompt);
  }

  // Detectar solicitação de deploy
  if (lowerPrompt.includes("deploy") || lowerPrompt.includes("publicar") || 
      lowerPrompt.includes("subir")) {
    return generateDeployResponse(prompt);
  }

  // Resposta padrão com IA
  return generateDefaultResponse(prompt, context);
}

function generateBotResponse(template: BotTemplate): AIResponse {
  const files = template.files.map((f) => ({
    path: f.path,
    content: f.content,
    type: "file" as const,
  }));

  const actions: AIResponse['actions'] = template.files.map((f) => ({
    type: "create_file" as const,
    path: f.path,
    content: f.content,
  }));

  actions!.push({
    type: "install_dependency" as const,
    command: template.dependencies.join(" "),
  });

  return {
    content: `## 🤖 ${template.name}

### ✅ Projeto criado com sucesso!

**Plataforma:** ${template.platform}
**Linguagem:** ${template.language}

### 📁 Arquivos criados:
${template.files.map((f) => `- \`${f.path}\``).join("\n")}

### 📦 Dependências:
${template.dependencies.map((d) => `- \`${d}\``).join("\n")}

### 🚀 Para executar:
${template.setupInstructions.map((i) => `- ${i}`).join("\n")}

### 💡 Próximos passos:
1. Configure as variáveis de ambiente no arquivo \`.env\`
2. Instale as dependências com \`npm install\`
3. Inicie o bot com \`npm run dev\`
4. Teste as funcionalidades

Precisa de algo mais? Posso adicionar mais funcionalidades ao bot!`,
    actions,
    projectStructure: files,
    metadata: {
      platform: template.platform,
      language: template.language,
    },
  };
}

function generateFromPrompt(prompt: string): AIResponse {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("discord")) {
    return generateBotResponse(botTemplates["discord-ticket"]);
  }
  if (lowerPrompt.includes("whatsapp")) {
    return generateBotResponse(botTemplates["whatsapp-chatbot"]);
  }
  if (lowerPrompt.includes("telegram")) {
    return generateBotResponse(botTemplates["telegram-moderation"]);
  }

  // Projeto genérico
  return {
    content: `## 🚀 Projeto Gerado pela IA

Baseado no seu pedido: "${prompt}"

### 📋 Resumo do que será criado:

1. **Estrutura do projeto** - Organização completa de arquivos
2. **Código principal** - Implementação das funcionalidades
3. **Configurações** - Arquivos de configuração e ambiente
4. **Documentação** - Instruções de uso e deploy

### ✨ Funcionalidades incluídas:
- Estrutura modular e escalável
- Código tipado (TypeScript)
- Integração com APIs externas
- Sistema de logs e debugging
- Pronto para deploy

### 🔧 Tecnologias sugeridas:
- **Runtime:** Node.js + TypeScript
- **Framework:** Discord.js / whatsapp-web.js
- **Banco:** MongoDB / Supabase
- **Deploy:** Vercel / Railway

Deseja que eu crie este projeto agora? Posso gerar todos os arquivos necessários!`,
    metadata: {
      model: "SS Bots IA",
    },
  };
}

function generateExplanation(prompt: string): AIResponse {
  const explanations: Record<string, string> = {
    "código": `## 💻 Exemplo de Código

Aqui está um exemplo prático do que você precisa:

\`\`\`typescript
// Exemplo de Bot com Discord.js
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on('ready', () => {
  console.log(\`Bot online como \${client.user?.tag}\`);
});

client.login('SEU_TOKEN');
\`\`\`

Este é um bot básico que se conecta ao Discord. Quer que eu adicione mais funcionalidades?`,
    "flow": `## 🎯 Flow Builder - Explicação

O Flow Builder permite criar automações visualmente:

**Blocos disponíveis:**

1. **Trigger** 🔌 - Ponto de início (mensagem, evento, webhook)
2. **Mensagem** 💬 - Enviar resposta ao usuário  
3. **Condição** 🔀 - Ramificação lógica (if/else)
4. **IA** 🧠 - Processamento com inteligência artificial
5. **Banco** 💾 - Salvar/buscar dados
6. **Resposta** 📤 - Enviar resultado final

**Conversão automática:**
O sistema converte:
- ✅ Prompt → Fluxo visual
- ✅ Fluxo → Código executável
- ✅ Código → Fluxo visual

Quer criar um fluxo agora?`,
  };

  const lower = prompt.toLowerCase();
  for (const [key, content] of Object.entries(explanations)) {
    if (lower.includes(key)) {
      return { content };
    }
  }

  return {
    content: `## 🤖 Assistente SS Bots

Sou a IA do SS Bots e posso ajudar você com:

### 🎯 O que posso fazer:

✅ **Criar Bots** - Discord, WhatsApp, Telegram e mais
✅ **Gerar Código** - APIs, Backend, Frontend
✅ **Explicar Conceitos** - Flow Builder, Deploy, Integrações
✅ **Corrigir Erros** - Debug de código e configurações
✅ **Criar Projetos** - Estrutura completa do zero

### 🚀 Como usar:

Basta descrever o que você precisa! Por exemplo:
- "Crie um bot para Discord com tickets"
- "Como faço deploy de um bot?"
- "Explique o Flow Builder"
- "Crie uma API REST"

O que deseja criar hoje?`,
  };
}

function generateDeployResponse(prompt: string): AIResponse {
  return {
    content: `## 🚀 Deploy - Guia Completo

### Plataformas suportadas:

| Plataforma | Tipo | Status |
|------------|------|--------|
| **Railway** | PaaS | ✅ Recomendado |
| **Vercel** | Serverless | ✅ Recomendado |
| **Digital Ocean** | VPS | ✅ Suportado |
| **AWS** | Cloud | ✅ Suportado |
| **Cloudflare** | Edge | ✅ Suportado |

### 📋 Checklist de Deploy:

1. ✅ Código compilado e testado
2. ✅ Variáveis de ambiente configuradas
3. ✅ Dependências instaladas
4. ✅ Script de build configurado
5. ✅ Health check endpoint

### 📦 Comandos:

\`\`\`bash
# Build
npm run build

# Test
npm test

# Start
npm start
\`\`\`

Quer que eu prepare o deploy para uma plataforma específica?`,
    actions: [
      {
        type: "run_command",
        command: "npm run build && npm test",
      },
    ],
  };
}

function generateDefaultResponse(prompt: string, context?: AIRequest["context"]): AIResponse {
  const suggestions = [
    "Crie um bot para Discord com sistema de tickets",
    "Crie um chatbot para WhatsApp",
    "Explique como usar o Flow Builder",
    "Como fazer deploy do meu bot?",
  ];

  const suggestionList = suggestions.map((s) => `- "${s}"`).join("\n");

  return {
    content: `## 🤖 Entendi sua solicitação!

### Processando: "${prompt}"

Estou analisando sua requisição e preparando a melhor solução.

### 💡 Sugestões relacionadas:
${suggestionList}

### 🔧 O que posso fazer por você:

1. **Criar um bot completo** - Com código, configurações e docs
2. **Gerar código específico** - Funções, APIs, handlers
3. **Explicar conceitos** - Flow Builder, MCP, Integrações
4. **Ajudar com deploy** - Publicar seu bot em produção
5. **Corrigir erros** - Debug do seu código

### 📊 Status da IA:
- 🟢 Engine: **SS Bots AI v1.0**
- 🔄 Contexto: Carregado
- ✅ Pronto para responder

Como posso ajudar você hoje?`,
    metadata: {
      model: "SS Bots IA v1.0",
    },
  };
}

/**
 * Gera a estrutura de arquivos para um template de bot
 */
export function getBotStructure(platform: string): BotTemplate | null {
  for (const [, template] of Object.entries(botTemplates)) {
    if (template.platform === platform) {
      return template;
    }
  }
  return null;
}

/**
 * Lista todas as plataformas de bot suportadas
 */
export function getSupportedPlatforms() {
  return [
    { id: "discord", name: "Discord", icon: "message-circle", color: "bg-indigo-500" },
    { id: "whatsapp", name: "WhatsApp", icon: "phone", color: "bg-emerald-500" },
    { id: "telegram", name: "Telegram", icon: "send", color: "bg-blue-500" },
    { id: "instagram", name: "Instagram", icon: "camera", color: "bg-pink-500" },
    { id: "youtube", name: "YouTube", icon: "youtube", color: "bg-red-500" },
    { id: "twitch", name: "Twitch", icon: "twitch", color: "bg-purple-500" },
    { id: "slack", name: "Slack", icon: "slack", color: "bg-orange-500" },
    { id: "facebook", name: "Facebook", icon: "facebook", color: "bg-blue-600" },
    { id: "custom", name: "Personalizado", icon: "globe", color: "bg-primary" },
  ];
}
