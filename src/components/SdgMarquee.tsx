const SDG_GOALS = ["03", "04", "05", "10", "16", "17"];
const sdgUrl = (n: string) =>
  `https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${n}.jpg`;

export default function SdgMarquee() {
  // Two copies of the list make the -50% scroll loop seamlessly.
  const loop = [...SDG_GOALS, ...SDG_GOALS];

  return (
    <section className="bg-white pb-24 sm:pb-28 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 mb-10">
        <span className="text-sm font-semibold tracking-[0.2em] uppercase">
          <span className="text-[#1a4a47]">/</span>{" "}
          <span className="text-gray-900">The Goals We Advance</span>
        </span>
      </div>

      <div className="sdg-marquee overflow-hidden">
        <div className="sdg-track">
          {loop.map((n, i) => (
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
    </section>
  );
}
