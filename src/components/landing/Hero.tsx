import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/icon";
import { ArrowRight, Sparkles, Play, Code2, Zap } from "lucide-react";

const floatingIcons = [
  { icon: "discord", delay: 0, x: -120, y: -60 },
  { Component: Code2, delay: 0.2, x: 140, y: -40 },
  { icon: "telegram", delay: 0.4, x: -80, y: 70 },
  { icon: "whatsapp", delay: 0.6, x: 100, y: 80 },
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50 dark:from-black dark:via-black dark:to-zinc-950" />
      <div className="absolute inset-0 bg-hero-glow opacity-70" />
      <div className="absolute top-1/2 left-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Icons */}
      {floatingIcons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute hidden lg:block"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, item.x, item.x, 0],
            y: [0, item.y, item.y, 0],
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white/80 backdrop-blur-sm shadow-lg dark:bg-black/40">
            {'Component' in item ? (
              <item.Component className="h-6 w-6 text-primary" />
            ) : (
              <PlatformIcon name={item.icon!} className="h-6 w-6" />
            )}
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/50 px-4 py-1.5 text-sm backdrop-blur-sm dark:bg-black/30"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">
            Plataforma tudo-em-um para IA e Automação
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Crie, Gerencie e
          <br />
          <span className="text-gradient">Escalone seus Bots</span>
          <br />
          com Inteligência Artificial
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          A plataforma completa para criar, testar e fazer deploy de bots e automações inteligentes
          para Discord, WhatsApp, Telegram, Instagram e muito mais.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="xl"
            onClick={() => navigate("/register")}
            className="group relative overflow-hidden shadow-lg shadow-primary/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              Começar Grátis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Button>
          <Button
            size="xl"
            variant="outline"
            onClick={() => navigate("/login")}
            className="group"
          >
            <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
            Ver Demo
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Utilizado por desenvolvedores em todo o mundo
          </p>
          <div className="flex items-center justify-center gap-8 opacity-40 grayscale">
            {["GitHub", "Vercel", "Supabase", "Stripe", "Cloudflare"].map((name) => (
              <span key={name} className="text-lg font-bold tracking-tight text-foreground/60">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
