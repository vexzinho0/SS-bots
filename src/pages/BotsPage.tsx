import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AdSlot } from "@/components/ads/AdSlot";
import { PlatformIcon } from "@/components/ui/icon";
import {
  Bot,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Users,
  Zap,
} from "lucide-react";

const bots = [
  { id: "1", name: "Ticket Bot", platform: "Discord", platformId: "discord", status: "online" as const, messages: 15234, users: 892, uptime: "99.9%" },
  { id: "2", name: "ChatBot Suporte", platform: "WhatsApp", platformId: "whatsapp", status: "online" as const, messages: 8921, users: 445, uptime: "99.7%" },
  { id: "3", name: "ModAutomod", platform: "Telegram", platformId: "telegram", status: "paused" as const, messages: 4567, users: 234, uptime: "-" },
  { id: "4", name: "AutoResponder", platform: "Instagram", platformId: "instagram", status: "offline" as const, messages: 2345, users: 123, uptime: "-" },
];

export function BotsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bots</h1>
          <p className="text-muted-foreground">Gerencie todos os seus bots</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Bot
        </Button>
      </div>

      <div className="grid gap-4">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      bot.status === "online" ? "bg-emerald-500/10" :
                      bot.status === "paused" ? "bg-amber-500/10" : "bg-muted"
                    }`}>
                      <Bot className={`h-6 w-6 ${
                        bot.status === "online" ? "text-emerald-500" :
                        bot.status === "paused" ? "text-amber-500" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{bot.name}</h3>
                        <Badge variant={
                          bot.status === "online" ? "success" :
                          bot.status === "paused" ? "warning" : "secondary"
                        }>
                          {bot.status === "online" ? "Online" :
                           bot.status === "paused" ? "Pausado" : "Offline"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <PlatformIcon name={bot.platformId} className="h-3 w-3" />
                          {bot.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {bot.messages.toLocaleString()} mensagens
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {bot.users} usuários
                        </span>
                        {bot.uptime !== "-" && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {bot.uptime} uptime
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={bot.status === "online"} />
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Ad Banner */}
      <AdSlot page="bots" position="inline" variant="minimal" />
    </div>
  );
}
