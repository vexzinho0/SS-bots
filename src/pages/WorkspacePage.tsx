import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FolderKanban, Bot, MoreHorizontal, Clock, ExternalLink, Trash2 } from "lucide-react";

const sampleProjects = [
  { id: "1", name: "Bot Discord Tickets", description: "Sistema de tickets para Discord", platform: "Discord", status: "online", updatedAt: "2 min atrás", language: "TypeScript" },
  { id: "2", name: "WhatsApp ChatBot", description: "Chatbot inteligente para WhatsApp", platform: "WhatsApp", status: "development", updatedAt: "1 hora atrás", language: "Python" },
  { id: "3", name: "Moderação Telegram", description: "Bot de moderação automática", platform: "Telegram", status: "paused", updatedAt: "1 dia atrás", language: "JavaScript" },
];

export function WorkspacePage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">Gerencie seus projetos e workspaces</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Workspace</DialogTitle>
              <DialogDescription>Crie um novo workspace para organizar seus projetos</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Meu Workspace"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Input
                  placeholder="Descrição do workspace"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogOpen(false); }}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {[
          { name: "Principal", description: "Workspace principal", projects: 3, color: "from-red-500 to-rose-500" },
          { name: "Dev", description: "Projetos em desenvolvimento", projects: 1, color: "from-blue-500 to-cyan-500" },
          { name: "Cliente A", description: "Projetos do cliente", projects: 2, color: "from-purple-500 to-pink-500" },
        ].map((ws, index) => (
          <motion.div
            key={ws.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${ws.color} shadow-sm`}>
                    <FolderKanban className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ws.name}</CardTitle>
                    <CardDescription>{ws.description} &bull; {ws.projects} projetos</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sampleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group cursor-pointer rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                      onClick={() => navigate("/editor")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={project.status === "online" ? "success" : project.status === "development" ? "default" : "warning"}>
                          {project.status === "online" ? "Online" : project.status === "development" ? "Dev" : "Pausado"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{project.platform}</span>
                      </div>
                      <h4 className="font-semibold text-sm">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.updatedAt}
                        </span>
                        <span>{project.language}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
