import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Crown,
  DollarSign,
  Shield,
  Settings2,
  BarChart3,
  Megaphone,
  BadgeCheck,
  Link2,
  Gift,
  RefreshCcw,
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

const BADGE_TYPES = [
  { value: "premium", label: "Premium" },
  { value: "creator", label: "Criador" },
  { value: "partner", label: "Parceiro" },
  { value: "admin", label: "Admin" },
  { value: "team", label: "Equipe" },
  { value: "beta", label: "Beta Tester" },
];

const AD_PAGES = [
  { value: "landing", label: "Landing Page" },
  { value: "dashboard", label: "Dashboard" },
  { value: "marketplace", label: "Marketplace" },
  { value: "bots", label: "Bots" },
  { value: "integrations", label: "Integrações" },
  { value: "templates", label: "Templates" },
];

export function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  // Queries
  let stats: any = null;
  let users: any[] = [];
  let allAdSlots: any[] = [];
  let settings: Record<string, string> = {};

  try {
    stats = useQuery(api.monetization.getAdminStats);
    users = useQuery(api.monetization.getAllUsersWithBadges) || [];
    allAdSlots = useQuery(api.monetization.getAllAdSlots) || [];
    settings = useQuery(api.monetization.getAdminSettings) || {};
  } catch {
    // Convex not available
  }

  // Mutations
  const setSetting = useMutation(api.monetization.setSetting);
  const assignBadge = useMutation(api.monetization.assignBadge);
  const removeBadge = useMutation(api.monetization.removeBadge);
  const createAdSlot = useMutation(api.monetization.createAdSlot);
  const updateAdSlot = useMutation(api.monetization.updateAdSlot);
  const deleteAdSlot = useMutation(api.monetization.deleteAdSlot);

  // Local state
  const [newPrice, setNewPrice] = useState(settings.premium_price || "4.99");
  const [newAd, setNewAd] = useState({ page: "dashboard", position: "sidebar", title: "", description: "", linkUrl: "" });
  const [searchUsers, setSearchUsers] = useState("");

  const handleSavePrice = async () => {
    try {
      await setSetting({ key: "premium_price", value: newPrice, description: "Preço do Premium em BRL" });
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  const handleToggleAd = async (id: string, enabled: boolean) => {
    try {
      await updateAdSlot({ id: id as any, enabled: !enabled });
    } catch (e) {
      console.error("Erro ao atualizar anúncio:", e);
    }
  };

  const handleDeleteAd = async (id: string) => {
    try {
      await deleteAdSlot({ id: id as any });
    } catch (e) {
      console.error("Erro ao deletar anúncio:", e);
    }
  };

  const handleCreateAd = async () => {
    try {
      await createAdSlot({
        page: newAd.page,
        position: newAd.position,
        frequency: 0,
        title: newAd.title || undefined,
        description: newAd.description || undefined,
        linkUrl: newAd.linkUrl || undefined,
      });
      setNewAd({ page: "dashboard", position: "sidebar", title: "", description: "", linkUrl: "" });
    } catch (e) {
      console.error("Erro ao criar anúncio:", e);
    }
  };

  const statsCards = [
    { label: "Total Usuários", value: stats?.totalUsers || 0, icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Usuários Premium", value: stats?.premiumUsers || 0, icon: Crown, color: "from-amber-500 to-orange-500" },
    { label: "Receita Total", value: `R$ ${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: "from-emerald-500 to-teal-500" },
    { label: "Conversão", value: `${stats?.conversionRate || "0.0"}%`, icon: BarChart3, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
          </div>
          <p className="text-muted-foreground">Gerencie a plataforma, usuários e monetização</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
                      <stat.icon className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="premium">
            <Crown className="mr-2 h-4 w-4" />
            Premium
          </TabsTrigger>
          <TabsTrigger value="ads">
            <Megaphone className="mr-2 h-4 w-4" />
            Anúncios
          </TabsTrigger>
          <TabsTrigger value="badges">
            <BadgeCheck className="mr-2 h-4 w-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings2 className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuários Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">{stats?.premiumUsers || 0}</Badge>
                    Premium
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant="outline">{stats?.freeUsers || 0}</Badge>
                    Gratuito
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {(stats?.totalRevenue || 0).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">{stats?.totalPayments || 0} pagamentos processados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Indicações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalReferrals || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">{stats?.activeSubscriptions || 0} assinaturas ativas</p>
              </CardContent>
            </Card>
          </div>

          {/* Ad Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Status dos Anúncios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">{stats?.activeAds || 0} ativos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm">{(stats?.totalAds || 0) - (stats?.activeAds || 0)} inativos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Total: {stats?.totalAds || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Usuários</CardTitle>
                  <CardDescription>{users.length} usuários cadastrados</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuário..."
                    className="pl-9 w-64"
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users
                  .filter((u: any) =>
                    !searchUsers || u.name?.toLowerCase().includes(searchUsers.toLowerCase())
                  )
                  .slice(0, 20)
                  .map((user: any) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {user.name?.[0] || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{user.name || "Usuário"}</span>
                            {user.plan === "premium" && (
                              <Crown className="h-3 w-3 text-amber-500" />
                            )}
                            {user.badges?.map((b: any) => (
                              <Badge key={b.type} variant="outline" className="text-[10px]">
                                {b.type}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.plan === "premium" ? "default" : "secondary"}>
                          {user.plan === "premium" ? "Premium" : "Gratuito"}
                        </Badge>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium Tab */}
        <TabsContent value="premium" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                Gerenciar Premium
              </CardTitle>
              <CardDescription>Configure o plano Premium da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Premium Price */}
              <div className="space-y-2">
                <Label>Preço do Premium (R$)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">BRL / mês</span>
                  <Button size="sm" onClick={handleSavePrice}>
                    <RefreshCcw className="mr-1 h-3 w-3" />
                    Atualizar
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-2xl font-bold">{stats?.premiumUsers || 0}</p>
                  <p className="text-xs text-muted-foreground">Assinantes Premium</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-2xl font-bold">{stats?.conversionRate || "0.0"}%</p>
                  <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone className="h-4 w-4" />
                    Gerenciar Anúncios
                  </CardTitle>
                  <CardDescription>Crie e gerencie os espaços de anúncio</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Create New Ad */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Anúncio
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Página</Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newAd.page}
                      onChange={(e) => setNewAd({ ...newAd, page: e.target.value })}
                    >
                      {AD_PAGES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Posição</Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newAd.position}
                      onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
                    >
                      <option value="sidebar">Sidebar</option>
                      <option value="top">Topo</option>
                      <option value="bottom">Fim</option>
                      <option value="inline">Inline</option>
                      <option value="banner">Banner</option>
                    </select>
                  </div>
                </div>
                <Input
                  placeholder="Título do anúncio"
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                />
                <Input
                  placeholder="Descrição"
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                />
                <Input
                  placeholder="Link (https://...)"
                  value={newAd.linkUrl}
                  onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
                />
                <Button size="sm" onClick={handleCreateAd}>
                  <Plus className="mr-1 h-3 w-3" />
                  Criar Anúncio
                </Button>
              </div>

              {/* Existing Ads */}
              {allAdSlots.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Anúncios Existentes</h3>
                  {allAdSlots.map((ad: any) => (
                    <div
                      key={ad._id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${ad.enabled ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{ad.title || "Sem título"}</span>
                            <Badge variant="outline" className="text-[10px]">{ad.page}</Badge>
                            <Badge variant="outline" className="text-[10px]">{ad.position}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{ad.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={ad.enabled}
                          onCheckedChange={() => handleToggleAd(ad._id, ad.enabled)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteAd(ad._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                Gerenciar Badges
              </CardTitle>
              <CardDescription>Atribua badges para usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.slice(0, 20).map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {user.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name || "Usuário"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {BADGE_TYPES.map((badgeType) => {
                        const hasBadge = user.badges?.some((b: any) => b.type === badgeType.value);
                        return (
                          <Button
                            key={badgeType.value}
                            variant={hasBadge ? "default" : "outline"}
                            size="sm"
                            className="text-[10px] h-7"
                            onClick={async () => {
                              if (hasBadge) {
                                await removeBadge({ userId: user._id, type: badgeType.value });
                              } else {
                                await assignBadge({ userId: user._id, type: badgeType.value });
                              }
                            }}
                          >
                            {hasBadge ? "✓ " : ""}{badgeType.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Configurações da Plataforma
              </CardTitle>
              <CardDescription>Configure aspectos globais do SS Bots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border p-4 space-y-4">
                <h3 className="text-sm font-semibold">Sistema Premium</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Premium Ativo</Label>
                    <p className="text-xs text-muted-foreground">Habilita/desabilita o sistema premium</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <h3 className="text-sm font-semibold">Programa de Criadores</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Criadores Ativos</Label>
                    <p className="text-xs text-muted-foreground">Permite códigos de criador e indicação</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Links Personalizados</Label>
                    <p className="text-xs text-muted-foreground">Permite links do tipo ssbots.com/seulink</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <h3 className="text-sm font-semibold">Anúncios</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Anúncios Ativos</Label>
                    <p className="text-xs text-muted-foreground">Exibe anúncios para usuários gratuitos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Máximo de anúncios por página</Label>
                  <Input type="number" defaultValue="3" className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
