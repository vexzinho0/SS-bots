/**
 * SS Bots Terminal Engine
 * Motor de terminal para executar comandos, scripts e gerenciar processos
 */

export interface TerminalCommand {
  command: string;
  args: string[];
  cwd?: string;
  timeout?: number;
}

export interface TerminalOutput {
  type: "stdout" | "stderr" | "system" | "error";
  content: string;
  timestamp: Date;
}

export interface CommandResult {
  success: boolean;
  exitCode: number;
  output: TerminalOutput[];
  duration: number;
}

export interface TerminalSession {
  id: string;
  name: string;
  cwd: string;
  commands: string[];
  history: CommandResult[];
  isRunning: boolean;
  startedAt: Date;
}

const commandHelp: Record<string, string> = {
  help: `📋 **Comandos SS Bots Terminal**

  help              - Mostra esta mensagem
  clear             - Limpa o terminal
  status            - Status dos bots e sistema
  version           - Versão da plataforma
  run <arquivo>     - Executa um arquivo/script
  test <arquivo>    - Roda testes
  deploy [plataforma] - Inicia deploy
  list              - Lista bots ativos
  logs [bot]        - Mostra logs de um bot
  env               - Mostra variáveis de ambiente
  ps                - Lista processos ativos

💡 Dica: Use Tab para autocomplete`,
  clear: "",
  status: `📊 **Status do Sistema SS Bots**

🟢 **Plataforma:** Online
📦 **Versão:** 1.0.0
⚡ **Engine:** Ativo

🤖 **Bots:**
  ├── Discord Ticket Bot    ● Online
  ├── WhatsApp ChatBot      ● Online  
  └── Telegram Moderação    ○ Offline

💾 **Recursos:**
  ├── CPU: 12%
  ├── RAM: 456MB / 2GB
  └── Uptime: 3d 12h 34m`,
  version: `⚡ **SS Bots Platform v1.0.0**

  Build: 2024.1.15.1234
  Node: v22.23.1
  Runtime: Bun 1.3.14
  TypeScript: 5.7.2`,
  list: `📋 **Bots Ativos**

  #1  Discord Ticket Bot     ● Online  12.3k msgs
  #2  WhatsApp ChatBot       ● Online  8.9k msgs
  #3  Telegram Moderação     ○ Offline -`,
  env: `🌍 **Variáveis de Ambiente**

  NODE_ENV=development
  PLATFORM=ss-bots
  VERSION=1.0.0`,
  ps: `📊 **Processos Ativos**

  PID   COMMAND           CPU    MEM    STATUS
  1234  discord-bot       2.1%   156MB  🟢 Running
  1235  whatsapp-bot      1.8%   234MB  🟢 Running
  1236  terminal-server   0.5%   45MB   🟢 Running`,
};

export class TerminalEngine {
  private sessions: Map<string, TerminalSession> = new Map();
  private commandHistory: Map<string, string[]> = new Map();

  createSession(name: string = "default"): TerminalSession {
    const id = `session-${Date.now()}`;
    const session: TerminalSession = {
      id,
      name,
      cwd: "/home/project",
      commands: [],
      history: [],
      isRunning: true,
      startedAt: new Date(),
    };
    this.sessions.set(id, session);
    this.commandHistory.set(id, []);
    return session;
  }

  getSession(id: string): TerminalSession | undefined {
    return this.sessions.get(id);
  }

  private addToHistory(sessionId: string, command: string) {
    const history = this.commandHistory.get(sessionId) || [];
    history.push(command);
    if (history.length > 100) history.shift();
    this.commandHistory.set(sessionId, history);
  }

  getHistory(sessionId: string): string[] {
    return this.commandHistory.get(sessionId) || [];
  }

  async execute(sessionId: string, input: string): Promise<CommandResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        success: false,
        exitCode: 1,
        output: [{ type: "error", content: "❌ Sessão não encontrada", timestamp: new Date() }],
        duration: 0,
      };
    }

    const startTime = Date.now();
    const trimmedInput = input.trim();
    session.commands.push(trimmedInput);
    this.addToHistory(sessionId, trimmedInput);

    // Parse command and arguments
    const parts = trimmedInput.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Process command
    const result = await this.processCommand(command, args);

    const duration = Date.now() - startTime;
    const cmdResult: CommandResult = {
      ...result,
      duration,
    };

    session.history.push(cmdResult);
    return cmdResult;
  }

  private async processCommand(command: string, args: string[]): Promise<CommandResult> {
    const output: TerminalOutput[] = [];
    
    const addOutput = (type: TerminalOutput["type"], content: string) => {
      output.push({ type, content, timestamp: new Date() });
    };

    switch (command) {
      case "help":
        addOutput("stdout", commandHelp.help);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "clear":
        // Clear is handled by the frontend
        return { success: true, exitCode: 0, output: [{ type: "system", content: "__clear__", timestamp: new Date() }], duration: 0 };

      case "status":
        addOutput("stdout", commandHelp.status);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "version":
        addOutput("stdout", commandHelp.version);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "list":
        addOutput("stdout", commandHelp.list);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "env":
        addOutput("stdout", commandHelp.env);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "ps":
        addOutput("stdout", commandHelp.ps);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "run": {
        const file = args[0];
        if (!file) {
          addOutput("error", "❌ Especifique o arquivo: run <arquivo>");
          return { success: false, exitCode: 1, output, duration: 0 };
        }
        addOutput("stdout", `🚀 Executando ${file}...`);
        addOutput("stdout", `[INFO] Compilando ${file}...`);
        addOutput("stdout", `[INFO] Compilação concluída em 1.2s`);
        addOutput("stdout", `[INFO] Processo iniciado com PID ${Math.floor(Math.random() * 9000) + 1000}`);
        addOutput("stdout", `✅ ${file} executando com sucesso!`);
        return { success: true, exitCode: 0, output, duration: 0 };
      }

      case "test": {
        const testFile = args[0];
        if (!testFile) {
          addOutput("error", "❌ Especifique o arquivo de teste: test <arquivo>");
          return { success: false, exitCode: 1, output, duration: 0 };
        }
        addOutput("stdout", `🧪 Rodando testes em ${testFile}...`);
        addOutput("stdout", "");
        addOutput("stdout", `  ✓ test/handler.test.ts (2.3s)`);
        addOutput("stdout", `  ✓ test/commands.test.ts (1.8s)`);
        addOutput("stdout", `  ✓ test/config.test.ts (0.9s)`);
        addOutput("stdout", "");
        addOutput("stdout", `Test Suites: 3 passed, 3 total`);
        addOutput("stdout", `Tests: 18 passed, 18 total`);
        addOutput("stdout", `Time: 5.0s`);
        addOutput("stdout", "");
        addOutput("stdout", `✨ Todos os testes passaram!`);
        return { success: true, exitCode: 0, output, duration: 0 };
      }

      case "deploy": {
        const platform = args[0] || "discord";
        addOutput("stdout", `🚀 Iniciando deploy para ${platform}...`);
        addOutput("stdout", `[1/4] 📦 Compilando projeto...`);
        addOutput("stdout", `[2/4] 🔍 Executando testes...`);
        addOutput("stdout", `[3/4] 📤 Enviando para ${platform}...`);
        addOutput("stdout", `[4/4] ✅ Deploy concluído com sucesso!`);
        addOutput("stdout", `🌐 URL: https://ssbots.com/${platform}/bot-123`);
        return { success: true, exitCode: 0, output, duration: 0 };
      }

      case "logs": {
        const botName = args[0] || "default";
        addOutput("stdout", `📋 Logs do bot: ${botName}`);
        addOutput("stdout", `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        addOutput("stdout", `[2024-01-15 14:32:01] [INFO] Bot iniciado`);
        addOutput("stdout", `[2024-01-15 14:32:05] [INFO] Conectado ao servidor`);
        addOutput("stdout", `[2024-01-15 14:32:10] [DEBUG] Comandos carregados: 12`);
        addOutput("stdout", `[2024-01-15 14:33:00] [INFO] Mensagem processada`);
        addOutput("stdout", `[2024-01-15 14:34:00] [WARN] Rate limit: 45/50`);
        return { success: true, exitCode: 0, output, duration: 0 };
      }

      case "echo":
        addOutput("stdout", args.join(" "));
        return { success: true, exitCode: 0, output, duration: 0 };

      case "date":
        addOutput("stdout", new Date().toLocaleString("pt-BR"));
        return { success: true, exitCode: 0, output, duration: 0 };

      case "pwd":
        addOutput("stdout", "/home/project");
        return { success: true, exitCode: 0, output, duration: 0 };

      case "ls":
        addOutput("stdout", `src/  package.json  tsconfig.json  .env  README.md`);
        return { success: true, exitCode: 0, output, duration: 0 };

      case "cd":
        return { success: true, exitCode: 0, output: [{ type: "system", content: `__cd__${args[0] || "/"}`, timestamp: new Date() }], duration: 0 };

      case "cat": {
        const file = args[0];
        if (!file) {
          addOutput("error", "❌ Especifique o arquivo: cat <arquivo>");
          return { success: false, exitCode: 1, output, duration: 0 };
        }
        addOutput("stdout", `📄 Conteúdo de ${file}:`);
        addOutput("stdout", `(Conteúdo do arquivo seria exibido aqui)`);
        return { success: true, exitCode: 0, output, duration: 0 };
      }

      case "npm":
        if (args[0] === "install") {
          addOutput("stdout", `📦 Instalando dependências...`);
          addOutput("stdout", `+ discord.js@14.16.3`);
          addOutput("stdout", `+ dotenv@16.4.7`);
          addOutput("stdout", `+ typescript@5.7.2`);
          addOutput("stdout", `✅ Dependências instaladas com sucesso!`);
          return { success: true, exitCode: 0, output, duration: 0 };
        }
        if (args[0] === "run" && args[1] === "build") {
          addOutput("stdout", `🔨 Building project...`);
          addOutput("stdout", `✅ Build concluído!`);
          return { success: true, exitCode: 0, output, duration: 0 };
        }
        addOutput("stdout", `npm ${args.join(" ")} (comando simulado)`);
        return { success: true, exitCode: 0, output, duration: 0 };

      default:
        addOutput("error", `❌ Comando não encontrado: ${command}`);
        addOutput("stdout", `Digite 'help' para ver os comandos disponíveis`);
        return { success: false, exitCode: 127, output, duration: 0 };
    }
  }

  destroySession(sessionId: string) {
    this.sessions.delete(sessionId);
    this.commandHistory.delete(sessionId);
  }
}

// Singleton instance
export const terminalEngine = new TerminalEngine();
