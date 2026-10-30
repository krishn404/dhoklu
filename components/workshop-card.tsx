"use client";

import { useConvex } from "convex/react";
import { useEffect, useState } from "react";
import { convexFunctions, EventRecord } from "@/lib/convex-functions";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

const dateLabel = (timestamp: number) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(timestamp);

export function WorkshopCard({ item, index, refreshKey, onRsvp }: { item: EventRecord; index: number; refreshKey: number; onRsvp: () => void }) {
  const convex = useConvex();
  const [going, setGoing] = useState<number | undefined>();
  useEffect(() => { if (!convexFeaturesEnabled) return; let active = true; void convex.query(convexFunctions.going, { eventId: item._id }).then(value => { if (active) setGoing(value); }).catch(() => { if (active) setGoing(undefined); }); return () => { active = false; }; }, [convex, item._id, refreshKey]);
  return <article className="event-card rounded-[1.5rem] border border-[#ee3729]/65 text-[#ee3729]" style={{ background: item.color }}>
    <div className="flex items-start justify-between gap-4"><time className="section-eyebrow" dateTime={new Date(item.startsAt).toISOString()}>{dateLabel(item.startsAt)}</time><span className="mono card-tag">{item.kind}</span></div>
    <div className="event-card__content"><span className="mono text-xs text-[#173f5d]">{String(index + 1).padStart(2, "0")}</span><h3 className="display card-title">{item.title}</h3>{item.description && <p className="card-copy">{item.description}</p>}</div>
    <div className="flex items-end justify-between gap-3"><p className="event-card__footer">{item.place}{going === undefined ? "" : ` · ${going} going`}{item.capacity ? ` · ${Math.max(0, item.capacity - (going ?? 0))} spots left` : ""}</p><button type="button" disabled={item.capacity !== undefined && going !== undefined && going >= item.capacity} onClick={onRsvp} className="rounded-full border border-[#ee3729] px-4 py-2 mono text-xs font-medium uppercase disabled:cursor-not-allowed disabled:opacity-50">{item.capacity !== undefined && going !== undefined && going >= item.capacity ? "full" : "RSVP"}</button></div>
  </article>;
}
