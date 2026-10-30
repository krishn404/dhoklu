"use client";

import { motion } from "framer-motion";
import { SectionIntro } from "@/components/section-intro";

export function AboutSection() {
  return <section id="about" className="section-shell cloud-follow cloud-before bg-[#f3c5ce]">
    <div className="section-inner about-layout">
      <SectionIntro align="left" eyebrow="01 / hi, i’m janhvi" title={<>SWE BRAIN.<br/>KID SOUL.</>} description="I go by dhoklu online. I write software by day and make things with my hands the rest of the time." />
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }} className="mood-card rounded-[1.5rem] border border-[#ee3729]/35 bg-[#f9f7ed]/70 text-[#173f5d]">
        <p className="section-eyebrow text-[#ee3729]">the dhoklu mood</p>
        <p className="mood-card__main">Part tidy code, part happy chaos. I start things before I know how they end.</p>
        <p className="mood-card__small">Based in Pune. Into art workshops, craft stalls and long chats with new people.</p>
      </motion.div>
    </div>
  </section>;
}
