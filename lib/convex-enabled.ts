/** Enable only when a Convex endpoint is configured and its functions are deployed. */
export const convexFeaturesEnabled = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)
  && process.env.NEXT_PUBLIC_CONVEX_FEATURES === "true";
