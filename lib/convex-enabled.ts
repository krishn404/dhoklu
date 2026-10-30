/** Enable Convex by default when configured; the flag remains an opt-out kill switch. */
export const convexFeaturesEnabled = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)
  && process.env.NEXT_PUBLIC_CONVEX_FEATURES !== "false";
