import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./admin";

const credentials = { token: v.string() };
const eventFields = {
  title: v.string(),
  startsAt: v.number(),
  kind: v.string(),
  place: v.string(),
  description: v.string(),
  color: v.string(),
  published: v.boolean(),
  capacity: v.optional(v.number()),
};

function validateEvent(event: { title: string; startsAt: number; kind: string; place: string; description: string; color: string; capacity?: number }) {
  if (!event.title.trim() || event.title.trim().length > 100) throw new Error("Add an event title (up to 100 characters).");
  if (!Number.isFinite(event.startsAt)) throw new Error("Choose a valid event date and time.");
  if (!event.kind.trim() || event.kind.trim().length > 60) throw new Error("Add an event type (up to 60 characters).");
  if (!event.place.trim() || event.place.trim().length > 120) throw new Error("Add a location (up to 120 characters).");
  if (event.description.length > 1000) throw new Error("Description must be 1000 characters or fewer.");
  if (!/^#[0-9a-fA-F]{6}$/.test(event.color)) throw new Error("Choose a valid card color.");
  if (event.capacity !== undefined && (!Number.isInteger(event.capacity) || event.capacity < 1 || event.capacity > 10000)) throw new Error("Capacity must be between 1 and 10000.");
}

export const listPublic = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("events")
    .withIndex("by_published_starts_at", q => q.eq("published", true).gte("startsAt", Date.now()))
    .order("asc")
    .collect(),
});

export const listAdmin = query({
  args: credentials,
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const events = await ctx.db.query("events").withIndex("by_starts_at").order("asc").collect();
    return await Promise.all(events.map(async event => ({
      ...event,
      rsvpCount: (await ctx.db.query("rsvps").withIndex("by_event", q => q.eq("eventId", event._id)).collect()).length,
    })));
  },
});

export const create = mutation({
  args: { ...credentials, ...eventFields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    validateEvent(args);
    const { token: _token, ...event } = args;
    return await ctx.db.insert("events", { ...event, title: event.title.trim(), kind: event.kind.trim(), place: event.place.trim(), description: event.description.trim() });
  },
});

export const update = mutation({
  args: { ...credentials, id: v.id("events"), ...eventFields },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    validateEvent(args);
    const { token: _token, id, ...event } = args;
    await ctx.db.patch(id, { ...event, title: event.title.trim(), kind: event.kind.trim(), place: event.place.trim(), description: event.description.trim() });
  },
});

export const remove = mutation({
  args: { ...credentials, id: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const rsvps = await ctx.db.query("rsvps").withIndex("by_event", q => q.eq("eventId", args.id)).collect();
    for (const rsvp of rsvps) await ctx.db.delete(rsvp._id);
    await ctx.db.delete(args.id);
  },
});
