import type { QueryCtx, MutationCtx } from "./_generated/server";

export const trim = (value: string) => value.trim();
export async function requireAdmin(_ctx: QueryCtx | MutationCtx, username: string, password: string) {
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) throw new Error("Not for you");
}

export const isAdmin = async (_ctx: QueryCtx, username: string, password: string): Promise<boolean> => {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
};
