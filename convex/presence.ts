import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const heartbeat = mutation({ args: { sessionId: v.string() }, handler: async (ctx, args) => { if (!args.sessionId || args.sessionId.length > 100) throw new Error("Invalid session"); const row = await ctx.db.query("sessions").withIndex("by_session", q => q.eq("sessionId", args.sessionId)).unique(); if (row) await ctx.db.patch(row._id, { lastSeen: Date.now() }); else await ctx.db.insert("sessions", { sessionId: args.sessionId, lastSeen: Date.now() }); } });
export const leave = mutation({ args: { sessionId: v.string() }, handler: async (ctx, args) => { const row = await ctx.db.query("sessions").withIndex("by_session", q => q.eq("sessionId", args.sessionId)).unique(); if (row) await ctx.db.delete(row._id); } });
export const count = query({ args: {}, handler: async ctx => (await ctx.db.query("sessions").collect()).filter(row => row.lastSeen > Date.now() - 45_000).length });
export const cleanup = internalMutation({ args: {}, handler: async ctx => { for (const row of await ctx.db.query("sessions").collect()) if (row.lastSeen <= Date.now() - 45_000) await ctx.db.delete(row._id); } });
