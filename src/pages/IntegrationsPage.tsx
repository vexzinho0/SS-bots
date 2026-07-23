import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { integrationList } from "@/data/marketplaceItems";
import { AdSlot } from "@/components/ads/AdSlot";
import { PlatformIcon } from "@/components/ui/icon";
import {
  Search,
  Puzzle,
  Plug,
  Zap,
  Globe,
  Database,
  Cloud,
  MessageCircle,
  Send,
  GitBranch,
  Bot,
  Code2,
  Sparkles,
} from "lucide-react";

const connectedIntegrations = ["github", "openai"];

export function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [connected, setConnected] = useState<Set<string>>(new Set(connectedIntegrations));

  const filteredIntegrations = integrationList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleIntegration = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground">Conecte serviços e APIs ao seu workspace</p>
        </div>
        <Button className="shadow-sm">
          <Plug className="mr-2 h-4 w-4" />
          Adicionar Personalizada
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar integrações..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((item, index) => {
          const isConnected = connected.has(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card className={cn(
                "card-hover",
                isConnected && "border-primary/30 bg-primary/[0.02]"
              )}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isConnected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <div className={cn(isConnected ? "text-primary" : "text-muted-foreground")}>
                        <PlatformIcon name={item.id} className="h-5 w-5" />
                      </div>
                    </div>
                    <Switch
                      checked={isConnected}
                      onCheckedChange={() => toggleIntegration(item.id)}
                    />
                  </div>
                  <CardTitle className="text-base mt-3">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant={isConnected ? "success" : "secondary"}>
                    {isConnected ? "Conectado" : "Disponível"}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Personalizada */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Globe className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">Integração Personalizada</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Envie sua documentação, importe OpenAPI/Swagger ou URL
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline">Importar Documentação</Button>
            <Button variant="outline">Importar URL</Button>
          </div>
        </CardContent>
      </Card>

      {/* Ad Banner */}
      <AdSlot page="integrations" position="inline" variant="minimal" />
    </div>
  );
}
