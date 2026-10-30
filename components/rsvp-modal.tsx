"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { convexFunctions } from "@/lib/convex-functions";
import { getSessionId } from "@/lib/session";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

export function RsvpModal({ workshopId, title, onClose }: { workshopId: string; title: string; onClose: () => void }) {
  const create = useMutation(convexFunctions.createRsvp);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) return setStatus("Pop your name in first.");
    if (!convexFeaturesEnabled) return setStatus("RSVPs are taking a tiny pause. Try again soon!");
    setSending(true); setStatus("");
    try {
      await create({ workshopId, name, contact: String(form.get("contact") ?? ""), seats: Number(form.get("seats") ?? 1), note: String(form.get("note") ?? ""), sessionId: getSessionId() });
      setStatus("You’re on the list. See you there!");
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "That didn’t go through. Try again?"); }
    finally { setSending(false); }
  }
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#173f5d]/60 p-5" role="dialog" aria-modal="true" aria-labelledby="rsvp-title" onClick={onClose}>
    <form onSubmit={submit} onClick={event => event.stopPropagation()} className="w-full max-w-md rounded-[1.5rem] border border-[#ee3729] bg-[#f9f7ed] p-6 text-[#173f5d] shadow-[10px_12px_0_rgba(238,55,41,.5)]">
      <button type="button" onClick={onClose} className="float-right mono text-xs uppercase text-[#ee3729]">close</button>
      <p className="section-eyebrow text-[#ee3729]">rsvp</p><h3 id="rsvp-title" className="display modal-title mt-5 text-[#ee3729]">{title}</h3>
      <label className="section-eyebrow mt-6 block" htmlFor="rsvp-name">your name</label><input id="rsvp-name" name="name" required maxLength={100} className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none focus:border-[#ee3729]" />
      <label className="section-eyebrow mt-4 block" htmlFor="rsvp-contact">reply spot</label><input id="rsvp-contact" name="contact" placeholder="Instagram or phone, only if you want a reply" maxLength={200} className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none focus:border-[#ee3729]" />
      <label className="section-eyebrow mt-4 block" htmlFor="rsvp-seats">seats</label><select id="rsvp-seats" name="seats" defaultValue="1" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none focus:border-[#ee3729]"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
      <label className="section-eyebrow mt-4 block" htmlFor="rsvp-note">little note</label><textarea id="rsvp-note" name="note" maxLength={200} className="contact-input mt-2 min-h-24 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none focus:border-[#ee3729]" />
      <button disabled={sending} className="mt-6 rounded-full bg-[#173f5d] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50" type="submit">{sending ? "saving..." : "RSVP"}</button><p aria-live="polite" className="mt-3 text-sm">{status}</p>
    </form>
  </div>;
}
