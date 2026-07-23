import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCcw,
  History,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

const deployments = [
  { id: "1", version: "v2.1.0", status: "success", platform: "Discord", date: "2 min atrás", duration: "45s" },
  { id: "2", version: "v2.0.1", status: "success", platform: "Discord", date: "1 dia atrás", duration: "32s" },
  { id: "3", version: "v2.0.0", status: "success", platform: "Discord, WhatsApp", date: "3 dias atrás", duration: "1m 12s" },
  { id: "4", version: "v1.5.0", status: "failed", platform: "WhatsApp", date: "1 semana atrás", duration: "28s" },
];

const platforms = [
  { name: "Discord", status: "online" as const, url: "https://discord.com/activate" },
  { name: "WhatsApp", status: "offline" as const, url: "" },
  { name: "Telegram", status: "online" as const, url: "https://t.me/ssticketbot" },
];

export function DeployPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deploy</h1>
          <p className="text-muted-foreground">Publique e gerencie versões dos seus bots</p>
        </div>
        <Button className="shadow-sm">
          <Rocket className="mr-2 h-4 w-4" />
          Novo Deploy
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {platforms.map((platform) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={platform.status === "online" ? "border-emerald-500/30" : ""}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-3 w-3 rounded-full ${platform.status === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <div>
                      <p className="font-semibold">{platform.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {platform.status === "online" ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  {platform.status === "online" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reiniciar Todos
        </Button>
        <Button variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Rollback
        </Button>
      </div>

      {/* Deploy History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico de Deploy
          </CardTitle>
          <CardDescription>Últimos deployments realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deployments.map((deploy) => (
              <div
                key={deploy.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    deploy.status === "success" ? "bg-emerald-500/10" : "bg-red-500/10"
                  }`}>
                    {deploy.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{deploy.version}</span>
                      <Badge variant={deploy.status === "success" ? "success" : "destructive"}>
                        {deploy.status === "success" ? "Sucesso" : "Falha"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {deploy.platform}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {deploy.date}
                      </span>
                      <span>Duração: {deploy.duration}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
