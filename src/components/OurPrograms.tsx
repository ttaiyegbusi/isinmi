import { useRef, useEffect } from "react";

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
      className="bg-[#0e3431] py-28 sm:py-36 lg:py-44 px-6 sm:px-12 lg:px-20"
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
        <div className="mt-20 lg:mt-28 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/15 border border-white/15 rounded-2xl overflow-hidden">
          {programs.map((p, i) => (
            <div
              key={p.name}
              className="program-item bg-[#0e3431] p-8 sm:p-10 lg:p-12"
              data-delay={`${i * 90}`}
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="flex-shrink-0 w-9 h-9 rounded-full border border-[#2ee8d5]/40 flex items-center justify-center text-[#2ee8d5] text-sm font-semibold">
                  {i + 1}
                </span>
                <h3 className="text-white text-xl sm:text-2xl font-medium">{p.name}</h3>
              </div>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed font-light">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
