/**
 * Flow-to-Code Converter
 * Converte fluxos visuais em código executável
 */

export interface FlowBlock {
  id: string;
  type: string;
  label: string;
  config: Record<string, string>;
  positionX: number;
  positionY: number;
  connections: Array<{ from: string; to: string; label?: string }>;
}

export interface CodeBlock {
  type: string;
  code: string;
  imports: string[];
  dependencies: string[];
  config: string;
}

export function flowToCode(blocks: FlowBlock[]): CodeGenerationResult {
  const imports = new Set<string>();
  const dependencies = new Set<string>();
  const codeParts: string[] = [];
  const configs: string[] = [];

  // Ordenar blocos por posição Y (top-down)
  const sortedBlocks = [...blocks].sort((a, b) => a.positionY - b.positionY);

  for (const block of sortedBlocks) {
    const result = generateCodeFromBlock(block);
    result.imports.forEach((i) => imports.add(i));
    result.dependencies.forEach((d) => dependencies.add(d));
    codeParts.push(result.code);
    configs.push(result.config);
  }

  const code = codeParts.join("\n\n");
  
  return {
    files: [{
      path: "src/flow.ts",
      language: "typescript",
      content: `${Array.from(imports).join("\n")}\n\n${code}`,
    }],
    dependencies: Array.from(dependencies),
    setupCommands: [],
    readme: "# Flow Gerado Automaticamente\n\nEste código foi gerado a partir do Flow Builder.",
  };
}

function generateCodeFromBlock(block: FlowBlock): {
  code: string;
  imports: string[];
  dependencies: string[];
  config: string;
} {
  switch (block.type) {
    case "trigger":
      return generateTriggerCode(block);
    case "message":
      return generateMessageCode(block);
    case "condition":
      return generateConditionCode(block);
    case "ai":
      return generateAICode(block);
    case "database":
      return generateDatabaseCode(block);
    case "response":
      return generateResponseCode(block);
    case "webhook":
      return generateWebhookCode(block);
    case "delay":
      return generateDelayCode(block);
    case "filter":
      return generateFilterCode(block);
    case "code":
      return generateCustomCode(block);
    default:
      return {
        code: `// Block: ${block.label} (${block.type})`,
        imports: [],
        dependencies: [],
        config: "",
      };
  }
}

function generateTriggerCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  return {
    code: `// 🎯 Trigger Configurado
export const TRIGGER_CONFIG = ${JSON.stringify(block.config, null, 2)};

export async function handleTrigger(event: any) {
  console.log(\`[TRIGGER] Evento recebido: \${event.type}\`);
  return event;
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateMessageCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const content = block.config.content || "Olá! Como posso ajudar?";
  return {
    code: `// 💬 Mensagem
export async function sendMessage(channel: any, content: string = ${JSON.stringify(content)}) {
  return await channel.send(content);
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateConditionCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const condition = block.config.condition || "true";
  return {
    code: `// 🔀 Condição
export async function evaluateCondition(data: any): Promise<boolean> {
  try {
    const result = ${condition};
    console.log(\`[CONDITION] Resultado: \${result}\`);
    return result;
  } catch (error) {
    console.error('[CONDITION] Erro:', error);
    return false;
  }
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateAICode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const prompt = block.config.prompt || "Processar com IA";
  return {
    code: `// 🧠 Processamento com IA
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processWithAI(input: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: ${JSON.stringify(prompt)} },
      { role: "user", content: input },
    ],
  });
  
  return completion.choices[0]?.message?.content || "";
}`,
    imports: ["import OpenAI from 'openai';"],
    dependencies: ["openai@^4.0.0"],
    config: JSON.stringify(block.config),
  };
}

function generateDatabaseCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const operation = block.config.operation || "save";
  return {
    code: `// 💾 Operação de Banco de Dados
export async function executeDatabaseOperation(operation: string = ${JSON.stringify(operation)}, data: any) {
  console.log(\`[DATABASE] Operação: \${operation}\`);
  // TODO: Implementar operação real
  return { success: true, data };
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateResponseCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const responseType = block.config.responseType || "text";
  return {
    code: `// 📤 Resposta
export async function sendResponse(context: any, message: string, type: string = ${JSON.stringify(responseType)}) {
  console.log(\`[RESPONSE] Enviando resposta tipo \${type}\`);
  
  switch (type) {
    case 'text':
      return await context.reply(message);
    case 'embed':
      return await context.reply({ embeds: [{ description: message, color: 0xE11D48 }] });
    case 'button':
      return await context.reply({ content: message, components: [] });
    default:
      return await context.reply(message);
  }
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateWebhookCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const url = block.config.url || "https://example.com/webhook";
  return {
    code: `// 🌐 Webhook
export async function callWebhook(data: any) {
  const response = await fetch(${JSON.stringify(url)}, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateDelayCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const ms = parseInt(block.config.duration) || 1000;
  return {
    code: `// ⏰ Atraso
export function delay(ms: number = ${ms}): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateFilterCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  return {
    code: `// 🔍 Filtro
export function applyFilter(data: any, rules: Record<string, any> = {}) {
  // TODO: Implementar regras de filtro
  return data;
}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

function generateCustomCode(block: FlowBlock): ReturnType<typeof generateCodeFromBlock> {
  const customCode = block.config.code || "// Código personalizado";
  return {
    code: `// 💻 Código Personalizado
${customCode}`,
    imports: [],
    dependencies: [],
    config: JSON.stringify(block.config),
  };
}

import { CodeGenerationResult } from "./code-generator";

/**
 * Converte prompt de texto em fluxo visual
 */
export function promptToFlow(prompt: string): FlowBlock[] {
  const lowerPrompt = prompt.toLowerCase();
  const blocks: FlowBlock[] = [];
  let y = 50;

  // Sempre começa com trigger
  blocks.push({
    id: "trigger-1",
    type: "trigger",
    label: "Evento Inicial",
    config: {},
    positionX: 300,
    positionY: y,
    connections: [],
  });
  y += 130;

  // Adiciona blocos baseados no prompt
  if (lowerPrompt.includes("mensagem") || lowerPrompt.includes("responder")) {
    blocks.push({
      id: "message-1",
      type: "message",
      label: "Processar Mensagem",
      config: { content: "Mensagem recebida" },
      positionX: 300,
      positionY: y,
      connections: [{ from: "trigger-1", to: "message-1" }],
    });
    y += 130;
  }

  if (lowerPrompt.includes("ia") || lowerPrompt.includes("inteligência") || lowerPrompt.includes("gpt")) {
    blocks.push({
      id: "ai-1",
      type: "ai",
      label: "Processar com IA",
      config: { prompt: "Processar mensagem com IA", model: "gpt-4" },
      positionX: 300,
      positionY: y,
      connections: [{ from: "message-1", to: "ai-1" }],
    });
    y += 130;
  }

  if (lowerPrompt.includes("banco") || lowerPrompt.includes("salvar") || lowerPrompt.includes("dados")) {
    blocks.push({
      id: "db-1",
      type: "database",
      label: "Salvar no Banco",
      config: { operation: "save" },
      positionX: 300,
      positionY: y,
      connections: [{ from: "ai-1", to: "db-1" }],
    });
    y += 130;
  }

  if (lowerPrompt.includes("condição") || lowerPrompt.includes("se ") || lowerPrompt.includes("verificar")) {
    blocks.push({
      id: "cond-1",
      type: "condition",
      label: "Verificar Condição",
      config: { condition: "data.type === 'ticket'" },
      positionX: 300,
      positionY: y,
      connections: [{ from: "db-1", to: "cond-1" }],
    });
    y += 130;
  }

  // Sempre termina com resposta
  blocks.push({
    id: "response-1",
    type: "response",
    label: "Enviar Resposta",
    config: { responseType: "text" },
    positionX: 300,
    positionY: y,
    connections: [{ from: blocks[blocks.length - 1].id, to: "response-1" }],
  });

  return blocks;
}

/**
 * Converte código em fluxo visual (análise básica)
 */
export function codeToFlow(code: string): FlowBlock[] {
  const blocks: FlowBlock[] = [];
  let y = 50;
  let prevId = "";

  const lines = code.split("\n");
  
  // Trigger inicial
  const triggerBlock: FlowBlock = {
    id: "flow-trigger",
    type: "trigger",
    label: "Código Inicial",
    config: {},
    positionX: 300,
    positionY: y,
    connections: [],
  };
  blocks.push(triggerBlock);
  prevId = "flow-trigger";
  y += 130;

  // Analisa padrões comuns no código
  if (code.includes("message") || code.includes("interaction")) {
    const msgBlock: FlowBlock = {
      id: "flow-msg",
      type: "message",
      label: "Handler de Mensagem",
      config: { content: "Mensagem detectada no código" },
      positionX: 300,
      positionY: y,
      connections: [{ from: prevId, to: "flow-msg" }],
    };
    blocks.push(msgBlock);
    prevId = "flow-msg";
    y += 130;
  }

  if (code.includes("if") || code.includes("switch") || code.includes("?")) {
    const condBlock: FlowBlock = {
      id: "flow-cond",
      type: "condition",
      label: "Condição Detectada",
      config: { condition: "Código contém lógica condicional" },
      positionX: 300,
      positionY: y,
      connections: [{ from: prevId, to: "flow-cond" }],
    };
    blocks.push(condBlock);
    prevId = "flow-cond";
    y += 130;
  }

  if (code.includes("config") || code.includes("env") || code.includes("process.env")) {
    const dbBlock: FlowBlock = {
      id: "flow-config",
      type: "database",
      label: "Configurações/Banco",
      config: { operation: "read" },
      positionX: 300,
      positionY: y,
      connections: [{ from: prevId, to: "flow-config" }],
    };
    blocks.push(dbBlock);
    prevId = "flow-config";
    y += 130;
  }

  // Resposta final
  const responseBlock: FlowBlock = {
    id: "flow-response",
    type: "response",
    label: "Resposta Final",
    config: { responseType: "text" },
    positionX: 300,
    positionY: y,
    connections: [{ from: prevId, to: "flow-response" }],
  };
  blocks.push(responseBlock);

  return blocks;
}
