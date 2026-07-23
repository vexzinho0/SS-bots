import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { processAIRequest, AIResponse } from "@/lib/ai-engine";
import { generateCode } from "@/lib/code-generator";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  Code2,
  Loader2,
  CheckCircle2,
  FileCode2,
  FolderOpen,
  Download,
  Play,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  actions?: AIResponse["actions"];
  projectStructure?: AIResponse["projectStructure"];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    content: `# 🤖 Olá! Sou a IA do SS Bots

Posso ajudar você a criar **Bots**, **APIs**, **Backend**, **Frontend** e muito mais!

### 🚀 O que posso fazer:

| Comando | Descrição |
|---------|-----------|
| "Crie um bot para Discord" | Gera projeto completo de bot |
| "Crie uma API REST" | Gera API com Express |
| "Crie um chatbot WhatsApp" | Gera bot para WhatsApp |
| "Explique conceitos" | Ajuda com dúvidas técnicas |

### 💡 Exemplos:
- "Crie um bot para Discord com sistema de tickets"
- "Crie um chatbot para WhatsApp com respostas automáticas"
- "Crie uma API REST para meu bot"
- "Como faço deploy de um bot?"

**O que deseja criar hoje?**`,
    role: "assistant",
    timestamp: new Date(),
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const suggestions = [
  "Crie um bot para Discord com sistema de tickets",
  "Crie um chatbot para WhatsApp",
  "Crie um bot para Telegram com moderação",
  "Crie uma API REST para meu bot",
  "Explique como funciona o Flow Builder",
  "Como fazer deploy do meu bot?",
];

function ChatMessage({ message }: { message: Message; onAction?: (action: any) => void }) {
  const isAI = message.role === "assistant";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-2">
        <Badge variant="secondary" className="text-[10px]">{message.content}</Badge>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3 px-4 py-3", isAI ? "" : "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          isAI ? "bg-primary shadow-sm" : "bg-muted"
        )}
      >
        {isAI ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className={cn("flex flex-col", isAI ? "" : "items-end")}>
        <div
          className={cn(
            "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isAI
              ? "bg-muted/50 border border-border"
              : "bg-primary text-primary-foreground"
          )}
        >
          <ReactMarkdown
            components={{
              code({ className, children, ...props }: any) {
                const isInline = !className;
                if (isInline) {
                  return <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono" {...props}>{children}</code>;
                }
                return (
                  <div className="relative group my-2">
                    <div className="flex items-center justify-between rounded-t-lg bg-muted px-3 py-1.5 text-[10px] text-muted-foreground border border-border border-b-0">
                      <span>{className?.replace("language-", "") || "code"}</span>
                      <button className="hover:text-foreground transition-colors">📋 Copiar</button>
                    </div>
                    <pre className="rounded-b-lg border border-border bg-muted/30 p-3 overflow-x-auto">
                      <code className="text-xs font-mono leading-relaxed" {...props}>{children}</code>
                    </pre>
                  </div>
                );
              },
              table({ children }: any) {
                return (
                  <div className="overflow-x-auto my-2">
                    <table className="w-full text-xs border-collapse">{children}</table>
                  </div>
                );
              },
              th({ children }: any) {
                return <th className="border border-border bg-muted px-2 py-1 text-left font-medium">{children}</th>;
              },
              td({ children }: any) {
                return <td className="border border-border px-2 py-1">{children}</td>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.actions && message.actions.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {message.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
                  {action.type === "create_file" && <FileCode2 className="h-3.5 w-3.5 text-emerald-500" />}
                  {action.type === "install_dependency" && <Download className="h-3.5 w-3.5 text-blue-500" />}
                  {action.type === "run_command" && <Play className="h-3.5 w-3.5 text-amber-500" />}
                  <span className="text-muted-foreground">
                    {action.type === "create_file" && `📄 ${action.path}`}
                    {action.type === "install_dependency" && `📦 Instalar dependências`}
                    {action.type === "run_command" && `⚙️ ${action.command}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {message.projectStructure && message.projectStructure.length > 0 && (
            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-2">
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <FolderOpen className="h-3 w-3" />
                Estrutura do Projeto
              </p>
              {message.projectStructure.map((file) => (
                <div key={file.path} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  {file.type === "folder" ? "📁" : "📄"}
                  {file.path}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="mt-1 px-1 text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

export function ChatPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Assistente IA", messages: initialMessages },
  ]);
  const [activeConv, setActiveConv] = useState("1");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConv);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv
          ? { ...c, messages: [...c.messages, userMessage], title: c.messages.length <= 1 ? input.slice(0, 30) + "..." : c.title }
          : c
      )
    );
    setInput("");
    setIsLoading(true);

    // Simular processamento da IA
    setTimeout(() => {
      const response = processAIRequest({
        prompt: input,
        context: {
          conversationHistory: activeConversation?.messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        },
      });

      const systemMessage: Message = {
        id: generateId(),
        content: "✅ Projeto processado pela IA",
        role: "system",
        timestamp: new Date(),
      };

      const aiMessage: Message = {
        id: generateId(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
        actions: response.actions,
        projectStructure: response.projectStructure,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv
            ? { ...c, messages: [...c.messages, systemMessage, aiMessage] }
            : c
        )
      );
      setIsLoading(false);
    }, 2000);
  };

  const newConversation = () => {
    const id = generateId();
    setConversations((prev) => [
      { id, title: "Nova conversa", messages: initialMessages },
      ...prev,
    ]);
    setActiveConv(id);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-r border-border bg-muted/20">
        <div className="p-3 space-y-2">
          <Button onClick={newConversation} className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>
          <Button variant="outline" onClick={() => navigate("/editor")} className="w-full" size="sm">
            <Code2 className="mr-2 h-4 w-4" />
            Abrir Editor
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  activeConv === conv.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
                <button className="opacity-0 hover:opacity-100 transition-opacity">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1">
          <div className="py-4 space-y-1">
            {activeConversation?.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-3 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <div>
                    <p className="text-sm font-medium">IA processando...</p>
                    <p className="text-xs text-muted-foreground">Gerando código e estrutura</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        <div className="border-t border-border px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Descreva o que você quer criar..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="pr-10"
              />
            </div>
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            A IA cria projetos, gera código, corrige erros e ajuda no desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
}
