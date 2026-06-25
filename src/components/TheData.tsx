import { useEffect, useRef, useState } from "react";

// ---- Isometric bar chart geometry ----
// Each bar is drawn from a single height value so it can be animated by a
// rAF tween. Faces share exact corner points, so seams line up perfectly.
const BAR_W = 74; // front face width
const DEPTH_X = 34; // how far the depth goes to the right
const DEPTH_Y = 26; // how far the depth rises upward
const GAP = 46; // gap between bars
const BASELINE = 540; // y of the bottom of the bars
const LEFT = 24; // left padding before first bar

const FRONT = "#072e29";
const SIDE = "#16897e";
const TOP = "#1ee8d6";

const fullHeights = [190, 320, 450];

const VB_W = LEFT * 2 + 3 * BAR_W + 2 * GAP + DEPTH_X;
// viewBox is shorter than the baseline so the bar bases run off the
// bottom edge (clipped) instead of free-hanging.
const VB_H = 470;

function barFaces(index: number, h: number) {
  const bx = LEFT + index * (BAR_W + GAP);
  const by = BASELINE;
  const topY = by - h;

  // front face (rectangle)
  const front = `${bx},${topY} ${bx + BAR_W},${topY} ${bx + BAR_W},${by} ${bx},${by}`;

  // side face (right parallelogram)
  const side = `${bx + BAR_W},${topY} ${bx + BAR_W + DEPTH_X},${topY - DEPTH_Y} ${bx + BAR_W + DEPTH_X},${by - DEPTH_Y} ${bx + BAR_W},${by}`;

  // top face (parallelogram cap)
  const top = `${bx},${topY} ${bx + BAR_W},${topY} ${bx + BAR_W + DEPTH_X},${topY - DEPTH_Y} ${bx + DEPTH_X},${topY - DEPTH_Y}`;

  return { front, side, top };
}

export default function TheData() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const runAnimation = () => {
    const DURATION = 900; // per bar
    const STAGGER = 450; // delay between bars starting

    fullHeights.forEach((target, i) => {
      const start = performance.now() + i * STAGGER;
      const tick = (now: number) => {
        if (now < start) {
          requestAnimationFrame(tick);
          return;
        }
        const t = Math.min((now - start) / DURATION, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setHeights((prev) => {
          const next = [...prev];
          next[i] = target * eased;
          return next;
        });
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  return (
    <section
      id="data"
      className="relative bg-[#0e3431] overflow-hidden min-h-[640px] sm:min-h-[760px] lg:min-h-[860px]"
    >
      <div
        ref={sectionRef}
        className="relative max-w-7xl mx-auto h-full min-h-[inherit] px-6 sm:px-12 lg:px-20 py-20 sm:py-28 lg:py-32"
      >
        {/* Label + copy, top-left */}
        <div className="relative z-10 max-w-xl">
          <span className="block mb-6 text-sm tracking-[0.2em] font-semibold uppercase">
            <span className="text-[#2ee8d5]">/</span> <span className="text-white">The Data</span>
          </span>
          <p className="text-white/90 text-lg sm:text-xl leading-relaxed font-light">
            In Nigeria, alarming statistics reveal that 1 in 10 girls and 1 in 5 boys are abused
            before they turn ten. Shockingly, 50% to 90% of rape cases go unreported, and during
            the lockdown, 3,600 rape cases were reported, with a mere 18–20 resulting in
            convictions — a major gap in justice.
          </p>
        </div>

        {/* Chart, anchored bottom-right and clipped at the section's bottom edge */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMax meet"
          className="absolute bottom-0 right-0 w-[62%] sm:w-[56%] lg:w-[52%] max-w-2xl"
        >
          {heights.map((h, i) => {
            if (h <= 0.5) return null;
            const f = barFaces(i, h);
            return (
              <g key={i}>
                <polygon points={f.front} fill={FRONT} />
                <polygon points={f.side} fill={SIDE} />
                <polygon points={f.top} fill={TOP} />
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
