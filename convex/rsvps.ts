import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, trim } from "./admin";
import { checkRateLimit } from "./rateLimit";

export const create = mutation({ args: { eventId: v.id("events"), name: v.string(), contact: v.optional(v.string()), seats: v.number(), note: v.optional(v.string()), sessionId: v.string() }, handler: async (ctx, args) => {
  const name = trim(args.name); const contact = trim(args.contact ?? ""); const note = trim(args.note ?? "");
  if (!name || name.length > 100 || contact.length > 200 || note.length > 200 || !Number.isInteger(args.seats) || args.seats < 1 || args.seats > 4 || args.sessionId.length > 100) throw new Error("Invalid RSVP");
  const event = await ctx.db.get(args.eventId);
  if (!event || !event.published || event.startsAt < Date.now()) throw new Error("This event is no longer accepting RSVPs.");
  await checkRateLimit(ctx, args.sessionId, "rsvp", 3);
  const since = Date.now() - 86_400_000;
  const duplicates = await ctx.db.query("rsvps").withIndex("by_event", q => q.eq("eventId", args.eventId)).collect();
  if (duplicates.some(row => row.name.toLowerCase() === name.toLowerCase() && row._creationTime > since)) throw new Error("You’re already on this list.");
  const seatsTaken = duplicates.filter(row => row.status !== "cancelled").reduce((total, row) => total + row.seats, 0);
  if (event.capacity !== undefined && seatsTaken + args.seats > event.capacity) throw new Error("This event is full.");
  return await ctx.db.insert("rsvps", { eventId: args.eventId, name, contact: contact || undefined, seats: args.seats, note: note || undefined, status: "new" });
}});
export const going = query({ args: { eventId: v.id("events") }, handler: async (ctx, args) => (await ctx.db.query("rsvps").withIndex("by_event", q => q.eq("eventId", args.eventId)).collect()).filter(row => row.status !== "cancelled").reduce((total, row) => total + row.seats, 0) });
const credentials = { token: v.string() };
export const listByEvent = query({ args: { ...credentials, eventId: v.id("events") }, handler: async (ctx, args) => { await requireAdmin(ctx, args.token); return await ctx.db.query("rsvps").withIndex("by_event", q => q.eq("eventId", args.eventId)).collect(); } });
export const setStatus = mutation({ args: { ...credentials, id: v.id("rsvps"), status: v.union(v.literal("new"), v.literal("confirmed"), v.literal("cancelled")) }, handler: async (ctx, args) => { await requireAdmin(ctx, args.token); await ctx.db.patch(args.id, { status: args.status }); } });
export const exportCsv = query({ args: { ...credentials, eventId: v.id("events") }, handler: async (ctx, args) => { await requireAdmin(ctx, args.token); const rows = await ctx.db.query("rsvps").withIndex("by_event", q => q.eq("eventId", args.eventId)).collect(); return ["name,contact,seats,note,status", ...rows.map(row => [row.name, row.contact ?? "", row.seats, row.note ?? "", row.status].map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\n"); } });
