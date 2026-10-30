"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { SectionIntro } from "@/components/section-intro";
import { RsvpModal } from "@/components/rsvp-modal";
import { WorkshopCard } from "@/components/workshop-card";
import { convexFunctions, EventRecord } from "@/lib/convex-functions";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

export function EventsSection() {
  const convex = useConvex();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(convexFeaturesEnabled);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeEvent, setActiveEvent] = useState<EventRecord | null>(null);
  const [rsvpRefreshKey, setRsvpRefreshKey] = useState(0);

  useEffect(() => {
    if (!convexFeaturesEnabled) return;
    let active = true;
    void convex.query(convexFunctions.publicEvents, {}).then(rows => {
      if (active) setEvents(rows);
    }).catch(() => {
      if (active) setLoadFailed(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [convex]);

  return <section id="events" className="section-shell cloud-follow cloud-before bg-[#f3c5ce]">
    <div className="section-inner">
      <SectionIntro align="left" eyebrow="03 / out in pune" title={<><span className="event-title-desktop">THINGS I WANT TO<br/>MAKE HAPPEN</span><span className="event-title-mobile">THINGS<br/>I WANT TO<br/>MAKE HAPPEN</span></>} description="Workshops, stalls and pop-ups. Any excuse to learn something new with good people." />
      <a className="event-idea-link" href="#contact">Got an event idea? Let’s plan it ↗</a>
      {loading ? <p className="mt-8 mono text-xs uppercase text-[#173f5d]">finding the next little gathering...</p> : loadFailed ? <p role="status" className="mt-8 mono text-xs uppercase text-[#173f5d]">Events are taking a tiny pause. Please check back soon.</p> : events.length ? <div className="events-grid">{events.map((item, index) => <WorkshopCard key={item._id} item={item} index={index} refreshKey={rsvpRefreshKey} onRsvp={() => setActiveEvent(item)} />)}</div> : <p className="mt-8 mono text-xs uppercase text-[#173f5d]">No upcoming events just yet. Check back soon.</p>}
    </div>
    <AnimatePresence>{activeEvent && <RsvpModal eventId={activeEvent._id} title={activeEvent.title} onClose={() => setActiveEvent(null)} onSuccess={() => setRsvpRefreshKey(key => key + 1)} />}</AnimatePresence>
  </section>;
}
