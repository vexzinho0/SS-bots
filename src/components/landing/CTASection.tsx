import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";

const benefits = [
  "Editor completo com IA integrada",
  "Flow Builder drag-and-drop",
  "Multi-plataforma (Discord, WhatsApp, etc.)",
  "Deploy em um clique",
  "Terminal próprio",
  "Integrações ilimitadas",
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-1/2 left-1/3 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl sm:p-12 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Comece agora
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para criar seu
                <br />
                <span className="text-gradient">primeiro Bot?</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Junte-se a milhares de desenvolvedores que já usam o SS Bots para
                criar, gerenciar e escalar seus bots com inteligência artificial.
              </p>

              <div className="mt-6 space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="xl"
                  onClick={() => navigate("/register")}
                  className="group shadow-lg shadow-primary/25"
                >
                  Criar conta gratuita
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="xl" variant="outline" onClick={() => navigate("/login")}>
                  Fazer login
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent blur-xl" />
                <div className="relative rounded-xl border border-border bg-background p-4 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">SS Bots - Editor</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
                    <div className="mt-3 flex gap-2">
                      <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full rounded bg-muted animate-pulse" />
                        <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
