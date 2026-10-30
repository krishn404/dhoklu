import type { QueryCtx, MutationCtx } from "./_generated/server";

export const trim = (value: string) => value.trim();
export async function requireAdmin(ctx: QueryCtx | MutationCtx, token: string) {
  const session = await ctx.db.query("adminSessions").withIndex("by_token", q => q.eq("token", token)).unique();
  if (!session) throw new Error("Not for you");
}
