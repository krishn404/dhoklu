"use client";

import { ReactNode } from "react";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
// Keep Convex hooks safe to render in local and preview builds without a
// configured backend. Requests remain disabled by convexFeaturesEnabled.
const convex = new ConvexReactClient(convexUrl ?? "http://127.0.0.1:3210");

export function AppProviders({ children }: { children: ReactNode }) {
  const content = <SmoothScroll>{children}</SmoothScroll>;
  return <ConvexProvider client={convex}>{content}</ConvexProvider>;
}
