/**
 * SS Bots MCP Connector
 * Arquitetura para conexão com servidores MCP (Model Context Protocol)
 * Compatível com o MCP Connector da Claude
 * https://platform.claude.com/docs/en/agents-and-tools/mcp-connector
 */

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  description: string;
  type: "claude" | "custom" | "community";
  status: "connected" | "disconnected" | "error";
  version: string;
  capabilities: string[];
  config: Record<string, any>;
  permissions: MCPPermission[];
  lastConnected?: Date;
}

export interface MCPPermission {
  resource: string;
  actions: ("read" | "write" | "execute" | "admin")[];
  enabled: boolean;
}

export interface MCPMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
  name?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  input_schema: Record<string, any>;
  serverId: string;
  enabled: boolean;
}

export interface MCPConnectionConfig {
  url: string;
  apiKey?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

export const defaultMCPServers: MCPServer[] = [
  {
    id: "claude-official",
    name: "Claude MCP Official",
    url: "https://mcp.claude.ai/connect",
    description: "Conexão oficial com o Claude MCP Connector da Anthropic",
    type: "claude",
    status: "disconnected",
    version: "1.0.0",
    capabilities: ["code_generation", "file_operations", "web_search", "data_analysis"],
    config: {},
    permissions: [
      { resource: "files", actions: ["read", "write"], enabled: true },
      { resource: "code", actions: ["read", "write", "execute"], enabled: true },
      { resource: "terminal", actions: ["read", "execute"], enabled: false },
      { resource: "network", actions: ["read"], enabled: false },
    ],
  },
  {
    id: "supabase-mcp",
    name: "Supabase MCP",
    url: "https://mcp.supabase.com/v1",
    description: "Acesso ao banco de dados Supabase via MCP",
    type: "community",
    status: "disconnected",
    version: "0.9.0",
    capabilities: ["database_query", "database_schema", "row_operations"],
    config: {},
    permissions: [
      { resource: "database", actions: ["read", "write"], enabled: true },
      { resource: "schema", actions: ["read"], enabled: true },
    ],
  },
  {
    id: "github-mcp",
    name: "GitHub MCP",
    url: "https://mcp.github.com/connect",
    description: "Gerenciamento de repositórios GitHub via MCP",
    type: "community",
    status: "disconnected",
    version: "1.1.0",
    capabilities: ["repo_management", "code_review", "issue_tracking", "pr_management"],
    config: {},
    permissions: [
      { resource: "repos", actions: ["read", "write"], enabled: true },
      { resource: "issues", actions: ["read", "write"], enabled: true },
      { resource: "prs", actions: ["read", "write"], enabled: true },
    ],
  },
];

/**
 * Prepara a configuração de conexão para um servidor MCP
 */
export function prepareMCPConnection(config: MCPConnectionConfig): MCPMessage[] {
  const messages: MCPMessage[] = [
    {
      role: "system",
      content: `Conectando ao servidor MCP em ${config.url}...
Protocolo: Model Context Protocol v1.0
Timeout: ${config.timeout || 30000}ms
Retry: ${config.retryAttempts || 3} tentativas`,
    },
    {
      role: "user",
      content: `Inicializar conexão MCP`,
      tool_calls: [
        {
          id: "mcp_connect",
          type: "function",
          function: {
            name: "mcp_connect",
            arguments: JSON.stringify({
              url: config.url,
              headers: config.headers || {},
              capabilities: ["tools", "resources", "prompts"],
            }),
          },
        },
      ],
    },
  ];

  return messages;
}

/**
 * Cria um tool MCP personalizado
 */
export function createMCPTool(
  name: string,
  description: string,
  parameters: Record<string, any>,
  serverId: string
): MCPTool {
  return {
    name,
    description,
    input_schema: {
      type: "object",
      properties: parameters,
      required: Object.entries(parameters)
        .filter(([, v]) => v.required)
        .map(([k]) => k),
    },
    serverId,
    enabled: true,
  };
}

/**
 * Verifica se um servidor MCP tem permissão para uma ação
 */
export function checkMCPPermission(
  server: MCPServer,
  resource: string,
  action: "read" | "write" | "execute" | "admin"
): boolean {
  const permission = server.permissions.find((p) => p.resource === resource);
  if (!permission) return false;
  if (!permission.enabled) return false;
  return permission.actions.includes(action);
}

/**
 * Gera a URL de conexão para o MCP Connector da Claude
 */
export function generateMCPConnectorURL(server: MCPServer): string {
  const baseUrl = "https://claude.ai/mcp/connect";
  const params = new URLSearchParams({
    server: server.name,
    url: server.url,
    version: server.version,
    capabilities: server.capabilities.join(","),
  });
  return `${baseUrl}?${params.toString()}`;
}
