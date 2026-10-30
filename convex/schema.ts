import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({ title: v.string(), startsAt: v.number(), kind: v.string(), place: v.string(), description: v.string(), color: v.string(), published: v.boolean(), capacity: v.optional(v.number()) }).index("by_published_starts_at", ["published", "startsAt"]).index("by_starts_at", ["startsAt"]),
  messages: defineTable({ type: v.union(v.literal("hello"), v.literal("idea"), v.literal("dm")), name: v.string(), message: v.string(), contact: v.optional(v.string()), read: v.boolean(), archived: v.boolean() }).index("by_type", ["type"]).index("by_read", ["read"]),
  rsvps: defineTable({ eventId: v.optional(v.id("events")), workshopId: v.optional(v.string()), name: v.string(), contact: v.optional(v.string()), seats: v.number(), note: v.optional(v.string()), status: v.union(v.literal("new"), v.literal("confirmed"), v.literal("cancelled")) }).index("by_event", ["eventId"]).index("by_workshop", ["workshopId"]),
  sessions: defineTable({ sessionId: v.string(), lastSeen: v.number() }).index("by_session", ["sessionId"]).index("by_last_seen", ["lastSeen"]),
  rateLimits: defineTable({ sessionId: v.string(), kind: v.string(), window: v.number(), count: v.number() }).index("by_session_kind_window", ["sessionId", "kind", "window"]),
});
