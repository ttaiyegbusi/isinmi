import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RippleVideo from "./RippleVideo";

const EASE = [0.19, 1, 0.22, 1] as const;

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<"hidden" | "intro" | "expanded">("hidden");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("intro"), 80);
    const t2 = setTimeout(() => setPhase("expanded"), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || phase !== "expanded") return;
    title.style.opacity = "0";
    title.style.transform = "translateY(40px)";
    const t = setTimeout(() => {
      title.style.transition = "opacity 1s cubic-bezier(0.19,1,0.22,1), transform 1s cubic-bezier(0.19,1,0.22,1)";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 500);
    return () => clearTimeout(t);
  }, [phase]);

  const expanded = phase === "expanded";
  const visible = phase !== "hidden";

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#122e2c]"
    >
      {/* Video is always full-bleed; only the visible clip region grows from a small
          centered box to the full screen, so the WebGL canvas never has to resize. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          clipPath: expanded
            ? "inset(0% 0% 0% 0% round 0px)"
            : "inset(38% 33% 38% 33% round 4px)",
          opacity: visible ? 1 : 0,
        }}
        transition={{
          clipPath: { duration: 0.9, ease: EASE },
          opacity: { duration: 0.5, ease: EASE },
        }}
      >
        <RippleVideo
          src="/videos/hero-ocean.mp4"
          poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&q=85&fit=crop"
        />
      </motion.div>

      {/* Overlay + vignette - fade in once expanded, for text legibility */}
      <motion.div
        className="absolute inset-0 bg-[#122e2c]/55 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      {/* Wordmark - appears after the video expands to full-bleed */}
      <div ref={titleRef} className="relative z-10 text-center px-4" style={{ opacity: 0 }}>
        <h1
          className="font-display text-[clamp(5rem,18vw,16rem)] font-black text-white leading-none select-none"
          style={{ letterSpacing: "-0.01em" }}
        >
          ÌSINMI
        </h1>
        <p className="mt-4 text-white/70 text-sm sm:text-base tracking-[0.25em] uppercase font-light">
          Rest · Healing · Refuge
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
