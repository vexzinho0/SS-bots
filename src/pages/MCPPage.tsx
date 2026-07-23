import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Server,
  Plus,
  Link2,
  Link2Off,
  Settings2,
  Globe,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";

const sampleMCPServers = [
  { id: "1", name: "Claude MCP", url: "https://mcp.claude.ai/connect", description: "Conexão oficial com o Claude MCP Connector", status: "connected", type: "claude" },
  { id: "2", name: "Supabase MCP", url: "https://mcp.supabase.com/v1", description: "Acesso ao banco de dados via MCP", status: "connected", type: "supabase" },
  { id: "3", name: "GitHub MCP", url: "https://mcp.github.com/connect", description: "Gerenciamento de repositórios via MCP", status: "disconnected", type: "github" },
];

export function MCPPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [servers, setServers] = useState(sampleMCPServers);

  const toggleServer = (id: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "connected" ? "disconnected" as const : "connected" as const } : s
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MCP Hub</h1>
          <p className="text-muted-foreground">Gerencie suas conexões MCP (Model Context Protocol)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Servidor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conectar Servidor MCP</DialogTitle>
              <DialogDescription>
                Adicione um servidor MCP para expandir as capacidades da sua IA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Servidor</Label>
                <Input
                  placeholder="Meu Servidor MCP"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>URL de Conexão</Label>
                <Input
                  placeholder="https://meu-servidor-mcp.com/connect"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Configuração Adicional (JSON)</Label>
                <textarea
                  className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  placeholder='{ "apiKey": "..." }'
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); }}>Conectar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Model Context Protocol (MCP)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              O MCP permite que sua IA se conecte a ferramentas, bancos de dados e APIs externas.
              Compatível com o Claude MCP Connector e outros provedores.
              <a href="https://platform.claude.com/docs/en/agents-and-tools/mcp-connector" target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">
                Saiba mais →
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Server List */}
      <div className="grid gap-4">
        {servers.map((server, index) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={cn(
              "transition-all duration-200",
              server.status === "connected" && "border-primary/30"
            )}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      server.status === "connected" ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Server className={cn("h-5 w-5", server.status === "connected" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{server.name}</h3>
                        <Badge variant={server.status === "connected" ? "success" : "secondary"}>
                          {server.status === "connected" ? "Conectado" : "Desconectado"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{server.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{server.url}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={server.status === "connected"}
                      onCheckedChange={() => toggleServer(server.id)}
                    />
                    <Button variant="ghost" size="icon">
                      <Settings2 className="h-4 w-4" />
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
