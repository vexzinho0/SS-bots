import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  History,
  Search,
  Filter,
  Clock,
  Bot,
  Code2,
  Rocket,
  Settings,
  User,
  Plus,
  Trash2,
  ChevronDown,
  Download,
} from "lucide-react";

const activities = [
  { id: "1", action: "Bot Discord Tickets ficou online", type: "bot", date: "2 min atrás", details: "Bot conectado ao Discord com sucesso" },
  { id: "2", action: "Deploy v2.1.0 realizado", type: "deploy", date: "15 min atrás", details: "Deploy para Discord concluído em 45s" },
  { id: "3", action: "Integração com OpenAI conectada", type: "integration", date: "1 hora atrás", details: "API key configurada e testada" },
  { id: "4", action: "Novo workspace criado: Cliente A", type: "workspace", date: "3 horas atrás", details: "Workspace com 2 projetos" },
  { id: "5", action: "Código atualizado - bot.ts", type: "code", date: "5 horas atrás", details: "Arquivo salvo via editor" },
  { id: "6", action: "Novo bot criado: WhatsApp ChatBot", type: "bot", date: "1 dia atrás", details: "Bot configurado para WhatsApp" },
  { id: "7", action: "Testes executados - 24/24 passaram", type: "test", date: "1 dia atrás", details: "Suite de testes completa" },
  { id: "8", action: "Perfil atualizado", type: "user", date: "2 dias atrás", details: "Nome e foto de perfil alterados" },
];

const typeIcons: Record<string, React.ReactNode> = {
  bot: <Bot className="h-4 w-4 text-primary" />,
  deploy: <Rocket className="h-4 w-4 text-emerald-500" />,
  integration: <Settings className="h-4 w-4 text-purple-500" />,
  workspace: <Plus className="h-4 w-4 text-blue-500" />,
  code: <Code2 className="h-4 w-4 text-amber-500" />,
  test: <Code2 className="h-4 w-4 text-cyan-500" />,
  user: <User className="h-4 w-4 text-muted-foreground" />,
};

export function HistoryPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
          <p className="text-muted-foreground">Registro completo de atividades e eventos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar no histórico..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Card className="transition-colors hover:bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      {typeIcons[activity.type]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.date}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
