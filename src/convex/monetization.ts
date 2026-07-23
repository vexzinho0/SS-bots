import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { ensureAuthenticated } from "../lib/convex";

function argStr(val: any): string {
  return String(val);
}

// ============================================================
// ADMIN SETTINGS
// ============================================================

export const getAdminSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("adminSettings").collect();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  },
});

export const getSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("adminSettings")
      .withIndex("by_key", (q) => q.eq("key", argStr(args.key)))
      .first();
    return setting?.value || null;
  },
});

export const setSetting = mutation({
  args: { key: v.string(), value: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user || user.role !== "admin") throw new Error("Apenas administradores podem alterar configurações");

    const key = argStr(args.key);
    const existing = await ctx.db
      .query("adminSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: argStr(args.value), updatedAt: Date.now() });
    } else {
      await ctx.db.insert("adminSettings", {
        key,
        value: argStr(args.value),
        description: args.description ? argStr(args.description) : undefined,
        updatedAt: Date.now(),
      });
    }
  },
});

// ============================================================
// SUBSCRIPTIONS
// ============================================================

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return null;

    return await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();
  },
});

export const createSubscription = mutation({
  args: {
    plan: v.string(),
    autoRenew: v.boolean(),
    paymentMethod: v.optional(v.string()),
    externalId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("Usuário não encontrado");

    const plan = argStr(args.plan);
    const now = Date.now();
    const endDate = plan === "premium" ? now + 30 * 24 * 60 * 60 * 1000 : undefined;

    const subId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      plan,
      status: "active",
      startDate: now,
      endDate,
      autoRenew: args.autoRenew,
      paymentMethod: args.paymentMethod ? argStr(args.paymentMethod) : undefined,
      externalId: args.externalId ? argStr(args.externalId) : undefined,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(user._id, {
      plan,
      premiumSince: now,
      premiumExpiresAt: endDate,
    });

    return subId;
  },
});

export const cancelSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("Usuário não encontrado");

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (sub) {
      await ctx.db.patch(sub._id, {
        status: "cancelled",
        autoRenew: false,
        cancelledAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

export const checkSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return { isPremium: false, isExpired: false, daysRemaining: 0 };

    const isPremium = user.plan === "premium";
    let isExpired = false;
    let daysRemaining = 0;

    if (user.premiumExpiresAt) {
      const now = Date.now();
      isExpired = now > user.premiumExpiresAt;
      daysRemaining = isExpired ? 0 : Math.ceil((user.premiumExpiresAt - now) / (1000 * 60 * 60 * 24));
    }

    return { isPremium: (isPremium && !isExpired), isExpired, daysRemaining };
  },
});

// ============================================================
// PAYMENTS
// ============================================================

export const createPayment = mutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    method: v.string(),
    status: v.string(),
    externalId: v.optional(v.string()),
    description: v.optional(v.string()),
    subscriptionId: v.optional(v.id("subscriptions")),
  },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("Usuário não encontrado");

    return await ctx.db.insert("payments", {
      userId: user._id,
      amount: args.amount,
      currency: argStr(args.currency),
      method: argStr(args.method),
      status: argStr(args.status),
      externalId: args.externalId ? argStr(args.externalId) : undefined,
      description: args.description ? argStr(args.description) : undefined,
      subscriptionId: args.subscriptionId,
      createdAt: Date.now(),
    });
  },
});

export const getMyPayments = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return [];

    return await ctx.db
      .query("payments")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

// ============================================================
// AD SLOTS
// ============================================================

export const getAdSlots = query({
  args: { page: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let slots;
    if (args.page) {
      const page = argStr(args.page);
      slots = await ctx.db
        .query("adSlots")
        .withIndex("by_page", (q) => q.eq("page", page))
        .collect();
    } else {
      slots = await ctx.db.query("adSlots").collect();
    }

    const now = Date.now();
    return slots.filter(
      (s: any) =>
        s.enabled &&
        (!s.startDate || s.startDate <= now) &&
        (!s.endDate || s.endDate >= now)
    );
  },
});

export const getAllAdSlots = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("adSlots").order("desc").collect();
  },
});

export const createAdSlot = mutation({
  args: {
    page: v.string(),
    position: v.string(),
    frequency: v.number(),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user || user.role !== "admin") throw new Error("Apenas administradores");

    return await ctx.db.insert("adSlots", {
      page: argStr(args.page),
      position: argStr(args.position),
      frequency: args.frequency,
      imageUrl: args.imageUrl ? argStr(args.imageUrl) : undefined,
      linkUrl: args.linkUrl ? argStr(args.linkUrl) : undefined,
      title: args.title ? argStr(args.title) : undefined,
      description: args.description ? argStr(args.description) : undefined,
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateAdSlot = mutation({
  args: {
    id: v.id("adSlots"),
    enabled: v.optional(v.boolean()),
    frequency: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user || user.role !== "admin") throw new Error("Apenas administradores");

    const patch: any = { updatedAt: Date.now() };
    if (args.enabled !== undefined) patch.enabled = args.enabled;
    if (args.frequency !== undefined) patch.frequency = args.frequency;
    if (args.imageUrl !== undefined) patch.imageUrl = argStr(args.imageUrl);
    if (args.linkUrl !== undefined) patch.linkUrl = argStr(args.linkUrl);
    if (args.title !== undefined) patch.title = argStr(args.title);
    if (args.description !== undefined) patch.description = argStr(args.description);

    await ctx.db.patch(args.id, patch);
  },
});

export const deleteAdSlot = mutation({
  args: { id: v.id("adSlots") },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user || user.role !== "admin") throw new Error("Apenas administradores");

    await ctx.db.delete(args.id);
  },
});

export const recordAdImpression = mutation({
  args: { adId: v.id("adSlots"), page: v.string(), position: v.string() },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity() as any;
    let userId: any = undefined;
    if (identity) {
      const doc = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .first();
      userId = doc?._id;
    }

    await ctx.db.insert("adImpressions", {
      adId: args.adId,
      userId,
      page: argStr(args.page),
      position: argStr(args.position),
      timestamp: Date.now(),
    });

    const ad = await ctx.db.get(args.adId);
    if (ad) {
      await ctx.db.patch(args.adId, { frequency: ad.frequency + 1, updatedAt: Date.now() });
    }
  },
});

// ============================================================
// CREATOR CODES
// ============================================================

export const getMyCreatorCode = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return null;

    return await ctx.db
      .query("creatorCodes")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});

export const createCreatorCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("Usuário não encontrado");
    if (user.plan !== "premium") throw new Error("Apenas usuários Premium podem criar código de criador");

    const code = argStr(args.code).toUpperCase().trim();
    if (code.length < 2 || code.length > 10) throw new Error("O código deve ter entre 2 e 10 caracteres");
    if (!/^[A-Z0-9]+$/.test(code)) throw new Error("Use apenas letras e números");

    const existing = await ctx.db
      .query("creatorCodes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
    if (existing) throw new Error("Este código já está em uso");

    const now = Date.now();
    const codeId = await ctx.db.insert("creatorCodes", {
      userId: user._id,
      code,
      active: true,
      usesCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(user._id, { creatorCode: code });

    return codeId;
  },
});

export const verifyCreatorCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const code = argStr(args.code).toUpperCase().trim();
    const result = await ctx.db
      .query("creatorCodes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
    if (!result || !result.active) return null;
    return result;
  },
});

// ============================================================
// REFERRALS
// ============================================================

export const getMyReferrals = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return [];

    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrerId", (q) => q.eq("referrerId", user._id))
      .order("desc")
      .take(50);

    return Promise.all(
      referrals.map(async (r: any) => {
        const referred = await ctx.db.get(r.referredId);
        return {
          ...r,
          referredName: referred?.name || "Usuário",
          referredEmail: referred?.email,
        };
      })
    );
  },
});

export const registerReferral = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("Usuário não encontrado");

    const rawCode = argStr(args.code).toUpperCase().trim();
    const creatorCode = await ctx.db
      .query("creatorCodes")
      .withIndex("by_code", (q) => q.eq("code", rawCode))
      .first();

    if (!creatorCode || !creatorCode.active) throw new Error("Código de criador inválido");
    if (creatorCode.userId === user._id) throw new Error("Você não pode usar seu próprio código");

    const existing = await ctx.db
      .query("referrals")
      .withIndex("by_referredId", (q) => q.eq("referredId", user._id))
      .first();
    if (!existing) {
      await ctx.db.insert("referrals", {
        referrerId: creatorCode.userId,
        referredId: user._id,
        status: "pending",
        rewardGranted: false,
        createdAt: Date.now(),
      });

      await ctx.db.patch(creatorCode.userId, { totalReferrals: (user.totalReferrals || 0) + 1 });
      await ctx.db.patch(creatorCode._id, { usesCount: (creatorCode.usesCount || 0) + 1, updatedAt: Date.now() });
      await ctx.db.patch(user._id, { referredBy: creatorCode.userId });
    }

    return { success: true };
  },
});

// ============================================================
// BADGES
// ============================================================

export const getMyBadges = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return [];

    const badges = await ctx.db
      .query("badges")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return badges.filter((b: any) => b.active);
  },
});

export const assignBadge = mutation({
  args: { userId: v.id("users"), type: v.string(), expiresAt: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const admin = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!admin || admin.role !== "admin") throw new Error("Apenas administradores");

    const badgeType = argStr(args.type);
    const existing = await ctx.db
      .query("badges")
      .withIndex("by_userId_type", (q) => q.eq("userId", args.userId).eq("type", badgeType))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { active: true, awardedAt: Date.now(), expiresAt: args.expiresAt });
    } else {
      await ctx.db.insert("badges", {
        userId: args.userId,
        type: badgeType,
        active: true,
        awardedAt: Date.now(),
        expiresAt: args.expiresAt,
      });
    }
  },
});

export const removeBadge = mutation({
  args: { userId: v.id("users"), type: v.string() },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const admin = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!admin || admin.role !== "admin") throw new Error("Apenas administradores");

    const badgeType = argStr(args.type);
    const badge = await ctx.db
      .query("badges")
      .withIndex("by_userId_type", (q) => q.eq("userId", args.userId).eq("type", badgeType))
      .first();

    if (badge) {
      await ctx.db.patch(badge._id, { active: false });
    }
  },
});

export const getAllUsersWithBadges = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const admin = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!admin || admin.role !== "admin") throw new Error("Apenas administradores");

    const users = await ctx.db.query("users").collect();
    return Promise.all(
      users.map(async (u: any) => {
        const badges = await ctx.db
          .query("badges")
          .withIndex("by_userId", (q) => q.eq("userId", u._id))
          .collect();
        return { ...u, badges: badges.filter((b: any) => b.active) };
      })
    );
  },
});

// ============================================================
// CUSTOM LINKS
// ============================================================

export const getMyCustomLink = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) return null;

    return await ctx.db
      .query("customLinks")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});

export const createCustomLink = mutation({
  args: { slug: v.string(), projectId: v.optional(v.id("projects")) },
  handler: async (ctx, args) => {
    const identity = ensureAuthenticated(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("Usuário não encontrado");
    if (user.plan !== "premium") throw new Error("Apenas usuários Premium");

    const slug = argStr(args.slug).toLowerCase().replace(/[^a-z0-9-]/g, "").trim();
    if (slug.length < 3 || slug.length > 30) throw new Error("Slug deve ter entre 3 e 30 caracteres");

    const existing = await ctx.db
      .query("customLinks")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) throw new Error("Este link já está em uso");

    const now = Date.now();
    const linkId = await ctx.db.insert("customLinks", {
      userId: user._id,
      slug,
      projectId: args.projectId,
      active: true,
      visits: 0,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(user._id, { customLink: slug });

    return linkId;
  },
});

export const checkCustomLinkAvailability = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = argStr(args.slug).toLowerCase().trim();
    const existing = await ctx.db
      .query("customLinks")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    return !existing;
  },
});

// ============================================================
// ADMIN DASHBOARD STATS
// ============================================================

export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = ensureAuthenticated(ctx);
    const admin = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!admin || admin.role !== "admin") throw new Error("Apenas administradores");

    const allUsers = await ctx.db.query("users").collect();
    const totalUsers = allUsers.length;
    const premiumUsers = allUsers.filter((u: any) => u.plan === "premium").length;
    const totalPayments = await ctx.db.query("payments").collect();
    const totalSubscriptions = await ctx.db.query("subscriptions").collect();
    const totalAds = await ctx.db.query("adSlots").collect();
    const totalReferrals = await ctx.db.query("referrals").collect();

    const totalRevenue = totalPayments
      .filter((p: any) => p.status === "completed")
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    return {
      totalUsers,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      totalPayments: totalPayments.length,
      totalRevenue,
      activeSubscriptions: totalSubscriptions.filter((s: any) => s.status === "active").length,
      totalAds: totalAds.length,
      activeAds: totalAds.filter((a: any) => a.enabled).length,
      totalReferrals: totalReferrals.length,
      conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : "0.0",
    };
  },
});

// ============================================================
// PAYMENT PROCESSING (Architecture for future integration)
// ============================================================

export const processPaymentAction = action({
  args: {
    amount: v.number(),
    currency: v.string(),
    method: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Não autenticado");

    return {
      success: true,
      message: "Processamento de pagamento configurado. Integre com o gateway desejado.",
      checkoutUrl: null as string | null,
      paymentId: null as string | null,
    };
  },
});
