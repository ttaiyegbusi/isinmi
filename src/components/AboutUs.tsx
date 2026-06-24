import { useRef, useEffect } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)";
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function AboutUs() {
  const ref1 = useReveal();
  const ref2 = useReveal();
  const ref3 = useReveal();

  return (
    <section id="about" className="bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20 mb-20">
          <div ref={ref1}>
            <span className="text-xs tracking-[0.3em] text-[#1a4a47] font-medium uppercase">
              / About Us
            </span>
          </div>
          <div ref={ref2} className="space-y-6">
            <p className="text-gray-900 text-lg sm:text-xl leading-relaxed font-light max-w-2xl">
              <em>Isinmi</em> is a Yoruba word meaning <strong className="font-semibold text-[#1a4a47]">REST</strong>.
              We exist to provide rest, peace, and support for survivors of sexual abuse in
              Nigeria, by building a community that promotes healing, sanity, safety, education,
              and awareness.
            </p>
            <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
              Our long-term mission is to help eradicate sexual abuse in Nigeria and across Africa
              through education, advocacy, and community support. We believe every survivor deserves
              a safe space to heal, to be heard, and to rebuild.
            </p>
          </div>
        </div>

        {/* Image grid */}
        <div ref={ref3} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-2xl aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=80&fit=crop"
              alt="Peaceful ocean coastline"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div className="overflow-hidden rounded-2xl aspect-[4/3] sm:mt-10">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&fit=crop"
              alt="Calm shoreline"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
