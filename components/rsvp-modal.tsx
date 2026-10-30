"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "convex/react";
import { convexFunctions } from "@/lib/convex-functions";
import type { Id } from "@/convex/_generated/dataModel";
import { getSessionId } from "@/lib/session";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

type RsvpModalProps = { eventId: Id<"events">; title: string; startsAt?: number; place?: string; description?: string; onClose: () => void; onSuccess?: () => void };
const dateLabel = (timestamp: number) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(timestamp);

export function RsvpModal({ eventId, title, startsAt, place, description, onClose, onSuccess }: RsvpModalProps) {
  const create = useMutation(convexFunctions.createRsvp);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [mounted, onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) return setStatus("Pop your name in first.");
    if (!convexFeaturesEnabled) return setStatus("RSVPs are taking a tiny pause. Try again soon!");
    setSending(true); setStatus("");
    try {
      await create({ eventId, name, contact: String(form.get("contact") ?? ""), seats: Number(form.get("seats") ?? 1), note: String(form.get("note") ?? ""), sessionId: getSessionId() });
      setStatus("You’re on the list. See you there!");
      onSuccess?.();
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "That didn’t go through. Try again?"); }
    finally { setSending(false); }
  }

  if (!mounted) return null;
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#173f5d]/70 p-4 sm:p-[5vh_5vw]" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="grid h-[80vh] w-[80vw] max-h-[900px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border-2 border-[#ee3729] bg-[#f9f7ed] text-[#173f5d] shadow-[12px_14px_0_rgba(238,55,41,.55)] max-md:h-[90vh] max-md:w-[94vw] md:grid-cols-[.85fr_1.15fr] md:grid-rows-1" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
      <div className="relative flex min-h-0 flex-col overflow-y-auto bg-[#a9d4f4] p-6 sm:p-9 md:p-10">
        <button type="button" aria-label="Close RSVP form" onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#173f5d]/40 text-2xl leading-none md:right-7 md:top-7">×</button>
        <p className="section-eyebrow text-[#ee3729]">save your spot</p>
        <h2 id="rsvp-title" className="display mt-8 max-w-[12ch] text-4xl text-[#ee3729] sm:text-5xl">{title}</h2>
        {startsAt !== undefined && <p className="mt-6 mono text-sm uppercase">{dateLabel(startsAt)}</p>}
        {place && <p className="mt-2 mono text-sm uppercase">{place}</p>}
        {description && <p className="mt-6 max-w-prose text-base leading-relaxed">{description}</p>}
        <p className="mt-auto pt-8 mono text-xs uppercase">Good people, a little making, and room for one more.</p>
      </div>

      <div className="min-h-0 overflow-y-auto p-6 sm:p-9 md:p-10">
        <div className="mb-7"><p className="section-eyebrow text-[#ee3729]">rsvp</p><h3 className="display mt-2 text-2xl text-[#ee3729] sm:text-3xl">Join the gathering.</h3></div>
        <form onSubmit={submit} className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <label className="section-eyebrow">your name<input id="rsvp-name" name="name" required maxLength={100} autoComplete="name" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/45 bg-white px-4 py-3 normal-case outline-none focus:border-[#ee3729]" /></label>
          <label className="section-eyebrow">reply spot<input id="rsvp-contact" name="contact" autoComplete="off" placeholder="Instagram or phone (optional)" maxLength={200} className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/45 bg-white px-4 py-3 normal-case outline-none focus:border-[#ee3729]" /></label>
          <label className="section-eyebrow">seats<select id="rsvp-seats" name="seats" defaultValue="1" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/45 bg-white px-4 py-3 outline-none focus:border-[#ee3729]"><option value="1">1 seat</option><option value="2">2 seats</option><option value="3">3 seats</option><option value="4">4 seats</option></select></label>
          <label className="section-eyebrow sm:col-span-2">little note<textarea id="rsvp-note" name="note" maxLength={200} rows={3} placeholder="Anything you’d like me to know? (optional)" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/45 bg-white px-4 py-3 normal-case outline-none focus:border-[#ee3729]" /></label>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2"><button disabled={sending} className="rounded-full bg-[#173f5d] px-7 py-3 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50" type="submit">{sending ? "saving your spot..." : "RSVP"}</button>{status && <p aria-live="polite" role="status" className="text-sm">{status}</p>}</div>
        </form>
      </div>
    </section>
  </div>, document.body);
}
