"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { convexFunctions } from "@/lib/convex-functions";
import { getSessionId } from "@/lib/session";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

function Presence() {
  const heartbeat = useMutation(convexFunctions.heartbeat);
  const leave = useMutation(convexFunctions.leave);
  const count = useQuery(convexFunctions.presenceCount, convexFeaturesEnabled ? {} : "skip");
  useEffect(() => {
    if (!convexFeaturesEnabled) return;
    const sessionId = getSessionId();
    const ping = () => { void heartbeat({ sessionId }); };
    ping();
    const timer = window.setInterval(ping, 15_000);
    const pagehide = () => { void leave({ sessionId }); };
    let hiddenTimer: number | undefined;
    const visibility = () => { if (document.hidden) hiddenTimer = window.setTimeout(pagehide, 60_000); else { if (hiddenTimer) window.clearTimeout(hiddenTimer); ping(); } };
    window.addEventListener("pagehide", pagehide); document.addEventListener("visibilitychange", visibility);
    return () => { window.clearInterval(timer); if (hiddenTimer) window.clearTimeout(hiddenTimer); window.removeEventListener("pagehide", pagehide); document.removeEventListener("visibilitychange", visibility); };
  }, [heartbeat, leave]);
  if (!convexFeaturesEnabled || count === undefined) return null;
  return <span className="presence mono"><i aria-hidden="true" />{Math.max(1, count)} here now</span>;
}

export function SiteFooter() { return <footer className="site-footer bg-[#ee3729] text-white"><div className="site-footer__inner"><div className="display footer-mark">dhoklu</div><p className="mono footer-copy">Made by Janhvi in Pune, 2026</p><Presence /><div className="flex gap-5 mono text-xs uppercase"><a className="text-white" href="#top">instagram</a><a className="text-white" href="#top">linkedin</a></div></div></footer>; }
