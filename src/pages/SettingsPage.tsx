import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Bell,
  Shield,
  Palette,
  Key,
  Globe,
  User,
  ChevronRight,
  Moon,
  Sun,
  Crown,
  DollarSign,
  CreditCard,
  Receipt,
  Zap,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Gift,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { formatPremiumPrice } from "@/lib/monetization";

export function SettingsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "general";
  const [tab, setTab] = useState(initialTab);
  const { theme, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  // Queries
  let status: any = { isPremium: false, isExpired: false, daysRemaining: 0 };
  let user: any = null;

  try {
    status = useQuery(api.monetization.checkSubscriptionStatus) || { isPremium: false, isExpired: false, daysRemaining: 0 };
    user = useQuery(api.auth.getMe);
  } catch {
    // Convex not available
  }

  const createSubscription = useMutation(api.monetization.createSubscription);
  const cancelSubscription = useMutation(api.monetization.cancelSubscription);

  const handleCopyCode = () => {
    if (user?.creatorCode) {
      navigator.clipboard.writeText(`SSBOTS-${user.creatorCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e plano</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">
            <User className="mr-2 h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Crown className="mr-2 h-4 w-4" />
            Assinatura
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Idioma e Região</CardTitle>
              <CardDescription>Configure suas preferências de idioma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Idioma</Label>
                  <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fuso Horário</Label>
                  <p className="text-sm text-muted-foreground">America/Sao_Paulo (UTC-3)</p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>Personalize a aparência da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <Label>Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      {theme === "dark" ? "Modo escuro ativado" : "Modo claro ativado"}
                    </p>
                  </div>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          {status.isPremium ? (
            <>
              {/* Premium Active */}
              <Card className="overflow-hidden border-primary/30 shadow-md">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>SS Bots Premium</CardTitle>
                        <CardDescription>Seu plano está ativo</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                      <Sparkles className="mr-1 h-3 w-3" />
                      ATIVO
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-semibold text-emerald-500">Ativo</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Dias Restantes</p>
                      <p className="text-sm font-semibold">{status.daysRemaining} dias</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
                    <div className="flex items-start gap-3">
                      <Gift className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Seu Código de Criador</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Compartilhe e ganhe benefícios exclusivos
                        </p>
                        {user?.creatorCode ? (
                          <div className="flex items-center gap-2 mt-2">
                            <code className="rounded bg-background px-2 py-1 text-sm font-bold text-primary">
                              {user.creatorCode}
                            </code>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyCode}>
                              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/profile")}>
                            Criar Código
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (confirm("Tem certeza que deseja cancelar sua assinatura?")) {
                          try {
                            await cancelSubscription();
                          } catch (e) {
                            console.error(e);
                          }
                        }
                      }}
                    >
                      Cancelar Assinatura
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Gerenciar Pagamento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Benefícios Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Sem Anúncios",
                      "Badge Premium",
                      "IA Prioritária",
                      "Links Personalizados",
                      "Código de Criador",
                      "Suporte Prioritário",
                      "Workspaces Ilimitados",
                      "Deploy Ilimitado",
                    ].map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Free Plan */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>Plano Gratuito</CardTitle>
                      <CardDescription>Faça upgrade para desbloquear recursos premium</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">SS Bots Premium</p>
                        <p className="text-2xl font-bold mt-1">
                          {formatPremiumPrice()}
                          <span className="text-sm font-normal text-muted-foreground">/mês</span>
                        </p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                        onClick={() => navigate("/pricing")}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Assinar Agora
                      </Button>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Benefícios Premium:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Sem Anúncios",
                        "Badge Premium",
                        "IA Prioritária",
                        "Links Personalizados",
                        "Código de Criador",
                        "Suporte Prioritário",
                      ].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 text-sm">
                          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Métodos de Pagamento
                  </CardTitle>
                  <CardDescription>Formas de pagamento disponíveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Cartão de Crédito", icon: CreditCard, status: "breve" },
                      { name: "Pix", icon: Zap, status: "breve" },
                      { name: "Boleto", icon: Receipt, status: "breve" },
                      { name: "PayPal", icon: ExternalLink, status: "breve" },
                    ].map((method) => (
                      <div
                        key={method.name}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 opacity-50"
                      >
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{method.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{method.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Controle quais notificações receber</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Atualizações de Bots", description: "Quando um bot fica online/offline" },
                { label: "Deploy Completo", description: "Quando um deploy é finalizado" },
                { label: "Erros e Alertas", description: "Sobre erros nos seus bots" },
                { label: "Novas Integrações", description: "Quando novas integrações disponíveis" },
                { label: "Marketplace", description: "Novos itens e atualizações" },
                { label: "Promoções Premium", description: "Ofertas e benefícios exclusivos" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <Label className="text-sm">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="my-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Proteja sua conta e dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticação de Dois Fatores (2FA)</Label>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sessões Ativas</Label>
                    <p className="text-sm text-muted-foreground">Gerencie seus dispositivos conectados</p>
                  </div>
                  <Button variant="outline" size="sm">Gerenciar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>Gerencie suas chaves de API para integrações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <Key className="mr-2 h-4 w-4" />
                Gerar Nova Chave
              </Button>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Chave de Produção</p>
                    <code className="text-xs text-muted-foreground">ssb_prod_••••••••••••••••</code>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">Revogar</Button>
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Chave de Desenvolvimento</p>
                    <code className="text-xs text-muted-foreground">ssb_dev_••••••••••••••••</code>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">Revogar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
}
