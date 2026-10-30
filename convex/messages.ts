import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, trim } from "./admin";
import { checkRateLimit } from "./rateLimit";

const messageType = v.union(v.literal("hello"), v.literal("idea"), v.literal("dm"));
export const send = mutation({ args: { type: messageType, name: v.optional(v.string()), message: v.string(), contact: v.optional(v.string()), website: v.optional(v.string()), sessionId: v.string() }, handler: async (ctx, args) => {
  if (args.website) return null;
  const message = trim(args.message); const name = trim(args.name ?? "") || "Anonymous"; const contact = trim(args.contact ?? "");
  if (message.length < 2 || message.length > 1000 || name.length > 100 || contact.length > 200 || args.sessionId.length > 100) throw new Error("Please check your message.");
  await checkRateLimit(ctx, args.sessionId, "message", 5);
  return await ctx.db.insert("messages", { type: args.type, name, message, contact: contact || undefined, read: false, archived: false });
}});
const credentials = { username: v.string(), password: v.string() };
export const list = query({ args: { ...credentials, type: v.optional(messageType), unreadOnly: v.optional(v.boolean()), archived: v.optional(v.boolean()) }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); let rows = await ctx.db.query("messages").order("desc").collect(); if (args.type) rows = rows.filter(row => row.type === args.type); if (args.unreadOnly) rows = rows.filter(row => !row.read); if (args.archived !== undefined) rows = rows.filter(row => row.archived === args.archived); return rows; } });
export const markRead = mutation({ args: { ...credentials, id: v.id("messages"), read: v.boolean() }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); await ctx.db.patch(args.id, { read: args.read }); } });
export const archive = mutation({ args: { ...credentials, id: v.id("messages"), archived: v.boolean() }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); await ctx.db.patch(args.id, { archived: args.archived }); } });
export const remove = mutation({ args: { ...credentials, id: v.id("messages") }, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); await ctx.db.delete(args.id); } });
export const stats = query({ args: credentials, handler: async (ctx, args) => { await requireAdmin(ctx, args.username, args.password); const rows = await ctx.db.query("messages").collect(); const rsvps = await ctx.db.query("rsvps").collect(); return { unread: rows.filter(row => !row.read && !row.archived).length, messages: rows.length, rsvps: rsvps.filter(row => row.eventId !== undefined).length }; } });
