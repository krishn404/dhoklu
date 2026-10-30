"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return <section id="top" className="hero-centered cloud-before">
    <div className="hero-content">
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: [.16, 1, .3, 1] }} className="mono hero-label">janhvi / dhoklu · software engineer · pune</motion.p>
      <h1 className="hero-title display mt-6" aria-label="Code a little. Make a lot."><span className="hero-title--desktop"><motion.span initial={{ opacity: 0, y: "105%" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .12, ease: [.16, 1, .3, 1] }} className="block">CODE A LITTLE.</motion.span><motion.span initial={{ opacity: 0, y: "105%" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .23, ease: [.16, 1, .3, 1] }} className="block">MAKE A LOT.</motion.span></span><span className="hero-title--mobile"><motion.span initial={{ opacity: 0, y: "105%" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .12, ease: [.16, 1, .3, 1] }} className="block">CODE A</motion.span><motion.span initial={{ opacity: 0, y: "105%" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .23, ease: [.16, 1, .3, 1] }} className="block">LITTLE.</motion.span><motion.span initial={{ opacity: 0, y: "105%" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .34, ease: [.16, 1, .3, 1] }} className="block">MAKE A LOT.</motion.span></span></h1>
      <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .42, ease: [.16, 1, .3, 1] }} className="hero-copy">I’m Janhvi. I write software for a living and make things by hand for fun. This is where both live.</motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .54, ease: [.16, 1, .3, 1] }} className="hero-cta"><a href="#events" className="pill text-sm no-underline">See what’s happening</a></motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .66, ease: [.16, 1, .3, 1] }} className="hero-notes"><article className="hero-note hero-note--cream"><span className="section-eyebrow text-[#ee3729]">day job</span><p>Shipping tidy software, one pull request at a time.</p></article><article className="hero-note hero-note--yellow"><span className="section-eyebrow text-[#ee3729]">after hours</span><p>Pens, paper and a long list of things to try.</p></article></motion.div>
    </div>
  </section>;
}
