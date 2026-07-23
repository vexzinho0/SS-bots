import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X as XIcon, ArrowLeft, Sparkles, Crown, Zap, Gift, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PREMIUM_BENEFITS, MONETIZATION_CONFIG, formatPremiumPrice } from "@/lib/monetization";

const FREE_FEATURES = [
  "Criação de Bots",
  "Editor Completo",
  "Terminal",
  "1 Workspace",
  "IA Básica",
  "Marketplace Acesso",
  "Integrações Básicas",
  "MCP Hub",
  "Deploy (3 por mês)",
  "Comunidade Suporte",
];

const PREMIUM_FEATURES = [
  "Tudo do Gratuito",
  "Sem Anúncios",
  "Badge Premium Exclusiva",
  "Código de Criador",
  "Links Personalizados (ssbots.com/seu-link)",
  "IA Prioritária e mais rápida",
  "Workspaces Ilimitados",
  "Suporte Prioritário 24/7",
  "Deploy Ilimitado",
  "Recursos Exclusivos",
  "Acesso Antecipado",
  "Templates Premium",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">SS <span className="text-primary">Bots</span></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
            <Sparkles className="mr-1 h-3 w-3" />
            Simples e transparente
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Escolha o plano ideal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e faça upgrade quando precisar de mais recursos.
            Cancele quando quiser, sem multas.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Free Plan */}
          <motion.div variants={item}>
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <CardDescription>Para começar seus primeiros projetos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {FREE_FEATURES.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  Começar Grátis
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Premium Plan */}
          <motion.div variants={item}>
            <Card className="relative h-full overflow-hidden border-primary/30 shadow-lg">
              {/* Premium gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">SS Bots Premium</CardTitle>
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                    MAIS POPULAR
                  </Badge>
                </div>
                <CardDescription>Para criadores profissionais</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatPremiumPrice()}</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {PREMIUM_FEATURES.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      {i < 4 ? (
                        <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                  onClick={() => navigate("/settings?tab=billing")}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Assinar Premium
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-24"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            Tudo que você ganha com Premium
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PREMIUM_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="group hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                      benefit.highlight
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm"
                        : "bg-primary/10"
                    }`}>
                      <Icon className={`h-5 w-5 ${benefit.highlight ? "text-white" : "text-primary"}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-muted-foreground">
            Dúvidas? Entre em contato pelo{" "}
            <button className="text-primary underline hover:text-primary/80 transition-colors">
              suporte@ssbots.com
            </button>
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" />
              Cancele quando quiser
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" />
              Sem fidelidade
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" />
              Pagamento seguro
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
