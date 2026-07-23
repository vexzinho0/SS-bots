/**
 * SS Bots Code Generator
 * Gera código real para Bots, APIs, Backend, Frontend, Banco de Dados
 */

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface CodeGenerationRequest {
  type: "bot" | "api" | "backend" | "frontend" | "database" | "fullstack";
  platform?: string;
  language?: string;
  name: string;
  features?: string[];
  database?: string;
  framework?: string;
}

export interface CodeGenerationResult {
  files: GeneratedFile[];
  dependencies: string[];
  setupCommands: string[];
  readme: string;
}

export function generateCode(request: CodeGenerationRequest): CodeGenerationResult {
  switch (request.type) {
    case "bot":
      return generateBotCode(request);
    case "api":
      return generateAPICode(request);
    case "backend":
      return generateBackendCode(request);
    case "frontend":
      return generateFrontendCode(request);
    case "database":
      return generateDatabaseCode(request);
    case "fullstack":
      return generateFullstackCode(request);
    default:
      return generateBotCode(request);
  }
}

function generateBotCode(request: CodeGenerationRequest): CodeGenerationResult {
  const platform = request.platform || "discord";
  const lang = request.language || "typescript";
  const name = request.name.toLowerCase().replace(/\s+/g, "-");

  if (platform === "discord") {
    return generateDiscordBot(name, lang);
  } else if (platform === "whatsapp") {
    return generateWhatsAppBot(name, lang);
  } else if (platform === "telegram") {
    return generateTelegramBot(name, lang);
  }

  // Generic bot template
  return {
    files: [
      {
        path: "src/index.ts",
        language: "typescript",
        content: `import { EventEmitter } from 'events';

export class ${request.name.replace(/\s+/g, "")}Bot extends EventEmitter {
  private token: string;
  private platform: string;
  private isRunning: boolean = false;

  constructor(token: string, platform: string) {
    super();
    this.token = token;
    this.platform = platform;
  }

  async start(): Promise<void> {
    console.log(\`[INFO] Iniciando bot: \${this.platform}\`);
    this.isRunning = true;
    this.emit('ready');
    console.log(\`[INFO] Bot \${this.platform} está online!\`);
  }

  async stop(): Promise<void> {
    console.log(\`[INFO] Parando bot: \${this.platform}\`);
    this.isRunning = false;
    this.emit('stop');
  }

  getStatus(): { platform: string; running: boolean } {
    return { platform: this.platform, running: this.isRunning };
  }
}
`,
      },
    ],
    dependencies: ["typescript@^5.7.2", "@types/node@^22.10.0"],
    setupCommands: ["npm install", "npm run build"],
    readme: `# ${request.name}\n\nBot criado com SS Bots Platform.\n`,
  };
}

function generateDiscordBot(name: string, lang: string): CodeGenerationResult {
  const className = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");

  return {
    files: [
      {
        path: "src/index.ts",
        language: "typescript",
        content: `import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { config } from './config';
import { ${className}Handler } from './handler';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const handler = new ${className}Handler(client);

client.once(Events.ClientReady, async () => {
  console.log(\`✅ \${config.name} está online como \${client.user?.tag}\`);
  await handler.registerCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  await handler.handleInteraction(interaction);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  await handler.handleMessage(message);
});

client.login(config.token).catch((error) => {
  console.error('❌ Erro ao conectar:', error);
  process.exit(1);
});
`,
      },
      {
        path: "src/config.ts",
        language: "typescript",
        content: `import dotenv from 'dotenv';
dotenv.config();

export const config = {
  name: '${name}',
  token: process.env.DISCORD_TOKEN || '',
  prefix: process.env.PREFIX || '!',
  guildId: process.env.GUILD_ID || '',
  logChannel: process.env.LOG_CHANNEL || '',
};
`,
      },
      {
        path: "src/handler.ts",
        language: "typescript",
        content: `import { Client, ChatInputCommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import { config } from './config';

export class ${className}Handler {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async registerCommands() {
    const guild = await this.client.guilds.fetch(config.guildId);
    if (!guild) return;

    await guild.commands.set([
      new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Verificar latência do bot'),
      new SlashCommandBuilder()
        .setName('info')
        .setDescription('Informações do bot'),
    ]);
  }

  async handleInteraction(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
      case 'ping':
        const latency = Date.now() - interaction.createdTimestamp;
        await interaction.reply(\`🏓 Pong! Latência: \${latency}ms\`);
        break;
      case 'info':
        await interaction.reply({
          content: \`ℹ️ **\${config.name}**\\nVersão: 1.0.0\\nStatus: 🟢 Online\`,
          ephemeral: true,
        });
        break;
    }
  }

  async handleMessage(message: Message) {
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/\\s+/);
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case 'ping':
        await message.reply('Pong! 🏓');
        break;
      case 'help':
        await message.reply(
          \`📋 **Comandos disponíveis:**\\n\` +
          \`\${config.prefix}ping - Verificar resposta\\n\` +
          \`\${config.prefix}help - Mostrar ajuda\\n\` +
          \`/ping - Comando slash\\n\` +
          \`/info - Informações do bot\`
        );
        break;
    }
  }
}
`,
      },
      {
        path: ".env.example",
        language: "text",
        content: `DISCORD_TOKEN=seu_token_aqui
GUILD_ID=id_do_servidor
PREFIX=!
LOG_CHANNEL=id_do_canal`,
      },
      {
        path: "package.json",
        language: "json",
        content: JSON.stringify({
          name,
          version: "1.0.0",
          description: `Bot ${name} para Discord`,
          main: "dist/index.js",
          scripts: {
            dev: "tsx watch src/index.ts",
            build: "tsc",
            start: "node dist/index.js",
          },
          dependencies: {
            "discord.js": "^14.16.3",
            dotenv: "^16.4.7",
          },
          devDependencies: {
            typescript: "^5.7.2",
            tsx: "^4.19.0",
            "@types/node": "^22.10.0",
          },
        }, null, 2),
      },
      {
        path: "tsconfig.json",
        language: "json",
        content: JSON.stringify({
          compilerOptions: {
            target: "ES2022",
            module: "commonjs",
            lib: ["ES2022"],
            outDir: "./dist",
            rootDir: "./src",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            resolveJsonModule: true,
          },
          include: ["src/**/*"],
        }, null, 2),
      },
    ],
    dependencies: ["discord.js@^14.16.3", "dotenv@^16.4.7", "typescript@^5.7.2"],
    setupCommands: ["npm install", "cp .env.example .env", "npm run dev"],
    readme: `# ${name}\n\nBot para Discord criado com SS Bots Platform.\n\n## Configuração\n\n1. Copie \`.env.example\` para \`.env\` e preencha as credenciais\n2. Execute \`npm install\`\n3. Execute \`npm run dev\` para iniciar\n`,
  };
}

function generateWhatsAppBot(name: string, lang: string): CodeGenerationResult {
  return {
    files: [
      {
        path: "src/index.js",
        language: "javascript",
        content: `const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { MessageHandler } = require('./handler');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] },
});

const handler = new MessageHandler(client);

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📱 Escaneie o QR Code com o WhatsApp');
});

client.on('ready', () => {
  console.log('✅ Bot do WhatsApp está pronto!');
  console.log(\`📱 Número: \${client.info?.wid?.user || 'Desconhecido'}\`);
});

client.on('message', async (message) => {
  if (message.fromMe) return;
  await handler.process(message);
});

client.on('disconnected', (reason) => {
  console.log('❌ Bot desconectado:', reason);
});

client.initialize();
`,
      },
      {
        path: "src/handler.js",
        language: "javascript",
        content: `class MessageHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.initializeCommands();
  }

  initializeCommands() {
    this.commands.set('ajuda', {
      description: 'Mostra ajuda',
      execute: async (message) => {
        return message.reply(
          '📋 *Comandos disponíveis:*\\n\\n' +
          '!ajuda - Mostrar ajuda\\n' +
          '!info - Info do bot\\n' +
          '!status - Status do sistema'
        );
      }
    });

    this.commands.set('info', {
      description: 'Info do bot',
      execute: async (message) => {
        return message.reply(
          '🤖 *Informações do Bot*\\n\\n' +
          \`📱 Nome: ${name}\\n\` +
          '🔄 Status: Online\\n' +
          '⚡ Plataforma: SS Bots'
        );
      }
    });

    this.commands.set('status', {
      description: 'Status do sistema',
      execute: async (message) => {
        const mem = process.memoryUsage();
        return message.reply(
          '📊 *Status do Sistema*\\n\\n' +
          \`💾 RAM: \${(mem.heapUsed / 1024 / 1024).toFixed(2)}MB\\n\` +
          \`⏰ Uptime: \${Math.floor(process.uptime())}s\\n\` +
          '🟢 Status: Operacional'
        );
      }
    });
  }

  async process(message) {
    const text = message.body?.toLowerCase().trim() || '';
    
    if (text.startsWith('!')) {
      const commandName = text.slice(1).split(' ')[0];
      const command = this.commands.get(commandName);
      
      if (command) {
        try {
          await command.execute(message);
        } catch (error) {
          console.error('Erro no comando:', error);
          await message.reply('❌ Erro ao executar comando.');
        }
      } else {
        await message.reply('❌ Comando não encontrado. Digite !ajuda');
      }
      return;
    }

    // Auto-reply for common messages
    if (text.includes('ola') || text.includes('oi')) {
      await message.reply('Olá! 👋 Como posso ajudar?');
    } else if (text.length > 0) {
      await message.reply(
        '🤖 Obrigado pela mensagem! Em breve responderemos.\\n\\n' +
        'Digite *!ajuda* para ver os comandos disponíveis.'
      );
    }
  }
}

module.exports = { MessageHandler };
`,
      },
      {
        path: "package.json",
        language: "json",
        content: JSON.stringify({
          name: name,
          version: "1.0.0",
          description: `Bot ${name} para WhatsApp`,
          main: "src/index.js",
          scripts: {
            start: "node src/index.js",
            dev: "nodemon src/index.js",
          },
          dependencies: {
            "whatsapp-web.js": "^1.25.0",
            "qrcode-terminal": "^0.12.0",
          },
          devDependencies: {
            nodemon: "^3.1.0",
          },
        }, null, 2),
      },
    ],
    dependencies: ["whatsapp-web.js@^1.25.0", "qrcode-terminal@^0.12.0"],
    setupCommands: ["npm install", "npm start"],
    readme: `# ${name}\n\nBot para WhatsApp criado com SS Bots.\n\n## Como usar\n\n1. Execute \`npm install\`\n2. Execute \`npm start\`\n3. Escaneie o QR Code\n`,
  };
}

function generateTelegramBot(name: string, lang: string): CodeGenerationResult {
  return {
    files: [
      {
        path: "bot.py",
        language: "python",
        content: `import logging
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
BOT_NAME = '${name}'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📋 Comandos", callback_data='help')],
        [InlineKeyboardButton("ℹ️ Sobre", callback_data='about')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f'🤖 Olá! Sou o {BOT_NAME}\\n'
        f'Criado com SS Bots Platform!',
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
📋 **Comandos disponíveis:**

/start - Iniciar o bot
/help - Mostrar ajuda
/info - Informações do bot
/ping - Verificar resposta
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def ping(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Pong! 🏓')

async def info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f'ℹ️ **{BOT_NAME}**\\n\\n'
        f'Versão: 1.0.0\\n'
        f'Plataforma: SS Bots\\n'
        f'Status: 🟢 Online',
        parse_mode='Markdown'
    )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    if query.data == 'help':
        await help_command(update, context)
    elif query.data == 'about':
        await query.edit_message_text(
            f'🤖 **{BOT_NAME}**\\n\\n'
            f'Criado com SS Bots Platform\\n'
            f'Versão: 1.0.0\\n\\n'
            f'Desenvolvido para automação inteligente!',
            parse_mode='Markdown'
        )

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(update.message.text)

def main():
    app = Application.builder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("ping", ping))
    app.add_handler(CommandHandler("info", info))
    app.add_handler(CallbackQueryHandler(button_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    print(f"✅ {BOT_NAME} iniciado!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
`,
      },
      {
        path: ".env.example",
        language: "text",
        content: `TELEGRAM_TOKEN=seu_token_aqui`,
      },
      {
        path: "requirements.txt",
        language: "text",
        content: `python-telegram-bot==21.6
python-dotenv==1.0.1`,
      },
    ],
    dependencies: ["python-telegram-bot@^21.6", "python-dotenv@^1.0.1"],
    setupCommands: ["pip install -r requirements.txt", "cp .env.example .env", "python bot.py"],
    readme: `# ${name}\n\nBot para Telegram criado com SS Bots.\n\n## Configuração\n\n1. Copie \`.env.example\` para \`.env\`\n2. Instale dependências: \`pip install -r requirements.txt\`\n3. Execute: \`python bot.py\`\n`,
  };
}

function generateAPICode(request: CodeGenerationRequest): CodeGenerationResult {
  return {
    files: [
      {
        path: "src/index.ts",
        language: "typescript",
        content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`✅ API rodando na porta \${PORT}\`);
});

export default app;
`,
      },
      {
        path: "package.json",
        language: "json",
        content: JSON.stringify({
          name: request.name.toLowerCase().replace(/\s+/g, "-") + "-api",
          version: "1.0.0",
          description: `API ${request.name}`,
          main: "dist/index.js",
          scripts: { dev: "tsx watch src/index.ts", build: "tsc", start: "node dist/index.js" },
          dependencies: { express: "^4.21.0", cors: "^2.8.5", helmet: "^8.0.0" },
          devDependencies: { typescript: "^5.7.2", tsx: "^4.19.0", "@types/node": "^22.10.0", "@types/express": "^5.0.0" },
        }, null, 2),
      },
    ],
    dependencies: ["express@^4.21.0", "cors@^2.8.5", "helmet@^8.0.0"],
    setupCommands: ["npm install", "npm run dev"],
    readme: `# ${request.name} API\n\nAPI criada com SS Bots Platform.\n`,
  };
}

function generateBackendCode(request: CodeGenerationRequest): CodeGenerationResult {
  return {
    files: [
      {
        path: "src/server.ts",
        language: "typescript",
        content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(PORT, () => {
  console.log(\`✅ Backend rodando na porta \${PORT}\`);
});
`,
      },
      {
        path: "src/routes.ts",
        language: "typescript",
        content: `import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/users', (req: Request, res: Response) => {
  res.json({ users: [], total: 0 });
});

router.post('/users', (req: Request, res: Response) => {
  res.status(201).json({ message: 'User created', user: req.body });
});
`,
      },
      {
        path: "package.json",
        language: "json",
        content: JSON.stringify({ name: "backend", version: "1.0.0", dependencies: { express: "^4.21.0", cors: "^2.8.5", helmet: "^8.0.0" }, devDependencies: { typescript: "^5.7.2", tsx: "^4.19.0", "@types/node": "^22.10.0", "@types/express": "^5.0.0" } }),
      },
    ],
    dependencies: ["express@^4.21.0", "cors@^2.8.5", "helmet@^8.0.0"],
    setupCommands: ["npm install", "npm run dev"],
    readme: `# ${request.name} Backend\n\nBackend criado com SS Bots.\n`,
  };
}

function generateFrontendCode(request: CodeGenerationRequest): CodeGenerationResult {
  return {
    files: [
      {
        path: "src/App.tsx",
        language: "typescript",
        content: `import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>${request.name}</h1>
      <p>Projeto criado com SS Bots Platform</p>
    </div>
  );
}

export default App;
`,
      },
      {
        path: "src/index.tsx",
        language: "typescript",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
`,
      },
      {
        path: "package.json",
        language: "json",
        content: JSON.stringify({ name: "frontend", version: "1.0.0", dependencies: { react: "^18.3.1", "react-dom": "^18.3.1" }, devDependencies: { typescript: "^5.7.2", "@vitejs/plugin-react": "^4.3.0", vite: "^6.0.0" } }),
      },
    ],
    dependencies: ["react@^18.3.1", "react-dom@^18.3.1"],
    setupCommands: ["npm install", "npm run dev"],
    readme: `# ${request.name} Frontend\n\nFrontend criado com SS Bots.\n`,
  };
}

function generateDatabaseCode(request: CodeGenerationRequest): CodeGenerationResult {
  const db = request.database || "mongodb";
  if (db === "mongodb") {
    return {
      files: [
        {
          path: "src/database.ts",
          language: "typescript",
          content: `import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/${request.name.toLowerCase().replace(/\s+/g, "_")}';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    process.exit(1);
  }
}

export { mongoose };
`,
        },
        {
          path: "src/models/User.ts",
          language: "typescript",
          content: `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
`,
        },
        {
          path: "package.json",
          language: "json",
          content: JSON.stringify({ name: "database", version: "1.0.0", dependencies: { mongoose: "^8.9.0" }, devDependencies: { typescript: "^5.7.2", "@types/node": "^22.10.0" } }),
        },
      ],
      dependencies: ["mongoose@^8.9.0"],
      setupCommands: ["npm install"],
      readme: `# Database ${request.name}\n\nSchema criado com SS Bots.\n`,
    };
  }

  return {
    files: [
      {
        path: "schema.sql",
        language: "sql",
        content: `-- Database schema for ${request.name}
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
`,
      },
    ],
    dependencies: [],
    setupCommands: [],
    readme: `# Database ${request.name}\n`,
  };
}

function generateFullstackCode(request: CodeGenerationRequest): CodeGenerationResult {
  const bot = generateBackendCode(request);
  const frontend = generateFrontendCode(request);
  return {
    files: [...bot.files, ...frontend.files],
    dependencies: [...new Set([...bot.dependencies, ...frontend.dependencies])],
    setupCommands: [...new Set([...bot.setupCommands, ...frontend.setupCommands])],
    readme: `# ${request.name}\n\nProjeto Fullstack criado com SS Bots.\n`,
  };
}
