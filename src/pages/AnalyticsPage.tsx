import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Users,
  Bot,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const metrics = [
  { label: "Total de Mensagens", value: "45,231", change: "+20.1%", trend: "up", icon: MessageSquare },
  { label: "Usuários Ativos", value: "2,350", change: "+180.1%", trend: "up", icon: Users },
  { label: "Bots Ativos", value: "12", change: "+3", trend: "up", icon: Bot },
  { label: "Taxa de Erro", value: "0.12%", change: "-0.04%", trend: "down", icon: Activity },
];

const dailyData = [
  { day: "Seg", messages: 2400, users: 400 },
  { day: "Ter", messages: 1398, users: 300 },
  { day: "Qua", messages: 9800, users: 520 },
  { day: "Qui", messages: 3908, users: 450 },
  { day: "Sex", messages: 4800, users: 380 },
  { day: "Sáb", messages: 3800, users: 280 },
  { day: "Dom", messages: 4300, users: 310 },
];

const topBots = [
  { name: "Bot Discord Tickets", messages: 15234, users: 892, growth: "+12%" },
  { name: "WhatsApp ChatBot", messages: 8921, users: 445, growth: "+8%" },
  { name: "Telegram Moderação", messages: 4567, users: 234, growth: "+15%" },
  { name: "Instagram AutoDM", messages: 2345, users: 123, growth: "+5%" },
];

const maxMessages = Math.max(...dailyData.map((d) => d.messages));
const maxUsers = Math.max(...dailyData.map((d) => d.users));

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Métricas e estatísticas dos seus bots</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant={metric.trend === "up" ? "success" : "warning"}>
                    <span className="flex items-center gap-0.5">
                      {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {metric.change}
                    </span>
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Messages Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mensagens por Dia</CardTitle>
              <CardDescription>Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {dailyData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-primary/20 transition-all duration-500 hover:bg-primary/30"
                      style={{ height: `${(d.messages / maxMessages) * 100}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Bots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bots Mais Ativos</CardTitle>
              <CardDescription>Por volume de mensagens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBots.map((bot, index) => (
                  <div key={bot.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-5">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{bot.name}</p>
                        <p className="text-xs text-muted-foreground">{bot.users} usuários</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{bot.messages.toLocaleString()}</p>
                      <p className="text-xs text-emerald-500">{bot.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
