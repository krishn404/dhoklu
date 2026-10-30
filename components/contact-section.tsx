"use client";

import { SectionIntro } from "@/components/section-intro";
import { MessageForm } from "@/components/message-form";
import { MessageType } from "@/lib/convex-functions";
import { useState } from "react";

export function ContactSection() {
  const [type, setType] = useState<MessageType>("hello");
  const options: Array<{ value: MessageType; label: string; note: string }> = [{ value: "hello", label: "say hello", note: "A quick hi, a question, a little nudge." }, { value: "idea", label: "drop an idea", note: "Half-baked is the perfect amount baked." }];
  return <section id="contact" className="section-shell cloud-follow cloud-before bg-[#a9d4f4] text-[#173f5d]"><div className="section-inner contact-layout"><div className="contact-invite"><SectionIntro align="left" eyebrow="got an idea?" title={<>LET’S MAKE<br/>SOMETHING<br/>TOGETHER</>} description="Workshop idea, stall invite, or just a hello. Send it over." tone="ink" /><p className="contact-aside mono">no polished pitch needed<br/>just bring the spark ↗</p></div><div className="contact-compose"><div className="contact-switch" role="tablist" aria-label="What are you sending?">{options.map(option => <button key={option.value} type="button" role="tab" aria-selected={type === option.value} onClick={() => setType(option.value)} className={type === option.value ? "is-active" : ""}><span>{option.label}</span><small>{option.note}</small></button>)}</div><MessageForm type={type} /></div></div></section>;
}
