"use client";

import { ReactNode } from "react";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function AppProviders({ children }: { children: ReactNode }) {
  const content = <SmoothScroll>{children}</SmoothScroll>;
  return convex ? <ConvexProvider client={convex}>{content}</ConvexProvider> : content;
}
