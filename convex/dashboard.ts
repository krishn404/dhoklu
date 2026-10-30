import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
  args: { username: v.string(), password: v.string(), token: v.string() },
  handler: async (ctx, { username, password, token }) => {
    if (!token || token.length > 100 || username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return false;
    const existing = await ctx.db.query("adminSessions").withIndex("by_token", q => q.eq("token", token)).unique();
    if (!existing) await ctx.db.insert("adminSessions", { token, createdAt: Date.now() });
    return true;
  },
});

export const access = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    // Let database/server errors propagate so the client can retain the saved
    // session and offer a retry. Only a missing token means the session ended.
    const session = await ctx.db.query("adminSessions").withIndex("by_token", q => q.eq("token", token)).unique();
    return { allowed: session !== null };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db.query("adminSessions").withIndex("by_token", q => q.eq("token", token)).unique();
    if (session) await ctx.db.delete(session._id);
  },
});
