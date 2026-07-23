import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Github, ShieldAlert } from "lucide-react";
import { SSBotsLogo } from "@/components/ui/icon";
import { TurnstileWidget } from "@/components/ui/turnstile";
import type { TurnstileHandle } from "@/components/ui/turnstile";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(null);

    // Verificar se o Turnstile foi concluído
    if (!turnstileRef.current?.isVerified()) {
      setCaptchaError("Por favor, confirme que você não é um robô.");
      return;
    }

    setLoading(true);

    // Simula cadastro
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center justify-center">
              <SSBotsLogo size="lg" />
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">Criar Conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece gratuitamente. Sem cartão de crédito.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo de 8 caracteres
              </p>
            </div>

            {/* Cloudflare Turnstile - Verificação de segurança */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Verificação de segurança</span>
              </div>
              <TurnstileWidget 
                ref={turnstileRef}
                theme="light"
                size="normal"
                error={captchaError}
                onChange={() => setCaptchaError(null)}
              />
            </div>

            <Button type="submit" className="w-full group" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Criar conta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            <Github className="mr-2 h-4 w-4" />
            Cadastrar com GitHub
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Ao criar uma conta, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-foreground">Termos de Serviço</a>
            {" "}e{" "}
            <a href="#" className="underline hover:text-foreground">Política de Privacidade</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
