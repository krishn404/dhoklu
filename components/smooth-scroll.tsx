"use client";
import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
export function SmoothScroll({ children }: { children: ReactNode }) { useEffect(() => { const lenis = new Lenis({ duration:1.15, smoothWheel:true, wheelMultiplier:.85, touchMultiplier:1.15 }); let frame=0; const raf=(time:number)=>{lenis.raf(time);frame=requestAnimationFrame(raf)}; frame=requestAnimationFrame(raf); return ()=>{cancelAnimationFrame(frame);lenis.destroy()}; },[]); return <>{children}</>; }
