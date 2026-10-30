import { query } from "./_generated/server";
import { v } from "convex/values";
import { isAdmin } from "./admin";

export const access = query({ args: { username: v.string(), password: v.string() }, handler: async (ctx, args) => ({ allowed: await isAdmin(ctx, args.username, args.password) }) });
