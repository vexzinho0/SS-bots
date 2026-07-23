import React from "react";
import { motion } from "framer-motion";
import { PlatformIcon } from "@/components/ui/icon";
import { Globe } from "lucide-react";

const platforms = [
  { name: "Discord", icon: "discord", color: "bg-indigo-500" },
  { name: "WhatsApp", icon: "whatsapp", color: "bg-emerald-500" },
  { name: "Instagram", icon: "instagram", color: "bg-pink-500" },
  { name: "Telegram", icon: "telegram", color: "bg-blue-500" },
  { name: "YouTube", icon: "youtube", color: "bg-red-500" },
  { name: "Twitch", icon: "twitch", color: "bg-purple-500" },
  { name: "Slack", icon: "slack", color: "bg-orange-500" },
  { name: "Facebook", icon: "facebook", color: "bg-blue-600" },
  { name: "Personalizado", icon: "custom", color: "bg-primary" },
];

export function Platforms() {
  return (
    <section id="platforms" className="relative py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Plataformas
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Suporte para todas as
              <br />
              <span className="text-gradient">principais plataformas</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Crie bots para qualquer plataforma com nossa arquitetura universal.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.color} shadow-sm transition-transform group-hover:scale-110`}>
                {platform.icon === "custom" ? (
                  <Globe className="h-6 w-6 text-white" />
                ) : (
                  <PlatformIcon name={platform.icon} className="h-6 w-6 text-white brightness-0 invert" />
                )}
              </div>
              <span className="text-xs font-medium text-center">{platform.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-xl border border-border bg-card p-8 text-center"
        >
          <h3 className="text-xl font-bold">
            <span className="text-gradient">Plataforma Personalizada</span>
          </h3>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Envie sua documentação, importe OpenAPI/Swagger ou uma URL. Nossa IA
            interpreta automaticamente e cria as integrações necessárias.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
