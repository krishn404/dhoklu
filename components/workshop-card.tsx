"use client";

import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { CommunityEvent } from "@/data/home-content";
import { convexFunctions } from "@/lib/convex-functions";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

export function WorkshopCard({ item, index, onRsvp }: { item: CommunityEvent; index: number; onRsvp: () => void }) {
  const convex = useConvex();
  const [going, setGoing] = useState<number | undefined>();
  const workshopId = item.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
  useEffect(() => { if (!convexFeaturesEnabled) return; let active = true; void convex.query(convexFunctions.going, { workshopId }).then(value => { if (active) setGoing(value); }).catch(() => { if (active) setGoing(undefined); }); return () => { active = false; }; }, [convex, workshopId]);
  return <article className="event-card rounded-[1.5rem] border border-[#ee3729]/65 text-[#ee3729]" style={{ background: item.color }}>
    <div className="flex items-start justify-between gap-4"><span className="section-eyebrow">{item.date}</span><span className="mono card-tag">{item.kind}</span></div>
    <div className="event-card__content"><span className="mono text-xs text-[#173f5d]">0{index + 1}</span><h3 className="display card-title">{item.title}</h3></div>
    <div className="flex items-end justify-between gap-3"><p className="event-card__footer">{item.place} · peek inside{going === undefined ? "" : ` · ${going} going`}</p><button type="button" onClick={onRsvp} className="rounded-full border border-[#ee3729] px-4 py-2 mono text-xs font-medium uppercase">RSVP</button></div>
  </article>;
}
