import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSupportedPlatforms } from "@/lib/ai-engine";
import { AdSlot } from "@/components/ads/AdSlot";
import {
  Plus,
  Bot,
  Code2,
  MessageSquare,
  Rocket,
  Activity,
  Sparkles,
  FolderKanban,
  ChevronRight,
  ArrowRight,
  Workflow,
  Terminal,
  ShoppingBag,
  Puzzle,
  Server,
  BarChart3,
  Zap,
  Globe,
  MessageCircle,
  Phone,
  Send,
  Camera,
  Youtube,
  Twitch,
  Slack,
  Facebook,
  LayoutDashboard,
} from "lucide-react";

const stats = [
  { label: "Projetos", value: "3", icon: FolderKanban, color: "from-blue-500 to-cyan-500", change: "+2 este mês" },
  { label: "Bots Ativos", value: "5", icon: Bot, color: "from-red-500 to-rose-500", change: "+1 hoje" },
  { label: "Integrações", value: "8", icon: Code2, color: "from-purple-500 to-pink-500", change: "2 conectadas" },
  { label: "Mensagens", value: "12.4k", icon: MessageSquare, color: "from-emerald-500 to-teal-500", change: "+18% vs ontem" },
];

const platforms = getSupportedPlatforms();

const quickActions = [
  { label: "Novo Bot", icon: Bot, path: "/chat", description: "Criar com IA", color: "bg-primary" },
  { label: "Flow Builder", icon: Workflow, path: "/flow", description: "Visual", color: "bg-purple-500" },
  { label: "Editor", icon: Code2, path: "/editor", description: "Código", color: "bg-blue-500" },
  { label: "Chat IA", icon: Sparkles, path: "/chat", description: "Assistente", color: "bg-amber-500" },
  { label: "Terminal", icon: Terminal, path: "/terminal", description: "Comandos", color: "bg-emerald-500" },
  { label: "Marketplace", icon: ShoppingBag, path: "/marketplace", description: "Templates", color: "bg-rose-500" },
];

const recentProjects = [
  { name: "Bot Discord Tickets", platform: "Discord", status: "online" as const, progress: 100, messages: "12.3k" },
  { name: "ChatBot WhatsApp", platform: "WhatsApp", status: "development" as const, progress: 65, messages: "8.9k" },
  { name: "Moderação Telegram", platform: "Telegram", status: "paused" as const, progress: 40, messages: "4.5k" },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard SS Bots
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus bots, projetos e automações
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/chat")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Criar com IA
          </Button>
          <Button onClick={() => navigate("/workspaces")} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Rápidas</CardTitle>
              <CardDescription>Crie ou gerencie seus bots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color} shadow-sm transition-transform group-hover:scale-110`}>
                      <action.icon className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                    <span className="text-[10px] text-muted-foreground">{action.description}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Quick Create */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Criar Bot para</CardTitle>
              <CardDescription>Escolha a plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {platforms.map((platform) => {
                  const IconComponent = {
                    "message-circle": MessageCircle,
                    "phone": Phone,
                    "send": Send,
                    "camera": Camera,
                    "youtube": Youtube,
                    "twitch": Twitch,
                    "slack": Slack,
                    "facebook": Facebook,
                    "globe": Globe,
                  }[platform.icon] || Globe;

                  return (
                    <button
                      key={platform.id}
                      onClick={() => navigate(`/chat?platform=${platform.id}`)}
                      className="flex flex-col items-center gap-1 rounded-lg border border-border p-2 transition-all hover:shadow-sm hover:-translate-y-0.5"
                    >
                      <div className={`flex h-7 w-7 items-center justify-center rounded-md ${platform.color} shadow-sm`}>
                        <IconComponent className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-[10px] font-medium truncate w-full text-center">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Projetos Recentes</CardTitle>
                <CardDescription>Seus bots e projetos em andamento</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/workspaces")}>
                Ver todos <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="group cursor-pointer rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    onClick={() => navigate("/editor")}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={
                        project.status === "online" ? "success" :
                        project.status === "development" ? "default" : "warning"
                      }>
                        {project.status === "online" ? "Online" :
                         project.status === "development" ? "Dev" : "Pausado"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{project.platform}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{project.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MessageSquare className="h-3 w-3" />
                      {project.messages} mensagens
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{project.progress}% completo</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Visão Geral dos Bots</CardTitle>
                <CardDescription>Atividade dos últimos 7 dias</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/analytics")}>
                Ver analytics <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Mensagens", value: "45.231", change: "+20%", icon: MessageSquare },
                  { label: "Usuários Únicos", value: "2.350", change: "+12%", icon: Bot },
                  { label: "Uptime Médio", value: "99.9%", change: "+0.1%", icon: Activity },
                ].map((metric) => (
                  <div key={metric.label} className="text-center">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <span className="text-[10px] text-emerald-500">{metric.change}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Integrations & Deploy Quick Access */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card
            className="card-hover cursor-pointer"
            onClick={() => navigate("/integrations")}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Puzzle className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Integrações</p>
                <p className="text-xs text-muted-foreground">12 serviços disponíveis</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card
            className="card-hover cursor-pointer"
            onClick={() => navigate("/mcp")}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Server className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm font-medium">MCP Hub</p>
                <p className="text-xs text-muted-foreground">Servidores MCP conectados</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card
            className="card-hover cursor-pointer"
            onClick={() => navigate("/deploy")}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Rocket className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Deploy</p>
                <p className="text-xs text-muted-foreground">Publicar bots</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ad Banner */}
      <AdSlot page="dashboard" position="banner" variant="banner" />
    </div>
  );
}
