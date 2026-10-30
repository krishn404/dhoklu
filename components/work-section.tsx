"use client";

import { motion } from "framer-motion";
import { SectionIntro } from "@/components/section-intro";
import { portfolioProjects } from "@/data/home-content";

const colors = ["#f7e914", "#f9f7ed", "#f3c5ce", "#ee3729"];

export function WorkSection() {
  return <section id="work" className="section-shell cloud-follow cloud-before bg-[#a9d4f4] text-[#173f5d]">
    <div className="section-inner"><SectionIntro eyebrow="02 / bits & bobs" title="A PILE OF CURIOSITIES" description="Not a polished portfolio. More like my desk drawer: code, sketches, half-finished crafts." tone="ink" />
      <div className="work-grid">{portfolioProjects.map((project, index) => <motion.article key={project.title} whileHover={{ y: -5, rotate: index % 2 ? 1 : -1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="work-card rounded-[1.25rem] border border-[#173f5d]/55" style={{ background: colors[index] }}><div className="flex items-start justify-between gap-2"><span className="section-eyebrow">0{index + 1}</span><span className="mono card-tag">{project.tag}</span></div><h3 className="display card-title">{project.title}</h3><p className="card-copy">{project.note}</p></motion.article>)}</div>
      <div className="section-cta"><a href="#contact" className="inline-flex rounded-full bg-[#173f5d] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white no-underline">Trade ideas with me</a></div>
    </div>
  </section>;
}
