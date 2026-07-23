import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  FileCode2,
  FileJson,
  FileType,
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Plus,
  Terminal,
  GitBranch,
  Play,
  Save,
  Settings2,
  PanelRightOpen,
  PanelRightClose,
  Bot,
  File,
} from "lucide-react";

interface FileTab {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
}

interface FileTreeItem {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
}

const initialFiles: FileTreeItem[] = [
  {
    name: "src",
    path: "src",
    type: "folder",
    children: [
      { name: "index.ts", path: "src/index.ts", type: "file" },
      { name: "bot.ts", path: "src/bot.ts", type: "file" },
      { name: "handlers", path: "src/handlers", type: "folder", children: [
        { name: "message.ts", path: "src/handlers/message.ts", type: "file" },
        { name: "commands.ts", path: "src/handlers/commands.ts", type: "file" },
      ]},
      { name: "config", path: "src/config", type: "folder", children: [
        { name: "index.ts", path: "src/config/index.ts", type: "file" },
        { name: "database.ts", path: "src/config/database.ts", type: "file" },
      ]},
    ],
  },
  { name: "package.json", path: "package.json", type: "file" },
  { name: "tsconfig.json", path: "tsconfig.json", type: "file" },
  { name: ".env", path: ".env", type: "file" },
];

const sampleFiles: Record<string, string> = {
  "src/index.ts": `import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { handleMessage } from './handlers/message';
import { registerCommands } from './handlers/commands';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(\`Bot logged in as \${client.user?.tag}\`);
  registerCommands(client);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  handleMessage(message);
});

client.login(config.token);
`,
  "src/bot.ts": `export class Bot {
  public name: string;
  public platform: string;
  public status: 'online' | 'offline' | 'error';
  
  constructor(name: string, platform: string) {
    this.name = name;
    this.platform = platform;
    this.status = 'offline';
  }
  
  async start(): Promise<void> {
    console.log(\`Starting bot: \${this.name}\`);
    this.status = 'online';
  }
  
  async stop(): Promise<void> {
    console.log(\`Stopping bot: \${this.name}\`);
    this.status = 'offline';
  }
}
`,
  "src/handlers/message.ts": `import { Message } from 'discord.js';

export async function handleMessage(message: Message): Promise<void> {
  if (!message.content.startsWith('!')) return;
  
  const [command, ...args] = message.content.slice(1).split(' ');
  
  switch (command) {
    case 'ping':
      await message.reply('Pong! 🏓');
      break;
    case 'help':
      await message.reply('Available commands: !ping, !help, !ticket');
      break;
    case 'ticket':
      await createTicket(message, args);
      break;
    default:
      await message.reply('Unknown command. Use !help');
  }
}

async function createTicket(message: Message, args: string[]) {
  const reason = args.join(' ') || 'No reason provided';
  await message.reply(\`Ticket created for: \${reason}\`);
}
`,
  "package.json": `{
  "name": "discord-ticket-bot",
  "version": "1.0.0",
  "description": "A Discord ticket management bot",
  "main": "src/index.ts",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "discord.js": "^14.16.3",
    "dotenv": "^16.4.7"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "typescript": "^5.7.2"
  }
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`,
};

const languageExtensions: Record<string, any> = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  json: json(),
  python: python(),
  html: html(),
  css: css(),
};

const fileIcons: Record<string, React.ReactNode> = {
  "ts": <FileCode2 className="h-4 w-4 text-blue-400" />,
  "tsx": <FileCode2 className="h-4 w-4 text-blue-400" />,
  "js": <FileCode2 className="h-4 w-4 text-yellow-400" />,
  "json": <FileJson className="h-4 w-4 text-orange-400" />,
  "env": <FileType className="h-4 w-4 text-green-400" />,
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop() || "";
  return fileIcons[ext] || <FileText className="h-4 w-4 text-muted-foreground" />;
}

export function EditorPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("src/index.ts");
  const [tabs, setTabs] = useState<FileTab[]>([
    { id: "src/index.ts", name: "index.ts", path: "src/index.ts", language: "typescript", content: sampleFiles["src/index.ts"] },
  ]);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "src/handlers", "src/config"]));
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const openFile = useCallback((path: string) => {
    const existing = tabs.find((t) => t.path === path);
    if (existing) {
      setActiveTab(path);
      return;
    }
    const name = path.split("/").pop() || path;
    const ext = name.split(".").pop() || "";
    const langMap: Record<string, string> = {
      ts: "typescript", tsx: "typescript", js: "javascript", json: "json",
      py: "python", html: "html", css: "css", env: "dotenv",
    };
    const language = langMap[ext] || "text";
    setTabs((prev) => [...prev, {
      id: path, name, path, language, content: sampleFiles[path] || "",
    }]);
    setActiveTab(path);
  }, [tabs]);

  const closeTab = (path: string) => {
    const idx = tabs.findIndex((t) => t.path === path);
    setTabs((prev) => prev.filter((t) => t.path !== path));
    if (activeTab === path && tabs.length > 1) {
      const newIdx = Math.min(idx, tabs.length - 2);
      setActiveTab(tabs[newIdx === idx ? Math.max(0, idx - 1) : newIdx].path);
    }
  };

  const renderFileTreeItem = (item: FileTreeItem, depth: number) => {
    const isExpanded = expandedFolders.has(item.path);

    if (item.type === "folder") {
      return (
        <div key={item.path}>
          <button
            onClick={() => toggleFolder(item.path)}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-muted/80 transition-colors"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
            {isExpanded ? <FolderOpen className="h-4 w-4 text-amber-400 shrink-0" /> : <Folder className="h-4 w-4 text-amber-400 shrink-0" />}
            <span className="truncate">{item.name}</span>
          </button>
          {isExpanded && item.children?.map((child) => renderFileTreeItem(child, depth + 1))}
        </div>
      );
    }

    return (
      <button
        key={item.path}
        onClick={() => openFile(item.path)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-muted/80 transition-colors",
          activeTab === item.path && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {getFileIcon(item.name)}
        <span className="truncate">{item.name}</span>
      </button>
    );
  };

  const activeContent = tabs.find((t) => t.path === activeTab);
  const ext = activeTab.split(".").pop() || "ts";
  const langKey = ext === "ts" || ext === "tsx" ? "typescript" : ext;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Editor Sidebar */}
      {showExplorer && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 260 }}
          className="flex flex-col border-r border-border bg-muted/30"
        >
          {/* Explorer Header */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
            <button className="rounded p-0.5 text-muted-foreground hover:text-foreground">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative border-b border-border px-2 py-1.5">
            <Search className="absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar arquivos..."
              className="w-full rounded-md border border-border bg-background py-1 pl-7 pr-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-auto py-1">
            {initialFiles.map((item) => renderFileTreeItem(item, 0))}
          </div>

          {/* Status Bar */}
          <div className="border-t border-border px-3 py-1.5 text-[10px] text-muted-foreground">
            <span>SS Bots Editor v1.0.0</span>
          </div>
        </motion.div>
      )}

      {/* Editor Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex items-center border-b border-border bg-muted/20">
          <div className="flex flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.path}
                onClick={() => setActiveTab(tab.path)}
                className={cn(
                  "group flex cursor-pointer items-center gap-1.5 border-r border-border px-3 py-2 text-xs transition-colors",
                  activeTab === tab.path
                    ? "bg-background text-foreground border-b-2 border-b-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {getFileIcon(tab.name)}
                <span className="truncate max-w-[120px]">{tab.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.path); }}
                  className="ml-1 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 px-2">
            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {showExplorer ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-auto">
          {activeContent ? (
            <CodeMirror
              value={activeContent.content}
              height="100%"
              theme={theme === "dark" ? oneDark : undefined}
              extensions={[languageExtensions[langKey] || javascript()]}
              onChange={(value) => {
                setTabs((prev) => prev.map((t) =>
                  t.path === activeTab ? { ...t, content: value } : t
                ));
              }}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                autocompletion: true,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <File className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Selecione um arquivo para editar</p>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Toggle */}
        <div className="border-t border-border">
          <div className="flex items-center justify-between bg-muted/20 px-3 py-1">
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="flex items-center gap-1.5 rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Terminal className="h-3.5 w-3.5" />
              Terminal
              <span className="text-[10px]">(Ctrl+`)</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                main
              </button>
              <button className="rounded px-2 py-0.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                <Play className="h-3 w-3" />
                Run
              </button>
              <button className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Save className="h-3 w-3" />
                Save
              </button>
              <button className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Settings2 className="h-3 w-3" />
              </button>
            </div>
          </div>

          {showTerminal && (
            <div className="h-40 bg-muted/50 p-3 font-mono text-xs">
              <div className="space-y-1">
                <p className="text-emerald-500">$ bun run dev</p>
                <p className="text-muted-foreground">&gt; discord-ticket-bot@1.0.0 dev</p>
                <p className="text-muted-foreground">&gt; ts-node src/index.ts</p>
                <p className="text-emerald-500">[INFO] Bot logged in as SS Bots#1234</p>
                <p className="text-emerald-500">[INFO] Bot is ready! Listening for commands...</p>
                <p className="text-muted-foreground">[DEBUG] Loaded 5 slash commands</p>
                <p className="text-amber-500">[WARN] Rate limit approaching (45/50 requests)</p>
                <p className="text-muted-foreground">$ _</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
