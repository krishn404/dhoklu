"use client";

import { cubicBezier, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type CloudDividerProps = { color: string; seed?: number; count?: number; order?: "ltr" | "rtl" | "center-out"; stagger?: number };
type LobeProps = { index: number; count: number; heightFactor: number; progress: MotionValue<number>; order: NonNullable<CloudDividerProps["order"]>; stagger: number; reduced: boolean };
const openEase = cubicBezier(.22, 1, .36, 1);

function Lobe({ index, count, heightFactor, progress, order, stagger, reduced }: LobeProps) {
  const sequence = order === "rtl" ? count - 1 - index : order === "center-out" ? Math.abs(index - (count - 1) / 2) * 2 : index;
  const start = Math.min(1, sequence * stagger / count);
  const scaleY = useTransform(progress, [start, Math.min(1, start + .5)], [0, 1], { ease: openEase });
  const scaleX = useTransform(progress, [start, Math.min(1, start + .5)], [.9, 1], { ease: openEase });
  const base = 100 / count;
  return <span className="cloud-divider__lobe" style={{ left: `${index * base}%`, width: index === count - 1 ? `${base}%` : `calc(${base}% + 12px)`, transform: `scaleY(${heightFactor})` }}><motion.svg aria-hidden="true" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ scaleY: reduced ? 1 : scaleY, scaleX: reduced ? 1 : scaleX }}><path fill="currentColor" d="M0 0 H100 V8 C100 32 78 50 50 50 C22 50 0 32 0 8 Z" /></motion.svg></span>;
}

export function CloudDivider({ color, seed = 1, count: countProp, order = "ltr", stagger = .5 }: CloudDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(countProp ?? 8);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 55%"] });
  useEffect(() => {
    const node = ref.current;
    if (!node || countProp) return;
    const resize = () => setCount(window.innerWidth >= 1024 ? 6 : window.innerWidth >= 640 ? 4 : 3);
    resize(); const observer = new ResizeObserver(resize); observer.observe(node); return () => observer.disconnect();
  }, [countProp]);
  const heightFactor = (index: number) => Number((.7 + (((Math.sin(seed * 97.13 + index * 31.7) * 43758) % 1 + 1) % 1) * .3).toFixed(6));
  return <div ref={ref} className="cloud-divider" style={{ color }}><span className="cloud-divider__band" />{Array.from({ length: count }, (_, index) => <Lobe key={`${seed}-${index}`} index={index} count={count} heightFactor={heightFactor(index)} progress={scrollYProgress} order={order} stagger={stagger} reduced={Boolean(reduced)} />)}</div>;
}
