import { useRef, useEffect } from "react";

const values = [
  {
    symbol: "◉",
    name: "Community",
    desc: "We believe healing happens in togetherness. Isinmi is a space where survivors find belonging, solidarity, and the understanding that no one walks this road alone.",
  },
  {
    symbol: "◈",
    name: "Inclusion",
    desc: "Every survivor deserves to be seen and supported, regardless of gender, background, or circumstance. We open our arms wide, without judgment or condition.",
  },
  {
    symbol: "◎",
    name: "Empathy",
    desc: "We lead with compassion. We understand the depth of trauma caused by sexual abuse and approach every interaction with sensitivity, patience, and care.",
  },
  {
    symbol: "◇",
    name: "Sense of Responsibility",
    desc: "Sexual abuse is everyone's problem to solve. We take ownership of building a safer society and hold ourselves accountable to the survivors who place their trust in us.",
  },
];

export default function OurValues() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".value-item");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.delay || "0");
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => {
      const el = item as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)";
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="values" className="bg-[#1a4a47] py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="mb-16 value-item" data-delay="0">
          <span className="text-[#3d9e96] text-xs tracking-[0.3em] font-medium uppercase">
            / Our Values
          </span>
          <p className="mt-6 text-white/70 text-base sm:text-lg leading-relaxed font-light max-w-xl">
            The essence of{" "}
            <em className="text-white not-italic font-medium">Isinmi</em> revolves around these
            cherished values that form the very core of our mission.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {values.map((val, i) => (
            <div
              key={val.name}
              className="value-item bg-[#1a4a47] p-8 sm:p-10 hover:bg-[#1f5c58] transition-colors duration-300 group"
              data-delay={`${i * 100}`}
            >
              <div className="text-[#3d9e96] text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                {val.symbol}
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{val.name}</h3>
              <p className="text-white/60 text-sm leading-relaxed font-light">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
