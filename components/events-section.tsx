"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SectionIntro } from "@/components/section-intro";
import { upcomingEvents } from "@/data/home-content";
import { RsvpModal } from "@/components/rsvp-modal";
import { WorkshopCard } from "@/components/workshop-card";

const slug = (value: string) => value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");

export function EventsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const event = activeIndex === null ? null : upcomingEvents[activeIndex];

  return <section id="events" className="section-shell cloud-follow cloud-before bg-[#f3c5ce]">
    <div className="section-inner">
      <SectionIntro align="left" eyebrow="03 / out in pune" title={<><span className="event-title-desktop">THINGS I WANT TO<br/>MAKE HAPPEN</span><span className="event-title-mobile">THINGS<br/>I WANT TO<br/>MAKE HAPPEN</span></>} description="Workshops, stalls and pop-ups. Any excuse to learn something new with good people." />
      <a className="event-idea-link" href="#contact">Got an event idea? Let’s plan it ↗</a>
      <div className="events-grid">{upcomingEvents.map((item, index) => <WorkshopCard key={item.title} item={item} index={index} onRsvp={() => setActiveIndex(index)} />)}</div>
    </div>
    <AnimatePresence>{event && <RsvpModal workshopId={slug(event.title)} title={event.title} onClose={() => setActiveIndex(null)} />}</AnimatePresence>
  </section>;
}
