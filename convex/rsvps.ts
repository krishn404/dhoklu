import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, trim } from "./admin";
import { checkRateLimit } from "./rateLimit";

export const create = mutation({ args: { workshopId: v.string(), name: v.string(), contact: v.optional(v.string()), seats: v.number(), note: v.optional(v.string()), sessionId: v.string() }, handler: async (ctx, args) => {
  const workshopId = trim(args.workshopId); const name = trim(args.name); const contact = trim(args.contact ?? ""); const note = trim(args.note ?? "");
  if (!workshopId || !name || name.length > 100 || contact.length > 200 || note.length > 200 || args.seats < 1 || args.seats > 4 || args.sessionId.length > 100) throw new Error("Invalid RSVP");
  await checkRateLimit(ctx, args.sessionId, "rsvp", 3);
  const since = Date.now() - 86_400_000;
  const duplicates = await ctx.db.query("rsvps").withIndex("by_workshop", q => q.eq("workshopId", workshopId)).collect();
  if (duplicates.some(row => row.name.toLowerCase() === name.toLowerCase() && row._creationTime > since)) throw new Error("You’re already on this list.");
  return await ctx.db.insert("rsvps", { workshopId, name, contact: contact || undefined, seats: args.seats, note: note || undefined, status: "new" });
}});
export const going = query({ args: { workshopId: v.string() }, handler: async (ctx, args) => (await ctx.db.query("rsvps").withIndex("by_workshop", q => q.eq("workshopId", args.workshopId)).collect()).filter(row => row.status !== "cancelled").reduce((total, row) => total + row.seats, 0) });
const credentials = { username: v.string(), password: v.string() };
export const listByWorkshop = query({ args: { ...credentials, workshopId: v.string() }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); return await ctx.db.query("rsvps").withIndex("by_workshop", q => q.eq("workshopId", args.workshopId)).collect(); } });
export const setStatus = mutation({ args: { ...credentials, id: v.id("rsvps"), status: v.union(v.literal("new"), v.literal("confirmed"), v.literal("cancelled")) }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); await ctx.db.patch(args.id, { status: args.status }); } });
export const exportCsv = query({ args: { ...credentials, workshopId: v.string() }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); const rows = await ctx.db.query("rsvps").withIndex("by_workshop", q => q.eq("workshopId", args.workshopId)).collect(); return ["name,contact,seats,note,status", ...rows.map(row => [row.name, row.contact ?? "", row.seats, row.note ?? "", row.status].map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\n"); } });
