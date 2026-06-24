import { useReveal } from "../hooks/useReveal";

const locations = [
  "Nigeria",
  "Uganda",
  "Rwanda",
  "Kenya",
  "Ethiopia",
  "Malawi",
  "Democratic Republic of Congo",
  "South Africa",
  "Ghana",
  "Burundi",
];

export default function OurReach() {
  const leftRef = useReveal(0);
  const rightRef = useReveal(150);

  return (
    <section id="reach" className="bg-[#f7f5f2] py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left */}
          <div ref={leftRef} className="space-y-8">
            <span className="text-[#1a4a47] text-xs tracking-[0.3em] font-medium uppercase">
              / Our Reach
            </span>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light max-w-md">
              We're daring enough to believe in creating a safe space for survivors and putting an
              end to sexual abuse across Africa. Over the next decade, our goal is to impact around
              51,000 survivors spanning ten countries.
            </p>

            {/* Featured image */}
            <div className="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=900&q=80&fit=crop"
                alt="Nigerian community"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right — location list */}
          <div ref={rightRef} className="pt-0 lg:pt-14">
            <ul className="space-y-0">
              {locations.map((loc, i) => (
                <li
                  key={loc}
                  className={`flex items-center gap-4 py-4 border-b border-gray-200/80 group cursor-default ${
                    i === 0 ? "border-t" : ""
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#1a4a47] flex-shrink-0 group-hover:scale-125 transition-transform duration-200" />
                  <span className="text-gray-800 text-base sm:text-lg font-medium group-hover:text-[#1a4a47] transition-colors duration-200">
                    {loc}
                  </span>
                  {i === 0 && (
                    <span className="ml-auto text-xs text-[#1a4a47] font-medium tracking-wide bg-[#1a4a47]/10 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
