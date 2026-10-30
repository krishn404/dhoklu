"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type SectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  tone?: "red" | "ink";
  align?: "center" | "left";
};

export function SectionIntro({ eyebrow, title, description, tone = "red", align = "center" }: SectionIntroProps) {
  const color = tone === "ink" ? "text-[#173f5d]" : "text-[#ee3729]";
  const alignment = align === "center" ? "section-intro--center items-center text-center" : "items-start text-left";

  return <motion.header initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className={`flex flex-col ${alignment}`}>
    <p className={`section-eyebrow ${color}`}>{eyebrow}</p>
    <h2 className={`display section-heading mt-4 ${color}`}>{title}</h2>
    {description && <p className="body-copy mt-4 text-[#173f5d]">{description}</p>}
  </motion.header>;
}
