import { useEffect, useRef, useState } from "react";

// ---- Isometric bar chart geometry ----
// Each bar is drawn from a single height value so it can be animated by a
// rAF tween. Faces share exact corner points, so seams line up perfectly.
const BAR_W = 74; // front face width
const DEPTH_X = 34; // how far the depth goes to the right
const DEPTH_Y = 26; // how far the depth rises upward
const GAP = 46; // gap between bars
const BASELINE = 540; // y of the bottom of the bars
const LEFT = 24; // x of the first bar

const FRONT = "#072e29";
const SIDE = "#16897e";
const TOP = "#1ee8d6";

const EASE = "cubic-bezier(0.19,1,0.22,1)";

type Bar = {
  fullHeight: number;
  marker: number;
  statBold: string;
  statRest: string;
};

const bars: Bar[] = [
  {
    fullHeight: 190,
    marker: 1,
    statBold: "1 in 5 boys",
    statRest: "are abused before they turn 10 years",
  },
  {
    fullHeight: 320,
    marker: 2,
    statBold: "1 in 10 girls",
    statRest: "are abused before they turn 10 years",
  },
  {
    fullHeight: 450,
    marker: 3,
    statBold: "50% to 90%",
    statRest: "of rape cases go unreported",
  },
];

// Card dimensions (in viewBox units)
const CARD_W = 188;
const CARD_H = 66;

// viewBox extends left of the first bar so the cards have room to float,
// and is shorter than the baseline so the bar bases clip at the bottom.
const VB_MIN_X = -150;
const VB_W = 540;
const VB_H = 470;

function barX(index: number) {
  return LEFT + index * (BAR_W + GAP);
}

function barFaces(index: number, h: number) {
  const bx = barX(index);
  const by = BASELINE;
  const topY = by - h;
  const front = `${bx},${topY} ${bx + BAR_W},${topY} ${bx + BAR_W},${by} ${bx},${by}`;
  const side = `${bx + BAR_W},${topY} ${bx + BAR_W + DEPTH_X},${topY - DEPTH_Y} ${bx + BAR_W + DEPTH_X},${by - DEPTH_Y} ${bx + BAR_W},${by}`;
  const top = `${bx},${topY} ${bx + BAR_W},${topY} ${bx + BAR_W + DEPTH_X},${topY - DEPTH_Y} ${bx + DEPTH_X},${topY - DEPTH_Y}`;
  return { front, side, top };
}

export default function TheData() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState<number[]>([0, 0, 0]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [hovered, setHovered] = useState<number | null>(null);

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
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const runAnimation = () => {
    const DURATION = 850; // bar rise duration
    const STEP = DURATION; // next bar starts the instant the previous one lands
    const CARD_STAGGER = 420; // delay between cards revealing

    // Phase 1: bars rise strictly one at a time
    bars.forEach((bar, i) => {
      const start = performance.now() + i * STEP;
      const tick = (now: number) => {
        if (now < start) {
          requestAnimationFrame(tick);
          return;
        }
        const t = Math.min((now - start) / DURATION, 1);
        // easeInOutCubic - slow, smooth, sophisticated rise
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setHeights((prev) => {
          const next = [...prev];
          next[i] = bar.fullHeight * eased;
          return next;
        });
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    // Phase 2: after every bar has settled, reveal the cards one after another
    const allBarsDone = (bars.length - 1) * STEP + DURATION;
    bars.forEach((_, i) => {
      window.setTimeout(() => {
        setRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, allBarsDone + 120 + i * CARD_STAGGER);
    });
  };

  return (
    <section
      id="data"
      className="relative bg-[#0e3431] overflow-hidden min-h-[640px] sm:min-h-[760px] lg:min-h-[860px]"
    >
      <div
        ref={sectionRef}
        className="relative max-w-7xl mx-auto min-h-[inherit] px-6 sm:px-12 lg:px-20 py-[30px] lg:py-12"
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

        {/* Chart + cards + markers, anchored bottom-right, clipped at the bottom */}
        <svg
          viewBox={`${VB_MIN_X} 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMaxYMax meet"
          className="absolute bottom-0 right-0 w-[88%] sm:w-[78%] lg:w-[66%] max-w-3xl"
        >
          {bars.map((bar, i) => {
            const h = heights[i];
            if (h <= 0.5) return null;
            const f = barFaces(i, h);
            const bx = barX(i);
            const topY = BASELINE - h;

            // card sits to the upper-left of the bar top, overlapping it
            const cardRight = bx + 30;
            const cardLeft = cardRight - CARD_W;
            const cardTop = topY - 8 - CARD_H / 2;

            // number marker at the card's top-right corner, on the cap
            const markerCX = cardRight;
            const markerCY = cardTop + 10;

            const show = revealed[i];
            const isHovered = hovered === i;
            const dimmed = hovered !== null && hovered !== i;

            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  opacity: dimmed ? 0.82 : 1,
                  transition: `opacity 0.4s ${EASE}`,
                  cursor: "pointer",
                }}
              >
                {/* bar - lifts and glows on hover */}
                <g
                  style={{
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    transition: `transform 0.45s ${EASE}, filter 0.45s ${EASE}`,
                    filter: isHovered
                      ? "drop-shadow(0 10px 16px rgba(0,0,0,0.35))"
                      : "drop-shadow(0 0 0 rgba(0,0,0,0))",
                  }}
                >
                  <polygon points={f.front} fill={FRONT} />
                  <polygon points={f.side} fill={SIDE} />
                  <polygon points={f.top} fill={isHovered ? "#54ffef" : TOP} style={{ transition: `fill 0.4s ${EASE}` }} />
                </g>

                {/* card + marker, revealed after the bar rises; scales up on hover */}
                <g
                  style={{
                    opacity: show ? 1 : 0,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    transform: show
                      ? isHovered
                        ? "translateY(0) scale(1.05)"
                        : "translateY(0) scale(1)"
                      : "translateY(14px) scale(1)",
                    transition: `opacity 1s ${EASE}, transform 1s ${EASE}`,
                  }}
                >
                  <foreignObject x={cardLeft} y={cardTop} width={CARD_W} height={CARD_H}>
                    <div
                      // @ts-expect-error xmlns is valid on foreignObject HTML children
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        background: "#f1f1ee",
                        borderRadius: 12,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.30)",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "#0e3431",
                          fontSize: 14,
                          lineHeight: 1.3,
                          fontFamily: "'Manrope', system-ui, sans-serif",
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{bar.statBold}</span> {bar.statRest}
                      </p>
                    </div>
                  </foreignObject>

                  {/* number marker */}
                  <circle cx={markerCX} cy={markerCY} r={14} fill="#ffffff" />
                  <text
                    x={markerCX}
                    y={markerCY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill="#0e3431"
                    fontFamily="'Manrope', system-ui, sans-serif"
                  >
                    {bar.marker}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
