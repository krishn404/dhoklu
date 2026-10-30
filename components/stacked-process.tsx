"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionIntro } from "@/components/section-intro";
import { processSteps } from "@/data/home-content";

const revealWindows = [[0.14, 0.29], [0.34, 0.49], [0.54, 0.69], [0.74, 0.89]] as const;
const positions = [
  { left: "5%", top: "0px", rotate: -4 },
  { left: "27%", top: "20px", rotate: 2 },
  { left: "49%", top: "8px", rotate: -2 },
  { left: "68%", top: "28px", rotate: 4 }
];

function ProcessCard({ index, progress }: { index: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const [number, title, copy] = processSteps[index];
  const [start, end] = revealWindows[index];
  const opacity = useTransform(progress, [start, start + 0.05, end], [0, 1, 1]);
  const y = useTransform(progress, [start, end], [145, 0]);
  const scale = useTransform(progress, [start, end], [0.95, 1]);
  const position = positions[index];
  return <motion.article style={{ opacity, y, scale, rotate: position.rotate, left: position.left, top: position.top, zIndex: index + 1 }} className="process-card absolute w-[min(74vw,360px)] rounded-[1.25rem] border border-[#ee3729]/70 bg-[#f9f7ed] p-6 text-[#5a260f] shadow-[6px_8px_0_rgba(238,55,41,.45)]"><span className="section-eyebrow text-[#ee3729]">step {number}</span><h3 className="display mt-8 text-[clamp(1.65rem,2.4vw,2.25rem)] leading-[.95]">{title}</h3><div className="my-6 h-px bg-[#ee3729]/35"/><p className="text-sm leading-relaxed text-[#173f5d]">{copy}</p></motion.article>;
}

export function StackedProcess() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  return <section ref={target} className="cloud-follow cloud-before relative h-[360vh] bg-[var(--pink)]"><div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 md:px-8"><div className="process-orbit" aria-hidden="true"/><div className="relative z-10 mx-auto w-full max-w-6xl"><SectionIntro eyebrow="03 / the little manifesto" title="Stay a beginner" description="A few rules I try to keep close while I build, make, and meet people." /><div className="process-stack relative mx-auto mt-12 h-[380px] max-w-6xl md:h-[420px]">{processSteps.map((_, index) => <ProcessCard key={index} index={index} progress={scrollYProgress}/>)}</div></div></div></section>;
}
