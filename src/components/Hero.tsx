import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import RippleVideo from "./RippleVideo";

const LETTERS = "ISINMI".split(""); // I S I N | M I
const SLOT_AT = 4; // image slot opens before this index (between "ISIN" and "MI")
const EASE = [0.19, 1, 0.22, 1] as const;

type Inset = { top: number; right: number; bottom: number; left: number; radius: number };

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Letter({ children, index }: { children: string; index: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: "0.28em" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.09 }}
    >
      {children}
    </motion.span>
  );
}

export default function Hero() {
  const [phase, setPhase] = useState<"letters" | "slot" | "expand" | "done">("letters");
  const [slotTarget, setSlotTarget] = useState(300);
  const slotRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [clip, setClip] = useState<Inset>(() => ({
    top: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    right: typeof window !== "undefined" ? window.innerWidth / 2 : 600,
    bottom: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    left: typeof window !== "undefined" ? window.innerWidth / 2 : 600,
    radius: 5,
  }));

  // intro timeline
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      window.dispatchEvent(new Event("intro:done"));
      return;
    }
    setSlotTarget(Math.min(300, window.innerWidth * 0.42));
    const t1 = setTimeout(() => setPhase("slot"), 1100);
    const t2 = setTimeout(() => setPhase("expand"), 1950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // while the slot grows, the clip-window tracks its exact on-screen rectangle
  useEffect(() => {
    if (phase === "expand" || phase === "done") return;
    let raf = 0;
    const tick = () => {
      const el = slotRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setClip({
          top: r.top,
          right: window.innerWidth - r.right,
          bottom: window.innerHeight - r.bottom,
          left: r.left,
          radius: 5,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // expansion: tween the clip-window from the slot rect out to fullscreen, opening
  // the hero's own RippleVideo. One element — expands once, becomes the hero.
  useEffect(() => {
    if (phase !== "expand") return;
    const r = slotRef.current?.getBoundingClientRect();
    const start: Inset = r
      ? {
          top: r.top,
          right: window.innerWidth - r.right,
          bottom: window.innerHeight - r.bottom,
          left: r.left,
          radius: 5,
        }
      : clip;
    const end: Inset = { top: 0, right: 0, bottom: 0, left: 0, radius: 0 };
    const DURATION = 1150;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / DURATION, 1);
      const e = easeInOutCubic(p);
      setClip({
        top: start.top + (end.top - start.top) * e,
        right: start.right + (end.right - start.right) * e,
        bottom: start.bottom + (end.bottom - start.bottom) * e,
        left: start.left + (end.left - start.left) * e,
        radius: start.radius + (end.radius - start.radius) * e,
      });
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        window.dispatchEvent(new Event("intro:done"));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const intro = phase !== "done";
  const clipPath =
    phase === "done"
      ? "none"
      : `inset(${clip.top}px ${clip.right}px ${clip.bottom}px ${clip.left}px round ${clip.radius}px)`;

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] overflow-hidden bg-[#122e2c]"
    >
      {/* Teal + typed wordmark (intro overlay). The transparent slot reserves the gap. */}
      {intro && (
        <motion.div
          className="absolute inset-0 z-10 bg-[#122e2c] flex items-center justify-center px-6"
          animate={{ opacity: phase === "expand" ? 0 : 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div
            className="flex items-center font-display font-black text-white leading-none select-none"
            style={{ fontSize: "clamp(3rem, 13vw, 9rem)", letterSpacing: "-0.01em" }}
          >
            {LETTERS.slice(0, SLOT_AT).map((ch, i) => (
              <Letter key={`a${i}`} index={i}>
                {ch}
              </Letter>
            ))}
            <motion.div
              ref={slotRef}
              className="self-center flex-shrink-0 mx-[0.08em]"
              style={{ height: "0.74em" }}
              initial={{ width: 0 }}
              animate={{ width: phase === "letters" ? 0 : slotTarget }}
              transition={{ duration: 0.6, ease: EASE }}
            />
            {LETTERS.slice(SLOT_AT).map((ch, i) => (
              <Letter key={`b${i}`} index={SLOT_AT + i}>
                {ch}
              </Letter>
            ))}
          </div>
        </motion.div>
      )}

      {/* The hero's single ocean background. During the intro it is clipped to the
          slot and expands to fullscreen; afterwards it is simply the hero background. */}
      <div className="absolute inset-0 z-20" style={{ clipPath }}>
        <RippleVideo
          src="/videos/hero-ocean.mp4"
          poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&q=85&fit=crop"
          textRefs={[headlineRef]}
          textVisible={phase === "done"}
        />
      </div>

      {/* Hero content. The wordmark + headline are kept invisible here (the shader
          draws them so the ripple distorts them); the arrow stays as crisp HTML. */}
      <div className="relative z-30 h-full pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1
            ref={headlineRef}
            className="font-display font-black text-white text-center uppercase leading-[0.95] text-[clamp(2.5rem,8vw,6rem)]"
            style={{ letterSpacing: "-0.01em", opacity: 0 }}
          >
            Protecting Children
            <br />
            Empowering Survivors
          </h1>
        </div>

        <a
          href="#about"
          aria-label="Scroll down"
          data-magnetic
          className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border border-white/50 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
          style={{
            opacity: phase === "done" ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.19,1,0.22,1)",
          }}
        >
          <ArrowDown size={18} strokeWidth={1.75} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
