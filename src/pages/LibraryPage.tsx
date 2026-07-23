import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Library,
  Search,
  Plus,
  FileCode2,
  BookOpen,
  Code2,
  Star,
  Clock,
  Copy,
  Download,
  FileText,
} from "lucide-react";

const items = {
  snippets: [
    { id: "1", title: "Discord Embed Builder", language: "TypeScript", description: "Criação de embeds personalizados para Discord", stars: 24, saved: "2 dias atrás" },
    { id: "2", title: "WhatsApp Message Handler", language: "Python", description: "Handler de mensagens para WhatsApp", stars: 18, saved: "5 dias atrás" },
    { id: "3", title: "Telegram Inline Keyboard", language: "JavaScript", description: "Teclado inline para bots do Telegram", stars: 15, saved: "1 semana atrás" },
    { id: "4", title: "Rate Limiter Middleware", language: "TypeScript", description: "Middleware de rate limiting para APIs", stars: 12, saved: "2 semanas atrás" },
    { id: "5", title: "Database Connection Pool", language: "TypeScript", description: "Pool de conexões para banco de dados", stars: 9, saved: "3 semanas atrás" },
  ],
  templates: [
    { id: "t1", title: "Bot Discord Básico", platform: "Discord", description: "Estrutura inicial para bot no Discord", uses: 234, updated: "1 mês atrás" },
    { id: "t2", title: "ChatBot WhatsApp", platform: "WhatsApp", description: "Template de chatbot para WhatsApp", uses: 189, updated: "2 semanas atrás" },
    { id: "t3", title: "Bot de Moderação", platform: "Telegram", description: "Sistema de moderação automática", uses: 156, updated: "3 semanas atrás" },
  ],
  docs: [
    { id: "d1", title: "Guia de Introdução", category: "Getting Started", description: "Aprenda os conceitos básicos do SS Bots", readTime: "10 min" },
    { id: "d2", title: "API Reference", category: "Referência", description: "Documentação completa da API", readTime: "30 min" },
    { id: "d3", title: "Flow Builder Guide", category: "Tutorial", description: "Como usar o construtor visual de fluxos", readTime: "15 min" },
  ],
};

export function LibraryPage() {
  const [search, setSearch] = useState("");

  const filterItems = (items: any[]) =>
    items.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca</h1>
          <p className="text-muted-foreground">Snippets, templates e documentação</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar à Biblioteca
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar na biblioteca..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="snippets">
        <TabsList>
          <TabsTrigger value="snippets">
            <Code2 className="mr-2 h-4 w-4" />
            Snippets
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileCode2 className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="mr-2 h-4 w-4" />
            Documentação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="snippets" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filterItems(items.snippets).map((snippet) => (
              <motion.div key={snippet.id} layout>
                <Card className="card-hover h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{snippet.language}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <CardTitle className="text-sm">{snippet.title}</CardTitle>
                    <CardDescription className="text-xs">{snippet.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {snippet.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {snippet.saved}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filterItems(items.templates).map((template) => (
              <motion.div key={template.id} layout>
                <Card className="card-hover h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{template.platform}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <CardTitle className="text-sm">{template.title}</CardTitle>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                      <span>{template.uses} usos</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.updated}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filterItems(items.docs).map((doc) => (
              <motion.div key={doc.id} layout>
                <Card className="card-hover h-full flex flex-col cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{doc.category}</Badge>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-sm">{doc.title}</CardTitle>
                    <CardDescription className="text-xs">{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    <span className="text-xs text-muted-foreground">{doc.readTime} de leitura</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
