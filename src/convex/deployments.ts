import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deployments")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    version: v.string(),
    platform: v.string(),
    url: v.optional(v.string()),
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
    return await ctx.db.insert("deployments", {
      ...args,
      userId: user._id,
      status: "pending",
      createdAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    deploymentId: v.id("deployments"),
    status: v.string(),
    url: v.optional(v.string()),
    logs: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { deploymentId, ...updates } = args;
    await ctx.db.patch(deploymentId, updates);
    return deploymentId;
  },
});
