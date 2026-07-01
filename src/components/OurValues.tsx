import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const values = [
  {
    name: "Community",
    desc: "At Ìsinmi, we foster a supportive community of like-minded individuals dedicated to our cause. We aim to create an environment where survivors feel welcomed, supported, and at peace, like they've found a home among us.",
  },
  {
    name: "Inclusion",
    desc: "We are committed to inclusivity at Ìsinmi. There are no barriers or biases here; everyone is welcomed with open arms. Every issue related to sexual assault is significant to us, and we treat each one with the same level of importance and care.",
  },
  {
    name: "Empathy",
    desc: "Empathy lies at the heart of our mission. We understand and share the feelings of those impacted by sexual abuse. It drives our actions and dedication to providing compassionate support to survivors, ensuring they feel heard, understood, and supported.",
  },
  {
    name: "Sense of Responsibility",
    desc: "At Ìsinmi, creating a safe space for survivors is a collective effort. We believe everyone has a role to play, and we all bear the responsibility to contribute to this mission. It's about understanding that we each have a part to play in fostering a safer, more supportive environment for survivors.",
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
    <section id="values" className="bg-[#0e3431] py-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="value-item" data-delay="0">
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">
            <span className="text-[#2ee8d5]">/</span>{" "}
            <span className="text-[#2ee8d5]">Our Values</span>
          </span>
          <h2 className="mt-8 font-display text-white leading-[1.1] max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)]">
            The essence of <span className="text-[#2ee8d5]">Ìsinmi</span> revolves around these
            cherished values that form the very core of our mission.
          </h2>
        </div>

        {/* Values list (offset to the right on desktop) */}
        <div className="mt-12 lg:mt-16 lg:pl-[33%]">
          {values.map((val, i) => (
            <div
              key={val.name}
              className="value-item grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5 lg:gap-12 py-8 border-t border-white/15"
              data-delay={`${i * 90}`}
            >
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full border border-white/35 flex items-center justify-center text-white/70">
                  <ArrowRight size={16} strokeWidth={1.75} />
                </span>
                <h3 className="text-white text-lg sm:text-xl font-medium">{val.name}</h3>
              </div>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed font-light">
                {val.desc}
              </p>
            </div>
          ))}
          <div className="border-t border-white/15" />
        </div>
      </div>
    </section>
  );
}
