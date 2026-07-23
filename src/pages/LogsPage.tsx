import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Download,
  Trash2,
  Terminal,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Clock,
  ChevronDown,
  RefreshCcw,
} from "lucide-react";

const logEntries = [
  { id: "1", level: "info", message: "Bot Discord Tickets conectado com sucesso", source: "discord-bot", timestamp: "2024-01-15 14:32:01", module: "Connection" },
  { id: "2", level: "success", message: "Comando !ticket registrado com sucesso", source: "discord-bot", timestamp: "2024-01-15 14:32:05", module: "Commands" },
  { id: "3", level: "warn", message: "Rate limit se aproximando (45/50 requisições)", source: "discord-bot", timestamp: "2024-01-15 14:32:10", module: "RateLimiter" },
  { id: "4", level: "error", message: "Falha ao conectar ao WhatsApp - Token inválido", source: "whatsapp-bot", timestamp: "2024-01-15 14:30:00", module: "Connection" },
  { id: "5", level: "info", message: "Mensagem processada: Ticket #1234 criado", source: "discord-bot", timestamp: "2024-01-15 14:28:00", module: "TicketSystem" },
  { id: "6", level: "debug", message: "Webhook POST /api/ticket - Status 200", source: "api", timestamp: "2024-01-15 14:27:55", module: "Webhook" },
  { id: "7", level: "info", message: "Deploy v2.1.0 iniciado para Discord", source: "deploy", timestamp: "2024-01-15 14:25:00", module: "Deploy" },
  { id: "8", level: "success", message: "Deploy v2.1.0 concluído em 45s", source: "deploy", timestamp: "2024-01-15 14:25:45", module: "Deploy" },
  { id: "9", level: "warn", message: "Uso de memória alto: 1.8GB/2GB", source: "system", timestamp: "2024-01-15 14:20:00", module: "System" },
  { id: "10", level: "debug", message: "Cache hit: 85% para comandos de moderação", source: "discord-bot", timestamp: "2024-01-15 14:15:00", module: "Cache" },
];

const levelIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-3.5 w-3.5 text-blue-500" />,
  success: <Info className="h-3.5 w-3.5 text-emerald-500" />,
  warn: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
  error: <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
  debug: <Bug className="h-3.5 w-3.5 text-muted-foreground" />,
};

const levelColors: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  warn: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20",
  debug: "bg-muted text-muted-foreground border-border",
};

export function LogsPage() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<string | null>(null);

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = !filterLevel || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">Visualize e monitore logs do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar nos logs..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["info", "success", "warn", "error", "debug"].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(filterLevel === level ? null : level)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                filterLevel === level ? levelColors[level] : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 font-mono text-sm">
        {filteredLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
          >
            <div className="shrink-0">
              {levelIcons[log.level]}
            </div>
            <span className="shrink-0 text-[11px] text-muted-foreground w-20">{log.timestamp.split(" ")[1]}</span>
            <Badge variant="outline" className="shrink-0 text-[10px] font-mono">{log.source}</Badge>
            <span className="flex-1 truncate">{log.message}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">{log.module}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
