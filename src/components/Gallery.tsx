import { Image as ImageIcon } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

// Placeholder tiles until real photos are supplied. `span` lets a few tiles
// occupy a larger cell for a gallery/mosaic feel.
const tiles = [
  { span: "md:row-span-2" },
  {},
  {},
  {},
  { span: "md:col-span-2" },
  {},
];

export default function Gallery() {
  const headerRef = useReveal<HTMLDivElement>();

  return (
    <section id="gallery" className="bg-white py-[100px] px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="mb-12 lg:mb-16">
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">
            <span className="text-[#1a4a47]">/</span>{" "}
            <span className="text-gray-900">Gallery</span>
          </span>
          <h2 className="mt-6 font-display text-gray-900 leading-[1.1] text-[clamp(2rem,4.2vw,3.25rem)] max-w-2xl">
            Moments from our <span className="text-[#1a4a47]">work</span> in the community.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4">
          {tiles.map((t, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/60 flex flex-col items-center justify-center gap-2 ${
                t.span || ""
              }`}
            >
              <ImageIcon className="text-gray-300" size={38} strokeWidth={1.25} />
              <span className="text-gray-400 text-xs tracking-[0.15em] uppercase">
                Photo coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
