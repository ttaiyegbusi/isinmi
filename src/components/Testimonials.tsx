import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

const CARD_STEP = 350; // card width + gap, used for arrow nudges

const testimonials = [
  {
    name: "Amara O.",
    role: "Survivor, Lagos",
    initials: "AO",
    color: "#2a7a74",
    quote:
      "Isinmi gave me back something I thought I had lost forever — my sense of safety. I was able to speak my truth in a space that truly held me with care.",
  },
  {
    name: "Fatima B.",
    role: "Community Member, Abuja",
    initials: "FB",
    color: "#1a4a47",
    quote:
      "I came here broken, unsure if healing was even possible for me. The community showed me it was. I am not just surviving anymore — I am living.",
  },
  {
    name: "Ngozi E.",
    role: "Advocate, Port Harcourt",
    initials: "NE",
    color: "#3d9e96",
    quote:
      "As a community advocate, I have seen firsthand how Isinmi's approach to education and peer support changes lives. This work is necessary and it is urgent.",
  },
  {
    name: "Chisom A.",
    role: "Survivor, Enugu",
    initials: "CA",
    color: "#0d5c58",
    quote: "The mentorship I received through Isinmi helped me navigate the legal process. I didn't have to do it alone, and that made all the difference.",
  },
  {
    name: "Halima S.",
    role: "Volunteer, Kano",
    initials: "HS",
    color: "#2a7a74",
    quote: "Isinmi is the safe space I wish existed when I was younger.",
  },
  {
    name: "Tobi A.",
    role: "Survivor, Ibadan",
    initials: "TA",
    color: "#1a4a47",
    quote:
      "For the first time, I felt heard without judgment. The people here meet you exactly where you are, and they walk with you for as long as it takes to feel whole again.",
  },
];

// duplicated for a seamless right-to-left loop
const loop = [...testimonials, ...testimonials];

export default function Testimonials() {
  const headerRef = useReveal<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const offset = useRef(0);
  const setWidth = useRef(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const nudge = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setWidth.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    document.fonts?.ready?.then(measure);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (Math.abs(nudge.current) > 0.5) {
        // smooth eased arrow nudge takes priority
        const step = nudge.current * 0.12;
        offset.current += step;
        nudge.current -= step;
      } else if (!paused.current && !dragging.current) {
        offset.current -= 0.045 * dt; // px per ms -> right-to-left drift
      }
      const w = setWidth.current;
      if (w > 0) {
        if (offset.current <= -w) offset.current += w;
        if (offset.current > 0) offset.current -= w;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offset.current}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offset.current;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    let next = dragStartOffset.current + (e.clientX - dragStartX.current);
    const w = setWidth.current;
    if (w > 0) {
      while (next <= -w) next += w;
      while (next > 0) next -= w;
    }
    offset.current = next;
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  // arrow nudge: next (1) drifts left, prev (-1) drifts right
  const go = (dir: 1 | -1) => {
    nudge.current += -dir * CARD_STEP;
  };

  return (
    <section id="testimonials" className="bg-white py-[100px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 mb-16">
        <div ref={headerRef} className="flex items-start justify-between gap-6">
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              <span className="text-[#1a4a47]">/</span>{" "}
              <span className="text-gray-900">Testimonials</span>
            </span>
            <h2 className="mt-5 font-display text-gray-900 leading-[1.1] max-w-md text-[clamp(1.9rem,4vw,3rem)]">
              Here is what people have to say about us.
            </h2>
          </div>

          <div className="flex gap-3 flex-shrink-0 pt-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full bg-[#1a4a47] text-white flex items-center justify-center transition-colors duration-200 hover:bg-[#1f5c58]"
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full bg-[#1a4a47] text-white flex items-center justify-center transition-colors duration-200 hover:bg-[#1f5c58]"
            >
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite, draggable marquee. Pauses on hover; cards size to content. */}
      <div
        className="cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => {
          paused.current = false;
          setHovered(null);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={trackRef} className="flex items-start gap-5 w-max will-change-transform">
          {loop.map((t, i) => {
            const isHovered = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                className={`flex-shrink-0 w-[300px] sm:w-[330px] rounded-2xl p-7 transition-colors duration-300 ${
                  isHovered
                    ? "bg-[#0e3431]"
                    : "bg-[#f4f6f5] border border-gray-100"
                }`}
              >
                <p
                  className={`text-sm sm:text-[15px] leading-relaxed font-light ${
                    isHovered ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 mt-8">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: isHovered ? "#3d9e96" : t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isHovered ? "text-white" : "text-gray-900"}`}>
                      {t.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${isHovered ? "text-white/60" : "text-gray-400"}`}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
