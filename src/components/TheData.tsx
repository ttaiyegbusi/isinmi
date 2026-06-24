import { useRef, useEffect, useState } from "react";

const stats = [
  {
    height: "h-40",
    number: "1 in 10",
    label: "Girls are abused before they turn 18 years",
    delay: 0,
  },
  {
    height: "h-56",
    number: "1 in 5",
    label: "Boys are abused before they turn 18 years",
    delay: 150,
  },
  {
    height: "h-72",
    number: "52% to 55%",
    label: "Of Nigerian cases go unreported",
    delay: 300,
  },
  {
    height: "h-80",
    number: "18–20x",
    label: "More 18-to-20-year-olds convicted than 10-to-17-year-olds",
    delay: 450,
  },
];

function StatPillar({ stat, visible }: { stat: typeof stats[0]; visible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Floating card */}
      <div
        className="bg-white rounded-xl p-4 w-44 text-center shadow-lg shadow-black/20 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: `${stat.delay + 200}ms`,
        }}
      >
        <div className="text-[#1a4a47] font-display font-bold text-xl leading-tight mb-1">
          {stat.number}
        </div>
        <div className="text-gray-700 text-xs leading-tight">{stat.label}</div>
      </div>

      {/* Pillar */}
      <div
        className={`w-12 sm:w-14 rounded-t-xl bg-gradient-to-t from-[#0d2422] to-[#3d9e96] transition-all duration-1000 ease-out ${stat.height}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "bottom",
          transitionDelay: `${stat.delay}ms`,
        }}
      />
    </div>
  );
}

export default function TheData() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="data" className="bg-[#1a4a47] py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Label + copy */}
        <div className="mb-20">
          <span className="text-[#3d9e96] text-xs tracking-[0.3em] font-medium uppercase">
            / The Data
          </span>
          <p className="mt-6 text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
            In Nigeria, alarming statistics reveal that 1 in 10 girls and 1 in 5 boys are abused
            before they turn 18. Shockingly, 52% to 55% of rape cases go unreported, and during
            the lockdown, 3,655 rape cases were reported with a mere 18–20x resulting in
            convictions — a major gap in justice.
          </p>
        </div>

        {/* Pillars */}
        <div ref={ref} className="flex items-end justify-center gap-4 sm:gap-8 overflow-x-auto pb-4">
          {stats.map((stat, i) => (
            <StatPillar key={i} stat={stat} visible={visible} />
          ))}
        </div>

        {/* Floor line */}
        <div className="mt-0 h-px bg-gradient-to-r from-transparent via-[#3d9e96]/50 to-transparent" />
      </div>
    </section>
  );
}
