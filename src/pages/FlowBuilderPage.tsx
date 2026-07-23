import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { flowToCode } from "@/lib/flow-to-code";
import type { FlowBlock } from "@/lib/flow-to-code";
import {
  MessageSquare,
  GitBranch,
  Brain,
  Database,
  Send,
  Webhook,
  Clock,
  Filter,
  Code2,
  Plus,
  Trash2,
  CheckCircle2,
  Play,
  Save,
  Workflow,
  ArrowDown,
  ArrowUp,
  X,
  Zap,
  Globe,
  Repeat,
  Terminal,
  Bell,
  Shield,
  DollarSign,
  FileText,
  Image,
  RefreshCw,
  Copy,
  Download,
} from "lucide-react";

interface NodeTypeDef {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  configFields: ConfigField[];
}

interface ConfigField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "code";
  placeholder?: string;
  options?: { label: string; value: string }[];
}

const nodeTypeDefinitions: NodeTypeDef[] = [
  { id: "trigger", label: "Trigger", description: "Inicia o fluxo quando um evento ocorre", icon: <Zap className="h-4 w-4" />, color: "from-amber-500 to-orange-500", category: "Eventos",
    configFields: [{ key: "event", label: "Evento", type: "select", options: [
      { label: "Mensagem Recebida", value: "message" }, { label: "Comando Executado", value: "command" },
      { label: "Bot Iniciado", value: "startup" }, { label: "Webhook Recebido", value: "webhook" }, { label: "Agendamento", value: "schedule" },
    ]}]},
  { id: "schedule", label: "Agendador", description: "Executa o fluxo em horários específicos", icon: <Clock className="h-4 w-4" />, color: "from-teal-500 to-cyan-500", category: "Eventos",
    configFields: [{ key: "cron", label: "Expressão Cron", type: "text", placeholder: "*/5 * * * *" }]},
  { id: "message", label: "Mensagem", description: "Envia uma mensagem para o canal", icon: <MessageSquare className="h-4 w-4" />, color: "from-blue-500 to-cyan-500", category: "Ações",
    configFields: [
      { key: "content", label: "Conteúdo", type: "textarea", placeholder: "Digite a mensagem..." },
      { key: "type", label: "Tipo", type: "select", options: [{ label: "Texto", value: "text" }, { label: "Embed", value: "embed" }, { label: "Botão", value: "button" }]},
    ]},
  { id: "image", label: "Imagem", description: "Envia ou processa uma imagem", icon: <Image className="h-4 w-4" />, color: "from-pink-500 to-rose-500", category: "Ações",
    configFields: [{ key: "url", label: "URL da Imagem", type: "text", placeholder: "https://..." }]},
  { id: "notification", label: "Notificação", description: "Envia notificação push", icon: <Bell className="h-4 w-4" />, color: "from-red-500 to-orange-500", category: "Ações",
    configFields: [{ key: "title", label: "Título", type: "text", placeholder: "Nova notificação" }]},
  { id: "condition", label: "Condição", description: "Desvia o fluxo baseado em uma condição", icon: <GitBranch className="h-4 w-4" />, color: "from-purple-500 to-pink-500", category: "Lógica",
    configFields: [{ key: "expression", label: "Expressão", type: "code", placeholder: "message.content.includes('!help')" }]},
  { id: "loop", label: "Loop", description: "Repete um bloco de ações N vezes", icon: <Repeat className="h-4 w-4" />, color: "from-indigo-500 to-violet-500", category: "Lógica",
    configFields: [{ key: "times", label: "Repetições", type: "number", placeholder: "5" }]},
  { id: "delay", label: "Atraso", description: "Aguarda um tempo antes de continuar", icon: <Clock className="h-4 w-4" />, color: "from-gray-500 to-slate-500", category: "Lógica",
    configFields: [{ key: "duration", label: "Duração (ms)", type: "number", placeholder: "1000" }]},
  { id: "filter", label: "Filtro", description: "Filtra dados baseado em regras", icon: <Filter className="h-4 w-4" />, color: "from-cyan-500 to-blue-500", category: "Lógica",
    configFields: [{ key: "rules", label: "Regras (JSON)", type: "code", placeholder: '{ "role": "admin" }' }]},
  { id: "ai", label: "Inteligência Artificial", description: "Processa dados com IA (GPT-4, Claude)", icon: <Brain className="h-4 w-4" />, color: "from-red-500 to-rose-500", category: "IA & Dados",
    configFields: [
      { key: "prompt", label: "Prompt do Sistema", type: "textarea", placeholder: "Você é um assistente..." },
      { key: "model", label: "Modelo", type: "select", options: [{ label: "GPT-4", value: "gpt-4" }, { label: "GPT-3.5", value: "gpt-3.5-turbo" }, { label: "Claude Sonnet", value: "claude-sonnet" }, { label: "Groq Mixtral", value: "groq-mixtral" }]},
    ]},
  { id: "database", label: "Banco de Dados", description: "Salva, busca ou deleta dados", icon: <Database className="h-4 w-4" />, color: "from-emerald-500 to-teal-500", category: "IA & Dados",
    configFields: [{ key: "operation", label: "Operação", type: "select", options: [{ label: "Salvar", value: "save" }, { label: "Buscar", value: "find" }, { label: "Atualizar", value: "update" }, { label: "Deletar", value: "delete" }]}]},
  { id: "code", label: "Código Customizado", description: "Executa JavaScript personalizado", icon: <Code2 className="h-4 w-4" />, color: "from-violet-500 to-purple-500", category: "IA & Dados",
    configFields: [{ key: "code", label: "Código", type: "code", placeholder: "// Seu código aqui" }]},
  { id: "webhook", label: "Webhook", description: "Envia dados para uma URL externa", icon: <Webhook className="h-4 w-4" />, color: "from-indigo-500 to-blue-500", category: "Integrações",
    configFields: [
      { key: "url", label: "URL do Webhook", type: "text", placeholder: "https://..." },
      { key: "method", label: "Método", type: "select", options: [{ label: "POST", value: "POST" }, { label: "GET", value: "GET" }, { label: "PUT", value: "PUT" }, { label: "DELETE", value: "DELETE" }]},
    ]},
  { id: "http", label: "Requisição HTTP", description: "Faz requisições para APIs externas", icon: <Globe className="h-4 w-4" />, color: "from-sky-500 to-blue-500", category: "Integrações",
    configFields: [{ key: "url", label: "URL", type: "text", placeholder: "https://api.example.com" }]},
  { id: "api", label: "API Externa", description: "Conecta com APIs de terceiros", icon: <RefreshCw className="h-4 w-4" />, color: "from-orange-500 to-amber-500", category: "Integrações",
    configFields: [{ key: "provider", label: "Provedor", type: "select", options: [{ label: "GitHub", value: "github" }, { label: "Stripe", value: "stripe" }, { label: "Supabase", value: "supabase" }, { label: "OpenAI", value: "openai" }, { label: "Personalizado", value: "custom" }]}]},
  { id: "response", label: "Resposta", description: "Responde ao usuário com uma mensagem", icon: <Send className="h-4 w-4" />, color: "from-green-500 to-emerald-500", category: "Respostas",
    configFields: [{ key: "type", label: "Tipo", type: "select", options: [{ label: "Texto", value: "text" }, { label: "Embed", value: "embed" }, { label: "Botão", value: "button" }]}]},
  { id: "command", label: "Comando", description: "Cria um comando executável", icon: <Terminal className="h-4 w-4" />, color: "from-zinc-500 to-gray-500", category: "Respostas",
    configFields: [{ key: "name", label: "Nome do Comando", type: "text", placeholder: "!meucomando" }]},
  { id: "payment", label: "Pagamento", description: "Processa pagamento via Stripe", icon: <DollarSign className="h-4 w-4" />, color: "from-blue-600 to-indigo-600", category: "Respostas",
    configFields: [{ key: "amount", label: "Valor (centavos)", type: "number", placeholder: "499" }]},
  { id: "log", label: "Logger", description: "Registra dados no log", icon: <FileText className="h-4 w-4" />, color: "from-stone-500 to-neutral-500", category: "Utilitários",
    configFields: [{ key: "level", label: "Nível", type: "select", options: [{ label: "Info", value: "info" }, { label: "Warn", value: "warn" }, { label: "Error", value: "error" }, { label: "Debug", value: "debug" }]}]},
  { id: "security", label: "Segurança", description: "Verifica permissões e autenticação", icon: <Shield className="h-4 w-4" />, color: "from-emerald-600 to-green-600", category: "Utilitários",
    configFields: [{ key: "permission", label: "Permissão", type: "select", options: [{ label: "Admin", value: "admin" }, { label: "Moderador", value: "mod" }, { label: "Todos", value: "all" }]}]},
];

interface FlowNodeData {
  id: string;
  typeId: string;
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
}

function PaletteNode({ typeDef, id }: { typeDef: NodeTypeDef; id: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { type: "new-node", nodeType: typeDef.id } });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      className={cn("flex cursor-grab items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-xs transition-all", isDragging ? "opacity-50" : "hover:shadow-md hover:-translate-y-0.5")}>
      <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${typeDef.color} shadow-sm`}>{typeDef.icon}</div>
      <div className="flex-1 min-w-0"><span className="font-medium block truncate">{typeDef.label}</span><span className="text-[10px] text-muted-foreground truncate block">{typeDef.category}</span></div>
    </div>
  );
}

function CanvasNode({ node, typeDef, isSelected, onSelect, onDelete, onMoveUp, onMoveDown }: {
  node: FlowNodeData; typeDef: NodeTypeDef; isSelected: boolean;
  onSelect: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `node-${node.id}`, data: { type: "move-node", nodeId: node.id },
  });
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <div ref={setNodeRef} {...listeners} {...attributes}
        className={cn("absolute flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-grab transition-all", isDragging && "opacity-50", isSelected ? "border-primary shadow-lg" : "border-border hover:border-muted-foreground/30")}
        style={{ left: node.x + (transform?.x || 0), top: node.y + (transform?.y || 0), minWidth: 220, zIndex: isDragging ? 999 : 1 }}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <div className={`absolute inset-0 rounded-xl opacity-[0.03] bg-gradient-to-br ${typeDef.color}`} />
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${typeDef.color} shadow-sm shrink-0`}>{typeDef.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{node.label}</p>
          <p className="text-[10px] text-muted-foreground">{typeDef.label}{Object.keys(node.config).length > 0 && <span className="text-primary/60 ml-1">• configurado</span>}</p>
        </div>
        {isSelected && <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="rounded-md p-1 text-muted-foreground hover:bg-muted"><ArrowUp className="h-3.5 w-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="rounded-md p-1 text-muted-foreground hover:bg-muted"><ArrowDown className="h-3.5 w-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>}
      </div>
    </motion.div>
  );
}

function ConnectionLines({ nodes }: { nodes: FlowNodeData[] }) {
  if (nodes.length < 2) return null;
  const sorted = [...nodes].sort((a, b) => a.y - b.y);
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
      <defs><marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary) / 0.4)" /></marker></defs>
      {sorted.slice(0, -1).map((node, i) => {
        const next = sorted[i + 1]; if (!next) return null;
        const [x1, y1, x2, y2] = [node.x + 110, node.y + 52, next.x + 110, next.y];
        const mid = (y1 + y2) / 2;
        const path = `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
        return <g key={`c-${i}`}><path d={path} fill="none" stroke="hsl(var(--primary) / 0.06)" strokeWidth={6} /><path d={path} fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#arrowhead2)" /><circle r="3" fill="hsl(var(--primary) / 0.5)"><animateMotion dur="2s" repeatCount="indefinite" path={path} /></circle></g>;
      })}
    </svg>
  );
}

export function FlowBuilderPage() {
  const [nodes, setNodes] = useState<FlowNodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{ files: Array<{ path: string; language: string; content: string }>; dependencies: string[]; readme: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const canvasRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const categories = ["Todos", "Eventos", "Ações", "Lógica", "IA & Dados", "Integrações", "Respostas", "Utilitários"];
  const filteredNodeTypes = activeCategory === "Todos" ? nodeTypeDefinitions : nodeTypeDefinitions.filter((n) => n.category === activeCategory);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedTypeDef = selectedNode ? nodeTypeDefinitions.find((d) => d.id === selectedNode.typeId) : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "new-node" && data?.nodeType) {
      const typeDef = nodeTypeDefinitions.find((d) => d.id === data.nodeType);
      if (!typeDef) return;
      const newY = nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + 140 : 50;
      const newNode: FlowNodeData = { id: `n${Date.now()}`, typeId: typeDef.id, label: `Novo ${typeDef.label}`, x: 180, y: Math.max(0, newY), config: {} };
      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
    }
  };

  const handleConvertToCode = () => {
    if (nodes.length === 0) return;
    const sorted = [...nodes].sort((a, b) => a.y - b.y);
    const blocks: FlowBlock[] = sorted.map((node, i) => ({
      id: node.id, type: node.typeId, label: node.label, config: node.config,
      positionX: node.x, positionY: node.y,
      connections: i < sorted.length - 1 ? [{ from: node.id, to: sorted[i + 1].id }] : [],
    }));
    try {
      const result = flowToCode(blocks);
      setGeneratedCode(result);
      setShowCodeDialog(true);
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 3000);
    } catch (e) { console.error("[SS Bots] Erro ao converter:", e); }
  };

  const handleAddExampleFlow = () => {
    setNodes([
      { id: "n1", typeId: "trigger", label: "Mensagem Recebida", x: 180, y: 30, config: { event: "message" } },
      { id: "n2", typeId: "condition", label: "Contém '!ticket'", x: 180, y: 190, config: { expression: "msg.includes('!ticket')" } },
      { id: "n3", typeId: "ai", label: "Gerar Resposta com IA", x: 180, y: 350, config: { prompt: "Ajude o usuário com seu ticket" } },
      { id: "n4", typeId: "database", label: "Salvar Ticket", x: 180, y: 510, config: { operation: "save" } },
      { id: "n5", typeId: "response", label: "Confirmar Usuário", x: 180, y: 670, config: { type: "text" } },
    ]);
    setSelectedNodeId(null);
  };

  const copyCode = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar - Node Palette */}
        <div className="w-60 border-r border-border bg-muted/20 flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blocos</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Arraste para o canvas</p>
          </div>
          <div className="px-2 py-2 border-b border-border">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors", activeCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredNodeTypes.map((typeDef) => <PaletteNode key={typeDef.id} id={`palette-${typeDef.id}`} typeDef={typeDef} />)}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-2"><Workflow className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Flow Builder</span><Badge variant="secondary" className="text-[10px]">{nodes.length} nós</Badge></div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleAddExampleFlow}><Play className="mr-1.5 h-3.5 w-3.5" />Exemplo</Button>
              <Button variant="outline" size="sm" onClick={() => { setNodes([]); setSelectedNodeId(null); setGeneratedCode(null); }}><Trash2 className="mr-1.5 h-3.5 w-3.5" />Limpar</Button>
              <Button variant="outline" size="sm" onClick={handleConvertToCode} disabled={nodes.length === 0}><Code2 className="mr-1.5 h-3.5 w-3.5" />Converter</Button>
              <Button size="sm" className="shadow-sm"><Save className="mr-1.5 h-3.5 w-3.5" />Salvar</Button>
            </div>
          </div>
          <div ref={canvasRef} className="flex-1 relative overflow-auto bg-muted/20" onClick={() => setSelectedNodeId(null)}>
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(hsl(var(--border) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.15) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <Workflow className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">Canvas Vazio</h3>
                  <p className="text-sm text-muted-foreground mb-4">Arraste blocos da paleta ao lado para começar a construir seu fluxo</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleAddExampleFlow}><Play className="mr-1.5 h-3.5 w-3.5" />Carregar Exemplo</Button>
                    <Button size="sm" onClick={() => { setNodes([{ id: "n1", typeId: "trigger", label: "Novo Trigger", x: 200, y: 50, config: {} }]); }}>
                      <Plus className="mr-1.5 h-3.5 w-3.5" />Primeiro Nó
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ConnectionLines nodes={nodes} />
                <AnimatePresence>{nodes.map((node) => {
                  const td = nodeTypeDefinitions.find((d) => d.id === node.typeId); if (!td) return null;
                  return <CanvasNode key={node.id} node={node} typeDef={td} isSelected={selectedNodeId === node.id}
                    onSelect={() => setSelectedNodeId(node.id)} onDelete={() => { setNodes((p) => p.filter((n) => n.id !== node.id)); if (selectedNodeId === node.id) setSelectedNodeId(null); }}
                    onMoveUp={() => setNodes((p) => p.map((n) => n.id === node.id ? { ...n, y: n.y - 30 } : n))}
                    onMoveDown={() => setNodes((p) => p.map((n) => n.id === node.id ? { ...n, y: n.y + 30 } : n))} />;
                })}</AnimatePresence>
              </>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <AnimatePresence>{selectedNode && selectedTypeDef && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-l border-border bg-muted/20 overflow-y-auto shrink-0">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${selectedTypeDef.color} shadow-sm`}>{selectedTypeDef.icon}</div><h3 className="text-sm font-semibold">Propriedades</h3></div>
                <button onClick={() => setSelectedNodeId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nome do Nó</label>
                <Input className="mt-1 h-8 text-sm" value={selectedNode.label} onChange={(e) => setNodes((prev) => prev.map((n) => n.id === selectedNode.id ? { ...n, label: e.target.value } : n))} />
              </div>
              {selectedTypeDef.configFields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                  {field.type === "select" ? (
                    <select className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      value={selectedNode.config[field.key] || ""}
                      onChange={(e) => setNodes((prev) => prev.map((n) => n.id === selectedNode.id ? { ...n, config: { ...n.config, [field.key]: e.target.value } } : n))}>
                      <option value="">Selecione...</option>{field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : field.type === "textarea" || field.type === "code" ? (
                    <textarea className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm mt-1 font-mono focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" rows={field.type === "code" ? 6 : 3}
                      placeholder={field.placeholder} value={selectedNode.config[field.key] || ""}
                      onChange={(e) => setNodes((prev) => prev.map((n) => n.id === selectedNode.id ? { ...n, config: { ...n.config, [field.key]: e.target.value } } : n))} />
                  ) : (
                    <Input className="mt-1 h-8 text-sm" type={field.type === "number" ? "number" : "text"} placeholder={field.placeholder}
                      value={selectedNode.config[field.key] || ""}
                      onChange={(e) => setNodes((prev) => prev.map((n) => n.id === selectedNode.id ? { ...n, config: { ...n.config, [field.key]: e.target.value } } : n))} />
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-border"><p className="text-[10px] text-muted-foreground">ID: {selectedNode.id} | Pos: ({selectedNode.x}, {selectedNode.y})</p></div>
            </div>
          </motion.div>
        )}</AnimatePresence>

        {/* Validation Toast */}
        <AnimatePresence>{showValidation && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 z-50">
            <Card className="border-emerald-500/30 shadow-xl bg-background"><CardContent className="p-4 flex items-center gap-3">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="h-5 w-5 text-emerald-500" /></motion.div>
              <div><p className="text-sm font-medium">Fluxo convertido com sucesso!</p><p className="text-xs text-muted-foreground">{nodes.length} nós convertidos</p></div>
            </CardContent></Card>
          </motion.div>
        )}</AnimatePresence>

        {/* Code Preview Dialog */}
        <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" />Código Gerado</DialogTitle></DialogHeader>
            <ScrollArea className="h-[60vh]">
              {generatedCode?.files.map((file, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center justify-between bg-muted px-3 py-1.5 rounded-t-lg border border-border">
                    <span className="text-xs font-mono text-muted-foreground">{file.path}</span>
                    <button onClick={() => copyCode(file.content)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" />Copiar</button>
                  </div>
                  <pre className="bg-muted/50 p-3 rounded-b-lg border-x border-b border-border overflow-x-auto"><code className="text-xs font-mono whitespace-pre">{file.content}</code></pre>
                </div>
              ))}
              {generatedCode && generatedCode.dependencies.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Dependências:</p>
                  <div className="flex flex-wrap gap-1">{generatedCode.dependencies.map((dep, i) => <Badge key={i} variant="outline" className="text-[10px]">{dep}</Badge>)}</div>
                </div>
              )}
              <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1">README:</p>
                <pre className="text-xs font-mono whitespace-pre-wrap">{generatedCode?.readme}</pre>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => copyCode(generatedCode?.files.map(f => f.content).join("\n\n") || "")}><Download className="mr-1.5 h-3.5 w-3.5" />Copiar Tudo</Button>
              <Button size="sm" onClick={() => setShowCodeDialog(false)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>
  );
}
