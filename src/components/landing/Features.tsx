import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bot,
  Code2,
  Terminal,
  MessageSquare,
  Workflow,
  Database,
  Rocket,
  Puzzle,
  Shield,
  Gauge,
  Users,
  GitBranch,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Editor Visual",
    description: "Editor completo inspirado no VS Code com autocomplete, temas e IA integrada.",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Workflow,
    title: "Flow Builder",
    description: "Construtor visual drag-and-drop para criar fluxos de automação complexos.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: MessageSquare,
    title: "IA Nativa",
    description: "IA inteligente que cria projetos, corrige erros e ajuda no desenvolvimento.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Puzzle,
    title: "Integrações",
    description: "Conecte com Discord, WhatsApp, Telegram, GitHub, OpenAI e muito mais.",
    color: "from-purple-500 to-red-500",
  },
  {
    icon: Terminal,
    title: "Terminal Próprio",
    description: "Terminal integrado para executar, testar e depurar seus bots em tempo real.",
    color: "from-red-500 to-amber-500",
  },
  {
    icon: Database,
    title: "Banco de Dados",
    description: "Armazenamento escalável com suporte a múltiplos bancos e ORMs.",
    color: "from-blue-500 to-red-500",
  },
  {
    icon: Rocket,
    title: "Deploy Automático",
    description: "Publique seus bots com um clique em qualquer plataforma.",
    color: "from-green-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Tokens protegidos, permissões granulares e controle de acesso total.",
    color: "from-red-500 to-violet-500",
  },
  {
    icon: Users,
    title: "Multi-plataforma",
    description: "Suporte nativo para todas as principais plataformas de mensageria.",
    color: "from-cyan-500 to-red-500",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Recursos
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo que você precisa para criar
              <br />
              <span className="text-gradient">Bots incríveis</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Uma plataforma completa com ferramentas profissionais para desenvolvedores
              e criadores de bots.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
              <div className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
                feature.color
              )}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
