import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrations")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    config: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    const now = Date.now();
    return await ctx.db.insert("integrations", {
      ...args,
      userId: user._id,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const toggle = mutation({
  args: { integrationId: v.id("integrations"), enabled: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.integrationId, {
      enabled: args.enabled,
      updatedAt: Date.now(),
    });
    return args.integrationId;
  },
});

export const remove = mutation({
  args: { integrationId: v.id("integrations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.integrationId);
    return args.integrationId;
  },
});

// MCP Servers
export const listMCPServers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mcpServers")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const createMCPServer = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    config: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    const now = Date.now();
    return await ctx.db.insert("mcpServers", {
      ...args,
      userId: user._id,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const toggleMCPServer = mutation({
  args: { serverId: v.id("mcpServers"), enabled: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.serverId, {
      enabled: args.enabled,
      updatedAt: Date.now(),
    });
    return args.serverId;
  },
});

export const removeMCPServer = mutation({
  args: { serverId: v.id("mcpServers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.serverId);
    return args.serverId;
  },
});
