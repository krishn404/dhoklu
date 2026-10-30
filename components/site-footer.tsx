"use client";

import { useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { convexFunctions } from "@/lib/convex-functions";
import { getSessionId } from "@/lib/session";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

function Presence() {
  const convex = useConvex();
  const [count, setCount] = useState<number | undefined>();
  useEffect(() => {
    if (!convexFeaturesEnabled) return;
    const sessionId = getSessionId();
    const ping = () => { void convex.mutation(convexFunctions.heartbeat, { sessionId }).then(() => convex.query(convexFunctions.presenceCount, {})).then(setCount).catch(() => setCount(undefined)); };
    ping();
    const timer = window.setInterval(ping, 15_000);
    const pagehide = () => { void convex.mutation(convexFunctions.leave, { sessionId }).catch(() => undefined); };
    let hiddenTimer: number | undefined;
    const visibility = () => { if (document.hidden) hiddenTimer = window.setTimeout(pagehide, 60_000); else { if (hiddenTimer) window.clearTimeout(hiddenTimer); ping(); } };
    window.addEventListener("pagehide", pagehide); document.addEventListener("visibilitychange", visibility);
    return () => { window.clearInterval(timer); if (hiddenTimer) window.clearTimeout(hiddenTimer); window.removeEventListener("pagehide", pagehide); document.removeEventListener("visibilitychange", visibility); };
  }, [convex]);
  if (!convexFeaturesEnabled || count === undefined) return null;
  return <span className="presence mono"><i aria-hidden="true" />{Math.max(1, count)} here now</span>;
}

export function SiteFooter() { return <footer className="site-footer bg-[#ee3729] text-white"><div className="site-footer__inner"><div className="display footer-mark">dhoklu</div><p className="mono footer-copy">Made by Janhvi in Pune, 2026</p><Presence /><div className="flex gap-5 mono text-xs uppercase"><a className="text-white" href="#top">instagram</a><a className="text-white" href="#top">linkedin</a></div></div></footer>; }
