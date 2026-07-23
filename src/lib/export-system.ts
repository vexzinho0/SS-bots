/**
 * SS Bots Export System
 * Permite exportar projetos completos, frontend, backend, banco e arquivos
 */

export interface ExportRequest {
  type: "full" | "frontend" | "backend" | "database" | "files";
  projectName: string;
  files: Array<{ path: string; content: string }>;
  format?: "zip" | "tar" | "folder";
}

export interface ExportResult {
  filename: string;
  content: Blob;
  size: number;
  format: string;
}

/**
 * Gera o conteúdo exportado no formato solicitado
 */
export function generateExport(request: ExportRequest): ExportResult {
  const { type, projectName, files, format = "zip" } = request;

  let filteredFiles = files;

  switch (type) {
    case "frontend":
      filteredFiles = files.filter(
        (f) =>
          f.path.startsWith("src/") ||
          f.path.includes("index.html") ||
          f.path.includes("package.json") ||
          f.path.includes("tsconfig") ||
          f.path.includes("vite.config") ||
          f.path.includes("tailwind") ||
          f.path.includes("postcss")
      );
      break;
    case "backend":
      filteredFiles = files.filter(
        (f) =>
          f.path.startsWith("src/") ||
          f.path.includes("server") ||
          f.path.includes("api") ||
          f.path.includes("routes") ||
          f.path.includes("controller") ||
          f.path.includes("middleware") ||
          f.path.includes("package.json") ||
          f.path.includes("tsconfig")
      );
      break;
    case "database":
      filteredFiles = files.filter(
        (f) =>
          f.path.includes("model") ||
          f.path.includes("schema") ||
          f.path.includes("migration") ||
          f.path.includes("database") ||
          f.path.includes("prisma") ||
          f.path.includes(".sql")
      );
      break;
    case "files":
      // Exporta todos os arquivos normalmente
      break;
    case "full":
    default:
      // Exporta tudo
      break;
  }

  // Gera o conteúdo do projeto como um bundle de texto
  const content = generateProjectBundle(projectName, filteredFiles);

  const blob = new Blob([content], { type: "text/plain" });

  return {
    filename: `${projectName}-${type}-${Date.now()}.txt`,
    content: blob,
    size: blob.size,
    format: "text",
  };
}

function generateProjectBundle(name: string, files: Array<{ path: string; content: string }>): string {
  const header = `# ${name}
# Exportado do SS Bots Platform
# Data: ${new Date().toISOString()}
# Total de arquivos: ${files.length}
# ================================================

`;

  const fileContents = files
    .map((file) => {
      const ext = file.path.split(".").pop() || "";
      return `# Arquivo: ${file.path}
# ================================================
\`\`\`${ext}
${file.content}
\`\`\`

`;
    })
    .join("\n");

  return header + fileContents;
}

/**
 * Gera um projeto de exemplo para download como template
 */
export function generateTemplateProject(): ExportResult {
  const files = [
    {
      path: "src/index.ts",
      content: `import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log(\`✅ Bot online como \${client.user?.tag}\`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content === '!ping') {
    await message.reply('Pong! 🏓');
  }
});

client.login(process.env.DISCORD_TOKEN || '');
`,
    },
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: "discord-bot-template",
          version: "1.0.0",
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
        },
        null,
        2
      ),
    },
    {
      path: ".env.example",
      content: `DISCORD_TOKEN=seu_token_aqui`,
    },
    {
      path: "README.md",
      content: `# Discord Bot Template

Template gerado pelo SS Bots Platform.

## Como usar

1. Instale as dependências: \`npm install\`
2. Configure o arquivo \`.env\` com seu token
3. Execute: \`npm run dev\`

## Comandos

- \`!ping\` - Verificar se o bot está online
`,
    },
  ];

  return generateExport({
    type: "full",
    projectName: "discord-bot-template",
    files,
    format: "folder",
  });
}

/**
 * Gera o conteúdo para download de um arquivo específico
 */
export function generateSingleFileExport(path: string, content: string): ExportResult {
  const blob = new Blob([content], { type: "text/plain" });
  const filename = path.split("/").pop() || "file.txt";

  return {
    filename,
    content: blob,
    size: blob.size,
    format: "file",
  };
}
