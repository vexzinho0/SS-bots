import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bots")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    platform: v.string(),
    config: v.optional(v.string()),
    token: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
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
    return await ctx.db.insert("bots", {
      ...args,
      userId: user._id,
      status: "inactive",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    botId: v.id("bots"),
    name: v.optional(v.string()),
    status: v.optional(v.string()),
    config: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { botId, ...updates } = args;
    await ctx.db.patch(botId, {
      ...updates,
      updatedAt: Date.now(),
    });
    return botId;
  },
});

export const remove = mutation({
  args: { botId: v.id("bots") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.botId);
    return args.botId;
  },
});

// Flow nodes
export const listFlowNodes = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flowNodes")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const saveFlowNodes = mutation({
  args: {
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    nodes: v.array(
      v.object({
        type: v.string(),
        label: v.string(),
        config: v.optional(v.string()),
        positionX: v.number(),
        positionY: v.number(),
        connections: v.array(
          v.object({
            from: v.string(),
            to: v.string(),
            label: v.optional(v.string()),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    // Delete existing nodes
    const existingNodes = await ctx.db
      .query("flowNodes")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const node of existingNodes) {
      await ctx.db.delete(node._id);
    }

    const now = Date.now();
    const nodes = args.nodes as unknown as any[];
    for (const node of nodes) {
      await ctx.db.insert("flowNodes", {
        ...node,
        projectId: args.projectId,
        workspaceId: args.workspaceId,
        userId: user._id,
        createdAt: now,
        updatedAt: now,
      });
    }

    return nodes.length;
  },
});
