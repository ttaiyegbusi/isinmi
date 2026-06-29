import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";

const EASE = "cubic-bezier(0.19,1,0.22,1)";

type Country = {
  name: string;
  image: string; // fixed Unsplash photo id (stable, never changes)
  blurb: string;
};

// One curated, recognisable image per country (city / landmark / culture).
// Fixed Unsplash photo ids — a given id always returns the exact same image.
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=560&q=80&auto=format&fit=crop`;

const countries: Country[] = [
  {
    name: "Nigeria",
    image: photo("1618828665011-0abd973f7bb8"),
    blurb:
      "Where Ìsinmi began. From Lagos to Abuja, we're building survivor hubs, training counsellors, and partnering with hospitals so that no one has to walk the road to healing alone.",
  },
  {
    name: "Uganda",
    image: photo("1557849582-5875ac6dee83"),
    blurb:
      "In Kampala and the districts around it, we work hand-in-hand with local advocates to open safe houses and fund trauma-informed care for survivors rebuilding their lives.",
  },
  {
    name: "Rwanda",
    image: photo("1687986261123-b17f08f2796c"),
    blurb:
      "Across Kigali, community-led healing circles are taking root — a model of reconciliation and resilience that helps survivors find strength in one another.",
  },
  {
    name: "Kenya",
    image: photo("1611348524140-53c9a25263d6"),
    blurb:
      "From Nairobi outward, we connect survivors to mental-health services, legal aid, and safe shelter, making sure justice and recovery move forward together.",
  },
  {
    name: "Ethiopia",
    image: photo("1572888195250-3037a59d3578"),
    blurb:
      "In Addis Ababa and the highlands beyond, we're growing peer-support networks rooted in faith, community, and the quiet dignity of rest.",
  },
  {
    name: "Malawi",
    image: photo("1612286710224-dd9eb9d8349a"),
    blurb:
      "Along the shores of Lake Malawi, our education-first programs reach rural communities, breaking the silence around abuse and equipping young people to protect one another.",
  },
  {
    name: "Democratic Republic of Congo",
    image: photo("1623930180584-1b14bc584169"),
    blurb:
      "In Kinshasa and conflict-affected regions, we reach survivors with refuge, medical care, and the steady reassurance that their lives still hold worth.",
  },
  {
    name: "South Africa",
    image: photo("1580060839134-75a5edca2e99"),
    blurb:
      "From Cape Town to Johannesburg, we scale advocacy, safe accommodation, and survivor employment programs across one of the continent's busiest corridors.",
  },
  {
    name: "Ghana",
    image: photo("1630386226447-af0a955c1009"),
    blurb:
      "In Accra and along the Cape Coast, we build awareness, mentorship, and survivor-led storytelling that turns stigma into solidarity.",
  },
  {
    name: "Burundi",
    image: photo("1672787076496-ccb18a869605"),
    blurb:
      "In Bujumbura, we're establishing our first outreach — listening, learning, and laying the foundations of a community where survivors can finally rest.",
  },
];

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
    countries.forEach((c) => {
      const img = new Image();
      img.src = c.image;
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
                        className="absolute right-[24rem] top-1/2 -translate-y-1/2 hidden md:block"
                        style={{ zIndex: 25 }}
                      >
                        <div
                          className="reach-pop2 rounded-lg overflow-hidden shadow-2xl shadow-black/40"
                          style={{ width: 200, height: 188 }}
                        >
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        </div>
                      </div>

                      <div
                        key={`txt-${c.name}`}
                        className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block max-w-xs"
                      >
                        <p className="reach-fade text-white/80 text-sm leading-relaxed">
                          {c.blurb}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Touch accordion panel: image + blurb stacked, revealed on tap */}
                {!canHover && (
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isActive ? 480 : 0,
                      opacity: isActive ? 1 : 0,
                      transition: `max-height 0.5s ${EASE}, opacity 0.4s ${EASE}`,
                    }}
                  >
                    <div className="pb-7">
                      <div className="rounded-xl overflow-hidden mb-4 aspect-[16/10]">
                        {isActive && (
                          <img
                            src={c.image}
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
