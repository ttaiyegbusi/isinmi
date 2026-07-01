import { useRef, useEffect } from "react";

const SDG_GOALS = ["03", "04", "05", "10", "16", "17"];
const sdgUrl = (n: string) =>
  `https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${n}.jpg`;
const sdgLoop = [...SDG_GOALS, ...SDG_GOALS];

const programs = [
  {
    name: "School Outreaches",
    desc: "We partner with schools to equip children and young people with the knowledge and confidence to recognize, prevent, and report sexual abuse. Through interactive workshops, age-appropriate conversations, and Kíkọ́, our pilot educational game, we make learning engaging, memorable, and empowering.",
  },
  {
    name: "Trainings & Capacity Building",
    desc: "We train teachers, parents, caregivers, and community leaders to recognize the signs of abuse, respond appropriately, and create safer environments for children. Together, we're building communities that know how to protect and support.",
  },
  {
    name: "Peer Support",
    desc: "Healing shouldn't happen alone. We foster safe, survivor-centered spaces where individuals can connect, share experiences, and find strength through community and mutual support.",
  },
  {
    name: "Community Engagement",
    desc: "We believe protecting children also means supporting their overall well-being. Through community outreach initiatives, we provide essential items such as books, clothing, and menstrual hygiene products while creating opportunities to educate families and strengthen child protection within the community.",
  },
];

export default function OurPrograms() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".program-item");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const node = entry.target as HTMLElement;
            const delay = parseInt(node.dataset.delay || "0");
            setTimeout(() => {
              node.style.opacity = "1";
              node.style.transform = "translateY(0)";
            }, delay);
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => {
      const node = item as HTMLElement;
      node.style.opacity = "0";
      node.style.transform = "translateY(28px)";
      node.style.transition =
        "opacity 1.4s cubic-bezier(0.22,1,0.36,1), transform 1.4s cubic-bezier(0.22,1,0.36,1)";
      obs.observe(node);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="programs"
      className="bg-[#0e3431] py-[100px] px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="program-item" data-delay="0">
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">
            <span className="text-[#2ee8d5]">/</span>{" "}
            <span className="text-[#2ee8d5]">Our Programs</span>
          </span>
          <h2 className="mt-8 font-display text-white leading-[1.1] max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)]">
            How we <span className="text-[#2ee8d5]">protect children</span> and empower survivors,
            every single day.
          </h2>
        </div>

        {/* Programs grid */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {programs.map((p, i) => (
            <div
              key={p.name}
              className="program-item group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10 lg:p-12 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#2ee8d5]/40 hover:bg-white/[0.05]"
              data-delay={`${i * 90}`}
            >
              {/* big faded index watermark */}
              <span
                className="pointer-events-none absolute -top-6 right-2 font-display font-black text-white/[0.05] leading-none select-none"
                style={{ fontSize: "9rem" }}
              >
                {i + 1}
              </span>

              <div className="relative">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2ee8d5]">
                  Program {`0${i + 1}`}
                </span>
                <h3 className="mt-4 text-white text-xl sm:text-2xl lg:text-[1.7rem] font-medium leading-tight">
                  {p.name}
                </h3>
                <p className="mt-5 text-white/60 text-sm sm:text-base leading-relaxed font-light max-w-md">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SDG marquee — the goals these programs advance */}
        <div className="program-item mt-12 lg:mt-16" data-delay={`${programs.length * 90}`}>
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">
            <span className="text-[#2ee8d5]">/</span>{" "}
            <span className="text-[#2ee8d5]">The Goals We Advance</span>
          </span>
          <div className="sdg-marquee overflow-hidden mt-10">
            <div className="sdg-track">
              {sdgLoop.map((n, i) => (
                <div key={i} className="flex-shrink-0 px-4 sm:px-6">
                  <img
                    src={sdgUrl(n)}
                    alt={`Sustainable Development Goal ${parseInt(n, 10)}`}
                    loading="eager"
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover select-none pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
