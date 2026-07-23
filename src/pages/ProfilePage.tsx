import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PremiumBadge, BadgeList } from "@/components/premium/PremiumBadge";
import {
  User,
  Mail,
  Building2,
  Calendar,
  Camera,
  Shield,
  Crown,
  Gift,
  Link2,
  Users,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ChevronRight,
  DollarSign,
  RefreshCcw,
  Star,
  Trophy,
  Save,
} from "lucide-react";
import { getPremiumStatusInfo, formatPremiumPrice, type BadgeType } from "@/lib/monetization";

export function ProfilePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Queries
  let user: any = null;
  let status: any = { isPremium: false, isExpired: false, daysRemaining: 0 };
  let badges: any[] = [];
  let creatorCode: any = null;
  let customLink: any = null;
  let referrals: any[] = [];
  let payments: any[] = [];

  try {
    user = useQuery(api.auth.getMe);
    status = useQuery(api.monetization.checkSubscriptionStatus) || { isPremium: false, isExpired: false, daysRemaining: 0 };
    badges = useQuery(api.monetization.getMyBadges) || [];
    creatorCode = useQuery(api.monetization.getMyCreatorCode);
    customLink = useQuery(api.monetization.getMyCustomLink);
    referrals = useQuery(api.monetization.getMyReferrals) || [];
    payments = useQuery(api.monetization.getMyPayments) || [];
  } catch {
    // Convex not available
  }

  const createCreatorCode = useMutation(api.monetization.createCreatorCode);
  const createCustomLink = useMutation(api.monetization.createCustomLink);

  const [creatorCodeInput, setCreatorCodeInput] = useState("");
  const [customLinkInput, setCustomLinkInput] = useState("");

  const handleCopyReferral = () => {
    if (creatorCode?.code) {
      navigator.clipboard.writeText(creatorCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const premiumInfo = getPremiumStatusInfo(user?.premiumExpiresAt);

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações e plano</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{user?.name || "Usuário"}</h2>
                  <BadgeList
                    badges={badges.map((b: any) => b.type as BadgeType)}
                    size="sm"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {status.isPremium ? (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      <Crown className="mr-1 h-3 w-3" />
                      SS Bots Premium
                      {status.daysRemaining > 0 && ` • ${status.daysRemaining}d`}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Plano Gratuito</Badge>
                  )}
                  {user?.role === "admin" && (
                    <Badge variant="outline" className="text-primary border-primary/30">Admin</Badge>
                  )}
                </div>
              </div>
              {!status.isPremium && (
                <Button
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm"
                  onClick={() => navigate("/pricing")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Fazer Upgrade
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Atualize seus dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input defaultValue={user?.name || "Usuário"} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email || "usuario@email.com"} />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input placeholder="Sua empresa" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none h-20" placeholder="Conte um pouco sobre você..." />
              </div>
            </CardContent>
          </Card>

          {/* Creator Code */}
          {status.isPremium && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="h-4 w-4 text-amber-500" />
                  Código de Criador
                </CardTitle>
                <CardDescription>Compartilhe e ganhe benefícios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {creatorCode ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div>
                        <p className="text-lg font-bold tracking-wider text-primary">{creatorCode.code}</p>
                        <p className="text-xs text-muted-foreground">{creatorCode.usesCount} usos</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={handleCopyReferral}>
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Compartilhe este código com amigos. Quando eles se cadastrarem, você ganha recompensas!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Seu código (ex: VEX)"
                        value={creatorCodeInput}
                        onChange={(e) => setCreatorCodeInput(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="uppercase"
                      />
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await createCreatorCode({ code: creatorCodeInput });
                            setCreatorCodeInput("");
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        disabled={creatorCodeInput.length < 2}
                      >
                        Criar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Use apenas letras e números (2-10 caracteres)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Informações da Conta
              </CardTitle>
              <CardDescription>Detalhes da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Membro desde</p>
                    <p className="text-xs text-muted-foreground">Janeiro 2025</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email verificado</p>
                    <p className="text-xs text-muted-foreground">{user?.emailVerificationTime ? "Sim" : "Não"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Plano</p>
                    <p className="text-xs text-muted-foreground">
                      {status.isPremium ? "Premium" : "Gratuito"}
                      {status.isPremium && status.daysRemaining > 0 && ` • ${status.daysRemaining} dias restantes`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Link (Premium only) */}
          {status.isPremium && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  Link Personalizado
                </CardTitle>
                <CardDescription>ssbots.com/seu-link</CardDescription>
              </CardHeader>
              <CardContent>
                {customLink ? (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">ssbots.com/</span>
                        <span className="text-primary font-bold">{customLink.slug}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{customLink.visits} visitas</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.open(`https://ssbots.com/${customLink.slug}`, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                      ssbots.com/
                    </div>
                    <Input
                      placeholder="seu-link"
                      value={customLinkInput}
                      onChange={(e) => setCustomLinkInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await createCustomLink({ slug: customLinkInput });
                          setCustomLinkInput("");
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      disabled={customLinkInput.length < 3}
                    >
                      Criar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Referrals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Indicações
                {referrals.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">{referrals.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>Pessoas que você indicou</CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="space-y-2">
                  {referrals.slice(0, 5).map((ref: any) => (
                    <div key={ref._id} className="flex items-center justify-between rounded-lg border border-border p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {ref.referredName?.[0] || "U"}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{ref.referredName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {ref.status === "converted" ? "Convertido" : "Pendente"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={ref.status === "converted" ? "default" : "outline"} className="text-[10px]">
                        {ref.status === "converted" ? "✓" : "..."}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhuma indicação ainda</p>
                  {creatorCode && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Compartilhe seu código <strong className="text-primary">{creatorCode.code}</strong> e ganhe benefícios!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges */}
          {badges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Badges & Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge: any) => (
                    <PremiumBadge
                      key={badge.type}
                      type={badge.type as BadgeType}
                      size="md"
                      showLabel
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.map((payment: any) => (
                <div key={payment._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {payment.description || "Assinatura Premium"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")} • {payment.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      R$ {(payment.amount / 100).toFixed(2)}
                    </p>
                    <Badge variant={payment.status === "completed" ? "default" : "secondary"} className="text-[10px]">
                      {payment.status === "completed" ? "Pago" : payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
