import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({ type: v.union(v.literal("hello"), v.literal("idea"), v.literal("dm")), name: v.string(), message: v.string(), contact: v.optional(v.string()), read: v.boolean(), archived: v.boolean() }).index("by_type", ["type"]).index("by_read", ["read"]),
  rsvps: defineTable({ workshopId: v.string(), name: v.string(), contact: v.optional(v.string()), seats: v.number(), note: v.optional(v.string()), status: v.union(v.literal("new"), v.literal("confirmed"), v.literal("cancelled")) }).index("by_workshop", ["workshopId"]),
  sessions: defineTable({ sessionId: v.string(), lastSeen: v.number() }).index("by_session", ["sessionId"]).index("by_last_seen", ["lastSeen"]),
  rateLimits: defineTable({ sessionId: v.string(), kind: v.string(), window: v.number(), count: v.number() }).index("by_session_kind_window", ["sessionId", "kind", "window"]),
});
