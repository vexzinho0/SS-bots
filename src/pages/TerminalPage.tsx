import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { terminalEngine, TerminalOutput } from "@/lib/terminal-engine";
import {
  Terminal,
  Play,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronUp,
  History,
} from "lucide-react";

export function TerminalPage() {
  const [session] = useState(() => terminalEngine.createSession("SS Bots Terminal"));
  const [history, setHistory] = useState<{ command: string; outputs: TerminalOutput[] }[]>([
    {
      command: "",
      outputs: [
        { type: "stdout", content: "╔══════════════════════════════════════════╗", timestamp: new Date() },
        { type: "stdout", content: "║     SS Bots Terminal v1.0.0             ║", timestamp: new Date() },
        { type: "stdout", content: "║     Type 'help' for available commands   ║", timestamp: new Date() },
        { type: "stdout", content: "╚══════════════════════════════════════════╝", timestamp: new Date() },
      ],
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed.toLowerCase() === "clear") {
      setHistory([]);
      setCurrentInput("");
      return;
    }

    const result = await terminalEngine.execute(session.id, trimmed);
    
    // Handle special commands
    const hasClear = result.output.some((o) => o.content === "__clear__");
    if (hasClear) {
      setHistory([]);
      setCurrentInput("");
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        outputs: result.output,
      },
    ]);

    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple autocomplete
      const commands = ["help", "status", "version", "run", "test", "deploy", "logs", "list", "env", "ps", "clear", "echo", "date", "pwd", "ls", "cat", "npm"];
      const partial = currentInput.toLowerCase();
      const match = commands.find((c) => c.startsWith(partial));
      if (match) {
        setCurrentInput(match + " ");
      }
    }
  };

  const quickCommands = ["help", "status", "version", "run bot.ts", "test index.ts", "deploy discord", "logs", "list"];

  return (
    <div className={cn("p-6 space-y-4", isFullscreen && "fixed inset-0 z-50 bg-background p-4")}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terminal</h1>
          <p className="text-sm text-muted-foreground">Execute comandos e gerencie seus bots</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setHistory([])}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card className={cn("overflow-hidden", isFullscreen && "h-[calc(100vh-8rem)]")}>
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground font-mono">SS Bots Terminal</span>
          <Badge variant="secondary" className="ml-auto text-[10px] font-mono">bun 1.3.14</Badge>
        </div>

        <div className="relative">
          <div
            ref={terminalRef}
            className="h-[calc(100vh-20rem)] overflow-auto bg-[#0a0a0a] p-4 font-mono text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((entry, i) => (
              <div key={i}>
                {entry.command && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-500">❯</span>
                    <span className="text-emerald-400">~/ss-bots</span>
                    <span className="text-muted-foreground">on</span>
                    <span className="text-rose-500"> main</span>
                    <span className="text-white">{entry.command}</span>
                  </div>
                )}
                {entry.outputs.map((output, j) => (
                  <p
                    key={j}
                    className={cn(
                      "leading-relaxed",
                      output.type === "stdout" && "text-gray-300",
                      output.type === "stderr" && "text-red-400",
                      output.type === "error" && "text-red-400",
                      output.type === "system" && "text-blue-400 italic"
                    )}
                  >
                    {output.content}
                  </p>
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-emerald-500">❯</span>
              <span className="text-emerald-400">~/ss-bots</span>
              <span className="text-muted-foreground">on</span>
              <span className="text-rose-500"> main</span>
              <span className="text-muted-foreground">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white min-w-[100px]"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
        </div>
      </Card>

      {/* Quick Commands */}
      <div className="flex flex-wrap gap-1.5">
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-mono"
          >
            {cmd}
          </button>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground flex items-center gap-2">
        <History className="h-3 w-3" />
        Histórico: {commandHistory.length} comandos | Tab para autocomplete | ↑↓ para navegar
      </div>
    </div>
  );
}
