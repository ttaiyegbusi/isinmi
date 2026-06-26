import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";

const EASE = "cubic-bezier(0.19,1,0.22,1)";

type Country = {
  name: string;
  query: string; // Unsplash keyword(s)
  blurb: string;
};

const countries: Country[] = [
  { name: "Nigeria", query: "Lagos,Nigeria", blurb: "Where Ìsinmi began — building survivor hubs across Lagos and beyond." },
  { name: "Uganda", query: "Kampala,Uganda", blurb: "Partnering with local advocates to open safe spaces in Kampala." },
  { name: "Rwanda", query: "Kigali,Rwanda", blurb: "Community-led healing circles taking root in Kigali." },
  { name: "Kenya", query: "Nairobi,Kenya", blurb: "Connecting survivors to mental health and legal support in Nairobi." },
  { name: "Ethiopia", query: "Addis-Ababa,Ethiopia", blurb: "Growing peer-support networks across Addis Ababa." },
  { name: "Malawi", query: "Malawi,Africa", blurb: "Education-first programs reaching rural communities." },
  { name: "Democratic Republic of Congo", query: "Kinshasa,Congo", blurb: "Reaching survivors in conflict-affected regions with care and refuge." },
  { name: "South Africa", query: "Cape-Town,South-Africa", blurb: "Scaling advocacy and accommodation support in Cape Town and Johannesburg." },
  { name: "Ghana", query: "Accra,Ghana", blurb: "Building awareness and mentorship pathways in Accra." },
  { name: "Burundi", query: "Bujumbura,Burundi", blurb: "Establishing our first survivor outreach in Bujumbura." },
];

// Keyword-based free image service. `lock` (index+1) pins each country to a
// single, stable image so it never changes between loads.
const imgUrl = (q: string, lock: number) =>
  `https://loremflickr.com/420/300/${q}?lock=${lock}`;

export default function OurReach() {
  const headerRef = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Preload every country image up front so they appear instantly on hover/tap.
  useEffect(() => {
    countries.forEach((c, i) => {
      const img = new Image();
      img.src = imgUrl(c.query, i + 1);
    });
  }, []);

  return (
    <section id="reach" className="bg-[#f7f9f8] py-28 sm:py-36 lg:py-44">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16 mb-20 lg:mb-28"
        >
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              <span className="text-[#1a4a47]">/</span>{" "}
              <span className="text-gray-900">Our Reach</span>
            </span>
          </div>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed font-light max-w-xl">
            We're daring enough to believe in creating a safe space for survivors and putting an
            end to sexual abuse across Africa. Over the next decade, our goal is to impact around
            10,000 survivors spanning ten countries:
          </p>
        </div>
      </div>

      {/* Full-bleed country list */}
      <ul className="border-t border-gray-200">
        {countries.map((c, i) => {
          const isActive = active === i;
          const hoverHandlers = canHover
            ? {
                onMouseEnter: () => setActive(i),
                onMouseLeave: () => setActive(null),
              }
            : {};
          return (
            <li
              key={c.name}
              {...hoverHandlers}
              onClick={canHover ? undefined : () => setActive(isActive ? null : i)}
              className="relative border-b border-gray-200 overflow-visible"
              style={{
                background: isActive ? "#0e3431" : "transparent",
                transition: `background 0.45s ${EASE}`,
                zIndex: isActive ? 20 : 1,
                cursor: canHover ? "default" : "pointer",
              }}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
                <div
                  className="relative flex items-center"
                  style={{
                    height: isActive && canHover ? 150 : 86,
                    transition: `height 0.45s ${EASE}`,
                  }}
                >
                  {/* + marker */}
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-base leading-none"
                    style={{
                      border: `1px solid ${isActive ? "rgba(255,255,255,0.5)" : "rgba(17,24,28,0.3)"}`,
                      color: isActive ? "#ffffff" : "#0e3431",
                      transition: `color 0.45s ${EASE}, border-color 0.45s ${EASE}`,
                      transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>

                  {/* country name */}
                  <span
                    className="ml-6 text-xl sm:text-2xl font-medium"
                    style={{
                      color: isActive ? "#ffffff" : "#15201e",
                      transition: `color 0.45s ${EASE}`,
                    }}
                  >
                    {c.name}
                  </span>

                  {/* Desktop hover panel: image (center) + blurb (right) */}
                  {canHover && isActive && (
                    <>
                      <div
                        key={`img-${c.name}`}
                        className="reach-pop absolute left-1/2 top-1/2 hidden md:block rounded-lg overflow-hidden shadow-2xl shadow-black/40"
                        style={{ width: 230, height: 215, zIndex: 25 }}
                      >
                        <img
                          src={imgUrl(c.query, i + 1)}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>

                      <p
                        key={`txt-${c.name}`}
                        className="reach-fade absolute right-0 hidden lg:block text-white/80 text-sm leading-relaxed max-w-xs"
                      >
                        {c.blurb}
                      </p>
                    </>
                  )}
                </div>

                {/* Touch accordion panel: image + blurb stacked, revealed on tap */}
                {!canHover && (
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isActive ? 360 : 0,
                      opacity: isActive ? 1 : 0,
                      transition: `max-height 0.5s ${EASE}, opacity 0.4s ${EASE}`,
                    }}
                  >
                    <div className="pb-7">
                      <div className="rounded-xl overflow-hidden mb-4 aspect-[16/10]">
                        {isActive && (
                          <img
                            src={imgUrl(c.query, i + 1)}
                            alt={c.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        )}
                      </div>
                      <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md">
                        {c.blurb}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
