import type { MutationCtx } from "./_generated/server";

export async function checkRateLimit(ctx: MutationCtx, sessionId: string, kind: string, maximum: number) {
  const window = Math.floor(Date.now() / 3_600_000);
  const row = await ctx.db.query("rateLimits").withIndex("by_session_kind_window", q => q.eq("sessionId", sessionId).eq("kind", kind).eq("window", window)).unique();
  if (row && row.count >= maximum) throw new Error("Slow down and try again later.");
  if (row) await ctx.db.patch(row._id, { count: row.count + 1 }); else await ctx.db.insert("rateLimits", { sessionId, kind, window, count: 1 });
}
