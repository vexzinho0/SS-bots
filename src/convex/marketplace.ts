import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("marketplaceItems").collect();

    if (args.type) {
      items = items.filter((i) => i.type === args.type);
    }
    if (args.category) {
      items = items.filter((i) => i.category === args.category);
    }
    if (args.search) {
      const search = (args.search as unknown as string).toLowerCase();
      items = items.filter(
        (i: any) =>
          i.name.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );
    }

    return items.sort((a, b) => b.downloads - a.downloads);
  },
});

export const get = query({
  args: { itemId: v.id("marketplaceItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    type: v.string(),
    category: v.string(),
    version: v.string(),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    tags: v.array(v.string()),
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
    return await ctx.db.insert("marketplaceItems", {
      ...args,
      author: user.name || "Anonymous",
      authorId: user._id,
      downloads: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});
