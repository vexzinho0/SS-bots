import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    clerkId: v.optional(v.string()),
    tokenIdentifier: v.string(),
    bio: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.string(),
    plan: v.string(),
    premiumSince: v.optional(v.number()),
    premiumExpiresAt: v.optional(v.number()),
    creatorCode: v.optional(v.string()),
    customLink: v.optional(v.string()),
    referredBy: v.optional(v.id("users")),
    totalReferrals: v.number(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    type: v.string(),
    platform: v.optional(v.string()),
    status: v.string(),
    language: v.optional(v.string()),
    framework: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_userId", ["userId"]),

  files: defineTable({
    name: v.string(),
    path: v.string(),
    content: v.string(),
    type: v.string(),
    language: v.optional(v.string()),
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    parentPath: v.optional(v.string()),
    isFolder: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_parentPath", ["projectId", "parentPath"]),

  bots: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    platform: v.string(),
    status: v.string(),
    config: v.optional(v.string()),
    token: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_userId", ["userId"]),

  integrations: defineTable({
    name: v.string(),
    type: v.string(),
    config: v.optional(v.string()),
    enabled: v.boolean(),
    projectId: v.optional(v.id("projects")),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_workspaceId", ["workspaceId"]),

  deployments: defineTable({
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    version: v.string(),
    status: v.string(),
    platform: v.string(),
    url: v.optional(v.string()),
    logs: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_userId", ["userId"]),

  chatMessages: defineTable({
    content: v.string(),
    role: v.string(),
    userId: v.id("users"),
    projectId: v.optional(v.id("projects")),
    conversationId: v.string(),
    createdAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_userId", ["userId"]),

  marketplaceItems: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.string(),
    category: v.string(),
    author: v.string(),
    authorId: v.id("users"),
    version: v.string(),
    downloads: v.number(),
    rating: v.optional(v.number()),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_type", ["type"]),

  mcpServers: defineTable({
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    enabled: v.boolean(),
    config: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_userId", ["userId"]),

  activityLogs: defineTable({
    action: v.string(),
    details: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  flowNodes: defineTable({
    projectId: v.id("projects"),
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_workspaceId", ["workspaceId"]),

  // === MONETIZATION TABLES ===

  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.string(),
    status: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    autoRenew: v.boolean(),
    paymentMethod: v.optional(v.string()),
    externalId: v.optional(v.string()),
    cancelledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_externalId", ["externalId"]),

  payments: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    method: v.string(),
    status: v.string(),
    externalId: v.optional(v.string()),
    description: v.optional(v.string()),
    subscriptionId: v.optional(v.id("subscriptions")),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_method", ["method"]),

  adSlots: defineTable({
    page: v.string(),
    position: v.string(),
    enabled: v.boolean(),
    frequency: v.number(),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_page", ["page"])
    .index("by_enabled", ["enabled"]),

  adImpressions: defineTable({
    adId: v.id("adSlots"),
    userId: v.optional(v.id("users")),
    page: v.string(),
    position: v.string(),
    timestamp: v.number(),
  }).index("by_adId", ["adId"]),

  creatorCodes: defineTable({
    userId: v.id("users"),
    code: v.string(),
    active: v.boolean(),
    usesCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_userId", ["userId"]),

  referrals: defineTable({
    referrerId: v.id("users"),
    referredId: v.id("users"),
    status: v.string(),
    rewardGranted: v.boolean(),
    createdAt: v.number(),
    convertedAt: v.optional(v.number()),
  })
    .index("by_referrerId", ["referrerId"])
    .index("by_referredId", ["referredId"])
    .index("by_status", ["status"]),

  badges: defineTable({
    userId: v.id("users"),
    type: v.string(),
    active: v.boolean(),
    awardedAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"])
    .index("by_userId_type", ["userId", "type"]),

  customLinks: defineTable({
    userId: v.id("users"),
    slug: v.string(),
    projectId: v.optional(v.id("projects")),
    active: v.boolean(),
    visits: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_userId", ["userId"]),

  adminSettings: defineTable({
    key: v.string(),
    value: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
