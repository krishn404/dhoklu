"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { convexFunctions, MessageType } from "@/lib/convex-functions";
import { getSessionId } from "@/lib/session";
import { convexFeaturesEnabled } from "@/lib/convex-enabled";

export function MessageForm({ type = "hello" }: { type?: MessageType }) {
  const send = useMutation(convexFunctions.sendMessage);
  const [message, setMessage] = useState(""); const [status, setStatus] = useState(""); const [sending, setSending] = useState(false);
  const valid = message.trim().length >= 2 && message.trim().length <= 1000;
  const counter = useMemo(() => message.length >= 800 ? `${message.length}/1000` : "", [message.length]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!valid) return;
    if (!convexFeaturesEnabled) { setStatus("Messages are taking a tiny pause. Try again soon!"); return; }
    const data = new FormData(event.currentTarget); setSending(true); setStatus("");
    try { await send({ type, name: String(data.get("name") || ""), message, contact: String(data.get("contact") || ""), website: String(data.get("website") || ""), sessionId: getSessionId() }); event.currentTarget.reset(); setMessage(""); setStatus("Got it. Thanks!"); }
    catch { setStatus("That didn’t go through. Try again?"); } finally { setSending(false); }
  }
  const isIdea = type === "idea";
  return <form onSubmit={submit} className="contact-form rounded-[1.5rem] border border-[#173f5d]/50 bg-[#f9f7ed]"><div className="contact-form__top"><span className="mono">{isIdea ? "idea inbox" : "hello inbox"}</span><span aria-hidden="true">✦</span></div><label className="section-eyebrow block" htmlFor={`${type}-name`}>your name</label><input id={`${type}-name`} name="name" placeholder="Your name (optional)" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none transition focus:border-[#ee3729]"/><label className="section-eyebrow mt-5 block" htmlFor={`${type}-message`}>{isIdea ? "the little idea" : "what’s on your mind?"}</label><textarea id={`${type}-message`} name="message" required minLength={2} maxLength={1000} value={message} onChange={event => setMessage(event.target.value)} placeholder={isIdea ? "Tell me the idea, even if it’s half baked" : "A hello, a question, a tiny thought..."} className="contact-input mt-2 min-h-36 w-full resize-y rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none transition focus:border-[#ee3729]"/><div className="mt-2 flex items-center justify-between gap-3"><label className="section-eyebrow" htmlFor={`${type}-contact`}>reply spot</label><span className="mono text-xs text-[#173f5d]">{counter}</span></div><input id={`${type}-contact`} name="contact" placeholder="Instagram or phone, only if you want a reply" className="contact-input mt-2 w-full rounded-lg border border-[#173f5d]/55 bg-white px-4 py-3 outline-none transition focus:border-[#ee3729]"/><input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1}/><button disabled={!valid || sending} className="mt-6 rounded-full bg-[#173f5d] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50" type="submit">{sending ? "sending..." : isIdea ? "send the spark" : "send it"}</button><p aria-live="polite" className="mt-3 text-sm text-[#173f5d]">{status}</p></form>;
}
